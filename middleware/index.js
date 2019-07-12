// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				console.log(err);
				req.flash("error", "that campground does not exist!");
				res.redirect("/campgrounds");
			}else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
				req.campground = foundCampground;
				next();
			}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds/" + req.params.id);
				}
	});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
},

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
	});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
},
middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "you need to be logged in to do that");
	res.redirect("/login");
},
middlewareObj.isAdmin = function(req,res,next){
	if(req.user.isAdmin){
		next();
	}else{
		req.flash('error', 'Only images from images.unsplash.com allowed.\n');
		res.redirect('back');
	}
},
middlewareObj.isSafe = function(req,res,next){
	if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)){
		next();
	}else{
		req.flash('error', 'Only images from images.unsplash allowed.\n');
		res.redirect('back');
	}
}


	
module.exports = middlewareObj;