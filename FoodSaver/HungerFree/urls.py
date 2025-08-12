from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('about/', views.about, name='about'),
    path('donations/', views.donations, name='donations'),
    path('donations/show-all/', views.show_all_donations, name='show_all_donations'),
    path('future-features/', views.future_features, name='future_features'),
    # path('detect-loaction/', views.detect_location, name='detect_location'),
    path('update-location/', views.update_location, name='update_location'),
    path('donations/create/', views.create_donation, name='create_donation'),
    
]