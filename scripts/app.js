/**
 * CVBuilder - Application Principale
 */

class CVBuilderApp {
    constructor() {
        this.dbManager = null;
        this.templateLoader = null;
        this.pdfGenerator = null;
        this.cvData = this.getDefaultData();
        this.zoomLevel = 100;
        this.currentTemplate = 'modern';
        this.autoSaveTimeout = null;
        this.init();
    }

    init() {
        console.log('🚀 Initialisation de CVBuilder...');
        
        // Initialiser les composants
        this.initComponents();
        
        // Initialiser les écouteurs d'événements
        this.initEventListeners();
        
        // Charger les données sauvegardées
        this.loadSavedData();
        
        // Initialiser l'affichage
        this.updatePreview();
        
        // Initialiser les sections dynamiques
        this.initDynamicSections();
        
        console.log('✅ Application initialisée');
    }

    initComponents() {
        // Initialiser le gestionnaire de base de données
        this.dbManager = new DatabaseManager();
        
        // Initialiser le chargeur de templates
        this.templateLoader = new TemplateLoader();
        this.currentTemplate = this.templateLoader.currentTemplate;
        
        // Initialiser le générateur de PDF
        this.pdfGenerator = new PDFGenerator();
    }

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Thème
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Template sélection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.selectTemplate(template);
            });
        });

        // Photo upload
        const photoInput = document.getElementById('photo-input-file');
        const addPhotoBtn = document.getElementById('add-photo-btn');
        const removePhotoBtn = document.getElementById('remove-photo-btn');
        
        if (addPhotoBtn) {
            addPhotoBtn.addEventListener('click', () => photoInput.click());
        }
        
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }
        
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => this.removePhoto());
        }

        // Form inputs (écoute en temps réel)
        const formInputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updateFromForm());
        });

        // Boutons d'ajout dynamique
        document.getElementById('add-experience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('add-education')?.addEventListener('click', () => this.addEducation());
        document.getElementById('add-language')?.addEventListener('click', () => this.addLanguage());

        // Boutons d'actions principales
        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('generate-pdf-btn')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('download-pdf-btn')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('print-btn')?.addEventListener('click', () => this.printCV());
        document.getElementById('export-pdf-btn')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('export-json-btn')?.addEventListener('click', () => this.exportJSON());
        document.getElementById('import-json-btn')?.addEventListener('click', () => this.importJSON());

        // Zoom
        document.getElementById('zoom-in')?.addEventListener('click', () => this.adjustZoom(10));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.adjustZoom(-10));

        // Import de fichier
        const fileInput = document.getElementById('json-import-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleJSONImport(e));
        }

        // Sauvegarde automatique
        setInterval(() => this.autoSave(), 30000); // Toutes les 30 secondes

        // Avant déchargement de la page
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?';
            }
        });

        // Mise à jour des statistiques
        setInterval(() => this.updateStats(), 5000);
    }

    initDynamicSections() {
        // Ajouter un élément de base pour chaque section dynamique
        if (document.getElementById('experience-container')?.children.length === 0) {
            this.addExperience();
        }
        
        if (document.getElementById('education-container')?.children.length === 0) {
            this.addEducation();
        }
        
        if (document.getElementById('languages-container')?.children.length === 0) {
            this.addLanguage();
        }
    }

    // ========== GESTION DES DONNÉES ==========

    getDefaultData() {
        return {
            personal: {
                fullName: '',
                profession: '',
                email: '',
                phone: '',
                location: '',
                summary: '',
                photo: '',
                linkedin: '',
                github: '',
                portfolio: ''
            },
            experiences: [],
            educations: [],
            skills: [],
            languages: [],
            interests: [],
            template: 'modern'
        };
    }

    updateFromForm() {
        // Mettre à jour les données personnelles
        this.cvData.personal.fullName = document.getElementById('fullName')?.value || '';
        this.cvData.personal.profession = document.getElementById('profession')?.value || '';
        this.cvData.personal.email = document.getElementById('email')?.value || '';
        this.cvData.personal.phone = document.getElementById('phone')?.value || '';
        this.cvData.personal.location = document.getElementById('location')?.value || '';
        this.cvData.personal.summary = document.getElementById('summary')?.value || '';
        this.cvData.personal.linkedin = document.getElementById('linkedin')?.value || '';
        this.cvData.personal.github = document.getElementById('github')?.value || '';
        this.cvData.personal.portfolio = document.getElementById('portfolio')?.value || '';

        // Mettre à jour les compétences
        const skillsInput = document.getElementById('skills');
        if (skillsInput) {
            this.cvData.skills = skillsInput.value
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);
        }

        // Mettre à jour les centres d'intérêt
        const interestsInput = document.getElementById('interests');
        if (interestsInput) {
            this.cvData.interests = interestsInput.value
                .split(',')
                .map(interest => interest.trim())
                .filter(interest => interest.length > 0);
        }

        // Mettre à jour les expériences
        this.updateExperiencesFromForm();
        
        // Mettre à jour les formations
        this.updateEducationsFromForm();
        
        // Mettre à jour les langues
        this.updateLanguagesFromForm();

        // Mettre à jour l'aperçu
        this.updatePreview();

        // Mettre à jour les statistiques
        this.updateStats();

        // Sauvegarde automatique
        this.queueAutoSave();
    }

    updateExperiencesFromForm() {
        const experienceItems = document.querySelectorAll('#experience-container .dynamic-item');
        this.cvData.experiences = [];
        
        experienceItems.forEach(item => {
            const experience = {
                id: item.dataset.id || Date.now(),
                title: item.querySelector('.experience-title')?.value || '',
                company: item.querySelector('.experience-company')?.value || '',
                period: item.querySelector('.experience-period')?.value || '',
                description: item.querySelector('.experience-description')?.value || ''
            };
            this.cvData.experiences.push(experience);
        });
    }

    updateEducationsFromForm() {
        const educationItems = document.querySelectorAll('#education-container .dynamic-item');
        this.cvData.educations = [];
        
        educationItems.forEach(item => {
            const education = {
                id: item.dataset.id || Date.now(),
                degree: item.querySelector('.education-degree')?.value || '',
                school: item.querySelector('.education-school')?.value || '',
                year: item.querySelector('.education-year')?.value || '',
                description: item.querySelector('.education-description')?.value || ''
            };
            this.cvData.educations.push(education);
        });
    }

    updateLanguagesFromForm() {
        const languageItems = document.querySelectorAll('#languages-container .dynamic-item');
        this.cvData.languages = [];
        
        languageItems.forEach(item => {
            const language = {
                id: item.dataset.id || Date.now(),
                name: item.querySelector('.language-name')?.value || '',
                level: parseInt(item.querySelector('.language-rating')?.dataset.level || 3)
            };
            this.cvData.languages.push(language);
        });
    }

    // ========== GESTION DE L'INTERFACE ==========

    switchSection(sectionId) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // Afficher la section correspondante
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Si on passe à l'aperçu, on met à jour l'affichage
            if (sectionId === 'preview') {
                this.updatePreview();
            }
        }
    }

    selectTemplate(templateName) {
        // Mettre à jour la sélection visuelle
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const selectedCard = document.querySelector(`[data-template="${templateName}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }

        // Charger le template
        this.templateLoader.loadTemplate(templateName);
        this.currentTemplate = templateName;
        this.cvData.template = templateName;
        
        // Mettre à jour l'aperçu
        this.updatePreview();
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        
        // Mettre à jour l'icône
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', newTheme);
    }

    adjustZoom(amount) {
        this.zoomLevel = Math.max(50, Math.min(200, this.zoomLevel + amount));
        
        // Mettre à jour l'affichage
        const zoomValue = document.querySelector('.zoom-value');
        const previewWrapper = document.getElementById('preview-wrapper');
        
        if (zoomValue) {
            zoomValue.textContent = `${this.zoomLevel}%`;
        }
        
        if (previewWrapper) {
            previewWrapper.style.transform = `scale(${this.zoomLevel / 100})`;
        }
    }

    // ========== GESTION DES PHOTOS ==========

    async handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            this.showNotification('Veuillez sélectionner une image', 'error');
            return;
        }

        // Vérifier la taille (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('L\'image est trop volumineuse (max 2MB)', 'error');
            return;
        }

        try {
            // Convertir en URL de données
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                this.cvData.personal.photo = dataUrl;
                
                // Mettre à jour l'aperçu
                const photoPreview = document.getElementById('photo-preview');
                if (photoPreview) {
                    photoPreview.innerHTML = `<img src="${dataUrl}" alt="Photo de profil" crossorigin="anonymous">`;
                }
                
                this.updatePreview();
                this.showNotification('Photo ajoutée avec succès', 'success');
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('❌ Erreur chargement photo:', error);
            this.showNotification('Erreur lors du chargement de la photo', 'error');
        }
    }

    removePhoto() {
        this.cvData.personal.photo = '';
        
        // Réinitialiser l'aperçu
        const photoPreview = document.getElementById('photo-preview');
        if (photoPreview) {
            photoPreview.innerHTML = '<div class="photo-placeholder"><i class="fas fa-user-circle"></i></div>';
        }
        
        this.updatePreview();
        this.showNotification('Photo supprimée', 'info');
    }

    // ========== ÉLÉMENTS DYNAMIQUES ==========

    addExperience() {
        const container = document.getElementById('experience-container');
        if (!container) return;

        const id = Date.now();
        const experienceItem = `
            <div class="dynamic-item" data-id="${id}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Poste *</label>
                        <input type="text" class="form-input experience-title" placeholder="Ex: Développeur Full Stack" required>
                    </div>
                    <div class="form-group">
                        <label>Entreprise *</label>
                        <input type="text" class="form-input experience-company" placeholder="Ex: Google" required>
                    </div>
                    <div class="form-group">
                        <label>Période</label>
                        <input type="text" class="form-input experience-period" placeholder="Ex: 2020 - Présent">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-textarea experience-description" rows="3" placeholder="Décrivez vos responsabilités et réalisations..."></textarea>
                    </div>
                </div>
                <button type="button" class="btn btn-text btn-remove" onclick="app.removeItem(this, 'experience')">
                    <i class="fas fa-trash"></i> Supprimer cette expérience
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', experienceItem);
        
        // Attacher les écouteurs d'événements
        const newItem = container.lastElementChild;
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updateFromForm());
        });
    }

    addEducation() {
        const container = document.getElementById('education-container');
        if (!container) return;

        const id = Date.now();
        const educationItem = `
            <div class="dynamic-item" data-id="${id}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Diplôme *</label>
                        <input type="text" class="form-input education-degree" placeholder="Ex: Master Informatique" required>
                    </div>
                    <div class="form-group">
                        <label>Établissement *</label>
                        <input type="text" class="form-input education-school" placeholder="Ex: Université Paris-Saclay" required>
                    </div>
                    <div class="form-group">
                        <label>Année</label>
                        <input type="text" class="form-input education-year" placeholder="Ex: 2022">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-textarea education-description" rows="3" placeholder="Mention, spécialité, projets..."></textarea>
                    </div>
                </div>
                <button type="button" class="btn btn-text btn-remove" onclick="app.removeItem(this, 'education')">
                    <i class="fas fa-trash"></i> Supprimer cette formation
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', educationItem);
        
        // Attacher les écouteurs d'événements
        const newItem = container.lastElementChild;
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.updateFromForm());
        });
    }

    addLanguage() {
        const container = document.getElementById('languages-container');
        if (!container) return;

        const id = Date.now();
        const languageItem = `
            <div class="dynamic-item" data-id="${id}">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Langue *</label>
                        <input type="text" class="form-input language-name" placeholder="Ex: Anglais" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Niveau</label>
                        <div class="language-rating" data-level="3">
                            <button type="button" class="star-btn" data-value="1" title="Débutant"><i class="far fa-star"></i></button>
                            <button type="button" class="star-btn" data-value="2" title="Intermédiaire"><i class="far fa-star"></i></button>
                            <button type="button" class="star-btn active" data-value="3" title="Bon"><i class="fas fa-star"></i></button>
                            <button type="button" class="star-btn" data-value="4" title="Courant"><i class="far fa-star"></i></button>
                            <button type="button" class="star-btn" data-value="5" title="Natif"><i class="far fa-star"></i></button>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-text btn-remove" onclick="app.removeItem(this, 'language')">
                    <i class="fas fa-trash"></i> Supprimer cette langue
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', languageItem);
        
        // Attacher les écouteurs d'événements pour les étoiles
        const newItem = container.lastElementChild;
        const ratingDiv = newItem.querySelector('.language-rating');
        const starButtons = ratingDiv.querySelectorAll('.star-btn');
        
        starButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const value = parseInt(e.currentTarget.dataset.value);
                ratingDiv.dataset.level = value;
                
                // Mettre à jour les étoiles
                starButtons.forEach((star, index) => {
                    if (index < value) {
                        star.innerHTML = '<i class="fas fa-star"></i>';
                        star.classList.add('active');
                    } else {
                        star.innerHTML = '<i class="far fa-star"></i>';
                        star.classList.remove('active');
                    }
                });
                
                this.updateFromForm();
            });
        });
    }

    removeItem(button, type) {
        const item = button.closest('.dynamic-item');
        if (item && confirm('Voulez-vous vraiment supprimer cet élément ?')) {
            item.remove();
            this.updateFromForm();
        }
    }

    // ========== APERÇU ET RENDU ==========

    updatePreview() {
        if (!this.templateLoader) return;
        
        try {
            this.templateLoader.renderCV(this.cvData);
        } catch (error) {
            console.error('❌ Erreur mise à jour aperçu:', error);
        }
    }

    // ========== GESTION DES FICHIERS ==========

    async downloadPDF() {
        try {
            await this.pdfGenerator.generatePDF(this.cvData);
        } catch (error) {
            console.error('❌ Erreur génération PDF:', error);
            this.showNotification('Erreur lors de la génération du PDF', 'error');
        }
    }

    async printCV() {
        // Créer une version imprimable
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            this.showNotification('Veuillez autoriser les popups pour l\'impression', 'error');
            return;
        }

        // Générer le HTML pour l'impression
        const printHTML = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CV - ${this.cvData.personal.fullName}</title>
                <style>
                    @media print {
                        @page { margin: 0; }
                        body { margin: 1.6cm; }
                    }
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .cv-content { max-width: 800px; margin: 0 auto; }
                    img { max-width: 100%; height: auto; }
                </style>
            </head>
            <body>
                <div class="cv-content">
                    ${document.getElementById('cv-preview').innerHTML}
                </div>
                <script>
                    window.onload = () => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(printHTML);
        printWindow.document.close();
    }

    async exportJSON() {
        try {
            const exportData = await this.dbManager.exportCV(this.cvData);
            
            // Créer un lien de téléchargement
            const url = URL.createObjectURL(exportData.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = exportData.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('CV exporté avec succès', 'success');
        } catch (error) {
            console.error('❌ Erreur export:', error);
            this.showNotification('Erreur lors de l\'export', 'error');
        }
    }

    async importJSON() {
        document.getElementById('json-import-file').click();
    }

    async handleJSONImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const importedData = await this.dbManager.importCV(file);
            this.loadData(importedData);
            this.showNotification('CV importé avec succès', 'success');
        } catch (error) {
            console.error('❌ Erreur import:', error);
            this.showNotification(`Erreur d'import: ${error.message}`, 'error');
        }

        // Réinitialiser l'input
        event.target.value = '';
    }

    // ========== SAUVEGARDE ET CHARGEMENT ==========

    async loadSavedData() {
        try {
            // Charger le thème
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const themeIcon = document.querySelector('#theme-toggle i');
            if (themeIcon) {
                themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }

            // Charger les données du CV depuis la base
            const cvs = await this.dbManager.getAllCVs();
            if (cvs.length > 0) {
                const latestCV = cvs[0];
                this.loadData(latestCV);
                this.showNotification('CV précédent chargé', 'info');
            }
        } catch (error) {
            console.warn('⚠️ Aucune donnée sauvegardée trouvée');
        }
    }

    loadData(data) {
        // Fusionner avec les données par défaut
        this.cvData = {
            ...this.getDefaultData(),
            ...data
        };

        // Mettre à jour le formulaire
        this.populateForm();
        
        // Mettre à jour le template
        if (this.cvData.template) {
            this.selectTemplate(this.cvData.template);
        }
        
        // Mettre à jour l'aperçu
        this.updatePreview();
        
        // Mettre à jour les statistiques
        this.updateStats();
    }

    populateForm() {
        // Données personnelles
        document.getElementById('fullName').value = this.cvData.personal.fullName || '';
        document.getElementById('profession').value = this.cvData.personal.profession || '';
        document.getElementById('email').value = this.cvData.personal.email || '';
        document.getElementById('phone').value = this.cvData.personal.phone || '';
        document.getElementById('location').value = this.cvData.personal.location || '';
        document.getElementById('summary').value = this.cvData.personal.summary || '';
        document.getElementById('linkedin').value = this.cvData.personal.linkedin || '';
        document.getElementById('github').value = this.cvData.personal.github || '';
        document.getElementById('portfolio').value = this.cvData.personal.portfolio || '';

        // Photo
        if (this.cvData.personal.photo) {
            const photoPreview = document.getElementById('photo-preview');
            if (photoPreview) {
                photoPreview.innerHTML = `<img src="${this.cvData.personal.photo}" alt="Photo de profil" crossorigin="anonymous">`;
            }
        }

        // Compétences
        document.getElementById('skills').value = this.cvData.skills.join(', ');
        
        // Centres d'intérêt
        document.getElementById('interests').value = this.cvData.interests.join(', ');

        // Expériences
        this.populateDynamicSection('experience', this.cvData.experiences);
        
        // Formations
        this.populateDynamicSection('education', this.cvData.educations);
        
        // Langues
        this.populateDynamicSection('language', this.cvData.languages);
    }

    populateDynamicSection(type, items) {
        const container = document.getElementById(`${type}-container`);
        if (!container) return;

        // Vider le conteneur
        container.innerHTML = '';

        // Ajouter chaque élément
        items.forEach(item => {
            switch (type) {
                case 'experience':
                    this.addExperience();
                    break;
                case 'education':
                    this.addEducation();
                    break;
                case 'language':
                    this.addLanguage();
                    break;
            }
            
            // Remplir le dernier élément ajouté
            const lastItem = container.lastElementChild;
            if (lastItem) {
                lastItem.dataset.id = item.id;
                
                switch (type) {
                    case 'experience':
                        lastItem.querySelector('.experience-title').value = item.title || '';
                        lastItem.querySelector('.experience-company').value = item.company || '';
                        lastItem.querySelector('.experience-period').value = item.period || '';
                        lastItem.querySelector('.experience-description').value = item.description || '';
                        break;
                    case 'education':
                        lastItem.querySelector('.education-degree').value = item.degree || '';
                        lastItem.querySelector('.education-school').value = item.school || '';
                        lastItem.querySelector('.education-year').value = item.year || '';
                        lastItem.querySelector('.education-description').value = item.description || '';
                        break;
                    case 'language':
                        lastItem.querySelector('.language-name').value = item.name || '';
                        const ratingDiv = lastItem.querySelector('.language-rating');
                        const level = item.level || 3;
                        ratingDiv.dataset.level = level;
                        
                        // Mettre à jour les étoiles
                        const stars = ratingDiv.querySelectorAll('.star-btn');
                        stars.forEach((star, index) => {
                            if (index < level) {
                                star.innerHTML = '<i class="fas fa-star"></i>';
                                star.classList.add('active');
                            } else {
                                star.innerHTML = '<i class="far fa-star"></i>';
                                star.classList.remove('active');
                            }
                        });
                        break;
                }
            }
        });

        // Si aucun élément, en ajouter un vide
        if (items.length === 0) {
            switch (type) {
                case 'experience':
                    this.addExperience();
                    break;
                case 'education':
                    this.addEducation();
                    break;
                case 'language':
                    this.addLanguage();
                    break;
            }
        }
    }

    async saveCurrentCV() {
        try {
            await this.dbManager.saveCV(this.cvData, this.cvData.personal.fullName || 'CV Sans nom');
            this.showNotification('CV sauvegardé avec succès', 'success');
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    queueAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => this.autoSave(), 1000);
    }

    async autoSave() {
        try {
            await this.dbManager.autoSave(this.cvData);
        } catch (error) {
            console.warn('⚠️ Erreur sauvegarde automatique:', error);
        }
    }

    hasUnsavedChanges() {
        // Vérifier s'il y a des changements non sauvegardés
        return false;
    }

    // ========== RÉINITIALISATION ==========

    resetForm() {
        if (confirm('Voulez-vous vraiment réinitialiser le formulaire ? Toutes les modifications non sauvegardées seront perdues.')) {
            this.cvData = this.getDefaultData();
            this.populateForm();
            this.updatePreview();
            this.showNotification('Formulaire réinitialisé', 'info');
        }
    }

    // ========== STATISTIQUES ==========

    updateStats() {
        try {
            // Sections remplies
            let filledSections = 0;
            const totalSections = 8;
            
            if (this.cvData.personal.fullName) filledSections++;
            if (this.cvData.personal.profession) filledSections++;
            if (this.cvData.personal.summary) filledSections++;
            if (this.cvData.experiences.length > 0) filledSections++;
            if (this.cvData.educations.length > 0) filledSections++;
            if (this.cvData.skills.length > 0) filledSections++;
            if (this.cvData.languages.length > 0) filledSections++;
            if (this.cvData.interests.length > 0) filledSections++;
            
            document.getElementById('total-sections').textContent = filledSections;
            
            // Nombre de mots
            let wordCount = 0;
            if (this.cvData.personal.summary) {
                wordCount += this.cvData.personal.summary.split(/\s+/).length;
            }
            
            this.cvData.experiences.forEach(exp => {
                if (exp.description) {
                    wordCount += exp.description.split(/\s+/).length;
                }
            });
            
            this.cvData.educations.forEach(edu => {
                if (edu.description) {
                    wordCount += edu.description.split(/\s+/).length;
                }
            });
            
            document.getElementById('word-count').textContent = wordCount;
            
            // Dernière sauvegarde
            const now = new Date();
            const timeString = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.getElementById('last-save').textContent = timeString;
            
            // Taille estimée
            const jsonString = JSON.stringify(this.cvData);
            const sizeInBytes = new Blob([jsonString]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            document.getElementById('file-size').textContent = `${sizeInKB} KB`;
            
        } catch (error) {
            console.warn('⚠️ Erreur mise à jour statistiques:', error);
        }
    }

    // ========== DONNÉES D'EXEMPLE ==========

    loadExampleData() {
        if (confirm('Charger des données d\'exemple ? Vos modifications actuelles seront perdues.')) {
            const exampleData = {
                personal: {
                    fullName: 'Marie Dubois',
                    profession: 'Développeuse Full Stack',
                    email: 'marie.dubois@email.com',
                    phone: '+33 6 12 34 56 78',
                    location: 'Paris, France',
                    summary: 'Développeuse passionnée avec 5 ans d\'expérience dans le développement web. Spécialisée en React et Node.js, j\'aime créer des applications performantes et intuitives. Toujours à la recherche de nouveaux défis techniques et opportunités d\'apprentissage.',
                    photo: '',
                    linkedin: 'https://linkedin.com/in/mariedubois',
                    github: 'https://github.com/mariedubois',
                    portfolio: 'https://mariedubois.dev'
                },
                experiences: [
                    {
                        id: 1,
                        title: 'Développeuse Full Stack Senior',
                        company: 'TechCorp',
                        period: '2020 - Présent',
                        description: 'Responsable du développement de l\'application principale. Architecture microservices, mise en place de CI/CD, mentorat des développeurs juniors.'
                    },
                    {
                        id: 2,
                        title: 'Développeuse Frontend',
                        company: 'StartupX',
                        period: '2018 - 2020',
                        description: 'Développement d\'interfaces utilisateur avec React. Collaboration avec l\'équipe design pour créer une expérience utilisateur optimale.'
                    }
                ],
                educations: [
                    {
                        id: 1,
                        degree: 'Master en Informatique',
                        school: 'Université Paris-Saclay',
                        year: '2018',
                        description: 'Spécialisation en génie logiciel et intelligence artificielle.'
                    },
                    {
                        id: 2,
                        degree: 'Licence en Informatique',
                        school: 'Université Paris Descartes',
                        year: '2016',
                        description: 'Programmation orientée objet, bases de données, algorithmique.'
                    }
                ],
                skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'Docker', 'AWS', 'Git', 'MongoDB', 'PostgreSQL'],
                languages: [
                    { id: 1, name: 'Français', level: 5 },
                    { id: 2, name: 'Anglais', level: 4 },
                    { id: 3, name: 'Espagnol', level: 3 }
                ],
                interests: ['Photographie', 'Voyages', 'Yoga', 'Lecture', 'Cuisine', 'Tech'],
                template: 'modern'
            };

            this.loadData(exampleData);
            this.showNotification('Données d\'exemple chargées', 'success');
        }
    }

    // ========== AIDE ET UTILITAIRES ==========

    showHelp() {
        alert(`CVBuilder - Aide rapide

1. Remplissez toutes les sections du formulaire
2. Choisissez un modèle dans l'onglet "Modèles"
3. Visualisez votre CV en temps réel dans "Aperçu"
4. Exportez en PDF ou JSON dans "Exporter"

Astuces :
- Cliquez sur "+ Ajouter" pour ajouter plusieurs expériences/formations
- Utilisez les étoiles pour évaluer votre niveau en langues
- Le thème sombre/clair est disponible en haut à droite
- Votre CV est sauvegardé automatiquement`);
    }

    // ========== NOTIFICATIONS ==========

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialiser l'application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new CVBuilderApp();
    window.app = app; // Exposer globalement pour les appels depuis HTML
});