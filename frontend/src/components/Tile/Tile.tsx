import { ReactElement, ReactNode } from 'react';
import './Tile.css';

interface TileData {
  children: ReactNode | ReactElement;
  title: string;
  className?: string;
};

const Tile = ({ children, title, className = "" }: TileData) => {
  return (
    <div className={`${className} tile border-2 border-blue-600 border-opacity-20 rounded-lg overflow-hidden`}>
      <div className="font-semibold text-2xl mb-6 text-gray-700 tile-title">
        {title}
      </div>
      {children}
    </div>
  );
};

export default Tile;
