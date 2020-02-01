(async function(){
  let datas=await $.ajax({
    url:'/api/banner',
    dataType:'json'
  })
  let {ok,data}=datas;
  if(ok){
    data.forEach(banner => {
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
})()