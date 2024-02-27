const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: Date.now().toString(),
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/toy.jpeg',
        creator: {
          name: 'Adam',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Validation failed', errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;

  // create post in the database
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/toy.jpeg',
    creator: { name: 'John Doe' },
  });

  post
    .save()
    .then((result) => {
      console.log(result);

      // Status Code 201 = resource created
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
