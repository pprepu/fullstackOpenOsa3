const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI;

console.log('connecting to ', url);

mongoose.connect(url, { useNewUrlParser: true })
  .then(res => {
    console.log('connected!');
  })
  .catch((error) => {
    console.log('there has been an error', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

personSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('Person', personSchema);