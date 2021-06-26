const express = require('express');

const {
  getCourses,
  deleteCouse,
  updateCourse,
  createCourse,
  getCourse
} = require('../controller/courses');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getCourses)
  .post(createCourse);
router.route('/:id')
  .put(updateCourse)
  .delete(deleteCouse)
  .get(getCourse);

module.exports = router;