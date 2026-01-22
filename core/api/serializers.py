from datetime import timedelta, datetime
from django.utils import timezone
from rest_framework import serializers
from assets.models import Asset, PricePoint

class PricePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricePoint
        fields = ['price', 'timestamp']

class AssetSerializer(serializers.ModelSerializer):
    latest_price = serializers.SerializerMethodField()
    change_24h = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = ['id', 'symbol', 'name', 'asset_type', 'api_identifier', 'latest_price', 'change_24h']

    def get_latest_price(self, obj):
        # Efficiently fetch the latest price point's price
        latest_point = obj.price_points.first() # Meta ordering is -timestamp
        return latest_point.price if latest_point else None

    def get_change_24h(self, obj):
        latest_point = obj.price_points.first()
        if not latest_point:
            return 0.0
            
        # Get price roughly 24 hours ago
        # We look for a price point older than 24h ago but closest to it, 
        # OR just use the first point after 24h window if strict.
        # Simple approach: Get point closest to now - 24h.
        
        # Since we order by -timestamp, we want the first point that is <= 24h ago?
        # No, we want the price AT 24 hours ago.
        # Let's simple check: Price at (Now - 24h).
        # We can filter points <= Now - 24h, and take the first one (which would be the one closest to 24h ago from the past).
        
        yesterday = timezone.now() - timedelta(hours=24)
        past_point = obj.price_points.filter(timestamp__lte=yesterday).first()
        
        if not past_point:
            # If no data older than 24h, maybe just take the oldest data available if it's close? 
            # Or just return 0.
            return 0.0
            
        current_price = latest_point.price
        past_price = past_point.price
        
        if past_price == 0:
            return 0.0
            
        change = ((current_price - past_price) / past_price) * 100
        return round(float(change), 2)

class NewsSerializer(serializers.Serializer):
    # Backend utils returns 'headline', 'source', 'link', 'image', 'timestamp'
    # Frontend expects: title, source, url, published_at, summary.
    # I should map them.
    
    title = serializers.CharField(source='headline')
    source = serializers.CharField()
    url = serializers.URLField(source='link')
    published_at = serializers.SerializerMethodField()
    image = serializers.URLField(required=False, allow_null=True)
    summary = serializers.CharField(required=False)

    def get_published_at(self, obj):
        # Obj is a dict from utils.py
        # timestamp is int
        ts = obj.get('timestamp')
        if ts:
            return datetime.fromtimestamp(ts).isoformat()
        return None
