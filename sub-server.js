// const Redis = require("ioredis");
// const redis = new Redis();

// redis.subscribe('msges');

// redis.on('message',(channel, message)=>{
//     console.log(`Received notification: ${message}`);
// })

const Redis = require('ioredis')
const redis = new Redis();

const main = () => {
  redis.subscribe("msge-hub", (err, count) => {
    if (err) console.error(err.message);
    console.log(`Subscribed to ${count} channels.`);
  });

  redis.on("message", (channel, message) => {
    console.log(`Received message from ${channel} channel.`);
    console.log(message);
  });
};

main();