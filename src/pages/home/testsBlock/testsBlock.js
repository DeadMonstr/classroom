import React, {useEffect, useState} from "react";
import useHorizontalScroll from "hooks/useHorizontalScroll";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useNavigate} from "react-router-dom";
import styles from "pages/home/styles.module.sass";
import img from "assets/english.png";
import backImg from "assets/img.png";
import Button from "components/ui/button";
import Modal from "components/ui/modal";

export const TestsBlock = React.memo(() => {


    const [tests,setTests] = useState([])
    const ref = useHorizontalScroll()


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
        <div className={styles.subjects}>
            <div className={styles.subjects__header}>
                <h1 className={styles.title}>Block Testlar: </h1>
            </div>
            <div ref={ref} className={styles.subjects__wrapper}>
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



        </div>
    )
})