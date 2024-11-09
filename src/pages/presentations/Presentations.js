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


const PresentationsIndex = ( ) => {


    const [presentations, setPresentations] = useState([
        {
            id: 1,
            name: "Title",
            level: "Beginner",
            lesson: "Start"
        },
        {
            id: 2,
            name: "Title",
            level: "Beginner",
            lesson: "Start"
        },
        {
            id: 3,
            name: "Title",
            level: "Beginner",
            lesson: "Start"
        },
        {
            id: 4,
            name: "Title",
            level: "Beginner",
            lesson: "Start"
        }
    ])
    const [changeActive, setChangeActive] = useState(false)
    const [delActive, setDelActive] = useState(false)
    const [allChecked, setAllChecked] = useState(false)

    const onChange = useCallback(() => {
        setChangeActive(true)
    }, [])

    const onDel = useCallback(() => {
        setDelActive(true)
    }, [])

    useEffect(() => {

        const everyChecked = presentations.every(item => item.checked)
        setAllChecked(everyChecked)


    }, [presentations])


    const onChecked = useCallback((id) => {

        if (id === "all") {
            setAllChecked(!allChecked)
            setPresentations(data => data.map(item => {
                return {
                    ...item,
                    checked: !allChecked
                }
            }))
        } else {
            setPresentations(data => data.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        checked: !item.checked
                    }
                }
                return item
            }))
        }
    },[allChecked])

    const toggleChange = useCallback(() => {
        setChangeActive(prev => !prev)
    },[])

    const toggleDel = useCallback(() => {
        setDelActive(prev => !prev)
    },[])



    return (
        <div className={cls.workspace}>
            <div className={cls.header}>
                <h1>Taqdimotlar</h1>

                <Add/>
            </div>


            <div className={cls.subheader}>

                <Input extraClassName={cls.search} title={"Qidiruv"}/>
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
                    data={presentations}
                    allChecked={allChecked}
                    onChecked={onChecked}
                    onChange={toggleChange}
                    onDel={toggleDel}
                />


                <Change active={changeActive} setActive={toggleChange}/>
                <Delete active={delActive} setActive={toggleDel}/>



            </div>
        </div>
    )
}


const PresentationsList = React.memo(({onChange, onDel, onChecked, data, allChecked}) => {


    const popupOptions = [
        {
            onClick: onChange,
            children: (
                <>
                    <span><i className="fa-solid fa-pen"></i></span>
                    <span>Change</span>
                </>
            )
        },
        {
            onClick: onDel,
            children: (
                <>
                    <span><i style={{color: 'red'}} className="fa-solid fa-trash"></i></span>
                    <span>Delete</span>
                </>
            )
        }
    ]


    return (
        <div className={cls.table}>
            <div className={classNames(cls.table__item, cls.table__parent)}>
                <div><Checkbox checked={allChecked} onChange={() => onChecked("all")}/></div>
                <div className={classNames(cls.item)}>Name</div>
                <div className={classNames(cls.w20)}>Level</div>
                <div className={classNames(cls.w20)}>Lesson</div>
                <div className={classNames(cls.popup)}></div>
                {/*<div className={cls.item} >*/}
                {/*    <div className={cls.subItem}>asdas</div>*/}
                {/*    <div className={cls.subItem}>asdasd</div>*/}
                {/*    <div className={cls.subItem}>asdasd</div>*/}
                {/*</div>*/}
            </div>

            {
                data.map(item => {
                    return (
                        <div className={classNames(cls.table__item, cls.table__child)}>
                            <div><Checkbox checked={item.checked} onChange={() => onChecked(item.id)}/></div>
                            <Link className={cls.item} to={`/presentation/${item.id}`}>
                                <div className={classNames(cls.subItem)}>{item.name}</div>
                                <div className={classNames(cls.w20)}>{item.level}</div>
                                <div className={classNames(cls.w20)}>{item.lesson}</div>
                            </Link>
                            <div className={cls.popup}>
                                <Popup trigger={<i className="fa-solid fa-ellipsis"></i>} options={popupOptions}/>
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

    const toggleModal = () => {
        setOpenModal(!openModal)
    }


    return (
        <>
            <Button onClick={toggleModal}>
                Filterlar
            </Button>

            <Modal title={"Filterlar"} active={openModal} setActive={toggleModal}>
                <div className={cls.filters}>
                    <Select title={"Fan"}/>
                    <Select title={"Daraja"}/>
                    <Select title={"Lesson"}/>
                </div>
            </Modal>
        </>
    )
})

const Add = React.memo( () => {
    const [addActive, setAddActive] = useState(false)
    const toggleAddActive = () => {
        setAddActive(!addActive)
    }



    return (
        <>
            <Button type={"submit"} onClick={toggleAddActive}>
                <i className="fa-solid fa-plus"></i> <span>Yangi taqdimot</span>
            </Button>

            <Modal title={"Add"} active={addActive} setActive={setAddActive}>
                <form className={cls.change}>

                </form>
            </Modal>
        </>
    )
})


const Change = ({active,setActive}) => {

    return (
        <Modal title={"Change"} active={active} setActive={setActive}>
            <form className={cls.change}>

            </form>
        </Modal>
    )
}

const Delete = ({active,setActive}) => {
    return (
        <Modal title={"Delete"} active={active} setActive={setActive}>
            <form className={cls.del}>

            </form>
        </Modal>
    )
}


export default Presentations;