import React, {useCallback, useEffect, useMemo, useState} from 'react';


import cls from "./bookPurchases.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import Table from "components/ui/table";
import Checkbox from "components/ui/form/checkbox";
import Pagination from "components/ui/pagination";
import {useDispatch, useSelector} from "react-redux";
import Back from "components/ui/back";
import {fetchPurchasedBooks} from "slices/booksSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Modal from "components/ui/modal";

const BookPurchases = () => {

    const [search,setSearch] = useState("")
    const [typePage,setTypePage] = useState("teacher")
    const [groups,setGroups] = useState([])
    const [selectedGroup,setSelectedGroup] = useState()
    const [activeFilter,setActiveFilter] = useState(false)

    const {purchased} = useSelector(state => state.books)


    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 50, [])




    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}get_groups`,"GET",null,headers())
            .then(res => {
                setGroups(res)
            })
    },[])


    const multiPropsFilter = useMemo(() => {
        if (typePage === "student") {
            return purchased.filter(item => {
                if (!selectedGroup || selectedGroup === "all") return item
                if (item.group.id === +selectedGroup) return item
            });
        }
        return purchased

    },[purchased,selectedGroup]) ;


    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter.slice()
        setCurrentPage(1)
        if (typePage === "teacher") {
            return filteredHeroes.filter(item =>
                item.book.name.toLowerCase().includes(search.toLowerCase())
            )
        }
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.book.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [multiPropsFilter, search])





    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);


    const types = [
        {
            name: "Mening haridlarim",
            value: "teacher"
        },
        {
            name: "Guruh haridlari",
            value: "student"
        }
    ]

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPurchasedBooks(typePage))
    },[dispatch,typePage])



    const renderData = useCallback(() => {
        return currentTableData.map((item,index) => {
            if (typePage === "teacher") {
                return (
                    <tr>
                        <td>{index+1}</td>
                        <td>{item.book.name}</td>
                        <td>{item.book.price}</td>
                        <td>{item.date}</td>
                        <td>
                            <Checkbox cls={[cls.checkbox]} checked={item.paid} disabled/>
                        </td>
                    </tr>
                )
            }
            return (
                <tr>
                    <td>{index+1}</td>
                    <td>{item.name}</td>
                    <td>{item.surname}</td>
                    <td>{item.book.name}</td>
                    <td>{item.book.price}</td>
                    <td>{item.group.name}</td>
                    <td>{item.date}</td>
                    <td><Checkbox cls={[cls.checkbox]} checked={item.paid} disabled/></td>
                </tr>
            )
        })
    },[currentTableData])



    return (
        <div className={cls.bookPurchases}>

            <div className={cls.header}>

                <Back className={cls.back}/>


                <h1>Mening haridlarim</h1>
            </div>


            {
                isMobile ?
                    <div className={cls.header}>

                        <Select value={typePage} options={types} onChange={setTypePage}  title={"Turi"}/>

                        <FontAwesomeIcon onClick={() => setActiveFilter(true)} icon={faMagnifyingGlass} className={cls.filterIcon} />
                    </div>
                    :
                    <>
                        <div className={cls.header}>

                            <Select value={typePage} options={types} onChange={setTypePage}  title={"Turi"}/>

                        </div>



                        <div className={cls.header}>
                            <div>
                                <Input onChange={setSearch} value={search} title={"Qidiruv"}/>
                                {
                                    typePage === "student"
                                    &&
                                    <Select
                                        all={true}
                                        value={selectedGroup}
                                        onChange={setSelectedGroup}
                                        options={groups}
                                        title={'Guruhlar'}
                                    />
                                }

                            </div>
                        </div>
                    </>
            }




            <div className={cls.wrapper}>

                <Table>
                    <thead>
                    <tr>
                        <th>№</th>
                        {typePage === "student" && <th>Ism</th>}
                        {typePage === "student" && <th>Familya</th>}
                        <th>Kitob nomi</th>
                        <th>Narxi</th>
                        {typePage === "student" && <th>Guruh</th>}
                        <th>Sana</th>
                        <th>To'langan</th>

                    </tr>
                    </thead>
                    <tbody>
                    {renderData()}
                    </tbody>

                </Table>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedUsers.length}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                />
            </div>


            <Modal title={"Qidiruv va Filterlar"} active={activeFilter} setActive={() => setActiveFilter(false)}>
                <Input onChange={setSearch} value={search} title={"Qidiruv"}/>
                <br/>
                {
                    typePage === "student"
                    &&
                    <Select
                        all={true}
                        value={selectedGroup}
                        onChange={setSelectedGroup}
                        options={groups}
                        title={'Guruhlar'}
                    />
                }
            </Modal>
        </div>
    );
};

export default BookPurchases;