#!/usr/bin/env bash
# Exit on error
set -o errexit

# --- FIX: Go into the 'core' folder first ---
cd core

# Install dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py collectstatic --no-input
python manage.py migrate
