const config = require("../../config");
const {upload} = require("../../libs/body");
const path = require("path");

module.exports=(router)=>{
    router.get("/banner",async ctx=>{
        let banners=await ctx.db.query(`SELECT * FROM ${config.db_table_banner} `);
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
        await ctx.db.query(`INSERT INTO ${config.db_table_banner} (title,sub_title,image) VALUES(?,?,?)`,[title,sub_title,image]);
        ctx.redirect("/admin/banner");
    });
}