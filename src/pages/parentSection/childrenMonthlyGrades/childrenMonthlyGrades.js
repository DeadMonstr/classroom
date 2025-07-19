import React, {useEffect, useState} from 'react';
import styles from "./childrenMonthlyGrades.module.sass"
import Back from "../../../components/ui/back";
import Select from "../../../components/ui/form/select";
import Card from "../../../components/ui/card";
import SubjectScore from "../../../components/ui/subjectScore/subjectScore";
import {isMobile} from "react-device-detect";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchChildrenAttendance,
    fetchChildrenAttendanceMonthly,
    fetchChildrenGroups, fetchChildrenTests, fetchChildrenTestsDate
} from "../../../slices/parentSlice";




const ChildrenMonthlyGrades = () => {

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [group, setGroup] = useState();
    const dispatch = useDispatch()
    const [selectedDayId, setSelectedDayId] = useState();
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
    const currentUsername = localStorage.getItem("platform_id")
    const {monthlyAttendance, dates} = useSelector(state => state.parentSlice)
    const years = dates.data?.years
    const months = dates.date?.months.map((item) => item)
    console.log(currentMonth, 'dddd')


    useEffect(() => {
        dispatch(fetchChildrenAttendanceMonthly({username: currentUsername, groupId: groupId, year: currentYear, month: currentMonth}))
        dispatch(fetchChildrenGroups(currentUsername))
        dispatch(fetchChildrenAttendance(currentUsername))
        dispatch(fetchChildrenTestsDate(groupId))
        if (!groupId && !currentYear && !currentMonth ) {
            dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: "07"}))
        }
    }, [currentMonth]);


    useEffect(() => {
        if (year || month || group) {
            dispatch(fetchChildrenAttendanceMonthly({
                username: currentUsername,
                groupId: group,
                year: year,
                month: month
            }))
        }
    }, [year, month, group])



    const renderMonthlyGrades = () => {
        return monthlyAttendance.map((item, index) => (
            <div key={index} className={styles.grades__card__box__weekBox}>
                <div className={styles.grades__card__box__weekBox__dayBox}>
                    <h1>{item.weekday}</h1>
                    <h1>{item.date}</h1>
                </div>
                    {item.attendances && item.attendances.length > 0 ? (
                        item.attendances.map((subject, subjectIndex) => (
                            <div
                                key={subjectIndex}
                                className={styles.grades__card__box__weekBox__subjBox}
                            >
                                <SubjectScore
                                    subject={subject.group}
                                    score={subject.average_ball}
                                    color={subject.color}
                                    extraClassNameForSubj={styles.grades__card__box__weekBox__subjBox__subject}
                                    extraClassNameForScore={styles.grades__card__box__weekBox__subjBox__subject}
                                />
                            </div>
                        ))
                    ) : (
                        <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 'bold', marginTop: "5rem" }}>Dars yo‘q</h1>
                    )}
            </div>
        ));
    };


    return (
        <div className={styles.grades}>

                    <div className={styles.grades__header}>
                        <Back className={styles.grades__header__btn}/>
                        {
                            !isMobile && (
                                <div className={styles.grades__header__box}>
                                    <Select
                                        title={"Yil"}
                                        value={year}
                                        onChange={setYear}
                                        options={years}
                                        style={{width: "400px"}}
                                    />
                                    <Select
                                        title={"Oy"}
                                        value={month}
                                        onChange={setMonth}
                                        options={months}
                                        defaultOption={"Oy"}
                                        style={{ width: "400px" }}
                                    />
                                </div>


                            )
                        }
                        {
                            isMobile && (
                                <div className={styles.grades__header__second}>
                                    <h1>Baholar</h1>
                                    <div className={styles.grades__header__second__box}>

                                        <Select title={"Yil"} value={year} onChange={setYear} options={years} extraClassName={styles.grades__header__second__box__select} />
                                        <Select title={"Oy"} value={month} onChange={setMonth} options={months} extraClassName={styles.grades__header__second__box__select} />
                                    </div>
                                </div>
                            )
                        }

                    </div>



            <Card extraClassname={styles.grades__card}>
                {
                    !isMobile && (
                        <h1>Baholar</h1>
                    )
                }
                <div className={styles.grades__card__box}>
                    {renderMonthlyGrades()}
                </div>

            </Card>
        </div>
    );
};

export default ChildrenMonthlyGrades;
