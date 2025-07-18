import React, {useEffect, useMemo, useState} from 'react';



import cls from "./timer.module.sass"
import Modal from "components/ui/modal";
import Select from "components/ui/form/select";
import {useTimer} from "react-timer-hook";

const secondsMinutes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

const Timer = ({type,onChange,value,onEnd}) => {

    const renderTimer = () => {

        switch (type) {
            case "create":
                return <Create onChange={onChange} value={value}/>
            case "view":
                return <View value={value} onEnd={onEnd}/>
            default:
                return <Create onChange={onChange} value={value}/>
        }
    }




    return renderTimer();
};


const Create = ({value = {hour:0,minute:0,second:0}, onChange }) => {


    const [activeModal,setActiveModal] = useState(false)

    const [hour,setHour] = useState(0)
    const [minute,setMinute] = useState(0)
    const [second,setSecond] = useState(0)

    useEffect(() =>{
        if (value.second || value.minute || value.hour) {
            setHour(value.hour || 0)
            setMinute(value.minute || 0)
            setSecond(value.second || 0)
        }
    },[value])


    useEffect(() => {
        if (hour || minute || second) {
            onChange({hour,minute,second})
        }
    },[hour,minute,second])


    return (
        <div className={cls.createtimer}>

            <div className={cls.box} onClick={(() => setActiveModal(true))}>
                {hour}:{minute}:{second}
            </div>



            <Modal title={"Vaqt kiriting"} active={activeModal} setActive={setActiveModal}>
                <div className={cls.selects}>
                    <Select
                        title={"Hour"}
                        onChange={setHour}
                        value={hour}
                        options={hours}
                    />
                    <Select
                        title={"Minute"}
                        onChange={setMinute}
                        value={minute}
                        options={secondsMinutes}
                    />
                    <Select
                        title={"Second"}
                        onChange={setSecond}
                        value={second}
                        options={secondsMinutes}
                    />
                </div>
            </Modal>
        </div>
    );
};


const View = ({value,onEnd}) => {

    const time = useMemo(() => getFutureTimeFromNow({ ...value }), [value]);


    const {
        seconds,
        minutes,
        hours,
    } = useTimer({ expiryTimestamp: time, interval: 20 , onExpire:onEnd  });





    return (
        <div className={cls.viewtimer}>
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
    );
};


function getFutureTimeFromNow({ hour = 0, minute = 0, second = 0 }) {
    const totalSeconds = hour * 3600 + minute * 60 + second;
    const now = new Date();
    now.setSeconds(now.getSeconds() + totalSeconds);
    return now;
}

export default Timer;