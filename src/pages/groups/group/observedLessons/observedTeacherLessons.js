import React, {useEffect, useState} from 'react';

import cls from "./observedTeacherLessons.module.sass"
import Select from "components/ui/form/select";
import Back from "components/ui/back";
import Textarea from "components/ui/form/textarea";
import Table from "components/ui/table";
import Modal from "components/ui/modal";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import {useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";


const ObservedTeacherLessons = () => {
    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [day, setDay] = useState()
    const [days, setDays] = useState([])


    const [active, setActive] = useState(false)


    const [observationsOptions, setObservationOptions] = useState([])
    const [info, setInfo] = useState([])
    const [observer, setObserver] = useState({})
    const [average, setAverage] = useState("")
    const [comment, setComment] = useState("")


    const [] = useState([])

    const {data: groupData} = useSelector(state => state.group)

    const {request} = useHttp()


    useEffect(() => {
        if (groupData.id) {
            request(`${BackUrl}teacher/observed_group/${groupData.id}`, "GET", null, headers())
                .then(res => {

                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    } else {
                        setMonth(res.month)
                    }
                    setMonths(res.month_list)

                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)


                    setYear(res.year)

                })
        }
    }, [groupData])


    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}teacher/observed_group/${groupData.id}/${year}-${month}`, "GET", null, headers())
                .then(res => {
                    if (res.days.length === 1) {
                        setDay(res.days[0])
                    } else {
                        setDay(res.days[res.days.length - 1])
                    }
                    setDays(res.days)
                })
        }

    }, [year && month])

    useEffect(() => {


        const data = {
            month,
            day,
            year,
            group_id: groupData.id
        }


        if (year && month && day && groupData?.id) {
            request(`${BackUrl}teacher/observed_group_info/${groupData?.id}`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setObservationOptions(res.observation_options)
                    setInfo(res.info)
                    setAverage(res.average)
                    setObserver(res.observer)
                })
        }


    }, [month, year, day, groupData])


    const renderInfo = () => {
        return info.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    {
                        Object.values(item.values).map(vl => {
                            if (!vl.value) {
                                return <td></td>
                            }
                            return (
                                <td>
                                    <i className="fa-solid fa-check"></i>
                                </td>
                            )
                        })
                    }
                    <td
                        onClick={() => {
                            setActive(!active)
                            setComment(item.comment)
                        }}
                    >
                        {item.comment}
                    </td>
                </tr>
            )

        })
    }

    return (
        <div className={cls.observedLessons}>

            <Back/>

            <div className={cls.header}>
                <h1>Observed Lessons</h1>
                <div>

                    {
                        years.length > 1 ?
                            <Select
                                value={year}
                                title={"Yil"}
                                options={years}
                                onChange={(e) => {
                                    setYear(e)
                                }}
                            /> : null
                    }
                    {
                        months.length > 1 ?
                            <Select
                                value={month}
                                title={"Oy"}
                                options={months}
                                onChange={(e) => {
                                    setMonth(e)
                                }}
                            /> : null
                    }
                    {
                        days.length > 0 ?
                            <Select
                                value={day}
                                title={"Day"}
                                options={days}
                                onChange={(e) => {
                                    setDay(e)
                                }}
                            /> : null
                    }
                </div>

            </div>

            <p className={cls.title}>Observer: <b>{observer?.name} {observer?.surname}</b></p>
            <p className={cls.title}>Average: <b>{average}</b></p>

            <div className={cls.wrapper}>


                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Dimensions and Observable Expectations</th>
                        {
                            observationsOptions?.map(item => {
                                return (
                                    <th>{item.name} ({item.value})</th>
                                )
                            })
                        }
                        <th>Descriptive Actions (comments)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        renderInfo()
                    }


                    </tbody>
                </Table>


                <Modal title={"Comment"} active={active} setActive={setActive}>
                    <p className={cls.comment}>
                        {comment}
                    </p>
                </Modal>
            </div>
        </div>
    );
};

export default ObservedTeacherLessons;