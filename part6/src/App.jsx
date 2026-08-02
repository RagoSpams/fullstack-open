cat << 'EOF' > src/App.jsx
import { useFeedback, useFeedbackActions } from './store'

const Statistics = ({ good, ok, bad }) => {
  const total = good + ok + bad

  if (total === 0) {
    return <div>No feedback given</div>
  }

  const average = (good - bad) / total
  const positive = (good / total) * 100

  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{ok}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{total}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{average.toFixed(1)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{positive.toFixed(1)} %</td>
        </tr>
      </tbody>
    </table>
  )
}

const App = () => {
  const { good, ok, bad } = useFeedback()
  const { good: addGood, ok: addOk, bad: addBad, zero } = useFeedbackActions()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={addGood}>good</button>
      <button onClick={addOk}>neutral</button>
      <button onClick={addBad}>bad</button>
      <button onClick={zero}>reset stats</button>

      <h2>statistics</h2>
      <Statistics good={good} ok={ok} bad={bad} />
    </div>
  )
}

export default App
EOF