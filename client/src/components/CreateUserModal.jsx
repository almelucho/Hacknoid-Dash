import React, { useState } from 'react';
import { X, UserPlus, Lock, Mail, User, Building } from 'lucide-react';

export default function CreateUserModal({ client, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    // URL API
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Llamamos a la ruta específica de CLIENTES
            // El backend asignará automáticamente el rol "client_viewer" (NO ADMIN)
            const res = await fetch(`${API_URL}/api/clients/${client._id}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(`Usuario creado para ${client.name}. Ahora pueden loguearse para ver SUS avances.`);
                onClose();
            } else {
                const data = await res.json();
                alert(data.msg || "Error al crear usuario");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-brand-dark p-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserPlus className="text-brand-orange" size={24} /> Nuevo Usuario Cliente
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                            <Building size={14} />
                            <span>Empresa: <span className="text-white font-bold">{client.name}</span></span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Nombre */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre del Empleado</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text" required placeholder="Ej: Juan Pérez"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Correo Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email" required placeholder={`contacto@${client.name.toLowerCase().replace(/\s/g, '')}.com`}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Contraseña Temporal</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password" required placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">* Este usuario solo tendrá acceso de lectura y carga de evidencia para {client.name}.</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-brand-orange text-white py-3 rounded-lg font-bold shadow-lg hover:bg-orange-700 transition-transform active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Creando Acceso...' : 'Crear Acceso Cliente'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
