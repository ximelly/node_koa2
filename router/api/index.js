const Router = require("koa-router");
const config = require("../../config");

let router = new Router();

//获取banner GET /api/banner
router.get("/banner",async ctx=>{
    let datas=await ctx.db.query(`SELECT title,sub_title,image FROM ${config.db_table_banner} ORDER BY ID DESC `);
    ctx.body=datas;
});

//获取车辆列表 GET /api/carList/:page
router.get("/carList/:page",async ctx=>{
    let {page}=ctx.params;
    let pageSize=10;
    let datas=await ctx.db.query(`SELECT title,price,features,description,images FROM ${config.db_table_car} ORDER BY ID DESC LIMIT ?,?`,[(page-1)*pageSize,pageSize]);
    
    //数据处理
    datas.forEach(data => {
        //features处理  只保留以下信息
        //上牌时间、表显里程、本车排量、变速箱、车辆性质
        if(data.features){
            let arr=data.features.split(",");
            let json={};
            arr.forEach(item=>{
                let [key,value]=item.split("|");
                json[key]=value;
            })
            
            data['time']=json["上牌时间"];
            data['mileage']=json["表显里程"];
            data['displace']=json["本车排量"];
            data['transmission']=json["变速箱"];
            data['type']=json["车辆性质"];
        }
        delete data.features;

        //images处理
        data.image=data.images?data.images.split(",")[0]:"";
        delete data.images;
    });
    ctx.body=datas;
});



module.exports=router.routes();