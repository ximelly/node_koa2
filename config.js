const path = require("path");

module.exports={
    //服务器
    port:8081,

    //数据库
    db_host:"localhost",
    db_port:"3360",
    db_user:"root",
    db_pass:"123456",
    db_name:"first_db",
    db_table:"user_table",

    //redis
    redis_host:"localhost",
    redis_port:"6379",
    redis_pass:undefined,

    //upload 注：此处的路径使用绝对路径
    uploadDir:path.resolve(__dirname,"upload"),

    //session
    session_maxage:86400*1000,

    //key
    key_count:1024,
    key_len:1024,
    key_path:path.resolve(__dirname,".key"),//.key：文件名前面加点不会显示出来

    //静态资源地址
    static_path:path.resolve(__dirname,"static")
}