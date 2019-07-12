
//== COMMENTS ROUTES 
var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);	
		}else{
			res.render("comments/new", {campground:campground});
		}
	});

});

//comments create
router.post("/", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err);
				}else{
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully created comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	
});
//comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Campground.findById(req.params.id,function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No Campground Found");
			return res.redirect("back");
			
		}
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
			res.redirect("back");
			}else{
				res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});
//comment update
router.put("/:comment_id",function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//comments destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	//findByIDAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});	
});



module.exports = router;