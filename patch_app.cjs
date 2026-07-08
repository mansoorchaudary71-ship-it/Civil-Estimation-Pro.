const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `import { ProjectProvider } from "./context/ProjectContext";`,
  `import { ProjectProvider } from "./context/ProjectContext";\nimport { useRecentTools } from "./hooks/useRecentTools";`
);

content = content.replace(
  `  const [activeModule, setActiveModule] = useState<ModuleId>("home");`,
  `  const [activeModule, setActiveModule] = useState<ModuleId>("home");\n  const { addRecentTool } = useRecentTools();`
);

content = content.replace(
  `  const handleSelectModule = (id: ModuleId) => {
    setPreviousModule(activeModule);
    setActiveModule(id);
    setIsSidebarOpen(false);
  };`,
  `  const handleSelectModule = (id: ModuleId) => {
    setPreviousModule(activeModule);
    setActiveModule(id);
    setIsSidebarOpen(false);
    
    // Track tools that are calculators/modules (not home or pages)
    if (id !== "home" && id !== "about" && id !== "careers" && id !== "contact" && id !== "blog" && id !== "pricing" && id !== "privacy" && id !== "terms" && id !== "cookies") {
      addRecentTool(id);
    }
  };`
);

fs.writeFileSync('src/App.tsx', content);
