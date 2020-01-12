const session = require("koa-session");
const fs=require('promise-fs');
const config=require("../config");

module.exports=async (server)=>{
    const client=await require("./redis");
    try{
        let buffer=await fs.readFile(config.key_path);
        server.keys=JSON.parse(buffer.toString());
    }catch(e){
        console.log(e);
        console.log("读取key失败，请重新生成");
        return;
    }
    let store={
        async get(key){
            let data=await client.getAsync(key);
            if(!data) return {};
            try{
                return JSON.parse(data);
            }catch(e){
                return {};
            }
        },
        async set(key,value,maxAge){
            //setAsync
            //psetexAsync:设置带有有效期的值
            await client.psetexAsync(key,maxAge,JSON.stringify(value));
        },
        async destroy(key){
            await client.delAsync(key);
        }
    };
    server.use(session({
        maxAge:config.session_maxage,
        renew:true,//快过期了自动更新
        store
    },server))
}