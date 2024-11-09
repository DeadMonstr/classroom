import React, {useState} from 'react';

import cls from "./viewTestTuron.module.sass"
import Input from "components/ui/form/input";
import Select from "components/ui/form/select";
import Button from "components/ui/button";


import TuronLogo from "assets/logo/Turon logo.svg"
import classNames from "classnames";


const ViewTestTuron = () => {

    const [active, setActive] = useState(false)


    return (
        <div className={cls.viewTest}>
            <StartInfo active={active} setActive={setActive}/>
            <Test active={active} setActive={setActive}/>

        </div>
    );
};

const StartInfo = ({active,setActive}) => {
    return (
        <div
            className={classNames(cls.startInfo, {
                [cls.active]: active
            })}
        >
            <img src={TuronLogo} alt=""/>

            <form action="">
                <Input title={"Ism"}/>
                <Input title={"Familya"}/>
                <Input title={"Otasining ismi"}/>
                <Input title={"Yoshi"}/>

                <Select title={"Sinf"}/>
                <Select title={"Til"}/>

                <Button onClick={() => setActive(true)} style={{backgroundColor: '#001B61', borderColor: '#001B61'}}
                        type={"submit"}>Tasdiqlash</Button>
            </form>
        </div>
    )
}



const Test = ({active}) => {
    return (
        <div
            className={classNames(cls.test, {
                [cls.active]: active
            })}
        >
            <h1>Turon</h1>
        </div>
    )
}


export default ViewTestTuron;