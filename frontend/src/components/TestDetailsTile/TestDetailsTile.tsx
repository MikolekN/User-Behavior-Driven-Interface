import React from 'react';
import Tile from '../Tile/Tile';

const TestDetailsTile = () => {
  return (
    <Tile title="Title">
      <h3>Header</h3>
      <p>Some text</p>
      <button className="bg-white">Button</button>
    </Tile>
  );
};

export default TestDetailsTile;
