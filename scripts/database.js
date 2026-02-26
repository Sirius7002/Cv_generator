/**
 * DatabaseManager - Gestionnaire de base de données IndexedDB
 */
class DatabaseManager {
    constructor() {
        this.dbName = 'CVBuilderDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error('Erreur IndexedDB:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ Base de données initialisée');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Créer le store pour les CV
                if (!db.objectStoreNames.contains('cvs')) {
                    const cvStore = db.createObjectStore('cvs', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    cvStore.createIndex('createdAt', 'createdAt');
                }
                
                // Créer le store pour les paramètres
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    async saveCV(cvData, name = 'CV Sans nom') {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs'], 'readwrite');
            const store = transaction.objectStore('cvs');
            
            const cvRecord = {
                ...cvData,
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const request = store.add(cvRecord);

            request.onsuccess = (event) => {
                const id = event.target.result;
                console.log(`💾 CV sauvegardé (ID: ${id})`);
                
                // Sauvegarder aussi comme dernier CV
                this.saveSetting('lastCV', cvData);
                
                resolve({ id, ...cvRecord });
            };

            request.onerror = (event) => {
                console.error('Erreur sauvegarde CV:', event.target.error);
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

    async clearAll() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cvs', 'settings'], 'readwrite');
            
            let completed = 0;
            const totalStores = 2;
            
            const checkCompletion = () => {
                completed++;
                if (completed === totalStores) {
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