import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                // Guardar token y notificar a App
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);
                onLogin(data.user);
            } else {
                setError(data.msg || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="text-brand-orange" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark">Hacknoid CIS Control Panel</h2>
                    <p className="text-gray-500 text-sm">Plataforma de Gestión de Ciberseguridad</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                            placeholder="usuario@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold shadow-lg hover:bg-orange-700 transition-transform active:scale-95">
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
}
