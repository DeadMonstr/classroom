import React, {useEffect, useState} from 'react';


import cls from "./OnlineLesson.module.sass"
import {socket} from "helpers/socket";
import form from "components/ui/form";



const OnlineLesson = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onFooEvent(value) {
            alert(value.msg)
            // setFooEvents(previous => [...previous, value]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('message', onFooEvent);


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('message', onFooEvent);
        };
    }, []);



    return (
        <div className="App">
            <ConnectionState isConnected={ isConnected } />
            <Events events={ fooEvents } />
            <ConnectionManager />
            <MyForm />
        </div>
    );
};

function ConnectionState({ isConnected }) {
    return <p>State: { '' + isConnected }</p>;
}


function Events({ events }) {
    return (
        <ul>
            {
                events.map((event, index) =>
                    <li key={ index }>{ event }</li>
                )
            }
        </ul>
    );
}

function ConnectionManager() {
    function connect() {
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <button onClick={ connect }>Connect</button>
            <button onClick={ disconnect }>Disconnect</button>
        </>
    );
}

function MyForm() {
    const [value, setValue] = useState('');
    const [room, setRoom] = useState('');

    function onSubmit(event) {
        event.preventDefault();

        const data = {
            msg: value,
            chat_id: room
        }

        socket.emit('message', data);
    }

    function onSubmitRoom(event) {
        event.preventDefault();

        const data = {
            chat_id: room
        }

        socket.emit('join', data);
    }





    return (
        <>

            <form  onSubmit={ onSubmitRoom }>


                <input onChange={ e => setRoom(e.target.value) } value={room} placeholder={"room"} />

                <button type="submit" >Submit Room</button>

            </form>

            <br/>
            <br/>

            <form onSubmit={ onSubmit }>
                <input  onChange={ e => setValue(e.target.value) } />
                <button type="submit" >Submit</button>
            </form>



        </>

    );
}

export default OnlineLesson;