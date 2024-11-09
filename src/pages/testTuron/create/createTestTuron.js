import React, {useEffect, useState} from 'react';

import cls from "./createTestTuron.module.sass"
import Button from "components/ui/button";
import Table from "components/ui/table";
import Modal from "components/ui/modal";

import Select from "components/ui/form/select";
import Confirm from "components/ui/confirm";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {stringify} from "uuid";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch} from "react-redux";

const classes = [
     1,2,3,4,5,6,7,8,9,10,11

]



const CreateTestTuron = () => {

    const [activeCreate,setActiveCreate] = useState(false)
    const [activeChange,setActiveChange] = useState(false)
    const [activeDelete,setActiveDelete] = useState(false)
    const [loading,setLoading] = useState(false)

    const [optionsEx,setOptionsEx] = useState([])





    const [selectedClass,setSelectedClass] = useState()
    const [selectedLanguage,setSelectedLanguage] = useState()
    const [selectedEx,setSelectedEx] = useState()



    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}class_tests`, "GET", null, headers())
            .then(res => {
                setOptionsEx(res.data)
            })
    },[])





    const languageOptions = [
        {
            name: "Uz",
            value: "uz"
        },
        {
            name: "Ru",
            value: "Ru"
        }
    ]


    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            lang: selectedLanguage,
            ex: selectedEx,
            class: selectedClass
        }


        setLoading(true)
        request(`${BackUrl}class_tests`, "POST", JSON.stringify(data),headers())
            .then(res => {
                setLoading(false)
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
            })
    }




    return (
        <div className={cls.createTest}>

            <div className={cls.header}>
                <h1>Test Turon</h1>

                <Button onClick={() => setActiveCreate(true)}>
                    Create test
                </Button>
            </div>
            <div className={cls.wrapper}>
                <Table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Sinf</th>
                            <th>Til</th>
                            <th>Mashq nomi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>1-sinf</td>
                            <td>uz</td>
                            <td>1 sinf test</td>
                            <td className={cls.icon}>
                                <i
                                    onClick={() => setActiveChange(true)}
                                    className="fa-solid fa-pen"
                                ></i>
                                <i
                                    onClick={() => setActiveDelete(true)}
                                    className="fa-solid fa-trash"
                                ></i>
                            </td>

                        </tr>

                    </tbody>

                </Table>
            </div>

            <Modal title={"Create Test"} active={activeCreate} setActive={setActiveCreate}>
                <form id={"createTest"} onSubmit={onSubmit} action="" className={cls.createForm}>
                    <Select
                        options={classes}
                        value={selectedClass}
                        onChange={setSelectedClass}
                        title={"Sinf"}
                    />
                    <Select
                        options={languageOptions}
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        title={"Til"}
                    />
                    <Select
                        options={optionsEx}
                        title={"Mashq"}
                        value={selectedEx}
                        onChange={setSelectedEx}
                    />
                    <Button form={"createTest"} type={"submit"}>Tasdiqlash</Button>
                </form>
            </Modal>


            <Modal title={"Change Test"} active={activeChange} setActive={setActiveChange}>
                <form action="" className={cls.createForm}>
                    <Select
                        options={classes}
                        value={selectedClass}
                        onChange={setSelectedClass}
                        title={"Sinf"}
                    />
                    <Select
                        options={languageOptions}
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        title={"Til"}
                    />
                    <Select
                        options={optionsEx}
                        title={"Mashq"}
                        value={selectedEx}
                        onChange={setSelectedEx}
                    />
                    <Button type={"submit"}>Tasdiqlash</Button>
                </form>
            </Modal>


            <Confirm setActive={() => setActiveDelete(false)} active={activeDelete}>
                Test o'chirishni hohlaysizmi
            </Confirm>
        </div>
    );
};

export default CreateTestTuron;