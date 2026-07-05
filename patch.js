const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = ` const toolsInGroup = groupedModules[groupName];
 if (!toolsInGroup || toolsInGroup.length === 0) return null;
 return (
 <div key={groupName} className={"relative w-full flex flex-col py-16 md:py-24 border-t border-white/60 overflow-hidden " + (index % 3 === 0 ? 'bg-[#E6DFCD]' : index % 3 === 1 ? 'bg-[#D6E3F9]' : 'bg-[#D5E5DA]')}>`;

const target1 = ` const toolsInGroup = groupedModules[groupName];
  if (!toolsInGroup || toolsInGroup.length === 0) return null;
  return (
  <div key={groupName} className={"relative w-full flex flex-col py-16 md:py-24 border-t border-white/60 overflow-hidden " + (index % 3 === 0 ? 'bg-[#E6DFCD]' : index % 3 === 1 ? 'bg-[#D6E3F9]' : 'bg-[#D5E5DA]')}>`;

const replacement = ` const toolsInGroup = groupedModules[groupName];
 if (!toolsInGroup || toolsInGroup.length === 0) return null;
 const allCats = Array.from(new Set(ALL_MODULES.map(m => m.category)));
 const stableIndex = allCats.indexOf(groupName);
 const safeIndex = stableIndex === -1 ? 0 : stableIndex;
 const sectionBg = safeIndex % 3 === 0 ? 'bg-[#E6DFCD]' : safeIndex % 3 === 1 ? 'bg-[#D6E3F9]' : 'bg-[#D5E5DA]';
 const catColor = safeIndex % 3 === 0 ? '#E6DFCD' : safeIndex % 3 === 1 ? '#D6E3F9' : '#D5E5DA';
 return (
 <div key={groupName} className={\`relative w-full flex flex-col py-16 md:py-24 border-t border-white/60 overflow-hidden \${sectionBg}\`}>`;

code = code.split(target).join(replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
