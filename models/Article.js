var mongoose=require("mongoose");
var Comment= require("./Comments");
var User    =require("./User");


var articleSchema=new mongoose.Schema({

  likes:{type:Number, default: 0},
	title:String,
	image:String,
  desc:String,
  payee:[{type:String}],
  
	date:{type:Date,default: Date.now},
  
  author:{
            id:{
                    type:mongoose.Schema.ObjectId,
                    ref:"User"
                },
           name:String
        },  
  
  comments:[{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Comment"
                   
           }]
});


module.exports=mongoose.model("Article",articleSchema);