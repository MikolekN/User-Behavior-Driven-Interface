import Tile from '../Tile/Tile';
import './TestDetailsTile.css'

const TestDetailsTile = () => {
  return (
    <Tile title="Title">
      <h3>Header</h3>
      <p>Some text</p>
      <button className='py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>Button</button>
    </Tile>
  );
};

export default TestDetailsTile;
