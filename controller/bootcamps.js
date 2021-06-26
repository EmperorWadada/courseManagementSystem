const path = require('path');
const Bootcamp = require('../model/Bootcamps');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/erroResponse');
const files = require('express-fileupload');


//@desc    Get all bootcamps
//route    GET /api/v1/bootcamps
//access   public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

  //copy req.query
  const reqQuery = { ...req.query };
  let query;

  //filds to remove from query string
  const removeFields = ['select', 'page', 'limit', 'sort'];
  removeFields.forEach(params => delete reqQuery[params]);
  //Conver reqQuery object to string for maninulation
  let queryString = JSON.stringify(reqQuery);

  //Matching string in mongoose eg (gt, gte etc)
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  if (req.query.select) {
    const field = req.query.select.split(',').join(' ');
    query = query.select(field);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);
  const bootcamp = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    sucess: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp
  });

});

//@desc    Get Single bootcamp
//route    GET /api/v1/bootcamp
//access   public

exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorResponse(`Bootcamp with id: ${req.params.id} not found`);
  }
  res.status(200).json({
    sucess: true,
    data: bootcamp
  });
});

//@desc    Create a bootcamps
//route    POST /api/v1/bootcamps
//access   public

exports.createBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    sucess: true,
    count: bootcamp.length,
    data: bootcamp
  });
});

//@desc    Update bootcamps
//route    PUT /api/v1/bootcamps
//access   Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with this id: ${req.params.id} not found`));
  }
  res.status(200).json({
    sucess: true,
    count: bootcamp.length,
    data: bootcamp
  });
});

//@desc    Delete bootcamps
//route    PUT /api/v1/bootcamps
//access   Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with this id: ${req.params.id} not found`));
  }
  bootcamp.remove();
  res.status(200).json({
    sucess: true,
    msg: 'Bootcamp deleted!'
  });
});


//@desc    Upload photo for bootcamps
//route    PUT /api/v1/bootcamps/:bootcampId/photo
//access   Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with this id: ${req.params.id} not found`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }
  //Check file size

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  //create custom filename 
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {

    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Could not upload file`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      sucess: true,
      data: file.name
    });
  });

});