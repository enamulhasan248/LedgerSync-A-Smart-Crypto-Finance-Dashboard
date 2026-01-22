from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet, 
    NewsView, 
    NewsHeadlinesView, 
    MarketSummaryView,
    PriceHistoryView,
    WatchlistViewSet
)

router = DefaultRouter()
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('', include(router.urls)),
    path('news/', NewsView.as_view(), name='news'),
    path('news/top-headlines/', NewsHeadlinesView.as_view(), name='news-top-headlines'),
    path('market/summary/', MarketSummaryView.as_view(), name='market-summary'),
    path('prices/<str:symbol>/history/', PriceHistoryView.as_view(), name='price-history'),
]
