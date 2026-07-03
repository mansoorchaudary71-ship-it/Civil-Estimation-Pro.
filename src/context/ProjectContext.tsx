import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export interface ProjectEstimate {
  id: string;
  projectId: string;
  toolId: string;
  name: string;
  cost: number;
  materials: Record<string, { quantity: number; unit: string }>;
  date: string;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  startDate: string;
  budget?: number;
  ownerId: string;
  memberIds: string[];
  roles: Record<string, 'owner' | 'editor' | 'viewer'>;
  memberEmails?: Record<string, string>;
  estimates: ProjectEstimate[];
  createdAt: number;
  updatedAt: number;
}

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Omit<Project, 'id' | 'estimates' | 'ownerId' | 'memberIds' | 'roles' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, data: Partial<Omit<Project, 'id' | 'estimates' | 'ownerId' | 'createdAt'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveVersion: (projectId: string, versionName: string) => Promise<void>;
  addEstimateToProject: (projectId: string, estimate: Omit<ProjectEstimate, 'id' | 'projectId' | 'date' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteEstimate: (projectId: string, estimateId: string) => Promise<void>;
  addMember: (projectId: string, email: string, role: 'editor' | 'viewer') => Promise<void>;
  removeMember: (projectId: string, userId: string) => Promise<void>;
  canEditProject: (projectId: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const active = localStorage.getItem('civil_active_project');
    if (active) {
      setActiveProjectId(active);
    }
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('civil_active_project', activeProjectId);
    } else {
      localStorage.removeItem('civil_active_project');
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }

    const q = query(collection(db, 'projects'), where('memberIds', 'array-contains', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs: Omit<Project, 'estimates'>[] = [];
      snapshot.forEach((docSnap) => {
        projs.push({ id: docSnap.id, ...docSnap.data() } as Omit<Project, 'estimates'>);
      });

      // Now fetch estimates for all projects
      Promise.all(projs.map(async (p) => {
        try {
          const estRef = collection(db, `projects/${p.id}/estimates`);
          const estSnap = await getDocs(estRef);
          const estimates: ProjectEstimate[] = [];
          estSnap.forEach((e) => estimates.push({ id: e.id, ...e.data() } as ProjectEstimate));
          return { ...p, estimates };
        } catch (error) {
          console.error("Error fetching estimates for project", p.id, error);
          return { ...p, estimates: [] };
        }
      })).then((fullProjects) => {
        setProjects(fullProjects);
      }).catch(err => {
        handleFirestoreError(err, OperationType.GET, 'projects/estimates');
      });
      
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    return () => unsubscribe();
  }, [user]);

  const addProject = async (data: Omit<Project, 'id' | 'estimates' | 'ownerId' | 'memberIds' | 'roles' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const newProjectId = doc(collection(db, 'projects')).id;
    const now = Date.now();
    const newProject = {
      ...data,
      ownerId: user.uid,
      memberIds: [user.uid],
      roles: { [user.uid]: 'owner' },
      memberEmails: { [user.uid]: user.email || '' },
      createdAt: now,
      updatedAt: now
    };
    try {
      await setDoc(doc(db, 'projects', newProjectId), newProject);
      if (!activeProjectId) setActiveProjectId(newProjectId);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const updateProject = async (id: string, data: Partial<Omit<Project, 'id' | 'estimates' | 'ownerId' | 'createdAt'>>) => {
    try {
      await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: Date.now() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      if (activeProjectId === id) setActiveProjectId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const saveVersion = async (projectId: string, versionName: string) => {
    if (!user) return;
    const projectToClone = projects.find(p => p.id === projectId);
    if (!projectToClone) return;

    try {
      const newProjectId = doc(collection(db, 'projects')).id;
      const now = Date.now();
      
      const newProject = {
        name: versionName,
        location: projectToClone.location,
        type: projectToClone.type,
        startDate: projectToClone.startDate,
        budget: projectToClone.budget,
        ownerId: user.uid,
        memberIds: [user.uid],
        roles: { [user.uid]: 'owner' },
        memberEmails: { [user.uid]: user.email || '' },
        createdAt: now,
        updatedAt: now
      };
      
      await setDoc(doc(db, 'projects', newProjectId), newProject);
      
      // Clone all estimates
      for (const est of projectToClone.estimates) {
        const newEstId = doc(collection(db, `projects/${newProjectId}/estimates`)).id;
        const newEst = {
          projectId: newProjectId,
          toolId: est.toolId,
          name: est.name,
          cost: est.cost,
          materials: est.materials || {},
          date: new Date().toISOString(),
          category: est.category,
          createdAt: now,
          updatedAt: now
        };
        await setDoc(doc(db, `projects/${newProjectId}/estimates`, newEstId), newEst);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const addEstimateToProject = async (projectId: string, estimate: Omit<ProjectEstimate, 'id' | 'projectId' | 'date' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEstId = doc(collection(db, `projects/${projectId}/estimates`)).id;
      const now = Date.now();
      const newEst = {
        ...estimate,
        projectId,
        date: new Date().toISOString(),
        createdAt: now,
        updatedAt: now
      };
      await setDoc(doc(db, `projects/${projectId}/estimates`, newEstId), newEst);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `projects/${projectId}/estimates`);
    }
  };

  const deleteEstimate = async (projectId: string, estimateId: string) => {
    try {
      await deleteDoc(doc(db, `projects/${projectId}/estimates`, estimateId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}/estimates/${estimateId}`);
    }
  };

  const addMember = async (projectId: string, email: string, role: 'editor' | 'viewer') => {
    try {
      // Find user by email. Note: In a real app, this should be done via a cloud function for security,
      // but we will query the users collection here.
      const usersQuery = query(collection(db, 'users'), where('email', '==', email));
      const usersSnap = await getDocs(usersQuery);
      if (usersSnap.empty) {
        throw new Error("User with that email not found");
      }
      const targetUserId = usersSnap.docs[0].id;
      const targetEmail = usersSnap.docs[0].data().email;
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");
      
      const newMemberIds = [...new Set([...project.memberIds, targetUserId])];
      const newRoles = { ...project.roles, [targetUserId]: role };
      const newEmails = { ...(project.memberEmails || {}), [targetUserId]: targetEmail };
      
      await updateDoc(doc(db, 'projects', projectId), { memberIds: newMemberIds, roles: newRoles, memberEmails: newEmails, updatedAt: Date.now() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
      throw error;
    }
  };

  const removeMember = async (projectId: string, userId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");
      if (userId === project.ownerId) throw new Error("Cannot remove owner");
      
      const newMemberIds = project.memberIds.filter(id => id !== userId);
      const newRoles = { ...project.roles };
      delete newRoles[userId];
      const newEmails = { ...(project.memberEmails || {}) };
      delete newEmails[userId];
      
      await updateDoc(doc(db, 'projects', projectId), { memberIds: newMemberIds, roles: newRoles, memberEmails: newEmails, updatedAt: Date.now() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
      throw error;
    }
  };

  const canEditProject = (projectId: string) => {
    if (!user) return false;
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;
    const role = project.roles[user.uid];
    return role === 'owner' || role === 'editor';
  };

  return (
    <ProjectContext.Provider value={{
      projects, activeProjectId, setActiveProjectId,
      addProject, updateProject, deleteProject, saveVersion,
      addEstimateToProject, deleteEstimate, addMember, removeMember,
      canEditProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
}
