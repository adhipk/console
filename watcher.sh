#!/bin/bash
find target -maxdepth 1 -type f | entr -d sh -c 'LATESTFILE=$(find target -maxdepth 1 -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -d" " -f2-); uv run display_image.py --file "$LATESTFILE"'

