#!/bin/bash
# Start Celery in background
celery -A core worker --loglevel=info --concurrency=2 &

# Start Gunicorn in foreground
gunicorn core.wsgi:application
