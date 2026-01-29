#!/usr/bin/env bash
# Exit on error
set -o errexit

# --- 1. Install Dependencies ---
# Check if requirements.txt is in the ROOT folder
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from ROOT..."
    pip install -r requirements.txt
    cd core  # Move to core for Django commands

# Check if requirements.txt is in the CORE folder
elif [ -f "core/requirements.txt" ]; then
    echo "Installing dependencies from CORE..."
    cd core
    pip install -r requirements.txt

else
    echo "ERROR: requirements.txt not found! Listing files for debugging:"
    ls -R
    exit 1
fi

# --- 2. Run Django Commands ---
# (We are now inside the 'core' folder)
python manage.py collectstatic --no-input
python manage.py migrate
