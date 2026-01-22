from abc import ABC, abstractmethod
from decimal import Decimal
import yfinance as yf
from pycoingecko import CoinGeckoAPI
from bdshare import get_current_trade_data
from django.conf import settings
import pandas as pd
from datetime import datetime, timedelta

class MarketAdapter(ABC):
    @abstractmethod
    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        """Fetch the current price for a given asset."""
        pass

    def get_history(self, symbol: str, period: str, identifier: str = None) -> list:
        """
        Fetch historical price data.
        Returns a list of dicts: [{'time': 'timestamp/str', 'value': float}]
        Default implementation returns empty list.
        """
        return []

    def get_details(self, symbol: str, identifier: str = None) -> dict:
        """
        Fetch detailed asset information (Market Cap, Volume, etc.)
        Returns dict with 'market_cap', 'volume'.
        """
        return {'market_cap': 'N/A', 'volume': 'N/A'}

class CryptoAdapter(MarketAdapter):
    def __init__(self):
        self.cg = CoinGeckoAPI()

    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        if not identifier:
            raise ValueError("Crypto assets require an API identifier (e.g., 'bitcoin').")
        
        try:
            data = self.cg.get_price(ids=identifier, vs_currencies='usd')
            if identifier in data:
                return Decimal(str(data[identifier]['usd']))
            raise ValueError(f"Price data not found for {identifier}")
        except Exception as e:
            raise ValueError(f"Error fetching crypto price: {str(e)}")

    def get_details(self, symbol: str, identifier: str = None) -> dict:
        if not identifier: return {'market_cap': 'N/A', 'volume': 'N/A'}
        try:
            # CoinGecko get_price can return more info
            data = self.cg.get_price(ids=identifier, vs_currencies='usd', include_market_cap='true', include_24hr_vol='true')
            if identifier in data:
                item = data[identifier]
                mc = item.get('usd_market_cap', 0)
                vol = item.get('usd_24h_vol', 0)
                
                # Format
                def format_num(n):
                    if n > 1e12: return f"${(n/1e12):.2f}T"
                    if n > 1e9: return f"${(n/1e9):.2f}B"
                    if n > 1e6: return f"${(n/1e6):.2f}M"
                    return f"${n:,.2f}"

                return {
                    'market_cap': format_num(mc),
                    'volume': format_num(vol)
                }
            return {'market_cap': 'N/A', 'volume': 'N/A'}
        except Exception:
            return {'market_cap': 'N/A', 'volume': 'N/A'}

    def get_history(self, symbol: str, period: str, identifier: str = None) -> list:
        if not identifier:
             raise ValueError("Crypto assets require an API identifier (e.g., 'bitcoin').")
        
        # Map period to CoinGecko 'days' parameter
        # 1d -> 1, 5d -> 7? (CG supports 1, 7, 14, 30, 90, 180, 365, max)
        days_map = {
            '1d': '1',
            '5d': '7', 
            '1mo': '30',
            '1y': '365',
            '5y': 'max', # Approximate, CG uses 'max' for full history
            'ytd': '365', # Approximate
            'max': 'max'
        }
        days = days_map.get(period, '1')

        try:
            data = self.cg.get_coin_market_chart_by_id(id=identifier, vs_currency='usd', days=days)
            prices = data.get('prices', [])
            
            # Format: [timestamp_ms, price]
            history = []
            for ts, price in prices:
                # Convert ms timestamp to readable for frontend or keep as is?
                # Frontend Recharts expects a 'time' label.
                # For 1d (intraday), time format HH:mm is good. For others Date.
                
                dt = datetime.fromtimestamp(ts / 1000)
                if period == '1d':
                    time_str = dt.strftime('%H:%M')
                elif period == '5d':
                    time_str = dt.strftime('%a %H:%M')
                else: 
                    time_str = dt.strftime('%Y-%m-%d')
                
                history.append({
                    'time': time_str,
                    'value': price
                })
            return history
        except Exception as e:
            print(f"Error fetching crypto history: {e}")
            return []

