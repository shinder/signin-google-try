const { OAuth2Client } = require('google-auth-library');

var express = require('express');
var router = express.Router();

// 載入 GCP OAuth 2.0 用戶端 ID 憑證
const keys = require(__dirname + '/../client_secret.json');

/* GET home page. */
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

  const qs = req.query;
  /*
    {
    "code": "4/0AdQt8qha385aZL1cVhlwD-SKuk9jDufqiodir_HU634YrFVKlLp8hL1FmlTc2r0Eilk8JQ",
    "scope": "profile https://www.googleapis.com/auth/userinfo.profile"
    }
  */
  let myData = {};

  if(qs.code){
    const r = await oAuth2c.getToken(qs.code);
    oAuth2c.setCredentials(r.tokens);
    console.log({tokens: r.tokens});
    // https://oauth2.googleapis.com/tokeninfo?id_token=${r.tokens.id_token}`,

    const url = 'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';
    const res = await oAuth2c.request({url});
    console.log(res);
    myData = res;
    /*
    {
        "resourceName": "people/111522673716625737606",
        "etag": "%EgUBAi43PRoEAQIFByIMZDdDTjR0TThEclE9",
        "names": [
            {
                "metadata": {
                    "primary": true,
                    "source": {
                        "type": "PROFILE",
                        "id": "111522673716625737606"
                    },
                    "sourcePrimary": true
                },
                "displayName": "Shinder Lin",
                "familyName": "Lin",
                "givenName": "Shinder",
                "displayNameLastFirst": "Lin, Shinder",
                "unstructuredName": "Shinder Lin"
            }
        ]
    }
    */
  }
  


  res.render('index', { title: 'Shin', authorizeUrl, qs, myData });
});

module.exports = router;
