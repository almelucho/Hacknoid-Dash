import React from 'react';
import { LayoutDashboard, ShieldCheck, Building, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout, onNavigate }) {
    // Leer el rol del usuario guardado
    const userRole = localStorage.getItem('userRole');

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

                {/* 🔒 CANDADO VISUAL: Solo mostrar si es ADMIN */}
                {userRole === 'admin' && (
                    <button
                        onClick={() => onNavigate('clients')}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors text-left font-medium"
                    >
                        <Building size={20} /> Gestión Clientes
                    </button>
                )}
            </nav>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-gray-700">
                <div className="mb-4 px-2">
                    <p className="text-xs text-gray-500 uppercase font-bold">Conectado como:</p>
                    <p className="text-sm font-medium text-brand-orange truncate">
                        {userRole === 'admin' ? 'Super Administrador' : 'Auditor Cliente'}
                    </p>
                </div>
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
