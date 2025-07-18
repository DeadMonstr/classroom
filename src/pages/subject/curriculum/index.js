import React, {useCallback, useEffect, useRef, useState} from 'react';

import styles from "./style.module.sass"
import {Link} from "react-router-dom";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";
import Button from "components/ui/button";
import Modal from "components/ui/modal";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl, BackUrlForDoc, headers, headersImg, ROLES} from "constants/global";
import ImgInput from "components/ui/form/imgInput";
import Confirm from "components/ui/confirm";
import {useHttp} from "hooks/http.hook";
import {useNavigate} from "react-router";
import {setAlertOptions} from "slices/layoutSlice";
import {changeLevel, fetchSubjectLevelsData, setDataSubject, setLevel} from "slices/subjectSlice";
import Back from "components/ui/back";
import RequireAuthChildren from "components/auth/requireAuthChildren";


// [
// 	{
// 		levelId: "beginner",
// 		title: "Beginner",
// 		percentage: 20,
// 		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum"
// 	},
// 	{
// 		levelId: "elementary",
// 		title: "Elementary",
// 		percentage: 0,
// 		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum"
// 	},
// 	{
// 		levelId: "beginner",
// 		isBlocked: true,
// 		title: "Pre-Intermediate",
// 		percentage: 0,
// 		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum"
// 	},
// ]


