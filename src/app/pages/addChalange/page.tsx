"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";
interface Trainer {
  id: string;
  name: string;
}
interface Client {
  id: string;
  name: string;
}
interface ClassFormData {
  startTime: string;
  trainerId: string;
  participants: string[];
}
export default function AddClass() {
  const { register, handleSubmit, setValue, watch } = useForm<ClassFormData>({
    defaultValues: {
      participants: [],
    },
  });
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const participants = watch("participants");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainersRes = await fetch("/api/trainers");
        const trainersData = await trainersRes.json();
        setTrainers(Array.isArray(trainersData) ? trainersData : []);

        const clientsRes = await fetch("/api/clients");
        const clientsData = await clientsRes.json();
        const sortedClients = Array.isArray(clientsData.clients) 
          ? [...clientsData.clients].sort((a, b) => a.name.localeCompare(b.name))
          : [];
        setClients(sortedClients);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);
  const onSubmit = async (data: ClassFormData) => {
    console.log("Отправка данных:", data);
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setNotification("Занятие успешно добавлено!");
    } else {
      setNotification("Ошибка при добавлении занятия.");
    }
    setTimeout(() => setNotification(null), 3000);
  };
  const handleCheckboxChange = (clientId: string, checked: boolean) => {
    const updatedParticipants = checked
      ? [...participants, clientId]
      : participants.filter((id) => id !== clientId);

    setValue("participants", updatedParticipants);
  };
  return (
    <div>
      <Header />
      <h1 className={styles.title}>Добавление занятия</h1>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.text}>Время начала:</label>
        <input
          type="datetime-local"
          {...register("startTime", { required: true })}
        />
        <label className={styles.text}>Тренер:</label>
        <select {...register("trainerId", { required: true })}>
          <option value="">Выберите тренера</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name}
            </option>
          ))}
        </select>
        <label className={styles.text}>Участники:</label>
        <div className={styles.clientsList}>
          {clients.length > 0 ? (
            clients.map((client) => (
              <div key={client.id}>
                <label>
                  <input
                    type="checkbox"
                    value={client.id}
                    checked={participants.includes(client.id)}
                    onChange={(e) =>
                      handleCheckboxChange(client.id, e.target.checked)
                    }
                  />
                  {client.name}
                </label>
              </div>
            ))
          ) : (
            <p>Нет доступных клиентов</p>
          )}
        </div>
        <button type="submit" className={styles.button}>Добавить занятие</button>
      </form>
      <style jsx>{`
        .notification {
          margin: 10px 0;
          padding: 10px;
          background-color: ${notification?.includes("успешно")
            ? "#4CAF50"
            : "#FF5733"};
          color: white;
          text-align: center;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
