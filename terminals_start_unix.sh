#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Open VS Code in the script's directory
code "$SCRIPT_DIR"

# Wait for VS Code to launch
sleep 3

# Open iTerm2 and run commands in three panes
osascript <<EOF
tell application "iTerm"
    activate
    set newWindow to (create window with default profile)
    
    tell current session of newWindow
        write text "cd '$SCRIPT_DIR/frontend' && npm i && npm run dev"
        
        # Split vertically
        delay 0.5
        set secondSession to (split horizontally with default profile)
    end tell

    tell secondSession
        write text "cd '$SCRIPT_DIR/backend' && npm i && npm run dev"
        
        # Split horizontally
        delay 0.5
        set thirdSession to (split vertically with default profile)
    end tell

    tell thirdSession
        write text "cd '$SCRIPT_DIR/backend' && npm run devAuth"
    end tell
end tell
EOF