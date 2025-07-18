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

    console.log(balance, 'ssd')
    useEffect(() => {
        dispatch(fetchChildrenBalance(platformID))
    }, [platformID]);

    const renderTable = () => {
        return balance?.data?.debts.map((item, index) => {
            return(
                <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.group_name}</td>
                    <td>{item.payment}</td>
                    <td>{item.month}</td>
                    <td>{item.total_debt}</td>
                </tr>
            )
        })
    }

    const renderDiscountTable = () => {
        return balance?.data?.debts.map((item, index) => {
            return(
                <tr key={index}>
                    <td>{index}</td>
                    <td>{item.discount}</td>
                    <td>{item.month}</td>
                </tr>
            )
        })
    }

    const renderDebtTable = () => {
        return balance?.data?.debts.map((item, index) => {
            return(
                <tr key={index} >
                    <td>{index}</td>
                    <td>{item.group_name}</td>
                    <td>{item.days}</td>
                    <td>{item.absent}</td>
                    <td>{item.discount}</td>
                    <td>{item.payment}</td>
                    <td>{item.month}</td>
                    <td>{item.total_debt}</td>

                </tr>
            )
        })
    }


    const renderMobileTable = () => {
        return balance?.data?.debts.map((item, index) => {
            return (
                <Card extraClassname={styles.balance__mobile__list__card}>
                    <div className={styles.balance__mobile__list__card__header}>
                        <h2>{item.group_name}</h2>
                        <h2>{item.days}</h2>
                    </div>
                    <div className={styles.balance__mobile__list__card__main}>
                        <span>
                            {item.payment}
                        </span>
                        <h2>{item.total_debt}</h2>
                    </div>
                </Card>
            )
        })
    }

    const [year, setYear] = React.useState()
    return (
        <div className={styles.balance}>
            <div className={styles.balance__header}>
                <Back className={styles.balance__header__btn}/>
                {/*{*/}
                {/*    !isMobile && (*/}
                {/*        <Select title={"Yil"} value={year} onChange={setYear} options={years}/>*/}
                {/*    )*/}
                {/*}*/}

            </div>
            {
                !isMobile && (
                    <Card extraClassname={styles.balance__card}>
                        <div className={styles.balance__card__box}>
                            <h1>Balans</h1>
                            <div className={styles.balance__card__box__panel}>
                                <Button
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 1 ? styles.active  : '')}
                                    children={"To'lov"}
                                    onClick={() => setActive(1)}
                                />
                                <Button
                                    children={"Qarzlar"}
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 2 ? styles.active  : '')}
                                    onClick={() => setActive(2)}
                                />
                                <Button
                                    children={"Chegirma"}
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 3 ? styles.active  : '')}
                                    onClick={() => setActive(3)}
                                />
                            </div>
                        </div>
                        {
                            active === 1 && (
                                <Table>
                                    <thead className={styles.balance__card__header}>
                                    <th>№</th>
                                    <th>Fan nomi</th>
                                    <th>To'lov</th>
                                    <th>Sana</th>
                                    <th>Umumiy qarz</th>
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
                                    <th>Guruh fani</th>
                                    <th>Kegan kunlar</th>
                                    <th>Kemagan kunlar</th>
                                    <th>Chegirma</th>
                                    <th>To'lov</th>
                                    <th>Oy</th>
                                    <th>Hamma qarzi</th>
                                    </thead>
                                    <tbody>
                                    {renderDebtTable()}
                                    </tbody>
                                </Table>
                            )
                        }
                        {
                            active === 3 && (
                                <Table>
                                    <thead  className={styles.balance__card__header}>
                                    <th>№</th>
                                    <th>To'lov</th>
                                    <th>Sana</th>
                                    </thead>
                                    <tbody>
                                    {renderDiscountTable()}
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
