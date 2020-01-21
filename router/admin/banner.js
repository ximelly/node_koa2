const config = require("../../config");

module.exports=(router)=>{
    router.get("/banner",async ctx=>{
        let banners=await ctx.db.query(`SELECT * FROM ${config.db_table_banner} `);
        console.log(banners);
        await ctx.render("admin/banner",{datas:banners,page_count:1});
    });
}