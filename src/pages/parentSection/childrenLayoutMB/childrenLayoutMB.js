import React, {useEffect, useState} from 'react';
import {Link, Outlet} from 'react-router-dom';

import styles from './childrenLayoutMB.module.sass';
import Select from "../../../components/ui/form/select";
import Card from "../../../components/ui/card";
import calendarIcon from "assets/icons/calendar.svg"
import walletIcon from "assets/icons/wallet.svg"
import resultIcon from "assets/icons/result.svg"
import {useDispatch, useSelector} from "react-redux";
import {
    fetchChildrenAttendance,
    fetchChildrenAttendanceWeekly, fetchChildrenBalance,
    fetchChildrenGroups, fetchChildrenTests, fetchChildrenTestsDate,
    fetchParentData
} from "../../../slices/parentSlice";

const options = [
    {value: 'child1', label: 'Farzand 1'},
    {value: 'child2', label: 'Farzand 2'},
];

const ChildrenLayoutMB = () => {
    const [innerType,setInnerType] = useState()
    const dispatch = useDispatch()
    const {data} = useSelector(state  => state.user)
    const {parent} = useSelector(state => state.parentSlice)
    const selectedChild = parent.find(child => child.platform_id === +innerType)
    const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    // localStorage.setItem("current_username", selectedChild?.username)

    useEffect(() => {
       if (data?.id)
        dispatch(fetchParentData(data.id))
    },[data.id])

    useEffect(() => {
        if (!selectedChild?.platform_id) {
            dispatch(fetchChildrenAttendance(selectedChild?.platform_id))
            dispatch(fetchChildrenGroups(selectedChild?.platform_id))
            // dispatch(fetchChildrenAttendanceWeekly(selectedChild?.username))
            dispatch(fetchChildrenBalance(selectedChild?.platform_id))
            dispatch(fetchChildrenTestsDate(groupId))
           if (!groupId && !currentYear && !currentMonth ) {
               dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
           }

        }
    }, [selectedChild ]);

    return (
        <div className={styles.layout}>
            <Card extraClassname={styles.selectBox}>

                <Select
                    keyValue={"platform_id"}
                    options={parent}
                    onChange={setInnerType}
                    value={innerType}
                    style={{width: "350px"}}
                    extraClassName={styles.selectBox__select}
                    title={"Farzandim"}
                />
            </Card>
            <div className={styles.layout__menu}>
                <Link to="monthly-attendance">
                    <Card style={{background: "#E3FF87"}} extraClassname={styles.layout__menu__card}>
                        <img src={calendarIcon} alt=""/>
                        <h3>Davomat</h3>
                    </Card>
                </Link>
                <Link to="monthly-balance">
                    <Card style={{background: "#FF9387"}} extraClassname={styles.layout__menu__card}>
                        <img src={walletIcon} alt=""/>
                        <h3>Balans</h3>
                    </Card>
                </Link>
               <Link to="monthly-result">
                   <Card style={{background: "#BD87FF"}} extraClassname={styles.layout__menu__card}>
                       <img src={resultIcon} alt=""/>
                       <h3>Test natija</h3>
                   </Card>
               </Link>

            </div>
            <div className={styles.pageContainer}>
                <Outlet context={{selectedChild}}/>
            </div>
        </div>
    );
};

export default ChildrenLayoutMB;
