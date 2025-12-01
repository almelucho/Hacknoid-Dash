import React from 'react';
import { Shield, Clock, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }) {
    // Formatear fecha
    const fecha = new Date(project.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    // Determinar color según el perfil (IG1, IG2, IG3)
    const getProfileColor = (profile) => {
        if (profile === 'IG3') return 'bg-purple-100 text-purple-700 border-purple-200';
        if (profile === 'IG2') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-green-100 text-green-700 border-green-200'; // IG1
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-brand-light p-3 rounded-full group-hover:bg-orange-50 transition-colors">
                    <Shield className="text-brand-dark group-hover:text-brand-orange" size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getProfileColor(project.targetProfile)}`}>
                    {project.targetProfile}
                </span>
            </div>

            <h3 className="font-bold text-lg text-brand-dark mb-1">{project.clientName}</h3>
            <p className="text-gray-500 text-sm mb-4">{project.projectName}</p>

            {/* Barra de Progreso (Simulada por ahora) */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                    className="bg-brand-orange h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.globalProgress || 0}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{fecha}</span>
                </div>
                <div className="flex items-center gap-1 text-brand-orange font-medium group-hover:translate-x-1 transition-transform">
                    Ver Auditoría <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
}
