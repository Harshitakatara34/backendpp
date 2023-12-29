const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(req.headers);
  console.log(token);

  if (token) {
    try {
      const decode = jwt.verify(token, "harshi");
      console.log("decode", decode);

      if (decode) {
        console.log(req.body);
        req.user = decode;
        console.log(req.user);
        next();
      } else {
        res.send("Please login first");
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("Login first");
  }
};

module.exports = {
  auth,
};
