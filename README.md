# HappyScroll

HappyScroll is a web app that displays your Reddit saved posts randomly with next/previous navigation.

## Setup

1. Create a Reddit app at [Reddit Apps](https://www.reddit.com/prefs/apps).
   - Type: web app
   - Redirect URI: any valid URL (e.g., http://localhost:8080/callback)
2. Generate a permanent refresh token using an OAuth helper.
3. Deploy this repo on Render.com (connect GitHub).

### Environment Variables

```
PORT=3000
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
USER_AGENT=web:happyscroll:v1.0 (by /u/YOUR_USERNAME)
REFRESH_TOKEN=your_refresh_token
```
