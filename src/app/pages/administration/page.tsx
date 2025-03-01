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
  const [clientCount, setClientCount] = useState(0);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setClientCount(data.count);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }

        // Загрузка данных о занятиях
        const classRes = await fetch("/api/classes");
        if (!classRes.ok) throw new Error('Failed to fetch classes');
        const classData = await classRes.json();
        setClasses(classData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
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
                {clientCount}
              </span>
              <p className={styles.desc}>Общее количество клиентов</p>
              <button className={styles.button} onClick={() => router.push("/pages/add")}>
                Добавить клиента
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
              <WeatherWidget />
            </div>
            <div className={styles.right}>
              <button className={styles.button} onClick={() => router.push("/pages/addChalange")}>
                Добавить занятие
              </button>
              <button className={styles.button} onClick={() => router.push("/pages/addTrainer")}>
                Добавить тренера
              </button>
              <button className={styles.button} onClick={() => router.push("/pages/clientsList")}>Список клиентов</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
