import React, {useEffect, useState} from 'react';



import cls from "./teacherMonthSalary.module.sass"
import Back from "components/ui/back";
import Table from "components/ui/table";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import {useParams} from "react-router";
import {useAuth} from "hooks/useAuth";


const TeacherMonthSalary = () => {

    const {monthId} = useParams()


    const [data,setData] = useState({})



    const {request} = useHttp()


    useEffect(() => {


        request(`${BackUrl}teacher_salary_inside/${monthId}`,"GET",null,headers())
            .then(res => {
                setData(res.data)
            })
    },[monthId])


    const {month,residue,taken_salary,black_salary,data: salaries,salary_debt} = data



    return (
        <div className={cls.monthSalary}>

            <Back/>
            <div className={cls.header}>
                <h2>Oy: <span>{month}</span></h2>
                <h2>Qolgan oylik: <span>{residue}</span></h2>
                <h2>Olingan oylik: <span>{taken_salary}</span></h2>
                <h2>Black salary: <span>{black_salary}</span></h2>
                <h2>Qarz: <span>{salary_debt}</span></h2>
            </div>



            <div className={cls.wrapper}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Oylik</th>
                        <th>Sabab</th>
                        <th>Turi</th>
                        <th>Sana</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        salaries?.map((item,index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{item.salary}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.payment_type}</td>
                                    <td>{item.date}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default TeacherMonthSalary;