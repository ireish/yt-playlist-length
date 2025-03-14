def extract_playlist_id(url: str) -> str:
    """
    Extract playlist ID from various YouTube URL formats.
    Examples:
    - https://www.youtube.com/playlist?list=PLAYLIST_ID
    - https://youtube.com/playlist?list=PLAYLIST_ID
    - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
    """
    import re
    import urllib.parse
    print(url)
    # Check if the input is already just a playlist ID (no URL components)
    if re.match(r'^[a-zA-Z0-9_-]+$', url):
        return url
         
    try:
        # Parse the URL
        parsed_url = urllib.parse.urlparse(url)
        
        # Get query parameters
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        # Look for 'list' parameter (playlist ID)
        if 'list' in query_params and query_params['list']:
            return query_params['list'][0]
    except:
        pass
        
    return None