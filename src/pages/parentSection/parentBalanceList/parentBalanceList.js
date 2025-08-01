import React, {useEffect, useState} from 'react';
import styles from './parentBalance.module.sass'
import Back from "../../../components/ui/back";
import Select from "../../../components/ui/form/select";
import Card from "../../../components/ui/card";
import Table from "../../../components/ui/table";
import {isMobile} from "react-device-detect";
import {fetchChildrenBalance} from "../../../slices/parentSlice";
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../components/ui/button";
import classNames from "classnames";

const years = [
    "2025",
    "2024",
    "2023"
]

const data = [
    {
        id: 1,
        name: "Web dasturchilik",
        payment: "390.000",
        date: "01.01.2024",
        payment_type: "cash"
    },{
        id: 1,
        name: "Web dasturchilik",
        payment: "390.000",
        date: "01.01.2024",
        payment_type: "cash"
    },{
        id: 1,
        name: "Web dasturchilik",
        payment: "390.000",
        date: "01.01.2024",
        payment_type: "cash"
    },{
        id: 1,
        name: "Web dasturchilik",
        payment: "390.000",
        date: "01.01.2024",
        payment_type: "cash"
    },
]

const ParentBalanceList = () => {

    const dispatch = useDispatch()
    const [active, setActive] = useState(1);
    const platformID = localStorage.getItem("platform_id")
    const {balance} = useSelector(state => state.parentSlice)
    const [status, setStatus] = useState(true)

    useEffect(() => {
        dispatch(fetchChildrenBalance({username: platformID, status: status}))
    }, [platformID, status]);

    const renderTable = () => {
        return balance?.map((item, index) => {
            return(
                <tr key={index}>

                    <td>{index+1}</td>
                    <td style={{fontWeight: "bold"}}>{item.amount.toLocaleString()}</td>
                    <td style={{fontWeight: "bold"}}>{item.payment_type}</td>
                    <td>{item.date}</td>
                </tr>
            )
        })
    }

    console.log(active, 'dddd')


    const renderDebtTable = () => {
        return balance?.map((item, index) => {
            return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td style={{fontWeight: "bold"}}>{item.amount.toLocaleString()}</td>
                    <td style={{fontWeight: "bold"}}>{item.payment_type}</td>
                    <td>{item.date}</td>
                </tr>
            )
        })
    }


    const renderMobileTable = () => {
        return balance?.map((item, index) => {
            return (
                <Card extraClassname={styles.balance__mobile__list__card}>
                    <div className={styles.balance__mobile__list__card__header}>
                        <h2>{item.payment_type}</h2>
                        <h2>{item.date}</h2>
                    </div>
                    <div className={styles.balance__mobile__list__card__main}>
                        <span>
                            {item.amount}
                        </span>

                    </div>
                </Card>
            )
        })
    }

    return (
        <div className={styles.balance}>
            <div className={styles.balance__header}>
                <Back className={styles.balance__header__btn}/>

            </div>
            {
                !isMobile && (
                    <Card extraClassname={styles.balance__card}>
                        <div className={styles.balance__card__box}>
                            <h1>Balans</h1>
                            <div className={styles.balance__card__box__panel}>
                                <Button
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 1 ? styles.active  : '')}
                                    children={"To'langanlar"}
                                    onClick={() => {
                                        setActive(1)
                                        setStatus(true)
                                    }}
                                />

                                <Button
                                    children={"Chegirmalar"}
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 2 ? styles.active  : '')}
                                    onClick={() =>
                                    {
                                        setActive(2)
                                        setStatus(false)
                                    }}
                                />
                            </div>
                        </div>
                        {
                            active === 1 && (
                                <Table>
                                    <thead className={styles.balance__card__header}>
                                    <th>№</th>
                                    <th>To'lov miqdori</th>
                                    <th>To'lov turi</th>
                                    <th>Sana</th>
                                    </thead>
                                    <tbody>
                                    {renderTable()}
                                    </tbody>
                                </Table>
                            )
                        }
                        {
                            active === 2 && (
                                <Table>
                                    <thead  className={styles.balance__card__header}>
                                    <th>№</th>
                                    <th>To'lov miqdori</th>
                                    <th>To'lov turi</th>
                                    <th>Sana</th>
                                    </thead>
                                    <tbody>
                                    {renderDebtTable()}
                                    </tbody>
                                </Table>
                            )
                        }


                    </Card>
                )
            }
            {
                isMobile && (
                    <div className={styles.balance__mobile}>
                        <div className={styles.balance__mobile__header}>
                            <h2>Umumiy balans</h2>
                            {/*<h2>{totalDebt}</h2>*/}
                        </div>
                        <div className={styles.balance__mobile__list}>
                            {renderMobileTable()}
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default ParentBalanceList;
