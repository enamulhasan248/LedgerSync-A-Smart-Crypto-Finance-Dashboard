from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from assets.models import Asset, PricePoint
from .serializers import AssetSerializer, PricePointSerializer, NewsSerializer

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
    API View to fetch financial news.
    Currently returns mock data based on 'country' query param.
    """
    def get(self, request):
        country = request.query_params.get('country', 'us').lower()
        
        # Mock Data Generation
        mock_news = []
        now_str = timezone.now().isoformat()
        
        if country == 'bd':
            mock_news = [
                {
                    "title": "DSE Index Hits New High",
                    "source": "The Daily Star",
                    "url": "https://thedailystar.net/business/news/dse-hits-high",
                    "published_at": now_str,
                    "summary": "Dhaka Stock Exchange sees record trading volume today."
                },
                {
                    "title": "Bangladesh Bank Issues New Directive",
                    "source": "Dhaka Tribune",
                    "url": "https://dhakatribune.com/business/bank-directive",
                    "published_at": now_str,
                    "summary": "Central bank tightens regulations on currency trading."
                }
            ]
        else: # Default US/Global
            mock_news = [
                {
                    "title": "Fed rate cuts expected later this year",
                    "source": "Yahoo Finance",
                    "url": "https://finance.yahoo.com/news/fed-rate-cuts",
                    "published_at": now_str,
                    "summary": "Analysts predict interest rate adjustments in Q3."
                },
                {
                    "title": "Tech Stocks Rally on AI Optimism",
                    "source": "Bloomberg",
                    "url": "https://bloomberg.com/news/tech-rally",
                    "published_at": now_str,
                    "summary": "Major tech indices up 2% as AI investment continues."
                }
            ]
            
        serializer = NewsSerializer(mock_news, many=True)
        return Response(serializer.data)
