from datetime import timedelta, datetime
from django.utils import timezone
from rest_framework import serializers
from assets.models import Asset, PricePoint, Watchlist
from decimal import Decimal

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
        latest_point = obj.price_points.first()
        return str(latest_point.price) if latest_point else None

    def get_change_24h(self, obj):
        latest_point = obj.price_points.first()
        if not latest_point:
            return 0.0
            
        yesterday = timezone.now() - timedelta(hours=24)
        past_point = obj.price_points.filter(timestamp__lte=yesterday).first()
        
        if not past_point:
            return 0.0
            
        current_price = latest_point.price
        past_price = past_point.price
        
        if past_price == 0:
            return 0.0
            
        change = ((current_price - past_price) / past_price) * 100
        return round(float(change), 2)

class WatchlistSerializer(serializers.ModelSerializer):
    asset_details = AssetSerializer(source='asset', read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ['id', 'asset', 'asset_details', 'added_at']
        read_only_fields = ['added_at']

class NewsSerializer(serializers.Serializer):
    title = serializers.CharField(source='headline')
    source = serializers.CharField()
    url = serializers.URLField(source='link')
    published_at = serializers.SerializerMethodField()
    image = serializers.URLField(required=False, allow_null=True)
    summary = serializers.CharField(required=False)

    def get_published_at(self, obj):
        ts = obj.get('timestamp')
        if ts:
            return datetime.fromtimestamp(ts).isoformat()
        return None
