import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Circle, Plus, Trash2, ToggleLeft, ToggleRight, FileText, Shield, BookOpen, Paperclip, Pencil } from 'lucide-react';
import ActivityDetailModal from './ActivityDetailModal';

export default function AuditView({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedControl, setExpandedControl] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedIds, setSelectedIds] = useState(null);

    // Estados Inputs
    const [newGeneralPolicyTitle, setNewGeneralPolicyTitle] = useState("");
    const [newControlTitle, setNewControlTitle] = useState("");
    const [addingControlPolicy, setAddingControlPolicy] = useState(null);
    const [newControlPolicyTitle, setNewControlPolicyTitle] = useState("");
    const [addingSafeguardTo, setAddingSafeguardTo] = useState(null);
    const [newSafeguardTitle, setNewSafeguardTitle] = useState("");
    const [addingActivityTo, setAddingActivityTo] = useState(null);
    const [newActivityTitle, setNewActivityTitle] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // --- HEADERS DE SEGURIDAD (LA LLAVE) ---
    const authHeaders = {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
    };

    const uploadHeaders = {
        'x-auth-token': localStorage.getItem('token')
        // Nota: No ponemos Content-Type aquí porque FormData lo pone solo
    };

    const fetchProject = () => {
        fetch(`${API_URL}/api/projects/${projectId}`, { headers: authHeaders })
            .then(res => {
                if (res.status === 401) { alert("Sesión expirada"); window.location.reload(); return; }
                return res.json();
            })
            .then(data => {
                if (data) { setProject(data); setLoading(false); }
            })
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchProject(); }, [projectId]);

    // --- SUBIDA DE ARCHIVOS (Con Token) ---
    const handleUpload = async (e, urlEndpoint) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}${urlEndpoint}`, {
                method: 'POST',
                headers: uploadHeaders, // <--- TOKEN
                body: formData
            });
            if (res.ok) fetchProject();
        } catch (error) { console.error(error); }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 100: return { label: "COMPLETADO", classes: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} /> };
            case 50: return { label: "EN PROGRESO", classes: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <AlertCircle size={14} /> };
            default: return { label: "NO INICIADO", classes: "bg-gray-100 text-gray-500 border-gray-200", icon: <Circle size={14} /> };
        }
    };

    // --- MANEJADORES (Todos usan authHeaders) ---

    // POLÍTICAS GENERALES
    const handleAddGeneralPolicy = async () => {
        if (!newGeneralPolicyTitle.trim()) return;
        await fetch(`${API_URL}/api/projects/${projectId}/policies`, {
            method: 'POST', headers: authHeaders, body: JSON.stringify({ title: newGeneralPolicyTitle })
        });
        setNewGeneralPolicyTitle(""); fetchProject();
    };
    const handleEditGeneralPolicy = async (pid, currentTitle) => {
        const newTitle = prompt("Nuevo nombre de la política:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            await fetch(`${API_URL}/api/projects/${projectId}/policies/${pid}`, {
                method: 'PUT', headers: authHeaders, body: JSON.stringify({ title: newTitle })
            });
            fetchProject();
        }
    };
    const handleGeneralStatus = async (pid, s) => {
        await fetch(`${API_URL}/api/projects/${projectId}/policies/${pid}`, {
            method: 'PATCH', headers: authHeaders, body: JSON.stringify({ status: s === 0 ? 50 : s === 50 ? 100 : 0 })
        });
        fetchProject();
    };
    const handleDeleteGeneral = async (pid) => {
        if (confirm("¿Borrar?")) await fetch(`${API_URL}/api/projects/${projectId}/policies/${pid}`, { method: 'DELETE', headers: authHeaders });
        fetchProject();
    };

    // CONTROLES MANUALES
    const handleAddControl = async () => {
        console.log("Attempting to add control:", newControlTitle);
        if (!newControlTitle) return;
        try {
            const res = await fetch(`${API_URL}/api/projects/${projectId}/controls`, {
                method: 'POST', headers: authHeaders, body: JSON.stringify({ title: newControlTitle })
            });
            console.log("Add control response:", res.status);
            if (!res.ok) {
                const errText = await res.text();
                console.error("Error adding control:", errText);
                alert("Error al crear control: " + errText);
            }
            setNewControlTitle(""); fetchProject();
        } catch (error) {
            console.error("Network error adding control:", error);
            alert("Error de red al crear control");
        }
    };
    const handleEditControl = async (id, currentTitle) => {
        const newTitle = prompt("Nuevo nombre del control:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${id}`, {
                method: 'PUT', headers: authHeaders, body: JSON.stringify({ title: newTitle })
            });
            fetchProject();
        }
    };
    const handleDeleteControl = async (id) => {
        if (confirm("¿Borrar control?")) await fetch(`${API_URL}/api/projects/${projectId}/controls/${id}`, { method: 'DELETE', headers: authHeaders });
        fetchProject();
    };

    // POLÍTICAS DE CONTROL
    const handleAddControlPolicy = async (cid) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/policies`, {
            method: 'POST', headers: authHeaders, body: JSON.stringify({ title: newControlPolicyTitle })
        });
        setNewControlPolicyTitle(""); setAddingControlPolicy(null); fetchProject();
    };
    const handleEditControlPolicy = async (cid, pid, currentTitle) => {
        const newTitle = prompt("Nuevo nombre de la política:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/policies/${pid}`, {
                method: 'PUT', headers: authHeaders, body: JSON.stringify({ title: newTitle })
            });
            fetchProject();
        }
    };
    const handleControlPolicyStatus = async (cid, pid, s) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/policies/${pid}`, {
            method: 'PATCH', headers: authHeaders, body: JSON.stringify({ status: s === 0 ? 50 : s === 50 ? 100 : 0 })
        });
        fetchProject();
    };
    const handleDeleteControlPolicy = async (cid, pid) => {
        if (confirm("¿Borrar?")) await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/policies/${pid}`, { method: 'DELETE', headers: authHeaders });
        fetchProject();
    };

    // SALVAGUARDAS
    const handleAddSafeguard = async (cid) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards`, {
            method: 'POST', headers: authHeaders, body: JSON.stringify({ title: newSafeguardTitle })
        });
        setNewSafeguardTitle(""); setAddingSafeguardTo(null); fetchProject();
    };
    const handleEditSafeguard = async (cid, sid, currentTitle) => {
        const newTitle = prompt("Nuevo nombre de la salvaguarda:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}`, {
                method: 'PUT', headers: authHeaders, body: JSON.stringify({ title: newTitle })
            });
            fetchProject();
        }
    };
    const handleDeleteSafeguard = async (cid, sid) => {
        if (confirm("¿Borrar?")) await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}`, { method: 'DELETE', headers: authHeaders });
        fetchProject();
    };
    const handleToggleApplicability = async (cid, sid, val) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}/applicability`, {
            method: 'PATCH', headers: authHeaders, body: JSON.stringify({ isApplicable: !val })
        });
        fetchProject();
    };

    // ACTIVIDADES
    const handleAddActivity = async (cid, sid) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}/activities`, {
            method: 'POST', headers: authHeaders, body: JSON.stringify({ title: newActivityTitle })
        });
        setNewActivityTitle(""); setAddingActivityTo(null); fetchProject();
    };
    const handleEditActivity = async (cid, sid, aid, currentTitle) => {
        const newTitle = prompt("Nuevo nombre de la actividad:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}/activities/${aid}`, {
                method: 'PUT', headers: authHeaders, body: JSON.stringify({ title: newTitle })
            });
            fetchProject();
        }
    };
    const handleActivityStatus = async (cid, sid, aid, s) => {
        await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}/activities/${aid}`, {
            method: 'PATCH', headers: authHeaders, body: JSON.stringify({ status: s === 0 ? 50 : s === 50 ? 100 : 0 })
        });
        fetchProject();
    };
    const handleDeleteActivity = async (cid, sid, aid) => {
        if (confirm("¿Borrar?")) await fetch(`${API_URL}/api/projects/${projectId}/controls/${cid}/safeguards/${sid}/activities/${aid}`, { method: 'DELETE', headers: authHeaders });
        fetchProject();
    };

    // --- RENDER (FileList y JSX Principal) ---
    const FileList = ({ files }) => (
        <div className="flex flex-wrap gap-2 mt-2 pl-2 w-full">
            {files && files.map((f, i) => (
                <a key={i} href={`${API_URL}${f.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:underline">
                    <FileText size={10} /> <span className="truncate max-w-[150px]">{f.name}</span>
                </a>
            ))}
        </div>
    );

    if (loading) return <div>Cargando...</div>;
    if (!project) return <div>Proyecto no encontrado</div>;

    return (
        <div className="animate-in fade-in pb-20">
            {console.log("Project Data:", project)}
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
                <button onClick={onBack}><ArrowLeft /></button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-brand-dark">{project.clientName}</h2>
                    <p className="text-sm text-gray-500">{project.projectName}</p>
                </div>
                <div className="text-right"><div className="text-xs font-bold text-gray-400">GLOBAL</div><div className="text-3xl font-bold text-brand-orange">{project.globalPercentage}%</div></div>
            </div>

            {/* 1. Políticas Generales */}
            <div className="bg-white rounded-xl border border-blue-200 mb-8 overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100"><h3 className="font-bold text-blue-900 flex gap-2"><BookOpen /> GOBERNANZA GENERAL</h3></div>
                <div className="p-4 space-y-3">
                    {(project.generalPolicies || []).map(pol => (
                        <div key={pol._id} className="mb-2 pb-2 border-b border-blue-100 last:border-0">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{pol.title}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleGeneralStatus(pol._id, pol.status)} className={`px-2 py-1 rounded text-xs font-bold border ${getStatusConfig(pol.status).classes}`}>{getStatusConfig(pol.status).label}</button>
                                    <label className="cursor-pointer text-gray-400 hover:text-blue-500 flex items-center gap-1">
                                        <input type="file" className="hidden" onChange={(e) => handleUpload(e, `/api/projects/${projectId}/policies/${pol._id}/evidence`)} />
                                        <Paperclip size={16} /> <span className="text-xs">Subir</span>
                                    </label>
                                    <button onClick={() => handleEditGeneralPolicy(pol._id, pol.title)} className="text-gray-300 hover:text-blue-500"><Pencil size={16} /></button>
                                    <button onClick={() => handleDeleteGeneral(pol._id)} className="text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <FileList files={pol.evidenceFiles} />
                        </div>
                    ))}
                    <div className="text-xs text-gray-400 mt-2">Debug: {project.generalPolicies?.length || 0} políticas encontradas.</div>
                    <div className="flex gap-2 mt-2">
                        <input type="text" placeholder="Nueva Política General..." className="border rounded px-2 flex-1" value={newGeneralPolicyTitle} onChange={e => setNewGeneralPolicyTitle(e.target.value)} />
                        <button onClick={handleAddGeneralPolicy} className="bg-blue-600 text-white px-3 rounded text-sm">Agregar</button>
                    </div>
                </div>
            </div>


            {/* 2. Controles */}
            <div className="space-y-4">
                {(project.controls || []).map(control => (
                    <div key={control._id} className="bg-white rounded-xl border shadow-sm">
                        <div onClick={() => setExpandedControl(expandedControl === control._id ? null : control._id)} className="p-5 flex justify-between cursor-pointer hover:bg-gray-50">
                            <div className="flex gap-4 items-center">
                                <div className="bg-brand-dark text-white w-8 h-8 flex items-center justify-center rounded font-bold">{control.controlNumber}</div>
                                <h3 className="font-bold">{control.title}</h3>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-brand-orange font-bold text-lg">{control.percentage}%</span>
                                <button onClick={(e) => { e.stopPropagation(); handleEditControl(control._id, control.title) }} className="text-gray-300 hover:text-blue-500"><Pencil size={18} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteControl(control._id) }} className="text-gray-300 hover:text-red-500"><Trash2 /></button>
                                {expandedControl === control._id ? <ChevronDown /> : <ChevronRight />}
                            </div>
                        </div>

                        {expandedControl === control._id && (
                            <div className="p-6 bg-gray-50 border-t space-y-6">
                                {/* Políticas Control */}
                                <div className="bg-white p-4 rounded border-l-4 border-blue-500 shadow-sm">
                                    <h4 className="font-bold text-blue-900 mb-2">POLÍTICAS DEL CONTROL</h4>
                                    {(control.controlPolicies || []).map(pol => (
                                        <div key={pol._id} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">{pol.title}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleControlPolicyStatus(control._id, pol._id, pol.status)} className={`px-2 py-1 rounded text-[10px] border ${getStatusConfig(pol.status).classes}`}>{getStatusConfig(pol.status).label}</button>
                                                    <label className="cursor-pointer text-gray-400 hover:text-blue-500"><input type="file" className="hidden" onChange={(e) => handleUpload(e, `/api/projects/${projectId}/controls/${control._id}/policies/${pol._id}/evidence`)} /><Paperclip size={14} /></label>
                                                    <button onClick={() => handleEditControlPolicy(control._id, pol._id, pol.title)} className="text-gray-300 hover:text-blue-500"><Pencil size={14} /></button>
                                                    <button onClick={() => handleDeleteControlPolicy(control._id, pol._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <FileList files={pol.evidenceFiles} />
                                        </div>
                                    ))}
                                    {/* Input Nueva Política Control */}
                                    {addingControlPolicy === control._id ? (
                                        <div className="flex gap-2 mt-2">
                                            <input autoFocus type="text" className="border rounded px-2 flex-1 text-sm" value={newControlPolicyTitle} onChange={e => setNewControlPolicyTitle(e.target.value)} />
                                            <button onClick={() => handleAddControlPolicy(control._id)} className="bg-blue-600 text-white px-2 text-xs rounded">OK</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAddingControlPolicy(control._id)} className="text-xs text-blue-600 mt-2">+ Nueva Política</button>
                                    )}
                                </div>

                                {/* Salvaguardas */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-gray-600">Salvaguardas</h4>
                                        {addingSafeguardTo !== control._id && <button onClick={() => setAddingSafeguardTo(control._id)} className="text-xs text-blue-600 font-bold">+ Nueva</button>}
                                    </div>
                                    {addingSafeguardTo === control._id && (
                                        <div className="flex gap-2 mb-2">
                                            <input autoFocus type="text" className="border rounded px-2 flex-1" value={newSafeguardTitle} onChange={e => setNewSafeguardTitle(e.target.value)} />
                                            <button onClick={() => handleAddSafeguard(control._id)} className="bg-blue-600 text-white px-2 rounded text-xs">Guardar</button>
                                        </div>
                                    )}

                                    {control.safeguards.map(sg => (
                                        <div key={sg._id} className={`bg-white border rounded mb-2 ${!sg.isApplicable && 'opacity-50'}`}>
                                            <div className="p-3 flex justify-between border-b">
                                                <span className="font-medium text-sm">{sg.title}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleToggleApplicability(control._id, sg._id, sg.isApplicable)} className={sg.isApplicable ? "text-brand-orange" : "text-gray-300"}>
                                                        {sg.isApplicable ? <ToggleRight /> : <ToggleLeft />}
                                                    </button>
                                                    <button onClick={() => handleEditSafeguard(control._id, sg._id, sg.title)} className="text-gray-300 hover:text-blue-500"><Pencil size={14} /></button>
                                                    <button onClick={() => handleDeleteSafeguard(control._id, sg._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            {sg.isApplicable && (
                                                <div className="p-3 bg-gray-50/50">
                                                    {sg.activities.map(act => (
                                                        <div key={act._id} className="bg-white p-2 rounded border mb-2 shadow-sm">
                                                            <div className="flex justify-between items-center">
                                                                <div
                                                                    className="flex-1 pr-4 cursor-pointer hover:opacity-70"
                                                                    onClick={() => {
                                                                        setSelectedActivity(act);
                                                                        setSelectedIds({ projectId, controlId: control._id, safeguardId: sg._id });
                                                                    }}
                                                                >
                                                                    <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                                        {act.title}
                                                                        {act.periodicity && <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">{act.periodicity}</span>}
                                                                    </h5>
                                                                    {act.comments?.length > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-1"><MessageSquare size={10} /> {act.comments.length}</span>}
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    <button onClick={() => handleActivityStatus(control._id, sg._id, act._id, act.status)} className={`px-2 py-1 rounded text-[10px] border ${getStatusConfig(act.status).classes}`}>{getStatusConfig(act.status).label}</button>
                                                                    <label className="cursor-pointer text-gray-400 hover:text-blue-500"><input type="file" className="hidden" onChange={(e) => handleUpload(e, `/api/projects/${projectId}/controls/${control._id}/safeguards/${sg._id}/activities/${act._id}/evidence`)} /><Paperclip size={14} /></label>
                                                                    <button onClick={() => handleEditActivity(control._id, sg._id, act._id, act.title)} className="text-gray-300 hover:text-blue-500"><Pencil size={14} /></button>
                                                                    <button onClick={() => handleDeleteActivity(control._id, sg._id, act._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                                </div>
                                                            </div>
                                                            <FileList files={act.evidenceFiles} />
                                                        </div>
                                                    ))}
                                                    {/* Input Actividad */}
                                                    {addingActivityTo === sg._id ? (
                                                        <div className="flex gap-2">
                                                            <input autoFocus type="text" className="border rounded px-2 flex-1 text-sm" value={newActivityTitle} onChange={e => setNewActivityTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddActivity(control._id, sg._id)} />
                                                            <button onClick={() => handleAddActivity(control._id, sg._id)} className="bg-orange-500 text-white px-2 rounded text-xs">OK</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => setAddingActivityTo(sg._id)} className="text-xs text-gray-400 hover:text-orange-500 flex items-center gap-1">+ Actividad</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 flex gap-2 items-center justify-center">
                    <input
                        type="text"
                        placeholder="Nombre del Nuevo Control..."
                        className="border rounded px-3 py-2 flex-1"
                        value={newControlTitle}
                        onChange={e => setNewControlTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddControl()}
                    />
                    <button onClick={handleAddControl} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                        + Crear Control
                    </button>
                </div>
            </div>

            {selectedActivity && selectedIds && (
                <ActivityDetailModal
                    activity={selectedActivity} ids={selectedIds}
                    onClose={() => setSelectedActivity(null)}
                    onUpdate={() => { fetchProject(); setSelectedActivity(null); }}
                />
            )}
        </div>
    );
}
