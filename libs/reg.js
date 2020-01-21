module.exports={
    admin:{
        username: /^[a-z0-9]{4,32}$/,
        password: /^.{3,32}$/,
        title: /^.{6,32}$/
    },
    web:{}
}