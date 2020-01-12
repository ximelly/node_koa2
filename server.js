const Koa = require("koa");
const fs=require('promise-fs');
const config = require("./config");
const opn = require("open");
const Router = require("koa-router");
const session = require("koa-session");
const body=require("./libs/body");

let server = new Koa();

(async () => {
    //mysql
    // server.context.db=await require("./libs/mysql");
    // server.use(async ctx=>{
    //     ctx.body=await ctx.db.query(`SELECT * FROM ${config.db_table} LIMIT 10`)
    // })

    //redis
    //server.context.redis=client;
    // server.use(async ctx=>{
    //    await ctx.redis.setAsync("name","ximelly");
    //    ctx.body=await ctx.redis.getAsync("name");
    // })

    
    const client=await require("./libs/redis");

    //session
    try{
        let buffer=await fs.readFile(config.key_path);
        server.keys=JSON.parse(buffer.toString());
    }catch(e){
        console.log("读取key失败，请重新生成");
        return;
    }
    
    server.use(session({
        maxAge:config.session_maxage,
        renew:true,//快过期了自动更新
        store:{
            async get(key){
                let data=await client.getAsync(key);
                if(!data) return {};
                try{
                    return JSON.parse(data);
                }catch(e){
                    return {};
                }
                
            },
            async set(key,value,maxAge){
                //setAsync
                //psetexAsync:设置带有有效期的值
                await client.psetexAsync(key,maxAge,JSON.stringify(value));
            },
            async destroy(key){
                await client.delAsync(key);
            }
        }
    },server))
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