import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import classNames from "classnames"
import { Swiper, SwiperSlide } from "swiper/react"
import { useDispatch, useSelector } from "react-redux"
import { Pagination, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./style.module.sass"
import { fetchTimeTableForShow } from "slices/timeTableSlice"

const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
)

export const TimeTable = () => {

  const dispatch = useDispatch()

  const { timeTable: data, loading } = useSelector(state => state.timeTableSlice)
  const { data: user } = useSelector(state => state.user)
  const [mounted, setMounted] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user?.id2) {
      dispatch(fetchTimeTableForShow({ teacher: user?.id2 }))
    }
  }, [user])

  if (loading) {
    return <Loader />
  }

  if (!data || !data.time_tables || !data.hours_list) {
    return <div className={styles.error}>No data available</div>
  }

  const { time_tables, hours_list } = data

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
            lessons.push({ ...lesson, roomName: room?.name })
          }
        })
      }
    })
    return lessons
  }

  const renderLessonCard = (lesson, index, total) => (
    <div key={lesson.id} className={styles.lessonCard}>
      <div className={styles.lessonContent}>
        <div className={styles.groupName}>{lesson.teacher?.name || "N/A"} {lesson.teacher?.surname || "N/A"}</div>
        <div className={styles.subjectName}>{lesson.subject?.name || "N/A"}</div>
        <div className={styles.roomName}>Room: {lesson?.roomName || "N/A"}</div>
      </div>
      <div className={classNames(styles.lessonCard__bg, { [styles.flow]: lesson?.is_flow })}>{lesson?.is_flow ? "Flow" : "Class"}</div>
      {/* {total > 1 && (
        <div className={styles.slideCounter}>
          {index + 1} / {total}
        </div>
      )} */}
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

  return (
    <div className={styles.timeTableWrapper}>
      {/* {mounted && headerRef.current && createPortal(<DayHeaders />, headerRef.current)} */}

      <div ref={headerRef} className={styles.headerPortal}>
        <div className={styles.headerRow}>
          <div className={styles.timeHeaderCell}></div>
          {time_tables.map((day) => (
            <div key={day.date} className={styles.dayHeader}>
              <div className={styles.weekday}>{day.weekday}</div>
              <div className={styles.date}>{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timeTable}>
        <div className={styles.timeColumn}>
          {hours_list.map((hour) => (
            <div key={hour.id} className={styles.timeCell}>
              <div className={styles.startTime}>{hour.start_time}</div>
              <div className={styles.endTime}>{hour.end_time}</div>
            </div>
          ))}
        </div>

        <div className={styles.scheduleGrid}>
          {hours_list.map((hour) => (
            <div key={hour.id} className={styles.scheduleRow}>
              {time_tables.map((day) => (
                <div key={`${hour.id}-${day.date}`} className={styles.scheduleCell}>
                  {renderCell(hour.id, day.date)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}