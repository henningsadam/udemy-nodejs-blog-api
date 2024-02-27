const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Success',
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  // create post in the database
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post found.');
        error.status = 404;
        throw error;
      }
      res.status(200).json({ message: 'Success', post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.status = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post found!');
        error.status = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};