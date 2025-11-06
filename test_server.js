const { spawn } = require('child_process');
const fs = require('fs');

const projectDir = 'C:\\Users\\d3m0n\\OneDrive\\Documents\\VS Code\\BrightFeed';
process.chdir(projectDir);

// Check if html-webpack-plugin loader exists
const loaderPath = './node_modules/html-webpack-plugin/lib/loader.js';
if (fs.existsSync(loaderPath)) {
  console.log('✓ html-webpack-plugin loader.js exists');
} else {
  console.log('✗ html-webpack-plugin loader.js NOT found');
}

// Check if react is installed
const reactPath = './node_modules/react/package.json';
if (fs.existsSync(reactPath)) {
  console.log('✓ react package installed');
} else {
  console.log('✗ react package NOT found');
}

// Start the server and capture first 50 lines
const proc = spawn('npm', ['start'], { 
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

let lineCount = 0;
const outputStream = proc.stdout;

outputStream.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line && lineCount < 50) {
      console.log(line);
      lineCount++;
    }
  });
  if (lineCount >= 50) {
    console.log('...(output truncated)');
    proc.kill();
  }
});

proc.stderr.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line && lineCount < 50) {
      console.log('ERROR:', line);
      lineCount++;
    }
  });
});

setTimeout(() => {
  proc.kill();
  process.exit(0);
}, 15000);
