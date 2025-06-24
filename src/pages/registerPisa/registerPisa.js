import React, {useEffect, useState} from 'react';

import cls from "./registerPisa.module.sass"
import {Link, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";

import Logo from "assets/logo/Gennis logo.png"
import LogoTuron from "assets/logo/Frame 2596.svg"

import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Input from "components/ui/form/input";
import Loader from "components/ui/loader/Loader";
import Button from "components/ui/button";
import {setUserData} from "slices/userSlice";
import classNames from "classnames";
import {setAlertOptions} from "slices/layoutSlice";
import Select from "components/ui/form/select";
import {useForm} from "react-hook-form";
import Alert from "components/ui/alert";

const types = [
    "Gennis", "Turon"
]


const lang = ["Uzb", "Rus"]



const Register = () => {

    const {register,handleSubmit,formState:{errors},watch,setError,clearErrors} = useForm()
    const watchUsername = watch("username")


    const [username, setUsername] = useState("")
    // const [password, setPassword] = useState('')
    const [name,setName] = useState("")
    const [surname,setSurname] = useState("")
    const [phone,setPhone] = useState("")
    const [parentPhone,setParentPhone] = useState("")
    const [location,setLocation] = useState("")
    const [language,setLanguage] = useState("")


    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const [activeError, setActiveError] = useState(false)
    const [messageError, setMessageError] = useState(null)
    const [postDataStatus, setPostDataStatus] = useState("")
    const [errorInput,setErrorInput] = useState(false)

    const [locations,setLocations] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const {request} = useHttp()

    useEffect(() => {
        if ( watchUsername !== undefined && watchUsername !== "") {
            setLoading(true)
            request(`${BackUrl}pisa/student/check/username`,"POST",JSON.stringify({username: watchUsername}),headers())
                .then(res => {
                    if (!res.success) {
                        setError('username', { type: 'custom', message: 'Username band' })
                        setErrorInput(true)
                    } else {
                        setErrorInput(false)
                        clearErrors("username")
                    }

                    setLoading(false)
                })
        } else {

            clearErrors("username")
        }
    },[ username, watchUsername])


    useEffect(() => {
        request(`${BackUrl}pisa/student/register`,"GET",null,headers())
            .then(res => {

                // const alert = {
                //     active : true,
                //     message: res.msg,
                //     type: "success"
                // }
                // dispatch(setAlertOptions({alert}))
                setLocations(res)
            })


    },[])

    const onSubmit = (e) => {
        e.preventDefault()

        if (errorInput) return;

        const user = {
            username: watchUsername,
            name,
            surname,
            phone,
            parentPhone,
            location,
            language,
            // password,
        }

        setLoading(true)
        request(`${BackUrl}pisa/student/register`, "POST", JSON.stringify(user))
            .then((res) => {
                alert(res.msg)
                navigate("/login_block_test")
                setName("")
                setSurname("")
                setPhone("")
                setParentPhone("")


                // if (res.data?.info) {
                //     dispatch(setUserData({
                //         data: {
                //             ...res.data.info,
                //             access_token: res.data.access_token,
                //             refresh_token: res.data.refresh_token,
                //         }
                //     }))
                //     // navigate("/home")
                //
                // } else {
                //     setPostDataStatus("")
                //     alert(res.msg)
                //     dispatch(setAlertOptions({
                //         active: true,
                //         message: res.msg,
                //         type: "error"
                //     }))
                // }

                setLoading(false)
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
                    <h1 className={cls.title}>Register Block Test</h1>
                    <Input
                        name={"username"}
                        title={"Username"}
                        type={"text"}
                        register={register}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={username}
                        onChange={(e) => {
                            setUsername(e)
                            setActiveError(false)
                        }}
                        errors={errors}
                    />
                    <Input
                        name={"name"}
                        title={"Ism"}
                        type={"text"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={username}
                        onChange={(e) => {
                            setName(e)
                            setActiveError(false)
                        }}
                    />
                    <Input
                        name={"surname"}
                        title={"Familya"}
                        type={"text"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={username}
                        onChange={(e) => {
                            setSurname(e)
                            setActiveError(false)
                        }}
                    />
                    <Input
                        name={"phone"}
                        title={"Telefon raqam"}
                        type={"number"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={password}
                        onChange={(e) => {
                            setPhone(e)
                            setActiveError(false)
                        }}
                    />
                    <Input
                        name={"numberParents"}
                        title={"Otasining raqami"}
                        type={"number"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={password}
                        onChange={(e) => {
                            setParentPhone(e)
                            setActiveError(false)
                        }}
                    />
                    <Select
                        name={"location"}
                        title={"Filial"}
                        options={locations}
                        required
                        onChange={setLocation}
                    />
                    <Select
                        name={"language"}
                        title={"Til"}
                        options={lang}
                        required
                        onChange={setLanguage}
                    />

                    {/*<Input*/}
                    {/*    name={"password"}*/}
                    {/*    title={"Password"}*/}
                    {/*    type={"password"}*/}
                    {/*    required*/}
                    {/*    clazz={activeError ? "input-fields-error" : null}*/}
                    {/*    // value={password}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        setPassword(e)*/}
                    {/*        setActiveError(false)*/}
                    {/*    }}*/}
                    {/*/>*/}

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

                    <Button disabled={errorInput} form={"loginForm"} type={"submit"}>Submit</Button>

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
        <div className={cls.registerPisa}>


            <form id={"loginForm"} action="" onSubmit={onSubmit}>
                {renderForm()}
            </form>

            <Link to="/">
                <img className={cls.logo} src={Logo} alt="Logo"/>
            </Link>
            {/*<Alert/>*/}


            {/*<Message/>*/}
        </div>
    );
};

export default Register;
