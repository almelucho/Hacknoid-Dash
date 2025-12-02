import React from 'react';
import { LayoutDashboard, ShieldCheck, Building, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout, onNavigate }) {
    return (
        <div className="h-screen w-64 bg-brand-dark text-white flex flex-col fixed left-0 top-0 shadow-xl z-20">

            {/* Logo / Header */}
            <div className="p-6 border-b border-gray-700 flex items-center gap-3">
                <div className="bg-brand-orange p-2 rounded-lg">
                    <ShieldCheck size={24} />
                </div>
                <h1 className="font-bold text-lg tracking-wide">HACKNOID <span className="text-brand-orange">DASH</span></h1>
            </div>

            {/* Navegación */}
            <nav className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors text-left font-medium"
                >
                    <LayoutDashboard size={20} /> Dashboard
                </button>

                <button
                    onClick={() => onNavigate('clients')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors text-left font-medium"
                >
                    <Building size={20} /> Clientes
                </button>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-2 rounded hover:bg-gray-800"
                >
                    <LogOut size={20} /> Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
