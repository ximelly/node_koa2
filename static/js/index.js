(async function(){
  //banner
  {
    let datas=await $.ajax({
      url:'/api/banner',
      dataType:'json'
    })
    let {ok,data}=datas;
    if(ok){
      data.forEach(banner=> {
        $(`<li>
            <img src="http://localhost:8081/upload/${banner.image}" alt="">
            <div class="caption">
              <h1>${banner.title}</h1>
              <span>${banner.sub_title}</span>
            </div>
          </li>`).appendTo('ul.rslides');
      });
      $('ul.rslides li:eq(0)').css({
        opacity:1
      });
    }
  
    //翻页
    let active=0;
    $(".slider .prev").click(function(){
      active=active==0?data.length-1:--active;
      $('ul.rslides li').stop().animate({opacity:0}).eq(active).stop().animate({opacity:1})
    })
    $(".slider .next").click(function(){
      active=active==data.length-1?0:++active;
      $('ul.rslides li').stop().animate({opacity:0}).eq(active).stop().animate({opacity:1})
    })
  }

  //精选
  {
    let datas=await $.ajax({
      url:'/api/choosecar',
      dataType:'json'
    })
    let {ok,data}=datas;
    if(ok){
      $("#choosecar").html("");
      for(let i=0,len=data.length/2;i<len;i++){
        let arr=data.slice(i*2,i*2+2);
        $(`<div class="col-1-3">
            <div class="wrap-col"></div>
          </div>`).appendTo('#choosecar');
          arr.forEach((item) => {
            $(`<div class="item t-center">
            <div class="item-container">
              <a href="single.html">
                <div class="item-caption">
                  <div class="item-caption-inner">
                    <div class="item-caption-inner1">
                      <span>${item.time} / ${item.mileage} / ${item.displace} / ${item.transmission} /  ${item.type}</span>
                    </div>
                  </div>
                </div>
                <img src='/upload/${item.image}' />
              </a>
            </div>
            <div class="item-info">
              <a href="single.html"><h3>${item.title}</h3></a>
              <p>${item.mileage} ${(item.price/1000).toFixed(1)}万</p>
            </div>
          </div>`).appendTo('#choosecar .wrap-col:last');
          });
      }
    }
  }

  //列表
  {
    let datas=await $.ajax({
      url:'/api/carList/1',
      dataType:'json'
    })
    let {ok,data}=datas;
    if(ok){
      for(let i=0,len=data.length;i<len;i++){
        let item=data[i];
        $(`<div class="row">
        <div class="item">
          <div class="col-1-3">
            <div class="item-container">
              <a href="single.html">
                <div class="item-caption">
                  <div class="item-caption-inner">
                    <div class="item-caption-inner1">
                      <span>${item.time} / ${item.mileage} / ${item.displace} / ${item.transmission} /  ${item.type}</span>
                    </div>
                  </div>
                </div>
                <img src="/upload/${item.image}" />
              </a>
            </div>
          </div>
          <div class="col-2-3">
            <div class="wrap-col">
              <div class="item-info">
                <a href="single.html"><h3>${item.title}</h3></a>
                <p>${item.mileage} ${(item.price/1000).toFixed(1)}万</p>
                <p>${item.description}</p>
              </div>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div>`).insertBefore('#moreCar');
      }
    }
  }
})()