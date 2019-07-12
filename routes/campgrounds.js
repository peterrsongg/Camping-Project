var express = require('express');
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware"); // if you dont specify index the js, it automatically requires the index.js
//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});
//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req,res){
	//Get all campgrounds from DB
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});

});
//CREATE - ADD NEW CAMPGROUND TO DATABASE
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, price:price, image:image, description:desc, author:author};
	
	//create a new campgroiund and save to DB
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});
//SHOW - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", function(req,res){
	//find the chosen campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found');
			res.redirect('back');
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req,res){
	//is user logged in 
	res.render("campgrounds/edit", {campground: req.campground});

});
	
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+ req.params.id );
		}
		
	});
});

//DESTROY campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;

