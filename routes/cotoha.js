var express = require("express");
var router = express.Router();
var request = require("request");

const token = "OKzuZ6PnHjHjY2UFvQ6ZDGgpjL5d";

router.post("/", (req, res) => {
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`
  };
  const dataString = '{"sentence":"青春を謳歌した。"}';
  const options = {
    url: "https://api.ce-cotoha.com/api/dev/nlp/v1/sentiment",
    method: "POST",
    headers: headers,
    body: dataString
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.send(body);
    }
  }
  request(options, callback);
  res.send(req.body.name);
});

router.get("/", (req, res) => {
  res.send(req.body.name);

  //   res.send("respond with a resource");
});

module.exports = router;
