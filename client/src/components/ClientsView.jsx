import React, { useState, useEffect } from 'react';
import { Building, Plus, Upload, UserPlus, Pencil, Trash2 } from 'lucide-react';
import CreateUserModal from './CreateUserModal';

export default function ClientsView() {
    const [clients, setClients] = useState([]);
    const [newClientName, setNewClientName] = useState("");
    const [selectedClientForUser, setSelectedClientForUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // HELPER: Obtener Token
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
    });

    const fetchClients = () => {
        fetch(`${API_URL}/api/clients`, { headers: getAuthHeaders() }) // <--- TOKEN
            .then(res => {
                if (res.status === 401) return; // Manejar expiración si quieres
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setClients(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchClients(); }, []);

    const handleCreateClient = async () => {
        if (!newClientName.trim()) return;
        const res = await fetch(`${API_URL}/api/clients`, {
            method: 'POST',
            headers: getAuthHeaders(), // <--- TOKEN
            body: JSON.stringify({ name: newClientName, contactName: "Admin" })
        });
        if (res.ok) { setNewClientName(""); fetchClients(); }
    };

    const handleEditClient = async (client) => {
        const newName = prompt("Nuevo nombre del cliente:", client.name);
        if (newName && newName !== client.name) {
            await fetch(`${API_URL}/api/clients/${client._id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: newName })
            });
            fetchClients();
        }
    };

    const handleDeleteClient = async (id) => {
        if (confirm("¿Estás seguro de borrar este cliente? Se perderán sus datos.")) {
            await fetch(`${API_URL}/api/clients/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            fetchClients();
        }
    };

    const handleLogoUpload = async (e, clientId) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData(); formData.append('file', file);

        // Nota: Para FormData NO ponemos Content-Type JSON, pero SÍ el token
        await fetch(`${API_URL}/api/clients/${clientId}/logo`, {
            method: 'POST',
            headers: { 'x-auth-token': localStorage.getItem('token') }, // <--- TOKEN SOLO
            body: formData
        });
        fetchClients();
    };

    return (
        <div className="animate-in fade-in p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                <Building className="text-brand-orange" size={32} /> Gestión de Clientes
            </h2>

            {/* Crear Cliente */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Plus size={24} /></div>
                <input type="text" placeholder="Nombre de la Empresa..." className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none text-lg"
                    value={newClientName} onChange={e => setNewClientName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
                />
                <button onClick={handleCreateClient} className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg">Crear Empresa</button>
            </div>

            {/* Lista */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between relative">
                        {/* Botones de Edición/Borrado (Absolute Top Right) */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClient(client)} className="p-1 text-gray-400 hover:text-blue-500 bg-white rounded-full shadow-sm border border-gray-100"><Pencil size={16} /></button>
                            <button onClick={() => handleDeleteClient(client._id)} className="p-1 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm border border-gray-100"><Trash2 size={16} /></button>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden relative">
                                    {client.logoUrl ? <img src={`${API_URL}${client.logoUrl}`} alt="logo" className="w-full h-full object-contain" /> : <Building className="text-gray-300" size={32} />}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"><Upload size={20} /><input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, client._id)} /></label>
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-brand-dark pr-8">{client.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{client.projects?.length || 0} Proyectos</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedClientForUser(client)}
                                className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <UserPlus size={16} /> Crear Usuario
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedClientForUser && (
                <CreateUserModal
                    client={selectedClientForUser}
                    onClose={() => setSelectedClientForUser(null)}
                />
            )}

        </div>
    );
}
