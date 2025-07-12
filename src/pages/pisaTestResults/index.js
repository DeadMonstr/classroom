import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import Table from "components/ui/table";
import Select from "components/ui/form/select";
import {fetchPisaTestResultsData} from "slices/pisaTestResults";
import {useHttp} from "hooks/http.hook";
import {headers, BackUrl} from "constants/global";

import cls from "./pisaTestResults.module.sass";

export const PisaTestResults = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {data} = useSelector(state => state.pisaTestResults)

    const [branchData,BranchData ] = useState([])
    const [pisaTestsData,setPisaTestsData ] = useState([])
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedPisaId, setSelectedPisaId] = useState("all")

    useEffect(() => {
        dispatch(fetchPisaTestResultsData({pisa_test_id: selectedPisaId, location_id: selectedLocation}))
    } , [selectedLocation, selectedPisaId])

    useEffect(() => {
        request(`${BackUrl}pisa/student/get/list`,"GET",null,headers())
            .then(res => {
                setPisaTestsData(res)
            })
    },[])

    useEffect(() => {
        request(`${BackUrl}pisa/student/register`, "GET", null, headers())
            .then(res => {
                BranchData(res)
            })


    }, [])

    const render = () => {
        return data.map((item, index) => (
            <tr>
                <td>{1+index}</td>
                <td>{item?.name}</td>
                <td>{item?.surname}</td>
                <td>{item?.total_questions}</td>
                <td>{item?.true_answers}</td>
                <td>{item?.result}%</td>
            </tr>
        ))
    }

    return (
        <div className={cls.results}>
            <div className={cls.results__header}>
                <Select
                    options={[...branchData, {name: "Hammasi", id:"all"}]}
                    title={"Branch"}
                    onChange={setSelectedLocation}
                    value={selectedLocation}
                />
                <Select
                    options={[...pisaTestsData, {name: "Hammasi", id:"all"}]}
                    title={"Block Test"}
                    onChange={setSelectedPisaId}
                    value={selectedPisaId}
                />
            </div>
            <div className={cls.results__contant}>
                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ism</th>
                        <th>Familiya</th>
                        <th>Savollar Soni</th>
                        <th>To'gri javoblar soni</th>
                        <th>Foiz</th>
                    </tr>
                    </thead>
                    <tbody>
                    {render()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
