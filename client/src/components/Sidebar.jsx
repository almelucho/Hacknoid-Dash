import React from 'react';
import { LayoutDashboard, ShieldCheck, FileText, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="h-screen w-64 bg-brand-dark text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-700 flex items-center gap-3">
                <div className="bg-brand-orange p-2 rounded-lg">
                    <ShieldCheck size={24} />
                </div>
                <h1 className="font-bold text-lg tracking-wide">HACKNOID <span className="text-brand-orange">DASH</span></h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <a href="#" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-brand-orange font-medium">
                    <LayoutDashboard size={20} /> Dashboard
                </a>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
                    <FileText size={20} /> Proyectos
                </a>
                <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 transition-colors">
                    <Settings size={20} /> Configuración
                </a>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
                    <LogOut size={20} /> Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
