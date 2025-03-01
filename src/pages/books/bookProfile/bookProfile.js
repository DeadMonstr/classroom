import React, {useEffect, useRef, useState} from 'react';


import cls from "./bookProfile.module.sass"
import Back from "components/ui/back";
import CheckPassword from "components/ui/checkPassword";
import Modal from "components/ui/modal";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchBookData} from "slices/booksSlice";
import {BackUrlForDoc, headersOldToken, PlatformUrl, PlatformUrlApi, ROLES} from "constants/global";
import {useAuth} from "hooks/useAuth";
import Button from "components/ui/button";
import Select from "components/ui/form/select";
import Input from "components/ui/form/input";
import {setAlertOptions} from "slices/layoutSlice";
import Confirm from "components/ui/confirm";

const BookProfile = () => {

    const {id} = useParams()

    const [activeModal, setActiveModal] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)


    const [selectedImg, setSelectedImg] = useState(null)
    const {isCheckedPassword} = useSelector(state => state.user)


    const {book} = useSelector(state => state.books)

    const refs = useRef([])


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchBookData(id))
    }, [id])


    useEffect(() => {
        if (Object.keys(book).length > 0) {
            setSelectedImg(book?.images[0]?.img)
        }
    }, [book])


    // eslint-disable-next-line react-hooks/exhaustive-deps


    const changeActiveImg = (index) => {

        for (let i = 0; i < refs.current.length; i++) {
            if (i === index) {
                for (let x = 0; x < refs.current.length; x++) {
                    refs.current[x].classList.remove(cls.active)
                }

                refs.current[index].classList.add(cls.active)
                setSelectedImg(book.images.filter((item, m) => m === index)[0]?.img)

            }
        }
    }



    return (
        <div className={cls.bookProfile}>
            <div className={cls.header}>
                <Back/>
            </div>

            <div className={cls.wrapper}>
                <div className={cls.slides}>
                    <img className={cls.main} src={`${PlatformUrl}${selectedImg}`} alt={"Img"}/>

                    <div className={cls.slides__wrapper}>
                        {
                            book?.images?.map((item, index) => {

                                if (index === 0) {
                                    return (
                                        <img
                                            className={cls.active}
                                            key={index}
                                            onClick={() => changeActiveImg(index)}
                                            src={`${PlatformUrl}${item?.img}`}
                                            ref={el => refs.current[index] = el}
                                            alt=""
                                        />
                                    )
                                }

                                return (
                                    <img
                                        key={index}
                                        onClick={() => changeActiveImg(index)}
                                        src={`${PlatformUrl}${item?.img}`}
                                        ref={el => refs.current[index] = el}
                                        alt=""
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className={cls.info}>
                    <h1>{book.name}</h1>
                    <p>{book.desc}</p>

                    <div className={cls.line}></div>

                    <div onClick={() => setActiveModal(true)} className={cls.info__btn}>
                        {book.price}
                    </div>
                </div>
            </div>

            {/*{*/}
            {/*    isCheckedPassword ?*/}
            {/*        */}
            {/*        : <CheckPassword active={activeModal} setActive={setActiveModal}/>*/}

            {/*}*/}

            <Modal type={"other"} active={activeModal} setActive={() => setActiveModal(false)} title={"Kitob sotib olish"}>

                <Buying disableModal={setActiveModal} price={book.price}
                        id={book.id}/>
            </Modal>

            {/*{*/}
            {/*    activeChangeModalName === "buy" && isCheckedPassword ?*/}
            {/*        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
            {/*            <Buying disableModal={() => setActiveChangeModal(false)} price={book.price}*/}
            {/*                    id={book.id}/>*/}
            {/*        </Modal> : null*/}
            {/*}*/}
        </div>
    );
};


const Buying = ({price, id, disableModal}) => {

    const [active, setActive] = useState("me")
    const [activeModal, setActiveModal] = useState(false)

    const [count, setCount] = useState(1)
    const [teachers, setTeachers] = useState([])
    const [groups, setGroups] = useState([])
    const [students, setStudents] = useState([])
    const [locations, setLocations] = useState([])


    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)


    const {role} = useAuth()


    const {request} = useHttp()

    useEffect(() => {
        request(`${PlatformUrlApi}filter_book/`, "GET", null, headersOldToken())
            .then(res => {
                if (role === ROLES.Teacher) {
                    setLocations(res.data[0].location_list)
                    setGroups(res.data[0].groups)
                } else {
                    setTeachers(res.data)
                }
            })
    }, [])


    useEffect(() => {
        if (selectedTeacher) {
            setGroups(teachers.filter(item => item.id === +selectedTeacher)[0].groups)
        }
    }, [selectedTeacher])


    useEffect(() => {
        if (selectedGroup) {
            setCount(groups.filter(item => item.id === +selectedGroup)[0].students)
            setStudents(groups.filter(item => item.id === +selectedGroup)[0].student_list)
        }
    }, [selectedGroup])

    const changeActive = (name) => {
        setActive(name)
        setStudents([])
    }

    const dispatch = useDispatch()
    const getConfirm = () => {
        let data
        if (role === ROLES.Teacher) {
            data = {
                count,
                location_id: selectedLocation,
                book_id: id,
                group_id: selectedGroup,
                students: students.filter(item => item.checked)
            }
        } else if (role === ROLES.Student) {
            data = {
                count,
                book_id: id,
            }
        }


        console.log(data,"data")


        request(`${PlatformUrlApi}buy_book`, "POST", JSON.stringify(data), headersOldToken())
            .then(res => {

                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))

                disableModal()
            })
            .catch(() => {
                const alert = {
                    active: true,
                    message: "Serverda yoki internetingizda hatolik bor",
                    type: "error"
                }
                dispatch(setAlertOptions({alert}))

            })

    }

    const setChecked = (id) => {
        setStudents(students => students.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    checked: !item.checked && true
                }
            }
            return item
        }))
    }


    const onSubmit = (e) => {
        e.preventDefault()
        setActiveModal(true)

    }

    useEffect(() => {
        if (locations.length > 0) {
            setSelectedLocation(locations[0].id)
        }
    }, [locations])


    const totalPrice = active === "me" ? price * count : price * students.filter(item => item.checked).length


    return (
        <div className={cls.buy}>
            <form onSubmit={onSubmit} id={"buy"}>
                <div className={cls.header}>
                    <h1>Kitob sotib olish</h1>
                </div>
                {
                    role !== ROLES.Student &&
                    <div className={cls.buy__header}>
                        <Button active={active === "me"} onClick={() => changeActive("me")}>O'zimga</Button>
                        <Button active={active === "other"} onClick={() => changeActive("other")}>Boshqa</Button>
                    </div>
                }

                <div className={cls.wrapper}>
                    {
                        active === "me" ?
                            <>
                                {locations.length > 0 &&
                                    <Select
                                        title={"Manzil"}
                                        extra={{required: true}}
                                        defaultValue={selectedLocation}
                                        name={"locations"}
                                        group={true}
                                        options={locations}
                                        onChange={setSelectedLocation}
                                    />
                                }
                                <Input title={"Kitob soni"} extraValues={{min: 1}} type={"number"} value={count} onChange={setCount}/>
                            </> :
                            <>
                                {
                                    role !== ROLES.Teacher &&
                                    <Select
                                        defaultValue={selectedTeacher}
                                        name={"teachers"}
                                        teachers={true}
                                        options={teachers}
                                        onChange={setSelectedTeacher}
                                    />

                                }


                                {groups.length > 0 &&
                                    <Select
                                        defaultValue={selectedGroup}
                                        name={"groups"}
                                        group={true}
                                        options={groups}
                                        onChange={setSelectedGroup}/>
                                }


                            </>
                    }
                </div>


                <div className={cls.footer}>
                    <Button type={"submit"} form={"buy"} >Sotib olish</Button>

                </div>



            </form>

            {
                students.length && active !== "me" &&
                <div className={cls.students}>
                    <h1>O'quvchiilar</h1>
                    {
                        students.map(item => (
                            <div className={cls.students__item}>
                                <span>{item.name}</span>
                                <span>{item.surname}</span>
                                <span>
                                    <input type="checkbox" onChange={() => setChecked(item.id)}/>
                                </span>
                            </div>
                        ))
                    }
                </div>
            }


            <Confirm onSubmit={getConfirm} active={activeModal} setActive={() => setActiveModal(false)}>
                <p>Siznig hisob raqamingizdan: <span style={{color:"red"}}>{totalPrice.toLocaleString()}</span> so'm pul yechiladi</p>
            </Confirm>

        </div>
    )
}


export default BookProfile;