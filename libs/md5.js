const crypto=require("crypto");
const config=require("../config");

module.exports=function(data){
    let obj=crypto.createHash('md5');
    obj.update(data);
    return obj.digest('hex');
}