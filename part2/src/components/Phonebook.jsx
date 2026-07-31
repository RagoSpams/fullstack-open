// Search filter component (Exercise 2.10)
export const Filter = ({ filterQuery, handleFilterChange }) => (
  <div>
    filter shown with <input value={filterQuery} onChange={handleFilterChange} />
  </div>
)

// Form component for adding new contacts (Exercise 2.10)
export const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

// Component rendering the list of contacts (Exercise 2.10)
export const Persons = ({ persons }) => (
  <div>
    {persons.map(person => (
      <p key={person.name}>
        {person.name} {person.number}
      </p>
    ))}
  </div>
)