'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../../components/Header/Header';
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
      <h1>Добавить тренера</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Имя обязательно' })}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="specialization">Специализация:</label>
          <input
            type="text"
            id="specialization"
            {...register('specialization', { required: 'Специализация обязательна' })}
          />
          {errors.specialization && <p style={{ color: 'red' }}>{errors.specialization.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Загружается...' : 'Добавить тренера'}
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
