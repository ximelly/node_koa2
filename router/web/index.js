const Router = require("koa-router");

let router = new Router();
router.get("/",ctx=>{
    ctx.body="page index";
});

module.exports=router.routes();