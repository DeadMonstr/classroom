import React, {useCallback, useEffect, useState} from 'react';

import cls from "./Presentations.module.sass"
import {Link, NavLink, Route, Routes} from "react-router-dom";
import classNames from "classnames";
import Button from "components/ui/button";
import Input from "components/ui/form/input";
import Checkbox from "components/ui/form/checkbox";
import Modal from "components/ui/modal";
import Select from "components/ui/form/select";
import Popup from "components/ui/popup/Popup";
import {useDispatch, useSelector} from "react-redux";
import {fetchSubjectsData} from "slices/subjectsSlice";
import {fetchSubjectLevelsData} from "slices/subjectSlice";
import {fetchSystemTypesData} from "slices/extraTypes";
import {BackUrl, headers, ROLES} from "constants/global";
import {useAuth} from "hooks/useAuth";
import {useHttp} from "hooks/http.hook";
import {
    fetchPresentations, onAddPresentation,
    onChangePresentation,
    onDeletePresentation,
    setPage,
    setSearch
} from "slices/presentationsSlice";
import Pagination from "components/ui/pagination";
import Confirm from "components/ui/confirm";
import {setAlertOptions} from "slices/layoutSlice";

const Presentations = () => {
    return (
        <div className={cls.presentations}>
            <nav className={cls.menu}>
                <NavLink
                    to={"workspace"}
                    className={({isActive}) => classNames(cls.menu__item, {[cls.active]: isActive})}
                >
                    Taqdimotlar
                </NavLink>

                <NavLink
                    to={"templates"}
                    className={({isActive}) => classNames(cls.menu__item, {[cls.active]: isActive})}
                >
                    Andozalar
                </NavLink>
            </nav>


            <main>
                <Routes>
                    <Route path={"workspace"} element={<PresentationsIndex/>}/>

                </Routes>
            </main>
        </div>
    );
};


const PresentationsIndex = () => {


    const {presentations: {data, page, totalData, pageSize}, search} = useSelector(state => state.presentations)

    const [changeActive, setChangeActive] = useState(false)
    const [delActive, setDelActive] = useState(false)
    const [allChecked, setAllChecked] = useState(false)
    const [changedItem, setChangedItem] = useState()



    //
    // useEffect(() => {
    //
    //     const everyChecked = data.every(item => item.checked)
    //     setAllChecked(everyChecked)
    //
    // }, [data])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchSubjectsData())
        dispatch(fetchSystemTypesData())
    }, [])


    useEffect(() => {
        dispatch(fetchPresentations({page: page, pageSize, search,}))
    }, [page, pageSize, search])


    const onChecked = useCallback((id) => {

        // if (id === "all") {
        //     setAllChecked(!allChecked)
        //     setPresentations(data => data.map(item => {
        //         return {
        //             ...item,
        //             checked: !allChecked
        //         }
        //     }))
        // } else {
        //     setPresentations(data => data.map(item => {
        //         if (item.id === id) {
        //             return {
        //                 ...item,
        //                 checked: !item.checked
        //             }
        //         }
        //         return item
        //     }))
        // }
    }, [allChecked])

    const toggleChange = useCallback((item) => {
        setChangeActive(prev => !prev)
        setChangedItem(item)

    }, [])

    const toggleDel = useCallback((item) => {
        setDelActive(prev => !prev)
        setChangedItem(item)
    }, [])

    const onDisable = useCallback(() => {
        setDelActive(false)
    }, [])

    const onChangePageSize = (page) => {
        dispatch(setPage(page))
    }

    const onChangeSearch = (search) => {
        dispatch(setSearch(search))
    }


    const {request} = useHttp()

    const onDelete = () => {

        request(`${BackUrl}v1/presentation/slide/delete/${changedItem?.id}/`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                dispatch(onDeletePresentation(changedItem?.id))
                onDisable()
            })
    }


    return (
        <div className={cls.workspace}>
            <div className={cls.header}>
                <h1>Taqdimotlar</h1>

                <Add/>
            </div>


            <div className={cls.subheader}>

                <Input
                    onChange={onChangeSearch}
                    extraClassName={cls.search}
                    title={"Qidiruv"}
                />
                <Filters/>
            </div>


            <div className={cls.wrapper}>


                {/*<div className={cls.slides}>*/}
                {/*    <div className={cls.slides__header}>*/}
                {/*        */}
                {/*    </div>*/}
                {/*    <div className={cls.slides__wrapper}>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {/*<Table extraClassname={cls.table}>*/}


                {/*    <thead>*/}
                {/*        <tr>*/}
                {/*            <th><Checkbox/></th>*/}
                {/*            <th>Nomi</th>*/}
                {/*            <th>Fan</th>*/}
                {/*            <th>Daraja</th>*/}
                {/*            <th></th>*/}
                {/*        </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*        <tr onClick={onClick}>*/}
                {/*            <td><Checkbox/></td>*/}
                {/*            <td>Title</td>*/}
                {/*            <td>Ingliz tili</td>*/}
                {/*            <td>Beginner</td>*/}
                {/*            <td className={cls.popup}><i className="fa-solid fa-ellipsis"></i></td>*/}
                {/*        </tr>*/}


                {/*    </tbody>*/}
                {/*</Table>*/}


                <PresentationsList
                    data={data}
                    allChecked={allChecked}
                    onChecked={onChecked}
                    onChange={toggleChange}
                    onDel={toggleDel}
                />
                <Pagination
                    className="pagination-bar"
                    currentPage={page}
                    totalCount={totalData}
                    pageSize={pageSize}
                    onPageChange={page => {
                        onChangePageSize(page)
                    }}
                />

                <Change
                    active={changeActive}
                    setActive={toggleChange}
                    data={changedItem}
                />

                <Confirm
                    onSubmit={onDelete}
                    active={delActive}
                    setActive={onDisable}
                >Taqdimotni o'chirish</Confirm>



            </div>
        </div>
    )
}


