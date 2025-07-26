import React, {useCallback, useEffect, useState} from 'react';
import cls from "./observeTeacherLesson.module.sass"
import Select from "components/ui/form/select";
import Textarea from "components/ui/form/textarea";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, PlatformUrlApi} from "constants/global";
import Button from "components/ui/button";
import Form from "components/ui/form";
import {useParams} from "react-router";
import {Link, Navigate, NavLink, Route, Routes} from "react-router-dom";
import Back from "components/ui/back";
import LessonPlan from "pages/groups/group/lessonPlan/LessonPlan";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch} from "react-redux";


const ObserveTeacherLesson = () => {


    return (
        <div className={cls.observeTeacherLesson}>
            <Back to={"../"}/>

            <div className={cls.btns}>
                <NavLink
                    className={({ isActive }) =>
                        isActive ? `${cls.item} ${cls.active}` : `${cls.item}`
                    }
                    to={"observe"}
                >
                    <i className="fa-solid fa-user-check"></i>
                    <span>Observe</span>
                </NavLink>
                <NavLink
                    to={"list"}
                    className={({ isActive }) =>
                        isActive ? `${cls.item} ${cls.active}` : `${cls.item}`
                    }
                >
                    <i className="fa-solid fa-list-check"></i>
                    <span>Lesson Plan</span>
                </NavLink>
            </div>


            <div className={cls.wrapper}>
                <Routes>
                    <Route path={"observe"} element={<ObserveTeacherLessonIndex/>}/>
                    <Route path={"list"} element={<LessonPlan/>}/>
                    <Route
                        path="*"
                        element={<Navigate to="observe" replace/>}
                    />
                </Routes>
            </div>

        </div>
    );
};

const ObserveTeacherLessonIndex = () => {

    const {id,month,day} = useParams()

    const [fields,setFields] = useState([])
    const [options,setOptions] = useState([])

    const {register,handleSubmit} = useForm()


    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}teacher/observe_info`,"GET",null,headers())
            .then(res => {
                setFields(res.observations)
                setOptions(res.options)
            })
    },[])

    const onChangeOption = (value,id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    value: value
                }
            }
            return item
        }))
    }
    const onChangeText = (value,id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    comment: value
                }
            }
            return item
        }))
    }



    const renderField = useCallback(() => {
        if (!fields?.length) return null

        return fields.map(item => {
            return (
                <div className={cls.field}>
                    <h2>{item.title} </h2>
                    <Select
                        value={item.value}
                        extraClassName={cls.select}
                        onChange={(e) => onChangeOption(e,item.id)}
                        options={options}
                    />
                    <Textarea
                        value={item.comment}
                        onChange={(e) => onChangeText(e,item.id)}
                        required
                        extraClassName={cls.textarea}
                    />
                </div>
            )
        })
    },[fields,register])


    const dispatch = useDispatch()


    const onSubmit = (data) => {

        request(`${BackUrl}teacher/teacher_observe/${id}`, "POST", JSON.stringify({list: fields,month,day}),headers())
            .then(res => {
                const alert = {
                    active : true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
            })
    }


    return (
        <div className={cls.observeTeacherLesson}>

            <h1>Observe Teacher</h1>

            <Form
                id={"form"}
                typeSubmit={"other"}
                extraClassname={cls.fields}
            >
                {renderField()}
            </Form>

            <div className={cls.footer}>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    form={"form"}
                    type={"submit"}
                >
                    Tasdiqlash
                </Button>
            </div>
        </div>
    )
}


export default ObserveTeacherLesson;