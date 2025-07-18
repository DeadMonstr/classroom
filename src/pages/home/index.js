import React, {useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid'

import styles from "./styles.module.sass"
import img from "assets/english.png"
import useHorizontalScroll from "hooks/useHorizontalScroll";
import {Link, useNavigate} from "react-router-dom";
import useChangeMenuParams from "hooks/useChangeMenuParams";
import { useDispatch, useSelector } from "react-redux";
import {setAlertOptions, setOptions} from "slices/layoutSlice";
import Modal from "components/ui/modal";
import Input from "components/ui/form/input";
import ImgInput from "components/ui/form/imgInput";
import Textarea from "components/ui/form/textarea";
import {useHttp} from "hooks/http.hook";
import { BackUrl, BackUrlForDoc, headers, ROLES } from "constants/global";
import Form from "components/ui/form";
import RequireAuthChildren from "components/auth/requireAuthChildren";
import backImg from "assets/img.png"
import Button from "components/ui/button";
import ParentSection from "../parentSection/parentSection";

const Home = () => {





    const options = useChangeMenuParams("main","")
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setOptions(options))
    },[dispatch, options])



    return (
        <div className={styles.home}>


            <div className={styles.home__wrapper}>
                <RequireAuthChildren allowedRules={[ROLES.Methodist,ROLES.Teacher,ROLES.Student]}>
                    <Subjects />
                    <PisaTests/>
                </RequireAuthChildren>
                <RequireAuthChildren allowedRules={[ROLES.Parent]}>
                    <ParentSection/>
                </RequireAuthChildren>


            </div>


        </div>
    );
};


const Subjects = React.memo(() => {


    const [subjects,setSubjects] = useState([])
    const ref = useHorizontalScroll(subjects,3)
    const [activeCreate,setActiveCreate] = useState(false)

    const onSubmit = (data) => {
        setSubjects(data.map(item => {
            return {...item,title: item.name}
        }))
        setActiveCreate(false)
    }

    const {request} = useHttp()

    useEffect(() => {


        request(`${BackUrl}info/subjects`,"GET",null,headers())
            .then(res => {
                setSubjects(res?.subjects.map(item => {
                    return {...item,title: item.name}
                }))
            })
    },[])


    return (
        <div ref={ref} className={styles.subjects}>
            <div className={styles.subjects__header}>
                <h1 className={styles.title}>Fanlar: </h1>

                <RequireAuthChildren allowedRules={[ROLES.Methodist]}>
                    <div className={styles.addIcon} onClick={() => setActiveCreate(true)}>
                        <i className="fa-sharp fa-solid fa-plus"></i>
                    </div>
                </RequireAuthChildren>
            </div>
            <div className={styles.subjects__wrapper}>
                {
                    subjects.map((item,index) => {
                        return (
                            <Link key={index} to={`/subject/${item.id}`} data={{ name: "value" }} className={styles.subjects__item}>
                                <div className={styles.subjects__itemImage}>
                                    <img src={item.img ? `${BackUrlForDoc}${item.img}` : null} alt="Subject"/>
                                    <div className={styles.percentage}></div>
                                </div>
                                <div className={styles.subjects__itemInfo}>
                                    <h1>{item.title}</h1>
                                    <p>
                                        {item?.desc?.length > 150 ? `${item?.desc?.substring(0,140)}...` : item.desc}
                                    </p>
                                </div>

                            </Link>
                        )
                    })
                }
            </div>


            <Modal setActive={() => setActiveCreate(false)} active={activeCreate}>
                <CreateSubject onSubmit={onSubmit}/>
            </Modal>


        </div>
    )
})

const PisaTests = React.memo(() => {


    const [tests,setTests] = useState([])
    const ref = useHorizontalScroll(tests,3)
    const [activeCreate,setActiveCreate] = useState(false)

    const onSubmit = (data) => {
        setTests(data.map(item => {
            return {...item,title: item.name}
        }))
        setActiveCreate(false)
    }

    const {request} = useHttp()

    useEffect(() => {


        request(`${BackUrl}pisa/student/get/list`,"GET",null,headers())
            .then(res => {
                setTests(res?.map(item => {
                    return {...item,title: item.name}
                }))
            })
    },[])


    const navigate = useNavigate()

    const onLink = (id) => {
        navigate(`/viewPisaTest/${id}`)
    }
    const onLinkResult = (id) => {
        navigate(`/myResultsPisaTest/${id}`)
    }


    return (
        <div ref={ref} className={styles.subjects}>
            <div className={styles.subjects__header}>
                <h1 className={styles.title}>Pisa Testlar: </h1>


            </div>
            <div className={styles.subjects__wrapper}>
                {
                    tests.map((item,index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (item.finished) return
                                    onLink(item.id)
                                }}
                                className={styles.subjects__item}
                            >
                                <div className={styles.subjects__itemImage}>
                                    <img src={backImg} alt="Subject"/>
                                    <div className={styles.percentage}></div>
                                </div>
                                <div className={styles.subjects__itemInfo}>
                                    <h1>{item.title}</h1>
                                    <p>
                                        {item?.desc?.length > 150 ? `${item?.desc?.substring(0,140)}...` : item.desc}
                                    </p>
                                </div>
                                {item.finished && <div className={styles.finished}>
                                    <i className="fa-solid fa-lock"></i>

                                    <Button onClick={() => onLinkResult(item.id)} type={"submit"}>Natija {item.title}</Button>
                                </div>
                                }
                            </div>
                        )
                    })
                }
            </div>


            <Modal setActive={() => setActiveCreate(false)} active={activeCreate}>
                <CreateSubject onSubmit={onSubmit}/>
            </Modal>


        </div>
    )
})


const CreateSubject = ({onSubmit}) => {

    const [img,setImg] = useState()
    const [title,setTitle] = useState("")
    const [desc,setDesc] = useState("")

    const {request} = useHttp()
    const dispatch = useDispatch()

    const handleClick =  (e) => {
        e.preventDefault()
        const data = {
            id: uuidv4(),
            title,
            desc
        }


        const formData = new FormData()

        formData.append("file", img)
        formData.append("info",JSON.stringify(data))

        const token = sessionStorage.getItem("token")

        request(`${BackUrl}info/subjects`,"POST",formData,{
            "Authorization" : "Bearer " + token,
        })
            .then( res => {
                const alert = {
                    active : true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                onSubmit(res.data)

            })
        setImg(null)
        setDesc("")
        setTitle("")

    }



    return (
        <div className={styles.createSubject}>

            <Form onSubmit={handleClick}>
                <ImgInput  img={img} setImg={setImg}/>
                <Input required={true} title={"Fan nomi"} onChange={setTitle} value={title} />
                <Textarea  required={true} title={"Fan haqida ma'lumot"} onChange={setDesc} value={desc}/>
            </Form>
        </div>
    )
}



export default Home;