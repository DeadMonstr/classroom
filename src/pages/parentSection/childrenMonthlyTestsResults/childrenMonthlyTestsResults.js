import React, {useEffect, useState} from 'react';
import styles from './childrenMonthlyTestsResults.module.sass'
import Back from "../../../components/ui/back";
import Select from "../../../components/ui/form/select";
import {Link} from "react-router-dom";
import Table from "../../../components/ui/table";
import Card from "../../../components/ui/card";
import {isMobile} from "react-device-detect";
import {useDispatch, useSelector} from "react-redux";
import {fetchChildrenTestsDate, fetchChildrenTests, fetchChildrenGroups} from "../../../slices/parentSlice";



const ChildrenMonthlyTestsResults = () => {

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [group, setGroup] = useState();
    const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    const currentUsername = localStorage.getItem("current_username")

    const dispatch = useDispatch()
    const {tests, tests_date, groups} = useSelector(state => state.parentSlice)
    const groupIds = groups.group_list



    useEffect(() => {
        dispatch(fetchChildrenTestsDate(groupId))
        dispatch(fetchChildrenGroups(currentUsername))
        dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
    }, [groupId]);

    useEffect(() => {
        if (year || month || group){
            dispatch(fetchChildrenTests({
                groupId: group,
                year: year,
                month: month
            }))
        }
    }, [year, month, group])



    const renderMobileTable = () => {
        return tests.map((item, index) => {
            return (
                <Card style={parseInt(item.percentage) > 49 ? {background: "#B0FFC5"} : {background: "#FFB0B0"}} extraClassname={styles.test__arounder__card}>
                    <div className={styles.test__arounder__card__header}>
                        <h1>{item.subject_name}</h1>
                        <h2>{item.test_info.level}</h2>
                    </div>
                    <div className={styles.test__arounder__card__main}>
                        <h1>{item.percentage}</h1>
                        <h2>{item.date}</h2>
                    </div>
                    <div className={styles.test__arounder__card__footer}>
                        {parseInt(item.percentage) > 49 ? (
                            <h1>O'tdi ✅</h1>
                        ) : (
                            <h1>O'tmadi ❌</h1>
                        )}
                    </div>
                </Card>
            )
        })
    }

    const renderTableData = () => {
        return tests.map(item => {
            return (
                <tr>
                    <td>{item.subject_name}</td>
                    <td>{item.test_info.level}</td>
                    <td>{item.date}</td>
                    <td>{item.percentage}</td>
                    {parseInt(item.percentage) > 49 ? (
                        <td style={{ color: "green", fontWeight: "bold" }}>O'tdi ✅</td>
                    ) : (
                        <td style={{ color: "red", fontWeight: "bold" }}>O'tmadi ❌</td>
                    )}
                </tr>
            )
        })
    }

    return (
        <div className={styles.test}>
            <div className={styles.test__header}>
                <Back className={styles.test__header__btn}/>
                {
                    !isMobile && (
                        <div className={styles.test__header__div}>
                            <Select style={{ width: "400px" }} title={"Yil"} value={year} onChange={setYear} defaultOption={"Yil"} options={tests_date?.years_list}/>
                            <Select style={{ width: "400px" }} title={"Oy"} value={month} onChange={setMonth} defaultOption={"Oy"} options={tests_date?.month_list}/>
                            <Select
                                title={"Guruh"}
                                value={group}
                                onChange={setGroup}
                                options={groupIds}
                                defaultOption={"Guruh"}
                                style={{ width: "400px" }}
                            />
                        </div>

                    )
                }
                {
                    isMobile && (
                        <div className={styles.test__header__second}>
                            <h1>Test natijalari</h1>
                            <div className={styles.test__header__second__box}>
                                <Select title={"Yil"} value={year} onChange={setYear} options={tests_date?.years_list} extraClassName={styles.test__header__second__box__select} />
                                <Select title={"Oy"} value={month} onChange={setMonth} options={tests_date?.month_list} extraClassName={styles.test__header__second__box__select} />
                            </div>
                        </div>
                    )
                }

            </div>
            {
                !isMobile && (
                    <Card extraClassname={styles.test__card}>
                        <div className={styles.test__header}>
                            <h1>Test natijalari</h1>
                        </div>
                        <Table>
                            <thead>
                            <th>Fan</th>
                            <th>Daraja</th>
                            <th>Sana</th>
                            <th>Natija</th>
                            <th>Status</th>
                            </thead>
                            <tbody>
                            {renderTableData()}
                            </tbody>
                        </Table>
                    </Card>
                )
            }
            {
                isMobile && (
                    <div className={styles.test__arounder}>
                        {renderMobileTable()}
                    </div>
                )
            }

        </div>
    );
};

export default ChildrenMonthlyTestsResults