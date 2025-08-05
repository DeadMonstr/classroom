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
    fetchChildrenGroups,  fetchChildrenTests, fetchChildrenTestsDate
} from "slices/parentSlice";
import LoaderPage from "components/ui/loader/Loader";





const ChildrenMonthlyAttendance = () => {



    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [group, setGroup] = useState();
    const [availableMonths, setAvailableMonths] = useState([]);

    const dispatch = useDispatch()
    const [selectedDayId, setSelectedDayId] = useState();
    const currentMonth = localStorage.getItem("current_month")
    const currentYear = localStorage.getItem("current_year")
    const groupId = (localStorage.getItem("group_id"))
    const currentUsername = localStorage.getItem("platform_id")
    const {monthlyAttendance, groups, dates , loadingAttedance} = useSelector(state => state.parentSlice)
    const years = dates.data?.years
    const months = dates.data?.months?.flatMap(item => item.months) || [];
    const groupIds = groups.group_list


    useEffect(() => {
        // setYear(years[0]?.id)
        // setMonth(months[0]?.id)
        // setGroup(groupIds[0]?.id)
    } , [])


    useEffect(() => {
        if (year) {
            const selectedYearData = dates.data?.months.find(item => item.year === year);
            if (selectedYearData) {
                setAvailableMonths(selectedYearData.months);
            } else {
                setAvailableMonths([]);
            }
        } else {
            setAvailableMonths([]);
        }
    }, [year, dates.data?.months]);

    useEffect(() => {

       if(currentUsername || currentUsername !== undefined){
           dispatch(fetchChildrenAttendanceMonthly({username: currentUsername, groupId: groupId, year: currentYear, month: currentMonth}))
           dispatch(fetchChildrenGroups(currentUsername))
           dispatch(fetchChildrenAttendance(currentUsername))

           if (!groupId && !currentYear && !currentMonth ) {
               dispatch(fetchChildrenTests({groupId: groupId, year: currentYear, month: currentMonth}))
           }
           if (groupId || groupId !==  undefined) {
               dispatch(fetchChildrenTestsDate(groupId))
           }
       }
    }, [currentMonth]);


    // console.log(year , month, group , "grou")
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

                        {years && <Select
                            title={"Yil"}

                            onChange={setYear}
                            options={years}
                            defaultOption={"Yil"}
                            style={{ width: "400px" }}
                        />}
                        {months && <Select
                            title={"Oy"}

                            onChange={setMonth}
                            options={availableMonths}

                            style={{ width: "400px" }}
                        />}
                        {groupIds && <Select
                            title={"Guruh"}
                            onChange={setGroup}
                            options={groupIds}
                            defaultOption={"Guruh"}
                            style={{ width: "400px" }}
                        />}
                    </div>

                )}
                { isMobile && (
                    <div className={styles.attendance__header__second}>
                        {/*<h1>Davomat</h1>*/}
                        <div className={styles.attendance__header__second__box}>
                            <Select defaultOption={"Yil"} title={"Yil"} onChange={setYear} options={years} extraClassName={styles.attendance__header__second__box__select} />
                            <Select  title={"Oy"}  onChange={setMonth} options={availableMonths} extraClassName={styles.attendance__header__second__box__select} />
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
                    <div className={styles.attendance__card__list}>{loadingAttedance ? <LoaderPage /> : renderCard()}</div>
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
