import React, {useEffect, useState} from 'react';


import cls from "./addEquipment.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import Button from "components/ui/button";
import Modal from "components/ui/modal";
import Form from "components/ui/form";
import Textarea from "components/ui/form/textarea";
import {useForm} from "react-hook-form";
import Confirm from "components/ui/confirm";
import {useLocalStorageCleanupOnRoute} from "hooks/useClearLocalStorage";
import {useDispatch, useSelector} from "react-redux";
import {fetchClassesData, fetchRooms} from "slices/extraTypes";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setAlertOptions} from "slices/layoutSlice";
import {useNavigate} from "react-router";


const AddEquipment = () => {
    useLocalStorageCleanupOnRoute(["equipments"])

    const {rooms, classes} = useSelector(state => state.extraTypes)

    const [activeModal, setActiveModal] = useState(false)
    const [items, setItems] = useState([])
    const [changingItem, setChangingItem] = useState(null)
    const [confirmActive, setConfirmActive] = useState(false)
    const [title, setTitle] = useState("")
    const [room, setRoom] = useState("")
    const [clas, setClas] = useState("")

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchClassesData())
        dispatch(fetchRooms())
    }, [])

    useEffect(() => {
        const equipments = localStorage.getItem("equipments")
        if (equipments) {
            setItems(JSON.parse(equipments))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("equipments", JSON.stringify(items));
    }, [items]);


    const onAddItem = (data) => {

        if (changingItem) {
            setItems((prev) => prev.map(item => {
                if (item.id === changingItem.id) {
                    return {...item, ...data}
                }
                return item
            }));
        } else {
            setItems((prev) => {
                // localStorage.setItem("equipments",JSON.stringify(newItems))
                return [...prev, {...data, id: prev.length++}];
            });
        }

        setChangingItem(null)
        setActiveModal(false)
    };


    const onDeleteItem = (item) => {
        setChangingItem(item)
        setConfirmActive(true)
    }


    const onConfirmDelete = () => {
        setItems(prev => {
            const newItems = prev.filter(item => item.id !== changingItem.id)
            localStorage.setItem("equipments", JSON.stringify(newItems))
            return newItems

        })

        setConfirmActive(false)
        setChangingItem(null)

    }


    const onChangeItem = (item) => {
        setChangingItem(item)
        setActiveModal(true)
    }


    const {request} = useHttp()
    const navigate = useNavigate()
    const onSubmit = () => {


        const data = {
            title,
            room,
            class: clas,
            items: items

        }


        request(`${BackUrl}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                const alert = {
                    active : true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
            })


        navigate(-1)
    }


    return (
        <div className={cls.addEquipment}>

            <div className={cls.header}>
                <div>
                    <Input
                        onChange={setTitle}
                        value={title}
                        extraClassNameLabel={cls.title}
                        title={"Mavzu"}
                    />
                    <Select
                        optional
                        onChange={setRoom}
                        value={room}
                        extraClassNameLabel={cls.room}
                        title={"Xona"}
                    />
                    <Select
                        optional
                        value={clas}
                        onChange={setClas}
                        extraClassNameLabel={cls.class}
                        title={"Sinf"}
                    />
                </div>


                <Button onClick={() => setActiveModal(true)} type={"submit"}> <i className={"fa fa-plus"}></i> </Button>
            </div>


            <div className={cls.equipments}>
                {items.map((item, index) => (
                    <div className={cls.equipments__item}>
                        <div className={cls.btns}>
                            <div onClick={() => onChangeItem(item)} className={cls.edit}>
                                <i className={"fa fa-edit"}></i>
                            </div>
                            <div onClick={() => onDeleteItem(item)} className={cls.trash}>
                                <i className={"fa fa-trash"}></i>
                            </div>
                        </div>


                        <h2>Nomi: {item.title}</h2>
                        <h2>Soni: {item.count}</h2>
                        <p>{item.reason}</p>
                    </div>
                ))}
            </div>


            {
                items.length > 0 && (title || room || clas) ?
                    <div className={cls.footer}>
                        <Button type={"submit"} onClick={onSubmit}>Tasdiqlash</Button>
                    </div> : null
            }


            <Modal title={"Buyum qo'shish"} active={activeModal} setActive={setActiveModal}>
                <AddModal changingItem={changingItem} onSubmit={onAddItem}/>
            </Modal>

            <Confirm onSubmit={onConfirmDelete} setActive={setConfirmActive} active={confirmActive}>
                O'chrishni tasdiqlaysizmi
            </Confirm>
        </div>
    );
};


const AddModal = ({onSubmit, changingItem}) => {

    const {register, handleSubmit,reset, setValue, formState: {errors}} = useForm()


    useEffect(() => {
        if (changingItem && Object.keys(changingItem)?.length) {
            setValue("title", changingItem.title)
            setValue("count", changingItem.count)
            setValue("reason", changingItem.reason)
        }
    }, [changingItem])

    const submit = (data) => {
        // ensure number for count (RHF returns strings by default)
        const payload = { ...data, count: Number(data.count) };


        console.log(payload, "payload")
        reset({ title: "", count: "", reason: "" }); // clear after submit
        onSubmit(payload);
        // If you only want to clear when adding (not editing), do:
        // if (!changingItem) reset({ title: "", count: "", reason: "" });
    };

    return (
        <Form id={"add"} typeSubmit={"outside"} onSubmit={handleSubmit(submit)}>
            <Input required name={"title"} register={register} title={"Nomi"}/>
            <Input type={"number"} required name={"count"} register={register} title={"Soni"}/>
            <Textarea name={"reason"} register={register} title={"sabab"}/>

            <Button form={"add"} type={"submit"}>Tasdiqlash</Button>
        </Form>
    )
}

export default AddEquipment;