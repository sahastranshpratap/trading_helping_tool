import os
from datetime import timedelta

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    
    # JWT configuration (keeping for potential future use)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-here'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'
    
    # API settings
    API_TITLE = 'Trading Journal API'
    API_VERSION = 'v1'
    OPENAPI_VERSION = '3.0.2'
    
    # Development mode - bypass authentication
    DEVELOPMENT_MODE = True 