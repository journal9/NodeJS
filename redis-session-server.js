const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();

const redisStore = require("connect-redis")(session);
const PORT = 3000;
const redisClient = redis.createClient({ legacyMode: true });

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.log(err.message);
  });

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

const sessionStore = new redisStore({ client: redisClient });

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: "our_secret",
    cookie: {
      maxAge: 1000 * 10,
      sameSite: true,
      secure: false,
    },
  })
);

function welcomePage(req, res) {
  if (req.session.visited) {
    req.session.visited += 1;
  } else {
    req.session.visited = 1;
  }
  res.send({
    message:
      "you visited this page " + req.session.visited + " times , welcome!",
  });
}

function dashboardPage(req, res) {
  if (req.session.isLoggedIn) {
    res.send({ message: "welcome tyo dashboard" });
  } else {
    res.redirect("/");
  }
}

function loginPage(req, res) {
  if (req.session.isLoggedIn) {
    res.redirect("/dashboard");
  } else {
    req.session.isLoggedIn = true;
    res.send({ message: "successfully logged in user" });
  }
}

function logoutPage(req, res) {
  if (req.session.isLoggedIn) {
    req.session.isLoggedIn = false;
    res.redirect("/");
  } else {
    res.send({ message: "already logged out" });
  }
}

function leavePage(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
}

app.get("/", welcomePage);
app.get("/login", loginPage);
app.get("/dashboard", dashboardPage);
app.get("/logout", logoutPage);
app.get("/exit", leavePage);

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
