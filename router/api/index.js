const Router = require("koa-router");
const config = require("../../config");

let router = new Router();

const pageSize=10;

//中间件，将数据处理成
// {
//     ok:true/false,
//     data:data
// }
router.use(async (ctx,next)=>{
    try{
        await next();
        if(ctx.body!==undefined){
            ctx.status=200;
            ctx.body={
                ok:true,
                data:ctx.body
            }
        }else{
            ctx.status=404;
            ctx.body={
                ok:false,
                msg:"data not found"
            }
        }
    }catch(e){
        console.log(e);
        ctx.status=500;
        ctx.body={
            ok:false,
            msg:"server error"
        }
    }
});

//获取banner GET /api/banner
router.get("/banner",async ctx=>{
    let datas=await ctx.db.query(`SELECT title,sub_title,image FROM ${config.db_table_banner} ORDER BY ID DESC `);
    ctx.body=datas;
});

//获取车辆列表 GET /api/carList/:page
router.get("/carList/:page",async ctx=>{
    let {page}=ctx.params;
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

//获取车辆列表总页数 GET /api/carpage
router.get("/carpage",async ctx=>{
    let rows=await ctx.db.query(`SELECT count(*) AS c FROM ${config.db_table_banner}`);
    ctx.body=Math.ceil(rows[0].c/pageSize);
});

//获取车辆详情 GET /api/car/:id
router.get("/car/:id",async ctx=>{
    let rows=await ctx.db.query(`SELECT * FROM ${config.db_table_car} WHERE ID=?`,[ctx.params.id]);
    ctx.body=rows[0];
});

module.exports=router.routes();