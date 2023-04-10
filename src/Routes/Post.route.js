const postRouter = require("express").Router();
const Post = require("../models/Post");

// create post

postRouter.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savePost = await newPost.save();
        res.status(200).json({
            message:"post created successfully",
            savePost,
          
        })

    }catch(err){
        res.status(500).json({
            err,
            message: err.message
        })
    }
})


//UPDATE post
postRouter.put("/:id", async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json({
            message:"Your Post has been updated Successfully...",
            updatePost,
        })
    }catch(e){
        res.status(404).json({
            message:"Error in your input ID",
            e,
        })
    }
   }
   else{
        res.status(200).json({
        message:"You can update only your own post - Fill all the required details here.",
       
      })
   }

  }catch(err){
    res.status(500).json({
        message:"Post are not found!",
        err,
    })
  }
});


//DELETE POST
  postRouter.delete("/:id", async function (req, res){
    const postId=req.params.id;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.username !== req.body.username) {
        return res.status(401).json({ message: "You can delete only your own post" });
      }
      await post.deleteOne();
      res.status(200).json({ message: "Post has been deleted" });
    } catch (err) {
      res.status(500).json({
         message: err.message,
         err
        });
    }
  });
  
  
  //GET POST
  postRouter.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET ALL POSTS
  postRouter.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
      let posts;
      if (username) {
        posts = await Post.find({ username });
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  


module.exports = postRouter;
