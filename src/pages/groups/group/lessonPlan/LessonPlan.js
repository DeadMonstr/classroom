import React, {useCallback, useEffect, useRef, useState} from 'react';
import cls from "./lessonPlan.module.sass"
import Button from "components/ui/button";
import Select from "components/ui/form/select";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import {useForm} from "react-hook-form";
import Form from "components/ui/form";
import Modal from "components/ui/modal";
import Table from "components/ui/table";
import Back from "components/ui/back";
import classNames from "classnames";
import {BackUrl, BackUrlForDoc, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import userImg from "assets/user.png";
import {useHttp} from "hooks/http.hook";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "hooks/useAuth";
import {setAlertOptions} from "slices/layoutSlice";


const LessonPlan = ({backBtn}) => {


    const {data: groupData} = useSelector(state => state.group)


    const [planId,setPlanId] = useState()

    const [year,setYear] = useState()
    const [years,setYears] = useState([])

    const [month,setMonth] = useState()
    const [months,setMonths] = useState([])


    const [day,setDay] = useState()
    const [days,setDays] = useState([])


    const [activeModal,setActiveModal] = useState(false)
    const [canChange,setCanChange] = useState(false)
    const [students,setStudents] = useState([])

    const {register,handleSubmit,setValue} = useForm()

    const {request} = useHttp()

    useEffect(() => {
        if (groupData.id) {
            request(`${BackUrl}lesson_plan_list/${groupData.id}`, "GET", null, headers() )
                .then(res => {
                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    }
                    setMonths(res.month_list)

                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)

                    setMonth(res.month)
                    setYear(res.year)
                })
        }
    },[groupData])


    useEffect(() => {
        if (groupData.id && year && month ) {
            request(`${BackUrl}lesson_plan_list/${groupData.id}/${year}-${month}`, "GET", null, headers() )
                .then(res => {

                    if (res.days.length === 1) {
                        setDay(res.days[0])
                    } else {
                        setDay(res.days[res.days.length-1])
                    }
                    setDays(res.days)


                })
        }

    },[groupData.id, month, year])

    useEffect(() => {
        const data = {
            month,
            day,
            year,
        }

        console.log(data, "data")
        if (year && month && day && groupData.id) {
            request(`${BackUrl}get_lesson_plan/${groupData.id}`,"POST",JSON.stringify(data),headers() )
                .then(res => {

                    setCanChange(res.status)
                    setValue("homework",res.lesson_plan.homework)
                    setValue("objective",res.lesson_plan.objective)
                    setValue("assessment",res.lesson_plan.assessment)
                    setValue("resources",res.lesson_plan.resources)
                    setValue("main_lesson",res.lesson_plan.main_lesson)
                    setValue("activities",res.lesson_plan.activities)
                    setStudents(res.lesson_plan.students)
                    setPlanId(res.lesson_plan.id)
                })
        }


    },[month,year,day,groupData])

    const dispatch = useDispatch()

    const onSubmit = (data) => {

        request(`${BackUrl}change_lesson_plan/${planId}`,"POST",JSON.stringify({...data,students}), headers())
            .then(res => {
                const alert = {
                    active : true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
            })
    }


    const toggleModal = useCallback(() => {
        setActiveModal(!activeModal)
    },[activeModal])


    const onChangeStudents = (id,text) => {
        setStudents(st => st.map(item => {
            if (item.student.id === id) {
                return {
                    ...item,
                    comment: text
                }
            }
            return item
        }))
    }


    const {data} = useSelector(state => state.group)

    const {name,teacher} = data
    const {id: meId} = useAuth()

    return (
        <div className={cls.lessonPlan}>
            {backBtn ? <Back/> : null}

            <div className={cls.header}>
                <h1>Lesson plan</h1>

                <Button onClick={toggleModal}>Students</Button>
            </div>




            <div className={cls.subheader}>
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
                                setDays([])
                                setDay(null)
                                setMonth(e)
                            }}
                        /> : null
                }
                {
                    days.length > 0 ?
                        <Select
                            value={day}
                            title={"Kun"}
                            options={days}
                            onChange={(e) => {
                                setDay(e)
                            }}
                        /> : null
                }
            </div>




            <Form id={"lessonPlan"} typeSubmit={"handle"} onSubmit={handleSubmit(onSubmit)}>

                <Input required={true} register={register} name={"objective"} title={"Objective"} />

                <div className={cls.wrapper}>
                    <Textarea required register={register} name={"homework"} title={"Homework"} />
                    <Textarea required register={register} name={"resources"} title={"Resources"} />
                    <Textarea required register={register} name={"main_lesson"} title={"Main Lesson"} />
                    <Textarea required register={register} name={"activities"} title={"Activities"} />
                    <Textarea required register={register} name={"assessment"} title={"Assessment"} />
                </div>
            </Form>

            <div className={cls.footer}>
                {
                    teacher?.id === meId && canChange ?  <Button form={"lessonPlan"} type={"submit"} >Tasdiqlash</Button> : null
                }

            </div>
            <div className={classNames(cls.students,cls.row)}>
                {
                    students && students.filter(item => item.comment).map(item => {
                        return (
                            <div className={classNames(cls.item,cls.student)}>
                                <div className={cls.top} >
                                    <img src={item.img ? `${BackUrlForDoc}${item.img}` : userImg} alt=""/>
                                    <div className={cls.info}>
                                        <h1>{item.student.name}</h1>
                                        <h1>{item.student.surname}</h1>
                                    </div>

                                </div>
                                <p>
                                    {item.comment}
                                </p>


                            </div>
                        )
                    })
                }


            </div>




            <Modal
                title={"Studentlar"}
                active={activeModal}
                setActive={toggleModal}
            >
                <Students students={students} setStudents={onChangeStudents}/>
            </Modal>

        </div>
    );
};

