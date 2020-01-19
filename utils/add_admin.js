const password=require("../libs/password");
const config=require("../config");

(async()=>{
    let db=await require("../libs/mysql");
    let name="ximelly",pass="123";
    let rows=await db.query(`SELECT * FROM ${config.db_table_car} WHERE username=?`,[name]);
    if(rows.length>0){
        console.log(`${name}用户已存在`);
    }else{
        await db.query(`INSERT INTO ${config.db_table_car} (username,password) VALUES(?,?)`,[name,password(pass)]);
        console.log(`${name}用户添加成功`);
    }
})()