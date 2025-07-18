import React from 'react';

import styles from "components/ui/loaderWithOverlay/LoaderWithOverlay.module.sass"


const LoaderPage = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.loader}>
                <div className={styles.spinner}>
                    <div className={styles.loader__wrapper}>
                        <div />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LoaderPage;