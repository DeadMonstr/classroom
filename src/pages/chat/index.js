import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Outlet, Route, Routes} from "react-router-dom";
import {useNavigate} from "react-router";
import classNames from "classnames";

import {fetchContactsData} from "slices/chatSlice";
import Loader from "components/ui/loader/Loader";
import {socket} from "socket/socket";

import cls from "./style.module.sass"
import defaultUserImage from "assets/user.png"
import sendFile from "assets/icons/skripka.png"

const ChatRoom = React.lazy(()=>import('pages/chat/chatRoom/ChatRoom'))


const Chat = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {data} = useSelector(state => state.user)

    useEffect(() => {
        dispatch(fetchContactsData(data.id))
        socket.disconnect()
        socket.connect()
    }, [])

    const {
        contacts,
        messages,
        fetchContactsStatus,
        fetchMessagesStatus
    } = useSelector(state => state.chat)

    const [contact, setContact] = useState({})
    const [prevContact, setPrevContact] = useState(0)

    const onSearch = (value) => {
        console.log(value)
    }

    return (
        <div className={cls.main}>
            <div className={cls.main__inner}>
                <div className={cls.menu}>
                    <div className={cls.menu__header}>
                        <h1>Chats</h1>
                        <div className={cls.search}>
                            <input
                                className={cls.search__input}
                                placeholder="Search"
                                type="text"
                            />
                            <i
                                className={classNames("fas fa-search", cls.search__icon)}
                            />
                        </div>
                    </div>
                    <div className={cls.menu__content}>
                        <Contacts
                            arr={contacts}
                            arrStatus={fetchContactsStatus}
                            setContact={setContact}
                        />
                    </div>
                </div>
                <Outlet/>
                <Routes>
                    <Route
                        path="contact/:contactId/*"
                        element={
                        <ChatRoom
                            contact={contact}
                            setPrevContact={setPrevContact}
                            prevContact={prevContact}
                        />
                    }
                    />
                </Routes>
            </div>
        </div>
    );
};

const Contacts = ({arr, arrStatus, setContact}) => {

    const navigate = useNavigate()

    if (arrStatus === "idle" || arr === "loading") {
        return <Loader/>
    }
    return arr.map(item => {
        return (
            <div
                onClick={() => {
                    setContact(item)
                    navigate(`contact/${item.id}`)
                }}
                className={cls.contact}
            >
                <img
                    className={cls.contact__image}
                    src={item?.img ? item.img : defaultUserImage}
                    alt=""
                />
                <div className={cls.contact__status}/>
                <div className={cls.contact__info}>
                    {/*<h3>{item.name} {item.surname}</h3>*/}
                    <h3>{item.username}</h3>
                    <p>{item?.last_msg}</p>
                </div>
            </div>
        )
    })
}

export default Chat;