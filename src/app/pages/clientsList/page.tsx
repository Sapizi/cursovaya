'use client'
import { useState, useEffect } from 'react';
import Header from "@/components/Header/Header";
import styles from './page.module.css';

interface Client {
  id: string;
  name: string;
  age: number;
  subscription: string;
}

export default function ClientsList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredClients(filtered);
    }, [searchQuery, clients]);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients');
            const data = await response.json();
            setClients(data.clients);
            setFilteredClients(data.clients);
        } catch (error) {
            setNotification({ type: 'error', message: 'Ошибка при загрузке клиентов' });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
            try {
                const response = await fetch(`/api/clients/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setClients(clients.filter(client => client.id !== id));
                    setNotification({ type: 'success', message: 'Клиент успешно удален' });
                } else {
                    throw new Error('Ошибка при удалении клиента');
                }
            } catch (error) {
                setNotification({ type: 'error', message: 'Ошибка при удалении клиента' });
            }
        }
    };

    const handleEdit = async (client: Client) => {
        setEditingClient(client);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingClient) return;

        try {
            const response = await fetch(`/api/clients/${editingClient.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingClient),
            });

            if (response.ok) {
                setClients(clients.map(client => 
                    client.id === editingClient.id ? editingClient : client
                ));
                setEditingClient(null);
                setNotification({ type: 'success', message: 'Клиент успешно обновлен' });
            } else {
                throw new Error('Ошибка при обновлении клиента');
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Ошибка при обновлении клиента' });
        }
    };

    return (
        <div>
            <Header/>
            <h1 className={styles.title}>Список клиентов</h1>
            
            {notification && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            <div className={styles.container}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Поиск клиента по имени..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {editingClient ? (
                    <form onSubmit={handleUpdate} className={styles.editForm}>
                        <h2>Редактировать клиента</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Имя:</label>
                            <input
                                type="text"
                                value={editingClient.name}
                                onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Возраст:</label>
                            <input
                                type="number"
                                value={editingClient.age}
                                onChange={e => setEditingClient({...editingClient, age: parseInt(e.target.value)})}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Абонемент:</label>
                            <input
                                type="text"
                                value={editingClient.subscription}
                                onChange={e => setEditingClient({...editingClient, subscription: e.target.value})}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.button}>Сохранить</button>
                            <button 
                                type="button" 
                                onClick={() => setEditingClient(null)}
                                className={`${styles.button} ${styles.cancelButton}`}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.clientsGrid}>
                        {filteredClients.length > 0 ? (
                            filteredClients.map(client => (
                                <div key={client.id} className={styles.clientCard}>
                                    <h3>{client.name}</h3>
                                    <p>Возраст: {client.age}</p>
                                    <p>Абонемент: {client.subscription}</p>
                                    <div className={styles.buttonGroup}>
                                        <button 
                                            onClick={() => handleEdit(client)}
                                            className={`${styles.button} ${styles.editButton}`}
                                        >
                                            Редактировать
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(client.id)}
                                            className={`${styles.button} ${styles.deleteButton}`}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noResults}>Клиенты не найдены</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}