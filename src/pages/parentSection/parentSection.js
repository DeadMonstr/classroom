import React, {useEffect, useState} from 'react';
import styles from './parentSection.module.sass'
import ChildrenWeeklyAttendance from "./childrenWeeklyAttendance/childrenWeeklyAttendance";
import ParentBalance from "./parentBalance/parentBalance";
import ChildrenWeeklyTestResults from "./childrenWeeklyTestResults/childrenWeeklyTestResults";
import Select from "../../components/ui/form/select";
import ChildrenWeeklyGrades from "./childrenWeeklyGrades/childrenWeeklyGrades";
import Card from "../../components/ui/card";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchChildrenAttendance, fetchChildrenAttendanceMonthly,
    fetchChildrenAttendanceWeekly, fetchChildrenBalance,
    fetchChildrenGroups, fetchChildrenTests, fetchChildrenTestsDate,
    fetchParentData
} from "../../slices/parentSlice";
import {isMobile} from "react-device-detect";
import ChildrenLayoutMB from "./childrenLayoutMB/childrenLayoutMB";


const ParentSection = () => {
    const [innerType,setInnerType] = useState()
    const dispatch = useDispatch()
    const {data} = useSelector(state  => state.user)
    const {parent, weeklyAttendance, groups, dates} = useSelector(state => state.parentSlice)

    console.log(parent)
    const selectedChild = parent.find(child => child.platform_id === +innerType)
    const selectedBalance = selectedChild?.balance
    const selectedGroupId = groups?.group_list?.map((item) => item.id)
    localStorage.setItem("group_id", selectedGroupId)
    localStorage.setItem("current_month", dates.data?.current_month)
    localStorage.setItem("current_year", dates.data?.current_year)
    localStorage.setItem("platform_id", selectedChild?.platform_id)




    useEffect(() => {
        if (data?.id)  dispatch(fetchParentData(data.id))
    },[data.id])

    useEffect(() => {
        const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
        const currentMonth = localStorage.getItem("current_month")
        const currentYear = localStorage.getItem("current_year")

        if (selectedChild?.platform_id) {
            dispatch(fetchChildrenAttendance(selectedChild?.platform_id))
            dispatch(fetchChildrenGroups(selectedChild?.platform_id))
            dispatch(fetchChildrenAttendanceWeekly(selectedChild?.platform_id))
            dispatch(fetchChildrenBalance(selectedChild?.platform_id))
            dispatch(fetchChildrenTestsDate(groupId))
            if (!groupId && !currentYear && !currentMonth ) {
                dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
            }

        }
    }, [innerType , selectedChild]);





    return (
        <>
            {isMobile ? (
                <ChildrenLayoutMB />

            ) : (
                <div className={styles.parent}>
                    <div className={styles.parent__childNameBox}>
                        <h1>{selectedChild?.username}</h1>
                    </div>
                    <div className={styles.parent__layout}>
                        <div className={styles.parent__layout__leftSide}>
                            <ChildrenWeeklyAttendance weeklyData={weeklyAttendance?.msg} />
                            <div className={styles.parent__layout__leftSide__bottomSide}>
                                <ParentBalance balance={selectedBalance} />
                                <ChildrenWeeklyTestResults />
                            </div>
                        </div>
                        <div className={styles.parent__layout__rightSide}>
                            <Select
                                keyValue={"platform_id"}
                                options={parent}
                                onChange={setInnerType}
                                value={innerType}
                                extraClassName={styles.parent__layout__rightSide__select}
                                title={"Farzandim"}
                            />
                            <Card extraClassname={styles.parent__layout__rightSide__cardElm}>
                                <div className={styles.parent__layout__rightSide__header}>
                                    <h2 className={styles.parent__layout__rightSide__header__article}>Baholar</h2>
                                </div>
                                <ChildrenWeeklyGrades weeklyData={weeklyAttendance?.msg} />
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParentSection;