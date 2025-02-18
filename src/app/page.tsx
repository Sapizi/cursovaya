"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; 
import Header from "@/components/Header/Header";
import styles from "./page.module.css";
type FormData = {
  login: string;
  password: string;
};
export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    const { login, password } = data;
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const responseData = await res.json();
    if (res.ok) {
      alert("Успешный вход!");
      router.push("/pages/administration"); 
    } else {
      alert(responseData.message || "Ошибка входа");
    }
  };
  return (
    <>
      <Header />
      <div className={styles.allMain}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.forma}>
          <h2>Вход для администратора</h2>
          <input className={styles.mainInput}
            type="text"
            placeholder="Логин"
            {...register("login", { required: "Логин обязателен" })}
          />
          <input className={styles.mainInput}
            type="password"
            placeholder="Пароль"
            {...register("password", { required: "Пароль обязателен" })}
          />
          <button type="submit" className={styles.mainButton}>
            Войти
          </button>
        </form>
      </div>
    </>
  );
}
