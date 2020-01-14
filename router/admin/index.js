const Router = require("koa-router");

let router = new Router();
router.get("/index",ctx=>{
    ctx.body="page admin";
});

module.exports=router.routes();