
const Router = require("koa-router");
const body=require("../libs/body");
const static = require("./static");
const path = require("path");
const send = require("koa-send");
const {uploadDir} = require("../config");

let router = new Router();

router.use("",require("./web"));
router.use("/admin",require("./admin"));
router.use("/api",require("./api"));
router.use("/single/:id",async ctx=>{
    let {id}=ctx.params;
    await ctx.render('web/single',{id});
});
router.use("/upload/:img",async ctx=>{
    let {img}=ctx.params;
    await send(ctx,img,{
        maxAge:60*86400*1000,
        immutable:true,//永远不会变，直接使用缓存
        root:uploadDir
    });
});
static(router);

//一下两个router用于测试post请求
router.post("/api",
    body.post(),
    async ctx => {
        ctx.body = ctx.request.fields;
    }
);
router.post("/upload",
    ...body.upload({
        maxFileSize:100*1024,
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

module.exports=router.routes();