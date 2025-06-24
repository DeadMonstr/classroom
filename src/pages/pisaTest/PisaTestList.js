import React, {useEffect, useMemo, useState} from 'react';


import cls from "pages/pisaTest/pisaTestList.module.sass"


import Input from "components/ui/form/input";
import Button from "components/ui/button";
import Table from "components/ui/table";
import {useDispatch, useSelector} from "react-redux";
import {fetchPisaTestData} from "slices/pisaTest";
import {useNavigate} from "react-router";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const PisaTestList = () => {

    const [search, setSearch] = useState(``)
    const [isDeleted, setIsDeleted] = useState(false)

    const {data} = useSelector(state => state.pisaTest)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPisaTestData(isDeleted))
    }, [isDeleted])


    const navigate = useNavigate()
    const {request} = useHttp()

    const onClickAdd = () => {
        request(`${BackUrl}pisa/test/crud`,"POST",null,headers())
            .then(res => {
                navigate(`../createPisaTest/${res.id}`)

            })
    }

    const onClickDelete = () => {
        setIsDeleted(!isDeleted)
    }


    const onClickTest = (id) => {
        navigate(`../createPisaTest/${id}`)
    }

    const onRegisteredStudents = () => {
        navigate(`../registeredStudentsPisa`)
    }


    const searchedUsers = useMemo(() => {
        const filteredHeroes = data.slice()
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())

        )
    }, [data, search])


    return (
        <div className={cls.pisaTests}>

            <div className={cls.header}>
                <Input onChange={setSearch} value={search} title={"Search"}/>
                <div>
                    <Button onClick={onClickAdd}>Add</Button>
                    <Button active={isDeleted} type={isDeleted ? "danger": "simple"} onClick={onClickDelete}>Deleted</Button>
                    <Button onClick={onRegisteredStudents} >Registered Students</Button>
                </div>

            </div>

            <div className={cls.container}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        searchedUsers.map((item, index) => {
                            return (
                                <tr onClick={() => onClickTest(item.id)}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
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

export default PisaTestList;