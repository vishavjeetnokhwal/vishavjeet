var mongoose 					=require("mongoose");
var Article						=require("./Article");
var passportLocalMongoose		=require("passport-local-mongoose");

var userSchema= new mongoose.Schema({

	name:String,
	date:{type:Date, default: Date.now},
	liked:[
		{
			type:mongoose.Schema.ObjectId,
			ref:"Article"
		 }],
	
    isAdmin:{type:Boolean,default:false},
	city:String,
	dateOfBirth:String,
	phone:String,
    activated: {type:Boolean,default:false},
	image :String,
	useraname:String,
	password:String
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
