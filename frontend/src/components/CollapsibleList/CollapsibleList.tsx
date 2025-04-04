import { useEffect, useState } from "react";

interface CollapsibleListProps<T> {
    items: T[];
    renderHeader: (item: T, isExpanded: boolean) => React.ReactNode;
    renderDetails: (item: T) => React.ReactNode;
}

const CollapsibleList = <T,>({ items, renderHeader, renderDetails }: CollapsibleListProps<T>) => {
    const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});

    const toggleItem = (index: number) => {
        setExpandedIndexes((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        if (items && items.length > 0) {
            const mostRecentDate = 0;
            setExpandedIndexes({ [mostRecentDate]: true });
        }
    }, [items]);

    return (
        <div>
            {items.map((item, index) => {
                const isExpanded = expandedIndexes[index];
                return (
                    <div key={index} className="mb-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                        <div
                            className="dark:text-gray-300 bg-gray-200 dark:bg-gray-800 p-2 font-semibold rounded mb-1 text-center w-full flex justify-between items-center cursor-pointer
                                transition-[background-color] duration-[0.3s] hover:bg-gray-300 dark:hover:bg-gray-700"
                            onClick={() => toggleItem(index)}
                        >
                            {renderHeader(item, isExpanded)}
                            <span id='toggle-icon' className='text-sm ml-2'>
                                {isExpanded ?
                                    <svg className="w-4 h-4 ms-1 transition-transform duration-300 rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                    :
                                    <svg className="w-4 h-4 ms-1 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                }
                            </span>
                        </div>
                        <div
                            className={`max-h-0 overflow-hidden transition-[max-height] duration-[0.5s] ease-[ease-in-out] ${isExpanded ? 'max-h-max' : ''} dark:bg-gray-800`}
                        >
                            {isExpanded && (
                                <div className="p-1 dark:text-gray-300 bg-white dark:bg-gray-800 rounded shadow-sm">
                                    {renderDetails(item)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CollapsibleList;
