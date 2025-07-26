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
        </Card>
    );
};

export default ParentBalance;