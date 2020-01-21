const Router = require("koa-router");
const reg = require("../../libs/reg");

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
    {
        title:{title:"title",name:"title",type:"text",rule:reg.admin.title,msg:"标题格式不对"},
        sub_title:{title:"sub_title",name:"sub_title",type:"text",rule:reg.admin.title,msg:"副标题格式不对"},
        image:{title:"image",name:"image",type:"files"}
    }
);

//引入car相关路由
require("./banner")(
    router,
    'car',
    {
        title:{title:"title",name:"title",type:"text",rule:reg.admin.title,msg:"标题格式不对"},
        price:{title:"price",name:"price",type:"number"},
        images:{title:"images",name:"images",type:"files",showInTable:false},
        features:{title:"features",name:"features",type:"fields",showInTable:false},
        description:{title:"description",name:"description",type:"textarea"},
    }
);

router.get("/",ctx=>{
    ctx.body="登录成功";
});

module.exports=router.routes();