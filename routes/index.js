const { OAuth2Client } = require('google-auth-library');

var express = require('express');
var router = express.Router();

// 載入 GCP OAuth 2.0 用戶端 ID 憑證
const keys = require(__dirname + '/../client_secret.json');

router.get('/', async function(req, res, next) {
  const oAuth2c = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  // scopes 參考: https://developers.google.com/people/api/rest/v1/people/get
  const authorizeUrl = oAuth2c.generateAuthUrl({
    access_type: 'offline',
    // 欲取得 email, 要兩個 scopes
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
  });

  // qs 內容參考 /references/redirect-query-string.json
  const qs = req.query;

  let myData = {};

  if(qs.code){

    // 內容參考 /references/from-code-to-tokens.json
    const r = await oAuth2c.getToken(qs.code);
    console.log(JSON.stringify(r));
    oAuth2c.setCredentials(r.tokens);
    
    // 連線回應內容參考 /references/tokeninfo-results-oauth2.googleapis.com.json
    console.log(`https://oauth2.googleapis.com/tokeninfo?id_token=${r.tokens.id_token}`)

    const url = 'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';
    
    const response = await oAuth2c.request({url});
    // response 內容參考 /references/people-api-response.json
    myData = response.data;
  }

  res.render('index', { title: 'Shin', authorizeUrl, qs, myData });
});

module.exports = router;
