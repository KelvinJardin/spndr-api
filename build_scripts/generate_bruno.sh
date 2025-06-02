#!/bin/bash

# Exit on error
set -e

# Function to handle errors
handle_error() {
    echo "Error occurred in script at line: $1"
    # Clean up temp directory if it exists
    [ -d "$TEMP_DIR" ] && rm -rf "$TEMP_DIR"
    exit 1
}

# Function to show usage
show_usage() {
    echo "Generate the bruno files from the auto generated openapi schema (overwrite|only new|only prune)"
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -n, --new    Create new files (skip existing)"
    echo "  -p, --prune    Delete files not present in new generation"
    echo "  -h, --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --new              # Only add new files"
    echo "  $0 --prune              # Only delete outdated files"
    echo "  $0 --new --prune     # Both add new and delete outdated files"
}

# Set up error handling
trap 'handle_error $LINENO' ERR

# Default values
CREATE=false
DELETE=false

# Parse command line argumentsq
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--new)
            CREATE=true
            shift
            ;;
        -p|--prune)
            DELETE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Set paths
PROJECT_NAME="fundflow-api"
TEMP_DIR="docs/bruno-temp"
BRUNO_DIR="docs/bruno"
OPENAPI_SOURCE="docs/openapi.json"

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "Error: npx is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if OpenAPI source exists
if [ ! -f "$OPENAPI_SOURCE" ]; then
    echo "Error: OpenAPI specification file not found at $OPENAPI_SOURCE"
    exit 1
fi

# Create temp directory
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"

# Import to temp directory using project's local bruno CLI
echo "Importing OpenAPI spec to temp directory..."
npx bru import openapi --source "$OPENAPI_SOURCE" --output "$TEMP_DIR"

if [ $? -ne 0 ]; then
    echo "Error: Failed to import OpenAPI spec"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Create bruno directory if it doesn't exist
mkdir -p "$BRUNO_DIR"

# If bruno/environments folder exists make a backup to restore later
if [ -d "$BRUNO_DIR/$PROJECT_NAME/environments" ]; then
    echo "Backing up existing bruno environments..."
    mv "$BRUNO_DIR/$PROJECT_NAME/environments" "docs/environments.bak"
fi

if [[ "$CREATE" == "true" ]]; then
    if [[ "$DELETE" == "true" ]]; then
        echo "Removing files not present in new generation..."
        # Create a list of files in temp dir
        find "$TEMP_DIR/$PROJECT_NAME" -type f > "$TEMP_DIR/$PROJECT_NAME/files.txt"

        # Check each file in bruno dir
        while IFS= read -r -d '' file; do
            # Get relative path
            rel_path=${file#"$BRUNO_DIR/"}
            # Check if file exists in temp dir
            if [ ! -f "$TEMP_DIR/$PROJECT_NAME/$rel_path" ]; then
                echo "Removing: $rel_path"
                rm "$file"
            fi
        done < <(find "$BRUNO_DIR" -type f -print0)

        # Clean up empty directories
        find "$BRUNO_DIR" -type d -empty -delete
    fi

    echo "Adding new bruno files (skipping existing ones)..."
    cp -rn "$TEMP_DIR/$PROJECT_NAME"/* "$BRUNO_DIR"/
else
    echo "Overwriting all bruno files"
    rm -rf "$BRUNO_DIR"
    mv "$TEMP_DIR/$PROJECT_NAME" "$BRUNO_DIR"
fi

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Restore bruno environment folder if exists
if [ -d "docs/environments.bak" ]; then
    echo "Restoring bruno environments from backup..."
    mv "docs/environments.bak" "$BRUNO_DIR/$PROJECT_NAME/environments"
fi
