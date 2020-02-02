(async function(){
    {
      let datas=await $.ajax({
        url:`/api/car/${id}`,
        dataType:'json'
      })
      let {ok,data}=datas;
      if(ok){
        $(".header").html(`<h1>${data.title}</h1>`);
        $(".price").html(`￥${data.price}`);
        data.features.split(",").forEach(element => {
          let [key,value]=element.split("|");
          $(`<li><strong>${key||''}</strong> <span>${value||''}</span></li>`).appendTo("#features");
          $(`<p>${key||''}：${value||''}</p>`).appendTo('#carInfo')
        });
        data.images.split(",").forEach(image=>{
          $(`<li>
            <img src="/upload/${image}" alt="">
          </li>`).appendTo(".banner_container .rslides")
          $(`<img src="/upload/${image}" alt="">`).appendTo("#carImages")
        })
        data.description.split('\n').forEach(item=>{
          $(`<p>${item}</p>`).appendTo("#carDetail")
        })
      }
    }
})()