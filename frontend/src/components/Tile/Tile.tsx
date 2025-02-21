import { ReactNode, FC } from 'react';

interface TileProps {
    children: ReactNode;
    title: string;
    id?: string;
    className?: string;
}

const Tile: FC<TileProps> = ({ children, title, id, className = '' }) => {
    return (
        <div
            id={`${id}-wrapper`}
            className='flex flex-col flex-grow justify-center items-center min-h-fit h-full w-[90%] max-w-[90%] md:max-w-[70%] md:max-h-full'
        >
            <div
                id={`${id}-tile`}
                className={`bg-white dark:bg-gray-700 p-4 md:p-6 rounded-xl
                    shadow-lg hover:shadow-2xl transition-shadow duration-[0.3s] ease
                    w-full md:w-fit md:max-w-full md:min-w-[50%] md:max-h-full flex flex-col
                    ${className}`}
            >
                <h2 id={`${id}-tile-title`} className="m-0 md:pb-2 md:border-b-2 border-solid text-xl md:text-3xl text-center font-semibold md:min-h-fit flex-none">{title}</h2>
                <div className="flex flex-col gap-4 p-2.5 md:flex-grow md:overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Tile;
