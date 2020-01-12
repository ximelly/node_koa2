const unid=require('uuid/v4');
const fs=require('promise-fs');
const {key_count,key_len,key_path}=require("../config");

let arr=[];
for (let i = 0; i < key_count; i++) {
    let str="";
    for (let j = 0; j < key_len; j++) {
        str+=unid().replace(/\-/g,"");
    }
    arr.push(str);
};
fs.writeFileSync(key_path,JSON.stringify(arr));
console.log(`生成genkey成功`);