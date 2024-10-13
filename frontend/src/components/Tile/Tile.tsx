import { ReactNode, ReactElement, FC } from 'react';
import './Tile.css';

interface TileProps {
    children: ReactNode | ReactElement;
    title: string;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

const Tile: FC<TileProps> = ({
    children,
    title,
    className = '',
    as: Component = 'div',
}) => {
    return (
        <Component className={`tile ${className}`}>
            <h2 className={'tile-title'}>{title}</h2>
            {children}
        </Component>
    );
};

export default Tile;
