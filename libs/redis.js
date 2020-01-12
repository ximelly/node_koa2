const redis=require("redis");
const bluebird=require("bluebird");
const config=require("../config");

let client=redis.createClient({
    host:config.redis_host
})
//promise化
//经过bluebird的处理，get、set编程getAsync、setAsync
bluebird.promisifyAll(redis.RedisClient.prototype);
client.on("error",err=>{
    console.log("error",err.code);
})
client.on("reconnecting",ev=>{
    console.log("reconnecting",ev.attampt);
})

module.exports=client;