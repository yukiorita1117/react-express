var express = require("express");
var router = express.Router();
var request = require("request");

const token = "OKzuZ6PnHjHjY2UFvQ6ZDGgpjL5d";
const globalStock = [];

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
      console.log("コンソールログ", body);
      res.send(body);
      globalStock.push(body);
      console.log("中身何？？？", globalStock);
    }
  }
  request(options, callback);
});

router.get("/", (req, res) => {
  const obj = JSON.parse(globalStock[0]);
  console.log(obj.result.emotional_phrase[0].emotion);

  res.json([
    {
      id: 1,
      text: "Cotohaって話"
    },
    {
      id: 2,
      text: "うまくいってる？？？"
    },
    {
      id: 3,
      text: obj.result.emotional_phrase[0].emotion
    }
  ]);
  //   res.send(req.body.name);
  //   res.send("respond with a resource");
});

module.exports = router;
