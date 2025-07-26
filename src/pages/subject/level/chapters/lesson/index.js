import classNames from "classnames";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import Modal from "components/ui/modal";
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
import lesson, {fetchLessonData, setLessonData} from "slices/lessonSlice";
import Loader from "components/ui/loader/Loader";
import {useAuth} from "hooks/useAuth";
import user from "slices/userSlice";


const Lesson = ({isNavigate}) => {


    const {role} = useAuth()

    const {lessonOrder, levelId, chapterId, token} = useParams()

    const {
        lesson,
        prev,
        next,
        studentLessonId,
        components,
        fetchLessonStatus,
        archiveId,
        isChangedComponents
    } = useSelector(state => state.lesson)


    const user = useSelector(state => state.user)

    const {request} = useHttp()
    const dispatch = useDispatch()

    const [modal, setModal] = useState(false)
    const [comment, setComment] = useState("")
    const [score, setScore] = useState({
        activeBall: 0,
        name: ""
    })


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
        dispatch(fetchLessonData({lessonOrder, chapterId, token}))
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
    }, [components, archiveId])

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= score.activeBall) {
                stars.push(
                    <i
                        key={i}
                        onClick={() => onStar(i)}
                        className={classNames("fa-solid fa-star", {
                            [`${styles.active}`]: true
                        })}
                    />
                )
            } else {
                stars.push(
                    <i
                        key={i}
                        onClick={() => onStar(i)}
                        className="fa-solid fa-star"
                    />
                )
            }
        }
        return stars
    }


    const navigate = useNavigate()

    const onClick = (index) => {
        navigate(`../${chapterId}/${index}`)
    }

    const onStar = (index) => {
        if (index === score.activeBall) {
            setScore(score => ({...score, activeBall: 0}))
            // onChange(id, {...score, activeBall: 0})
        } else {
            setScore(score => ({...score, activeBall: index}))
            // onChange(id, {...score, activeBall: index})
        }
    }

    useEffect(() => {
        if (components.length > 0 && role === ROLES.Student) {
            request(`${BackUrl}student/finish/lesson/${studentLessonId}/`, "GET", null, headers())
                .then(res => {
                    console.log(res)
                })
        }
    }, [studentLessonId])



    const onSubmit = (e) => {
        e.preventDefault()
        const res = {
            student_id: user?.data?.id,
            lesson_id: studentLessonId,
            comment, ball: score.activeBall
        }
        request(`${BackUrl}add_comment`, "POST", JSON.stringify(res), headers())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }


    return (
        <>
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
                                        <Button
                                            onClick={() => setModal(true)}
                                            type={"submit"}
                                        >
                                            Baholash
                                        </Button>


                                    </>
                                }
                            </div>
                        </>
                }
            </div>
            <Modal
                title={"Baholash"}
                active={modal}
                setActive={setModal}
            >
                <form id="assess" onSubmit={onSubmit}>
                    <Textarea title={"Koment"} value={comment} onChange={setComment}/>
                    <div className={styles.stars}>
                        {renderStars()}
                    </div>
                    <Button style={{marginTop: "20px"}} form={"assess"} type={"submit"}>Tasdiqlash</Button>
                </form>
            </Modal>
        </>
    );
};

export default Lesson;