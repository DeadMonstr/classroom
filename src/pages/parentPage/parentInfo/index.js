import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";

import {fetchParentData} from "slices/parentSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";

import cls from "./style.module.sass";
import Table from "../../../components/ui/table";
import Button from "../../../components/ui/button";
import Confirm from "../../../components/ui/confirm";

const Index = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {id} = useParams()

    const {fullName, parent, parentId} = useSelector(state => state.parentSlice)
    const {data} = useSelector(state => state.user)

    const [parentStudents, setParentStudents] = useState([])
    const [students, setStudents] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isDelete, setIsDelete] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchParentData(id))
        }
    }, [id])

    useEffect(() => {
        if (parentId && data?.id2) {
            request(`${BackUrl}parent/students/by-teacher/${data?.id2}/${parentId}`, "GET", null, headers())
                .then(res => {
                    setStudents(res)
                })
        }
    }, [data, parentId])

    useEffect(() => {
        if (!!parent?.length) {
            setParentStudents(parent)
        }
    }, [parent])

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedItems, id];
            setSelectedItems(newSelected);
            if (newSelected.length === students.length) {
                setSelectAll(true);
            }
        }
    };

    const onHandleSubmit = async () => {
        const body = {
            student_ids: selectedItems
        };

        return await request(`${BackUrl}parent/add_students/${parentId}`, "POST", JSON.stringify(body), headers())
            .then(res => {
                setStudents(prevState => prevState.filter(item => !selectedItems.includes(item.student)))
                setSelectedItems([]);
                setSelectAll(false);
            })


    };

    const onDelete = () => {
        request(`${BackUrl}parent/remove_students/${parentId}`, "POST", JSON.stringify({student_id: isDelete}), headers())
            .then(res => {
                setParentStudents(prevState => prevState.filter(item => item.id !== isDelete))
                request(`${BackUrl}parent/students/by-teacher/${data?.id2}/${parentId}`, "GET", null, headers())
                    .then(res => {
                        setStudents(res)
                    })
                setIsDelete(false)
            })
    }

    const renderTable = () => {
        return students.map((item, index) => (
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name} {item.surname}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.student)}
                        onChange={() => handleSelectItem(item.student)}
                    />
                </td>
            </tr>
        ))
    }

    return (
        <div className={cls.info}>
            <div className={cls.info__parent}>
                <h1>{fullName}</h1>
            </div>
            <div className={cls.info__students}>
                <div className={cls.children}>
                    <h2 className={cls.children__title}>Farzandlari</h2>
                    {
                        !!parentStudents.length
                            ? <Table>
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Ism Familiya</th>
                                    <th>Balans</th>
                                    <th>Fan</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    parentStudents.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name} {item.surname}</td>
                                            <td>{item.balance}</td>
                                            <td>{item.subjects?.join("/")}</td>
                                            <td>
                                                <i
                                                    className="fas fa-times"
                                                    onClick={() => setIsDelete(item?.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            : <div className={cls.children__container}/>
                    }

                </div>
                <div className={cls.students}>
                    <h2 className={cls.children__title}>O'quvchilar</h2>
                    {
                        !!students?.length
                            ? <>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Ism Familiya</th>
                                        <th>Yosh</th>
                                        <th>Telefon raqam</th>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {renderTable()}
                                    </tbody>
                                </Table>
                                <Button extraClass={cls.students__btn} onClick={onHandleSubmit}>Qo'shmoq</Button>
                            </>
                            : <div className={cls.students__container}/>
                    }
                </div>
            </div>
            <Confirm active={isDelete} setActive={() => setIsDelete(false)} onSubmit={onDelete}
                     children={"Bu farzandni o'chirmoqchimisz ?"}/>
        </div>
    );
};

export default Index;