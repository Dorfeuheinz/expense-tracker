"""
Cloudflare Workers entry point for FastAPI application.
Uses Mangum to adapt FastAPI ASGI app to Cloudflare Workers.
"""
from mangum import Mangum
from app.main import app

# Wrap FastAPI app with Mangum for Cloudflare Workers compatibility
# Set lifespan="off" since Cloudflare Workers handle lifecycle differently
handler = Mangum(app, lifespan="off")
