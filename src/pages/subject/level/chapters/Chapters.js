import React, { useCallback, useEffect, useRef} from 'react';
import styles from "pages/subject/level/chapters/Chapters.module.sass"
import {NavLink, Route, Routes, useParams} from "react-router-dom";
import Lesson from "pages/subject/level/chapters/lesson";
import classNames from "classnames";


import {ReactComponent as ArrowDown} from "assets/icons/chevron-down-solid.svg"
import {useHttp} from "hooks/http.hook";
import Checkbox from "components/ui/form/checkbox";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {fetchChaptersData, onToggle} from "slices/chaptersSlice";
import LoaderPage from "components/ui/loaderPage/LoaderPage";
import {isMobile} from "react-device-detect";
import Modal from "components/ui/modal";


const Chapters = ({isOpenChapters,onToggleChapterOpen}) => {
    const {levelId} = useParams()

    const {chapters,fetchChaptersStatus} = useSelector(state => state.chapters)
    const {lesson} = useSelector(state => state.lesson)
    const {request} = useHttp()


    const navigate = useNavigate()
    const dispatch = useDispatch()


    useEffect(() => {
        if (!chapters.length) {
            dispatch(fetchChaptersData(levelId))
        } else if (levelId !== chapters[0]?.level?.id) {
            dispatch(fetchChaptersData(levelId))
        }
    },[levelId])


    // useEffect(() =>{
    //
    //     const lastLesson = JSON.parse(localStorage.getItem("lastLesson"))
    //
    //
    //     request(`${BackUrl}chapters_info/${levelId}`, "GET", null, headers())
    //         .then(res => {
    //             setChapters(res.chapters.map(item => {
    //                 const inLessons = item.lessons.some(les => les.order === +lastLesson?.order)
    //                 if (inLessons && item.id === lastLesson.chapter) {
    //                     return {
    //                         ...item,
    //                         active: true
    //                     }
    //                 }
    //                 return item
    //             }))
    //
    //
    //             const firstChapter = res.chapters[0]
    //             const firstLesson = firstChapter?.lessons[0]
    //
    //             navigate(`${firstLesson.id}/${firstLesson.order}`)
    //
    //         })
    // },[])

    const onToggleChapter = useCallback((id) => {
        dispatch(onToggle({id}))
    }, [chapters])

    useEffect(() => {
        const lastLesson = JSON.parse(localStorage.getItem("lastLesson"))

        if (lastLesson?.lessonOrder && lastLesson?.levelId === levelId) {
            navigate(`${lastLesson.chapterId}/${lastLesson.lessonOrder}`)

        }
    },[])

    const renderChapters = () => {
        return chapters?.map((item) =>{
            return <Chapter onToggleChapter={onToggleChapter} item={item} levelId={levelId}/>
        })
    }

    if (fetchChaptersStatus === "loading") {
        return <LoaderPage/>
    }



    return (
        <div className={classNames(styles.lessons, {
            // [styles.active]:
        })}>
            <main className={styles.main} >
                <Routes>
                    <Route path={":chapterId/:lessonOrder"} element={<Lesson isNavigate={true}/>} />
                </Routes>
            </main>
            {
                isMobile ?
                    <Modal type={"other"}   active={isOpenChapters} setActive={onToggleChapterOpen}>
                        <div className={styles.chapters}>
                            {renderChapters()}
                        </div>
                    </Modal>
                    :
                    <div className={styles.sidebar}>
                        {renderChapters()}
                    </div>
            }
        </div>
    );
};


const Chapter = ({onToggleChapter,item,levelId}) => {
    const height = useRef()

    const navigate = useNavigate()

    const onOpenLesson = (order) => {
        navigate(`lesson/${order}`)
    }



    const renderLesson = useCallback(() => {
        return item?.lessons?.map(les => {
            console.log(les, "les")
            return (
                <NavLink
                    className={({ isActive }) =>
                        isActive ? `${styles.lesson} ${styles.active}` : `${styles.lesson}`
                    }
                    to={`${item.id}/${les.order}`}
                    // onClick={() => onOpenLesson(item.order)
                >
                    <Checkbox checked={les.finished} onChange={() => {}}  cls={[styles.checkbox]}/>
                    <h1>{les.name}</h1>
                </NavLink>
            )
        })
    },[item.lessons])



    return (
        <div className={styles.chapter}>
            <div
                className={classNames(styles.info, {
                    [`${styles.active}`]: item.active
                })}
                onClick={() => onToggleChapter(item.id)}
            >
                <div className={styles.info__item}>
                    <span>{item?.name}</span>
                    <span>{item.lessons.filter(item => item.finished).length}/{item.lessons.length} </span>
                </div>

                <div>
                    {/*<ChangePen*/}
                    {/*    onClick={() => activeChangeData({...chapter})}*/}
                    {/*    className={styles.iconChange}*/}
                    {/*/>*/}

                    {/*<Grip*/}
                    {/*    {...listeners}*/}
                    {/*    className={styles.handle}*/}
                    {/*/>*/}
                    <ArrowDown className={styles.iconDown}/>
                </div>

            </div>
            <div
                ref={height}
                className={styles.items}
                style={
                    item.active
                        ? {height: height?.current?.scrollHeight}
                        : {height: "0px"}
                }
            >
                {renderLesson()}
                {/*{items?.map((item) => <SortableItem item={item} key={item.id}/>)}*/}

            </div>
        </div>
    )
}

export default Chapters;