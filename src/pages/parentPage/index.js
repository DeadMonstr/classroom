import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {useParams} from "react-router";

import ParentRegister from "./parentRegister";
import ParentList from "./parentList";
import Button from "components/ui/button";

import cls from "./style.module.sass";
import ParentInfo from "./parentInfo";

const btn = ["list", "register"]

const Index = () => {

    const url = useParams()
    const navigate = useNavigate()

    const [active, setActive] = useState("list")

    useEffect(() => {
        if (url) {
            setActive(url["*"])
        }
    }, [url])

    return (
        <div className={cls.main}>
            <div className={cls.main__header}>
                {
                    btn.map((item) => (
                        <Button
                            key={item}
                            active={active === item}
                            onClick={() => {
                                setActive(item)
                                navigate(`${item}`)
                            }}
                            disabled={active === item}
                            extraClass={cls.btn}
                        >
                            {item}
                        </Button>
                    ))
                }
            </div>

            <div className={cls.main__conatainer}>
                <Routes>

                    <Route path={"list"} element={<ParentList/>}/>
                    <Route path={"register"} element={<ParentRegister/>}/>
                    <Route path={"info/:id"} element={<ParentInfo/>}/>

                    <Route index element={<Navigate to={"list"}/>}/>
                </Routes>

                <Outlet/>
            </div>

        </div>
    );
};

export default Index;