const PresentationsList = React.memo(({onChange, onDel, onChecked, data, allChecked}) => {


    const popupOptions = (opts) => {

        console.log(opts)

        return [
            {
                onClick: () => onChange(opts),
                children: (
                    <>
                        <span><i className="fa-solid fa-pen"></i></span>
                        <span>Change</span>
                    </>
                )
            },
            {
                onClick: () => onDel(opts),
                children: (
                    <>
                        <span><i style={{color: 'red'}} className="fa-solid fa-trash"></i></span>
                        <span>Delete</span>
                    </>
                )
            }
        ]
    }





    return (
        <div className={cls.table}>
            <div className={classNames(cls.table__item, cls.table__parent)}>
                <div><Checkbox checked={allChecked} onChange={() => onChecked("all")}/></div>
                <div className={classNames(cls.item)}>Name</div>
                <div className={classNames(cls.w20)}>Subject</div>
                <div className={classNames(cls.w20)}>Level</div>
                <div className={classNames(cls.popup)}></div>
                {/*<div className={cls.item} >*/}
                {/*    <div className={cls.subItem}>asdas</div>*/}
                {/*    <div className={cls.subItem}>asdasd</div>*/}
                {/*    <div className={cls.subItem}>asdasd</div>*/}
                {/*</div>*/}
            </div>

            {
                data?.map(item => {
                    return (
                        <div className={classNames(cls.table__item, cls.table__child)}>
                            <div><Checkbox checked={item.checked} onChange={() => onChecked(item.id)}/></div>
                            <Link className={cls.item} to={`/presentation/${item.id}`}>
                                <div className={classNames(cls.subItem)}>{item.name}</div>
                                <div className={classNames(cls.w20)}>{item.subject.name}</div>
                                <div className={classNames(cls.w20)}>{item.level.name}</div>
                            </Link>
                            <div className={cls.popup}>
                                <Popup trigger={<i className="fa-solid fa-ellipsis"></i>} options={popupOptions(item)}/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
})


const Filters = React.memo(() => {
    const [openModal, setOpenModal] = useState(false)
    const {presentations: {page, pageSize}, search} = useSelector(state => state.presentations)
    const {subjects} = useSelector(state => state.subjects)
    const {systemTypes} = useSelector(state => state.extraTypes)
    const {levels} = useSelector(state => state.subject)

    const [level, setLevel] = useState(null)
    const [subject, setSubject] = useState(null)
    const [system, setSystem] = useState(null)

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    useEffect(() => {
        if (subject && subject !== "all") {
            dispatch(fetchSubjectLevelsData({id: subject, branchType: system}))
        }
    }, [subject, system])

    const dispatch = useDispatch()

    useEffect(() => {
        if (level && subject)

        dispatch(fetchPresentations({page: page, pageSize, search, level_id: level, subject_id: subject}))
    }, [level, subject])


    return (
        <>
            <Button onClick={toggleModal}>
                Filterlar
            </Button>

            <Modal title={"Filterlar"} active={openModal} setActive={toggleModal}>
                <div className={cls.filters}>
                    <Select
                        all
                        title={"Fan"}
                        options={subjects}
                        value={subject}
                        onChange={setSubject}
                    />
                    <Select
                        title={"Filial Turi"}
                        options={systemTypes}
                        value={system}
                        onChange={setSystem}
                    />
                    <Select
                        all
                        title={"Daraja"}
                        options={levels}
                        value={level}
                        onChange={setLevel}
                    />
                </div>
            </Modal>
        </>
    )
})

const Add = React.memo(() => {
    const {subjects} = useSelector(state => state.subjects)
    const {systemTypes} = useSelector(state => state.extraTypes)
    const {levels} = useSelector(state => state.subject)
    const {role} = useAuth()

    const [name, setName] = useState("")
    const [subject, setSubject] = useState(null)
    const [addActive, setAddActive] = useState(false)
    const [system, setSystem] = useState()
    const [level, setLevel] = useState()

    const [loading,setLoading] = useState(false)


    const toggleAddActive = () => {
        setAddActive(!addActive)
    }

    const dispatch = useDispatch()

    useEffect(() => {
        if (subject && subject !== "all") {
            dispatch(fetchSubjectLevelsData({id: subject, branchType: system}))
        }
    }, [subject, system])

    const {request} = useHttp()

    const onSubmit = () => {

        const data = {
            name,
            subject_id: subject,
            level_id: level,
        }

        setLoading(true)
        request(`${BackUrl}v1/presentation/slide/create`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onAddPresentation(res.data))
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                setLoading(false)
                dispatch(setAlertOptions({alert}))
                setAddActive(false)
            })
    }


    return (
        <>
            <Button type={"submit"} onClick={toggleAddActive}>
                <i className="fa-solid fa-plus"></i> <span>Yangi taqdimot</span>
            </Button>

            <Modal title={"Add"} active={addActive} setActive={setAddActive}>
                <form
                    className={cls.change}

                >
                    <Input
                        title={"Name"}
                        value={name}
                        onChange={setName}
                    />
                    <Select
                        title={"Fanlar"}
                        options={subjects}
                        onChange={setSubject}
                        value={subject}
                    />

                    <div className={cls.levels}>
                        {
                            ROLES.Methodist === role &&
                            <Select
                                title={"Branch type"}
                                options={systemTypes}
                                onChange={setSystem}
                                value={system}
                            />
                        }

                        {levels?.length !== 0 &&
                            <Select
                                title={"Darajalar"}
                                optional
                                options={levels}
                                keyValue={"id"}
                                onChange={setLevel}
                            />
                        }
                    </div>

                    <Button
                        disabled={loading}
                        type={"submit"}
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                </form>
            </Modal>
        </>
    )
})


const Change = ({active, setActive, data}) => {
    const {subjects} = useSelector(state => state.subjects)
    const {systemTypes} = useSelector(state => state.extraTypes)
    const {levels} = useSelector(state => state.subject)
    const {role} = useAuth()

    const [addActive, setAddActive] = useState(false)

    const [name, setName] = useState("")
    const [subject, setSubject] = useState(null)
    const [system, setSystem] = useState()
    const [level, setLevel] = useState()
    const [loading, setLoading] = useState(false)


    const id = data?.id

    useEffect(() => {
        setSystem(data?.system_name)
        setName(data?.name)
        setSubject(data?.subject?.id)
        setLevel(data?.level?.id)
    }, [data])



    const dispatch = useDispatch()

    useEffect(() => {
        if (subject && subject !== "all") {
            dispatch(fetchSubjectLevelsData({id: subject, branchType: system}))
        }
    }, [subject, system])

    const {request} = useHttp()

    const onSubmit = () => {

        const data = {
            name,
            subject_id: subject,
            level_id: level,
        }

        setLoading(true)
        request(`${BackUrl}v1/presentation/slide/update/${id}/`, "PUT", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onChangePresentation(res.data))
                setActive(false)
                setLoading(false)
            })
    }

    return (
        <Modal title={"Change"} active={active} setActive={setActive}>
            <form className={cls.change}>
                <Input
                    title={"Name"}
                    value={name}
                    onChange={setName}
                />
                <Select
                    title={"Fanlar"}
                    options={subjects}
                    onChange={setSubject}
                    value={subject}
                />

                <div className={cls.levels}>
                    {
                        ROLES.Methodist === role &&
                        <Select
                            title={"Branch type"}
                            options={systemTypes}
                            onChange={setSystem}
                            value={system}
                        />
                    }

                    {levels?.length !== 0 &&
                        <Select
                            title={"Darajalar"}
                            optional
                            value={level}
                            options={levels}
                            keyValue={"id"}
                            onChange={setLevel}
                        />
                    }
                </div>

                <Button
                    disabled={loading}
                    type={"submit"}
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </form>
        </Modal>
    )
}

const Delete = ({active, setActive}) => {
    return (
        <Modal title={"Delete"} active={active} setActive={setActive}>
            <form className={cls.del}>

            </form>
        </Modal>
    )
}


export default Presentations;