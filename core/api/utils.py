import yfinance as yf
import feedparser
from datetime import datetime
import time

import re

def fetch_yahoo_news():
    """
    Fetches market news using yfinance.
    """
    try:
        ticker = yf.Ticker("^GSPC") 
        news_items = ticker.news
        
        headlines = []
        for item in news_items:
            # Validate essential fields
            title = item.get('title')
            if not title:
                continue
                
            publisher = item.get('publisher')
            link = item.get('link')
            
            image_url = None
            if 'thumbnail' in item and 'resolutions' in item['thumbnail']:
                resolutions = item['thumbnail']['resolutions']
                if resolutions:
                    # Sort by width descending (as INT) to get the best quality
                    # Handle potential string widths or missing tags
                    resolutions.sort(key=lambda x: int(x.get('width', 0)), reverse=True)
                    image_url = resolutions[0]['url']
            
            headlines.append({
                'headline': title,
                'source': publisher or 'Yahoo Finance',
                'link': link or '#',
                'image': image_url,
                'timestamp': item.get('providerPublishTime', int(time.time())),
                'origin': 'Yahoo Finance'
            })
        return headlines
    except Exception as e:
        print(f"Error fetching Yahoo news: {e}")
        return []

def fetch_bbc_news():
    """
    Fetches business news from BBC RSS feed.
    """
    try:
        feed_url = "http://feeds.bbci.co.uk/news/business/rss.xml"
        feed = feedparser.parse(feed_url)
        
        headlines = []
        for entry in feed.entries:
            title = getattr(entry, 'title', None)
            if not title:
                continue
                
            link = getattr(entry, 'link', '#')
            
            # Prioritize media_content (usually larger) over media_thumbnail
            image_url = None
            if 'media_content' in entry and entry.media_content:
                 # Pick largest valid image by width (int)
                 best_image = max(entry.media_content, key=lambda x: int(x.get('width', 0)) if x.get('width') else 0)
                 image_url = best_image.get('url')
            
            if not image_url and 'media_thumbnail' in entry and entry.media_thumbnail:
                 image_url = entry.media_thumbnail[0]['url']
            
            # Enhance BBC Image URL to high resolution if possible
            # BBC URLs often look like: https://ichef.bbci.co.uk/news/240/cpsprodpb/...
            # We bump 240 (or any width) to 976 (standard high res)
            if image_url:
                image_url = re.sub(r'/news/\d+/', '/news/976/', image_url)
                 
            # Convert struct_time to timestamp
            timestamp = int(time.mktime(entry.published_parsed)) if hasattr(entry, 'published_parsed') else int(time.time())

            headlines.append({
                'headline': title,
                'source': 'BBC News',
                'link': link,
                'image': image_url,
                'timestamp': timestamp,
                'origin': 'BBC'
            })
        return headlines
    except Exception as e:
        print(f"Error fetching BBC news: {e}")
        return []

def get_top_headlines(limit=10):
    """
    Merges news from sources, sorts by time, and returns top items.
    """
    yahoo = fetch_yahoo_news()
    bbc = fetch_bbc_news()
    
    all_news = yahoo + bbc
    
    # Sort by timestamp descending (newest first)
    all_news.sort(key=lambda x: x['timestamp'], reverse=True)
    all_news = all_news[:limit]
    
    # Fallback/Mock Data if we don't have enough news (prevents empty carousel)
    if len(all_news) < 3:
        mock_news = [
            {
                'headline': 'Global Markets Rally as Tech Sector Surges',
                'source': 'Market Watch',
                'link': '#',
                'image': None,
                'timestamp': int(time.time()),
                'origin': 'Mock'
            },
            {
                'headline': 'Crypto Markets See Green Across the Board',
                'source': 'Crypto Daily',
                'link': '#',
                'image': None,
                'timestamp': int(time.time()),
                'origin': 'Mock'
            },
            {
                'headline': 'New Economic Policies Announced by Central Bank',
                'source': 'Financial Times',
                'link': '#',
                'image': None,
                'timestamp': int(time.time()),
                'origin': 'Mock'
            }
        ]
        all_news.extend(mock_news)
        
    return all_news[:limit]

