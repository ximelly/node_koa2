const config = require("../../config");
const {upload} = require("../../libs/body");
const path = require("path");
const reg = require("../../libs/reg");

module.exports=(router)=>{
    router.get("/banner",async ctx=>{
        let banners=await ctx.db.query(`SELECT * FROM ${config.db_table_banner} ORDER BY ID DESC`);
        let fields={
            title:{title:"title",name:"title",type:"text"},
            sub_title:{title:"sub_title",name:"sub_title",type:"text"},
            image:{title:"image",name:"image",type:"files"}
        }
        await ctx.render("admin/banner",{datas:banners,page_count:1,fields,name:"banner"});
    });
    router.post("/banner",...upload({
        maxFileSize:5*1024*1024
    }),async ctx=>{
        let {title,sub_title,image}=ctx.request.fields;
        image=path.basename(image[0].path);
        if(!reg.admin.title.test(title)){
            ctx.body="标题格式不对"
        }else if(!reg.admin.title.test(sub_title)){
            ctx.body="副标题格式不对"
        }else{
            await ctx.db.query(`INSERT INTO ${config.db_table_banner} (title,sub_title,image) VALUES(?,?,?)`,[title,sub_title,image]);
            ctx.redirect("/admin/banner");
        }
    });
}