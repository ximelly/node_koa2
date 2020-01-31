const pass = require("../../libs/password");
const {post} = require("../../libs/body");
const config = require("../../config");
const {admin} = require("../../libs/reg");

module.exports=(router)=>{
    router.get("/login",async ctx=>{
        await ctx.render("admin/login",{error:null,username:null,password:null});
    });
    
    router.post("/login",post(),async ctx=>{
        let {username,password}=ctx.request.fields;
        username=username.toLowerCase();
    
        async function render(msg){
            await ctx.render("admin/login",{error:msg,username,password});
        }
        //数据校验
        if(!admin.username.test(username)){
            await render("用户名格式不对，必须4-32为字母或汉字");
        }else if(!admin.password.test(password)){
            await render("密码格式不对，必须3-32为字母或汉字");
        }else{
            let rows=await ctx.db.query(`SELECT ID,password FROM ${config.db_table_car} WHERE username=?`,[username]);
            if(rows.length==0){
                await render(`${username}用户不存在`);
            }else{
                if(rows[0].password==pass(password)){
                    ctx.session["adminID"]=rows[0].ID;
                    ctx.redirect("/admin");
                }else{
                    await render(`用户名或密码错误`);
                }
            }
        }
    });
}