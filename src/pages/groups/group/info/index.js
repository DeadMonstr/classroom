import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import styles from "./styles.module.sass"
import Select from "components/ui/form/select";


import Values from "values.js";
import img from "assets/user.png";

import Table from "components/ui/table";
import classNames from "classnames";
import {useHttp} from "hooks/http.hook";
import {useSelector} from "react-redux";


const GroupInformation = () => {


    // const data = [
    // 	{
    // 		id: 1,
    // 		name: "Ulug'",
    // 		surname: "Fatxullayev",
    // 		homework: 100,
    // 		activity: 100,
    // 		att: 11,
    // 		common: 20
    // 	},
    // 	{
    // 		id: 2,
    // 		name: "Ulug'Bek",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 121,
    // 		att: 0,
    // 		common: 10
    // 	},
    // 	{
    // 		id: 3,
    // 		name: "Ulug'Bek",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 121,
    // 		att: 0,
    // 		common: 5
    // 	},
    // 	{
    // 		id: 4,
    // 		name: "Ulug'Bek",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 50,
    // 		att: 0,
    // 		common: 1
    // 	},
    // 	{
    // 		id: 4,
    // 		name: "Ulug'Bekasd a",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 50,
    // 		att: 0,
    // 		common: 1
    // 	},
    // 	{
    // 		id: 4,
    // 		name: "Ulug'Bek",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 50,
    // 		att: 0,
    // 		common: 1
    // 	},
    // 	{
    // 		id: 4,
    // 		name: "Ulug'Bek",
    // 		surname: "Fatxullayev",
    // 		homework: 50,
    // 		activity: 50,
    // 		att: 0,
    // 		common: 1
    // 	}
    //
    // ]


    return (
        <div className={styles.info}>

            {/*<CommonRating data={data} typeStatistic={"common"}/>*/}

            <StudentsInfo/>
        </div>
    )
}

