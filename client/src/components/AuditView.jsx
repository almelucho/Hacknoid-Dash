import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Circle, Plus, Trash2, ToggleLeft, ToggleRight, ShieldAlert } from 'lucide-react';

export default function AuditView({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [expandedControl, setExpandedControl] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para formularios rápidos
    const [newControlTitle, setNewControlTitle] = useState("");
    const [addingSafeguardTo, setAddingSafeguardTo] = useState(null); // ID del control
    const [newSafeguardTitle, setNewSafeguardTitle] = useState("");
    const [addingActivityTo, setAddingActivityTo] = useState(null);
    const [newActivityTitle, setNewActivityTitle] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchProject = () => {
        fetch(`${API_URL}/api/projects/${projectId}`)
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchProject(); }, [projectId]);

    // --- ACCIONES DE CONTROL ---
    const handleAddControl = async () => {
        if (!newControlTitle) return;
        await fetch(`${API_URL}/api/projects/${projectId}/controls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newControlTitle, description: "Control manual", controlNumber: project.controls.length + 1 })
        });
        setNewControlTitle("");
        fetchProject();
    };

    const handleDeleteControl = async (controlId) => {
        if (!confirm("¿Eliminar este control y todo su contenido?")) return;
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}`, { method: 'DELETE' });
        fetchProject();
    };

    // --- ACCIONES DE SALVAGUARDA ---
    const handleAddSafeguard = async (controlId) => {
        if (!newSafeguardTitle) return;
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newSafeguardTitle, description: "Salvaguarda manual" })
        });
        setNewSafeguardTitle("");
        setAddingSafeguardTo(null);
        fetchProject();
    };

    const handleDeleteSafeguard = async (controlId, safeguardId) => {
        if (!confirm("¿Eliminar salvaguarda?")) return;
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}`, { method: 'DELETE' });
        fetchProject();
    };

    // --- ACCIONES EXISTENTES ---
    const handleToggleApplicability = async (controlId, safeguardId, currentStatus) => {
        const newStatus = !currentStatus;
        // Optimista
        const updatedProject = { ...project };
        const control = updatedProject.controls.find(c => c._id === controlId);
        const sg = control.safeguards.find(s => s._id === safeguardId);
        sg.isApplicable = newStatus;
        setProject(updatedProject);

        try {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/applicability`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApplicable: newStatus })
            });
            fetchProject();
        } catch (error) {
            console.error("Error toggle:", error);
        }
    };

    const handleAddActivity = async (controlId, safeguardId) => {
        if (!newActivityTitle.trim()) return;
        try {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newActivityTitle, description: "Actividad manual" })
            });
            setNewActivityTitle("");
            setAddingActivityTo(null);
            fetchProject();
        } catch (error) {
            console.error("Error creating activity:", error);
        }
    };

    const handleStatusClick = async (controlId, safeguardId, activityId, currentStatus) => {
        let newStatus = currentStatus === 0 ? 50 : currentStatus === 50 ? 100 : 0;
        // Optimista
        const updatedProject = { ...project };
        const control = updatedProject.controls.find(c => c._id === controlId);
        const sg = control.safeguards.find(s => s._id === safeguardId);
        const act = sg.activities.find(a => a._id === activityId);
        act.status = newStatus;
        setProject(updatedProject);

        try {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/activities/${activityId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchProject();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteActivity = async (controlId, safeguardId, activityId) => {
        if (!confirm("¿Eliminar actividad?")) return;
        try {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/activities/${activityId}`, { method: 'DELETE' });
            fetchProject();
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    // Configuración visual de los estados
    const getStatusConfig = (status) => {
        switch (status) {
            case 100:
                return {
                    label: "COMPLETADO",
                    classes: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
                    icon: <CheckCircle size={16} />
                };
            case 50:
                return {
                    label: "EN PROGRESO",
                    classes: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
                    icon: <AlertCircle size={16} />
                };
            default: // 0
                return {
                    label: "NO INICIADO",
                    classes: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200",
                    icon: <Circle size={16} />
                };
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;
    if (!project) return <div className="p-10 text-center text-red-500">No se encontró el proyecto.</div>;

    return (
        <div className="animate-in fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-brand-light py-4 z-10">
                <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-brand-dark">{project.clientName}</h2>
                    <span className="text-xs bg-brand-orange text-white px-2 py-1 rounded-full">{project.targetProfile}</span>
                </div>
            </div>

            <div className="space-y-4">
                {project.controls.map((control) => (
                    <div key={control._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header Control */}
                        <div className="p-5 flex items-center justify-between group bg-white hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setExpandedControl(expandedControl === control._id ? null : control._id)}>
                                <div className="bg-brand-dark text-white w-10 h-10 rounded flex items-center justify-center font-bold">
                                    {control.controlNumber}
                                </div>
                                <h3 className="font-bold text-lg text-brand-dark">{control.title}</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={() => handleDeleteControl(control._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar Control">
                                    <Trash2 size={18} />
                                </button>
                                <div className="text-right mr-2">
                                    <div className="text-xs text-gray-400 font-bold">CUMPLIMIENTO</div>
                                    <div className="text-xl font-bold text-brand-orange">{control.percentage}%</div>
                                </div>
                                {expandedControl === control._id ? <ChevronDown /> : <ChevronRight />}
                            </div>
                        </div>

                        {/* Body Control */}
                        {expandedControl === control._id && (
                            <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-6">

                                {/* Botón Nueva Salvaguarda */}
                                <div className="flex justify-end">
                                    {addingSafeguardTo === control._id ? (
                                        <div className="flex gap-2 w-full animate-in fade-in slide-in-from-top-2">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Título de la nueva salvaguarda..."
                                                className="flex-1 px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-brand-orange focus:outline-none"
                                                value={newSafeguardTitle}
                                                onChange={e => setNewSafeguardTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSafeguard(control._id)}
                                            />
                                            <button onClick={() => handleAddSafeguard(control._id)} className="bg-brand-dark text-white px-4 rounded hover:bg-gray-800 transition-colors">Guardar</button>
                                            <button onClick={() => setAddingSafeguardTo(null)} className="text-gray-500 px-2 hover:text-gray-700">✕</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAddingSafeguardTo(control._id)} className="text-sm font-bold text-brand-dark flex items-center gap-1 hover:underline decoration-brand-orange decoration-2 underline-offset-4">
                                            <Plus size={16} /> Nueva Salvaguarda
                                        </button>
                                    )}
                                </div>

                                {control.safeguards.map((sg) => (
                                    <div key={sg._id} className={`rounded-lg border ${sg.isApplicable ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200 opacity-75'}`}>
                                        <div className="p-4 flex justify-between items-start border-b border-gray-100">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono font-bold bg-gray-200 px-1 rounded">{sg.templateRef}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sg.isApplicable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                        {sg.isApplicable ? 'APLICA' : 'NO APLICA'}
                                                    </span>
                                                </div>
                                                <h4 className={`font-semibold ${sg.isApplicable ? 'text-gray-800' : 'text-gray-500 line-through'}`}>
                                                    {sg.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">{sg.description}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* Toggle Aplicabilidad */}
                                                <button
                                                    onClick={() => handleToggleApplicability(control._id, sg._id, sg.isApplicable)}
                                                    className={`transition-colors ${sg.isApplicable ? 'text-brand-orange' : 'text-gray-400'}`}
                                                    title={sg.isApplicable ? "Marcar como No Aplica" : "Marcar como Aplicable"}
                                                >
                                                    {sg.isApplicable ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </button>
                                                {/* Eliminar Salvaguarda */}
                                                <button onClick={() => handleDeleteSafeguard(control._id, sg._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Eliminar Salvaguarda">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* --- NIVEL 3: ACTIVIDADES (Solo si aplica) --- */}
                                        {sg.isApplicable && (
                                            <div className="p-4 bg-gray-50/50">
                                                {sg.activities.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {sg.activities.map((act) => (
                                                            <div key={act._id} className="group/act flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">

                                                                {/* IZQUIERDA: Título y Descripción */}
                                                                <div className="flex-1 pr-4">
                                                                    <h5 className="text-sm font-bold text-gray-800">{act.title}</h5>
                                                                    {act.description && (
                                                                        <p className="text-xs text-gray-500 mt-1">{act.description}</p>
                                                                    )}
                                                                </div>

                                                                {/* DERECHA: Botón de Estado Interactivo */}
                                                                <div className="flex items-center gap-3">

                                                                    {/* EL NUEVO BOTÓN DE ESTADO MEJORADO */}
                                                                    {(() => {
                                                                        const config = getStatusConfig(act.status);
                                                                        return (
                                                                            <button
                                                                                onClick={() => handleStatusClick(control._id, sg._id, act._id, act.status)}
                                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all transform active:scale-95 ${config.classes}`}
                                                                                title="Clic para avanzar: 0% → 50% → 100%"
                                                                            >
                                                                                {config.icon}
                                                                                <span>{config.label}</span>
                                                                            </button>
                                                                        );
                                                                    })()}

                                                                    {/* Botón Eliminar (Visible al pasar el mouse) */}
                                                                    <button
                                                                        onClick={() => handleDeleteActivity(control._id, sg._id, act._id)}
                                                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover/act:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50"
                                                                        title="Eliminar Actividad"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic mb-3">No hay actividades creadas.</p>
                                                )}

                                                {/* Botón Agregar Actividad */}
                                                {addingActivityTo === sg._id ? (
                                                    <div className="mt-3 flex gap-2 animate-in fade-in">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            placeholder="Nombre de la nueva tarea..."
                                                            className="flex-1 px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none"
                                                            value={newActivityTitle}
                                                            onChange={(e) => setNewActivityTitle(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddActivity(control._id, sg._id)}
                                                        />
                                                        <button
                                                            onClick={() => handleAddActivity(control._id, sg._id)}
                                                            className="bg-brand-orange text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button onClick={() => setAddingActivityTo(null)} className="text-gray-500 px-2 hover:text-gray-700">✕</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAddingActivityTo(sg._id)}
                                                        className="mt-3 text-sm text-brand-orange font-medium flex items-center gap-1 hover:underline"
                                                    >
                                                        <Plus size={16} /> Agregar Actividad Manual
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Botón Crear Control Nuevo (Abajo del todo) */}
                <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex gap-4 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Nombre del Nuevo Control..."
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-dark focus:outline-none"
                            value={newControlTitle}
                            onChange={(e) => setNewControlTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddControl()}
                        />
                        <button
                            onClick={handleAddControl}
                            className="bg-brand-dark text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm whitespace-nowrap"
                        >
                            + Crear Control
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">Añade controles personalizados fuera del estándar CIS si es necesario.</p>
                </div>
            </div>
        </div>
    );
}
