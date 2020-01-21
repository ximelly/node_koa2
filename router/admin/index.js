const Router = require("koa-router");
const reg = require("../../libs/reg");
const path = require("path");

let router = new Router();
router.use(async(ctx,next)=>{
    if(!ctx.session["adminID"]&&ctx.url!=="/admin/login"){
        ctx.redirect("/admin/login");
    }else if(ctx.session["adminID"]&&ctx.url=="/admin/login"){
        ctx.redirect("/admin");
    }else{
        await next();
    }
})

//引入登录相关路由
require("./login")(router);

//引入banner相关路由
require("./banner")(
    router,
    'banner',
    async (fields)=>{
        if(fields.image[0].size>0){
            fields.image=path.basename(fields.image[0].path);
        }else{
            delete fields.image;
        }
        return fields;
    },
    [
        {rule:reg.admin.title,name:"title",msg:"标题格式不对"},
        {rule:reg.admin.title,name:"sub_title",msg:"副标题格式不对"}
    ]
);

router.get("/",ctx=>{
    ctx.body="登录成功";
});
router.get("/car",ctx=>{
    ctx.body="car";
});

module.exports=router.routes();