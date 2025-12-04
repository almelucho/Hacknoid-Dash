import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Send, FileText, User } from 'lucide-react';

export default function ActivityDetailModal({ activity, ids, onClose, onUpdate }) {
    const [comment, setComment] = useState("");
    const [periodicity, setPeriodicity] = useState(activity.periodicity || "Única");
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'x-auth-token': token };

    const handlePeriodicityChange = async (newVal) => {
        setPeriodicity(newVal);
        await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/details`, {
            method: 'PATCH', headers, body: JSON.stringify({ periodicity: newVal })
        });
        onUpdate();
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setLoading(true);
        await fetch(`${API_URL}/api/projects/${ids.projectId}/controls/${ids.controlId}/safeguards/${ids.safeguardId}/activities/${activity._id}/comments`, {
            method: 'POST', headers, body: JSON.stringify({ text: comment })
        });
        setComment(""); setLoading(false); onUpdate();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b bg-gray-50 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark">{activity.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-2 inline-block ${activity.status === 100 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {activity.status === 100 ? 'COMPLETADO' : activity.status === 50 ? 'EN PROGRESO' : 'NO INICIADO'}
                        </span>
                    </div>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-red-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Periodicidad */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
                        <Calendar className="text-blue-600" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-blue-900">Frecuencia</p>
                            <p className="text-xs text-blue-600">Recurrencia de la tarea.</p>
                        </div>
                        <select value={periodicity} onChange={(e) => handlePeriodicityChange(e.target.value)} className="border rounded px-3 py-1 text-sm outline-none">
                            <option>Única</option><option>Semanal</option><option>Mensual</option><option>Trimestral</option><option>Anual</option>
                        </select>
                    </div>

                    {/* Archivos (Solo lectura aquí) */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><FileText size={14} /> Evidencias ({activity.evidenceFiles?.length || 0})</h4>
                        <div className="flex flex-wrap gap-2">
                            {activity.evidenceFiles?.map((f, i) => (
                                <a key={i} href={`${API_URL}${f.url}`} target="_blank" className="flex items-center gap-2 p-2 rounded border text-xs text-blue-600 hover:bg-blue-50">
                                    <FileText size={14} /> {f.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="flex flex-col h-64 border rounded-xl overflow-hidden bg-gray-50">
                        <div className="p-3 border-b bg-white text-xs font-bold text-gray-500"><MessageSquare size={14} className="inline mr-2" /> BITÁCORA</div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {activity.comments?.map((c, i) => (
                                <div key={i} className={`flex flex-col ${c.role === 'admin' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-xl text-sm max-w-[85%] ${c.role === 'admin' ? 'bg-brand-orange text-white' : 'bg-white border'}`}>
                                        <p>{c.text}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1">{c.user} • {new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendComment} className="p-2 border-t bg-white flex gap-2">
                            <input type="text" placeholder="Comentario..." className="flex-1 px-3 py-2 bg-gray-100 rounded outline-none" value={comment} onChange={e => setComment(e.target.value)} />
                            <button type="submit" className="p-2 bg-brand-dark text-white rounded"><Send size={16} /></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
