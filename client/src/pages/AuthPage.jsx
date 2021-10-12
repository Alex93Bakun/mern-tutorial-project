import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

const AuthPage = () => {
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handlerChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const handlerRegister = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {
                ...form,
            });
        } catch (e) {}
    };

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 style={{ textAlign: 'center' }}>Сократим ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите Email..."
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="yellow-input"
                                    onChange={handlerChange}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите Пароль..."
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    onChange={handlerChange}
                                />
                                <label htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            style={{ marginRight: 10 }}
                            disabled={loading}
                        >
                            Войти
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={handlerRegister}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
