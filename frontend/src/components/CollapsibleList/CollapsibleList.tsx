import { useEffect, useState } from "react";
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import arrowUpDark from '../../assets/images/chevron-up-dark.svg';
import arrowDownDark from '../../assets/images/chevron-down-dark.svg';

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
                                    <>
                                        <img src={arrowUp} alt="▼" className='dark:hidden'/>
                                        <img src={arrowUpDark} alt="▼" className='hidden dark:block'/>
                                    </>
                                    :
                                    <>
                                        <img src={arrowDown} alt="▶" className='dark:hidden'/>
                                        <img src={arrowDownDark} alt="▶" className='hidden dark:block'/>
                                    </>
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
