import React, {useCallback, useEffect, useMemo, useState} from 'react';


import cls from "./book.module.sass"
import Input from "components/ui/form/input";
import {useDispatch, useSelector} from "react-redux";


import backImg from "assets/back-school-witch-school-supplies.jpg"
import {Link, Route, Routes} from "react-router-dom";
import BookProfile from "pages/books/bookProfile/bookProfile";
import {useHttp} from "hooks/http.hook";
import {fetchBooksData} from "slices/booksSlice";
import Pagination from "components/ui/pagination";
import {PlatformUrl} from "constants/global";
import Button from "components/ui/button";
import BookPurchases from "pages/books/bookPurchases/BookPurchases";


const Books = () => {


    return (
        <Routes>

            <Route index path={"/"} element={<Index/>}/>
            <Route index path={":id"} element={<BookProfile/>}/>
            <Route index path={"bookPurchases"} element={<BookPurchases/>}/>

        </Routes>
    )
};


const Index = () => {

    const {books} = useSelector(state => state.books)

    const [fetched, setFetched] = useState(false)


    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 20, [])


    const {request} = useHttp()

    const dispatch = useDispatch()


    useEffect(() => {
        if (books.length === 0 && !fetched) {
            dispatch(fetchBooksData())
            setFetched(true)
        }
    }, [books])


    const [search, setSearch] = useState("")


    const searchedUsers = useMemo(() => {
        const filteredHeroes = books.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    }, [books, search])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);


    return (
        <div className={cls.books}>

            <div className={cls.header}>
                <h1>Kitoblar</h1>

                <Link to={"bookPurchases"}>
                    <Button type={"submit"}>Mening haridlarim</Button>
                </Link>
            </div>


            <div className={cls.header}>

                <Input title={"Qidiruv"} value={search} onChange={setSearch}/>


            </div>


            <div className={cls.wrapper}>

                {
                    currentTableData.map((item, index) => {
                        return (
                            <Link key={index} to={`${item.id}`} className={cls.book}>
                                <img src={`${PlatformUrl}${item.images[0]?.img}`} alt=""/>
                                <div className={cls.info}>
                                    <h3>{item.name}</h3>
                                    <h2>{item.price.toLocaleString()}</h2>
                                </div>
                            </Link>
                        )
                    })
                }

            </div>

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
    );
}

export default Books;