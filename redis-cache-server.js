const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = process.env.port || 3000;
const Redis = require("ioredis");
const redis = new Redis();

async function fetchApi(req,res) {
  const cachedData = await redis.get("cachedData");
  if (!cachedData) {
    try {
      const apiRes = await axios.get(`https://reqres.in/api/users?delay=3`);
      if (apiRes.data) {
        console.log("received");
      } else {
        console.log("not received");
      }
      let resData = apiRes.data
      await redis.set('cachedData', JSON.stringify(resData), 'EX', 60);//seconds
      res.send({ data: resData });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('fetched from cache')
    const resData = JSON.parse(cachedData);
    res.send({ fromCache: false, data: resData });
  }
}

app.get("/fetch", fetchApi);
app.get("/", fetchApi);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
