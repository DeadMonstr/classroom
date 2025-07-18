import React from 'react';
import styles from "./childrenWeeklyGrades.module.sass"
import Card from "../../../components/ui/card";
import SubjectScore from "../../../components/ui/subjectScore/subjectScore";
import {Link} from "react-router-dom";
import {isMobile} from "react-device-detect";

const data = [
    {
        id: 1,
        day_name: "Dush",
        subjects: [
            {
                id: 1,
                name: "INgliz tili",
                icon: "🧬",
                grade: "5",
                color: "green"
            },
            {
                id: 2,
                name: "Web dasturchilik",
                icon: "🧬",
                grade: "2",
                color: "red"
            },
            {
                id: 3,
                name: "Biologiya",
                icon: "🧬",
                grade: "3",
                color: "yellow"
            }
        ]
    },
    {
        id: 2,
        day_name: "Sesh",
        subjects: [
            {
                id: 1,
                name: "INgliz tili",
                icon: "🧬",
                grade: "5",
                color: "green"
            },
            {
                id: 2,
                name: "Web dasturchilik",
                icon: "🧬",
                grade: "2",
                color: "red"
            },
            {
                id: 3,
                name: "Biologiya",
                icon: "🧬",
                grade: "3",
                color: "yellow"
            }
        ]
    },{
        id: 2,
        day_name: "Sesh",
        subjects: [
            {
                id: 1,
                name: "INgliz tili",
                icon: "🧬",
                grade: "5",
                color: "green"
            },
            {
                id: 2,
                name: "Web dasturchilik",
                icon: "🧬",
                grade: "2",
                color: "red"
            },
            {
                id: 3,
                name: "Biologiya",
                icon: "🧬",
                grade: "3",
                color: "yellow"
            }
        ]
    },{
        id: 2,
        day_name: "Sesh",
        subjects: [
            {
                id: 1,
                name: "INgliz tili",
                icon: "🧬",
                grade: "5",
                color: "green"
            },
            {
                id: 2,
                name: "Web dasturchilik",
                icon: "🧬",
                grade: "2",
                color: "red"
            },
            {
                id: 3,
                name: "Biologiya",
                icon: "🧬",
                grade: "3",
                color: "yellow"
            }
        ]
    },
    {
        id: 3,
        day_name: "Chor",
        subjects: []
    }
]

const ChildrenWeeklyGrades = ({weeklyData}) => {

    console.log(weeklyData, 'dddf')

    const renderSubjects = () => {
        return weeklyData?.map((item, index) => {
            return(
                <div key={item.id} className={styles.grade__weeklyList__card}>
                    <div className={styles.grade__weeklyList__card__dayName}>
                        <h2>{item.weekday}</h2>
                    </div>
                    <div className={styles.grade__weeklyList__card__list}>
                    {
                        item.attendances && item.attendances.length === 0 ? (<h1>Dars yo'q</h1>) :
                        item.attendances?.map((subj, index) => {
                            return(
                                    <SubjectScore
                                        icon={subj.icon}
                                        subject={subj.group}
                                        score={subj.average_ball}
                                        color={subj.color}
                                        extraClassNameForSubj={styles.grade__weeklyList__card__list__subj}
                                        extraClassNameForScore={styles.grade__weeklyList__card__list__subj}
                                    />
                            )
                        })
                    }
                    </div>

                </div>

            )
        })
    }

    return (
        <>
            {
                !isMobile &&
                (
                    <>
                        <div className={styles.grade}>
                            <div className={styles.grade__header}>
                                <h2>Bugungi baholar </h2>
                            </div>
                            <div className={styles.grade__box}>
                                {
                                    weeklyData?.map((item, index) => {
                                        return item.is_today ? item.attendances.map((subj) => (
                                            <SubjectScore
                                                key={index}
                                                icon={subj.icon}
                                                subject={subj.group}
                                                score={subj.average_ball}
                                                color={subj.color}
                                                extraClassNameForSubj={styles.grade__weeklyList__card__list__subj}
                                                extraClassNameForScore={styles.grade__weeklyList__card__list__subj}
                                            />
                                        )) : null
                                    })
                                }

                            </div>
                        </div>
                        <div className={styles.grade}>
                            <div className={styles.grade__weeklyHeader}>
                                <h1>Hafta baholar</h1>
                                <Link to={"/home/childrenGrades"} className={styles.grade__weeklyHeader__btn}>Hammasi</Link>
                            </div>
                            <div className={styles.grade__weeklyList}>
                                {renderSubjects()}
                            </div>
                        </div>
                    </>
                )
            }
            {
                isMobile && (
                    <div className={styles.grade}>
                        <div className={styles.grade__header}>
                            <h2>Bugungi baholar </h2>
                            <Link className={styles.grade__header__link} to={"monthly-grades"}>Hammasi</Link>
                        </div>
                        <div className={styles.grade__box}>
                            {
                                weeklyData?.map((item, index) => {
                                    return item.is_today ? item.attendances.map((subj) => (
                                        <SubjectScore
                                            key={index}
                                            icon={subj.icon}
                                            subject={subj.group}
                                            score={subj.average_ball}
                                            color={subj.color}
                                            extraClassNameForSubj={styles.grade__weeklyList__card__list__subj}
                                            extraClassNameForScore={styles.grade__weeklyList__card__list__subj}
                                        />
                                    )) : null
                                })
                            }
                        </div>
                    </div>
                )
            }

        </>

);
};


export default ChildrenWeeklyGrades;
