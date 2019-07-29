//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/blogDB", {
//   useNewUrlParser: true
// });

mongoose.connect("mongodb+srv://admin-chris:admin-chris@cluster0-gsnjm.mongodb.net/blogDB", {
  useNewUrlParser: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

// const startingContent = Post({
//   title: "Home",
//   content: "Type /compose after url to compose a post"
// });
// startingContent.save();

const homeStartingContent = "Lorem ipsum dolor sit amet, ac ac egestas sed dolor, eu ac, vehicula quis. Ipsum mauris sem nunc, neque nec eget maecenas elit, nullam pretium, pede amet elit massa. Posuere venenatis est quis wisi, sodales vestibulum ipsum lectus turpis ut, nullam at est vestibulum. Mi et morbi ut. Sit auctor vitae nunc lacus diam. Nam pellentesque posuere, sit quis dignissim, velit vel litora posuere sed id, lacus non arcu in elit in. Interdum molestie dignissim ut bibendum cras quis, neque aliquet massa eget nec quam sit, vestibulum duis sit, cursus phasellus conubia vehicula, in vehicula mattis urna nunc pulvinar aliquam. Facilisi a turpis. Sit nunc, id augue rutrum at ornare.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// var posts = [];
app.get("/", (req, res) => {

  //faulty example below. Reason: the slice duplicate another variable to point the same array, but does not create another array in memory
  // let homePosts = posts.slice(0);
  // homePosts.forEach((post)=>{
  //   post.content = lodash.truncate(post.content, {
  //     length: 100
  //   });
  // });
  // console.log(homePosts);
  // console.log(posts);
  Post.find({}, (err, findPosts) => {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: findPosts
      });
      // console.log(findPosts);
    } else {
      console.log(err);
    }
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/post/:name", (req, res) => {
  //let postTitle = lodash.lowerCase(post.title);
  let urlTitle = req.params.name;
  Post.find({
    _id: urlTitle
  }, (err, foundPost) => {
    if (!err) {
      console.log(urlTitle);
      console.log(foundPost);
      foundPost.forEach((post) => {

          res.render("post", {
            title: post.title,
            content: post.content
          });
      });
    } else {
      console.log(err);
    }
  });

  // posts.forEach((post) => {
  //
  //
  //   //console.log(Object.keys(post));
  //   // values = Object.values(post);
  //   // console.log(values.includes(req.params.name));
  //
  //   // console.log(lodash.lowerCase(post.title));
  //   // console.log(lodash.lowerCase(req.params.name));
  //   // console.log(lodash.lowerCase(post.title)===lodash.lowerCase(req.params.name));
  //
  //   let postTitle = lodash.lowerCase(post.title);
  //   let urlTitle = lodash.lowerCase(req.params.name);
  //   if (postTitle === urlTitle) { //technically the post title is not uniquely enough to identify which post
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });
});

app.post("/compose", (req, res) => {

  const post = Post({
    title: req.body.composeTitle,
    content: req.body.composeContent
  });
  post.save();

  res.redirect("/");

  // another way
  // var post1 = {};
  // post1.title = req.body.composeTitle;
  // post1.content = req.body.composeContent;
  // console.log(post1)
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started");
});