const Curriculum = () => {
    const [activeModal, setActiveModal] = useState(false)
    const [activeInnerModal, setActiveInnerModal] = useState(false)
    const [activeConfirm, setActiveConfirm] = useState(false)
    const [activeModalType, setActiveModalType] = useState("")

    const {name, desc, img, id, levels, canDelete, fetchLevelsDataStatus,finished_percentage} = useSelector(state => state.subject)

    const {request} = useHttp()

    const dispatch = useDispatch()

    const onSubmit = (data) => {
        setActiveModal(false)

        request(`${BackUrl}level/info/${id}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                dispatch(setLevel({levels: res.data}))
            })
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            dispatch(fetchSubjectLevelsData(id))
        }
    }, [id])


    const onSubmitConfirm = () => {
        if (!canDelete) {
            const alert = {
                active: true,
                message: "Fan guruhga ulangan !",
                type: "danger"
            }
            dispatch(setAlertOptions({alert}))
        } else {
            request(`${BackUrl}subject/delete/${id}`, "DELETE", null, headers())
                .then(res => {
                    navigate("/home")
                    const alert = {
                        active: true,
                        message: res.msg,
                        type: res.status
                    }
                    dispatch(setAlertOptions({alert}))
                })
        }

    }



    return (
        <div className={styles.curriculum}>

            <Back to={"../../"}/>
            <RequireAuthChildren allowedRules={[ROLES.Methodist]}>
                <div className={styles.header}>
                    <div className={styles.changeBtn}>
                        <div className={styles.icon} onClick={() => {
                            setActiveInnerModal(!activeInnerModal)
                        }}>
                            {
                                activeInnerModal ?
                                    <i className="fa-solid fa-xmark"></i>
                                    :
                                    <i className="fa-solid fa-ellipsis-vertical"/>

                            }

                        </div>

                        {
                            activeInnerModal ?
                                <div className={styles.innerModal}>
                                    <div className={styles.item} onClick={() => {
                                        setActiveModal(true)
                                        setActiveModalType("change")
                                    }}>
                                        <span>Ma'lumotlarini o'zgartirish</span>
                                        <i className="fa-solid fa-pen"></i>
                                    </div>
                                    <div className={styles.item} onClick={() => {
                                        setActiveInnerModal(false)
                                        setActiveConfirm(true)
                                    }}>
											<span>
												O'chirmoq
											</span>
                                        <i className="fa-solid fa-trash"></i>
                                    </div>
                                    <Link className={styles.item} to={"../deletedLevels"}>
                                        <span>O'chirilgan darajalar</span>

                                    </Link>
                                </div> : null
                        }
                    </div>
                </div>
            </RequireAuthChildren>
            <div className={styles.wrapper}>
                {
                    img ?
                        <img className={styles.img} src={`${BackUrlForDoc}${img}`} alt=""/> : null
                }

                <div className={styles.percentage__track}>
                    <div className={styles.info}>
                        <h1>{name}</h1>
                        <h2>{finished_percentage || 0}%</h2>
                    </div>
                    <PercentageTrackBar prc={finished_percentage}/>
                </div>
                {/*<LastViewed/>*/}
                <Levels levels={levels}/>


                <RequireAuthChildren allowedRules={[ROLES.Methodist]}>
                    <div className={styles.addIcon} onClick={() => {
                        setActiveModal(true)
                        setActiveModalType("create")
                    }}>
                        <i className="fa-solid fa-plus"></i>
                    </div>
                </RequireAuthChildren>


            </div>
            <RequireAuthChildren allowedRules={ROLES.Methodist}>
                <Modal setActive={() => setActiveModal(false)} active={activeModal}>
                    {
                        activeModalType === "create" ?
                            <CreateEditLevel onSubmit={onSubmit}/>
                            :
                            <ChangeSubject onSubmit={() => setActiveModal(false)} oldData={{name, desc, img, id}}/>
                    }
                </Modal>

                <Confirm setActive={() => setActiveConfirm(false)} active={activeConfirm} onSubmit={onSubmitConfirm}>
                    O'chirishni hohlaymiz ?
                </Confirm>
            </RequireAuthChildren>


        </div>
    );
};


const CreateEditLevel = ({onSubmit, changeData}) => {

    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")


    useEffect(() => {
        if (changeData) {
            setName(changeData.name)
            setDesc(changeData.desc)
        }
    }, [changeData])


    const handleClick = () => {
        const data = {
            name,
            desc
        }

        onSubmit(data)
    }


    return (
        <div className={styles.createLevel}>

            <Input title={"Daraja nomi"} onChange={setName} value={name}/>
            <Textarea title={"Daraja haqida ma'lumot"} onChange={setDesc} value={desc}/>

            <Button onClick={handleClick} type={"submit"}>Tasdiqlash</Button>
        </div>
    )
}


const ChangeSubject = ({onSubmit, oldData}) => {


    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [img, setImg] = useState(null)


    useEffect(() => {
        if (oldData) {

            setTitle(oldData.name)
            setDesc(oldData.desc)
        }
    }, [oldData])

    const {request} = useHttp()
    const dispatch = useDispatch()

    const handleClick = () => {

        const data = {
            title,
            desc
        }
        const formData = new FormData()

        formData.append("file", img)
        formData.append("info", JSON.stringify(data))

        request(`${BackUrl}subject/crud/${oldData.id}`, "POST", formData, headersImg())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                dispatch(setDataSubject(res.data))
            })

        onSubmit()
    }


    return (
        <div className={styles.createLevel}>

            <ImgInput databaseImg={oldData.img} img={img} setImg={setImg}/>
            <Input title={"Fan nomi"} onChange={setTitle} value={title}/>
            <Textarea title={"Fan haqida ma'lumot"} onChange={setDesc} value={desc}/>

            <Button onClick={handleClick} type={"submit"}>Tasdiqlash</Button>

        </div>
    )
}


const PercentageTrackBar = ({prc = 0, height = 5}) => {
    return (
        <div className={styles.percentage} style={{height: height + "px"}}>
            <div style={{width: prc + "%"}}/>
        </div>
    )
}


const LastViewed = () => {

    const level = {
        title: "Beginner",
        percentage: 20,
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam nisi, omnis. At consectetur corporis cum"
    }

    return (
        <div className={styles.lastViewed}>
            <h1 className={styles.title}>Ohirgi ko'rilgan dastur:</h1>
            <div className={styles.container}>
                <Level item={level} isNumeric={false}/>
            </div>
        </div>
    )
}


const Levels = ({levels}) => {


    const [activeModal, setActiveModal] = useState(false)
    const [activeConfirm, setActiveConfirm] = useState(false)
    const [willChangeItemId, setWillChangeItemId] = useState("")

    const renderLevels = useCallback(() => {
        return levels.map((item, index) => {
            return (
                <Level
                    key={index}
                    setWillChangeItemId={setWillChangeItemId}
                    setActiveModal={setActiveModal}
                    setActiveConfirm={setActiveConfirm}
                    item={{...item, index, arrLength: levels.length}}
                />
            )
        })

    }, [levels])

    const {request} = useHttp()
    const dispatch = useDispatch()


    const onSubmitConfirm = () => {
        request(`${BackUrl}level/crud/${willChangeItemId}`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                dispatch(changeLevel({type: 'delete', id: willChangeItemId}))
            })

        setActiveConfirm(false)
    }

    const onSubmit = (data) => {
        setActiveModal(false)

        request(`${BackUrl}level/crud/${willChangeItemId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                dispatch(changeLevel({type: 'change', id: willChangeItemId, data: data}))
            })
    }

    return (
        <div className={styles.levels}>


            <h1 className={styles.title}>O’quv dasturi :</h1>

            <div className={styles.container}>
                {renderLevels()}
            </div>


            <Modal setActive={() => setActiveModal(false)} active={activeModal}>
                <CreateEditLevel onSubmit={onSubmit}
                                 changeData={levels.filter(item => item.id === willChangeItemId)[0]}/>
            </Modal>
            <Confirm setActive={() => setActiveConfirm(false)} active={activeConfirm} onSubmit={onSubmitConfirm}>
                O'chirishni hohlaymiz ?
            </Confirm>

        </div>
    )
}


