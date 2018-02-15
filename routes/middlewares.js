var express      =require("express"),
    router       =express.Router(),
    Comment 	 =require("../models/Comments"),
    Article 		 =require("../models/Article"),
    User         =require("../models/User"),
    passport     =require("passport");
    
//MIDDLEWARES



var middleware={};


middleware.isLoggedin= function(req,res,next)
		{
			if(req.isAuthenticated())
			{
				return next();
			}
			req.flash("error", "You Need To Login First !");
			res.redirect("/login");
		}


middleware.isAdmin= function(req,res,next)
		{

			User.findById(req.user._id,function(err,foundUser)
			{
				if(err){
					    req.flash("error", "Something Went Wrong !");
						res.redirect("back");
					 console.log(err);
				   }
				else
				{
					if(foundUser.isAdmin===true)
					{    
						return next();
					}
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			});
			
		}




middleware.checkUser=function(req,res,next)
{

if(req.isAuthenticated())
	{
		Article.findById(req.params.id,function(err,foundArticle)
			{
				if(err)
					{
						req.flash("error", "Something Went Wrong !");
						console.log(err);
						res.redirect("back");

					}
				else
				{
					if(foundArticle.author.id.equals(req.user._id)|| req.user.isAdmin===true )
					{
						next();
					}

					else
					{   
					    req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
	}

	else
	{   
		req.flash("error", "You Need To Login First !");
		res.redirect("back");
	}




}


middleware.checkCommentPermission=function(req,res,next)
{

if(req.isAuthenticated())
	{

		Comment.findById(req.params.comment_id,function(err,foundComment)
			{

					

				if(err)
					{
						req.flash("error", "Something Went Wrong !");
						res.redirect("back");

					}
				else
				{
					if(foundComment.author.id.equals(req.user._id)|| req.user.isAdmin)
					{
						
						next();
					}

					else
					{
		

						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
	}

	else
	{
		req.flash("error", "You Need To Login First !");
		res.redirect("back");
	}




}

middleware.checkpayment=function(req,res,next)
   {
   	       Article.findById(req.params.id,function(err,foundArticle)
   	       	{
   	       		if(err){
   	       				
   	       			 req.flash("error", "Something Went Wrong !");
					 res.redirect("back");

   	       			console.log(err);
   	       		}

   	       		else
   	       		{
   	       			if(foundArticle.likes>10)
   	       			{
   	       				Article.find({"_id":req.params.id, "payee":(req.user._id).toString()},function(err,data)
   	  	                             {
   	  		
						   	  		    if(err){
						   	  		    	req.flash("error", "Something Went Wrong !");
						                    res.redirect("back");
						   	  		    	console.log(err);
						   	  		    }
						   	  		
						   	  		   else
						   	  		           {

				   	  			            
						   	  		             if(data.length>0)
						   	  		             {     
						   	  		             	   
						   	  			               next();
						   	  		             }
						   	  		             else
						   	  		             {    

						   	  		             	   req.flash("error", "You Need To Pay First !");
						   	  			               res.redirect("/payments/"+req.params.id);
						   	  		             }
				   	  	              	       }
				   	  	                });
   	       			}

   	       			else	
   	       			{
   	       				next();
   	       			}

   	       		}
   	       	});

   	  
   }

middleware.isActivated=function(req,res,next)
{
    if(req.user.activated)
    {
    	next();
    }
    else
    {
    	req.flash("error", "Your Activation is Pending !");
    	res.redirect("back");
    }


}


module.exports=middleware;