/**
 * DatabaseManager - Gestionnaire de base de données IndexedDB
 */

class DatabaseManager {
    constructor() {
        this.dbName = 'CVBuilderDB';
        this.version = 2;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error('❌ Erreur IndexedDB:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ Base de données initialisée');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createStores(db);
            };
        });
    }

    createStores(db) {
        // Store pour les CV
        if (!db.objectStoreNames.contains('cvs')) {
            const cvStore = db.createObjectStore('cvs', { 
                keyPath: 'id',
                autoIncrement: true 
            });
            cvStore.createIndex('createdAt', 'createdAt');
            cvStore.createIndex('template', 'template');
            cvStore.createIndex('name', 'name');
        }

        // Store pour les paramètres utilisateur
        if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { 
                keyPath: 'key'
            });
            settingsStore.createIndex('key', 'key');
        }
    }

    // ========== GESTION DES CV ==========
    
    async saveCV(cvData, name = 'CV Sans nom') {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readwrite');
            const store = transaction.objectStore('cvs');
            
            const cvRecord = {
                ...cvData,
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0'
            };

            const request = store.add(cvRecord);

            request.onsuccess = (event) => {
                const id = event.target.result;
                console.log(`💾 CV sauvegardé (ID: ${id})`);
                resolve({ id, ...cvRecord });
            };

            request.onerror = (event) => {
                console.error('❌ Erreur sauvegarde CV:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async updateCV(id, cvData) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readwrite');
            const store = transaction.objectStore('cvs');
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const existing = getRequest.result;
                if (!existing) {
                    reject(new Error('CV non trouvé'));
                    return;
                }

                const updatedCV = {
                    ...existing,
                    ...cvData,
                    updatedAt: new Date().toISOString(),
                    id: existing.id
                };

                const updateRequest = store.put(updatedCV);

                updateRequest.onsuccess = () => {
                    console.log(`📝 CV mis à jour (ID: ${id})`);
                    resolve(updatedCV);
                };

                updateRequest.onerror = (event) => {
                    reject(event.target.error);
                };
            };

            getRequest.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getCV(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readonly');
            const store = transaction.objectStore('cvs');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getAllCVs() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readonly');
            const store = transaction.objectStore('cvs');
            const request = store.getAll();

            request.onsuccess = () => {
                const cvs = request.result.sort((a, b) => 
                    new Date(b.updatedAt) - new Date(a.updatedAt)
                );
                resolve(cvs);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async deleteCV(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readwrite');
            const store = transaction.objectStore('cvs');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log(`🗑️ CV supprimé (ID: ${id})`);
                resolve(true);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // ========== PARAMÈTRES UTILISATEUR ==========
    
    async saveSetting(key, value) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            
            const setting = {
                key,
                value: JSON.stringify(value),
                updatedAt: new Date().toISOString()
            };

            const request = store.put(setting);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getSetting(key, defaultValue = null) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                if (result && result.value) {
                    try {
                        resolve(JSON.parse(result.value));
                    } catch (e) {
                        resolve(result.value);
                    }
                } else {
                    resolve(defaultValue);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // ========== IMPORT/EXPORT ==========
    
    async exportCV(cvData) {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            application: 'CV Builder',
            data: cvData
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { 
            type: 'application/json;charset=utf-8' 
        });
        
        return {
            blob,
            filename: `CV_${cvData.personal?.fullName?.replace(/[^\w]/g, '_') || 'Export'}_${Date.now()}.json`
        };
    }

    async importCV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validation des données
                    if (!importedData.data || !importedData.data.personal) {
                        throw new Error('Format de fichier invalide');
                    }

                    // Migration si ancienne version
                    const cvData = this.migrateData(importedData.data);
                    
                    resolve(cvData);
                } catch (error) {
                    reject(new Error(`Erreur d'import: ${error.message}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('Erreur de lecture du fichier'));
            };

            reader.readAsText(file);
        });
    }

    migrateData(data) {
        // Migration depuis anciennes versions
        if (!data.version || data.version === '0.9') {
            // Assurer la structure de données
            if (!data.personal) data.personal = {};
            if (!data.experiences) data.experiences = [];
            if (!data.educations) data.educations = [];
            if (!data.skills) data.skills = [];
            if (!data.languages) data.languages = [];
            if (!data.interests) data.interests = [];
            if (!data.template) data.template = 'modern';
            
            // Convertir les anciennes structures
            data.experiences = data.experiences.map(exp => ({
                id: exp.id || Date.now(),
                title: exp.title || '',
                company: exp.company || '',
                period: exp.period || '',
                description: exp.description || ''
            }));

            data.educations = data.educations.map(edu => ({
                id: edu.id || Date.now(),
                degree: edu.degree || '',
                school: edu.school || '',
                year: edu.year || '',
                description: edu.description || ''
            }));

            data.languages = data.languages.map(lang => {
                if (typeof lang === 'string') {
                    return { id: Date.now(), name: lang, level: 3 };
                }
                return {
                    id: lang.id || Date.now(),
                    name: lang.name || lang,
                    level: lang.level || 3
                };
            });
        }
        
        data.version = '1.0';
        return data;
    }

    // ========== SAUVEGARDE AUTOMATIQUE ==========
    
    async autoSave(cvData) {
        try {
            const lastSave = await this.getSetting('lastAutoSave');
            const now = Date.now();
            
            // Sauvegarde automatique toutes les 30 secondes
            if (!lastSave || (now - lastSave) > 30000) {
                await this.saveCV(cvData, 'Auto-sauvegarde');
                await this.saveSetting('lastAutoSave', now);
                console.log('💾 Sauvegarde automatique effectuée');
            }
        } catch (error) {
            console.warn('⚠️ Erreur sauvegarde automatique:', error);
        }
    }

    // ========== NETTOYAGE ==========
    
    async clearAll() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(
                ['cvs', 'settings'], 
                'readwrite'
            );

            let completed = 0;
            const totalStores = 2;
            
            const checkCompletion = () => {
                completed++;
                if (completed === totalStores) {
                    console.log('🧹 Toutes les données ont été effacées');
                    resolve(true);
                }
            };

            transaction.objectStore('cvs').clear().onsuccess = checkCompletion;
            transaction.objectStore('settings').clear().onsuccess = checkCompletion;

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

// Export global
window.DatabaseManager = DatabaseManager;  