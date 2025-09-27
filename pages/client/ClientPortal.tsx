import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProjectsByClientId } from '../../services/projects';
import { getFilesByProjectId } from '../../services/files';
import { Project, File as ProjectFile, ProjectStatus } from '../../types';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const statusColors: Record<ProjectStatus, string> = {
    planning: 'bg-gray-500/20 text-gray-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    review: 'bg-yellow-500/20 text-yellow-300',
    done: 'bg-green-500/20 text-green-300',
};

const ClientPortal: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [files, setFiles] = useState<Record<string, ProjectFile[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.clientId) return;

        const fetchData = async () => {
            setLoading(true);
            const projectsData = await getProjectsByClientId(user.clientId!);
            setProjects(projectsData);
            
            const filesData: Record<string, ProjectFile[]> = {};
            for (const project of projectsData) {
                filesData[project.id] = await getFilesByProjectId(project.id);
            }
            setFiles(filesData);

            setLoading(false);
        };

        fetchData();
    }, [user]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading your portal...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-foreground mb-4">Welcome, {user?.name}</h1>
                <p className="text-lg text-muted-foreground mb-12">Here's an overview of your projects with us.</p>
                
                <div className="space-y-12">
                    {projects.length > 0 ? projects.map(project => (
                        <div key={project.id} className="uiverse-card">
                             <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                             <div className="uiverse-card-content relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                                        <p className="text-sm text-muted-foreground">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[project.status]}`}>
                                        {project.status.replace('-', ' ')}
                                    </span>
                                </div>
                                
                                <p className="text-muted-foreground mb-6">{project.description}</p>
                                
                                <div>
                                    <h3 className="font-semibold text-foreground mb-3">Project Files</h3>
                                    <div className="space-y-2">
                                        {files[project.id]?.length > 0 ? files[project.id].map(file => (
                                            <a 
                                                key={file.id} 
                                                href={file.path} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex items-center gap-3 p-3 bg-glass rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                                                <span className="text-sm font-medium text-foreground">{file.name}</span>
                                            </a>
                                        )) : (
                                            <p className="text-sm text-muted-foreground p-3 bg-glass rounded-lg">No files uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </div>
                    )) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold">No projects yet</h2>
                            <p className="text-muted-foreground">Once we start a project for you, it will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ClientPortal;
