import React, {useCallback} from 'react';
import {usePagination,DOTS} from "hooks/usePagination";
import classNames from "classnames";


import styles from "./style.module.sass"


const Pagination = React.memo(props => {



    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });



    const renderPageNumbers = useCallback(() => {
        return paginationRange.map((pageNumber,index) => {
            if (pageNumber === DOTS) {
                return <li key={index} className={`${styles.paginationItem} ${styles.dots}`}>&#8230;</li>;
            }
            return (
                <li
                    key={index}
                    className={classNames(styles.paginationItem, {
                        [`${styles.selected}`]: pageNumber === currentPage
                    })}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </li>
            );
        })
    },[currentPage, onPageChange, paginationRange])




    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];


    
    const renderedPages = renderPageNumbers()
    
    return (
        <ul
            className={classNames(styles.paginationContainer, { [className]: className })}
        >
            <li
                className={classNames(`${styles.paginationItem} ${styles.arrow}`, {
                    [`${styles.disabled}`]: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <i className="fas fa-angle-left" />
            </li>

            <div className={styles.numbers}>
                {renderedPages}
            </div>

            <li
                className={classNames(`${styles.paginationItem} ${styles.arrow}`, {
                    [`${styles.disabled}`]: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <i className="fas fa-angle-right" />
            </li>
        </ul>
    );
})

export default Pagination;