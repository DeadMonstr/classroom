import React, {useEffect, useState} from 'react';

import cls from "./teacherObservation.module.sass"
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import {Link, Route, Routes} from "react-router-dom";

import BackImg from "assets/back-school-witch-school-supplies.jpg";
import GroupObserver from "./group";
import Select from "components/ui/form/select";



const TeacherObservation = () => {
    return (
        <Routes>
            <Route path={"/"} element={<TeacherObservationIndex/>}/>
            <Route path={":id/:month/:day/*"} element={<GroupObserver/>}/>
        </Routes>
    )
};

const TeacherObservationIndex = () => {
    const [groups,setGroups] = useState([])
    const [months,setMonths] = useState([])
    const [month,setMonth] = useState(null)
    const [day,setDays] = useState(null)

    const {request} = useHttp()

    useEffect(() => {
        console.log("hello")
        request(`${PlatformUrlApi}groups_to_observe`,"GET",null,headersOldToken())
            .then(res => {
                if (res.observation_tools.length < 1) {
                    setMonth(res.observation_tools[0].value)
                    setMonths(res.observation_tools)
                } else {
                    setMonths(res.observation_tools)
                }
            })
    },[])


    useEffect(() => {
        if (day && month) {
            console.log("render")
            request(`${PlatformUrlApi}groups_to_observe`,"POST",JSON.stringify({month,day}),headersOldToken())
                .then(res => {
                    setGroups(res.groups)
                })
        }

    },[day,month])

    const renderGroups = () => {
        return groups.map(item => {
            return (
                <Link to={`${item.id}/${month}/${day}/`}>
                    <div className={cls.groups__item}>
                        <img src={item.img ? `${BackUrlForDoc}${item.img}` : BackImg} alt=""/>
                        <div className={cls.info}>
                            <div className={cls.info__header}>
                                <h1>{item.name}</h1>
                                <h1>{item.studentsLen}</h1>
                            </div>
                            <h2>{item.teacher.name} {item.teacher.surname}</h2>
                        </div>
                    </div>
                </Link>
            )
        })
    }

    console.log(months)
    console.log(month)
    return (
        <div className={cls.groups}>
            <div className={cls.header}>
                <h1>Bugungi guruhlar :</h1>


                <div>
                    {months.length > 1 &&  <Select options={months} value={month} onChange={setMonth}/>}

                    <Select options={months.filter(item => item.value === month)[0]?.days} value={day} onChange={setDays}/>
                </div>
            </div>

            {renderGroups()}
        </div>
    );
}

export default TeacherObservation;