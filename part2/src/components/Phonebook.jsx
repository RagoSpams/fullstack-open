export const Filter = ({ filterQuery, handleFilterChange }) => (
  <div>
    filter shown with <input value={filterQuery} onChange={handleFilterChange} />
  </div>
)

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

// Updated to include a delete button for each person (Exercise 2.14)
export const Persons = ({ persons, handleDeleteOf }) => (
  <div>
    {persons.map(person => (
      <p key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDeleteOf(person.id, person.name)}>
          delete
        </button>
      </p>
    ))}
  </div>
)