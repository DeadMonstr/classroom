import React from 'react';

import styles from "./Loader.module.sass"


const LoaderPage = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner}>
                <div className={styles.loader__wrapper}>
                    <div />
                </div>
            </div>
        </div>
    );
};

export default LoaderPage;