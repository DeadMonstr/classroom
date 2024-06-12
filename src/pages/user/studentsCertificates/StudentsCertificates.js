import React, {useEffect, useState} from 'react';


import cls from "./studentsCertificates.module.sass"
import Back from "components/ui/back";


import img from "assets/back-school-witch-school-supplies.jpg"
import Select from "components/ui/form/select";
import Input from "components/ui/form/input";
import Modal from "components/ui/modal";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, headersOldToken, headersOldTokenImg, PlatformUrl, PlatformUrlApi} from "constants/global";
import {useAuth} from "hooks/useAuth";
import Button from "components/ui/button";
import ImgInput from "components/ui/form/imgInput";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch} from "react-redux";

const StudentsCertificates = () => {

    const [certificates, setCertificates] = useState([])


    const [active, setActive] = useState(false)
    const [modalType, setModalType] = useState("create")
    const [changedItem, setChangedItem] = useState({})

    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState()
    const [student, setStudent] = useState()
    const [img, setImg] = useState()
    const [ball, setBall] = useState("")


    const {request} = useHttp()


    const toggleModal = (type) => {
        setModalType(type)
        setActive(!active)
    }

    const {platform_id} = useAuth()

    useEffect(() => {
        request(`${PlatformUrlApi}get_teacher_data/${platform_id}`)
            .then(res => {
                // const result = {
                //     ...res?.data,
                //     name: res?.full_name,
                //     subject: res?.subjects
                // }
                // dispatch(fetchedTeacher(result))
                // dispatch(fetchedResults(res?.list))
                // if (!res.status) {
                //     dispatch(fetchedTeacher({}))
                //     dispatch(fetchedResults(res?.list))
                // }
                setCertificates(res.list)
            })
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        request(`${BackUrl}get_groups`, "GET", null, headers())
            .then(res => {
                setGroups(res)
                // setGroups(res)
            })
    }, [platform_id])

    const dispatch = useDispatch()
    const onSubmit = () => {
        const formData = new FormData()
        const res = {
            teacher_id: platform_id,
            student_id: student,
            group_id: group,
            text: ball.toUpperCase(),
        }


        formData.append("res", JSON.stringify(res))
        formData.append("img", img)

        if (modalType === "create") {
            request(`${PlatformUrlApi}add_student_certificate`, "POST", formData, headersOldTokenImg())
                .then(res => {
                    const alert = {
                        active: true,
                        message: res.msg,
                        type: "success"
                    }
                    dispatch(setAlertOptions({alert}))
                    setCertificates(items => [...items,res.certificate])
                    setActive(false)
                })
                .catch(err => console.log(err))

        } else {
            request(`${PlatformUrlApi}change_student_certificate/${changedItem}`, "POST", formData, headersOldTokenImg())
                .then(res => {
                    const alert = {
                        active: true,
                        message: res.msg,
                        type: "success"
                    }
                    dispatch(setAlertOptions({alert}))
                    setCertificates(items => items.map(item => {
                        if (item.id === res.certificate.id) {
                            return res.certificate
                        }
                        return item
                    }))
                    setActive(false)
                })
                .catch(err => console.log(err))
        }
    }

    const onDelete = () => {
        request(`${PlatformUrlApi}delete_student_certificate/${changedItem}`, "DELETE",null, headersOldToken())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                console.log(res)
                setCertificates(items => items.filter(item => item.id !== +res.certificate_id))
                setActive(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={cls.certificates}>

            <Back/>

            <div className={cls.header}>
                <h1>Studentlar Sertifikatlari</h1>
                <div
                    onClick={() => {
                        toggleModal("create")
                    }}
                    className={cls.add}
                >
                    <i className="fa-solid fa-plus"></i>
                </div>
            </div>


            <div className={cls.wrapper}>
                {
                    certificates.map(item => {
                        return (
                            <div className={cls.certificate}>
                                <div className={cls.info}>
                                    <div
                                        onClick={() => {
                                            toggleModal("change")
                                            setGroup(item.group_id)
                                            setStudent(item.student_id)
                                            setBall(item.text)
                                            setImg(`${PlatformUrl}${item.img}`)
                                            setChangedItem(item.id)
                                        }}
                                        className={cls.change}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </div>

                                    <h3>
                                        <i className="fa-solid fa-user"></i>
                                        <span>
                                            {item.student_name}
                                        </span>
                                        <span>
                                            {item.student_surname}
                                        </span>
                                    </h3>

                                    <h1>
                                        {item.text}
                                    </h1>

                                </div>
                                <img src={`${PlatformUrl}${item.img}`} alt=""/>
                            </div>
                        )
                    })
                }
            </div>

            <Modal
                title={modalType === "create" ? "Sertifikat qo'shmoq" : "Sertifikat o'zrgartirmoq"}
                active={active}
                setActive={() => {
                    setImg(null)
                    setGroup(null)
                    setStudent(null)
                    setBall("")
                    setActive(false)
                }}
            >
                <div className={cls.createModal}>
                    <ImgInput url={true}  img={typeof img === "object" && img} databaseImg={typeof img === "string" && img} setImg={setImg}/>
                    <Select
                        value={group}
                        title={"Guruhlar"}
                        options={groups}
                        keyValue={"platform_id"}
                        onChange={(e) => {
                            setGroup(e)
                            setStudent(null)
                        }}
                    />


                    {
                        groups.filter(item => item.platform_id === +group)[0]?.students.length ?
                            <Select
                                value={student}
                                keyValue={"platform_id"}
                                multiNames={["name", "surname"]}
                                title={"Studentlar"}
                                options={groups.filter(item => item.platform_id === +group)[0]?.students}
                                onChange={setStudent}
                            /> : null
                    }

                    <Input onChange={setBall} value={ball} placeholder={"Nomi/Bali"}/>



                    <div className={cls.footer}>
                        <Button
                            onClick={onSubmit}
                            type={"submit"}
                        >
                            Tasdiqlash
                        </Button>
                        <Button
                            onClick={onDelete}
                            type={"danger"}
                        >
                            O'chirish
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default StudentsCertificates;

