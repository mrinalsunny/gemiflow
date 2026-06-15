# GemiFlow V3 Helper System Installation Guide

This guide covers installing the V3 helper system across all supported platforms.

## 🚀 Quick Installation

### For New Projects
```bash
# Copy the entire helper system to your project
cp -r /path/to/gemiflow/v3/helpers/ your-project/.gemiflow/helpers/

# Make scripts executable (Linux/macOS)
chmod +x your-project/.gemiflow/helpers/*.sh
chmod +x your-project/.gemiflow/helpers/templates/*.sh
```

### For Existing Projects
```bash
# Navigate to your project
cd your-existing-project

# Create Claude directory structure
mkdir -p .gemiflow/helpers

# Copy helpers
cp -r /path/to/gemiflow/v3/helpers/* .gemiflow/helpers/

# Initialize
./.gemiflow/helpers/gemiflow-v3.sh init
```

## 🌍 Platform-Specific Setup

### Linux (Ubuntu/Debian/CentOS)

#### Prerequisites
```bash
# Install required tools
sudo apt update
sudo apt install git jq curl nodejs npm

# For CentOS/RHEL
sudo yum install git jq curl nodejs npm
```

#### Installation
```bash
# Copy helpers
cp -r v3/helpers/ .gemiflow/helpers/

# Make executable
chmod +x .gemiflow/helpers/*.sh .gemiflow/helpers/templates/*.sh

# Initialize project
./.gemiflow/helpers/gemiflow-v3.sh init

# Validate setup
./.gemiflow/helpers/gemiflow-v3.sh validate
```

### macOS

#### Prerequisites
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install git jq node
```

#### Installation
```bash
# Copy helpers
cp -r v3/helpers/ .gemiflow/helpers/

# Make executable
chmod +x .gemiflow/helpers/*.sh .gemiflow/helpers/templates/*.sh

# Initialize project
./.gemiflow/helpers/gemiflow-v3.sh init

# Validate setup
./.gemiflow/helpers/gemiflow-v3.sh validate
```

### Windows

#### Prerequisites
```powershell
# Install Git for Windows (includes Git Bash)
# Download from: https://git-scm.com/download/win

# Install Node.js
# Download from: https://nodejs.org/

# Install PowerShell 7+ (recommended)
winget install Microsoft.PowerShell

# Verify PowerShell execution policy
Get-ExecutionPolicy -List
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Installation (PowerShell)
```powershell
# Copy helpers
Copy-Item -Recurse -Path "v3\helpers\*" -Destination ".claude\helpers\"

# Initialize project
.\.claude\helpers\gemiflow-v3.ps1 init

# Validate setup
.\.claude\helpers\gemiflow-v3.ps1 validate
```

#### Installation (Git Bash/WSL)
```bash
# Copy helpers
cp -r v3/helpers/ .gemiflow/helpers/

# Make executable
chmod +x .gemiflow/helpers/*.sh .gemiflow/helpers/templates/*.sh

# Initialize project
./.gemiflow/helpers/gemiflow-v3.sh init
```

## 📋 Configuration

### Settings.json Integration
Add to your `.gemiflow/settings.json`:

```json
{
  "helpers": {
    "directory": ".gemiflow/helpers",
    "enabled": true,
    "platform": "auto-detect",
    "scripts": {
      "master": ".gemiflow/helpers/gemiflow-v3",
      "progressManager": ".gemiflow/helpers/templates/progress-manager",
      "statusDisplay": ".gemiflow/helpers/templates/status-display",
      "configValidator": ".gemiflow/helpers/templates/config-validator"
    }
  },
  "v3Configuration": {
    "domains": {
      "total": 5,
      "names": ["task-management", "session-management", "health-monitoring", "lifecycle-management", "event-coordination"],
      "sourceDir": "src/domains"
    },
    "swarm": {
      "totalAgents": 15,
      "topology": "hierarchical-mesh",
      "coordination": "queen-led"
    }
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "timeout": 3000,
            "command": ".gemiflow/helpers/templates/checkpoint-manager auto-checkpoint \"File edit: $TOOL_INPUT_file_path\""
          }
        ]
      }
    ]
  }
}
```

### Environment Variables (Optional)
```bash
# Linux/macOS
export GEMIFLOW_V3_MODE=enabled
export GEMIFLOW_HELPERS_DIR=.gemiflow/helpers
export GEMIFLOW_PLATFORM=auto

# Windows (PowerShell)
$env:GEMIFLOW_V3_MODE = "enabled"
$env:GEMIFLOW_HELPERS_DIR = ".claude\helpers"
$env:GEMIFLOW_PLATFORM = "auto"
```

## 🔧 Post-Installation Verification

### Basic Functionality Test
```bash
# Linux/macOS
./.gemiflow/helpers/gemiflow-v3.sh platform-info
./.gemiflow/helpers/gemiflow-v3.sh status

# Windows
.\.claude\helpers\gemiflow-v3.ps1 platform-info
.\.claude\helpers\gemiflow-v3.ps1 status
```

### Full Validation
```bash
# Run comprehensive validation
./.gemiflow/helpers/gemiflow-v3.sh validate

# Expected output: "All checks passed! V3 development environment is ready."
```

## 🛠️ Customization

### Adding Custom Helpers
1. Create your custom helper in `.gemiflow/helpers/custom/`
2. Follow the naming convention: `custom-helper-name.sh/.ps1`
3. Add to settings.json configuration
4. Test across platforms

Example custom helper:
```bash
#!/bin/bash
# .gemiflow/helpers/custom/my-custom-helper.sh

echo "Custom helper for my specific workflow"
# Your custom logic here
```

### Hook Integration
Add custom hooks to automate your workflow:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": ".gemiflow/helpers/custom/pre-task-validation.sh \"$TOOL_INPUT_prompt\""
          }
        ]
      }
    ]
  }
}
```

## ❗ Troubleshooting

### Permission Issues (Linux/macOS)
```bash
# Fix permission issues
find .gemiflow/helpers -name "*.sh" -exec chmod +x {} \;
```

### Windows PowerShell Execution Policy
```powershell
# Check current policy
Get-ExecutionPolicy

# Allow local script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# For corporate environments
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Path Issues
```bash
# Verify helper paths
ls -la .gemiflow/helpers/
./.gemiflow/helpers/gemiflow-v3.sh platform-info

# Add helpers to PATH (optional)
export PATH="$PATH:$(pwd)/.gemiflow/helpers"
```

### Missing Dependencies
```bash
# Install missing tools
## Ubuntu/Debian
sudo apt install git jq nodejs npm

## macOS
brew install git jq node

## Windows (using chocolatey)
choco install git jq nodejs
```

## 🔄 Updates

### Updating Helpers
```bash
# Backup current helpers
cp -r .gemiflow/helpers .gemiflow/helpers.backup

# Copy new helpers
cp -r /path/to/new/v3/helpers/* .gemiflow/helpers/

# Re-initialize
./.gemiflow/helpers/gemiflow-v3.sh init
```

### Version Management
```bash
# Check helper version
./.gemiflow/helpers/gemiflow-v3.sh --version

# View changelog
cat .gemiflow/helpers/CHANGELOG.md
```

---

*Installation complete! Your V3 helper system is ready for cross-platform development automation.*