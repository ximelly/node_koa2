const Router = require("koa-router");
const reg = require("../../libs/reg");
const config = require("../../config");

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

let tabs=[
    {title:"车辆管理",href:"/admin/car/1",name:"car"},
    {title:"banner管理",href:"/admin/banner/1",name:"banner"},
    {title:"留言管理",href:"/admin/msg",name:"msg"}
];

//引入登录相关路由
require("./login")(router);

//引入banner相关路由
require("./banner")(
    router,
    'banner',
    {
        title:{title:"title",name:"title",type:"text",rule:reg.admin.title,msg:"标题格式不对"},
        sub_title:{title:"sub_title",name:"sub_title",type:"text",rule:reg.admin.title,msg:"副标题格式不对"},
        image:{title:"image",name:"image",type:"file"}
    },
    tabs
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
    },
    tabs
);

router.get("/",ctx=>{
    ctx.body="登录成功";
});
router.get("/msg",async ctx=>{
    let datas=await ctx.db.query(`SELECT * FROM ${config.db_msg} ORDER BY ID DESC`);
    await ctx.render(`admin/msg`,{datas,tabs,curent_tab:2});
});

module.exports=router.routes();