import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [filterQuery, setFilterQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  // Fetch all countries initially (Exercise 2.18)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => setFilterQuery(event.target.value)

  const matchedCountries = filterQuery
    ? allCountries.filter(country =>
        country.name.common.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : []

  return (
    <div>
      find countries <input value={filterQuery} onChange={handleFilterChange} />
      <Countries
        countries={matchedCountries}
        setFilterQuery={setFilterQuery}
      />
    </div>
  )
}

export default App