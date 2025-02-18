"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Header from "@/components/Header/Header";
import styles from "./administration.module.css";
import WeatherWidget from "@/components/WeatherWidget/WeatherWidget";

type ClassData = {
  id: string;
  startTime: string;
  trainer: string;
  participants: number;
};

export default function Administration() {
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [classes, setClasses] = useState<ClassData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClientCount(data.count);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("Ошибка загрузки занятий:", error);
      }
    };

    fetchClientCount();
    fetchClasses();

    const interval = setInterval(() => {
      const date = new Date();
      setCurrentDate(date.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddClient = () => {
    router.push("/pages/add");
  };
  const handleAddChalange = () => {
    router.push("/pages/addChalange");
  }
  return (
    <>
      <Header />
      <div className="all">
        <h1 className={styles.title}>Главная</h1>
        <div className={styles.wrapper}>
          <div className={styles.cards}>
            <div className={styles.left}>
              <span className={styles.titleCard}>
                {clientCount !== null ? clientCount : "Загрузка..."}
              </span>
              <p className={styles.desc}>количество клиентов</p>
              <button className={styles.button} onClick={handleAddClient}>
                Добавить
              </button>
            </div>
            <div className={styles.center}>
              <span className={styles.centerTitle}>Сегодняшняя дата</span>
              <p className={styles.date}>{currentDate}</p>
              <p className={styles.centerTitle2}>Занятия на сегодня:</p>
              <ul>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <li key={cls.id}>
                      {new Date(cls.startTime).toLocaleTimeString()} - {cls.trainer} ({cls.participants} участников)
                    </li>
                  ))
                ) : (
                  <p>Занятий нет</p>
                )}
              </ul>
              <p className={styles.centerTitle2}>Погода сегодня:</p>
              <WeatherWidget/>
            </div>
            <div className={styles.right}>
            <button className={styles.button} onClick={handleAddChalange}>
                Добавить занятие
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
