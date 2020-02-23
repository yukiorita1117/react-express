var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json([
    {
      id: 1,
      username: "JSON_HardCoderって話"
    },
    {
      id: 2,
      username: "おりたゆきお"
    }
  ]);
});

module.exports = router;
