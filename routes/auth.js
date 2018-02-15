var express      =require("express"),
    router       =express.Router(),
     User	     =require("../models/User"),
     passport    =require("passport");





//================================
//		Authentication Routes
//================================

//=================================
//REGISTER
//=================================

//TOREGISTER
router.get("/register",function(req,res)
	{
		res.render("./auth/toregister");
	});

//USER REGISTER
router.get("/register/user",function(req,res)
	{
		res.render("./auth/userregister");
	});
//ADMIN REGISTER

router.get("/register/admin",function(req,res)
	{
		res.render("./auth/adminregister");
	});


//USER REGISTERATION

router.post("/register/user",function(req,res)
	{

		
		var newUser=new User(req.body.user);
		var password=req.body.password;
		
		User.register(newUser,password,function(err,user)
			{
				if(err)
					{
						req.flash("error", err.message);
						res.redirect("/register/user");
							

					}
				else
				{
	                    req.flash("success", "User Successfully Registered");
						res.redirect("/login");
							
				}
			});
	});

//ADMIN REGISTRATION
router.post("/register/admin",function(req,res)
	{

		
		var newUser=new User(req.body.user);
		newUser.isAdmin=true;
		newUser.activated=true;
		var password=req.body.password;
		
		User.register(newUser,password,function(err,user)
			{
				if(err)
					{
						req.flash("error", err.message);
						res.redirect("/register/admin");
							

					}
				else
				{

					req.flash("success", "Admin Successfully Registered");
						res.redirect("/login");
	                   
							
				}
			});
	});

//LOGIN ===============================

router.get("/login",function(req,res)
	{
		res.render("./auth/login");

	});

router.post("/login", passport.authenticate("local",{ failureRedirect:"/login"}),function(req,res){
	req.flash("success", "Welcome "+req.user.name);
	res.redirect("/articles");
});

//LOGOUT================================

router.get("/logout",function(req,res)
	{
		req.logout();
	    req.flash("success", "Successfully Logged Out");		
		res.redirect("/articles");
	});

module.exports=router;