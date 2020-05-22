const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Question = require('../../models/Question');
const User = require('../../models/User');

// @route    POST api/questions
// @desc     Post a question
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('text', 'Text is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newQuestion = new Question({
        title: req.body.title,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const question = await newQuestion.save();

      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/questions
// @desc     Get all questions
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/questions/:id
// @desc     Get question by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/questions/:id
// @desc     Delete a question by id
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    // Check user
    if (question.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await question.remove();

    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/questions/upvote/:id
// @desc     upvote a question
// @access   Private
router.put('/upvote/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    // Check if the question has already been liked
    if (
      question.upvotes.some((upvote) => upvote.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: 'Question already liked' });
    }

    question.upvotes.unshift({ user: req.user.id });

    await question.save();

    return res.json(question.upvotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/questions/downvote/:id
// @desc     Downvote a question
// @access   Private
router.put('/downvote/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    // Check if the Question has not yet been liked
    if (
      !question.upvotes.some((upvote) => upvote.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: 'Question has not yet been liked' });
    }

    // remove the like
    question.upvotes = question.upvotes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await question.save();

    return res.json(question.upvotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/questions/response/:id
// @desc     response on a question
// @access   Private
router.post(
  '/response/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const question = await Question.findById(req.params.id);

      const newResponse = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      question.responses.unshift(newResponse);

      await question.save();

      res.json(question.responses);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/questions/response/:id/:response_id
// @desc     Delete response
// @access   Private
router.delete('/response/:id/:response_id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    // Pull out response
    const response = question.responses.find(
      (response) => response.id === req.params.response_id
    );
    // Make sure response exists
    if (!response) {
      return res.status(404).json({ msg: 'Response does not exist' });
    }
    // Check user
    if (response.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    question.responses = question.responses.filter(
      ({ id }) => id !== req.params.response_id
    );

    await question.save();

    return res.json(question.responses);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
