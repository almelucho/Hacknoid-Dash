import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectCard from './components/ProjectCard';
import AuditView from './components/AuditView'; // <--- Importamos el componente nuevo

function App() {
  // Estado de navegación simple: 'dashboard' o 'audit'
  const [view, setView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Función para cargar proyectos
  const loadProjects = () => {
    setLoading(true);
    fetch(`${API_URL}/api/projects`)
      .then(res => {
        if (!res.ok) throw new Error('Error conectando al servidor');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo conectar con el Backend Dockerizado.');
        setLoading(false);
      });
  };

  // Cargar al inicio
  useEffect(() => {
    loadProjects();
  }, []);

  // Manejador: Ir a Auditoría
  const handleOpenProject = (id) => {
    setSelectedProjectId(id);
    setView('audit');
  };

  // Manejador: Volver al Dashboard
  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedProjectId(null);
    loadProjects(); // Recargar datos para ver progresos actualizados
  };

  return (
    <div className="flex min-h-screen bg-brand-light font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">

        {/* --- VISTA: DASHBOARD --- */}
        {view === 'dashboard' && (
          <>
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-brand-dark">Dashboard General</h2>
                <p className="text-gray-500 mt-1">Gestión de Auditorías CIS v8.1</p>
              </div>
              <button className="bg-brand-orange text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium">
                <span>+</span> Nuevo Proyecto
              </button>
            </header>

            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-orange"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded border-l-4 border-red-500">
                Error: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project._id} onClick={() => handleOpenProject(project._id)}>
                      <ProjectCard project={project} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
                    <p className="text-gray-400">No hay proyectos activos.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* --- VISTA: AUDITORÍA DETALLADA --- */}
        {view === 'audit' && selectedProjectId && (
          <AuditView
            projectId={selectedProjectId}
            onBack={handleBackToDashboard}
          />
        )}

      </main>
    </div>
  );
}

export default App;
