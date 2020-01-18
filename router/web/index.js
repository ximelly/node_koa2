const Router = require("koa-router");
const contentStatic = require("../../libs/contentStatic");
let router = new Router();


router.get("/",
    contentStatic("page:"),//内容静态化
    ctx=>{
        ctx.body="page index";
    }
);

module.exports=router.routes();