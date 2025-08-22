import React, {useCallback, useEffect, useMemo, useState} from 'react';

import styles from "./style.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import {Link, useNavigate} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Table from "components/ui/table";
import Confirm from "components/ui/confirm";
import {setAlertOptions} from "slices/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchExercisesData,
    fetchExercisesTypeData,
    onDeleteExc,
    setSearch,
    setTypes
} from "slices/exercisesSlice";
import {fetchSubjectLevelsData} from "slices/subjectSlice";
import {fetchSubjectsData} from "slices/subjectsSlice";
import Pagination from "components/ui/pagination";
import useDebounce from "hooks/useDebounce";
import Modal from "components/ui/modal";
import Button from "components/ui/button";
import Loader from "components/ui/loader/Loader";


const Exercises = () => {


    const [confirm, setConfirm] = useState(false)
    const [willDeleteId, setWillDeleteId] = useState(null)


    const {subjects} = useSelector(state => state.subjects)
    const {excs, types, type, subject, level, search,fetchExercisesStatus,totalCount} = useSelector(state => state.exercises)
    const {levels} = useSelector(state => state.subject)





    // const [data,setData] = useState([])
    const [addActiveModal,setAddActiveModal] = useState(false)

    const {request} = useHttp()


    useEffect(() => {
        dispatch(fetchExercisesTypeData())
        dispatch(fetchSubjectsData())
    }, [])


    console.log(subject , "subject")
    useEffect(() => {
        if (subject && subject !== "all") {



            dispatch(fetchSubjectLevelsData({id:subject}))
        }
    }, [subject])


    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])

    useDebounce(() => {
        if (!subject && !type && !level) return;

        const data = {
            search,
            subject:subject,
            type:type,
            level:level,
            page:currentPage,
            per_page: PageSize
        }

        dispatch(fetchExercisesData({data}))
    }, 0.5,[search, level,type,subject,currentPage,PageSize])


    // const multiPropsFilter = useMemo(() => {
    //
    //     const filters = {
    //         subject: selectedSubject,
    //         type: selectedType,
    //         level: selectedLevel,
    //     }
    //     const filterKeys = Object.keys(filters)
    //
    //
    //     return excs.filter(exc => {
    //         return filterKeys.every(item => {
    //             if (filters[item] === "all" || !filters[item]) return true
    //
    //             return exc[item].id === +filters[item]
    //         })
    //     });
    // }, [selectedType, excs, selectedSubject, selectedLevel])
    //
    //
    // const searchedUsers = useMemo(() => {
    //     const filteredHeroes = multiPropsFilter.slice()
    //     return filteredHeroes.filter(item =>
    //         item.name?.toLowerCase().includes(search?.toLowerCase())
    //     )
    // }, [multiPropsFilter, search])

    const onDelete = (id) => {
        setConfirm(true)
        setWillDeleteId(id)
    }

    const dispatch = useDispatch()

    const onConfirmDelete = () => {
        request(`${BackUrl}exercise/crud/${willDeleteId}/`, "DELETE", null, headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))
                dispatch(onDeleteExc(willDeleteId))
                setConfirm(false)
            })
    }

    const onChangeTypes = (status, data) => {

        const typesData = {
            type,
            subject,
            level
        }


        if (typesData[status] !== data) {
            console.log(type, status,data)
            dispatch(setTypes({status, data}))

            // const localItem = localStorage.getItem()

        }

    }


    const onSetSearch = (e) => {
        dispatch(setSearch(e))
    }


    const navigate = useNavigate()

    const onCreateExc = async () => {
        setAddActiveModal(true)
    }



    return (
        <div className={styles.exercises}>
            <h1 className={styles.mainTitle}>Mashqlar:</h1>
            <div className={styles.header}>
                <div>
                    <Input title={"Qidiruv"} type={"text"} onChange={onSetSearch}/>
                    <Select
                        all={true}
                        defaultOption={type}
                        value={type}
                        options={types}
                        title={"Mashq turi"}
                        onChange={e => onChangeTypes("type", e)}
                    />
                    {subjects.length > 0 ? <Select
                        onChange={e => onChangeTypes("subject", e)}
                        title={"Fan"}
                        name={"subject"}
                        options={subjects}
                        value={subject}
                        all={true}
                    /> : null}

                    {levels.length > 0 ? <Select
                        onChange={e => onChangeTypes("level", e)}
                        title={"Mashq darajasi"}
                        name={"level-exc"}
                        options={levels}
                        value={level}
                        all={true}
                    /> : null}
                </div>
                <div>
                    <Link to={"/createExercisesTypes"} className={styles.btn}>
                        Mashq turi qo'shish
                    </Link>
                    <div onClick={onCreateExc} className={styles.btn}>
                        Mashq qo'shish
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                {
                    fetchExercisesStatus === "loading" ? <Loader/> :  <ExcTable onDelete={onDelete} data={excs}/>
                }

                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}

                />
            </div>


            <Modal active={addActiveModal} setActive={setAddActiveModal}>
                <AddModal levels={levels} subjects={subjects} types={types}/>
            </Modal>

            <Confirm active={confirm} setActive={() => setConfirm(false)} onSubmit={onConfirmDelete}>
                O'chirishni hohlaysizmi
            </Confirm>
        </div>
    );
};


