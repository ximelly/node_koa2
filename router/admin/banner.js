const config = require("../../config");
const {upload} = require("../../libs/body");


module.exports=(router,name,process,valids)=>{
    router.get(`/${name}`,async ctx=>{
        let banners=await ctx.db.query(`SELECT * FROM ${config.db_table_banner} ORDER BY ID DESC`);
        let fields={
            title:{title:"title",name:"title",type:"text"},
            sub_title:{title:"sub_title",name:"sub_title",type:"text"},
            image:{title:"image",name:"image",type:"files"}
        }
        await ctx.render(`admin/${name}`,{datas:banners,page_count:1,fields,name:"banner"});
    });
    router.post(`/${name}`,...upload({
        maxFileSize:5*1024*1024
    }),async ctx=>{
        let fields=await process(ctx.request.fields);
        let errors=[];
        valids.forEach(({rule,name,msg})=>{
            if(!rule.test(fields[name])){
                errors.push(msg);
            }
        })
        if(errors.length>0){
            ctx.body=errors.join(",");
        }else{
            let keys=[],values=[];
            for(let name in fields){
                keys.push(name);
                values.push(fields[name]);
            }
            await ctx.db.query(`INSERT INTO ${config[`db_table_${name}`]} (${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`,values);
            ctx.redirect(`/admin/${name}`);
        }
    });
}