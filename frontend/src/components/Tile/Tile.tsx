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
            className='flex flex-grow md:flex-grow-0 flex-col justify-center items-center w-[90%] max-w-[90%] md:h-auto md:max-w-full md:w-full'
        >
            <div
                id={`${id}-tile`}
                className={`bg-white dark:bg-gray-700 p-2 md:p-6 rounded-xl
                    shadow-md hover:shadow-lg transition-shadow duration-[0.3s] ease
                    w-full md:w-fit md:max-w-full md:min-w-[50%]
                    flex flex-col my-4 md:overflow-hidden md:min-h-0
                    ${className}`}
            >
                <h2
                    id={`${id}-tile-title`}
                    className="m-0 md:pb-2 md:border-b-2 border-solid text-xl md:text-3xl text-center font-semibold flex-none"
                >
                    {title}
                </h2>
                <div
                    className="flex flex-col gap-4 p-2.5 md:overflow-y-auto md:flex-grow md:flex-shrink md:basis-auto md:max-h-[calc(100vh-200px)]"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Tile;