const CommonRating = ({data, typeStatistic}) => {

    const [type, setType] = useState(null)
    const [open, setOpen] = useState(true)
    const [height, setHeight] = useState(0)
    const [innerHeight, setInnerHeight] = useState(0)
    const [statistic, setStatistic] = useState([])
    const refAccordion = useRef()
    const refChart = useRef()
    const refTable = useRef()

    const types = [
        {
            name: "Jadval",
            value: "table"
        },
        {
            name: "Diagramma",
            value: "chart"
        }

    ]

    useEffect(() => {
        const sortedData = data.sort((a, b) => b[typeStatistic] - a[typeStatistic])
        setStatistic(sortedData)

    }, [data])


    // useEffect(() => {
    // 	if (open && statistic.length > 0) {
    // 		refAccordion.current.style.height = refAccordion.current.scrollHeight + "px"
    // 	}
    // 	else {
    // 		refAccordion.current.style.height = 0
    // 	}
    // },[open, statistic])

    // useEffect(() => {
    // 	console.log(refAccordion.current.scrollHeight)
    // 	console.log(refAccordion.current.style.height)
    // 	if
    // 	(
    // 		refAccordion.current.getBoundingClientRect().height > 0 &&
    // 		refAccordion.current.style.height !== refAccordion.current.scrollHeight
    // 	)
    // 	{
    // 		console.log("hello")
    // 		refAccordion.current.style.height = refAccordion.current.scrollHeight + "px"
    // 	}
    // },[type])

    // useEffect(() => {
    // 	if (open) {
    // 		setHeight(refAccordion.current?.scrollHeight)
    // 	}
    // 	else {
    // 		setHeight(0)
    // 	}
    // },[open])


    // useEffect(() => {
    // 	if (height > 0 && open && innerHeight !== 0) {
    // 		if (refAccordion.current?.scrollHeight !== height) {
    // 			setHeight(refAccordion.current?.scrollHeight)
    // 		}
    // 	}
    // },[height, refAccordion.current?.scrollHeight])
    //
    //
    // useEffect(() => {
    // 	if (open && height > 0) {
    // 		if (type === "chart"  ) {
    // 			setHeight(height + (refChart.current?.scrollHeight - innerHeight))
    // 			setInnerHeight(refChart.current?.scrollHeight)
    // 		} else {
    // 			setHeight(height + (refTable.current?.scrollHeight - innerHeight))
    // 			setInnerHeight(refTable.current?.scrollHeight)
    // 		}
    // 	}
    //
    // },[type, innerHeight, height])

    const renderChart = () => {
        return (
            <div className={styles.chart} ref={refChart}>
                {
                    statistic.map((item, index) => {
                        let width = 0
                        const biggerNumb = statistic[0][typeStatistic]

                        width = ((+item[typeStatistic]) / (+biggerNumb)) * 95 + "%"

                        const color = new Values("#00B2FF").tint(index * 7)

                        return (

                            <div
                                className={styles.item}
                            >
                                <img src={img} alt=""/>
                                <div className={styles.user}>
                                    <div className={styles.info}>
                                        <span>{item.name}</span>
                                        <span>{item.surname}</span>
                                    </div>
                                    <div
                                        style={{width: width, backgroundColor: `#${color.hex}`}}
                                        className={styles.line}
                                    >
                                    </div>
                                </div>
                                <div className={styles.num}>
                                    {item[typeStatistic]}
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const renderTable = () => {
        return (
            <div className={styles.table} ref={refTable}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Ism</th>
                        <th>Familya</th>
                        <th>Uy ish</th>
                        <th>Darsga qatnashishi</th>
                        <th>Davomat</th>
                        <th>Hammasi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        statistic.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.surname}</td>
                                    <td>{item.homework}</td>
                                    <td>{item.activity}</td>
                                    <td>{item.att}</td>
                                    <td>{item.common}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>
        )
    }


    return (
        <div className={styles.rating}>
            <div className={styles.header} onClick={() => setOpen(!open)}>
                <h1>Umumiy</h1>
                <i className="fa-solid fa-caret-down arrow"/>
            </div>
            {/*<div className={styles.accordion} ref={refAccordion} style={{height: height + "px"}}>*/}
            {/*	<div className={styles.wrapper}>*/}
            {/*		<div className={styles.subHeader}>*/}
            {/*			<Select title={"Turi"} value={type} onChange={setType} options={types} />*/}
            {/*		</div>*/}

            {/*		<div className={styles.container} style={{height: innerHeight + "px"}}>*/}
            {/*			{ type === "chart" ? renderChart() : renderTable()}*/}
            {/*		</div>*/}
            {/*	</div>*/}
            {/*</div>*/}

            <div
                className={classNames(styles.accordion, {
                    [`${styles.active}`]: open
                })}
                ref={refAccordion}
            >
                <div className={styles.wrapper}>
                    <div className={styles.subHeader}>
                        <Select title={"Turi"} value={type} onChange={setType} options={types}/>
                    </div>

                    <div className={styles.container}>
                        {type === "chart" ? renderChart() : renderTable()}
                    </div>
                </div>
            </div>
        </div>
    )
}


const StudentsInfo = () => {

    const [open, setOpen] = useState(true)
    const refAccordion = useRef()
    const [students, setStudents] = useState([])

    const {data} = useSelector(state => state.group)


    const {request} = useHttp()


    const renderTable = useCallback(() => {
        if (data?.students?.length > 0) {
            return (
                <div className={styles.table}>
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Tel.</th>
                            <th>Tel. Ota-ona</th>
                            <th>Qarz</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data?.students?.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.surname}</td>
                                        <td>{item?.phone}</td>
                                        <td>{item?.parent_phone}</td>
                                        <td
                                            className={classNames(styles.balance, {
                                                [styles[item.color]]: true
                                            })}
                                        >
                                            {item?.balance}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            )
        }
    }, [data])


    return (
        <div className={styles.rating}>
            <div className={styles.header} onClick={() => setOpen(!open)}>
                <h1>Studentlar ma'lumotlari</h1>
                <i className="fa-solid fa-caret-down arrow"/>
            </div>

            <div
                className={classNames(styles.accordion, {
                    [`${styles.active}`]: open
                })}
                ref={refAccordion}
            >
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        {renderTable()}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default GroupInformation