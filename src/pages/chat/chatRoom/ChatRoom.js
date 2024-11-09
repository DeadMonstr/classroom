import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {useDropzone} from "react-dropzone";
import {useParams} from "react-router";

import Loader from "components/ui/loader/Loader";
import {
    fetchMessagesData,
    sendingMessage,
    gotSendMessage
} from "slices/chatSlice";
import {socket} from "socket/socket";

import cls from "./style.module.sass";
import defaultUserImage from "assets/user.png";
import sendFile from "assets/icons/skripka.png";

const ChatRoom = ({contact, setPrevContact, prevContact}) => {

    const dispatch = useDispatch()
    const {contactId} = useParams()
    const {data} = useSelector(state => state.user)


    useEffect(() => {
        if (prevContact !== 0) {
            socket.emit("leave", prevContact)
        }
        dispatch(fetchMessagesData({userId: data.id, chatId: contactId}))
        socket.emit("join", {type: "chat", chat_id: +contactId})
        setPrevContact(+contactId)


    }, [contactId])



    socket.on("message", (args) => {
        console.log(args)
    })

    socket.onAny((eventName, ...args) => {
        console.log(eventName, args)
        if (eventName === "join") {

        }
        // console.log(eventName, "eventName")
        // console.log(args, "args")
    })




    const {
        messages,
        fetchMessagesStatus
    } = useSelector(state => state.chat)

    const [message, setMessage] = useState("")
    const {getInputProps, getRootProps} = useDropzone({})

    const onSendMessage = () => {
        if (message) {
            dispatch(sendingMessage())
            socket.emit("message",
                {
                    user_id: data.id,
                    msg: message,
                    chat_id: contactId,
                    type: "chat"
                }
            )
            setMessage("")
        }
    }

    return (
        <div className={cls.content}>
            <div className={cls.content__header}>
                <div className={cls.info}>
                    <img
                        className={cls.info__image}
                        src={contact?.img ? contact.img : defaultUserImage}
                        alt=""
                    />
                    <div className={cls.info__text}>
                        <h2 className={cls.info__userName}>{contact.username}</h2>
                        <div className={cls.status}>
                            <div className={cls.status__color}/>
                            <p className={cls.status__text}>online</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cls.content__main}>
                <Message
                    arr={messages}
                    arrStatus={fetchMessagesStatus}
                    userId={data.id}
                    contact={contact}
                />
            </div>
            <div className={cls.content__footer}>
                <div className={cls.sendMessage}>
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className={cls.sendMessage__input}
                        placeholder="Message"
                        type="text"
                    />
                    <div {...getRootProps()}>
                        <img className={cls.sendMessage__btnFile} src={sendFile} alt=""/>
                        <input {...getInputProps()} type="file"/>
                    </div>
                    <div
                        onClick={onSendMessage}
                        className={cls.sendMessage__btn}
                    >
                        <i className="far fa-paper-plane"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Message = ({arr, arrStatus, userId, contact}) => {

    if (arrStatus === "idle" || arrStatus === "loading") {
        return <Loader/>
    }
    return arr.map(item => {
        return (
            <div className={cls.dayMessage}>
                <h2>{item.day}</h2>
                {
                    item.messages.map(message => {
                        return (
                            <div
                                className={classNames(cls.message, {
                                    [cls.otherMessage]: message.user.id !== userId
                                })}
                            >
                                <div
                                    className={classNames(cls.message__text, {
                                        [cls.otherMessage]: message.user.id !== userId
                                    })}
                                >
                                    {message.text}
                                    <span className={cls.message__time}>{message.time}</span>
                                </div>
                                <img
                                    className={cls.message__author}
                                    src={contact.img ? contact.img : defaultUserImage}
                                    alt=""
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    })
}

export default ChatRoom;