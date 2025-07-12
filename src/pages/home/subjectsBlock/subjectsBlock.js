import React, {useEffect, useState} from "react";
import useHorizontalScroll from "hooks/useHorizontalScroll";
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";
import styles from "pages/home/styles.module.sass";
import RequireAuthChildren from "components/auth/requireAuthChildren";
import {Link} from "react-router-dom";
import img from "assets/english.png";
import Modal from "components/ui/modal";
import {useDispatch} from "react-redux";
import {v4 as uuidv4} from "uuid";
import {setAlertOptions} from "slices/layoutSlice";
import Form from "components/ui/form";
import ImgInput from "components/ui/form/imgInput";
import Input from "components/ui/form/input";
import Textarea from "components/ui/form/textarea";

export const SubjectsBlock = React.memo(() => {


    const [subjects,setSubjects] = useState([])
    const ref = useHorizontalScroll()
    const [activeCreate,setActiveCreate] = useState(false)

    const onSubmit = (data) => {
        setSubjects(data.map(item => {
            return {...item,title: item.name}
        }))
        setActiveCreate(false)
    }

    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}subject/list/`,"GET",null,headers())
            .then(res => {
                setSubjects(res?.subjects.map(item => {
                    return {...item,title: item.name}
                }))
            })
    },[])


    return (
        <div  className={styles.subjects}>
            <div className={styles.subjects__header}>
                <h1 className={styles.title}>Fanlar: </h1>

                <RequireAuthChildren allowedRules={[ROLES.Methodist]}>
                    <div className={styles.addIcon} onClick={() => setActiveCreate(true)}>
                        <i className="fa-sharp fa-solid fa-plus"></i>
                    </div>
                </RequireAuthChildren>
            </div>
            <div ref={ref} className={styles.subjects__wrapper}>
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

        request(`${BackUrl}subject/crud/`,"POST",formData,{
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