var express = require("express");
var router = express.Router();
var request = require("request");

const token = "OKzuZ6PnHjHjY2UFvQ6ZDGgpjL5d";
var globalStock = [];
var globalSentence = "";

//`{"sentence":"${req.body.name}"}`

router.post("/", (req, res, next) => {
  if (req.body.name === undefined) {
    req.body.name = "空だって悲しいね";
  }
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`
  };
  const dataString = `{"sentence":"${req.body.name}"}`;
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
      //   res.send(obj.result.emotional_phrase[0].emotion);
      globalSentence = req.body.name;
      globalStock.push(body);
      console.log("中身何？？？", globalStock);
    }
  }
  request(options, callback);
  res.render("cotoha.hbs");
});

router.get("/", (req, res) => {
  const obj = JSON.parse(globalStock[0]);
  console.log("なんか変更されてない？", globalStock);
  //   res.send(obj.result.emotional_phrase[0].emotion);
  res.json([
    {
      id: 1,
      text: `${globalSentence}`
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
  globalStock.shift();
});

module.exports = router;
