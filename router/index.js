
const Router = require("koa-router");
const body=require("../libs/body");

let router = new Router();

router.use("",require("./web"));
router.use("/admin",require("./admin"));


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