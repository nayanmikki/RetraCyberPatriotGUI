#!/bin/bash

# CyberPatriot Mint 21 Console Installer
# This script installs all dependencies and launches the GUI

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo "CyberPatriot Mint 21 Console Setup"
echo -e "========================================${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root (for system operations later)
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root. This is okay, but the app can run as a regular user too."
fi

# Step 1: Check and install Node.js
print_info "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Installing Node.js..."
    
    # Update package list
    sudo apt update
    
    # Install curl if not present
    if ! command -v curl &> /dev/null; then
        print_info "Installing curl..."
        sudo apt install -y curl
    fi
    
    # Install Node.js 20.x (LTS)
    print_info "Adding NodeSource repository..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    
    print_info "Installing Node.js..."
    sudo apt install -y nodejs
    
    print_success "Node.js installed successfully!"
else
    print_success "Node.js is already installed: $(node --version)"
fi

# Step 2: Check npm
print_info "Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
else
    print_success "npm version: $(npm --version)"
fi

# Step 3: Install build essentials (needed for some npm packages)
print_info "Checking for build essentials..."
if ! dpkg -l | grep -q build-essential; then
    print_info "Installing build-essential..."
    sudo apt install -y build-essential
fi

# Step 4: Navigate to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_info "Working directory: $SCRIPT_DIR"
echo ""

# Step 5: Install npm dependencies
if [ ! -d "node_modules" ]; then
    print_info "Installing Node.js dependencies..."
    echo "This may take a few minutes..."
    echo ""
    
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies!"
        exit 1
    fi
else
    print_info "Dependencies already installed."
    print_warning "Run 'npm install' manually if you need to update packages."
fi

echo ""
print_success "Setup complete!"
echo ""

# Step 6: Launch the application
print_info "Starting CyberPatriot Mint 21 Console..."
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}The GUI will be available at:${NC}"
echo -e "${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}Opening in your default browser...${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Wait a moment then open browser
(sleep 3 && xdg-open http://localhost:3000 2>/dev/null &)

# Start the development server
npm run dev

