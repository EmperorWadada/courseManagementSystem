const mongoose = require('mongoose');
const slugify = require('slugify');


const BootcampSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more 50 character']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more tha 500 character']
  },
  website: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Mobile Development",
      "Web Development",
      "Data Science",
      "Business",
      "UI/UX"
    ]
  },
  averageCost: Number,
  pohoto: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//cascade delete
BootcampSchema.pre('remove', async function (next) {
  console.log(`Course being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });

  next();
});

BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});



module.exports = mongoose.model('Bootcamp', BootcampSchema);