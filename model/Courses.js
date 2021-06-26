const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a nmae']
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add a week']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition fee']
  },
  minimumSkill: {
    type: [String],
    required: [true, 'Please add a nmae'],
    emum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }

});


CourseSchema.statics.averageCost = async function (bootcampId) {

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.error(error);
  }

}

CourseSchema.post('save', function () {
  this.constructor.averageCost(this.bootcamp);
});

CourseSchema.pre('remove', function () {
  this.constructor.averageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);