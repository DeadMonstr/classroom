import React, { useEffect } from 'react';


import cls from "./teacherEquipments.module.sass"
import Table from "components/ui/table";
import Input from "components/ui/form/input";
import Button from "components/ui/button";
import {Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTeacherEquipmentsData, 
    createEquipment, 
    loadingEquipment, 
    deleteEquipment, 
    updateEquipment

} from "slices/teacherEquipment";
import Modal from "components/ui/modal";
import { useForm } from 'react-hook-form';
import Form from 'components/ui/form';
import { useHttp } from 'hooks/http.hook';
import { BackUrl, headers } from 'constants/global';
import { useState } from 'react';
import LoaderPage from 'components/ui/loader/Loader';
import Confirm from 'components/ui/confirm';
import Select from 'components/ui/form/select';

const statuses = [
    {id: "all", name: "Hammasi"},
    {id: "sent", name: "Yuborildi"},
    {id: "review", name: "Ko‘rib chiqilmoqda"},
    {id: "accepted", name: "Qabul qilindi"},
    {id: "canceled", name: "Bekor qilindi"}
]

const TeacherEquipments = () => {


    return (
        <Routes>

            <Route index path={"/"} element={<Index />}/>

        </Routes>
    )

};

const Index = () => {

    const {data} = useSelector(state  => state.user)
    const {list, fetchTeacherEquipmentsDataStatus} = useSelector(state  => state.teacherEquipmentSlice)
    
    const {request} = useHttp()
    const {register, handleSubmit,reset, setValue, formState: {errors}} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [activeModal, setActiveModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isDelete, setIsDelete] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("all")
    
    useEffect(() => {
        if (data?.turon_teacher_id || data?.platform_id) {
            dispatch(fetchTeacherEquipmentsData({
                id: data?.system_name === "turon" ? data?.turon_teacher_id : data?.platform_id,
                status: selectedStatus,
                system:data?.system_name
            }))
        }
    }, [data, selectedStatus])

    const onSubmit = (form) => {
        dispatch(loadingEquipment())

        const text = `${form.count} ta ${form.name}`
        
        let url = `teacher/requests?`
        let forPost = {
            text,
            price: form.price,
            address: form.address
        }

        if (data?.system_name === "turon") {
            url = `${url}turon_id=${data?.turon_teacher_id}`
            forPost = {
                ...forPost,
                teacher: data?.turon_teacher_id,
                branch: data?.turon_branch_id,
            }
        } else {
            url = `${url}teacher_id=${data?.id2}`
            forPost = {
                ...forPost,
                teacher_id: data?.platform_id,
                location_id: data?.platform_location,
            }
        }

        request(
            `${BackUrl}${url}`,
            "POST",
            JSON.stringify(forPost), 
            headers()
            )
            .then(res => {
                dispatch(createEquipment(res))
                setActiveModal(false)
                setValue("name", "")
                setValue("count", "")
                setValue("price", "")
                setValue("address", "")
            })
    }

    const onUpdate = (form) => {
        dispatch(loadingEquipment())

        const text = `${form.countEdit} ta ${form.nameEdit}`
        
        let url = `teacher/requests/${editItem?.id}?`
        let forPatch = {
            text,
            price: form.priceEdit,
            address: form.addressEdit
        }

        if (data?.system_name === "turon") {
            url = `${url}turon_id=${data?.turon_teacher_id}`
            forPatch = {
                ...forPatch,
                teacher: data?.turon_teacher_id,
                branch: data?.turon_branch_id,
            }
        } else {
            url = `${url}teacher_id=${data?.id2}`
            forPatch = {
                ...forPatch,
                teacher_id: data?.platform_id,
                location_id: data?.platform_location,
            }
        }

        request(`${BackUrl}${url}`, "PATCH", JSON.stringify(forPatch), headers())
            .then(res => {
                dispatch(updateEquipment(res))
                setEditModal(false)
                setEditItem(null)
            })
    }

    const onConfirmDelete = () => {
        dispatch(loadingEquipment())

        let url = `teacher/requests/${editItem?.id}?`
        if (data?.system_name === "turon") {
            url = `${url}turon_id=${data?.turon_teacher_id}`
        } else {
            url = `${url}teacher_id=${data?.id2}`
        }

        request(`${BackUrl}teacher/requests/${editItem?.id}${url}`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteEquipment(editItem?.id))
                setEditModal(false)
                setIsDelete(false)
                setEditItem(null)
            })
    }

    const render = () => {
        return list?.map((item, index) => {
            const sliceIndex = item?.text?.indexOf("ta")
            return (
                <tr>
                    <td>{index+1}</td>
                    <td>{item?.text?.slice(sliceIndex+3, item?.text?.length)}</td>
                    <td>{item?.text?.slice(0, sliceIndex)}</td>
                    <td>{item?.address}</td>
                    <td>{item?.price}</td>
                    <td>{item?.created_at}</td>
                    <td>{item?.updated_at}</td>
                    <td>{item?.comment ?? "—"}</td>
                    <td 
                        className={cls[item?.status]}
                    >
                        {statuses.filter(st => st.id === item.status)[0]?.name}
                    </td>
                    <td><i onClick={() => {
                        setEditModal(true)
                        setEditItem(item)
                        setValue("nameEdit", item?.text?.slice(sliceIndex+3, item?.text?.length))
                        setValue("countEdit", +item?.text?.slice(0, sliceIndex))
                        setValue("priceEdit", item?.price)
                        setValue("addressEdit", item?.address)
                    }} className={"fa fa-edit"}/></td>
                </tr>
            )
        })
    }


    return (
        <>
            <div className={cls.equipments}>
                <div className={cls.header}>
                    <div>
                        {/* <Input title={"Qidiruv"}/> */}
                        <Select
                            title={"Status"}
                            options={statuses}
                            onChange={setSelectedStatus} 
                            defaultOption={selectedStatus}
                        />
                    </div>


                    <Button onClick={() => setActiveModal(true)} type={"submit"}> <i className={"fa fa-plus"}></i></Button>
                </div>
                <div className={cls.container}>
                    {
                        fetchTeacherEquipmentsDataStatus === "loading"
                        ? <LoaderPage/>
                        : <Table>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Nomi</th>
                            <th>Soni</th>
                            <th>Addres</th>
                            <th>Narxi</th>
                            <th>Yaratilgan sana</th>
                            <th>Yangilangan sana</th>
                            <th>Komment</th>
                            <th>Status</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                            {render()}
                        </tbody>

                    </Table>
                    }
                </div>
            </div>
            <Modal title={"Buyum qo'shish"} active={activeModal} setActive={setActiveModal}>
                <Form extraClassname={cls.addChange} id={"add"} typeSubmit={"outside"} onSubmit={handleSubmit(onSubmit)}>
                    <Input required name={"name"} register={register} title={"Nomi"}/>
                    <Input type={"number"} required name={"count"} register={register} title={"Soni"}/>
                    <Input required name={"address"} register={register} title={"Addres"}/>
                    <Input type={"number"} required name={"price"} register={register} title={"Narxi"}/>
                    {/* <Textarea name={"reason"} register={register} title={"sabab"}/> */}

                    <Button form={"add"} type={"submit"}>Tasdiqlash</Button>
                </Form>
            </Modal>
            <Modal title={"Buyumni o'zgartirish"} active={editModal} setActive={setEditModal}>
                <Form extraClassname={cls.addChange} id={"edit"} typeSubmit={"outside"} onSubmit={handleSubmit(onUpdate)}>
                    <Input required name={"nameEdit"} register={register} title={"Nomi"}/>
                    <Input type={"number"} required name={"countEdit"} register={register} title={"Soni"}/>
                    <Input required name={"addressEdit"} register={register} title={"Addres"}/>
                    <Input type={"number"} required name={"priceEdit"} register={register} title={"Narxi"}/>
                    {/* <Textarea name={"reason"} register={register} title={"sabab"}/> */}

                    <div className={cls.addChange__inner}>
                        <Button form={"delete"} onClick={() => setIsDelete(true)} >O'chirish</Button>
                        <Button form={"edit"} type={"submit"}>Tasdiqlash</Button>
                    </div>
                </Form>
            </Modal>
            <Confirm 
                onSubmit={onConfirmDelete}
                setActive={() => {
                    setIsDelete(false)
                }} 
                active={isDelete}
            >
                O'chrishni tasdiqlaysizmi
            </Confirm>
        </>
    );
}

export default TeacherEquipments;