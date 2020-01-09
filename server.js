const Koa=require("koa");
const config=require("./config");

let server=new Koa();

(async()=>{
    server.context.db=await require("./libs/mysql");
    server.use(async ctx=>{
        ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    })

    server.listen(config.port);
    console.log(`server is running at ${config.port}`);
})()