module.exports = {  
  'mongodb_local_uri': 'mongodb://localhost:27017/fp', // local testing mongodb setting
  'qi_py_hostname': 'qi-py.mybluemix.net',


  TOKEN_SECRET: process.env.TOKEN_SECRET || 'bob',

  // OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '84e952da26fc9e7a12bbc32523efa8a0',
  FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'YOUR_FOURSQUARE_CLIENT_SECRET',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '60a7bd2950e333c6d2144b583cb1e5d34cdd5754',
  INSTAGRAM_SECRET: process.env.INSTAGRAM_SECRET || 'YOUR_INSTAGRAM_CLIENT_SECRET',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET',
  TWITCH_SECRET: process.env.TWITCH_SECRET || 'YOUR_TWITCH_CLIENT_SECRET',
  WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || 'YOUR_MICROSOFT_CLIENT_SECRET',
  YAHOO_SECRET: process.env.YAHOO_SECRET || 'YOUR_YAHOO_CLIENT_SECRET',
  BITBUCKET_SECRET: process.env.BITBUCKET_SECRET || 'YOUR_BITBUCKET_CLIENT_SECRET',
  SPOTIFY_SECRET: process.env.SPOTIFY_SECRET || 'YOUR_SPOTIFY_CLIENT_SECRET',

  // OAuth 1.0
  TWITTER_KEY: process.env.TWITTER_KEY || 'vdrg4sqxyTPSRdJHKu4UVVdeD',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA',

  //upload path
  DOC_UPLOAD_PATH: process.env.DOC_UPLOAD_PATH || '/tmp/',
  
  //Emal verification
  REDIRECT_PATH_SUCCESS_EMAIL_VERIFICATION : 'http://localhost:3000/#/login/home',

  //Log file path
  LOG_PATH: process.env.LOG_PATH || '/tmp/qi_node.log'
};
