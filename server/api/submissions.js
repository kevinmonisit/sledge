const router = require('express').Router();
const Submission = require('../models/submission.model');

/**
 * @swagger
 * /api/submissions:
 *  get:
 *    summary: Retrieve a list of all of the submissions
 *    produces:
 *       - application/json
 *    tags:
 *      - submissions
 */
router.get('/', async ({ res }) => {
  res.status(200).send(await Submission.find({}));
});

/**
 * @swagger
 * /api/submissions/{teamID}/{submissionID}:
 *   get:
 *     summary: Retrieves the specified submission from the specified team
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: submissionID
 *         required: true
 *         type: string
 *         description: The submission ID
 *     tags:
 *       - submissions
 */
router.get('/:submissionID', async (req, res) => {
  await Submission.findById(req.params.submissionID, (err, submission) => {
    if (err) res.status(500).send(err);
    res.status(200).send(submission);
  });
});

/**
 * @swagger
 * /api/submissions/{teamID}/create:
 *   post:
 *     summary: Creates a new submission
 *     responses:
 *       200:
 *       produces:
 *         - application/json
 *     parameters:
 *       - in: path
 *         name: teamID
 *         required: true
 *         type: string
 *         description: The team ID
 *       - in: path
 *         name: submissionID
 *         required: true
 *         type: string
 *         description: The submission ID
 *     tags:
 *       - submissions
 */
Submission.create = (req, res => {
  if (!req.body.title) {
    res.status(200).send(err);
    return;
  }
  const submission = new Submission({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });
  submission
    .save(submission)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(200).send({
        message: err.message
      });
    });
});

router.post('/', (req, res) => {
  Submission.create({}, (err, submission) => {
    if (err) res.status(500).send(err);
    res.status(200).json({
      message: 'success',
      id: submission.id,
    });
  });
});

// update a submission with new info
router.patch('/:submissionID', async (req, res) => {
  await Submission.findOneAndUpdate(req.params.submissionID, req.body, {
    new: true,
  });

  res.status(200).send(await Submission.findById(req.params.submissionID));
});

module.exports = router;
