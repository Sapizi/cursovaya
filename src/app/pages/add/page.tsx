"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import styles from "./add.module.css";
type FormData = {
  name: string;
  age: number;
  subscription: string;
};
export default function AddClient() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Клиент добавлен!");
        router.push("/pages/administration");
      } else {
        alert("Ошибка при добавлении клиента");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка сервера");
    }
  };
  return (
    <>
      <Header />
      <div >
        <h1>Добавить клиента</h1>
        <div className={styles.all}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.forma}>
            <div>

              <input className={styles.input} placeholder="Имя"
                type="text"
                {...register("name", { required: "Введите имя" })}
              />
              {errors.name && <span>{errors.name.message}</span>}
            </div>
            <div >
              <input className={styles.input} placeholder="Возраст"
                type="number"
                {...register("age", { required: "Введите возраст", min: 1 })}

              />
              {errors.age && <span>{errors.age.message}</span>}
            </div>
            <div>
              <select className={styles.select} {...register("subscription", { required: "Выберите абонемент" })}>
                <option value="">Выберите абонемент</option>
                <option value="monthly">Месячный</option>
                <option value="quarterly">Квартальный</option>
                <option value="yearly">Годовой</option>
              </select>
              {errors.subscription && <span>{errors.subscription.message}</span>}
            </div>
            <button type="submit" className={styles.button}>Добавить</button>
          </form>
        </div>
      </div>
    </>
  );
}
