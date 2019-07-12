require('dotenv').config();
var 	express 			= require('express'),
		app 				= express(),
		bodyParser 			= require("body-parser"),
		mongoose 			= require('mongoose'),
		Campground 			= require("./models/campgrounds"),
		seedDB  			= require("./seeds"),
		LocalStrategy		= require("passport-local"),
		passport 			= require("passport"),
		methodOverride 		= require("method-override"),
		Comment 			= require("./models/comment"),
		User 				= require("./models/user"),
		flash 				= require("connect-flash"),//flash messages
		url					= process.env.MONGOLAB_URI;
//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "this is a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

mongoose.connect(url,{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log("connected to DB!");
}).catch(err =>{
	console.log("ERROR", err.message);
});
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000);