const Level = ({item, isNumeric = true, setActiveModal, setActiveConfirm, setWillChangeItemId}) => {
    const [activeInnerModal, setActiveInnerModal] = useState(false)

    const styleBasicLine =
        item.index === 0 && isNumeric ?
            {height: `calc(100%)`, top: `4rem`}
            : item.index === item.arrLength - 1 && isNumeric ?
                {height: `7rem`, top: "-3rem"} : null


    // useEffect(() => {
    // 	document.addEventListener("click",handleClickOutside,true)
    // },[])
    //
    //
    // const handleClickOutside = (e) => {
    // 	if (e.target.classList !== styles.innerModal && !e.target.classList.contains("fa-xmark") && e.target.classList !== styles.icon )  {
    // 		setActiveInnerModal(false)
    // 	}
    // }


    const ref = useRef()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setActiveInnerModal(false)
            }
        }

        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [activeInnerModal])
    return (
        <div className={styles.levels__item} ref={ref}>
            {
                isNumeric && item.arrLength !== 1 ?
                    <div className={styles.numeric}>
                        <div className={styles.basic_line} style={styleBasicLine}/>
                        <div className={styles.number}>{item.index + 1}</div>
                        <div className={styles.second_line}/>
                    </div> : null
            }

            <RequireAuthChildren allowedRules={[ROLES.Methodist]}>
                <div className={styles.header}>
                    <div className={styles.changeBtn}>
                        <div
                            className={styles.icon}
                            onClick={() => {
                                setActiveInnerModal(!activeInnerModal)
                                setWillChangeItemId(item.id)
                            }}
                        >
                            {
                                activeInnerModal ?
                                    <i className="fa-solid fa-xmark"></i>
                                    :
                                    <i className="fa-solid fa-ellipsis-vertical"/>

                            }

                        </div>


                        {
                            activeInnerModal ?
                                <div className={styles.innerModal}>
                                    <div className={styles.item} onClick={() => {
                                        setActiveModal(true)
                                    }}>
                                        <span>Ma'lumotlarini o'zgartirish</span>
                                        <i className="fa-solid fa-pen"></i>
                                    </div>
                                    <div className={styles.item} onClick={() => {
                                        setActiveConfirm(true)
                                        setActiveInnerModal(false)
                                    }}>
									<span>
										O'chirmoq
									</span>
                                        <i className="fa-solid fa-trash"></i>
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
            </RequireAuthChildren>


            <Link to={`../level/${item.id}/`} className={styles.info}>
                {
                    item.isBlocked ?
                        <div className={styles.isBlocked}>
                            <i className="fa-solid fa-lock"/>
                        </div> : null
                }


                <div className={styles.subHeader}>
                    <div>{item.name}</div>
                    <div>{item?.finished_percentage ||  0}%</div>
                </div>
                <PercentageTrackBar height={3} prc={item?.finished_percentage}/>
                <p>
                    {item?.desc?.length > 200 ? `${item?.desc?.substring(0, 200)}...` : item?.desc}
                </p>
            </Link>
        </div>

    )
}


export default Curriculum;