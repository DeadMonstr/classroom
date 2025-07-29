import React, {useCallback, useEffect, useRef, useState} from 'react';

import {ReactComponent as ArrowDown} from "assets/icons/chevron-down-solid.svg"


import cls from "pages/groups/group/finishedLessons/finishedLessons.module.sass"
import Table from "components/ui/table";
import Select from "components/ui/form/select";
import {Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import lessonsDegree, {
    fetchDataLessonsDegree,
    onChangeSelectOption,
    onChangeSelectType
} from "slices/finishedLessonsSlice";
import {fetchChaptersData} from "slices/chaptersSlice";
import RequireAuthChildren from "components/auth/requireAuthChildren";
import {BackUrl, headers, ROLES} from "constants/global";
import StudentLesson from "./studentLesson/StudentLesson";
import {useParams} from "react-router";
import styles from "pages/subject/level/createChapters/chapters/style.module.sass";
import classNames from "classnames";
import Input from "components/ui/form/input";
import Modal from "components/ui/modal";
import {useHttp} from "hooks/http.hook";
import Exercises from "components/lesson/exercises";

const FinishedLessons = () => {


    return (
        <Routes>
            <Route index element={<Index/>}/>
            <Route path={":studentId"} element={<StudentLesson/>}/>
        </Routes>
    );
};


const Index = () => {

    const {id: groupId} = useParams()


    const {selectedLevel, selectedLesson, selectedChapter, typeData, data} = useSelector(state => state.finishedLessons)


    const {subjectLevels} = useSelector(state => state.group)
    const {chapters} = useSelector(state => state.chapters)

    const [lessons, setLessons] = useState([])


    const dispatch = useDispatch()
    const onChange = (type, id) => {
        dispatch(onChangeSelectOption({type, id}))
    }

    const onChangeType = (type) => {
        dispatch(onChangeSelectType({type: type}))
    }


    useEffect(() => {
        dispatch(fetchChaptersData(selectedLevel))
    }, [selectedLevel])

    useEffect(() => {
        if (chapters.length && selectedChapter) {
            setLessons(chapters.filter(item => item.id === selectedChapter)[0].lessons)
        }
    }, [selectedChapter])


    const optionsType = [
        {
            id: 1,
            name: "Daraja"
        },
        {
            id: 2,
            name: "Bo'lim"
        },
        {
            id: 3,
            name: "Dars"
        }
    ]


    useEffect(() => {
        if ((selectedLevel && groupId) || selectedChapter || selectedLesson)
            switch (+typeData) {
                case 1:
                    dispatch(fetchDataLessonsDegree({
                        group_id: groupId,
                        level_id: selectedLevel
                    }))
                    break
                case 2:
                    dispatch(fetchDataLessonsDegree({
                        group_id: groupId,
                        level_id: selectedLevel,
                        chapter_id: selectedChapter
                    }))
                    break
                case 3:
                    dispatch(fetchDataLessonsDegree({
                        group_id: groupId,
                        level_id: selectedLevel,
                        lesson_id: selectedLesson
                    }))
                    break
            }

    }, [selectedChapter, selectedLevel, selectedLesson, typeData])



    const renderData = useCallback(() => {
        if (!typeData || !data) return

        switch (+typeData) {
            case 1:
                return <Level chapters={data.chapters_list}/>
            case 2:
                return <Chapter lessons={data.lesson_list}/>
            case 3:
                return <Lesson students={data.lesson_list} lessonId={selectedLesson}/>
        }

    }, [data, typeData])


    return (
        <div className={cls.lessonsDegree}>
            <div className={cls.header}>
                <h1>Tugatilgan darslar</h1>
                <Select value={typeData} options={optionsType} onChange={(e) => onChangeType(e)}
                        title={"Tugatilgan turi"}/>
            </div>

            <div className={cls.header}>
                <div>
                    <Select
                        value={selectedLevel}
                        options={subjectLevels}
                        onChange={(e) => onChange("level", e)}
                        title={"Daraja"}
                    />
                    {
                        (+typeData === 2 || +typeData === 3) &&
                        <Select
                            value={selectedChapter}
                            options={chapters}
                            title={"Bo'lim"}
                            onChange={(e) => onChange("chapter", e)}
                        />
                    }
                    {
                        +typeData === 3 &&
                        <Select
                            value={selectedLesson}
                            options={lessons}
                            title={"Dars"}
                            onChange={(e) => onChange("lesson", e)}
                        />
                    }
                </div>
            </div>

            <div className={cls.wrapper}>
                {renderData()}
            </div>
        </div>
    )
}


const Level = ({chapters}) => {


    const [items, setItems] = useState([])
    const height = useRef([])


    useEffect(() => {
        if (chapters?.length) {
            setItems(chapters)
        }
    }, [chapters])


    const onToggleChapter = useCallback((index) => {
        setItems(items => items.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    active: !item.active
                }
            }
            return item
        }))
    }, [items])


    const renderStudentsData = (data) => {

        if (!data.length) return

        return (
            <Table>
                <tr>
                    <th>№</th>
                    <th>Ism</th>
                    <th>Familiya</th>
                    <th>Bajarilgan Darslar</th>
                    <th>Bajarilgan Mashqlar</th>
                </tr>


                {
                    data.map((item, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.student_name}</td>
                                <td>{item.student_surname}</td>
                                <td>{item.finished}</td>
                                <td>{item.exercises}</td>
                            </tr>
                        )
                    })
                }


            </Table>
        )

    }

    const renderChapters = () => {


        return items.map((item, index) => {
            return (
                <div
                    className={cls.chapter}
                >
                    <div
                        className={classNames(cls.info, {
                            [`${cls.active}`]: item.active
                        })}
                        onClick={() => onToggleChapter(index)}
                    >
                        <div>
                            {item?.name}
                        </div>

                        <div>
                            <h2>Darslar: <span>{item.finished}</span></h2>
                            <h2>Mashqlar: <span>{item.exercises}</span></h2>

                            <ArrowDown className={cls.iconDown}/>
                        </div>
                    </div>
                    <div
                        ref={ref => {
                            height.current[index] = ref
                        }}
                        className={cls.items}
                        style={
                            item.active
                                ? {height: height?.current[index]?.scrollHeight}
                                : {height: "0px"}
                        }
                    >
                        {renderStudentsData(item.students)}
                    </div>
                </div>
            )
        })

    }


    return (
        <div className={cls.chapters}>
            {renderChapters()}
        </div>
    )
}
const Chapter = ({lessons}) => {


    const [items, setItems] = useState([])
    const height = useRef([])


    useEffect(() => {
        if (lessons?.length) {
            setItems(lessons)
        }
    }, [lessons])


    const onToggleLesson = useCallback((index) => {
        setItems(items => items.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    active: !item.active
                }
            }
            return item
        }))
    }, [items])


    const renderStudentsData = (data) => {

        if (!data?.length) return

        return (
            <Table>
                <tr>
                    <th>№</th>
                    <th>Ism</th>
                    <th>Familiya</th>
                    <th>Bajarilgan Dars</th>
                    <th>Bajarilgan Mashqlar</th>
                </tr>


                {
                    data.map((item, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.student_name}</td>
                                <td>{item.student_surname}</td>
                                <td>
                                    {item.finished ?
                                        <i style={{color: "green"}} className="fa-solid fa-check"></i>
                                        :
                                        <i style={{color: "red"}} className="fa-solid fa-xmark"></i>
                                    }
                                </td>
                                <td>{item.exercises}</td>
                            </tr>
                        )
                    })
                }


            </Table>
        )

    }

    const renderChapters = () => {


        return items.map((item, index) => {
            return (
                <div
                    className={cls.chapter}
                >
                    <div
                        className={classNames(cls.info, {
                            [`${cls.active}`]: item.active
                        })}
                        onClick={() => onToggleLesson(index)}
                    >
                        <div>
                            {item?.name}
                        </div>

                        <div>
                            <h2>Darslar: <span>{item.finished}</span></h2>
                            <h2>Mashqlar: <span>{item.exercises}</span></h2>

                            <ArrowDown className={cls.iconDown}/>
                        </div>
                    </div>
                    <div
                        ref={ref => {
                            height.current[index] = ref
                        }}
                        className={cls.items}
                        style={
                            item.active
                                ? {height: height?.current[index]?.scrollHeight}
                                : {height: "0px"}
                        }
                    >
                        {renderStudentsData(item?.students)}
                        {/*{items?.map((item) =>*/}
                        {/*    <SortableItem*/}
                        {/*        containerId={chapter.id}*/}
                        {/*        item={item}*/}
                        {/*        key={item.id}*/}
                        {/*    />*/}
                        {/*)}*/}
                    </div>
                </div>
            )
        })

    }


    return (
        <div className={cls.chapters}>
            {renderChapters()}
        </div>
    )
}

