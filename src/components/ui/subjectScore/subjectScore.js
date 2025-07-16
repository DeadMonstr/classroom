import React from "react";
import styles from "./subjectScore.module.sass";
import classNames from "classnames";



const SubjectScore = ({ icon, subject, score, color, extraClassNameForSubj, extraClassNameForScore }) => {
    return (
        <div className={styles.subjectScore}>
            <div className={styles.left}>
                <span className={classNames(styles.icon, extraClassNameForScore)}>{icon}</span>
                <span className={classNames(styles.subject, extraClassNameForSubj)}>{subject}</span>
            </div>
            <div className={styles.dots} />
            <div className={classNames(`${styles.score} ${styles[color]} ${extraClassNameForScore}`)}>{score}</div>
        </div>
    );
};

export default SubjectScore;
