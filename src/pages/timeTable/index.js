import {useState, useEffect, useRef} from "react"
import {createPortal} from "react-dom"
import classNames from "classnames"
import {Swiper, SwiperSlide} from "swiper/react"
import {useDispatch, useSelector} from "react-redux"
import {Pagination, Mousewheel} from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./style.module.sass"
import {fetchTimeTableForShow} from "slices/timeTableSlice"
import {useNavigate} from "react-router-dom";
import Button from "components/ui/button";

const Loader = () => (
    <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
    </div>
)

export const TimeTable = () => {

    const dispatch = useDispatch()

    const {timeTable: data, loading} = useSelector(state => state.timeTableSlice)
    const {data: user} = useSelector(state => state.user)
    const [mounted, setMounted] = useState(false)
    const headerRef = useRef(null)
    const [queryType, setQueryType] = useState(null);

    const navigate = useNavigate()
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (user?.id2) {
            dispatch(fetchTimeTableForShow({teacher: user?.id2 , week: queryType}))
        }
    }, [user ,queryType])

    // if (loading) {
    //     return <Loader/>
    // }


    const {time_tables, hours_list} = data

    // Get lessons for a specific hour and date
    const getLessonsForCell = (hourId, date) => {
        const dayData = time_tables.find((tt) => tt.date === date)
        if (!dayData || !dayData.rooms) return []

        const lessons = []
        dayData.rooms.forEach((room) => {
            if (room.lessons) {
                room.lessons.forEach((lesson) => {
                    // Only include lessons that have an id field
                    if (lesson.id && lesson.hours === hourId) {
                        lessons.push({...lesson, roomName: room?.name})
                    }
                })
            }
        })
        return lessons
    }

    const renderLessonCard = (lesson, index, total) => (
        <div key={lesson.id} className={styles.lessonCard}>
            <div className={styles.lessonContent}>
                <div
                    className={styles.groupName}>{lesson.teacher?.name || "N/A"} {lesson.teacher?.surname || "N/A"}</div>
                <div className={styles.subjectName}>{lesson.subject?.name || "N/A"}</div>
                <div className={styles.roomName}>Room: {lesson?.roomName || "N/A"}</div>
            </div>
            <div
                className={classNames(styles.lessonCard__bg, {[styles.flow]: lesson?.is_flow})}>{lesson?.is_flow ? "Flow" : "Class"}</div>
            {/* {total > 1 && (
        <div className={styles.slideCounter}>
          {index + 1} / {total}
        </div>
      )} */}
            <div onClick={() => {

                navigate(`../groups/${lesson.id}/observedTeacherLessons`)
            }} className={styles.flow__icon}>
                <i className={`fa fa-list-ul`}/>
            </div>
            <div onClick={() => {


                navigate(`../groups/${lesson.id}/lessonPlan`)
            }} className={styles.flow__icon2}>
                <i className="fa-solid fa-person-chalkboard"/>
            </div>
        </div>
    )

    const renderCell = (hourId, date) => {
        const lessons = getLessonsForCell(hourId, date)

        if (lessons.length === 0) {
            return <div className={styles.emptyCell}></div>
        }

        if (lessons.length === 1) {
            return renderLessonCard(lessons[0], 0, 1)
        }

        // Multiple lessons - use Swiper
        return (
            <Swiper
                direction="vertical"
                pagination={{
                    clickable: true,
                }}
                mousewheel={true}
                spaceBetween={20}
                slidesPerView={1}
                modules={[Pagination, Mousewheel]}
                className={styles.swiperContainer}
            >
                {lessons.map((lesson, index) => (
                    <SwiperSlide key={lesson.id}>{renderLessonCard(lesson, index, lessons.length)}</SwiperSlide>
                ))}
            </Swiper>
        )
    }

    //   const DayHeaders = () => (

    //   )

    const handleClick = (type) => {
        // faqat kelgan turga asoslanamiz
        if (queryType === "next" && type === "prev") {
            setQueryType("")
        } else if (queryType === "prev" && type === "next") {
            setQueryType("")
        } else {
            setQueryType(type);
        }

        // let query = { teacher: user?.id2 };
        //
        // if (type === "next") {
        //     query = { ...query, next: true };
        // } else if (type === "prev") {
        //     query = { ...query, prev: true };
        // }
        //
        // // state faqat UI uchun (masalan, active tugma)
        // setQueryType(type);
        //
        console.log(queryType)
    };



    return (
        <div className={styles.timeTableWrapper}>
            {/* {mounted && headerRef.current && createPortal(<DayHeaders />, headerRef.current)} */}

                <Button disabled={queryType === "prev"} active={queryType === "prev"} onClick={() => handleClick("prev")}>Prev
                    (oldingi hafta)</Button>
                <Button disabled={queryType === "next"} active={queryType === "next"} onClick={() => handleClick("next")}>Next
                    (keyingi hafta)</Button>
                <h1>{queryType === "next" ? "Keyingi hafta" : queryType === "prev" ? "Oldingi hafta" : "Hozirgi hafta"}</h1>


            {!data || !data.time_tables || !data.hours_list &&
                <div className={styles.error}>No data available</div>}

            {
                loading ? <Loader/> : <>
                    <div ref={headerRef} className={styles.headerPortal}>
                        <div className={styles.headerRow}>
                            <div className={styles.timeHeaderCell}></div>
                            {time_tables?.map((day) => (
                                <div key={day?.date} className={styles.dayHeader}>
                                    <div className={styles.weekday}>{day?.weekday}</div>
                                    <div className={styles.date}>{day?.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.timeTable}>
                        <div className={styles.timeColumn}>
                            {hours_list?.map((hour) => (
                                <div key={hour?.id} className={styles.timeCell}>
                                    <div className={styles.startTime}>{hour?.start_time}</div>
                                    <div className={styles.endTime}>{hour?.end_time}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.scheduleGrid}>
                            {hours_list?.map((hour) => (
                                <div key={hour?.id} className={styles.scheduleRow}>
                                    {time_tables?.map((day) => (
                                        <div key={`${hour?.id}-${day?.date}`} className={styles.scheduleCell}>
                                            {renderCell(hour?.id, day?.date)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}