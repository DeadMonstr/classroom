import React, {useEffect, useState} from 'react';
import styles from "./childrenMonthlyAttendance.module.sass";
import Back from "../../../components/ui/back";
import Select from "../../../components/ui/form/select";
import Card from "../../../components/ui/card";
import { isMobile } from "react-device-detect";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchChildrenAttendance,
    fetchChildrenAttendanceMonthly,
    fetchChildrenGroups, fetchChildrenTest, fetchChildrenTests, fetchChildrenTestsDate
} from "../../../slices/parentSlice";

// const years = ["2025", "2024", "2023"];

const months = ['01', '02', '03', '04', '05', '06', '07']

const weekDays = [
    { id: 7, name: "Dush" },
    { id: 8, name: "Sesh" },
    { id: 9, name: "Chor" },
    { id: 10, name: "Pay" },
    { id: 11, name: "Jum" },
    { id: 12, name: "Shan" },
];

const data = [
    {
        id: 7,
        name: "Dushanba",
        subjects: [
            { id: 2, name: "Ingliz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    },
    {
        id: 8,
        name: "Seshanba",
        subjects: [
            { id: 2, name: "Ingliz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    },
    {
        id: 9,
        name: "Chorshanba",
        subjects: [
            { id: 2, name: "Ingliz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    },
    {
        id: 10,
        name: "Payshanba",
        subjects: [
            { id: 2, name: "Ingli tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    },
    {
        id: 11,
        name: "Juma",
        subjects: [
            { id: 2, name: "Ingliz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    },
    {
        id: 12,
        name: "Shanba",
        subjects: [
            { id: 2, name: "Ingliz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 3, name: "Rus tili", group_name: "2-guruh", time: "12:00/14:00", isCome: true },
            { id: 4, name: "Fransuz tili", group_name: "2-guruh", time: "12:00/14:00", isCome: false }
        ]
    }
];

const ChildrenMonthlyAttendance = () => {
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [group, setGroup] = useState();
    const dispatch = useDispatch()
    const [selectedDayId, setSelectedDayId] = useState();
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    const groupId = (localStorage.getItem("group_id") || "").split(",")[0] || "None"
    const currentUsername = localStorage.getItem("current_username")
    const {monthlyAttendance, groups, dates} = useSelector(state => state.parentSlice)
    const years = dates.data?.years
    const months = dates.data?.months?.flatMap(item => item.months) || [];
    const groupIds = groups.group_list


    useEffect(() => {
        dispatch(fetchChildrenAttendanceMonthly({username: currentUsername, groupId: groupId, year: currentYear, month: currentMonth}))
        dispatch(fetchChildrenGroups(currentUsername))
        dispatch(fetchChildrenAttendance(currentUsername))
        dispatch(fetchChildrenTestsDate(groupId))
        dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
    }, [currentMonth]);

    console.log(month, "month")
    useEffect(() => {
        if (year && month && group) {
            dispatch(fetchChildrenAttendanceMonthly({
                username: currentUsername,
                groupId: group,
                year: year,
                month: month
            }))
        }
    }, [year, month, group])

    const renderCard = () => {
        const todayDate = new Date().getDate();

        return monthlyAttendance?.map((item, index) => {
            const isToday = item.id === todayDate;

            return (
                <Card
                    key={index}
                    extraClassname={`${styles.attendance__card__list__dayBox} ${item.id === todayDate ? styles.activeDay : ""}`}
                >
                    <div className={styles.attendance__card__list__dayBox__dayNum}>
                        <h3 className={`${styles.attendance__card__list__dayBox__dayNum__dayName} ${isToday ? styles.activeColor : ""}`}>{item.date}</h3>
                        <h3 className={`${styles.attendance__card__list__dayBox__dayNum__dayName} ${isToday ? styles.activeColor : ""}`}>{item.weekday}</h3>

                    </div>
                    {item.attendances?.map((subject, subIndex) => (
                        <div
                            key={subIndex}
                            className={`${styles.attendance__card__list__dayBox__subjectBox} ${subject.day_status ? styles.active : styles.passive}`}
                        >
                            <h2 className={styles.attendance__card__list__dayBox__subjectBox__subjName}>{subject.name}</h2>
                            <h4>{subject.group}</h4>
                            <h4>{subject.time}</h4>
                            {subject.status === "Keldi" ? (
                                <h4>Keldi ✅</h4>
                            ) : subject.status === "Davomat qilinmagan" ? (
                                <h4 style={{ color: "#615f5f", fontWeight: "bold" }}>Davomat qilinmagan ❌</h4>
                            ) : subject.status === "Kelmadi" ? (<h4 style={{ color: "red" }}>Kelmadi ❌</h4>) : null }
                        </div>
                    ))}
                </Card>
            );
        });
    };

    const renderMobileSelectedDay = () => {
        const today = monthlyAttendance.find(item => item.date === selectedDayId);
        if (!today) return null;

        return (
            <div className={styles.attendance__mobile__subjects}>
                {today.attendances?.map((subject, idx) => (
                    <div
                        key={idx}
                        className={`${styles.attendance__card__list__dayBox__subjectBox} ${subject.isCome ? styles.active : styles.passive}`}
                    >
                        <h2 className={styles.attendance__card__list__dayBox__subjectBox__subjName}>{subject.name}</h2>
                        <h4>{subject.group}</h4>
                        <h4>{subject.time}</h4>
                        {subject.status === "Keldi" ? (
                            <h4>Keldi ✅</h4>
                        ) : subject.status === "Davomat qilinmagan" ? (
                            <h4 style={{ color: "#615f5f", fontWeight: "bold" }}>Davomat qilinmagan ❌</h4>
                        ) : subject.status === "Kelmadi" ? (<h4 style={{ color: "red" }}>Kelmadi ❌</h4>) : null }
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.attendance}>
            <div className={styles.attendance__header}>
                <Back className={styles.attendance__header__btn} />
                {!isMobile && (
                    <div className={styles.attendance__header__div}>
                        <Select
                            title={"Yil"}
                            value={year}
                            onChange={setYear}
                            options={years}
                            defaultOption={"Yil"}
                            style={{ width: "400px" }}
                        />
                        <Select
                            title={"Oy"}
                            value={month}
                            onChange={setMonth}
                            options={months}
                            defaultOption={"Oy"}
                            style={{ width: "400px" }}
                        />
                        <Select
                            title={"Guruh"}
                            value={group}
                            onChange={setGroup}
                            options={groupIds}
                            defaultOption={"Guruh"}
                            style={{ width: "400px" }}
                        />
                    </div>

                )}
                { isMobile && (
                    <div className={styles.attendance__header__second}>
                        {/*<h1>Davomat</h1>*/}
                        <div className={styles.attendance__header__second__box}>
                            <Select defaultOption={"Yil"} title={"Yil"} value={year} onChange={setYear} options={years} extraClassName={styles.attendance__header__second__box__select} />
                            <Select defaultOption={"Oy"} title={"Oy"} value={month} onChange={setMonth} options={months} extraClassName={styles.attendance__header__second__box__select} />
                            <Select
                                title={"Guruh"}
                                value={group}
                                onChange={setGroup}
                                options={groupIds}
                                extraClassName={styles.attendance__header__second__box__select}
                                defaultOption={"Guruh"}
                            />
                        </div>

                    </div>
                )}
            </div>

            {!isMobile && (
                <Card extraClassname={styles.attendance__card}>
                    <h1>Davomat</h1>
                    <div className={styles.attendance__card__list}>{renderCard()}</div>
                </Card>
            )
            }
            { isMobile &&
            (
                <div className={styles.arounder}>
                    <div className={styles.attendance__mobile}>
                        {monthlyAttendance.map((item) => (
                            <div
                                key={item.date}
                                onClick={() => setSelectedDayId(item.date)}
                                className={`${styles.attendance__mobile__days} ${selectedDayId === item.date ? styles.activeDayMobile : ''}`}
                            >
                                <h2>{item.date}</h2>
                                <h2>{item.weekday}</h2>
                            </div>
                        ))}
                    </div>
                    {renderMobileSelectedDay()}
                </div>
            )}
        </div>
    );
};

export default ChildrenMonthlyAttendance;
