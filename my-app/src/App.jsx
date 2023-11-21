import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>SUMMONERS CARD</h1>
      <input type="text" name="summoner" placeholder='Enter summoner name...' />
      <div className="box">
        <select name="server">
          <option value="euw">EUW</option>
          <option value="eune">EUNE</option>
          <option value="na">NA</option>
        </select>
        <button onClick={() => setCount((count) => count + 1)}>
          Search
        </button>
      </div>
    </>
  )
}

export default App
