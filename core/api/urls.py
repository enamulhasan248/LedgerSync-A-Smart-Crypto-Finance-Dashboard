from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, NewsView

router = DefaultRouter()
router.register(r'assets', AssetViewSet, basename='asset')

urlpatterns = [
    path('', include(router.urls)),
    path('news/', NewsView.as_view(), name='news'),
]
