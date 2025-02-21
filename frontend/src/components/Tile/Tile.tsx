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
            className='flex flex-col justify-center items-center w-[90%] max-w-[90%] md:max-w-[70%] md:h-auto'
        >
            <div
                id={`${id}-tile`}
                className={`bg-white dark:bg-gray-700 p-2 md:p-6 rounded-xl
                    shadow-md hover:shadow-lg transition-shadow duration-[0.3s] ease
                    w-full md:w-fit md:max-w-full md:min-w-[50%]
                    flex flex-col my-4 overflow-hidden min-h-0
                    ${className}`}
            >
                <h2
                    id={`${id}-tile-title`}
                    className="m-0 md:pb-2 md:border-b-2 border-solid text-xl md:text-3xl text-center font-semibold flex-none"
                >
                    {title}
                </h2>
                <div
                    className="flex flex-col gap-4 p-2.5 flex-grow overflow-y-auto"
                    style={{
                        flex: '1 1 auto',
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 200px)', // Adjust as needed
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Tile;