const Students = ({students = [],setStudents}) => {

    const insideRefArray = useRef([])

    // const [students,setStudents] = useState([])
    //
    //
    // useEffect(() => {
    //     setStudents(data)
    // },[data])
    //
    //
    // const onSubmit = (id,text) => {
    //     setData(id,text)
    // }

    const onOpen = (index) => {
        for (let i = 0; i < insideRefArray.current.length; i++) {
            const elem = insideRefArray.current[i]
            elem.querySelector(".arrow").style.transform = "rotate(-90deg)"
            elem.querySelector(".accordion").style.height = 0
        }
        const elem = insideRefArray.current[index]

        if (elem.querySelector(".accordion").getBoundingClientRect().height === 0) {
            elem.querySelector(".arrow").style.transform = "rotate(0)"
            elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
        } else {
            elem.querySelector(".accordion").style.height = 0
        }
    }

    useEffect(() => {
        if (insideRefArray.current.length > 0) {
            for (let i= 0; i < insideRefArray.current.length; i++) {
                const elem = insideRefArray.current[i]
                if
                (
                    elem?.querySelector(".accordion").getBoundingClientRect().height > 0 &&
                    elem?.querySelector(".accordion").getBoundingClientRect().height !== elem.querySelector(".accordion").scrollHeight
                )
                {
                    elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
                }
            }
        }
    },[students])

    // useEffect(() => {
    //     for (let i= 0; i < students.length; i++) {
    //
    //         if (students[i].type !== "") {
    //             const elem = insideRefArray.current[i]
    //
    //             elem.querySelector(".accordion").style.height = 0
    //
    //         }
    //     }
    // },[students])

    const renderStudents = useCallback( () => {
        return students.map((user,index) => {
            return (
                <div className={cls.item} ref={(element) => insideRefArray.current[index] = element}>
                    <div className={cls.top} onClick={() => onOpen(index)}>
                        <img src={user.img ? `${BackUrlForDoc}${user.img}` : userImg} alt=""/>
                        <div className={cls.info}>
                            <h1>{user.student.name}</h1>
                            <h1>{user.student.surname}</h1>
                        </div>
                        <i className="fa-solid fa-caret-down arrow" style={{fontSize: "2rem"}}/>
                    </div>

                    <div
                        className={classNames(cls.inside,"accordion")}
                    >
                        <Textarea defaultValue={user.comment} onChange={(e) => setStudents(user.student.id,e)} title={"Comment"}/>
                        {/*<Button  onClick={() => } form={"lessonPlan"} type={"submit"} >Tasdiqlash</Button>*/}
                    </div>
                </div>
            )
        })
    },[students])



    return (
        <div className={cls.students}>
            {renderStudents()}

        </div>

    )

}

export default LessonPlan;