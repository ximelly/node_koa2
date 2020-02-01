(async ()=>{
  let {ok, data}=await $.ajax({
    url: '/api/banner',
    dataType: 'json'
  });

  if(ok){
    data.forEach(banner=>{
      console.log(banner);
      $(`
      <li>
        <img src="http://localhost:8080/upload/${banner.image}" alt="">
        <div class="caption">
          <h1>价格准 拿钱快</h1>
          <span>保卖卖车为何足够省心</span>
        </div>
      </li>`).appendTo('ul.rslides');

      $('ul.rslides li:eq(0)').css({
        opacity:1,
        display:'block'
      });
    });
  }

})();
