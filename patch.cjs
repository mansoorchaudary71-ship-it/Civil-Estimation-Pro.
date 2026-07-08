const fs = require('fs');
const content = fs.readFileSync('src/components/ToolCard.tsx', 'utf8');
const lines = content.split('\n');
lines.splice(94, 15,
  '      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">',
  '        <div className="flex items-start justify-between">',
  '          <motion.div ',
  '             animate={{ scale: hov ? 1.1 : 1, rotate: hov ? [0, -5, 5, 0] : 0 }}',
  '             transition={{ duration: 0.4, ease: "easeOut" }}',
  '             className="text-slate-800"',
  '          >',
  '            <IconComponent size={32} strokeWidth={1.5} />',
  '          </motion.div>'
);
fs.writeFileSync('src/components/ToolCard.tsx', lines.join('\n'));
