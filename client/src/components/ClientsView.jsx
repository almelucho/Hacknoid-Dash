import React, { useState, useEffect } from 'react';
import { Building, Plus, Upload, User } from 'lucide-react';

export default function ClientsView() {
    const [clients, setClients] = useState([]);
    const [newClientName, setNewClientName] = useState("");
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchClients = () => {
        fetch(`${API_URL}/api/clients`)
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchClients(); }, []);

    const handleCreateClient = async () => {
        if (!newClientName) return;
        const res = await fetch(`${API_URL}/api/clients`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newClientName, contactName: "Admin" })
        });
        if (res.ok) { setNewClientName(""); fetchClients(); }
    };

    const handleLogoUpload = async (e, clientId) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData(); formData.append('file', file);
        await fetch(`${API_URL}/api/clients/${clientId}/logo`, { method: 'POST', body: formData });
        fetchClients();
    };

    return (
        <div className="animate-in fade-in p-4">
            <h2 className="text-3xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                <Building className="text-brand-orange" /> Gestión de Clientes
            </h2>

            {/* Formulario Crear */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-4">
                <input
                    type="text" placeholder="Nombre de la Empresa (Ej: Banco Norte)..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newClientName} onChange={e => setNewClientName(e.target.value)}
                />
                <button onClick={handleCreateClient} className="bg-brand-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800">
                    Crear Empresa
                </button>
            </div>

            {/* Lista */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                {client.logoUrl ? <img src={`${API_URL}${client.logoUrl}`} alt="logo" className="w-full h-full object-contain" /> : <Building className="text-gray-300" />}
                            </div>
                            <label className="cursor-pointer text-blue-600 hover:bg-blue-50 p-2 rounded-full" title="Subir Logo">
                                <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, client._id)} />
                                <Upload size={18} />
                            </label>
                        </div>
                        <h3 className="font-bold text-xl text-gray-800">{client.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{client.projects?.length || 0} Proyectos</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
