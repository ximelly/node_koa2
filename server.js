const Koa = require("koa");
const config = require("./config");
const opn = require("open");
const Router = require("koa-router");
const body=require("./libs/body");

let server = new Koa();

(async () => {
    //mysql
    // server.context.db=await require("./libs/mysql");
    // server.use(async ctx=>{
    //     ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    // })

    //redis
    //server.context.redis=await require("./libs/redis");
    // server.use(async ctx=>{
    //    await ctx.redis.setAsync("name","ximelly");
    //    ctx.body=await ctx.redis.getAsync("name");
    // })

    //session
    await require("./libs/session")(server);
    server.use(async ctx=>{
        if(ctx.session.view){
            ctx.session.view++;
        }else{
            ctx.session.view=1;
        }
        ctx.body=`第${ctx.session.view}次访问`;
    })

    //获取系统相关信息
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
    //全局错误处理
    server.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.status = 500;
            ctx.body = "internet error";
            console.log(error);
        }
    })

    router.post("/api",
        body.post(),
        async ctx => {
            ctx.body = ctx.request.fields;
        }
    );

    router.post("/upload",
        ...body.upload({
            maxFileSize:10*1024,
            fileExceed:async(ctx)=>{
                ctx.body = "老铁，文件太大了喔";
            },
            error:async(ctx,e)=>{
                ctx.body = `老铁，出错了喔,${e.message}`;
            }
        }),
        ctx => {
            ctx.body = "文件上传成功";
        }
    );

    server.use(router.routes());
    server.listen(config.port);
    //opn(`http://localhost:${config.port}`)
})()