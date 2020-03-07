var express = require("express");
var router = express.Router();
var request = require("request");

const token = "OKzuZ6PnHjHjY2UFvQ6ZDGgpjL5d";
const globalStock = [];

//`{"sentence":"${req.body.name}"}`

router.post("/", (req, res) => {
  console.log(req.body.name);
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
      //   res.send(body);
      const obj = JSON.parse(body);
      res.send(obj.result.emotional_phrase[0].emotion);

      globalStock.push(body);
      console.log("中身何？？？", globalStock);
    }
  }
  request(options, callback);
});

router.get("/", (req, res) => {
  const obj = JSON.parse(globalStock[0]);

  res.json([
    {
      id: 1,
      text: "「青春を謳歌した。」"
    },
    {
      id: 2,
      text: "上記のフレーズを感情分析する。"
    },
    {
      id: 3,
      text: `「${obj.result.emotional_phrase[0].emotion}」`
    }
  ]);
});

module.exports = router;
