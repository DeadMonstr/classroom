import React, {useCallback, useEffect, useState} from 'react';

import styles from "./style.module.sass"
import Input from "components/ui/form/input";
import Button from "components/ui/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl} from "constants/global";
import {useDispatch} from "react-redux";
import {setAlertOptions} from "slices/layoutSlice";
import Modal from "components/ui/modal";
import Confirm from "components/ui/confirm";
import Select from "components/ui/form/select";
import Radio from "components/ui/form/radio";


const typesOptions = [
    "simple",
    "random"
]

const CreateType = () => {


    const [types, setTypes] = useState([])
    const [name, setName] = useState("")
    const [active, setActive] = useState(false)
    const [activeConfirm, setActiveConfirm] = useState(false)
    const [isChanging, setIsChanging] = useState(false)
    const [willChangeData, setWillChangeData] = useState(null)
    const [selectedType, setSelectedType] = useState("")


    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {
        request(`${BackUrl}exercise/type/crud/`, "GET")
            .then(res => {
                setTypes(res.data)
            })
    }, [])


    const onCreate = () => {

        request(`${BackUrl}exercise/type/crud/`, "POST", JSON.stringify({name, type: selectedType}))
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                setTypes(types => [...types, res.data])
            })
        setActive(false)
        setIsChanging(false)
        setName("")
    }

    const onChange = () => {
        request(`${BackUrl}exercise/type/crud/${willChangeData.id}`, "POST", JSON.stringify({name,type: selectedType}))
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                setTypes(types => types.map(item => {
                    if (item.id === res.data.id) {
                        return {...item, ...res.data}
                    }
                    return item
                }))
            })
        setActive(false)
        setIsChanging(false)
        setName("")
    }

    const onChangeData = (id) => {
        setWillChangeData(types.filter(item => item.id === id)[0])
        setName(types.filter(item => item.id === id)[0].name)
        setSelectedType(types.filter(item => item.id === id)[0].type)
        setActive(true)
        setIsChanging(true)
    }

    const renderTypes = useCallback(() => {
        return types.map(item => {
            return (
                <div className={styles.types__item} onClick={() => onChangeData(item.id)}>
                    {item.name}
                    <div className={styles.delete}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                </div>
            )
        })
    }, [types])


    const onDelete = () => {
        setWillChangeData("")
        setIsChanging(false)

        request(`${BackUrl}exercise/type/crud/${willChangeData?.id}`, "DELETE", JSON.stringify({name}))
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(setAlertOptions({alert}))
                setTypes(types.filter(item => item.id !== willChangeData.id))
                setActiveConfirm(false)
                setActive(false)
            })
    }




    return (
        <div className={styles.types}>
            <h1 className={styles.title}>Mashq turlari</h1>
            <div className={styles.header}>

                <Button circle={true} onClick={() => setActive(true)}>
                    <i className="fa-solid fa-plus"/>
                </Button>
            </div>
            <div className={styles.container}>
                {renderTypes()}
            </div>


            <Modal active={active} setActive={() => {
                setActive(false)
                setIsChanging(false)
                setName("")
            }}>
                <div className={styles.createType}>
                    <Input
                        style={{marginBottom: '2rem'}}
                        value={name}

                        onChange={setName}
                        title={"Mashq turi nomi"}
                    />
                    {/*<Select*/}
                    {/*	title={""}*/}
                    {/*	options={typesOptions}*/}
                    {/*	onChange={setSelectedType}*/}
                    {/*	value={selectedType}*/}
                    {/*/>*/}


					<div className={styles.createType__types}>
						{
							typesOptions.map(item => {
								return (
									<Radio
										onChange={setSelectedType}
										name={"type"}
                                        checked={selectedType === item}
										value={item}
									>
										{item}
									</Radio>
								)
							})
						}
					</div>



                    <div className={styles.footer}>
                        {
                            isChanging ?
                                <Button type={"submit"} onClick={onChange}>
                                    O'zgartirmoq
                                </Button>
                                :
                                <Button type={"submit"} onClick={onCreate}>
                                    Yaratmoq
                                </Button>

                        }

                        {
                            isChanging && !willChangeData?.del_status ?
                                <Button type={"danger"} onClick={() => setActiveConfirm(true)}>
                                    <i className="fa-solid fa-trash"></i>
                                </Button> : null
                        }

                    </div>

                </div>

                <Confirm onSubmit={onDelete} active={activeConfirm} setActive={() => setActiveConfirm(false)}>
                    O'chirishni hohlaysizmi
                </Confirm>

            </Modal>



        </div>
    );
};

export default CreateType;