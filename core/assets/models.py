from django.db import models

class Asset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('CRYPTO', 'Cryptocurrency'),
        ('STOCK_GLOBAL', 'Global Stock'),
        ('STOCK_DSE', 'Dhaka Stock Exchange'),
    ]

    symbol = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES)
    api_identifier = models.CharField(max_length=255, blank=True, null=True, help_text="API ID for fetching data (e.g., CoinGecko ID)")

    def __str__(self):
        return self.symbol

class PricePoint(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='price_points')
    price = models.DecimalField(max_digits=20, decimal_places=4)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.asset.symbol} - {self.price} @ {self.timestamp}"
