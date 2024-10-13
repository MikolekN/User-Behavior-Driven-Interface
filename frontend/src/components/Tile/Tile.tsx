import { ReactNode, FC, ElementType } from 'react';
import './Tile.css';

interface TileProps {
    children: ReactNode;
    title: string;
    className?: string;
    as?: ElementType;
    titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Tile: FC<TileProps> = ({
    children,
    title,
    className = '',
    as: Component = 'div',
    titleLevel = 2,
}) => {
    const TitleTag = `h${titleLevel}` as keyof JSX.IntrinsicElements;

    return (
        <Component className={`tile ${className}`}>
            <TitleTag className="tile-title">{title}</TitleTag>
            {children}
        </Component>
    );
};

export default Tile;
