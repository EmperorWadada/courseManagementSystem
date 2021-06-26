const Course = require('../model/Courses');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/erroResponse');
const Bootcamp = require('../model/Bootcamps');
const Bootcamps = require('../model/Bootcamps');



//@desc    Get all courses
//route    GET /api/v1/courses
//route    GET /api/v1/bootcamps/:bootcampId/course
//access   public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  const course = await query;

  res.status(200).json({
    sucess: true,
    count: course.length,
    data: course
  });

});


//@desc    Get a single courses
//route    GET /api/v1/courses
//route    GET /api/v1/course/:id
//access   public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return new ErrorResponse(`Course id: ${req.params.id} not found`, 404);
  }
  res.status(200).json({
    sucess: true,
    count: course.length,
    data: course
  });
});


//@desc    POST Single course
//route    POST /api/v1/bootcamps/:bootcampId/courses
//access   private

exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return new ErrorResponse(`Bootcamp id: ${req.params.bootcampId} not found`, 404);
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    sucess: true,
    count: course.length,
    data: course
  });
});

//@desc    Update course
//route    PUT /api/v1/courses/:id
//access   Private

exports.updateCourse = asyncHandler(async (req, res, next) => {

  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`course with this id: ${req.params.id} not found`));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({
    sucess: true,
    count: course.length,
    data: course
  });
});

//@desc    Delete course
//route    PUT /api/v1/course
//access   Private

exports.deleteCouse = asyncHandler(async (req, res, next) => {

  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`course with this id: ${req.params.id} not found`));
  }
  await course.remove();
  res.status(200).json({
    sucess: true,
    msg: {}
  });
});