const Lesson = ({students, lessonId}) => {


    const [items, setItems] = useState([])
    const [exercises, setExercises] = useState([])
    const [lessonName, setLessonName] = useState("")
    const [active, setActive] = useState(false)


    useEffect(() => {
        if (students?.length) {
            setItems(students)
        }
    }, [students])


    const {request} = useHttp()
    const getExercise = (studentId) => {
        request(`${BackUrl}teacher/student_exercise_block/${lessonId}/${studentId}`, "GET", null, headers())
            .then(res => {
                setExercises(res?.data?.student_lesson?.lesson_blocks?.map((item,i) => {
                    const index = i + 1

                    const block = item.exercise
                    return {
                        completed: true,
                        exc: {
                            ...block,
                            isCheckFinished: true
                        },
                        exercise_id: item.exercise_id,
                        id: item.id,
                        type: "exc",
                        index: index,
                    }

                }))
                setLessonName(res?.data?.lesson?.name)
                setActive(true)
            })
    }


    const renderStudentsData = useCallback(() => {

        if (!items.length) return

        return items.map((item, index) => {

            return (
                <tr onClick={() => getExercise(item.student_id)}>
                    <td>{index + 1}</td>
                    <td>{item.student_name}</td>
                    <td>{item.student_surname}</td>
                    <td>
                        {item.finished ?
                            <i style={{color: "green"}} className="fa-solid fa-check"></i>
                            :
                            <i style={{color: "red"}} className="fa-solid fa-xmark"></i>
                        }
                    </td>
                    <td>
                        {
                            item.status ?
                                <i style={{color: "green"}} className="fa-solid fa-check"></i>
                                :
                                <i style={{color: "red"}} className="fa-solid fa-xmark"></i>
                        }
                    </td>
                    <td>
                        {item.exercises}
                    </td>
                </tr>
            )
        })
    }, [items])

    const renderExercise = () => {


        if (!exercises.length) return

        return exercises.map(item => {
            return (
                <Exercises
                    lessonId={lessonId}
                    type={"check"}
                    // subjectId={lesson.subject_id}
                    // levelId={lesson.level_id}
                    component={item}
                />
            )
        })
    }



    return (
        <div className={cls.chapters}>
            <Table>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Ism</th>
                    <th>Familya</th>
                    <th>Bajarilgan dars</th>
                    <th>Bajarilgan mashqlar</th>
                    <th>Tog'ri</th>
                </tr>
                </thead>
                <tbody>
                    {renderStudentsData()}
                </tbody>
            </Table>


            <Modal active={active} setActive={() => setActive(false)}>
                <div className={cls.exc}>
                    {
                        exercises ?
                            <>
                                <h1>{lessonName}</h1>
                                {renderExercise()}
                            </> : <h1 style={{color: "red",textAlign: "center"}}>Mashq bajarilmagan</h1>
                    }
                </div>
            </Modal>
        </div>
    )
}


export default FinishedLessons;