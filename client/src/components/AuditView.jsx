import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Circle, Shield } from 'lucide-react';

export default function AuditView({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [expandedControl, setExpandedControl] = useState(null);
    const [loading, setLoading] = useState(true);

    // URL flexible para Docker/Local
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/projects/${projectId}`)
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando proyecto:", err);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) return <div className="p-10 text-center text-gray-500">Cargando datos de auditoría...</div>;
    if (!project) return <div className="p-10 text-center text-red-500">No se encontró el proyecto.</div>;

    // Función para manejar el clic en el estado
    const handleStatusClick = async (controlId, activityId, currentStatus) => {
        // Ciclo de estados: 0 -> 50 -> 100 -> 0
        let newStatus = 0;
        if (currentStatus === 0) newStatus = 50;
        else if (currentStatus === 50) newStatus = 100;
        else newStatus = 0;

        // Actualización optimista (UI primero)
        const updatedProject = { ...project };
        const control = updatedProject.controls.find(c => c._id === controlId);
        const activity = control.activities.find(a => a._id === activityId);
        activity.status = newStatus;
        setProject(updatedProject);

        // Llamada al Backend
        try {
            const res = await fetch(`${API_URL}/api/projects/${projectId}/controls/${controlId}/activities/${activityId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const data = await res.json();
                // Actualizar con el porcentaje real calculado por el servidor
                control.percentage = data.controlPercentage;
                setProject({ ...updatedProject }); // Forzar re-render
            }
        } catch (error) {
            console.error("Error actualizando:", error);
            // Revertir si falla (opcional)
        }
    };

    // Función para elegir icono según estado (0, 50, 100)
    const getStatusIcon = (status) => {
        if (status === 100) return <CheckCircle className="text-green-500" size={20} />;
        if (status === 50) return <AlertCircle className="text-yellow-500" size={20} />;
        return <Circle className="text-gray-300" size={20} />;
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* --- HEADER DEL PROYECTO --- */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeft className="text-brand-dark" size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                        {project.clientName}
                        <span className="text-sm font-normal bg-brand-orange/10 text-brand-orange px-2 py-1 rounded border border-brand-orange/20">
                            {project.targetProfile}
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm">{project.projectName}</p>
                </div>
            </div>

            {/* --- LISTA DE CONTROLES (ACORDEÓN) --- */}
            <div className="space-y-4 pb-20">
                {project.controls.map((control) => (
                    <div key={control._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">

                        {/* Cabecera Clickeable */}
                        <div
                            onClick={() => setExpandedControl(expandedControl === control._id ? null : control._id)}
                            className="p-5 flex items-center justify-between cursor-pointer group bg-white hover:bg-gray-50/50"
                        >
                            <div className="flex items-center gap-4">
                                {/* Badge con número del control */}
                                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-colors
                  ${expandedControl === control._id ? 'bg-brand-orange text-white' : 'bg-brand-dark text-white'}
                `}>
                                    {control.controlNumber}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-orange transition-colors">
                                        {control.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {control.activities.length} actividades
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avance</div>
                                    <div className="text-xl font-bold text-brand-dark">{control.percentage || 0}%</div>
                                </div>
                                {expandedControl === control._id ?
                                    <ChevronDown className="text-brand-orange" size={24} /> :
                                    <ChevronRight className="text-gray-300" size={24} />
                                }
                            </div>
                        </div>

                        {/* Cuerpo Desplegable (Actividades) */}
                        {expandedControl === control._id && (
                            <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-3 animation-slide-down">
                                {control.activities.length === 0 ? (
                                    <p className="text-center text-gray-400 italic py-4">No aplican actividades para este perfil.</p>
                                ) : (
                                    control.activities.map((activity) => (
                                        <div key={activity._id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-brand-orange/30 transition-colors flex justify-between group/item">
                                            <div className="flex gap-4">
                                                <div
                                                    className="mt-1 cursor-pointer hover:scale-110 transition-transform"
                                                    title="Clic para cambiar estado"
                                                    onClick={() => handleStatusClick(control._id, activity._id, activity.status)}
                                                >
                                                    {getStatusIcon(activity.status)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                            {activity.templateRef}
                                                        </span>
                                                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Botón placeholder para editar (Fase 3) */}
                                            <button className="text-xs font-medium text-gray-400 hover:text-brand-orange opacity-0 group-hover/item:opacity-100 transition-opacity self-center px-3 py-2">
                                                Gestionar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
