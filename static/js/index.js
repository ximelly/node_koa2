(async function(){
  $.ajax({
    url:'/api/banner',
    dataType:'json',
    success:function(response){
      let {ok,data}=response;
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
          opacity:1,
          display:'block'
        });
      }
    }
  })
})()