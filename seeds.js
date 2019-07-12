var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

var data = [
	{
		name: "Site1",
		image: "https://images.unsplash.com/photo-1467357689433-255655dbce4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1356&q=80",
		description: "blah"
		
	},
	{	name:"site2",
		image: "https://images.unsplash.com/photo-1533664733275-8b7566eb8b4f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
	 	description: "blah blah"
		
	},
	{
		name:"site3",
		image:"https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80",
		description: "blah blah blah"
		
	}
];


function seedDB(){
	Campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		data.forEach(function(seed){
			Campground.create(seed,function(err,campground){
				if(err){
					console.log(err);
				}else{
					console.log("added a campground");
					Comment.create(
					{text:"This place is great",
					author: "homer"
					},function(err,comment){
						if(err){
							console.log(err);
						}else{
							campground.comments.push(comment);
							campground.save();
							console.log("Created a new comment");
						}
					});
				}
			});
		});
	});	
}
module.exports = seedDB;