import React from 'react';

import cls from "./updaterFile.module.sass"

const UpdaterFile = ({ onDelete,onChange, title, isVideo, img }) => {





    return (
        <div className={cls.update}>
            <div className={cls.btn} onClick={onChange}>
                <img src={img} alt="defaultimg"/>

                <h1>{title ? title : isVideo ? "Update video" : "Update img"}</h1>
            </div>

            <div className={cls.trash} onClick={onDelete}>
                <i className="fa-solid fa-trash"></i>
            </div>

        </div>
    );
};

export default UpdaterFile;