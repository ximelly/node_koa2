const config = require("../../config");
const {upload} = require("../../libs/body");


module.exports=(router,name,process,message)=>{
    router.get(`/${name}`,async ctx=>{
        let datas=await ctx.db.query(`SELECT * FROM ${config[`db_table_${name}`]} ORDER BY ID DESC`);
        await ctx.render(`admin/${name}`,{datas,page_count:1,message,name:`${name}`});
    });

    router.post(`/${name}`,...upload({
        maxFileSize:5*1024*1024
    }),async ctx=>{
        //获取到用户提交内容并进行初步处理
        let fields=await process(ctx.request.fields);

        //校验用户提交内容
        let errors=[];
        for(let name in message){
            let {rule,msg}=message[name];
            if(!rule)continue;
            if(!rule.test(fields[name])){
                errors.push(msg);
            }
        }
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