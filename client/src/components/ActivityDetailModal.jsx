import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Send, FileText, User, History, Upload, CheckCircle, AlertCircle, Circle, Plus } from 'lucide-react';

export default function ActivityDetailModal({ activity, ids, onClose, onUpdate }) {
    const [activeTab, setActiveTab] = useState('general'); // 'general' | 'history'

    // Estado General
    const [comment, setComment] = useState("");
    const [periodicity, setPeriodicity] = useState(activity.periodicity || "Única");
    const [loading, setLoading] = useState(false);

    // Estado Bitácora
    const [newExec, setNewExec] = useState({ period: "", status: 0, comment: "" });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };

    // Helper Upload Headers (Sin Content-Type para FormData)
    const uploadHeaders = { 'x-auth-token': token };

    // --- LÓGICA GENERAL ---
    const handlePeriodicityChange = async (newVal) => {
        setPeriodicity(newVal);
        try {
            await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/details`, {
                method: 'PATCH', headers, body: JSON.stringify({ periodicity: newVal })
            });
            onUpdate();
        } catch (error) { console.error(error); }
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/comments`, {
                method: 'POST', headers, body: JSON.stringify({ text: comment })
            });
            setComment(""); onUpdate();
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // --- LÓGICA BITÁCORA ---
    const handleAddExecution = async () => {
        if (!newExec.period.trim()) return alert("Indica el periodo (Ej: Semana 1)");

        try {
            const res = await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/executions`, {
                method: 'POST', headers, body: JSON.stringify(newExec)
            });
            if (res.ok) {
                setNewExec({ period: "", status: 0, comment: "" });
                onUpdate();
            }
        } catch (error) { console.error(error); }
    };

    const handleExecutionUpload = async (e, executionId) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData(); formData.append('file', file);

        try {
            await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/executions/${executionId}/evidence`, {
                method: 'POST', headers: uploadHeaders, body: formData
            });
            onUpdate();
        } catch (error) { console.error(error); }
    };

    // Helpers Visuales
    const getStatusConfig = (status) => {
        switch (status) {
            case 100: return { label: "COMPLETADO", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle size={14} /> };
            case 50: return { label: "EN PROGRESO", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: <AlertCircle size={14} /> };
            default: return { label: "NO INICIADO", color: "text-gray-500 bg-gray-50 border-gray-200", icon: <Circle size={14} /> };
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Actividad</span>
                            <span className="text-gray-400 text-xs font-mono">{activity.periodicity}</span>
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">{activity.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={24} /></button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'general' ? 'border-b-2 border-brand-orange text-brand-orange bg-orange-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={16} /> General y Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'border-b-2 border-brand-orange text-brand-orange bg-orange-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <History size={16} /> Bitácora de Ejecuciones
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">

                    {/* --- TAB: GENERAL --- */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* Config Periodicidad */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
                                <div className="bg-white p-2 rounded text-blue-600"><Calendar size={20} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-blue-900">Frecuencia de Control</p>
                                    <p className="text-xs text-blue-600">Define cada cuánto se debe ejecutar esta actividad.</p>
                                </div>
                                <select value={periodicity} onChange={(e) => handlePeriodicityChange(e.target.value)} className="bg-white border border-blue-200 text-sm rounded px-3 py-1.5 outline-none font-medium">
                                    <option>Única</option><option>Semanal</option><option>Mensual</option><option>Trimestral</option><option>Anual</option>
                                </select>
                            </div>

                            {/* Evidencias Globales */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><FileText size={14} /> Evidencias Globales</h4>
                                <div className="flex flex-wrap gap-2">
                                    {activity.evidenceFiles?.map((f, i) => (
                                        <a key={i} href={`${API_URL}${f.url}`} target="_blank" className="flex items-center gap-2 p-2 rounded border bg-gray-50 hover:bg-white text-xs text-blue-600">
                                            <FileText size={14} /> {f.name}
                                        </a>
                                    ))}
                                    {!activity.evidenceFiles?.length && <p className="text-xs text-gray-300 italic">Sin archivos globales.</p>}
                                </div>
                            </div>

                            {/* Chat */}
                            <div className="flex flex-col h-64 border rounded-xl overflow-hidden bg-gray-50">
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {activity.comments?.map((c, i) => (
                                        <div key={i} className={`flex flex-col ${c.role === 'admin' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${c.role === 'admin' ? 'bg-brand-dark text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none'}`}>
                                                <p>{c.text}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1">{c.user} • {new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendComment} className="p-2 border-t bg-white flex gap-2">
                                    <input type="text" placeholder="Escribe un comentario..." className="flex-1 px-3 py-2 bg-gray-100 rounded outline-none text-sm" value={comment} onChange={e => setComment(e.target.value)} />
                                    <button type="submit" disabled={!comment.trim()} className="p-2 bg-brand-orange text-white rounded hover:bg-orange-700"><Send size={16} /></button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: BITÁCORA (EJECUCIONES) --- */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            {/* Formulario Nuevo Registro */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Plus size={16} /> Registrar Nueva Ejecución</h4>
                                <div className="grid grid-cols-12 gap-2">
                                    <input type="text" placeholder="Periodo (Ej: Octubre 2025)..." className="col-span-4 px-3 py-2 border rounded text-sm" value={newExec.period} onChange={e => setNewExec({ ...newExec, period: e.target.value })} />
                                    <select className="col-span-3 px-3 py-2 border rounded text-sm" value={newExec.status} onChange={e => setNewExec({ ...newExec, status: parseInt(e.target.value) })}>
                                        <option value={0}>No Iniciado</option><option value={50}>En Progreso</option><option value={100}>Completado</option>
                                    </select>
                                    <input type="text" placeholder="Comentario corto..." className="col-span-4 px-3 py-2 border rounded text-sm" value={newExec.comment} onChange={e => setNewExec({ ...newExec, comment: e.target.value })} />
                                    <button onClick={handleAddExecution} className="col-span-1 bg-brand-dark text-white rounded flex items-center justify-center hover:bg-gray-800"><Plus size={18} /></button>
                                </div>
                            </div>

                            {/* Tabla de Historial */}
                            <div className="space-y-3">
                                {activity.executions?.slice().reverse().map((exec, idx) => {
                                    const statusStyle = getStatusConfig(exec.status);
                                    return (
                                        <div key={exec._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-800">{exec.period}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${statusStyle.color}`}>
                                                        {statusStyle.icon} {statusStyle.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{exec.comment || "Sin comentarios."}</p>
                                                <p className="text-[10px] text-gray-400 mt-2">Registrado por: {exec.executedBy} • {new Date(exec.executedAt).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex items-center">
                                                {exec.evidenceUrl ? (
                                                    <a href={`${API_URL}${exec.evidenceUrl}`} target="_blank" className="flex items-center gap-1 text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded border border-blue-100">
                                                        <FileText size={14} /> Ver Evidencia
                                                    </a>
                                                ) : (
                                                    <label className="cursor-pointer flex items-center gap-1 text-xs text-gray-500 hover:text-brand-orange border border-dashed border-gray-300 px-3 py-1.5 rounded hover:border-brand-orange hover:bg-orange-50 transition-colors">
                                                        <Upload size={14} /> Subir Evidencia
                                                        <input type="file" className="hidden" onChange={(e) => handleExecutionUpload(e, exec._id)} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {!activity.executions?.length && <p className="text-center text-gray-400 italic py-4">No hay ejecuciones registradas en la bitácora.</p>}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
