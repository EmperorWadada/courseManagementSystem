const express = require('express');
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload
} = require('../controller/bootcamps');
const courseRouter = require('./courseRoute');

const router = express.Router();
//Re-route from another resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/')
  .get(getBootcamps)
  .post(createBootcamp);
router.route('/:id')
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getBootcamp);

module.exports = router;