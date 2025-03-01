import React, {useState} from 'react';

import "./login.sass"
import {Link, useNavigate} from "react-router-dom"
import {useDispatch,useSelector} from "react-redux";

import Logo from "assets/logo/Gennis logo.png"
import LogoTuron from "assets/logo/Frame 2596.svg"

import {useHttp} from "hooks/http.hook";
import {BackUrl} from "constants/global";
import Input from "components/ui/form/input";
import Loader from "components/ui/loader/Loader";
import Button from "components/ui/button";
import {setUserData} from "slices/userSlice";
import classNames from "classnames";
import {setAlertOptions} from "slices/layoutSlice";

const types = [
    "Gennis","Turon"
]


const Login = () => {


    const [type,setType] = useState(types[0])

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState('')

    const [showPassword,setShowPassword] = useState(false)

    const [activeError,setActiveError] = useState(false)
    const [messageError,setMessageError] = useState(null)
    const [postDataStatus,setPostDataStatus] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {request} = useHttp()

    const onSubmit =  (e) => {
        e.preventDefault()

        const user = {
            username: username,
            password: password,
            system_name: type.toLowerCase()
        }

        setPostDataStatus("loading")
        request(`${BackUrl}login`,"POST",JSON.stringify(user))
            .then((res) => {
                if (res.data?.info) {
                    dispatch(setUserData({data: {
                            ...res.data.info,
                            access_token: res.data.access_token,
                            refresh_token: res.data.refresh_token,
                        }}))
                    navigate("/home")

                } else {
                    setPostDataStatus("")
                    alert(res.msg)
                    dispatch(setAlertOptions({
                        active : true,
                        message: res.msg,
                        type: "error"
                    }))
                }

            })
    }

    const timeList = {
        times: [],
        days: [
            {
                day: "Dushanba",
                lessons: [
                    {
                        subject: "Ingliz tili",
                        teacher: {}
                    },
                    {
                        subject: "Ingliz tili",
                        teacher: {}
                    },
                    {
                        subject: "Ingliz tili",
                        teacher: {}
                    }
                ]
            }
        ]


    }

    // useEffect(() =>{
    //     if (meLoadingStatus === "error") {
    //         setActiveError(true)
    //         setMessageError("Parol yoki Username hato berilgan")
    //     } else if (meLoadingStatus === "success") {
    //         navigate('/platform')
    //     }
    // },[meLoadingStatus])


    const renderForm = () => {
        if (postDataStatus === "loading") {
            return (
                <Loader/>
            )
        } else {
            return (
                <>
                    <h1 className="title">Login</h1>
                    <Input
                        name={"username"}
                        title={"Username"}
                        type={"text"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={username}
                        onChange={(e) => {
                            setUsername(e)
                            setActiveError(false)
                        }}
                    />
                    <Input
                        name={"password"}
                        title={"Password"}
                        type={"password"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={password}
                        onChange={(e) => {
                            setPassword(e)
                            setActiveError(false)
                        }}
                    />
                    {/*<label htmlFor="username">*/}
                    {/*    <span className="name-field">Username</span>*/}
                    {/*    <input*/}
                    {/*        id="username"*/}
                    {/*        type="text"*/}
                    {/*        name="login"*/}
                    {/*        className="input-fields "*/}
                    {/*        */}
                    {/*        value={username}*/}
                    {/*    />*/}
                    {/*</label>*/}
                    {/*<label htmlFor="password">*/}
                    {/*    <span className="name-field">Password</span>*/}
                    {/*    <input*/}
                    {/*        id="password"*/}
                    {/*        type={typePassword}*/}
                    {/*        name="password"*/}
                    {/*        className="input-fields"*/}
                    {/*        onChange={(e) => {*/}
                    {/*            setPassword(e.target.value)*/}
                    {/*            setActiveError(false)*/}
                    {/*        }}*/}
                    {/*        value={password}*/}
                    {/*    />*/}
                    {/*    <i className={classShowPassword} onClick={() => setShowPassword(!showPassword)}/>*/}
                    {/*</label>*/}

                    <Button form={"loginForm"} type={"submit"}>Submit</Button>

                    {/*<div className="link__register">*/}
                    {/*    Agar accountingiz mavjud bolmasa:*/}
                    {/*    <span>*/}
                    {/*    <Link to="/register">*/}
                    {/*        Register*/}
                    {/*    </Link>*/}
                    {/*</span>*/}
                    {/*</div>*/}
                </>
            )
        }
    }

    return (
        <div className={classNames("login", {
            "turon_theme": type === "Turon"
        })}>

            <Link to="/">
                <img className="login__logo" src={type === "Gennis" ? Logo : LogoTuron} alt="Logo"/>
            </Link>
            
            
            
            <div className={"switch"}>
                {
                    types.map(item => {
                        return (
                            <div
                                onClick={() => setType(item)}
                                className={classNames("item", {
                                    "active": item === "Turon"
                                })}
                            >
                                {item}
                            </div>

                        )
                    })
                }
                <div
                    className={classNames("line", {
                        "active": type === "Turon"
                    })}
                ></div>
            </div>

            <form id={"loginForm"} action="" onSubmit={onSubmit}>
                {renderForm()}
            </form>
            {/*<Message/>*/}
        </div>
    );
};

export default Login;
