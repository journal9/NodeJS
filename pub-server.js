// const Redis = require("ioredis");
// const redis = new Redis();

// redis.publish('msges',"hello there")

const { default: axios } = require("axios");
const express = require("express");
const Redis = require("ioredis");
const redis = new Redis();
const port = process.env.port || 3000;
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

async function msgeSendApi(req, res) {
  try {
    const data = req.body;
    redis.publish("msge-hub", JSON.stringify(data.message));
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
}

app.post("/send", msgeSendApi);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});