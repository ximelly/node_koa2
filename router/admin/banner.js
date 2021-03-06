const config = require("../../config");
const {upload} = require("../../libs/body");
const path = require("path");
const fs = require("promise-fs");

module.exports=(router,name,message,tabs,pageSize=5)=>{
    async function preProgress(ctx,next){
        //获取到用户提交内容并进行初步处理
        let datas=ctx.request.fields;
        for(let name in message){
            let field=message[name];
            switch (field.type){
                case "file" :
                    if(datas[name][0].size>0){
                        datas[name]=path.basename(datas[name][0].path);
                    }else{
                        try{
                            await fs.unlink(datas[name][0].path);
                        }catch(e){
                            console.log(e);
                        }
                        delete datas[name];
                    }
                break;
                case "files" :
                    for(let i=0,len=datas[name].length;i<len;i++){
                        if(datas[name][i].size==0){
                            try{
                                await fs.unlink(datas[name][i].path);
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }
                    datas[name]=datas[name].filter(img=>{
                        return img.size;
                    }).map(img=>path.basename(img.path)).join(",");
                break;
                case "fields" ://key|value,key|value,key|value...
                    let arr=[];
                    //当fields只有一个时是字符串，统一处理成数组
                    if(datas[`${name}_key`]&&typeof datas[`${name}_key`]=='string'){
                        datas[`${name}_key`]=[datas[`${name}_key`]];
                        datas[`${name}_value`]=[datas[`${name}_value`]];
                    }
                    if(datas[`${name}_key`]){
                        datas[`${name}_key`].forEach((element,index) => {
                            arr.push(element+"|"+datas[`${name}_value`][index]);
                        });
                    }
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
            ctx.datas=datas;
            await next();
        }
        
    }

    //没带页码重定向
    router.get(`/${name}`,async ctx=>{  
        ctx.redirect(`/admin/${name}/1`);
    });

    //分页
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
        let curent_tab=-1;
        tabs.forEach((tab,index)=>{
            if(tab.name==name){
                curent_tab=index;
            }
        })
        await ctx.render(`admin/table`,{name:`${name}`,datas,message,page_count,page,tabs,curent_tab});
        
    });

    //删除数据
    router.get(`/del${name}/:id`,async ctx=>{
        let ids=ctx.params.id.split(",");
        for(let i=0,len=ids.length;i<len;i++){
            let id=ids[i];
            //查询数据库中是否有该条数据
            let row=await ctx.db.query(`SELECT * FROM ${config[`db_table_${name}`]} WHERE ID=?`,[id]);
            if(row.length>0){
                let data=row[0];
                //获取所有文件数据
                let allFiles=[];
                for(let name in message){
                    if(message[name].type=='file'||message[name].type=='files'){
                        allFiles=allFiles.concat(data[name]&&data[name].split(",")||[]);
                    }
                }
                await ctx.db.query(`DELETE FROM ${config[`db_table_${name}`]} WHERE ID=?`,[id]);

                //删除所有文件
                for(let i=0,len=allFiles.length;i<len;i++){
                    try{
                        await fs.unlink(path.resolve(config.uploadDir,allFiles[i]));
                    }catch(e){
                        console.log(e);
                    }
                }

            }else{
                ctx.body="数据找不到"
            }
        }
        ctx.redirect(`/admin/${name}`);
    });

    //新增数据
    router.post(`/${name}`,...upload({
        maxFileSize:5*1024*1024
    }),preProgress,async ctx=>{
        let datas=ctx.datas;
        let keys=[],values=[];
        for(let name in datas){
            keys.push(name);
            values.push(datas[name]);
        }
        await ctx.db.query(`INSERT INTO ${config[`db_table_${name}`]} (${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`,values);
        ctx.redirect(`/admin/${name}`);
    });

    //修改数据
    router.post(`/${name}/:id`,...upload({
        maxFileSize:5*1024*1024
    }),preProgress,async ctx=>{
        let {id}=ctx.params;
        let datas=ctx.datas;

        //如果图片为空则不处理,避免误删图片
        for(let name in message){
            if(message[name].type=='file'||message[name].type=='files'){
                if(!datas[name]){
                    delete datas[name];
                }
            }
        }

        let keys=[],values=[];
        for(let name in datas){
            keys.push(name);
            values.push(datas[name]);
        }
        await ctx.db.query(`UPDATE ${config[`db_table_${name}`]} SET ${keys.map(key=>key+'=?').join(',')} WHERE ID=?`,[...values,id]);
        ctx.redirect(`/admin/${name}`);
    });
}