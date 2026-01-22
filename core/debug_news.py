import yfinance as yf
import feedparser
import json

def debug_yahoo():
    print("--- Yahoo News Item Structure ---")
    try:
        ticker = yf.Ticker("^GSPC")
        news = ticker.news
        if news:
            # Print the first item's structure (keys/values) to see where images are
            # Use json dumps for pretty printing if possible, but handle non-serializable objects (though news is usually dicts)
            print(json.dumps(news[0], indent=2))
        else:
            print("No Yahoo news found.")
    except Exception as e:
        print(f"Yahoo Error: {e}")

def debug_bbc():
    print("\n--- BBC News Item Structure ---")
    try:
        feed = feedparser.parse("http://feeds.bbci.co.uk/news/business/rss.xml")
        if feed.entries:
            # Print first entry
            # feedparser entries are not simple dicts, they are 'FeedParserDict'. 
            # We can't json dump them directly easily without conversion or careful selection.
            # Let's print the keys and 'media_content'/'media_thumbnail' specifically.
            entry = feed.entries[0]
            print(f"Keys: {entry.keys()}")
            
            if 'media_content' in entry:
                print(f"Media Content: {entry.media_content}")
            
            if 'media_thumbnail' in entry:
                print(f"Media Thumbnail: {entry.media_thumbnail}")
                
            # Try to print everything for inspection if possible
            print(entry)
        else:
            print("No BBC news found.")
    except Exception as e:
        print(f"BBC Error: {e}")

if __name__ == "__main__":
    with open("debug_result.txt", "w", encoding="utf-8") as f:
        import sys
        sys.stdout = f
        debug_yahoo()
        debug_bbc()
