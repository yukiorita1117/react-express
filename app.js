var createError = require("http-errors");
const express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("hbs");
const fs = require("fs");
var request = require("request");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cotohaRouter = require("./routes/cotoha");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));

//logをcliに表示するmiddleware(middlewareを使うには、app.useを使う)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//毎回ファイル読み込むのroutingするのだるい.固定化する
app.use(express.static(path.join(__dirname, "public"))); // app.use(express.static(__dirname + "public")); //上と同じ

// 自作middleware(上記全てのmiddlewareが当てはまらないものはここに入る)
// app.use((req, res, next) => {
//   console.log("自作したmiddlewareを表示しています。");
//   //次のmiddleware命令に行きなさいと言う意味
//   next();
// });

//__dirnameとはこのファイルのroot===REACT-EXPRESSになる。
app.use(express.static(__dirname + "/public/help.html"));

app.get("/", (req, res) => {
  res.send("<h1>HTMLも送れるよ。</h1>");
  next();
});

// POSTリクエストに対処
const token = "l7ekQ3zYbtyoivoamVIyGSYY1USG";
var globalStock = [];
var globalSentence = "";

app.post("/api/test", (req, res) => {
  // クライアントにステータスコード(200:成功)とともにレスポンスを返す
  res.status(200).send();
  const { inputText } = req.body;
  console.log("inputText", inputText);

  if (req.body.name === undefined) {
    req.body.name = "空だって悲しいね";
  }
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`
  };
  const dataString = `{"sentence":"${inputText}"}`;
  const options = {
    url: "https://api.ce-cotoha.com/api/dev/nlp/v1/sentiment",
    method: "POST",
    headers: headers,
    body: dataString
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("コンソールログ", body);
      //   res.send(obj.result.emotional_phrase[0].emotion);
      globalSentence = inputText;
      globalStock.push(body);
      console.log("globalStockに入ってればOK", globalStock);
    }
  }
  request(options, callback);
  globalStock.shift();
});

app.get("/api/test", (req, res) => {
  const obj = JSON.parse(globalStock[0]);
  console.log("なんか変更されてない？", obj.result.emotional_phrase[0].emotion);
  const resultArray = [
    {
      id: 1,
      inputText: `「${globalSentence}」`
    },
    {
      id: 2,
      inputText: "上記のフレーズを感情分析する。"
    },
    {
      id: 3,
      inputText: `「${obj.result.emotional_phrase[0].emotion}」`
    }
  ];
  globalStock.shift();

  console.log("どういうことなの？", resultArray);
  res.status(200).send(resultArray);
});

app.use("/index", indexRouter);
app.use("/users", usersRouter);

// test middleware
// app.use("/createLog", (req, res, next) => {
//   let now = new Date();
//   let log = `${now}${req.method}${req.originalUrl}`;
//   console.log("ログだよ！" + log);
//   //fsのappendFileを使ってログファイルを作成する。
//   fs.appendFile("server.log", log + "/n", err => {
//     if (err) {
//       console.log("errorですって話！");
//     }
//   });
//   next();
// });

// cotoha
app.use("/cotoha", cotohaRouter);

// reactからのrequestを表示するだけ
app.post("/create", (req, res) => {
  res.send(req.body.name);
  //ほんとやったらここでDBに向けてdataを送信したりする
});

//urlを取得
app.use("/user/:name?", (req, res) => {
  req.params.name
    ? res.send("hello, " + req.params.name)
    : res.send("hello, nobody !!");
});

//getの前にparamを噛ませてid渡す.第四引数に入ってきた値を設定できる
app.param("id", (req, res, next, id) => {
  var users = ["ゆきお", "のぶお", "みつお"];
  req.params.name = users[id];
  next();
});
app.get("/items/:id", (req, res) => {
  //配列にないものが来ると"undefind"が返る。
  res.send(
    `リクエストのメソッドは${req.method} リクエストのURLは${req.url} 
    で this account user name is  + ${req.params.name}`
  );
});

//別routingでもparams共通化
app.get("/nameTest/:id", (req, res) => {
  res.send("僕の名前は " + req.params.name);
});

//handlebars を使うために定義 順番的にproxyで送受信してるcreateの前だとエラーになる(proxyが参照できないらしい)
app.set("view engine", "hbs");

app.get("/about", (req, res, next) => {
  //view内にあるものは直接参照できる
  res.render("about.hbs", {
    pageTitle: "About Page",
    content: "コンテンツです。",
    currentYear: new Date().getFullYear()
  });
  next();
});
//メンテナンスページは重要度高いのでrouting的に上に設置する。
app.use((req, res, next) => {
  res.render("maintenance.hbs");
});

//パラメータに正規表現使う
// app.get("/items/:id([0-9]+)", (req, res) => {
//   res.send("your id is " + req.params.id);
// });

//内部ファイル読み込み
// app.use("/sample.txt", (req, res) => {
// __dirnameで今のディレクトリが取れる
// // res.sendfile(__dirname + "public/sample.txt");
//   res.send("先にこっちが映る");
// });

//------------------------------------------------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error pageを指定してないと
  res.status(err.status || 500);
  res.render("error.jade");
});

// portを指定する
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
