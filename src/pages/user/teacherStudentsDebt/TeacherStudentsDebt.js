import React, {useCallback, useEffect, useState} from 'react';

import cls from "./teacherStudentsDebt.module.sass"
import Back from "components/ui/back";
import Table from "components/ui/table";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headersOldToken, PlatformUrlApi} from "constants/global";
import {useAuth} from "hooks/useAuth";
import Select from "components/ui/form/select";


const TeacherStudentsDebt = () => {


    const {request} = useHttp()

    const {platform_id} = useAuth()

    const [groups,setGroups] = useState([])
    const [students,setStudents] = useState([])
    const [selectedGroup,setSelectedGroup] = useState("")


    useEffect(() => {
        request(`${PlatformUrlApi}black_salary/${platform_id}`, "GET",null,headersOldToken())
            .then(res => {
                setGroups(res.groups)
                setStudents(res.students)
            })
    },[])
    
    
    const renderFilterStudents = useCallback(() => {
        const filteredStudents = students.filter(item => {
            if (selectedGroup === "all") return true
            return item.group_name.includes(selectedGroup)
        })


        return filteredStudents.map((item,index) => {
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.student_name}</td>
                    <td>{item.student_surname}</td>
                    <td>{item.group_name.toString()}</td>
                    <td>{item.total_salary}</td>
                </tr>
            )
        })

    },[selectedGroup])

    return (
        <div className={cls.studentsDebt}>
            <Back/>

            <div className={cls.header}>
                <h1>Qarzdor o'quvchilar</h1>

                <Select all={true} value={selectedGroup} onChange={setSelectedGroup} options={groups}/>
            </div>
            <div className={cls.wrapper}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familya</th>
                        <th>Guruh</th>
                        <th>Qarz</th>
                    </tr>
                    </thead>
                    <tbody>
                        {renderFilterStudents()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default TeacherStudentsDebt;