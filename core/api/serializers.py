from rest_framework import serializers
from assets.models import Asset, PricePoint

class PricePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricePoint
        fields = ['price', 'timestamp']

class AssetSerializer(serializers.ModelSerializer):
    latest_price = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = ['id', 'symbol', 'name', 'asset_type', 'api_identifier', 'latest_price']

    def get_latest_price(self, obj):
        # Efficiently fetch the latest price point's price
        latest_point = obj.price_points.first() # Meta ordering is -timestamp
        return latest_point.price if latest_point else None

class NewsSerializer(serializers.Serializer):
    title = serializers.CharField()
    source = serializers.CharField()
    url = serializers.URLField()
    published_at = serializers.DateTimeField()
    summary = serializers.CharField(required=False)
