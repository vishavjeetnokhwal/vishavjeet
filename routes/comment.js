var express      =require("express"),
    router       =express.Router(),
    Comment 	 =require("../models/Comments"),
    Article 		 =require("../models/Article"),
    middleware   =require("./middlewares");
    






//CREATING NEW COMMENT ROUTE

router.post("/articles/:id/comment/",middleware.isLoggedin, function(req,res){

			Article.findById(req.params.id,function(err,foundedArticle){

						if (err) {console.log(err);}
						else
						{  
								Comment.create(req.body.body,function(err,createdComment){

											if (err) {
											req.flash("error", "Something went wrong !");
												console.log(err);
											}
											else
											{

												createdComment.author.id=req.user._id;
												createdComment.author.name=req.user.name;
												createdComment.save();

												foundedArticle.comments.push(createdComment);
												foundedArticle.save();
												req.flash("success", "Successfully added comment");
										        res.redirect("/articles/"+foundedArticle._id);

											}
								});
								
							
						}

				});

});



//EDIT COMMENT PAGE

router.get("/articles/:id/comment/:comment_id/edit",middleware.checkCommentPermission,function(req,res)
	{
		
				   Comment.findById(req.params.comment_id,function(err,foundComment)
				   {
						   	if(err)
						   	{
						   		console.log(err);
						   		res.redirect("back");
						   	}
						   	else
						   	{
								res.render("./comments/edit",{article_id:req.params.id,Comment:foundComment});				   		
						   	}
				   }); 	
				

		
	});


//UPDATE COMMENT

router.put("/articles/:id/comment/:comment_id",middleware.checkCommentPermission,function(req,res)
	{
		Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment)
		{
           if(err)
           {
           	console.log(err);
           	res.redirect("back");
           }
           else
           {
	        req.flash("success", "Successfully Updated Comment");
           	res.redirect("/articles/"+req.params.id);
           }
         
		});
	});



//DESTROY A COMMENT

router.delete("/articles/:id/comment/:comment_id",middleware.checkCommentPermission,function(req,res)
	{
		Comment.findByIdAndRemove(req.params.comment_id,function(err)
			{
				if(err)
				{
					console.log(err);
					res.redirect("back");
				}
				else
				{
	                req.flash("success", "Comment Deleted Successfully ");
	              	res.redirect("/articles/"+req.params.id);
				}
			});
	});


module.exports=router;