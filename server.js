const Koa=require("koa");
const config=require("./config");
const opn=require("open");

let server=new Koa();

(async()=>{
    server.context.db=await require("./libs/mysql");
    server.use(async ctx=>{
        ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    })

    //redis
    // server.context.redis=await require("./libs/redis");
    // server.use(async ctx=>{
    //    await ctx.redis.setAsync("name","ximelly");
    //    ctx.body=await ctx.redis.getAsync("name","ximelly");
    // })

    server.listen(config.port);
    console.log(`server is running at ${config.port}`);
    opn(`http://localhost:${config.port}`)
})()