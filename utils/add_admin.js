const password=require("../libs/password");
const config=require("../config");
const readLine=require("../libs/readLine");

(async()=>{
    let db=await require("../libs/mysql");
    while(1){
        let name=await readLine.questionAsync("请输入用户名：");
        if(!name){
            break;
        }
        let rows=await db.query(`SELECT * FROM ${config.db_table_car} WHERE username=?`,[name]);
        if(rows.length>0){
            console.log(`${name}用户已存在`);
        }else{
            let pass=await readLine.questionAsync("请输入密码：");
            await db.query(`INSERT INTO ${config.db_table_car} (username,password) VALUES(?,?)`,[name,password(pass)]);
            console.log(`${name}用户添加成功`);
        }
    }
    readLine.close();
    console.log("readline 已关闭");
})()