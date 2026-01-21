import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

User = get_user_model()
email = "enamulhasan.course019@gmail.com"
password = "1234"
username = "enamul"  # Creating a username derived from email or generic

if not User.objects.filter(username=username).exists() and not User.objects.filter(email=email).exists():
    print(f"Creating superuser {username} ({email})...")
    User.objects.create_superuser(username=username, email=email, password=password)
    print("Superuser created successfully.")
else:
    print("User already exists.")
