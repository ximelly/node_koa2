(()=>{
    $(".sendButton").click(async function(){
        let form=new FormData($("#form1")[0]);
        let {ok}=await $.ajax({
            url:'/api/msg',
            method:"post",
            data:form,
            processData: false,//Illegal invocation
            contentType:false
        })
        if(ok){
            alert("留言成功")
        }else{
            alert("留言失败")
        }
    });
})()