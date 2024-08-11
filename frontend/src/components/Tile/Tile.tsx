import { ReactElement, ReactNode } from 'react';
import './Tile.css';

interface TileData {
  children: ReactNode | ReactElement;
  title: string;
}

const Tile = ({ children, title }: TileData) => {
  return (
    <div className="tile border-2 border-blue-600 border-opacity-20 max-w-sm rounded-lg overflow-hidden">
      <div className="tile-title">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default Tile;