import { ReactNode, FC } from 'react';

interface TileProps {
    children: ReactNode;
    title: string;
    id?: string;
    className?: string;
}

const Tile: FC<TileProps> = ({ children, title, id, className = '' }) => {
    return (
        <div id={`${id}-tile`} className={`bg-white min-w-fit shadow-lg hover:shadow-2xl transition-shadow duration-[0.3s] ease p-6 m-4 rounded-xl ${className}`}>
            <h2 id={`${id}-tile-title`} className="m-0 pb-2 border-b-2 border-solid border-gray-300 text-3xl text-center font-semibold">{title}</h2>
            {children}
        </div>
    );
};

export default Tile;
