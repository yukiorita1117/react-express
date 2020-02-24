var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//毎回ファイル読み込むのroutingするのだるい.固定化する
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname + "public")); //上と同じ

// middleware
app.use("/", indexRouter);
app.use("/users", usersRouter);
//urlを取得
app.use("/user/:name?", (req, res) => {
  req.params.name
    ? res.send("hello, " + req.params.name)
    : res.send("hello, nobody !!");
});
//パラメータに正規表現使う
app.use("/items/:id([0-9]+)", (req, res) => {
  res.send("your id is " + req.params.id);
});

//内部ファイル読み込み
app.use("/sample.txt", (req, res) => {
  //__dirnameで今のディレクトリが取れる
  // res.sendfile(__dirname + "public/sample.txt");
  res.send("先にこっちが映る");
});

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

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// portを指定する
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
