const Koa = require("koa");
const config = require("./config");
const opn = require("open");
const body = require("koa-better-body");
const convert = require("koa-convert");
const Router = require("koa-router");

let server = new Koa();

(async () => {
    // server.context.db=await require("./libs/mysql");
    // server.use(async ctx=>{
    //     ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    // })

    //redis
    // server.context.redis=await require("./libs/redis");
    // server.use(async ctx=>{
    //    await ctx.redis.setAsync("name","ximelly");
    //    ctx.body=await ctx.redis.getAsync("name","ximelly");
    // })


    const net_msg = await require("./libs/network");
    net_msg.forEach(item => {
        if (config.port == "80") {
            console.log(`server is running at http://${item.address}${config.port == "80" ? '' : ':' + config.port}`);
        } else {
            console.log(`server is running at http://${item.address}:${config.port}`);
        }
    });


    //router
    let router = new Router();
    server.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.status = 500;
            ctx.body = "internet error";
        }
    })
    router.post("/upload",
        async (ctx, next) => {
            try {
                await next();
            } catch (e) {
                if (e.message.startsWith("maxFileSize exceeded")) {
                    ctx.body = "文件过大";
                } else {
                    throw e;
                }
            }
        },
        convert(body({
            uploadDir: "./upload",
            maxFileSize: 10
        })),
        async ctx => {
            ctx.body = "文件上传成功";
        }
    );

    server.use(router.routes());
    server.listen(config.port);
    //opn(`http://localhost:${config.port}`)
})()