#!/bin/bash
while sleep 0.1; do ls target/* | entr sh -c 'LATESTFILE=$(ls -t target | head -n1); uv run display_image.py --fule "target/$LATESTFILE"';done
