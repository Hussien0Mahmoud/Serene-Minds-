from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'therapists', views.TherapistViewSet)
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'resources', views.ResourceViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'reading-lists', views.ReadingListViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'user-progress', views.UserProgressViewSet)
router.register(r'admin-stats', views.AdminStatsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Add custom URL patterns here if needed
]