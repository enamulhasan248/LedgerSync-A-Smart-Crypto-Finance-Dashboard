from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta, datetime
from assets.models import Asset, PricePoint
from .serializers import AssetSerializer, PricePointSerializer, NewsSerializer
from .utils import get_top_headlines, get_market_summary, get_country_news

class AssetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for Assets.
    Provides list and retrieve actions.
    Includes 'history' action for fetching price history.
    """
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Custom action to retrieve price history for an asset.
        Query Params:
        - period: '24h' (default), '7d'
        """
        asset = self.get_object()
        period = request.query_params.get('period', '24h')
        
        # Determine time threshold
        now = timezone.now()
        if period == '7d':
            start_time = now - timedelta(days=7)
        else: # Default 24h
            start_time = now - timedelta(hours=24)
            
        # Filter price points
        price_points = asset.price_points.filter(timestamp__gte=start_time)
        serializer = PricePointSerializer(price_points, many=True)
        return Response(serializer.data)

class NewsView(views.APIView):
    """
    API View to fetch financial news by country.
    """
    def get(self, request):
        country = request.query_params.get('country', 'us').lower()
        
        # Fetch real news using helper
        news_data = get_country_news(country)
            
        serializer = NewsSerializer(news_data, many=True)
        return Response(serializer.data)

class NewsHeadlinesView(views.APIView):
    """
    API View to fetch top 10 merged headlines from Yahoo and BBC.
    """
    def get(self, request):
        headlines = get_top_headlines(limit=10)
        serializer = NewsSerializer(headlines, many=True)
        return Response(serializer.data)

class MarketSummaryView(views.APIView):
    """
    API View to fetch market summary (Ticker indices + Top Gainers).
    """
    def get(self, request):
        data = get_market_summary()
        return Response(data)
