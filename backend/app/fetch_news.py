import yfinance as yf # Yahoo Finance API wrapper to fetch stock data and news
def fetch_headlines(ticker: str) -> list[dict]:
    stock = yf.Ticker(ticker) # create a Ticker object for the given stock ticker
    news = stock.news # returns a list of articles, each article is a dict with keys like 'title', 'link', 'providerPublishTime', etc.
    results = []
    for n in news:
        content = n.get("content", {}) # get the 'content' dict from the article, which contains 'title' and 'pubDate'
        title = content.get("title")
        timestamp = content.get("pubDate") # get the publication date as a timestamp (in seconds since epoch)
        
        if title and timestamp: # only include articles that have both a title and a timestamp
            results.append({"title": title, "timestamp": timestamp})
    
    return results