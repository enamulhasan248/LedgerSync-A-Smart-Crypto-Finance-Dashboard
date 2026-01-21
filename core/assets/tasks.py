from celery import shared_task
from .models import Asset, PricePoint
from .adapters import get_adapter
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_asset_prices():
    """
    Task to update prices for all assets in the database.
    """
    assets = Asset.objects.all()
    logger.info(f"Starting price update for {assets.count()} assets.")

    for asset in assets:
        try:
            adapter = get_adapter(asset.asset_type)
            price = adapter.get_price(asset.symbol, asset.api_identifier)
            
            if price:
                PricePoint.objects.create(asset=asset, price=price)
                logger.info(f"Updated {asset.symbol}: {price}")
            else:
                logger.warning(f"Failed to fetch price for {asset.symbol} (returned None)")
                
        except Exception as e:
            logger.error(f"Error updating {asset.symbol}: {str(e)}")
            
    return f"Completed update for {assets.count()} assets"
