import React, { useState } from 'react';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import arrowUpDark from '../../assets/images/chevron-up-dark.svg';
import arrowDownDark from '../../assets/images/chevron-down-dark.svg';

interface CollapsibleTableProps<T> {
    headers: string[];
    rows: T[];
    renderRow: (item: T, activeIndex: number | null, hovering: number | null, idx: number) => React.ReactNode;
    renderRowDetails: (item: T) => React.ReactNode;
    activeIndex: number | null;
    setActiveIndex: (index: number | null) => void;
}

const CollapsibleTable = <T,>({ headers, rows, renderRow, renderRowDetails, activeIndex, setActiveIndex }: CollapsibleTableProps<T>) => {
    const [hovering, setHovering] = useState<number | null>(null);

    const toggleActiveTableRow = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="border-collapse rounded p-2 overflow-x-auto dark:bg-gray-900">
            <table className="w-full">
                <thead>
                    <tr className="font-bold text-center">
                        {headers.map((header, idx) => (
                            <th key={idx} className={`bg-gray-200 px-4 py-2 ${idx === 0 ? 'rounded-tl-lg rounded-bl-lg' : ''} dark:bg-gray-800 dark:text-gray-300`}>
                                {header}
                            </th>
                        ))}
                        <th className="bg-gray-200 px-4 py-2 rounded-tr-lg rounded-br-lg  dark:bg-gray-800 dark:text-gray-300"></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <React.Fragment key={idx}>
                            <tr className="h-2"></tr>
                            <tr
                                className="cursor-pointer"
                                onClick={() => toggleActiveTableRow(idx)}
                                onMouseOver={() => setHovering(idx)}
                                onMouseLeave={() => setHovering(null)}
                            >
                                {renderRow(row, activeIndex, hovering, idx)}
                                <td className={`px-4 py-2 text-center rounded-tr ${activeIndex !== idx ? 'rounded-br' : ''}  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                    {activeIndex === idx ? 
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
                                </td>
                            </tr>
                            {activeIndex === idx && (
                                <tr className={`${activeIndex === idx ? 'expanded' : 'hidden'}`}>
                                    <td colSpan={headers.length + 1} className="bg-white rounded-b-lg dark:bg-gray-900">
                                        {renderRowDetails(row)}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CollapsibleTable;
