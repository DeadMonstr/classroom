import React, {useEffect, useState} from 'react';


import cls from "./teacherSalary.module.sass"
import Select from "components/ui/form/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import Back from "components/ui/back";
import Table from "components/ui/table";
import header from "components/layout/header";
import {useAuth} from "hooks/useAuth";
import {useNavigate} from "react-router";
import Button from "components/ui/button";
import {Link} from "react-router-dom";

const TeacherSalary = () => {


    const {platform_id} = useAuth()

    const [locations, setLocations] = useState([])
    const [location, setLocation] = useState(null)

    const [years, setYears] = useState([])
    const [year, setYear] = useState(null)

    const [salaries, setSalaries] = useState([])

    const {request} = useHttp()



    useEffect(() => {
        request(`${BackUrl}teacher/teacher_salary_info`, "GET", null, headers())
            .then(res => {

                if (res.locations.length === 1) {
                    setLocation(res.locations[0].value)
                } else {
                    setLocations(res.locations)
                }
                if (res.years.length === 1) {
                    setYear(res.years[0].id)
                } else {
                    setYears(res.years)
                    setYear(res.current_year)
                }
            })
    }, [])




    useEffect(() => {
        if (year && location) {
            request(`${BackUrl}teacher/block_salary/${location}/${year}`, "GET", null, headers())
                .then(res => {
                    setSalaries(res.data)
                })
        }
    }, [year, location])




    const navigate = useNavigate()

    const onCLick = (month) => {
        navigate(`month/${month}`)
    }


    return (
        <div className={cls.teacherSalary}>
            <Back/>

            <div className={cls.header}>
                <h1>Oylik</h1>
                <div>
                    {
                        years.length ? <Select keyValue={"id"} onChange={setYear} value={year} options={years} title={"Yillar"}/> : null
                    }
                    {
                        locations.length ? <Select onChange={setLocation} value={location} options={locations}
                                                   title={"Lokatsiyalar"}/> : null
                    }
                    <Link to={"debtStudents"}>
                        <Button>Qarzdor o'quvchilar</Button>
                    </Link>
                </div>

            </div>
            <div className={cls.wrapper}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Sana</th>
                        <th>Oylik</th>
                        <th>Qolgan</th>
                        <th>Olingan Oylik</th>
                        <th>Qarz</th>
                        <th>Black salary</th>
                        <th>Jarima</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        salaries.map((item, index) => {
                            return (
                                <tr onClick={() => onCLick(item.id)}>
                                    <td>{index+1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.salary}</td>
                                    <td>{item.residue}</td>
                                    <td>{item.taken_salary}</td>
                                    <td>{item.debt}</td>
                                    <td>{item.black_salary}</td>
                                    <td>-{item.total_fine}</td>
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

export default TeacherSalary;