import React from 'react'
import Tile from '../Tile/Tile'

const TestDetailsTile = () => {
  return (
    <Tile title="tytuł">
        <h3>nagłowek</h3>
        <p>
            jakis tekst
        </p>
        <button className="bg-white">
            przycisk
        </button>
    </Tile>
  )
}

export default TestDetailsTile