const Router = require("koa-router");

let router = new Router();
router.get("/login",async ctx=>{
    await ctx.render("admin/login");
});
router.get("/index",ctx=>{
    ctx.body="page index";
});

module.exports=router.routes();