import React, {useEffect, useState} from 'react';


import cls from "./myResultsPisaTest.module.sass"
import {useParams} from "react-router";
import Button from "components/ui/button";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {useNavigate} from "react-router-dom";



const MyResultPisaTest = () => {

    const {id} = useParams()
    const [data, setData] = useState()

    const {request} = useHttp()

    useEffect(()=> {
        request(`${BackUrl}pisa/student/show/result/${id}`, "GET", null, headers())
            .then(res => {
                setData(res.test)
            })
    },[])

    const navigate = useNavigate()

    return (
        <div className={cls.result}>


            <div className={cls.result__box}>
                <h1 className={cls.result__title}>
                   Mening baholarim
                </h1>
                <div className={cls.info}>
                    <div className={cls.info__item}>
                        <h1>Ism</h1>
                        <h2>{data?.name}</h2>
                    </div>
                    <div className={cls.info__item}>
                        <h1>Familya</h1>
                        <h2>{data?.surname}</h2>
                    </div>
                    <hr/>
                    <div className={cls.info__item}>
                        <h1>Savollar soni</h1>
                        <h2>{data?.total_questions}</h2>
                    </div>
                    <div className={cls.info__item}>
                        <h1>Tog'ri javoblar soni</h1>
                        <h2>{data?.true_answers}</h2>
                    </div>

                    <hr/>
                    <div className={cls.info__item}>
                        <h1>Foiz</h1>
                        <h2>{data?.result}</h2>
                    </div>
                </div>

                {/*<Button*/}
                {/*    onClick={() => navigate(`../checkMyResultsPisaTest/${id}`)}*/}
                {/*    type={"submit"}*/}
                {/*>*/}
                {/*    Javoblarni tekshirish*/}
                {/*</Button>*/}
            </div>


            {/*<Modal active={active} setActive={setActive}>*/}
            {/*    <CheckResultsPisaTest/>*/}
            {/*</Modal>*/}

        </div>
    );
};

export default MyResultPisaTest;