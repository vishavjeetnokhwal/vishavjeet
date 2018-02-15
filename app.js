var express 			= require("express"),
app                     =express(),
mongoose                =require("mongoose"),
flash					=require("connect-flash"),
bodyParser   			=require("body-parser"),
methodOverride    		=require("method-override"),
Comment 				=require("./models/Comments"),
User					=require("./models/User"),
Article 					=require("./models/Article");
passport			  	=require("passport"),
LocalStrategy			=require("passport-local"),
expressSession			=require("express-session");


//===================================ROUTES==================================


var articleRoute      =require("./routes/article"),
    commentRoute   =require("./routes/comment"),
    authRoute      =require("./routes/auth"),
    extraRoute     =require("./routes/extra");

//============================================================================








mongoose.connect("mongodb://nokhwal:nokhwal@ds023438.mlab.com:23438/blog_app");

app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(flash());

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


app.use(expressSession({

	secret:"Hello World today i ordered MI 5A",
	resave:false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error   = req.flash("error");
    res.locals.success =req.flash("success");
	next();
});






app.use(articleRoute);
app.use(commentRoute);
app.use(authRoute);
app.use(extraRoute);









//==============================================================================//

app.listen(3000,function(){

console.log("Serever has started");
});
