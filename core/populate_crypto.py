import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from assets.models import Asset

cryptos = [
    {'symbol': 'ETH', 'name': 'Ethereum', 'api_identifier': 'ethereum'},
    {'symbol': 'ADA', 'name': 'Cardano', 'api_identifier': 'cardano'},
    {'symbol': 'SOL', 'name': 'Solana', 'api_identifier': 'solana'},
]

for c in cryptos:
    obj, created = Asset.objects.get_or_create(
        symbol=c['symbol'],
        defaults={
            'name': c['name'], 
            'asset_type': 'CRYPTO', 
            'api_identifier': c['api_identifier']
        }
    )
    if created:
        print(f"Created {c['name']}")
    else:
        print(f"Skipped {c['name']} (already exists)")
        obj = Asset.objects.get(symbol=c['symbol'])

    # Fetch initial price
    from assets.adapters import CryptoAdapter
    from assets.models import PricePoint
    
    try:
        adapter = CryptoAdapter()
        price = adapter.get_price(c['symbol'], identifier=c['api_identifier'])
        PricePoint.objects.create(asset=obj, price=price)
        print(f"Added initial price for {c['name']}: ${price}")
    except Exception as e:
        print(f"Failed to fetch price for {c['name']}: {e}")
