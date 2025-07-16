import React, {useEffect, useState} from 'react';
import styles from "./childrenWeeklyTestResults.module.sass"
import Card from "../../../components/ui/card";
import {Link} from "react-router-dom";
import Table from "../../../components/ui/table";
import {useDispatch, useSelector} from "react-redux";
import {fetchChildrenGroups, fetchChildrenTests, fetchChildrenTestsDate} from "../../../slices/parentSlice";



const ChildrenWeeklyTestResults = () => {

    const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    const currentUsername = localStorage.getItem("current_username")

    const dispatch = useDispatch()
    const {tests, tests_date} = useSelector(state => state.parentSlice)

    console.log(groupId, 'dd')


    useEffect(() => {
        dispatch(fetchChildrenTestsDate(groupId))
        dispatch(fetchChildrenGroups(currentUsername))
        dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
    }, [currentYear, groupId]);




    const renderTableData = () => {

        return tests?.map(item => {
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
        <Card extraClassname={styles.test}>
            <div className={styles.test__header}>
                <h1>Test natijalari</h1>
                <Link className={styles.test__btn} to={"/home/childrenTestsResults"}>Hammasi</Link>
            </div>
            {
                tests && tests.length > 0 ?
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
                </Table> : <h1 style={{display: "flex", alignSelf: "center"}}>Yechilgan testlar yo'q</h1>
            }

        </Card>
    );
};

export default ChildrenWeeklyTestResults