// Configuration Manager Script
// This script helps manage Firebase configuration for development vs production

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/firebase.config.js');
const templatePath = path.join(__dirname, '../src/config/firebase.config.template.js');
const backupPath = path.join(__dirname, '../src/config/firebase.config.backup.js');

// Create backup of current config
function backupConfig() {
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
    console.log('✅ Configuration backed up successfully!');
  }
}

// Restore config from backup
function restoreConfig() {
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    console.log('✅ Configuration restored from backup!');
  } else {
    console.log('❌ No backup found!');
  }
}

// Replace with template (for security)
function secureConfig() {
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, configPath);
    console.log('✅ Configuration replaced with template for security!');
  }
}

// Command line interface
const command = process.argv[2];
switch(command) {
  case 'backup':
    backupConfig();
    break;
  case 'restore':
    restoreConfig();
    break;
  case 'secure':
    backupConfig();
    secureConfig();
    break;
  default:
    console.log('Available commands:');
    console.log('  backup  - Create backup of current config');
    console.log('  restore - Restore config from backup');
    console.log('  secure  - Backup current config and replace with template');
}