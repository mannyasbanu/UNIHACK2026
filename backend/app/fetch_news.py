import pandas as pd
from dotenv import load_dotenv
import os
import requests

## NEWSAPI ##
load_dotenv() # Load environment variables from the .env file in the current directory
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def fetch_newsapi_headlines(ticker: str, timeframe: str = "1mo") -> list[dict]:
    # Map tickers to better search queries
    query_map = {
        "AAPL": "Apple Inc",
        "MSFT": "Microsoft Corporation",
        "GOOGL": "Alphabet Inc",
        "AMZN": "Amazon.com Inc",
        "TSLA": "Tesla Inc",
        "NVDA": "NVIDIA Corporation",
    }

    # Calculate from_date based on timeframe
    from_date = {
        "1d":  pd.Timestamp.now() - pd.Timedelta(days=1),
        "3d":  pd.Timestamp.now() - pd.Timedelta(days=3),
        "1wk": pd.Timestamp.now() - pd.Timedelta(weeks=1),
        "2wk": pd.Timestamp.now() - pd.Timedelta(weeks=2),
        "1mo": pd.Timestamp.now() - pd.Timedelta(days=28),
    }.get(timeframe, pd.Timestamp.now() - pd.Timedelta(days=28)) # default to 1 month if invalid timeframe provided

    query = query_map.get(ticker, f"{ticker} stock") # Get the search query for the given ticker, or default to "{ticker} stock" if not in the query_map
    from_str = from_date.strftime("%Y-%m-%d") # Convert the from_date to a string in the format YYYY-MM-DD for the API request

    response = requests.get(
        "https://newsapi.org/v2/everything",
        params={
            "q": query,
            "from": from_str,
            "sortBy": "publishedAt",
            "apiKey": NEWS_API_KEY,
            "language": "en",
            "pageSize": 50, # max page size to get more articles in one request
        }
    )

    data = response.json() # Parse the JSON response from the API

    if data.get("status") != "ok": # Check if the API response indicates an error
        print(f"NewsAPI error: {data.get('message')}")
        return []
    
    results = []
    for article in data.get("articles", []): # Iterate over the list of articles in the API response
        title = article.get("title")
        timestamp = article.get("publishedAt") # Get the publication date as an ISO 8601 string
        if title and timestamp and title != "[Removed]": # Only include articles that have both a title and a timestamp
            results.append({"title": title, "timestamp": timestamp}) # Add the article to the results list as a dict with 'title' and 'timestamp'

    return results

## YFINANCE ##
import yfinance as yf # Yahoo Finance API wrapper to fetch stock data and news
def fetch_headlines(ticker: str, timeframe: str = "1mo") -> list[dict]:
    
    # Fetch from newsapi
    newsapi_articles = fetch_newsapi_headlines(ticker, timeframe)

    # Fetch from yfinance
    stock = yf.Ticker(ticker) # create a Ticker object for the given stock ticker
    news = stock.news # returns a list of articles, each article is a dict with keys like 'title', 'link', 'providerPublishTime', etc.
    
    # Combine and filter articles from both sources based on the timeframe
    cutoff = {
        "1d":  pd.Timestamp.now() - pd.Timedelta(days=1),
        "3d":  pd.Timestamp.now() - pd.Timedelta(days=3),
        "1wk": pd.Timestamp.now() - pd.Timedelta(weeks=1),
        "2wk": pd.Timestamp.now() - pd.Timedelta(weeks=2),
        "1mo": pd.Timestamp.now() - pd.Timedelta(days=28),
    }.get(timeframe, pd.Timestamp.now() - pd.Timedelta(days=28))

    yfinance_articles = []
    for n in news:
        content = n.get("content", {}) # get the 'content' dict from the article, which contains 'title' and 'pubDate'
        title = content.get("title")
        timestamp = content.get("pubDate") # get the publication date as a timestamp (in seconds since epoch)
        
        if title and timestamp: # only include articles that have both a title and a timestamp
            pub_date = pd.Timestamp(timestamp).tz_localize(None) # convert the timestamp to a pandas Timestamp object and remove timezone information for comparison
            if pub_date >= cutoff: # only include articles that were published after the cutoff date
                yfinance_articles.append({"title": title, "timestamp": timestamp})

    # Combine articles and deduplicate
    combined = newsapi_articles + yfinance_articles
    seen = set()
    unique = []
    for article in combined:
        title = article["title"]
        if title not in seen:
            seen.add(title)
            unique.append(article)

    print(f"Fetched {len(newsapi_articles)} NewsAPI + {len(yfinance_articles)} yfinance = {len(unique)} unique articles")

    return unique
