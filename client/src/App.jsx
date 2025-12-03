import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectCard from './components/ProjectCard';
import AuditView from './components/AuditView';
import ClientsView from './components/ClientsView';
import Login from './components/Login';
import CreateProjectModal from './components/CreateProjectModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiado a false inicial para no bloquear login
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- 1. FUNCIÓN HELPER PARA HEADERS CON TOKEN ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'x-auth-token': token
    };
  };

  // --- 2. CARGAR PROYECTOS (Protegido) ---
  const loadProjects = () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // Si no hay token, no intentamos cargar nada
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/projects`, {
      method: 'GET',
      headers: getAuthHeaders() // <--- AQUÍ VA LA LLAVE
    })
      .then(res => {
        if (res.status === 401) {
          handleLogout(); // Si el token venció, sacar al usuario
          throw new Error("Sesión expirada");
        }
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Verificar sesión al inicio
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      loadProjects();
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setView('dashboard');
    loadProjects(); // Cargar datos recién logueado
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setProjects([]);
    setView('dashboard');
  };

  // --- GESTIÓN DE PROYECTOS (Protegida) ---

  // Editar (Renombrar)
  const handleEditProject = async (project) => {
    const newClient = prompt("Nuevo Cliente:", project.clientName);
    if (newClient === null) return;
    const newProjectName = prompt("Nuevo Proyecto:", project.projectName);
    if (newProjectName === null) return;

    try {
      await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // <--- LLAVE
        body: JSON.stringify({
          clientName: newClient || project.clientName,
          projectName: newProjectName || project.projectName
        })
      });
      loadProjects();
    } catch (error) { console.error(error); }
  };

  // Eliminar
  const handleDeleteProject = async (id) => {
    if (!confirm("⚠️ ¿Borrar proyecto permanentemente?")) return;

    try {
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // <--- LLAVE
      });
      loadProjects();
    } catch (error) { console.error(error); }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-brand-light font-sans text-brand-dark">
      <Sidebar onLogout={handleLogout} onNavigate={setView} />

      <main className="flex-1 ml-64 p-8">

        {view === 'dashboard' && (
          <>
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <p className="text-gray-500 mt-1">Gestión de Auditorías</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-orange text-white px-6 py-3 rounded-lg shadow font-bold"
              >
                + Nuevo Proyecto
              </button>
            </header>

            {!loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? projects.map((project) => (
                  <div key={project._id} onClick={() => { setSelectedProjectId(project._id); setView('audit'); }}>
                    <ProjectCard
                      project={project}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                    />
                  </div>
                )) : (
                  <div className="col-span-full py-20 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
                    No hay proyectos visibles para tu usuario.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20">Cargando proyectos...</div>
            )}
          </>
        )}

        {/* VISTA AUDITORÍA (Le pasamos el token implícitamente via localStorage, 
            pero idealmente AuditView también debería usar getAuthHeaders. 
            Por ahora arreglamos el dashboard) */}
        {view === 'audit' && (
          <AuditView
            projectId={selectedProjectId}
            onBack={() => { setView('dashboard'); loadProjects(); }}
          />
        )}

        {view === 'clients' && (currentUser?.role === 'admin' || localStorage.getItem('userRole') === 'admin') && <ClientsView />}

        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onProjectCreated={loadProjects}
          />
        )}

      </main>
    </div>
  );
}

export default App;