def get_market_summary():
    """
    Fetches market summary data:
    1. Major Indices/Crypto for Ticker.
    2. Top Gainers (simulated by checking high-volatility tech stocks).
    """
    try:
        # 1. Ticker Data
        ticker_symbols = ['^GSPC', 'BTC-USD', '^FTSE', '^N225']
        tickers_data = []
        
        names = {
            '^GSPC': 'S&P 500',
            'BTC-USD': 'Bitcoin',
            '^FTSE': 'FTSE 100',
            '^N225': 'Nikkei 225'
        }
        
        ticker_objs = yf.Tickers(" ".join(ticker_symbols))
        
        for symbol in ticker_symbols:
            try:
                t = ticker_objs.tickers[symbol]
                price = t.fast_info.last_price
                prev_close = t.fast_info.previous_close
                change_pct = ((price - prev_close) / prev_close) * 100
                
                tickers_data.append({
                    'symbol': symbol,
                    'name': names.get(symbol, symbol),
                    'price': price,
                    'change': change_pct
                })
            except Exception as e:
                pass
                
        # 2. Top Gainers
        gainer_symbols = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'AMD', 'NFLX', 'COIN']
        gainers_data = []
        
        gainer_objs = yf.Tickers(" ".join(gainer_symbols))
        
        for symbol in gainer_symbols:
            try:
                t = gainer_objs.tickers[symbol]
                price = t.fast_info.last_price
                prev_close = t.fast_info.previous_close
                change_pct = ((price - prev_close) / prev_close) * 100
                
                gainers_data.append({
                    'symbol': symbol,
                    'name': t.info.get('shortName', symbol),
                    'price': price,
                    'change': change_pct
                })
            except Exception as e:
                pass
                
        gainers_data.sort(key=lambda x: x['change'], reverse=True)
        top_gainers = gainers_data[:5]
        
        return {
            'tickers': tickers_data,
            'gainers': top_gainers
        }
        
    except Exception as e:
        print(f"Error getting market summary: {e}")
        return {'tickers': [], 'gainers': []}

import requests
from decouple import config

def fetch_finnhub_news(category='general'):
    """
    Fetches news from Finnhub API.
    """
    try:
        api_key = config('FINNHUB_API_KEY', default='')
        if not api_key:
            return []
            
        url = f"https://finnhub.io/api/v1/news?category={category}&token={api_key}"
        response = requests.get(url)
        if response.status_code != 200:
            return []
            
        data = response.json()
        headlines = []
        for item in data[:10]: # Limit to 10
            headlines.append({
                'headline': item.get('headline'),
                'source': item.get('source'),
                'link': item.get('url'),
                'image': item.get('image'),
                'timestamp': item.get('datetime', int(time.time())),
                'origin': 'Finnhub'
            })
        return headlines
    except Exception as e:
        print(f"Error fetching Finnhub news: {e}")
        return []

def fetch_google_news_rss(query):
    """
    Fetches news from Google News RSS.
    """
    try:
        # Encode query
        from urllib.parse import quote
        encoded_query = quote(query)
        feed_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        feed = feedparser.parse(feed_url)
        headlines = []
        
        for entry in feed.entries[:10]:
            timestamp = int(time.mktime(entry.published_parsed)) if hasattr(entry, 'published_parsed') else int(time.time())
            
            # Attempt to extract image from description HTML
            image_url = None
            description = getattr(entry, 'description', '')
            if description:
                # Look for <img src="..."
                match = re.search(r'src="([^"]+)"', description)
                if match:
                    image_url = match.group(1)
            
            headlines.append({
                'headline': entry.title,
                'source': entry.source.title if hasattr(entry, 'source') else 'Google News',
                'link': entry.link,
                'image': image_url,
                'timestamp': timestamp,
                'origin': 'GoogleNews'
            })
        return headlines
    except Exception as e:
        print(f"Error fetching Google News: {e}")
        return []

def get_country_news(country_code):
    """
    Dispatches news fetch based on country.
    Now uses Google News RSS for all regions as Finnhub was unreliable.
    """
    country = country_code.lower()
    
    # Map country codes to Google News queries
    queries = {
        'us': 'US Financial Markets',
        'uk': 'UK Business News',
        'jp': 'Japan Economy',
        'bd': 'Bangladesh Economy',
    }
    
    query = queries.get(country, 'Global Finance News')
    return fetch_google_news_rss(query)
