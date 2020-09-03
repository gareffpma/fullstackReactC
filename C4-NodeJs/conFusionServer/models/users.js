let mongoose =require('mongoose')
const router = require('../routes')
let Schema=mongoose.Schema
let passportLocalMongoose=require('passport-local-mongoose')
let User =new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
})

User.plugin(passportLocalMongoose)
module.exports=mongoose.model('User',User)