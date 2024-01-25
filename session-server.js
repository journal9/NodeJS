const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const app = express();
const port = process.env.port || 3000;

app.use(cookieParser());
app.use(
  session({ secret: "its secret", resave: false, saveUninitialized: true })
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
    res.redirect("/dashboard")
  } else {
    req.session.isLoggedIn = true
    res.send({ message: "successfully logged in user" });
  }
}

function logoutPage(req, res) {
    if (req.session.isLoggedIn) {
      req.session.isLoggedIn = false
      res.redirect('/')
    } else {
      res.send({ message: "already logged out" });
    }
  }

app.get("/", welcomePage);
app.get("/login", loginPage);
app.get("/dashboard", dashboardPage);
app.get("/logout", logoutPage);

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
