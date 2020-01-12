const redis=require("redis");
const bluebird=require("bluebird");
const config=require("../config");

let client=redis.createClient({
    host:config.redis_host,
    port:config.redis_port,
    password:config.redis_pass
})
//promise化
//经过bluebird的处理，get、set编程getAsync、setAsync
bluebird.promisifyAll(redis.RedisClient.prototype);
client.on("error",err=>{
    console.log("error",err.code);
})
client.on("reconnecting",ev=>{
    console.log("reconnecting",ev.attempt);
})

module.exports=client;