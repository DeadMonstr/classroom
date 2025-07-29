import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';

import cls from "./groupTest.module.sass"
// import Table from "components/platform/platformUI/table";
// import Accordion from "components/platform/platformUI/accordion/Accordion";


import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {
    BackUrl,
    BackUrlForDoc,
    headers,
    headersImg,
    headersOldToken,
    PlatformUrl,
    PlatformUrlApi
} from "constants/global";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Back from "components/ui/back";
import Select from "components/ui/form/select";
import Button from "components/ui/button";
import Accordion from "components/ui/accordion/Accordion";
import Table from "components/ui/table";
import Input from "components/ui/form/input";
import Modal from "components/ui/modal";

// import {setMessage} from "slices/messageSlice";
// import Input from "components/platform/platformUI/input";
// import {setActive} from "slices/filtersSlice";

const GroupTest = () => {

    const {id} = useParams()

    const {data} = useSelector(state => state.group)

    const [tests, setTests] = useState([])
    const [students, setStudents] = useState([])

    const [currentMonth, setCurrentMonth] = useState()


    const [active, setActive] = useState(false)
    const [activeTest, setActiveTest] = useState(false)

    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [changedTest, setChangedTest] = useState({})


    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}group/filter_test_datas/${id}`, "GET", null, headers())
            .then(res => {
                setMonths(res.month_list)
                setYears(res.years_list)
                setYear(res.current_year)


                if (res.years_list.length === 1) {
                    setYear(res.years_list[0])
                } else {
                    setYear(res.current_year)
                }

                if (res.month_list.length === 1) {
                    setMonth(res.month_list[0])
                } else {
                    setMonth(res.current_month)
                }


            })
    }, [])


    useEffect(() => {
        if (year) {
            request(`${BackUrl}group/filter_test_datas/${id}`, "POST", JSON.stringify({year}), headers())
                .then(res => {
                    setMonths(res.month_list)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [year])


    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}group/filter_test_group/${id}`, "POST", JSON.stringify({year, month}), headers())
                .then(res => {
                    setTests(res.tests)
                    setStudents(res.students)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [year, month])


    // const onAddResultStudents = (data) => {
    //     request(`${BackUrl}group/submit_test_group/${groupId}`, "POST",JSON.stringify({students,test_id: selectedTest}),headers())
    //         .then(res => {
    //             setActiveTest(false)
    //             setTests(tests => [...tests,res.test])
    //             dispatch(setMessage({
    //                 msg: res.msg,
    //                 active: true,
    //                 type: "success"
    //             }))
    //         })
    // }

    // const onSetStudentsResult = (id,name,value) => {
    //
    //     setStudents(students => students.map(item => {
    //         if (item.id === id) {
    //             return {...item, [name]: value}
    //         }
    //         return item
    //     }))
    // }


    const onClick = (test, type) => {
        setChangedTest(test)

        if (type === "result") {
            setActive(true)
        } else {
            setActiveTest(true)
        }
    }
    console.log(year , month)

    return (
        <div className={cls.groupTest}>

            <Back/>

            <div className={cls.header}>
                <h1>Group Test</h1>

                <div>
                    {
                        years.length > 1 ?
                            <Select
                                name={"years"}
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
                                name={"month"}
                                value={month}
                                title={"Oy"}
                                options={months}

                                onChange={(e) => {
                                    setMonth(e)
                                }}
                            /> : null
                    }
                </div>
            </div>


            <div className={cls.subheader}>
                <Button onClick={() => setActiveTest(true)}>Test Qo'shish</Button>
            </div>

            <div className={cls.wrapper}>
                {
                    tests.map(item => {
                        return (
                            <Accordion
                                clazz={cls.accordion}
                                subtitle={"Jami: " + item?.percentage + "%"}
                                btns={[
                                    <a href={`${PlatformUrl}${item.file}`} download><i
                                        style={{color: "grey", fontSize: "3rem"}} className="fas fa-file"></i></a>,
                                    <h1>Level: {item.level}</h1>,
                                    <Button type={"submit"} onClick={() => onClick(item, "result")}>
                                        {item.students.length > 0 ? "Natijani O'zgartirish" : "Natijani Qo'shish"}
                                    </Button>,
                                    <Button onClick={() => onClick(item, "test")}>Test O'zgartirish</Button>

                                ]}
                                title={item.name}
                            >
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Ism Familya</th>
                                        <th>Natija</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        item.students.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.student_name} {item.student_surname}</td>
                                                    <td>{item.percentage}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </Table>

                            </Accordion>
                        )
                    })
                }


                <SetResultModal
                    changedTest={changedTest}
                    active={active}
                    setActive={setActive}
                    data={data}
                    studentsData={students}
                    tests={tests}
                    setTests={setTests}
                    setChangedTest={setChangedTest}
                />

                <ChangeCreateTestModal
                    activeTest={activeTest}
                    setActiveTest={setActiveTest}
                    setTests={setTests}
                    changedTest={changedTest}
                    setChangedTest={setChangedTest}
                />

            </div>


        </div>
    );
};

