#!/bin/bash

# Generate favicon.ico from any image file
# Usage: ./scripts/generate-favicon.sh <input-image> [output-directory]

set -e

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <input-image> [output-directory]"
    echo "Example: $0 public/favicon.png"
    echo "Example: $0 assets/logo.png public/"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_DIR="${2:-public/}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

# Check if output directory exists, create if not
if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

# Check if sips command is available (macOS)
if command -v sips >/dev/null 2>&1; then
    echo "Using sips (macOS) to generate favicon files..."
    
    # Generate different sizes
    sips -z 16 16 "$INPUT_FILE" --out "${OUTPUT_DIR}favicon-16x16.png"
    sips -z 32 32 "$INPUT_FILE" --out "${OUTPUT_DIR}favicon-32x32.png"
    sips -z 180 180 "$INPUT_FILE" --out "${OUTPUT_DIR}apple-touch-icon.png"
    
    # Copy original as main favicon
    cp "$INPUT_FILE" "${OUTPUT_DIR}favicon.png"
    
    # Also copy to src/app/ for Next.js
    cp "${OUTPUT_DIR}favicon-32x32.png" "src/app/favicon.ico"
    
    echo "✅ Favicon files generated successfully!"
    echo "   - ${OUTPUT_DIR}favicon.png (original)"
    echo "   - ${OUTPUT_DIR}favicon-16x16.png"
    echo "   - ${OUTPUT_DIR}favicon-32x32.png"
    echo "   - ${OUTPUT_DIR}apple-touch-icon.png"
    echo "   - src/app/favicon.ico"

# Check if ImageMagick convert is available
elif command -v convert >/dev/null 2>&1; then
    echo "Using ImageMagick to generate favicon files..."
    
    # Generate different sizes and create ICO file
    convert "$INPUT_FILE" -resize 16x16 "${OUTPUT_DIR}favicon-16x16.png"
    convert "$INPUT_FILE" -resize 32x32 "${OUTPUT_DIR}favicon-32x32.png"
    convert "$INPUT_FILE" -resize 180x180 "${OUTPUT_DIR}apple-touch-icon.png"
    
    # Create multi-size ICO file
    convert "$INPUT_FILE" \( -clone 0 -resize 16x16 \) \( -clone 0 -resize 32x32 \) \( -clone 0 -resize 48x48 \) -delete 0 "${OUTPUT_DIR}favicon.ico"
    
    # Copy original as main favicon
    cp "$INPUT_FILE" "${OUTPUT_DIR}favicon.png"
    
    # Copy ICO to src/app/
    cp "${OUTPUT_DIR}favicon.ico" "src/app/favicon.ico"
    
    echo "✅ Favicon files generated successfully!"
    echo "   - ${OUTPUT_DIR}favicon.png (original)"
    echo "   - ${OUTPUT_DIR}favicon-16x16.png"
    echo "   - ${OUTPUT_DIR}favicon-32x32.png"
    echo "   - ${OUTPUT_DIR}apple-touch-icon.png"
    echo "   - ${OUTPUT_DIR}favicon.ico"
    echo "   - src/app/favicon.ico"

else
    echo "❌ Error: Neither 'sips' (macOS) nor 'convert' (ImageMagick) found"
    echo "Please install ImageMagick or run this script on macOS"
    echo ""
    echo "Install ImageMagick:"
    echo "  - macOS: brew install imagemagick"
    echo "  - Ubuntu/Debian: sudo apt install imagemagick"
    echo "  - CentOS/RHEL: sudo yum install imagemagick"
    exit 1
fi