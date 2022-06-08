const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
const users = [
  {
    username: "admin",
    password: "admin",
  },
  {
    username: "user",
    password: "user",
  },
];
//Verify Token middleware
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};

//Protected Route /api
app.get("/api", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({
        message: "Forbidden",
      });
    } else {
      res.json({
        message: "Protected route",
        authData,
      });
    }
  });
});

//Login Route and JWT token generation
app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = users.find((u) => u.username == req.body.username);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const hashed = await bcrypt.hash(user.password, 10);
    const isMatch = await bcrypt.compare(req.body.password, hashed);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ user }, "secretkey", { expiresIn: "10s" });
    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
