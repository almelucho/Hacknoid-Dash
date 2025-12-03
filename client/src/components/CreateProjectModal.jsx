import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CreateProjectModal({ onClose, onProjectCreated }) {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        clientId: '',
        projectName: '',
        targetProfile: 'IG2'
    });
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // 1. CARGAR CLIENTES (CON SEGURIDAD)
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`${API_URL}/api/clients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token // <--- ¡ESTA ES LA CORRECCIÓN!
            }
        })
            .then(res => {
                if (res.status === 401) return []; // Si no autorizado, lista vacía
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setClients(data);
                }
            })
            .catch(err => console.error("Error cargando clientes:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.clientId) return alert("Por favor selecciona una empresa");

        setLoading(true);
        const token = localStorage.getItem('token'); // Token para crear también

        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // <--- Token aquí también
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onProjectCreated();
                onClose();
            } else {
                alert("Error al crear el proyecto");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-brand-dark">Nuevo Proyecto de Auditoría</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Selector de Cliente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Cliente</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            required
                        >
                            <option value="">-- Selecciona una empresa --</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                        {clients.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                No se encontraron empresas. Ve a "Gestión Clientes" para crear una.
                            </p>
                        )}
                    </div>

                    {/* Nombre Proyecto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                        <input
                            type="text"
                            placeholder="Ej: Auditoría Anual 2025"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            required
                        />
                    </div>

                    {/* Perfil CIS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perfil CIS v8</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['IG1', 'IG2', 'IG3'].map(profile => (
                                <button
                                    key={profile}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, targetProfile: profile })}
                                    className={`py-2 rounded-lg text-sm font-bold border ${formData.targetProfile === profile
                                            ? 'bg-brand-orange text-white border-brand-orange'
                                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {profile}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Botones */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-brand-dark text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Proyecto'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
