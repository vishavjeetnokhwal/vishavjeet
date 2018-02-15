var express      =require("express"),
    router       =express.Router(),
    Comment 	 =require("../models/Comments"),
    User	     =require("../models/User"),
    Article 	 =require("../models/Article"),
    middleware   =require("./middlewares");



//LIKE ROUTE

router.post("/articles/:id",middleware.isLoggedin, function(req,res)
{
  Article.findById(req.params.id,function(err,foundArticle)
	{
		if(err){console.log(err);}
		else
		{
			User.findById(req.user._id,function(err,foundUser)
			{
				if(err){console.log(err);}
				else
				{

			
					
				User.find({"_id":req.user._id,"liked": req.params.id},function(err,data)
					{
					
					
						if(err){console.log(err);}
						else
						{
							
							if(data.length>0)
							{
	                            req.flash("error", "You Have Already Liked");
								res.redirect("back");
							}
							else
							{
								foundArticle.likes++;
								foundArticle.save();
								foundUser.liked.push(foundArticle);
								foundUser.save();
	        
	                            req.flash("success", "You Liked This Article");
								res.redirect("/articles/"+req.params.id);
							}
						}
					});
					
				}
			});
		}	
	});


});


//================
//PAYMENT ROUTE
//=================


router.get("/payments/:id",middleware.isLoggedin,function(req,res)
   {
	   res.render("./Payments/payment",{article_id: req.params.id});
   });





router.post("/payments/:id",middleware.isLoggedin,function(req,res)
	{
       Article.findById(req.params.id,function(err,foundArticle)
       	{
       		if(err){console.log(err);}
       		else
       		{

       			foundArticle.payee.push((req.user._id).toString());
       			foundArticle.save();
	        
	            req.flash("success", "Payment Was Successfully");
       			res.redirect("/articles/"+req.params.id);
       		}
       	});

	});



//==================
// PROFILE ROUTE
//==================

router.get("/profile",middleware.isLoggedin, function(req,res)
{
	res.render("./profiles/profile",{user:req.user});
});



//====================
//Admin Pannel 
//===================

router.get("/admin",middleware.isLoggedin,middleware.isAdmin,function(req,res)
	{

		User.find({"isAdmin":false},function(err,foundUsers)
			{
				if(err){console.log(err);}
				else
				{
					res.render("./profiles/adminpanel",{usr:foundUsers});			
				}
			});
		
	});

// =====================
//USER ACTIVATION ROUTE
//======================
router.post("/admin/:id",function(req,res)
	{
		User.findById(req.params.id,function(err,foundUser)
			{
				if(err){console.log(err);}
				else
				{
					if(foundUser.activated)
					{
						foundUser.activated=false;
						foundUser.save();
	                    req.flash("success", "User "+foundUser.name+" Deactivated Successfully");
						res.redirect("/admin");
					}
					else
					{
						foundUser.activated=true;
						foundUser.save();
	                    req.flash("success", "User "+foundUser.name+" Activated Successfully");
						res.redirect("/admin");

					}
				}
			});
	});


module.exports=router;