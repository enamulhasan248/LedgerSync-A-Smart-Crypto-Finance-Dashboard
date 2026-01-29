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
    ReadOnly ViewSet for Assets.
    Provides list and retrieve actions.
    Supports filtering by 'exchange' or 'type'.
    """
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [] # AllowAny equivalent if default is AllowAny, or explicit

    def get_queryset(self):
        queryset = super().get_queryset()
        exchange = self.request.query_params.get('exchange')
        asset_type = self.request.query_params.get('type') # e.g. CRYPTO
        
        if exchange:
            # Assuming exchange is handled via asset_type or maybe a future specific field.
            # For now, let's map known exchanges to types if possible, or add filtering if we had an exchange field.
            # Current types: STOCK_GLOBAL, STOCK_DSE, CRYPTO.
            # If user asks for NYSE, we assume STOCK_GLOBAL for now? 
            # Or better, we should have granular types. 
            # For this task, let's just filter by asset_type if provided.
            pass

        if asset_type: 
            asset_type_upper = asset_type.upper()
            # Handle specific types directly
            if asset_type_upper in ['CRYPTO', 'STOCK_GLOBAL', 'STOCK_DSE']:
                queryset = queryset.filter(asset_type=asset_type_upper)
            elif asset_type_upper == 'STOCKS':
                # Generic STOCKS maps to both global and DSE
                queryset = queryset.filter(asset_type__in=['STOCK_GLOBAL', 'STOCK_DSE'])
                
        return queryset

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """
        Fetch extra details (Market Cap, Volume) via Adapter
        """
        asset = self.get_object()
        from assets.adapters import get_adapter
        try:
            adapter = get_adapter(asset.asset_type)
            details = adapter.get_details(asset.symbol, identifier=asset.api_identifier)
            return Response(details)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Fetch price history for an asset. 
        Proxies request to the appropriate adapter based on asset type.
        """
        asset = self.get_object()
        period = request.query_params.get('period', '1d') # 24h -> 1d via adapter map usually
        
        # Map frontend '24h' to backend '1d' if needed, or rely on adapter defaults
        if period == '24h': period = '1d'
        if period == '7d': period = '5d' # approximate

        from assets.adapters import get_adapter
        try:
            adapter = get_adapter(asset.asset_type)
            history = adapter.get_history(asset.symbol, period, identifier=asset.api_identifier)
            return Response(history)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PriceHistoryView(views.APIView):
    """
    API View to fetch historical price data for a symbol.
    """
    permission_classes = []

    def get(self, request, symbol):
        period = request.query_params.get('period', '1d') # 1d, 5d, 1mo, 1y, 5y, ytd
        
        # Find asset to know which adapter to use
        # Optimistic lookup: try to find by symbol
        asset = Asset.objects.filter(symbol=symbol).first()
        
        if not asset:
            return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
            
        from assets.adapters import get_adapter
        try:
            adapter = get_adapter(asset.asset_type)
            history = adapter.get_history(symbol, period, identifier=asset.api_identifier)
            return Response(history)
        except Exception as e:
             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from assets.models import Watchlist
from .serializers import WatchlistSerializer

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Watchlist.objects.filter(user=self.request.user)
        return Watchlist.objects.none()
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
