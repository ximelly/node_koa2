const Koa = require("koa");
const config = require("./config");
const opn = require("open");
const fs = require("promise-fs");

let server = new Koa();

(async () => {
    //mysql
    // server.context.db=await require("./libs/mysql");
    // server.use(async ctx=>{
    //     ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    // })

    //redis
    server.context.redis=await require("./libs/redis");
    // server.use(async ctx=>{
    //    await ctx.redis.setAsync("name","ximelly");
    //    ctx.body=await ctx.redis.getAsync("name");
    // })

    //session
    //await require("./libs/session")(server);
    // server.use(async ctx=>{
    //     if(ctx.session.view){
    //         ctx.session.view++;
    //     }else{
    //         ctx.session.view=1;
    //     }
    //     ctx.body=`第${ctx.session.view}次访问`;
    // })

    //获取系统相关信息
    const net_msg = await require("./libs/network");
    net_msg.forEach(item => {
        if (config.port == "80") {
            console.log(`server is running at http://${item.address}${config.port == "80" ? '' : ':' + config.port}`);
        } else {
            console.log(`server is running at http://${item.address}:${config.port}`);
        }
    });

    let error_404="";
    try {
        error_404=fs.readFileSync(config.error_404);
        error_404=error_404.toString();
    } catch (error) {
        console.log("404 file is not found");
    }
    let error_500="";
    try {
        error_500=fs.readFileSync(config.error_500);
        error_500=error_500.toString();
    } catch (error) {
        console.log("500 file is not found");
    }
    //全局错误处理
    server.use(async (ctx, next) => {
        try {
            await next();
            if(ctx.status==404){
                ctx.body=error_404||"not found";
            }
            if(ctx.status==500){
                ctx.body=error_500||"Internet Server Error";
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body=error_500||"Internet Server Error";
            console.log(error);
        }
    })

    server.use(require("./router"));
    server.listen(config.port);
    //opn(`http://localhost:${config.port}`)
})()