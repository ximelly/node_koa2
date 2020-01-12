
const body = require("koa-better-body");
const convert = require("koa-convert");

module.exports={
    post(){
        return convert(body({
            multipart: false,
            buffer: false
        }))
    },
    upload(){
        return [
            async (ctx, next) => {
                try {
                    await next();
                } catch (e) {
                    if (e.message.startsWith("maxFileSize exceeded")) {
                        ctx.body = "文件过大";
                    } else {
                        throw e;
                    }
                }
            },
            convert(body({
                uploadDir: "./upload",
                maxFileSize: 10*1024
            }))
        ]
    }
    
}