const config={
    production :{
        secret: process.env.secret,
      
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        secret: 'mySecret key',
       
        DATABASE: 'mongodb+srv://biketest:bike123@cluster0.yxpbbrz.mongodb.net/?retryWrites=true&w=majority',
         
    }
}


exports.get = function get(env){
    console.log("test reaching here")
    return config[env] || config.default
}
