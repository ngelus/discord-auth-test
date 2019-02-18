const config = require("../config.json");
const btoa = require("btoa");
const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
const redirect = encodeURIComponent('https://discord-auth-test.glitch.me/login_callback');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Discord-Auth-Test' });
});

router.get('/login', function(req, res, next) {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${process.env.client_id}&redirect_uri=${redirect}&response_type=code&scope=identify&state=xyz123`);
});

router.get('/login_callback', async function(req, res, next) {
  var code = req.query.code;
  var creds = btoa(`${process.env.client_id}:${process.env.client_secret}`);
  var response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
   {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  var json = await response.json();
  var response2 = await fetch(`http://discordapp.com/api/users/@me`,
   {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });
  var json2 = await response2.json();
  res.send({j1: json, j2: json2});
});

router.get('/done', async function(req, res, next) {
  
});

module.exports = router;
