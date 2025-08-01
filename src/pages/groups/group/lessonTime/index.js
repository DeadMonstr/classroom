import React, {useEffect, useState} from 'react';

import styles from "./style.module.sass"
import Back from "components/ui/back";
import Table from "components/ui/table";
import {useSelector} from "react-redux";
import {BackUrl, headers, PlatformUrlApi} from "constants/global";
import {useHttp} from "hooks/http.hook";
import RenderPageWithType from "components/renderPageWithType/RenderPageWithType";
import brightnessColor from "helpers/brightnessColor";


const LessonTime = () => {

    const {data} = useSelector(state => state.group)



    return (
        <div className={styles.lessonTime}>
            <Back/>
            <div className={styles.header}>
                <h1>Dars vaqtlari</h1>
            </div>

            <div className={styles.container}>
                <RenderPageWithType
                    turon={<TuronTable data={data}/>}
                    gennis={<GennisTable data={data}/>}
                />
            </div>
        </div>
    );
};


const GennisTable = ({data}) => {


    const [times, setTimes] = useState([])
    const [days, setDays] = useState([])


    const {request} = useHttp()

    useEffect(() => {
        if (data?.id) {
            request(`${BackUrl}group/group_time_table2/${data.id}`, "GET", null, headers())
                .then(res => {
                    setTimes(res.data)
                    setDays(res.days)
                })
        }
    }, [data.id])

    const renderLessonTime = () => {
        return times.map(item => {
            return (
                <tr>
                    <td>
                        {item.room}
                    </td>

                    {
                        item.lesson.map(time => {
                            if (time.from) {
                                return (
                                    <td>{time.from}-{time.to}</td>
                                )
                            }
                            return <td></td>
                        })
                    }
                </tr>
            )
        })
    }

    return (
        <Table>
            <thead>
            <tr>
                <th>Hona</th>
                {
                    days.map((item, index) => {
                        return (
                            <th key={index}>
                                {item}
                            </th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {renderLessonTime()}
            </tbody>
        </Table>
    )
}


const TuronTable = ({data}) => {


    const [times, setTimes] = useState([])
    const [days, setDays] = useState([])


    const {request} = useHttp()

    useEffect(() => {
        if (data?.id) {
            request(`${BackUrl}group/group_time_table2/${data.id}`, "GET", null, headers())
                .then(res => {
                    setTimes(res.times)
                    setDays(res.days)
                })
        }
    }, [data.id])



    const renderLessonTime = () => {
        return days.map(item => {
            return (
                <tr>
                    <td>
                        {item.day}
                    </td>

                    {
                        item?.lessons?.map(lesson => {
                            if (lesson?.room) {
                                return (
                                    <td>
                                        <div className={styles.lessonTuron} style={{backgroundColor: lesson?.teacher_color, color: brightnessColor(lesson?.teacher_color)}}>
                                            <span>{lesson.teacher}</span>
                                            <span>{lesson.subject}</span>
                                            <span>{lesson.room}</span>
                                        </div>
                                    </td>
                                )
                            }
                            return <td></td>

                        })
                    }
                </tr>
            )
        })

    }

    return (
        <Table>
            <thead>
            <tr>
                <th>Kun</th>
                {
                    times?.map((item, index) => {
                        return (
                            <th className={styles.thTuron} key={index}>
                                {item}
                            </th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {renderLessonTime()}
            </tbody>
        </Table>
    )
}

export default LessonTime;