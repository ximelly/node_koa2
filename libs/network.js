const os=require("os");

let arr=[];
let json=os.networkInterfaces();
for(name in json){
    json[name].forEach(item => {
        if(item.family=="IPv4"){
            arr.push(item);//192.168.0.11、127.0.0.1
        }
    });
}
module.exports=arr;