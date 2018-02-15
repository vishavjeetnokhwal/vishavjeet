var mongoose=require("mongoose");
var Article=require("./Article");

var commentSchema= new mongoose.Schema({
   		
   		content:String,
   		
   		author:{
   			id:{
   				type:mongoose.Schema.Types.ObjectId,
   				ref:"User"
   			},
   			name: String
   		}

});

module.exports=mongoose.model("Comment", commentSchema);

