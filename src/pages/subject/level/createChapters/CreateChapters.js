import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';

import styles from "./CreateChapters.module.sass"
import Button from "components/ui/button";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setAlertOptions} from "slices/layoutSlice";
import {useHttp} from "hooks/http.hook";
import Confirm from "components/ui/confirm";
import {useParams} from "react-router";
import Pagination from "components/ui/pagination";
import Input from "components/ui/form/input";


import Chapters from "pages/subject/level/createChapters/chapters/Chapters";
import Modal from "components/ui/modal";

import {ReactComponent as ChangePen} from "assets/icons/pen-solid.svg"

export const ChangeChapterContext = createContext(null);

const CreateChapters = () => {

    let PageSize = useMemo(() => 50, [])

    const {levelId} = useParams()
    const [currentPage, setCurrentPage] = useState(1);


    // const [confirm, setConfirm] = useState(false)
    const [willDeleteId, setWillDeleteId] = useState(null)
    const [search, setSearch] = useState("")
    const [lessons, setLessons] = useState([])
    const [createChapter, setCreateChapter] = useState(false)
    const [changeChapterData, setChangeChapterData] = useState({})
    const [activeChangeChapter, setActiveChangeChapter] = useState(false)
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)
    const [changedLessons, setChangedLessons] = useState()

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}chapter/info/${levelId}`, "GET", null, headers())
            .then(res => {
                setLessons(res.chapters)
            })
    }, [levelId])


    // const multiPropsFilter = useMemo(() => {
    // 	return lessons.filter(exc => {
    // 		if (!selectedType) return true
    // 		return exc.type.id === selectedType
    // 	});
    // },[selectedType,exercises])


    // const searchedItems = useMemo(() => {
    //     const filteredItems = lessons.slice()
    //     return filteredItems.filter(item =>
    //         item.name?.toLowerCase().includes(search?.toLowerCase())
    //     )
    // }, [lessons, search])


    // const currentTableData = useMemo(() => {
    //     const firstPageIndex = (currentPage - 1) * PageSize;
    //     const lastPageIndex = firstPageIndex + PageSize;
    //     return searchedItems.slice(firstPageIndex, lastPageIndex);
    // }, [PageSize, currentPage, searchedItems]);
    //
    // const onDelete = (id, order) => {
    //     setConfirm(true)
    //     setWillDeleteId({id, order})
    // }

    const dispatch = useDispatch()

    const activeChangeData = useCallback((item) => {
        setActiveChangeChapter(true)
        setChangeChapterData(item)
    }, [])

    //
    // const onConfirmDelete = useCallback(() => {
    //     request(`${BackUrl}info_lesson/${levelId}/${willDeleteId.order}`, "DELETE", null, headers())
    //         .then(res => {
    //             const alert = {
    //                 active: true,
    //                 message: res.msg,
    //                 type: res.status
    //             }
    //             dispatch(setAlertOptions({alert}))
    //             setConfirm(false)
    //         })
    //     setLessons(exs => exs.filter(item => item.id !== willDeleteId.id))
    // }, [])
    //
    // const onToggleConfirm = useCallback(() => {
    //     setConfirm(false)
    // }, [])

    const onToggleChangeLessonSort = () => {
        setChangeLessonsSort(prev => !prev)
    }

    const onToggleCreateChapter = useCallback(() => {
        setCreateChapter(prev => !prev)
    }, [])

    const onToggleChangeChapter = useCallback(() => {
        setActiveChangeChapter(prev => !prev)
    }, [])

    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    }, [changeLessonsSort])

    const memoized = useMemo(() => {
        return {activeChangeData, changeLessonsSort}
    }, [activeChangeData, changeLessonsSort])


    // useEffect(() => {
    //     console.log(changedLessons)
    // },[changedLessons])


    const onSubmit = () => {
        request(`${BackUrl}chapter/change/order`, "POST", JSON.stringify(changedLessons), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                // setConfirm(false)
            })
    }

    const navigate = useNavigate()

    const onCreateLesson = () => {
        request(`${BackUrl}lesson/info/`, "POST", JSON.stringify({level_id: levelId}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))


                navigate(`../createLevelLesson/${res.data.id}`)
                // setConfirm(false)
            })
    }


    return (
        <div className={styles.lessons}>
            <div className={styles.header}>
                <h1>Darsliklar</h1>
                <div className={styles.btns}>
                    {/*<Link to={`../createLevelLesson`}>*/}
                        <Button disabled={!lessons.length} onClick={onCreateLesson}>
                            Dars qo'shish
                        </Button>
                    {/*</Link>*/}

                    <Button active={createChapter} onClick={onToggleCreateChapter}>
                        Bo'lim yaratish
                    </Button>

                    <Button type={typeChangeLessonSort} active={changeLessonsSort} onClick={onToggleChangeLessonSort}>
                        <ChangePen/>
                    </Button>
                </div>
            </div>
            <Input title={"Qidiruv"} value={search} onChange={setSearch}/>
            <div className={styles.container}>

                <ChangeChapterContext.Provider value={memoized}>
                    <div className={styles.lessonsTable}>
                        <Chapters chapters={lessons} setChapters={setLessons} setChangedLessons={setChangedLessons}/>
                    </div>
                </ChangeChapterContext.Provider>
            </div>


            {
                changedLessons && <div className={styles.submit}>
                    <Button form={"formCreateExc"} type={"submit"} onClick={onSubmit}>
                        Tasdiqlash
                    </Button>
                </div>
            }


            {
                activeChangeChapter &&
                <Modal
                    title={"Bo'limni o'zgartirish"}
                    active={true}
                    setActive={onToggleChangeChapter}
                >
                    <ChangeChapter
                        setActive={setActiveChangeChapter}
                        setChapter={setLessons}
                        chapter={changeChapterData}
                    />
                </Modal>
            }
            {
                createChapter &&
                <Modal
                    active={createChapter}
                    title={"Bo'lim yaratish"}
                    setActive={onToggleCreateChapter}
                >
                    <CreateChapter
                        setCreateChapter={setCreateChapter}
                        setChapter={setLessons}
                        levelId={levelId}
                    />
                </Modal>
            }


            {/*<Confirm active={confirm} setActive={onToggleConfirm} onSubmit={onConfirmDelete}>*/}
            {/*    O'chirishni hohlaysizmi*/}
            {/*</Confirm>*/}
        </div>
    );
};


const CreateChapter = React.memo(({levelId, setCreateChapter, setChapter}) => {

    const [name, setName] = useState("")

    const {request} = useHttp()
    const dispatch = useDispatch()


    const onSubmit = (e) => {
        e.preventDefault()
        request(`${BackUrl}chapter/info/${levelId}`, "POST", JSON.stringify({name, status: false}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                setChapter(prev => [...prev, res.chapter])
                setCreateChapter(false)
                dispatch(setAlertOptions({alert}))
            })
    }


    return (
        <form id="createChapter" onSubmit={onSubmit}>
            <Input title={"Nomi"} value={name} onChange={setName}/>
            <Button style={{marginTop: "20px"}} form={"createChapter"} type={"submit"}>Tasdiqlash</Button>
        </form>
    )
})

const ChangeChapter = React.memo(({chapter, setChapter, setActive}) => {


    const [name, setName] = useState("")
    const [isDelete, setIsDelete] = useState(false)
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (chapter) {
            console.log(chapter)
            setName(chapter?.name)
            setStatus(chapter?.status)
        }
    }, [chapter])




    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmitDelete = () => {
        request(`${BackUrl}chapter/crud/${chapter.id}`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                setChapter(prev => prev.filter(item => item.chapter_id !== chapter.chapter_id))
                setIsDelete(false)
                setActive(false)
            })
    }

    const onSubmitChange = () => {

        request(`${BackUrl}chapter/crud/${chapter.id}`, "POST", JSON.stringify({name, status}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                setChapter(prev => prev.map(item => {
                    if (item.chapter_id === chapter.chapter_id) {
                        return {...item, name: name}
                    }
                    return item
                }))
                setActive(false)
            })
    }


    return (
        <>
            <div className={styles.changeChapter}>
                <div className={styles.changeChapter__inner}>
                    <Input title={"Nomi"} value={name} onChange={setName}/>
                    <Input extraClassName={styles.changeChapter__input} type={"checkbox"} title={"Status"}
                           extraValues={{checked: status}} onChange={() => setStatus(!status)}/>
                </div>


                <div className={styles.changeChapter__wrapper}>

                    {chapter.lessons.length === 0 &&
                        <Button onClick={() => setIsDelete(true)} type={"danger"}>O'chirish</Button>}


                    <Button onClick={onSubmitChange} type={"submit"}>
                        Tasdqilash
                    </Button>
                </div>


            </div>
            <Confirm active={isDelete} onSubmit={onSubmitDelete} setActive={() => setIsDelete(false)}>
                {name} ni o'chirishni hohlaysizmi
            </Confirm>
        </>
    )
})





export default CreateChapters;