class GlobalStockAdapter(MarketAdapter):
    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period='1d')
            
            if hist.empty:
                raise ValueError(f"No history data found for {symbol}")
                
            last_price = hist['Close'].iloc[-1]
            return Decimal(str(last_price))
        except Exception as e:
            raise ValueError(f"Error fetching global stock price for {symbol}: {str(e)}")

    def get_details(self, symbol: str, identifier: str = None) -> dict:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info # This triggers a fetch
            
            mc = info.get('marketCap', 0)
            vol = info.get('volume', 0) # or regularMarketVolume
            
            def format_num(n):
                if not n: return 'N/A'
                if n > 1e12: return f"${(n/1e12):.2f}T"
                if n > 1e9: return f"${(n/1e9):.2f}B"
                if n > 1e6: return f"${(n/1e6):.2f}M"
                return f"${n:,.2f}"

            return {
                'market_cap': format_num(mc),
                'volume': format_num(vol)
            }
        except Exception:
            return {'market_cap': 'N/A', 'volume': 'N/A'}

    def get_history(self, symbol: str, period: str, identifier: str = None) -> list:
        try:
            ticker = yf.Ticker(symbol)
            # Map periods
            # valid yfinance periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
            valid_periods = ['1d', '5d', '1mo', '1y', '5y', 'ytd', 'max']
            if period not in valid_periods:
                period = '1d' # default

            hist = ticker.history(period=period)
            
            # Fallback for closed market on 1d (e.g. weekend)
            if period == '1d' and (hist.empty or len(hist) < 2):
                 # Fetch 5d and take the last available trading day
                 hist_5d = ticker.history(period='5d')
                 if not hist_5d.empty:
                     last_date = hist_5d.index[-1].date()
                     hist = hist_5d[hist_5d.index.date == last_date]

            results = []
            for date, row in hist.iterrows():
                # date is a timestamp (localized)
                if period == '1d':
                    time_str = date.strftime('%H:%M')
                elif period == '5d':
                    time_str = date.strftime('%a %H:%M')
                else:
                    time_str = date.strftime('%Y-%m-%d')
                
                results.append({
                    'time': time_str,
                    'value': float(row['Close'])
                })
            return results
        except Exception as e:
            print(f"Error fetching stock history: {e}")
            return []

class DSEAdapter(MarketAdapter):
    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        try:
            df = get_current_trade_data(symbol)
            
            if df.empty or 'ltp' not in df.columns:
                 raise ValueError(f"Invalid data received from DSE for {symbol}")
            
            ltp = df['ltp'].iloc[0]
            return Decimal(str(ltp).replace(',', ''))
        except Exception as e:
             raise ValueError(f"Error fetching DSE price for {symbol}: {str(e)}")

    def get_details(self, symbol: str, identifier: str = None) -> dict:
        try:
            df = get_current_trade_data(symbol)
            # DSE columns: 'ltp', 'high', 'low', 'close', 'ycp', 'change', 'trade', 'value', 'volume'
            if df.empty: return {'market_cap': 'N/A', 'volume': 'N/A'}
            
            vol = df['volume'].iloc[0] # String with commas
            # DSE helper doesn't give market cap directly usually.
            # We can just show Volume.
            
            return {
                'market_cap': 'N/A', # Not available easily from bdshare live
                'volume': str(vol)
            }
        except:
            return {'market_cap': 'N/A', 'volume': 'N/A'}
    
    def get_history(self, symbol: str, period: str, identifier: str = None) -> list:
        # Fallback to local DB functionality needs to be handled in View or here via Model import
        # Importing here might cause circular import if not careful, but models usually safe inside method
        from .models import Asset
        try:
             # Find asset
             asset = Asset.objects.filter(symbol=symbol).first()
             if not asset: return []
             
             # Calculate delta
             now = datetime.now()
             if period == '1d': cutoff = now - timedelta(days=1)
             elif period == '5d': cutoff = now - timedelta(days=5)
             elif period == '1mo': cutoff = now - timedelta(days=30)
             elif period == '1y': cutoff = now - timedelta(days=365)
             else: cutoff = now - timedelta(days=365) # Default 1y cap for local db

             points = asset.price_points.filter(timestamp__gte=cutoff).order_by('timestamp')
             
             results = []
             for p in points:
                 dt = p.timestamp
                 if period == '1d':
                    time_str = dt.strftime('%H:%M')
                 elif period == '5d':
                    time_str = dt.strftime('%a %H:%M')
                 else:
                    time_str = dt.strftime('%Y-%m-%d')

                 results.append({
                     'time': time_str,
                     'value': float(p.price)
                 })
             return results

        except Exception as e:
            print(f"Error fetching DSE history: {e}")
            return []

def get_adapter(asset_type: str) -> MarketAdapter:
    if asset_type == 'CRYPTO':
        return CryptoAdapter()
    elif asset_type == 'STOCK_GLOBAL':
        return GlobalStockAdapter()
    elif asset_type == 'STOCK_DSE':
        return DSEAdapter()
    else:
        raise ValueError(f"Unsupported asset type: {asset_type}")
