import { ReactElement, ReactNode } from 'react';
import './Tile.css';

interface TileData {
  children: ReactNode | ReactElement;
  title: string;
  className?: string;
}

const Tile = ({ children, title, className = '' }: TileData) => {
  return (
    <div className={`tile border-2 border-blue-600 border-opacity-20 max-w-sm rounded-lg overflow-hidden ${className}`}>
      <div className="tile-title">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default Tile;
