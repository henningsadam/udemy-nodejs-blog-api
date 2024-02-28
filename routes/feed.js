const express = require('express');
const { check, body } = require('express-validator');
const feedController = require('../controllers/feed');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts);

router.get('/status', isAuth, feedController.getStatus);

router.put(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  feedController.updateStatus
);

router.get('/post/:postId', isAuth, feedController.getPost);
router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
