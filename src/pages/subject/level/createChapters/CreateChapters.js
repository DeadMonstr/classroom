import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';

import styles from "./CreateChapters.module.sass"
import Button from "components/ui/button";
import {Link} from "react-router-dom";
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


    const [confirm, setConfirm] = useState(false)
    const [willDeleteId, setWillDeleteId] = useState(null)
    const [search, setSearch] = useState("")
    const [lessons, setLessons] = useState([])
    const [createChapter, setCreateChapter] = useState(false)
    const [changeChapterData, setChangeChapterData] = useState({})
    const [activeChangeChapter, setActiveChangeChapter] = useState(false)
    const [changeLessonsSort, setChangeLessonsSort] = useState(false)
    const [changedLessons,setChangedLessons] = useState()

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}chapters_info/${levelId}`, "GET", null, headers())
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
    },[])


    const onConfirmDelete = useCallback(() => {
        request(`${BackUrl}info_lesson/${levelId}/${willDeleteId.order}`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                setConfirm(false)
            })
        setLessons(exs => exs.filter(item => item.id !== willDeleteId.id))
    },[])

    const onToggleConfirm = useCallback(() => {
        setConfirm(false)
    },[])

    const onToggleChangeLessonSort = () => {
        setChangeLessonsSort(prev => !prev)
    }

    const onToggleCreateChapter = useCallback(() => {
        setCreateChapter(prev => !prev)
    },[])

    const onToggleChangeChapter = useCallback(() => {
        setActiveChangeChapter(prev => !prev)
    },[])

    const typeChangeLessonSort = useMemo(() => {
        return changeLessonsSort ? "danger" : "simple"
    },[changeLessonsSort])

    const memoized = useMemo(() => {
        return {activeChangeData,changeLessonsSort}
    },[activeChangeData,changeLessonsSort])


    // useEffect(() => {
    //     console.log(changedLessons)
    // },[changedLessons])


    const onSubmit = () => {
        request(`${BackUrl}change_index`, "POST", JSON.stringify(changedLessons), headers())
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


    return (
        <div className={styles.lessons}>
            <div className={styles.header}>
                <h1>Darsliklar</h1>
                <div className={styles.btns}>
                    <Link to={`../createLevelLesson`}>
                        <Button>
                            Dars qo'shish
                        </Button>
                    </Link>

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
                changedLessons &&  <div className={styles.submit}>
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




            <Confirm active={confirm} setActive={onToggleConfirm} onSubmit={onConfirmDelete} >
                O'chirishni hohlaysizmi
            </Confirm>
        </div>
    );
};


const CreateChapter = React.memo(({levelId,setCreateChapter,setChapter}) => {

    const [name, setName] = useState("")

    const {request} = useHttp()
    const dispatch = useDispatch()


    const onSubmit = (e) => {
        e.preventDefault()
        request(`${BackUrl}chapters_info/${levelId}`, "POST", JSON.stringify({name}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                setChapter(prev => [...prev,res.chapter])
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

const ChangeChapter = React.memo(({chapter,setChapter,setActive}) => {


    const [name, setName] = useState("")
    const [isDelete,setIsDelete] = useState(false)

    useEffect(() => {
        if (chapter) {
            setName(chapter?.name)
        }
    }, [chapter])


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmitDelete = () => {
        request(`${BackUrl}crud_chapter/${chapter.id}`, "DELETE", null, headers())
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
        request(`${BackUrl}crud_chapter/${chapter.id}`, "POST", JSON.stringify({name}), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                setChapter(prev => prev.map(item => {
                    if (item.chapter_id === chapter.chapter_id) {
                        return {...item,name: name}
                    }
                    return item
                }))
                setActive(false)
            })
    }


    return (
        <>
            <div className={styles.changeChapter}>
                <Input title={"Nomi"} value={name} onChange={setName}/>


                <div className={styles.changeChapter__wrapper}>

                    {chapter.lessons.length === 0 &&  <Button onClick={() => setIsDelete(true)} type={"danger"}>O'chirish</Button>}


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



// const Chapter = (props) => {
//
//     const {title, lessons, active, onToggleChapter} = props
//
//     const height = useRef()
//
//     const renderLessons = () => {
//         return lessons.map(item => {
//             return (
//                 <Lesson/>
//             )
//         })
//     }
//
//     return (
//         <div className={styles.chapter}>
//             <div
//                 className={classNames(styles.info, {
//                     [`${styles.active}`]: active
//                 })}
//                 onClick={onToggleChapter}
//             >
//                 <div>
//                     Hello Chapter
//                 </div>
//                 <ArrowDown className={styles.iconDown}/>
//             </div>
//             <div
//                 ref={height}
//                 className={styles.items}
//                 style={
//                     active
//                         ? {height: height.current.scrollHeight}
//                         : {height: "0px"}
//                 }
//             >
//                 <Lesson index/>
//             </div>
//         </div>
//     )
// }
//
// const Lesson = () => {
//
//     return (
//         <div
//             className={styles.lesson}
//         >
//             1 lesson
//         </div>
//     )
// }


// const LessonsTable = ({lessons = [],onDelete,setLessons}) => {
//
//
// 	const [dragItemIndex,setDragItemIndex] = useState()
// 	const [dragOverItemIndex,setDragOverItemIndex] = useState()
// 	const [sortedList,setSortedList] = useState([])
//
// 	useEffect(() => {
// 		setSortedList(lessons.sort( (a,b) => a.order - b.order ))
// 	},[lessons])
//
//
//
// 	const handleDragStart = (index) => {
// 		setDragItemIndex(index)
// 	}
//
// 	const handleDragOver = (e) => {
// 		e.preventDefault()
// 	}
//
// 	const {request} = useHttp()
// 	const dispatch = useDispatch()
//
//
// 	const handleDrop = () => {
// 		const _lessons = [...lessons]
// 		const dragItem = _lessons.splice(dragItemIndex,1)
// 		_lessons.splice(dragOverItemIndex,0,...dragItem)
//
//
//
// 		const newList = _lessons.map((item,index) => {
// 			return {...item,order: index}
// 		})
//
// 		setLessons(newList)
//
//
//
// 		request(`${BackUrl}set_order`,"POST",JSON.stringify({lessons: newList}),headers())
// 			.then(res => {
// 				dispatch(setOptionsByHref({
// 					href: "lesson",
// 					changedLinks: {
// 						links: res.data.map(item => {
// 							return {
// 								type: "simple",
// 								title: item.name,
// 								href: item.order
// 							}
// 						})
// 					}
// 				}))
// 			})
// 	}
//
// 	const handleDragEnter = (index) => {
// 		setDragOverItemIndex(index)
// 	}
//
// 	const handleDragEnd = () => {
// 		setDragOverItemIndex(undefined)
// 	}
//
//
//
// 	const renderLessons = () => {
// 		return sortedList.map((item,index) => {
// 			return (
// 				<tr
// 					key={index}
// 					className={dragOverItemIndex === index ? styles.overTr : null}
// 					draggable
// 					onDragStart={( ) => handleDragStart(index)}
// 					onDragOver={handleDragOver}
// 					onDrop={() => handleDrop(index)}
// 					onDragEnter={() => handleDragEnter(index)}
// 					onDragEnd={handleDragEnd}
// 				>
// 					<td>
// 						{index+1}
// 					</td>
// 					<td>{item.name}</td>
// 					<td>
// 						<Link to={`../changeLevelLesson/${item.order}`}>
// 							<i className="fa-solid fa-pen-to-square" />
// 						</Link>
// 						<i onClick={() => onDelete(item.id,item.order)} style={{color: "red"}} className="fa-solid fa-trash" />
// 					</td>
// 				</tr>
// 			)
// 		})
//
// 	}
//
//
// 	return (
// 		<Table>
// 			<thead>
// 				<tr>
// 					<th className={""}>N/o</th>
// 					<th>Nomi</th>
// 					<th></th>
// 				</tr>
//
// 			</thead>
// 			<tbody>
// 				{renderLessons()}
// 			</tbody>
// 		</Table>
// 	)
// }


export default CreateChapters;