import type { Task } from "../types/Task";

export const testTasks: Task[] = [
    // Task di questa settimana (settimana corrente)
    {
        id: "1",
        title: "Meeting con il team",
        description: "Discussione sui prossimi obiettivi del progetto",
        startTime: new Date(2025, 0, 20), // 20 Gennaio 2025
        endTime: new Date(2025, 0, 20), // 20 Gennaio 2025
        color: "#3b82f6",
        priority: "high",
        completed: false,
        category: "Meeting",
    },
    {
        id: "2",
        title: "Revisione documentazione",
        description: "Controllo e aggiornamento della documentazione tecnica",
        startTime: new Date(2025, 0, 21), // 21 Gennaio 2025
        endTime: new Date(2025, 0, 23), // 23 Gennaio 2025
        color: "#f59e0b",
        priority: "medium",
        completed: false,
        category: "Documentazione",
    },
    {
        id: "3",
        title: "Sviluppo feature login",
        description: "Implementazione del sistema di autenticazione",
        startTime: new Date(2025, 0, 22), // 22 Gennaio 2025
        endTime: new Date(2025, 0, 24), // 24 Gennaio 2025
        color: "#10b981",
        priority: "high",
        completed: false,
        category: "Sviluppo",
    },
    {
        id: "4",
        title: "Test di integrazione",
        description: "Esecuzione dei test end-to-end",
        startTime: new Date(2025, 0, 23), // 23 Gennaio 2025
        endTime: new Date(2025, 0, 25), // 25 Gennaio 2025
        color: "#ef4444",
        priority: "medium",
        completed: false,
        category: "Testing",
    },
    {
        id: "5",
        title: "Design review",
        description: "Revisione delle interfacce utente",
        startTime: new Date(2025, 0, 24), // 24 Gennaio 2025
        endTime: new Date(2025, 0, 24), // 24 Gennaio 2025
        color: "#8b5cf6",
        priority: "low",
        completed: true,
        category: "Design",
    },
    {
        id: "6",
        title: "Deploy in produzione",
        description: "Pubblicazione della nuova versione",
        startTime: new Date(2025, 0, 25), // 25 Gennaio 2025
        endTime: new Date(2025, 0, 26), // 26 Gennaio 2025
        color: "#06b6d4",
        priority: "high",
        completed: false,
        category: "DevOps",
    },
    {
        id: "7",
        title: "Analisi performance",
        description: "Ottimizzazione delle prestazioni dell'applicazione",
        startTime: new Date(2025, 0, 26), // 26 Gennaio 2025
        endTime: new Date(2025, 0, 27), // 27 Gennaio 2025
        color: "#84cc16",
        priority: "medium",
        completed: false,
        category: "Analisi",
    },

    // Task che si estendono su più settimane
    {
        id: "8",
        title: "Refactoring del codice",
        description: "Miglioramento della struttura del codice esistente",
        startTime: new Date(2025, 0, 20), // 20 Gennaio 2025
        endTime: new Date(2025, 0, 31), // 31 Gennaio 2025
        color: "#f97316",
        priority: "medium",
        completed: false,
        category: "Sviluppo",
    },
    {
        id: "9",
        title: "Migrazione database",
        description: "Aggiornamento della struttura del database",
        startTime: new Date(2025, 0, 22), // 22 Gennaio 2025
        endTime: new Date(2025, 1, 5), // 5 Febbraio 2025
        color: "#ec4899",
        priority: "high",
        completed: false,
        category: "Database",
    },

    // Task completati
    {
        id: "10",
        title: "Setup ambiente di sviluppo",
        description: "Configurazione dell'ambiente di sviluppo locale",
        startTime: new Date(2025, 0, 15), // 15 Gennaio 2025
        endTime: new Date(2025, 0, 16), // 16 Gennaio 2025
        color: "#6b7280",
        priority: "low",
        completed: true,
        category: "Setup",
    },
    {
        id: "11",
        title: "Code review PR #123",
        description: "Revisione del pull request per la feature di notifiche",
        startTime: new Date(2025, 0, 17), // 17 Gennaio 2025
        endTime: new Date(2025, 0, 18), // 18 Gennaio 2025
        color: "#059669",
        priority: "medium",
        completed: true,
        category: "Code Review",
    },
    {
        id: "12",
        title: "Aggiornamento dipendenze",
        description: "Aggiornamento delle librerie di terze parti",
        startTime: new Date(2025, 0, 18), // 18 Gennaio 2025
        endTime: new Date(2025, 0, 19), // 19 Gennaio 2025
        color: "#7c3aed",
        priority: "low",
        completed: true,
        category: "Manutenzione",
    },

    // Task futuri
    {
        id: "13",
        title: "Implementazione API REST",
        description: "Sviluppo delle API per il frontend",
        startTime: new Date(2025, 1, 3), // 3 Febbraio 2025
        endTime: new Date(2025, 1, 10), // 10 Febbraio 2025
        color: "#3b82f6",
        priority: "high",
        completed: false,
        category: "Sviluppo",
    },
    {
        id: "14",
        title: "Sicurezza audit",
        description: "Controllo della sicurezza dell'applicazione",
        startTime: new Date(2025, 1, 5), // 5 Febbraio 2025
        endTime: new Date(2025, 1, 7), // 7 Febbraio 2025
        color: "#dc2626",
        priority: "high",
        completed: false,
        category: "Sicurezza",
    },
    {
        id: "15",
        title: "Training team",
        description: "Formazione del team su nuove tecnologie",
        startTime: new Date(2025, 1, 8), // 8 Febbraio 2025
        endTime: new Date(2025, 1, 12), // 12 Febbraio 2025
        color: "#0891b2",
        priority: "medium",
        completed: false,
        category: "Formazione",
    },

    // Task con diverse priorità per testare i filtri
    {
        id: "16",
        title: "Bug fix critico",
        description: "Risoluzione di un bug che causa crash dell'app",
        startTime: new Date(2025, 0, 27), // 27 Gennaio 2025
        endTime: new Date(2025, 0, 27), // 27 Gennaio 2025
        color: "#dc2626",
        priority: "high",
        completed: false,
        category: "Bug Fix",
    },
    {
        id: "17",
        title: "Aggiornamento README",
        description: "Documentazione del progetto",
        startTime: new Date(2025, 0, 28), // 28 Gennaio 2025
        endTime: new Date(2025, 0, 28), // 28 Gennaio 2025
        color: "#059669",
        priority: "low",
        completed: false,
        category: "Documentazione",
    },
    {
        id: "18",
        title: "Ottimizzazione query",
        description: "Miglioramento delle performance delle query database",
        startTime: new Date(2025, 0, 29), // 29 Gennaio 2025
        endTime: new Date(2025, 0, 30), // 30 Gennaio 2025
        color: "#7c3aed",
        priority: "medium",
        completed: false,
        category: "Database",
    },

    // Task per testare sovrapposizioni
    {
        id: "19",
        title: "Frontend development",
        description: "Sviluppo delle interfacce utente",
        startTime: new Date(2025, 0, 21), // 21 Gennaio 2025
        endTime: new Date(2025, 0, 25), // 25 Gennaio 2025
        color: "#f59e0b",
        priority: "medium",
        completed: false,
        category: "Sviluppo",
    },
    {
        id: "20",
        title: "Backend API",
        description: "Sviluppo delle API backend",
        startTime: new Date(2025, 0, 23), // 23 Gennaio 2025
        endTime: new Date(2025, 0, 27), // 27 Gennaio 2025
        color: "#10b981",
        priority: "high",
        completed: false,
        category: "Sviluppo",
    },
    {
        id: "21",
        title: "Testing QA",
        description: "Test di qualità dell'applicazione",
        startTime: new Date(2025, 0, 25), // 25 Gennaio 2025
        endTime: new Date(2025, 0, 29), // 29 Gennaio 2025
        color: "#ef4444",
        priority: "medium",
        completed: false,
        category: "Testing",
    },

    // Task con categorie diverse
    {
        id: "22",
        title: "UI/UX Design",
        description: "Progettazione delle interfacce utente",
        startTime: new Date(2025, 1, 1), // 1 Febbraio 2025
        endTime: new Date(2025, 1, 5), // 5 Febbraio 2025
        color: "#8b5cf6",
        priority: "medium",
        completed: false,
        category: "Design",
    },
    {
        id: "23",
        title: "Monitoring setup",
        description: "Configurazione del sistema di monitoraggio",
        startTime: new Date(2025, 1, 2), // 2 Febbraio 2025
        endTime: new Date(2025, 1, 4), // 4 Febbraio 2025
        color: "#06b6d4",
        priority: "low",
        completed: false,
        category: "DevOps",
    },
    {
        id: "24",
        title: "Analisi requisiti",
        description: "Analisi dei requisiti del cliente",
        startTime: new Date(2025, 1, 3), // 3 Febbraio 2025
        endTime: new Date(2025, 1, 6), // 6 Febbraio 2025
        color: "#84cc16",
        priority: "high",
        completed: false,
        category: "Analisi",
    },
]; 