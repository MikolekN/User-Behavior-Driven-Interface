import { ReactNode, FC } from 'react';
import './Tile.css';

interface TileProps {
    children: ReactNode;
    title: string;
    className?: string;
}

const Tile: FC<TileProps> = ({ children, title, className = '' }) => {
    return (
        <div className={`tile ${className}`}>
            <h2 className="tile-title">{title}</h2>
            {children}
        </div>
    );
};

export default Tile;
