import React, {useState} from 'react';

import cls from "pages/loginPisa/loginPisa.module.sass"
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




const LoginPisa = () => {



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
        }

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
                    <h1 className={cls.title}>Login Block Test</h1>
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


                    <Button form={"loginForm"} type={"submit"}>Submit</Button>


                </>
            )
        }
    }

    return (
        <div className={cls.login}>

            <Link to="/">
                <img className={cls.login__logo} src={Logo } alt="Logo"/>
            </Link>


            <form id={"loginForm"} action="" onSubmit={onSubmit}>
                {renderForm()}
            </form>
            {/*<Message/>*/}
        </div>
    );
};

export default LoginPisa;
