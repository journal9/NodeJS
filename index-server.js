const Redis = require("ioredis");
const redis = new Redis();
// console.log(redis);

async function impleGetSet() {
  await redis.set("name", "Deepika",'ex',60);
  let myName = await redis.get("name");
  console.log(myName);
}
//impleGetSet()

async function impleSets() {
    await redis.sadd("abcset","def","ghi","mno");
    let ismemb = await redis.sismember("abcset","def")
    console.log(ismemb);
    let mem = await redis.smembers("abcset")
    console.log(mem);
    let num = await redis.scard('abcset')
    console.log(num)
  }
  impleSets()
