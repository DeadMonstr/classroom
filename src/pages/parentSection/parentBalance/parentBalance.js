import React from 'react';
import styles from './parentBalance.module.sass'
import Card from "../../../components/ui/card";
import {Link} from "react-router-dom";

const ParentBalance = ({balance}) => {


    return (
        <Card extraClassname={styles.balance}>
            <div className={styles.balance__header}>
                <h1>Balans</h1>
                <Link className={styles.balance__btn} to={"parentBalance"}>Hammasi</Link>
            </div>
            <h1 className={styles.balance__balanceAmount}>$ {balance}</h1>
            <p className={styles.balance__deadline}>01.01.2025 dan 01.02.2025 gacha</p>
        </Card>
    );
};

export default ParentBalance;