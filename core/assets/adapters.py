from abc import ABC, abstractmethod
from decimal import Decimal
import yfinance as yf
from pycoingecko import CoinGeckoAPI
from bdshare import get_current_trade_data
from django.conf import settings

class MarketAdapter(ABC):
    @abstractmethod
    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        """Fetch the current price for a given asset."""
        pass

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
            # Log error here in a real app
            raise ValueError(f"Error fetching crypto price: {str(e)}")

class GlobalStockAdapter(MarketAdapter):
    def get_price(self, symbol: str, identifier: str = None) -> Decimal:
        try:
            # yfinance history returns a pandas DataFrame
            ticker = yf.Ticker(symbol)
            # Requesting 2 days to ensure we get the latest close even if today is trading
            # or '1d' if market is open. '1d' usually works for latest available data.
            hist = ticker.history(period='1d')
            
            if hist.empty:
                raise ValueError(f"No history data found for {symbol}")
                
            # Get the 'Close' price of the last available row
            last_price = hist['Close'].iloc[-1]
            return Decimal(str(last_price))
        except Exception as e:
            raise ValueError(f"Error fetching global stock price for {symbol}: {str(e)}")

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

def get_adapter(asset_type: str) -> MarketAdapter:
    if asset_type == 'CRYPTO':
        return CryptoAdapter()
    elif asset_type == 'STOCK_GLOBAL':
        return GlobalStockAdapter()
    elif asset_type == 'STOCK_DSE':
        return DSEAdapter()
    else:
        raise ValueError(f"Unsupported asset type: {asset_type}")
