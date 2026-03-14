import yfinance as yf # Yahoo Finance API wrapper to fetch stock data and news
import pandas as pd
def fetch_headlines(ticker: str, timeframe: str = "1mo") -> list[dict]:
    stock = yf.Ticker(ticker) # create a Ticker object for the given stock ticker
    news = stock.news # returns a list of articles, each article is a dict with keys like 'title', 'link', 'providerPublishTime', etc.
    
    # DEBUG
    for n in news[:2]:  # just check first 2 articles
        content = n.get("content", {})
        timestamp = content.get("pubDate")
        print(f"Raw timestamp: {timestamp}")
        print(f"Parsed: {pd.Timestamp(timestamp)}")
        break
    
    # ! yfinance does not filter by period so filter by date after fetching instead
    # Calculate cutoff date based on timeframe
    cutoff = {
        "1d": pd.Timestamp.now() - pd.Timedelta(days=1),
        "5d": pd.Timestamp.now() - pd.Timedelta(days=5),
        "1mo": pd.Timestamp.now() - pd.Timedelta(days=30),
        "3mo": pd.Timestamp.now() - pd.Timedelta(days=90),
        "6mo": pd.Timestamp.now() - pd.Timedelta(days=180),
        "1y": pd.Timestamp.now() - pd.Timedelta(days=365),
    }.get(timeframe, pd.Timestamp.now() - pd.Timedelta(days=30)) # default to 1 month if invalid timeframe provided

    results = []
    for n in news:
        content = n.get("content", {}) # get the 'content' dict from the article, which contains 'title' and 'pubDate'
        title = content.get("title")
        timestamp = content.get("pubDate") # get the publication date as a timestamp (in seconds since epoch)
        
        if title and timestamp: # only include articles that have both a title and a timestamp
            pub_date = pd.Timestamp(timestamp).tz_localize(None) # convert the timestamp to a pandas Timestamp object and remove timezone information for comparison
            if pub_date >= cutoff: # only include articles that were published after the cutoff date
                results.append({"title": title, "timestamp": timestamp})
    
    return results