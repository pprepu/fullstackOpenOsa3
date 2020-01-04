const mongoose = require('mongoose');

if ( process.argv.length < 3 ) {
  console.log('You need to insert your mongoDB-atlas password as the 3rd argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0-bvxvd.mongodb.net/phonenumbers?retryWrites=true`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});



const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const addedPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  addedPerson.save().then(res => {
    console.log(`Added ${addedPerson.name} number ${addedPerson.number} to phonebook`);
    mongoose.connection.close();
  });
}
