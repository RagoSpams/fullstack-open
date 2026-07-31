const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// Connection string to MongoDB Atlas
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// CASE 1: Only password provided -> List all phonebook entries
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} 
// CASE 2: Name and Number provided -> Add new entry
else if (process.argv.length >= 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} 
// CASE 3: Invalid number of arguments
else {
  console.log('Please provide both name and number to add an entry, e.g.: node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}