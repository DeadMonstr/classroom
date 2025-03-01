import React from 'react';

const RenderPageWithType = ({gennis,turon}) => {



    const type = localStorage.getItem("system_type")


    if (type === "gennis") {
        return gennis
    }
    return turon
};

export default RenderPageWithType;