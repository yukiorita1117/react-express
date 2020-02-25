//他のファイルからも使いたい関数はexports.indexとかく
exports.index = (req, res) => {
  res.render("client/src/App");
};
