const config = require("../../config");
const {upload} = require("../../libs/body");


module.exports=(router,name,process,message,pageSize=5)=>{
    router.get(`/${name}`,async ctx=>{  
        ctx.redirect(`/admin/${name}/1`);
    });
    router.get(`/${name}/:page`,async ctx=>{
        //计算一共有多少页数据
        let allCount=await ctx.db.query(`SELECT count(*) AS count FROM ${config[`db_table_${name}`]}`)
        let count=allCount[0].count;
        let page_count=Math.ceil(count/pageSize);

        //获取当前页
        let {page}=ctx.params;
        page=parseInt(page);
        if(isNaN(page)||page<1){
            page=1;
        }else if(page>page_count){
            page=page_count;
        }

        let datas=await ctx.db.query(`SELECT * FROM ${config[`db_table_${name}`]} ORDER BY ID DESC LIMIT ?,?`,[(page-1)*pageSize,pageSize]);


        await ctx.render(`admin/table`,{name:`${name}`,datas,message,page_count,page});
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