import { ChevronLeft, ChevronRight } from 'lucide-react';

const DOTS = '...';

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
};

const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }) => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
        return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * siblingCount;
        let leftRange = range(1, leftItemCount);
        return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * siblingCount;
        let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
        return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
};

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className = '',
}) => {
    const paginationRange = usePagination({ totalCount, pageSize, siblingCount, currentPage });

    if (currentPage === 0 || !paginationRange) {
        return null;
    }

    const onNext = () => {
        if (currentPage < Math.ceil(totalCount / pageSize)) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    return (
        <ul className={`flex items-center gap-1 flex-wrap ${className}`}>
            <li
                className={`flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E1D8] dark:border-[#2A3D38] bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] cursor-pointer hover:bg-[#F4F3EC] dark:hover:bg-[#162019] transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
                    }`}
                onClick={onPrevious}
            >
                <ChevronLeft className="w-4 h-4" />
            </li>

            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return (
                        <li
                            key={`dots-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-[#475569] dark:text-[#7AA49D]"
                        >
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li
                        key={pageNumber}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E1D8] dark:border-[#2A3D38] bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] cursor-pointer hover:bg-[#F4F3EC] dark:hover:bg-[#162019] transition-colors ${pageNumber === currentPage
                            ? '!bg-[#1E8B7A] !border-[#1E8B7A] text-white pointer-events-none'
                            : ''
                            }`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}

            <li
                className={`flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E1D8] dark:border-[#2A3D38] bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] cursor-pointer hover:bg-[#F4F3EC] dark:hover:bg-[#162019] transition-colors ${currentPage === lastPage ? 'opacity-50 pointer-events-none' : ''
                    }`}
                onClick={onNext}
            >
                <ChevronRight className="w-4 h-4" />
            </li>
        </ul>
    );
};

export default Pagination;