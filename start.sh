#!/bin/bash

# --- FIX: Go into the 'core' folder first ---
cd core

# Start Celery in background
#celery -A core worker --loglevel=info --concurrency=2 &

# Added -B to run the Beat scheduler embedded
# Change
celery -A core worker --beat --scheduler django --loglevel=info --concurrency=2 &

# Start Gunicorn in foreground
gunicorn core.wsgi:application
