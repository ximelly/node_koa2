
const body = require("koa-better-body");
const convert = require("koa-convert");
const config=require("../config");

module.exports={
    post(){
        return convert(body({
            multipart: false,
            buffer: false
        }))
    },
    upload(options){
        options=options||{};
        options.uploadDir=options.uploadDir||config.uploadDir;
        options.maxFileSize=options.maxFileSize||1024*1024;

        return [
            async (ctx, next) => {
                try {
                    await next();
                } catch (e) {
                    if (e.message.startsWith("maxFileSize exceeded")) {
                        if(typeof options.fileExceed=="function"){
                            await options.fileExceed(ctx);
                        }else{
                            ctx.body = "文件过大";
                        }
                    } else {
                        if(typeof options.error=="function"){
                            await options.error(ctx,e);
                        }else{
                            throw e;
                        }
                    }
                }
            },
            convert(body({
                uploadDir: options.uploadDir,
                maxFileSize: options.maxFileSize
            }))
        ]
    }
    
}