const ExcTable = ({data, onDelete}) => {

    const renderData = useCallback(() => {
        return data.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.type.name}</td>
                    <td>{item.subject.name}</td>
                    <td>{item.level.name}</td>
                    <td className={styles.icon}>
                        <Link to={`/createExercises/${item.id}`}>
                            <i className="fa-solid fa-pen-to-square"/>
                        </Link>
                        <i onClick={() => onDelete(item.id)} style={{color: "red"}} className="fa-solid fa-trash"/>
                    </td>
                </tr>
            )
        })
    }, [data])


    return (
        <>
            <Table>
                <thead>
                <tr>
                    <th>N/o</th>
                    <th>Nomi</th>
                    <th>Turi</th>
                    <th>Fan</th>
                    <th>Darajasi</th>

                    <th></th>
                </tr>
                </thead>
                <tbody>
                {renderData()}
                </tbody>
            </Table>


        </>

    )
}


const AddModal = ({types, subjects}) => {

    const [selectedType, setSelectedType] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [name,setName] = useState("unnamed")



    const [levels, setLevels] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {request} = useHttp()


    console.log(selectedSubject ,"selectedSubject")
    useEffect(() => {
        if (selectedSubject && selectedSubject !== "all" ) {
            request(`${BackUrl}level/info/${selectedSubject}/`,"GET",null,headers())
                .then(res => {
                    setLevels(res.data)
                })
        }
    }, [selectedSubject])





    const onSubmit = async () => {


        const data = {
            name,
            type: selectedType,
            subject: selectedSubject,
            level: selectedLevel
        }


        const exc = await request(`${BackUrl}exercise/crud/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: res.status
                }
                dispatch(setAlertOptions({alert}))


                return res
            })



        await navigate(`/createExercises/${exc.data.id}`)
    }




    return (
        <div className={styles.addModal}>
            <Input
                value={name}
                onChange={setName}
                title={"Mashq nomi"}
            />
            <Select
                onChange={setSelectedType}
                title={"Mashq turi"}
                options={types}
                value={selectedType}
                // all={true}
            />
            <Select
                onChange={setSelectedSubject}
                title={"Fan"}
                name={"subject"}
                options={subjects}
                value={selectedSubject}
                // all={true}
            />
            <Select
                disabled={!selectedSubject}
                onChange={setSelectedLevel}
                title={"Mashq darajasi"}
                name={"level-exc"}
                options={levels}
                value={selectedLevel}
                // all={true}
            />

            <Button type={"submit"} onClick={onSubmit}>Tasdiqlash</Button>

        </div>
    )
}

export default Exercises;
