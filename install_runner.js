const { execSync } = require('child_process');
const path = require('path');

const projectDir = 'C:\\Users\\d3m0n\\OneDrive\\Documents\\VS Code\\BrightFeed';
process.chdir(projectDir);

try {
  console.log('Starting npm install...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('npm install completed successfully');
} catch (err) {
  console.error('npm install failed:', err.message);
  process.exit(1);
}
