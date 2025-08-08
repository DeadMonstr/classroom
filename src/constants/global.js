import {useMemo} from "react";


//
// export const BackUrlForDoc = "http://26.253.30.50:5001/"
export const BackUrlForDoc = "https://classroom.gennis.uz/"
export const BackUrl = `${BackUrlForDoc}api/`
export const LogoutUrl = "/login"
export const LogoutUrlPisa = "/loginPisa"
export const PlatformUrl = "https://classroom.gennis.uz/"
// export const PlatformUrl = "http://26.12.122.72:5000/"
export const PlatformUrlApi = `${PlatformUrl}api/`



// export const BackUrl = "/api/"
// export const BackUrlForDoc = "/"
// export const PlatformUrl = "https://www.admin.gennis.uz/"
//
// export const LogoutUrl = "/login"
//
// export const LogoutUrlPisa = "/loginPisa"
// export const PlatformUrlApi = `${PlatformUrl}api/`






export const headers = () => {
    const token = sessionStorage.getItem("token")
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization" : "Bearer " + token
    }
}



export const headersOldToken = () => {
    const token = sessionStorage.getItem("oldToken")
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization" : "Bearer " + token,
    }
}

export const headersImg = () => {
    const token = sessionStorage.getItem("token")
    return {
        "Authorization" : "Bearer " + token,
        // 'Content-Type': 'multipart/form-data'
    }
}
export const headersOldTokenImg = () => {
    const token = sessionStorage.getItem("oldToken")
    return {
        "Authorization" : "Bearer " + token,
    }
}



export const ROLES = {
    Student: "a43c33b82",
    StudentTest: "a52v23q13",
    Teacher: "b00c11a31",
    Methodist: "d32q69n53",
    Parent: "pa21s122s"
}




export const DatesList = () => {
    const years = useMemo(() =>
        [
            {
                num: "2023"
            },
            {
                num: "2022"
            },
            {
                num: "2021"
            },
            {
                num: "2020"
            },
            {
                num: "2019"
            },
            {
                num: "2018"
            },
            {
                num: "2017"
            },
            {
                num: "2016"
            },
            {
                num: "2015"
            },
            {
                num: "2014"
            },
            {
                num: "2013"
            },
            {
                num: "2012"
            },
            {
                num: "2011"
            },
            {
                num: "2010"
            },
            {
                num: "2009"
            },
            {
                num: "2008"
            },
            {
                num: "2009"
            },
            {
                num: "2007"
            },
            {
                num: "2006"
            },
            {
                num: "2005"
            },
            {
                num: "2004"
            },
            {
                num: "2003"
            },
            {
                num: "2002"
            },
            {
                num: "2001"
            },
            {
                num: "2000"
            },
            {
                num: "1999"
            },
            {
                num: "1998"
            },
            {
                num: "1997"
            },
            {
                num: "1996"
            },
            {
                num: "1995"
            },
            {
                num: "1994"
            },
            {
                num: "1993"
            },
            {
                num: "1992"
            },
            {
                num: "1991"
            },
            {
                num: "1990"
            },
            {
                num: "1989"
            },
            {
                num: "1988"
            },
            {
                num: "1987"
            },
            {
                num: "1986"
            },
            {
                num: "1985"
            },
            {
                num: "1984"
            },
            {
                num: "1983"
            },
            {
                num: "1982"
            },
            {
                num: "1981"
            },
            {
                num: "1980"
            },
            {
                num: "1979"
            },
            {
                num: "1978"
            },
            {
                num: "1977"
            },
            {
                num: "1976"
            },
            {
                num: "1975"
            },
            {
                num: "1974"
            },
            {
                num: "1973"
            },
            {
                num: "1972"
            },
            {
                num: "1971"
            },
            {
                num: "1970"
            },
        ]
    ,[])

    const days = useMemo(() =>
         [
            {
                num: "01"
            },
            {
                num: "02"
            },
            {
                num: "03"
            },
            {
                num: "04"
            },
            {
                num: "05"
            },
            {
                num: "06"
            },
            {
                num: "07"
            },
            {
                num: "08"
            },
            {
                num: "09"
            },
            {
                num: "10"
            },
            {
                num: "11"
            },
            {
                num: "12"
            },
            {
                num: "13"
            },
            {
                num: "14"
            },
            {
                num: "15"
            },
            {
                num: "16"
            },
            {
                num: "17"
            },
            {
                num: "18"
            },
            {
                num: "19"
            },
            {
                num: "20"
            },
            {
                num: "21"
            },
            {
                num: "22"
            },
            {
                num: "23"
            },
            {
                num: "24"
            },
            {
                num: "25"
            },
            {
                num: "26"
            },
            {
                num: "27"
            },
            {
                num: "28"
            },
            {
                num: "29"
            },
            {
                num: "30"
            },
            {
                num: "31"
            }
        ]
    ,[])
    const months = useMemo(()=>
         [
            {
                num: "01"
            },
            {
                num: "02"
            },
            {
                num: "03"
            },
            {
                num: "04"
            },
            {
                num: "05"
            },
            {
                num: "06"
            },
            {
                num: "07"
            },
            {
                num: "08"
            },
            {
                num: "09"
            },
            {
                num: "10"
            },
            {
                num: "11"
            },
            {
                num: "12"
            }
        ]
    ,[])


    return {days,months,years}
}


