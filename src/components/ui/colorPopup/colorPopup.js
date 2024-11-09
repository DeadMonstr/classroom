import React from 'react';
import Popup from "components/ui/popup/Popup";


import cls from "./colorPopup.module.sass"
import {HexColorPicker, RgbaStringColorPicker} from "react-colorful";
import Input from "components/ui/form/input";



const ColorPopup = ({color = "#000000",setColor}) => {

    return (
        <Popup childrenType={"other"} trigger={<div style={{backgroundColor: color}} className={cls.colorButton}></div>}>
            <div className={cls.colorModal}>
                <RgbaStringColorPicker  color={color} onChange={setColor} />
                <Input value={color} onChange={setColor}/>
            </div>
        </Popup>
    );
};

export default ColorPopup;