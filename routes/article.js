var express      =require("express"),
    router       =express.Router(),
    Article 		 =require("../models/Article"),
    middleware   =require("./middlewares");







//==================
// HOME PAGE	 
//==================
router.get("/",function(req,res){

res.redirect("/articles");
});


router.get("/articles",function(req,res){
   
   Article.find({},function(err,article){
    if(err)
    	console.log(err);
    else
     res.render("./articles/index",{article:article});	

   });
	
});


//NEW ARTICLE FORM

router.get("/articles/new",middleware.isLoggedin,middleware.isActivated, function(req,res){
	res.render("./articles/new");
});

// NEW ARTICLE CREATION

router.post("/articles",middleware.isLoggedin,middleware.isActivated, function(req,res){



Article.create(req.body.body,function(err,article){
if(err)
	res.redirect("/articles");
else
{
	article.author.id=req.user._id;
	article.author.name=req.user.name;
	article.save();
	req.flash("success", "Successfully Created Article");
	res.redirect("/articles");
}


});


});







//SHOW PAGE  
router.get("/articles/:id",middleware.isLoggedin,middleware.checkpayment,function(req,res){

Article.findById(req.params.id).populate("comments").exec(function(err,foundArticle)
	{
		if(err)
		{
			console.log(err);
			res.redirect("back");

		}
		else
		{

			res.render("./articles/show",{article:foundArticle});
		}
	});



});





//EDIT ARTICLE
router.get("/articles/:id/edit",middleware.checkUser, function(req,res){

		Article.findById(req.params.id,function(err,foundArticle)
		{
		    res.render("./articles/edit",{article:foundArticle});
        });		

});






//UPDATE ARTICLE
router.put("/articles/:id",middleware.checkUser, function(req,res){



Article.findByIdAndUpdate(req.params.id,req.body.body,function(err,updated){

if(err)
	res.redirect("/articles");
else
	req.flash("success", "Successfully Updated Article");
	res.redirect("/articles/"+req.params.id);
});


});
//DELETE ROUTE

router.delete("/articles/:id",middleware.checkUser, function(req,res){
Article.findByIdAndRemove(req.params.id,function(err){
req.flash("success", "Successfully Deleted Article");
res.redirect("/articles");

});

});



module.exports=router;