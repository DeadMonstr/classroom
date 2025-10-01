import React from 'react';


import cls from "./teacherEquipments.module.sass"
import Table from "components/ui/table";
import Input from "components/ui/form/input";
import Button from "components/ui/button";
import {Route, Routes} from "react-router-dom";
import AddEquipment from "pages/teacherEquipments/addEquipment/AddEquipment";
import {useNavigate} from "react-router";

const TeacherEquipments = () => {


    return (
        <Routes>

            <Route index path={"/"} element={<Index />}/>
            <Route path={"add"} element={<AddEquipment/>} />
            <Route path={":id"} element={<AddEquipment/>} />

        </Routes>
    )

};

const Index = () => {

    const navigate = useNavigate()
    const onClickAdd = () => {
        navigate("add")
    }


    return (
        <div className={cls.equipments}>
            <div className={cls.header}>
                <div>
                    <Input title={"Qidiruv"}/>
                </div>


                <Button onClick={onClickAdd} type={"submit"}> <i className={"fa fa-plus"}></i></Button>
            </div>
            <div className={cls.container}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Nomi</th>
                        <th>Soni</th>
                        <th>Xona</th>
                        <th>Sinf</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                </Table>
            </div>
        </div>
    );
}

export default TeacherEquipments;