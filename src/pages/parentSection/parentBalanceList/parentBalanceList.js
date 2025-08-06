import React, {useEffect, useState} from 'react';
import styles from './parentBalance.module.sass'
import Back from "../../../components/ui/back";
import Select from "../../../components/ui/form/select";
import Card from "../../../components/ui/card";
import Table from "../../../components/ui/table";
import {isMobile} from "react-device-detect";
import {fetchChildrenBalance, fetchChildrenDebtBalance} from "../../../slices/parentSlice";
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../components/ui/button";
import classNames from "classnames";
import LoaderPage from "../../../components/ui/loader/Loader";

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
    const {balance, debts, loading} = useSelector(state => state.parentSlice)
    const [status, setStatus] = useState(true)

    // useEffect(() => {
    //     dispatch(fetchChildrenBalance({username: platformID, status: status}))
    //
    // }, [platformID, status]);

    useEffect(() => {
        dispatch(fetchChildrenDebtBalance(platformID))
    }, [platformID]);

    console.log(debts, "debbbbb")

    const renderTable = () => {

        return debts?.data?.payments?.map((item, index) => {
                return(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.payment.toLocaleString()}</td>
                        <td>{item.type_payment}</td>
                        <td>{item.date}</td>
                    </tr>
                )
            })
    }

        const renderDiscountTable = () => {
            return debts?.data?.discounts?.map((item, index) => {
                return(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td style={{fontWeight: "bold"}}>{item.payment.toLocaleString()}</td>
                        <td style={{fontWeight: "bold"}}>{item.date}</td>
                    </tr>
                )
            })
        }




        const renderDebtTable = () => {

            return debts?.data?.debts?.map((item, index) => {
                    return (
                        <tr key={index} >
                            <td>{index+1}</td>
                            <td>{item.group_name}</td>
                            <td>{item.days}</td>
                            <td>{item.absent}</td>
                            <td>{item.discount}</td>
                            <td>{item.payment.toLocaleString()}</td>
                            <td>{item.month}</td>
                            <td>{item.total_debt.toLocaleString()}</td>

                        </tr>
                    )
                })
            }





    const renderMobileTable = () => {
        return debts?.data?.debts?.map((item, index) => {
            return (
                <Card extraClassname={styles.balance__mobile__list__card}>
                    <div className={styles.balance__mobile__list__card__header}>
                        <h2>{item.group_name}</h2>
                        <h2>{item.type_payment}</h2>
                        <h2>{item.date}</h2>
                    </div>
                    <div className={styles.balance__mobile__list__card__main}>
                        <span>
                            {item.payment}
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
                                    children={"To'lov"}
                                    onClick={() => {
                                        setActive(1)
                                        setStatus(true)
                                    }}
                                />

                                <Button
                                    children={"Qarzlar"}
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 2 ? styles.active  : '')}
                                    onClick={() =>
                                    {
                                        setActive(2)
                                        setStatus(true)
                                    }}
                                />
                                <Button
                                    children={"Chegirmalar"}
                                    extraClass={classNames(styles.balance__card__box__panel__btn, active === 3 ? styles.active  : '')}
                                    onClick={() =>
                                    {
                                        setActive(3)
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
                                    {
                                        loading ? <LoaderPage/> : <tbody>
                                        {renderTable()}
                                        </tbody>
                                    }
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
                                    {loading ? <LoaderPage/> :renderDebtTable()}
                                    </tbody>
                                </Table>
                            )
                        }
                        {
                            active === 3 && (
                                <Table>
                                    <thead  className={styles.balance__card__header}>
                                    <th>№</th>
                                    <th>To'lov miqdori</th>
                                    <th>Sana</th>
                                    </thead>
                                    <tbody>
                                    {
                                        loading ? <LoaderPage/> : renderDiscountTable()
                                    }
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
