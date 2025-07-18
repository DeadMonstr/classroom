import React from 'react';
import styles from './childrenWeeklyAttendance.module.sass'
import Card from "../../../components/ui/card";
import {Link} from "react-router-dom";



const ChildrenWeeklyAttendance = ({weeklyData}) => {




    const renderCard = () => {
        const weekDays = [
            "Yakshanba",
            "Dushanba",
            "Seshanba",
            "Chorshanba",
            "Payshanba",
            "Juma",
            "Shanba"
        ];
        const todayName = weekDays[new Date().getDay()];

        return weeklyData?.map((item, index) => {
            const isToday = item.name === todayName;

            return (
                <Card
                    key={index}
                    extraClassname={`${styles.card__daysList__dayBox} ${isToday ? styles.activeDay : ""}`}
                >
                    <div className={styles.card__daysList__dayBox__dayNum}>
                        <h3 className={`${styles.card__daysList__dayBox__dayNum__dayName} ${isToday ? styles.activeColor : ""}`}>{item.weekday}</h3>
                        <h1  className={`${styles.card__daysList__dayBox__dayNum__dayName} ${isToday ? styles.activeColor : ""}`}>{item.date}</h1>
                    </div>
                    {item.attendances?.map((subject, subIndex) => (
                        <div
                            key={subIndex}
                            className={`${styles.card__daysList__dayBox__subjectBox} ${subject.day_status ? styles.active : styles.passive}`}
                        >
                            <h2 className={styles.card__daysList__dayBox__subjectBox__subjName}>{subject.name}</h2>
                            <h3>{subject.group}</h3>
                            <h3>{subject.time}</h3>
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

    return (
        <Card extraClassname={styles.card}>
            <div className={styles.card__header}>
                <h1>Davomat</h1>
                <Link className={styles.card__header__btn} to={"/home/childrenAttendance"}>Hammasi</Link>
            </div>
            <div className={styles.card__daysList}>
                {renderCard()}

            </div>
        </Card>
    );
};

export default ChildrenWeeklyAttendance;