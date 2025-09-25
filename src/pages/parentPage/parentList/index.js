import React, {useEffect} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Table from "components/ui/table";
import Loader from "components/ui/loader/Loader";
import {fetchParentsList} from "slices/parentStudentSlice";

import cls from "./style.module.sass";

const Index = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {list, listStatus} = useSelector(state => state.parentStudentSlice)
    const {data} = useSelector(state => state.user)

    useEffect(() => {
        if (data?.location_id)
            dispatch(fetchParentsList({location: data?.location_id}))
    }, [data])

    const renderUsers = () => {

        return list?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td
                    onClick={() => navigate(`../info/${item.id}`)}
                >
                    {item?.name}
                </td>
                <td>{item?.surname}</td>
                <td>{item?.phone}</td>
                <td>{item?.address}</td>
                <td>{item?.date}</td>
                <td>{item?.location?.name}</td>
                {/*{!active && <td>*/}
                {/*    <i onClick={() => {*/}
                {/*        setActiveModal(true)*/}
                {/*        setActiveUser(item)*/}
                {/*    }} className={classNames(cls.delete, 'fa fa-trash')}/>*/}
                {/*</td>}*/}
            </tr>
        ))
    }

    return (
        <div>
            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Ismi</th>
                    <th>Familyasi</th>
                    <th>Telefon raqami</th>
                    <th>Manzil</th>
                    <th>Tug'ulgan kuni</th>
                    <th>Joylashuvi</th>
                    {/*<th/>*/}

                </tr>
                </thead>
                <tbody>
                {
                    listStatus === "loading"
                        ? <Loader/>
                        : renderUsers()
                }
                </tbody>

            </Table>
        </div>
    );
};

export default Index;