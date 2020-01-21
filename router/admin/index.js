const Router = require("koa-router");

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
require("./banner")(router);

router.get("/",ctx=>{
    ctx.body="登录成功";
});
router.get("/car",ctx=>{
    ctx.body="car";
});

module.exports=router.routes();