import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {MainContext, SubjectContext} from "helpers/contexts";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";


import styles from "pages/subject/level/chapters/lesson/style.module.sass"
import Button from "components/ui/button";
import {useNavigate} from "react-router";
import useScrollPosition from "hooks/useScrollPosition";
import Snippet from "components/lesson/snippet";
import File from "components/lesson/file/File";
import Exercises from "components/lesson/exercises"
import Text from "components/lesson/text"
import Video from "components/lesson/video"
import Img from "components/lesson/img"
import TextEditorExc from "components/exercises/textEditor/TextEditor";
import {useDispatch, useSelector} from "react-redux";
import {fetchLessonData, setLessonData} from "slices/lessonSlice";
import Loader from "components/ui/loader/Loader";
import {useAuth} from "hooks/useAuth";



const Lesson = ({isNavigate}) => {


    const {role} = useAuth()

    const {lessonOrder, levelId, chapterId,token} = useParams()

    const {lesson, prev, next, studentLessonId, components, fetchLessonStatus,archiveId,isChangedComponents} = useSelector(state => state.lesson)

    const {request} = useHttp()
    const dispatch = useDispatch()

    // useEffect(() => {
    //     if (components && components.length && !isChangedComponents) {
    //         document.querySelector('#main').scrollTo({ top: 0, behavior: "smooth" })
    //     }
    //     localStorage.setItem("lastLesson", JSON.stringify({
    //         levelId: levelId,
    //         lessonOrder: lessonOrder,
    //         chapterId: chapterId
    //     }))
    //
    // }, [lesson])


    useEffect(() => {
        dispatch(fetchLessonData({lessonOrder, chapterId,token}))
    }, [lessonOrder, chapterId])


    const renderComponents = useCallback(() => {
        return components?.map(item => {
            if (item.type === "text") {
                return (
                    <TextEditorExc
                        component={item}
                    />
                )
            }
            if (item.type === "snippet") {
                return (
                    <Snippet
                        type={"view"}
                        component={item}
                    />
                )
            }
            if (item.type === "video") {
                return (
                    <Video
                        type={"view"}
                        component={item}
                    />
                )
            }
            if (item.type === "img") {
                return (
                    <Img
                        type={"view"}
                        component={item}
                    />
                )
            }
            if (item.type === "file") {
                return (
                    <File
                        type={"view"}
                        component={item}
                    />
                )
            }
            if (item.type === "exc") {
                return (
                    <Exercises
                        archiveId={archiveId}
                        // updateExc={updateExc}
                        lessonId={lesson.id}
                        type={"view"}
                        subjectId={lesson.subject_id}
                        levelId={lesson.level_id}
                        component={item}
                        exercises={components.filter(item => item.type === "exc")}
                    />
                )
            }
        })
    }, [components,archiveId])


    const navigate = useNavigate()

    const onClick = (index) => {
        navigate(`../${chapterId}/${index}`)
    }

    useEffect(() => {
        if (components.length > 0 && role === ROLES.Student) {
            request(`${BackUrl}finish/lesson/${studentLessonId}`, "GET", null, headers())
                .then(res => {
                    console.log(res)
                })
        }
    }, [studentLessonId])

    const onReset = () => {
        request(`${BackUrl}reset_lesson/${archiveId}`, "GET", null, headers())
            .then(res => {
                dispatch(setLessonData({data: res.data}))
            })
    }

    console.log(archiveId ? "hello" : "else", archiveId)

    return (
        <div className={styles.lesson}>
            {
                fetchLessonStatus === "loading" ?
                    <Loader/>
                    :
                    <>
                        <div className={styles.header}>
                            <h1>{lesson?.name}</h1>
                        </div>
                        <div className={styles.container}>
                            {renderComponents()}
                        </div>

                        <div className={styles.footer}>
                            {
                                isNavigate &&
                                    <>
                                        <Button
                                            onClick={() => onClick(prev)}
                                            type={"submit"}
                                            disabled={prev === lesson?.order}
                                        >
                                            Oldingi
                                        </Button>
                                        <Button
                                            onClick={() => onClick(next)}
                                            type={"submit"}
                                            disabled={!next}
                                        >
                                            Keyingi
                                        </Button>

                                        {archiveId ?  <Button onClick={onReset} type={"warning"}>Qayta topshirish</Button> : null}
                                    </>
                            }
                        </div>
                    </>
            }
        </div>
    );
};

export default Lesson;