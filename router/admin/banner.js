const config = require("../../config");
const {upload} = require("../../libs/body");
const path = require("path");

module.exports=(router,name,message,pageSize=5)=>{
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
        let datas=ctx.request.fields;
        for(let name in message){
            let field=message[name];
            switch (field.type){
                case "file" :
                    if(datas[name][0].size>0){
                        datas[name]=path.basename(datas[name][0].path);
                    }else{
                        delete datas[name];
                    }
                break;
                case "files" :
                    if(datas[name][0].size>0){
                        datas[name]=datas[name].map(img=>path.basename(img.path)).join(",");
                    }else{
                        delete datas[name];
                    }
                break;
                case "fields" ://key|value,key|value,key|value...
                    let arr=[];
                    datas[`${name}_key`].forEach((element,index) => {
                        arr.push(element+"|"+datas[`${name}_value`][index]);
                    });
                    delete datas[`${name}_key`];
                    delete datas[`${name}_value`];
                    datas[`${name}`]=arr.join(",");
                break;
            }
        }

         //校验用户提交内容
         let errors=[];
         for(let name in message){
             let {rule,msg}=message[name];
             if(!rule)continue;
             if(!rule.test(datas[name])){
                 errors.push(msg);
             }
         }
         if(errors.length>0){
             ctx.body=errors.join(",");
         }else{
             let keys=[],values=[];
             for(let name in datas){
                 keys.push(name);
                 values.push(datas[name]);
             }
             await ctx.db.query(`INSERT INTO ${config[`db_table_${name}`]} (${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`,values);
             ctx.redirect(`/admin/${name}`);
         }
    });
}