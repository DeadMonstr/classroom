import React, {useEffect, useMemo, useState} from 'react';

import cls from "./registeredStudentsPisa.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import Table from "components/ui/table";
import Pagination from "components/ui/pagination";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import useDebounce from "hooks/useDebounce";


const RegisteredStudentsPisa = () => {


    const [search, setSearch] = useState(``)
    const [branch, setBranch] = useState(``)
    const [test, setTest] = useState(``)

    const [branchList, setBranchList] = useState([])
    const [testList, setTestList] = useState([])
    const [students, setStudents] = useState([])


    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}pisa/student/register`, "GET", null, headers())
            .then(res => {
                setBranchList(res)
            })


    }, [])
    useEffect(() => {
        request(`${BackUrl}pisa/student/get/list`, "GET", null, headers())
            .then(res => {
                setTestList(res)
            })
    }, [])



    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    let PageSize = useMemo(() => 1, [])

    useDebounce(() => {


        if (!branch || !test ) return;

        const data = {
            search,
            branch,
            test,
            currentPage,
            page_size: PageSize
        }

        console.log("hello", search, branch, test)
        request(`${BackUrl}pisa/student/list`, "POST", JSON.stringify(data), headers())
            .then(res => {
                setStudents(res.pisa_students)
                setTotalCount(res.total_students)
            })
    }, 0.5,[search, branch, test,currentPage])


    // const searchedUsers = useMemo(() => {
    //     const filteredHeroes = students.slice()
    //     setCurrentPage(1)
    //     return filteredHeroes.filter(item =>
    //         item.name.toLowerCase().includes(search.toLowerCase()) ||
    //         item.surname.toLowerCase().includes(search.toLowerCase())
    //     )
    // }, [students, search])
    //
    //
    // const filterUsers = useMemo(() => {
    //     if (!branch && !test) return searchedUsers
    //     if (branch === "all" && test === "all") return searchedUsers
    //     return searchedUsers.filter(item => item.school_id === branch && item.pisa_id === test)
    // }, [students, search,test,branch])


    return (
        <div className={cls.registeredStudents}>
            <div className={cls.header}>
                <Input onChange={setSearch} title={"Qidiruv"}/>
                <Select title={"Filial"} options={branchList} onChange={setBranch}/>
                <Select title={"Test"} options={testList} onChange={setTest}/>
            </div>
            <div className={cls.container}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Filial</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        students.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.surname}</td>
                                <td>{item.location.name}</td>
                                <td>{item.result}%</td>
                            </tr>
                        ))
                    }

                    </tbody>
                </Table>

                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}

                />
            </div>
        </div>
    );
};

export default RegisteredStudentsPisa;