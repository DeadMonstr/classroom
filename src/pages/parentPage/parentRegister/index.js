import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import Input from "components/ui/form/input";
import Loader from "components/ui/loader/Loader";
import Button from "components/ui/button";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

import cls from "./style.module.sass";

const genders = [
    {
        name: "Erkak",
    },
    {
        name: "Ayol"
    }
]

const Index = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors},
    } = useForm()

    const [loading, setLoading] = useState(false)
    const [activeError, setActiveError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isCheckLen, setIsCheckLen] = useState(false)
    const [isCheckPass, setIsCheckPass] = useState(false)
    const [password, setPassword] = useState("12345678")
    const {data} = useSelector(state => state.user)

    const [confirmPassword, setConfirmPassword] = useState("12345678")

    const checkUsername = (username) => {
        setLoading(true)
        request(`${BackUrl}checks/check_username`, "POST", JSON.stringify(username))
            .then(res => {
                setLoading(false)
                if (res?.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"

                    }, {shouldFocus: true})
                    setActiveError(true)
                    setErrorMessage("Username band")
                } else {
                    setActiveError(false)
                }
            })
    }

    const onCheckLength = (value) => {
        setIsCheckLen(value?.length < 8)
        setIsCheckPass(confirmPassword?.length !== 0 ? value !== confirmPassword : false)
        setPassword(value)
    }

    useEffect(() => {
        setIsCheckPass(confirmPassword !== password)

    }, [confirmPassword, password])

    const onSubmit = (dataForm) => {
        const res = {
            ...dataForm,
            location_id: data?.location_id,
            password,
            password_confirm: confirmPassword,
        }

        setLoading(true)
        request(`${BackUrl}parent/crud/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                // dispatch(({
                //     msg: "Muvaffaqiyatli qo'shildi",
                //     type: res.isError ? "error" : "success",
                //     active: true
                // }))
                reset()
                setLoading(false)

            })

    }

    return (
        <div className={cls.main}>
            <div className={cls.main__container}>
                <form
                    className={cls.form}
                    id="form"
                >

                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"username"}
                        title={"Username"}
                        // onChange={checkUsername}
                        required
                    />
                    {
                        activeError
                            ? <span className={cls.form__error}>
                                Username band
                              </span>
                            : errors?.username &&
                            <span className={cls.form__error}>
                                {errors?.username?.message}
                            </span>
                    }
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"name"}
                        title={"Ism"}
                        required
                    />
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"surname"}
                        title={"Familiya"}
                        required
                    />
                    {/*<Input*/}
                    {/*    extraClassNameLabel={cls.form__input}*/}
                    {/*    register={register}*/}
                    {/*    name={"father_name"}*/}
                    {/*    title={"Otasining ismi"}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"birth_day"}
                        title={"Tug'ilgan sana"}
                        type={"date"}
                        required
                    />
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"phone"}
                        title={"Telefon raqam"}
                        type={"number"}
                        required
                    />
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"password"}
                        title={"Parol"}
                        required
                        defaultValue={password}
                        type={"password"}
                        onChange={onCheckLength}
                    />
                    {
                        isCheckLen
                            ? <p className={cls.error}>Parolingiz 8 ta dan kam bo'lmasligi
                                kerak</p>
                            : null

                    }
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"password_confirm"}
                        title={"Parolni qayta kiriting"}
                        required
                        defaultValue={confirmPassword}
                        type={"password"}
                        onChange={setConfirmPassword}

                    />
                    {isCheckPass ? <p className={cls.error}>Parol har xil</p> : null}
                    <Input
                        extraClassNameLabel={cls.form__input}
                        register={register}
                        name={"address"}
                        title={"Manzil"}
                        required
                    />
                    <textarea
                        className={cls.form__text}
                        {...register("comment")}

                        placeholder={"Qo'shimcha ma'lumot (shart emas)"}
                        // cols="38"
                        // rows="10"
                    />

                    {loading ? <Loader/> : <Button extraClass={cls.form__btn} type={"submit"} formId={"form"} onClick={handleSubmit(onSubmit)}>Yakunlash</Button>}

                </form>
            </div>
        </div>
    );
};

export default Index;