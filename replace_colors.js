const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/app/dashboard/inicio/reports');

const replacements = [
  // Primary Pink (#b76e79)
  { regex: /#(C07E88|D4A5A5|E8C2C7)/gi, replace: '#b76e79' },
  
  // Secondary Slate Gray (#708090)
  { regex: /#(758390|8A94A6|8C9796|A0AEC0|64748B|718096|94A3B8|CBD5E0|6b7a88)/gi, replace: '#708090' },
  
  // Dark Text / Background (#2d3748)
  { regex: /#(2A2E34|1C1C1C|4B5563|4A5568|111111)/gi, replace: '#2d3748' },
  
  // Beige Background (#f6f4ef)
  { regex: /#(F0EDE8|F8F6F2|E8E5E0|F6F3EF|FAFAF8|F7F4F0|F8FAFC|F7FAFC|F0F2F5|FAFAFA|F0F0F0|FFF9E6)/gi, replace: '#f6f4ef' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('FinancialSummary.tsx') && !fullPath.includes('ReportFilters.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rule of replacements) {
        if (rule.regex.test(content)) {
          content = content.replace(rule.regex, rule.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in: ${path.basename(fullPath)}`);
      }
    }
  }
}

processDirectory(targetDir);
console.log('Color replacement complete.');