const ChangeCreateTestModal = ({activeTest, setActiveTest, setTests, setChangedTest, changedTest}) => {


    const {register, handleSubmit, setValue, reset} = useForm()
    const [level, setLevel] = useState()
    const {id: groupId} = useParams()
    const [file, setFile] = useState(null)
    const inputRef = useRef()
    const [createdPdf, setCreatedPdf] = useState(null)

    const levels = [
        "A1", "A2", "B1", "B2", "C1", "C2"
    ]
    useEffect(() => {
        if (Object.keys(changedTest).length) {
            setLevel(changedTest.level)
            setValue("name", changedTest.name)
            setValue("date", changedTest.date)
            setValue("number", changedTest.number)
            setCreatedPdf(changedTest.file)
        }
    }, [changedTest])


    const dispatch = useDispatch()
    const {request} = useHttp()

    const onCreateTest = (data) => {
        if (changedTest.id) {

            const formData = new FormData()

            formData.append("file", file)
            formData.append("info", JSON.stringify({
                ...data,
                level: changedTest.level,
                test_id: changedTest.id
            }))

            request(`${BackUrl}group/create_test/${groupId}`, "PUT", formData, headersImg())
                .then(res => {
                    setActiveTest(false)
                    setTests(tests => tests.map(item => {
                        if (item.id === res.test.id) {
                            return res.test
                        }
                        return item
                    }))
                    // dispatch(setMessage({
                    //     msg: res.msg,
                    //     active: true,
                    //     type: "success"
                    // }))
                })
                .catch(err => {
                    console.log(err, "err")
                })
        } else {

            const formData = new FormData()


            formData.append("file", file)
            formData.append("info", JSON.stringify({
                ...data,
                level,
            }))

            request(`${BackUrl}group/create_test/${groupId}`, "POST", formData, headersImg())
                .then(res => {
                    setActiveTest(false)
                    setTests(tests => [...tests, res.test])
                    // dispatch(setMessage({
                    //     msg: res.msg,
                    //     active: true,
                    //     type: "success"
                    // }))
                })
                .catch(err => {
                    console.log(err)
                })
        }


    }
    const Open = () => {
        inputRef.current.click()
    }


    const onDeleteTest = () => {

        request(`${BackUrl}group/create_test/${groupId}`, "DELETE", JSON.stringify({test_id: changedTest.id}), headers())
            .then(res => {
                setActiveTest(false)
                setTests(tests => tests.filter(item => item.id !== changedTest.id))
                // dispatch(setMessage({
                //     msg: res.msg,
                //     active: true,
                //     type: "success"
                // }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    const resetPdf = () => {
        setCreatedPdf(null)
    }


    return (
        <Modal title={changedTest.name ? "Test o'zgartirmoq" : "Test qo'shmoq"} active={activeTest} setActive={() => {
            reset()
            setLevel(null)
            setChangedTest({})
            setActiveTest(false)
        }}>
            <form id={"form"} className={cls.createTest} onSubmit={handleSubmit(onCreateTest)}>

                <Select
                    value={level}
                    options={levels}
                    onChange={setLevel}
                    title={"Levellar"}
                />
                <Input required title={"Nomi"} register={register} name={"name"}/>
                <Input required title={"Sana"} type={"date"} register={register} name={"date"}/>
                <Input required title={"Savollar soni"} type={"number"} register={register} name={"number"}/>

                <div className={cls.file}>
                    {
                        createdPdf ?
                            <div className={cls.file__change}>
                                <a href={`${PlatformUrl}${createdPdf}`} target={"_blank"} rel="noreferrer">
                                    <Button formId={""}>
                                        Faylni ko'rish
                                    </Button>
                                </a>
                                <Button onClick={resetPdf}>
                                    Faylni o'zgartirish
                                </Button>
                            </div>
                            :
                            <>
                                <div className={cls.file__create} onClick={Open}>
                                    {
                                        file ?
                                            <div>
                                                <i className="fas fa-file"></i>
                                                <p>{file.name}</p>
                                                {/*<p>Filename: {file.name}</p>*/}
                                                {/*<p>Filetype: {file.type}</p>*/}
                                                {/*<p>Size in bytes: {file.size}</p>*/}
                                                {/*<p>*/}
                                                {/*    lastModifiedDate:{' '}*/}
                                                {/*    {file.lastModifiedDate.toLocaleDateString()}*/}
                                                {/*</p>*/}
                                            </div>
                                            :
                                            "Test fayl kiriting"
                                    }
                                    <input
                                        // accept={".pdf"}
                                        ref={inputRef}
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        name="file"
                                    />
                                </div>
                            </>
                    }
                </div>

                <div className={cls.btns}>
                    {changedTest?.id &&  <Button formId={""} onClick={onDeleteTest} type={"danger"}>O'chirish</Button>}
                    <Button form={"form"}  type={"submit"}>Tasdiqlash</Button>
                </div>

            </form>
        </Modal>
    )
}


const SetResultModal = React.memo(({
                                       active,
                                       setActive,
                                       data,
                                       tests,
                                       changedTest,
                                       setTests,
                                       setChangedTest,
                                       studentsData
                                   }) => {


    const {id} = useParams()

    const [students, setStudents] = useState([])
    const [selectedTest, setSelectedTest] = useState()
    const [isError, setError] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)


    useEffect(() => {
        if (Object.keys(changedTest).length) {
            setSelectedTest(changedTest.id)
            setStudents(students => students.map(item => {
                const true_answers = changedTest.students.filter(st => st.student_id === item.id)[0]?.true_answers
                return {...item, true_answers: true_answers || 0, can_edit: true}
            }))
        }
    }, [changedTest])


    useEffect(() => {
        if (students.length && selectedTest) {
            const max = tests.filter(item => item.id === +selectedTest)[0].number

            setError(students.some(item => item?.true_answers > max))
            setIsDisabled(students.some(item => item?.true_answers > max))

        } else {
            setIsDisabled(true)
        }
    }, [students, selectedTest])


    useEffect(() => {
        if (studentsData?.length) {
            setStudents(studentsData)
        }
    }, [studentsData])

    const {request} = useHttp()
    const dispatch = useDispatch()


    const onAddResultStudents = () => {

        request(`${BackUrl}group/submit_test_group/${id}`, "POST", JSON.stringify({
            students,
            test_id: selectedTest
        }), headers())
            .then(res => {
                setActive(false)
                // setActiveTest(false)
                setTests(tests => tests.map(item => {
                    if (item.id === res.test.id) {
                        return res.test
                    }
                    return item
                }))
                // dispatch(setMessage({
                //     msg: res.msg,
                //     active: true,
                //     type: "success"
                // }))
                resetBalls()
            })
    }

    const onSetStudentsResult = (id, name, value) => {
        setStudents(students => students.map(item => {
            if (item.id === id) {
                return {...item, [name]: +value}
            }
            return item
        }))
    }


    const resetBalls = () => {
        setStudents(students => students.map(item => {
            return {...item, true_answers: null}
        }))
    }

    const onChangeCanEditResult = (id, value) => {
        setStudents(students => students.map(item => {
            if (item.id === id) {
                return {...item, true_answers: 0, can_edit: value}
            }
            return item
        }))
    }


    return (
        <Modal title={"Student Natijalarini qo'shmoq"} active={active} setActive={() => {
            setActive()
            setChangedTest({})
        }}>
            <div className={cls.createTest}>
                {!Object.keys(changedTest).length > 0 &&
                    <Select required={true} title={"Testlar"} value={selectedTest} options={tests}
                            onChange={setSelectedTest}/>}
                {isError &&
                    <h1 style={{color: "red", textAlign: "center"}}>
                        O'quvchi tog'ri javoblari test savollar sonidan kop
                        bo'lmasligi kerak
                    </h1>
                }
                {
                    students.map(item => {
                        return (
                            <div className={cls.student}>
                                <div className={cls.info}>
                                    <h1>{item.name}</h1>
                                    <h1>{item.surname}</h1>
                                    <h1>
                                        <input
                                            onChange={e => onChangeCanEditResult(item.id, e.target.checked)}
                                            type="checkbox"
                                            checked={item.can_edit}
                                        />
                                    </h1>
                                </div>
                                <div>
                                    <Input
                                        onChange={(e) => onSetStudentsResult(item.id, "true_answers", e || 0)}
                                        value={item.true_answers}
                                        title={"Tog'ri javoblar"}
                                        type={"number"}
                                        disabled={!item.can_edit}
                                        others={{
                                            // min: 0,
                                            max: tests.filter(test => test.id === +selectedTest)[0]?.number,
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })
                }

                <div className={cls.btns}>
                    <Button disabled={isDisabled} onClick={onAddResultStudents} type={"submit"}>Tasdiqlash</Button>
                </div>
            </div>
        </Modal>
    )
})


export default GroupTest;