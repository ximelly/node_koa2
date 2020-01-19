const Router = require("koa-router");
const pass = require("../../libs/password");
const {post} = require("../../libs/body");
const config = require("../../config");

let router = new Router();
router.get("/login",async ctx=>{
    await ctx.render("admin/login",{error:null,username:null,password:null});
});
router.post("/login",post(),async ctx=>{
    let {username,password}=ctx.request.fields;
    let rows=await ctx.db.query(`SELECT ID,password FROM ${config.db_table_car} WHERE username=?`,[username]);
    if(rows.length==0){
        await ctx.render("admin/login",{error:`${username}用户不存在`,username,password});
    }else{
        if(rows[0].password==pass(password)){
            ctx.body="登录成功"
        }else{
            await ctx.render("admin/login",{error:'用户名或密码错误',username,password});
        }
    }
    
});
router.get("/index",ctx=>{
    ctx.body="page index";
});

module.exports=router.routes();