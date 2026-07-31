import { useState } from 'react'
import { Filter, PersonForm, Persons } from './components/Phonebook'

const App = () => {
  // Initial hardcoded state for testing (Exercise 2.9)
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  // State for controlling form inputs & filter (Exercise 2.6, 2.8, 2.9)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  // Event Handlers for Controlled Inputs
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterQuery(event.target.value)

  // Form submission handler (Exercises 2.6, 2.7, 2.8)
  const addPerson = (event) => {
    event.preventDefault()

    // Exercise 2.7: Check if name already exists (case-insensitive check)
    const nameExists = persons.some(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    )

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    // Create new person object
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    // Update state immutably using concat
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  // Exercise 2.9: Filter displayed persons case-insensitively
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filterQuery.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterQuery={filterQuery} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} />
    </div>
  )
}

export default App