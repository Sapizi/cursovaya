"use client";
import { useEffect, useState } from "react";
import styles from "./weather.module.css";
const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "652d28d90474fe6f8294985d0326e46a";
        const city = "Chelyabinsk";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Ошибка при получении данных о погоде");
        }
        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);
  if (loading) return <p>Загрузка погоды...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!weather) return null;
  return (
    <div className={styles.all}>
      <p>Температура: {weather.main.temp}°C</p>
      <p>Описание: {weather.weather[0].description}</p>
      <p>Влажность: {weather.main.humidity}%</p>
      <p>Скорость ветра: {weather.wind.speed} м/с</p>
    </div>
  );
};
export default WeatherWidget;
