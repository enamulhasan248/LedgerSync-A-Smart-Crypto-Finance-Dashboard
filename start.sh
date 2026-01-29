# #!/bin/bash

# # --- FIX: Go into the 'core' folder first ---
# cd core

# # Start Celery in background
# #celery -A core worker --loglevel=info --concurrency=2 &

# # Added -B to run the Beat scheduler embedded
# # Change
# celery -A core worker --beat --scheduler django --loglevel=info --concurrency=2 &

# # Start Gunicorn in foreground
# gunicorn core.wsgi:application


#!/bin/bash

# 1. Move into the core directory
cd core

# 2. FORCE DATA FETCH (Run this immediately so the site isn't empty)
echo "Fetching initial data..."
python manage.py shell -c "from assets.tasks import update_asset_prices; update_asset_prices()"

# 3. Start Celery Worker & Beat (Using the Standard Scheduler)
# We removed '--scheduler django' to fix the crash.
echo "Starting Worker and Scheduler..."
celery -A core worker --beat --loglevel=info --concurrency=2 &

# 4. Start the Web Server
echo "Starting Gunicorn..."
gunicorn core.wsgi:application