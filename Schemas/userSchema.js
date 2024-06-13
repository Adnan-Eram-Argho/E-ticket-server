const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    name:String,
    password:{
        type:String,
        required:true,
    },

})

userSchema.methods={
findEmail: function(){
return  mongoose.model("User").findOne({email:"adnaneram@gmail.com"})
},
findEmailCallback: function(cb){
return  mongoose.model("User").findOne({email:"adnaneram@gmail.com"},cb)
}
}

module.exports = userSchema