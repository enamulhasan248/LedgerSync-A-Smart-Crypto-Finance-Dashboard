"""
Management command to seed initial asset data for the Asset model.
This populates the database with stocks and crypto assets.
"""
from django.core.management.base import BaseCommand
from assets.models import Asset


class Command(BaseCommand):
    help = 'Seeds the database with initial asset data (stocks and crypto)'

    def handle(self, *args, **options):
        # Define initial assets to seed
        assets_data = [
            # Global Stocks
            {'symbol': 'AAPL', 'name': 'Apple Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'AAPL'},
            {'symbol': 'MSFT', 'name': 'Microsoft Corporation', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'MSFT'},
            {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'GOOGL'},
            {'symbol': 'AMZN', 'name': 'Amazon.com, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'AMZN'},
            {'symbol': 'NVDA', 'name': 'NVIDIA Corporation', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'NVDA'},
            {'symbol': 'META', 'name': 'Meta Platforms, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'META'},
            {'symbol': 'TSLA', 'name': 'Tesla, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'TSLA'},
            {'symbol': 'AMD', 'name': 'Advanced Micro Devices, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'AMD'},
            {'symbol': 'NFLX', 'name': 'Netflix, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'NFLX'},
            {'symbol': 'COIN', 'name': 'Coinbase Global, Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'COIN'},
            {'symbol': 'JPM', 'name': 'JPMorgan Chase & Co.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'JPM'},
            {'symbol': 'V', 'name': 'Visa Inc.', 'asset_type': 'STOCK_GLOBAL', 'api_identifier': 'V'},
            
            # Cryptocurrencies
            {'symbol': 'BTC-USD', 'name': 'Bitcoin', 'asset_type': 'CRYPTO', 'api_identifier': 'bitcoin'},
            {'symbol': 'ETH-USD', 'name': 'Ethereum', 'asset_type': 'CRYPTO', 'api_identifier': 'ethereum'},
            {'symbol': 'SOL-USD', 'name': 'Solana', 'asset_type': 'CRYPTO', 'api_identifier': 'solana'},
            {'symbol': 'XRP-USD', 'name': 'XRP', 'asset_type': 'CRYPTO', 'api_identifier': 'ripple'},
            {'symbol': 'DOGE-USD', 'name': 'Dogecoin', 'asset_type': 'CRYPTO', 'api_identifier': 'dogecoin'},
            {'symbol': 'ADA-USD', 'name': 'Cardano', 'asset_type': 'CRYPTO', 'api_identifier': 'cardano'},
            {'symbol': 'AVAX-USD', 'name': 'Avalanche', 'asset_type': 'CRYPTO', 'api_identifier': 'avalanche-2'},
            {'symbol': 'DOT-USD', 'name': 'Polkadot', 'asset_type': 'CRYPTO', 'api_identifier': 'polkadot'},
            {'symbol': 'LINK-USD', 'name': 'Chainlink', 'asset_type': 'CRYPTO', 'api_identifier': 'chainlink'},
            {'symbol': 'MATIC-USD', 'name': 'Polygon', 'asset_type': 'CRYPTO', 'api_identifier': 'matic-network'},
            
            # DSE Stocks (Dhaka Stock Exchange)
            {'symbol': 'GP', 'name': 'Grameenphone Ltd.', 'asset_type': 'STOCK_DSE', 'api_identifier': 'GP.BD'},
            {'symbol': 'BATBC', 'name': 'British American Tobacco Bangladesh', 'asset_type': 'STOCK_DSE', 'api_identifier': 'BATBC.BD'},
            {'symbol': 'WALTONHIL', 'name': 'Walton Hi-Tech Industries Ltd.', 'asset_type': 'STOCK_DSE', 'api_identifier': 'WALTONHIL.BD'},
            {'symbol': 'SQURPHARMA', 'name': 'Square Pharmaceuticals Ltd.', 'asset_type': 'STOCK_DSE', 'api_identifier': 'SQURPHARMA.BD'},
            {'symbol': 'RENATA', 'name': 'Renata Ltd.', 'asset_type': 'STOCK_DSE', 'api_identifier': 'RENATA.BD'},
        ]

        created_count = 0
        updated_count = 0

        for asset_data in assets_data:
            asset, created = Asset.objects.update_or_create(
                symbol=asset_data['symbol'],
                defaults={
                    'name': asset_data['name'],
                    'asset_type': asset_data['asset_type'],
                    'api_identifier': asset_data['api_identifier'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {asset.symbol}'))
            else:
                updated_count += 1
                self.stdout.write(f'Updated: {asset.symbol}')

        self.stdout.write(self.style.SUCCESS(
            f'\nSeed complete! Created: {created_count}, Updated: {updated_count}'
        ))
