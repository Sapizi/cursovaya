'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../../components/Header/Header';
import styles from './page.module.css';

interface TrainerFormData {
  name: string;
  specialization: string;
}

export default function AddTrainer() {
  const { register, handleSubmit, formState: { errors } } = useForm<TrainerFormData>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: TrainerFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Не удалось добавить тренера');
      }
      const newTrainer = await response.json();
      setSuccess(`Тренер ${newTrainer.name} успешно добавлен!`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h1 className={styles.title}>Добавить тренера</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.text}>Имя:</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            {...register('name', { required: 'Имя обязательно' })}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="specialization" className={styles.text}>Специализация:</label>
          <input
            type="text"
            id="specialization"
            className={styles.input}
            {...register('specialization', { required: 'Специализация обязательна' })}
          />
          {errors.specialization && <p className={styles.error}>{errors.specialization.message}</p>}
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Загружается...' : 'Добавить тренера'}
        </button>
        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
