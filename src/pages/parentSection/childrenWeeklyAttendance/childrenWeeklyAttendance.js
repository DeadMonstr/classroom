import React from 'react';
import styles from './childrenWeeklyAttendance.module.sass'
import Card from "../../../components/ui/card";
import {Link} from "react-router-dom";



const ChildrenWeeklyAttendance = ({weeklyData}) => {




    const renderCard = () => {


        return weeklyData?.map((item, index) => {


            return (
                <Card
                    key={index}
                    extraClassname={styles.card__daysList__dayBox}
                >
                    <div className={styles.card__daysList__dayBox__dayNum}>
                        <h3 className={styles.card__daysList__dayBox__dayNum__dayName}>{item.weekday}</h3>
                        <h1  className={styles.card__daysList__dayBox__dayNum__dayName}>{item.date}</h1>
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
                {
                    weeklyData && weeklyData.length < 0 ? null :
                        <Link className={styles.card__header__btn} to={"/home/childrenAttendance"}>Hammasi</Link>
                }

            </div>
            <div className={styles.card__daysList}>
                {renderCard()}

            </div>
        </Card>
    );
};

export default ChildrenWeeklyAttendance;