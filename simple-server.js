const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = process.env.port || 3000;

async function fetchApi(req, res) {
  try {
    const apiRes = await axios.get(`https://reqres.in/api/users?delay=3`);
    console.log(req.body)
    if (apiRes.data) {
      console.log("received");
    } else {
      console.log("not received");
    }
    console.log(apiRes);
    //   await res.json({data: req.data});
    res.send({ fromCache: false, data: apiRes.data });
  } catch (error) {
    console.log(error);
  }
}

app.get("/fetch", fetchApi);
app.get("/", fetchApi);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
