/**
 * CVBuilder - Application Principale
 */
class CVBuilderApp {
    constructor() {
        this.dbManager = new DatabaseManager();
        this.templateLoader = new TemplateLoader();
        this.pdfGenerator = null;
        this.cvData = this.getDefaultData();
        this.zoomLevel = 100;
        this.currentTemplate = 'modern';
        this.init();
    }

    init() {
        console.log('🚀 Initialisation de CVBuilder...');
        
<<<<<<< HEAD
        // Restaurer le thème sauvegardé
        this.restoreTheme();
        
=======
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
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

    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
<<<<<<< HEAD
        });

        // Thème toggle switch
        const themeCheckbox = document.getElementById('theme-checkbox');
        if (themeCheckbox) {
            themeCheckbox.addEventListener('change', () => this.toggleTheme());
        }

        // Template sélection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.selectTemplate(template);
            });
        });

        // Photo upload
        document.getElementById('add-photo-btn').addEventListener('click', () => {
            document.getElementById('photo-input-file').click();
        });

        document.getElementById('photo-input-file').addEventListener('change', (e) => this.handlePhotoUpload(e));
        document.getElementById('remove-photo-btn').addEventListener('click', () => this.removePhoto());

        // Form inputs
        document.querySelectorAll('#cv-form input, #cv-form textarea').forEach(input => {
            input.addEventListener('input', () => this.updateFromForm());
        });

=======
        });

        // Thème
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Template sélection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.selectTemplate(template);
            });
        });

        // Photo upload
        document.getElementById('add-photo-btn').addEventListener('click', () => {
            document.getElementById('photo-input-file').click();
        });

        document.getElementById('photo-input-file').addEventListener('change', (e) => this.handlePhotoUpload(e));
        document.getElementById('remove-photo-btn').addEventListener('click', () => this.removePhoto());

        // Form inputs
        document.querySelectorAll('#cv-form input, #cv-form textarea').forEach(input => {
            input.addEventListener('input', () => this.updateFromForm());
        });

>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
        // Boutons d'ajout dynamique
        document.getElementById('add-experience').addEventListener('click', () => this.addExperience());
        document.getElementById('add-education').addEventListener('click', () => this.addEducation());
        document.getElementById('add-language').addEventListener('click', () => this.addLanguage());

        // Actions principales
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());
        document.getElementById('save-btn').addEventListener('click', () => this.saveData());
        document.getElementById('download-pdf-btn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('generate-pdf-btn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('export-pdf-btn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('export-image-btn').addEventListener('click', () => this.exportImage());
        document.getElementById('export-json-btn').addEventListener('click', () => this.exportJSON());
        document.getElementById('import-json-btn').addEventListener('click', () => this.importJSON());
        document.getElementById('print-btn').addEventListener('click', () => this.printCV());
        
        // Zoom
        document.getElementById('zoom-in').addEventListener('click', () => this.adjustZoom(10));
        document.getElementById('zoom-out').addEventListener('click', () => this.adjustZoom(-10));

        // Partager
        document.getElementById('share-linkedin').addEventListener('click', () => this.shareCV('linkedin'));
        document.getElementById('share-email').addEventListener('click', () => this.shareCV('email'));
        document.getElementById('share-link').addEventListener('click', () => this.shareCV('link'));

        // Exemples
        document.getElementById('load-example-btn').addEventListener('click', () => this.loadExampleData());
        document.getElementById('load-example-preview-btn').addEventListener('click', () => this.loadExampleData());

        // Footer
        document.getElementById('reset-footer-btn').addEventListener('click', () => this.resetForm());
        document.getElementById('save-footer-btn').addEventListener('click', () => this.saveData());
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());

        // Import JSON
        document.getElementById('json-import-file').addEventListener('change', (e) => this.handleJSONImport(e));
    }

    initDynamicSections() {
        // Ajouter des éléments initiaux
        if (this.cvData.experiences.length === 0) this.addExperience();
        if (this.cvData.educations.length === 0) this.addEducation();
        if (this.cvData.languages.length === 0) this.addLanguage();
    }

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
        
        // Mettre à jour le nom du template
        document.getElementById('current-template-name').textContent = 
            this.getTemplateDisplayName(templateName);
        
        // Mettre à jour l'aperçu
        this.updatePreview();
    }

    getTemplateDisplayName(template) {
        const names = {
            'modern': 'Moderne',
            'professional': 'Professionnel',
            'creative': 'Créatif',
            'executive': 'Executive'
        };
        return names[template] || template;
    }

<<<<<<< HEAD
    restoreTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
=======
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
        
        const themeCheckbox = document.getElementById('theme-checkbox');
        if (themeCheckbox) {
            themeCheckbox.checked = savedTheme === 'dark';
        }
    }

    toggleTheme() {
        const themeCheckbox = document.getElementById('theme-checkbox');
        const newTheme = themeCheckbox && themeCheckbox.checked ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', newTheme);
    }

    updateFromForm() {
        // Mettre à jour les données personnelles
        this.cvData.personal.fullName = document.getElementById('fullName').value || '';
        this.cvData.personal.profession = document.getElementById('profession').value || '';
        this.cvData.personal.email = document.getElementById('email').value || '';
        this.cvData.personal.phone = document.getElementById('phone').value || '';
        this.cvData.personal.location = document.getElementById('location').value || '';
        this.cvData.personal.summary = document.getElementById('summary').value || '';
        this.cvData.personal.linkedin = document.getElementById('linkedin').value || '';
        this.cvData.personal.github = document.getElementById('github').value || '';
        this.cvData.personal.portfolio = document.getElementById('portfolio').value || '';

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

        // Mettre à jour l'aperçu
        this.updatePreview();
        
        // Mettre à jour les statistiques
        this.updateStats();
        
        // Sauvegarde automatique
        this.saveData();
    }

    addExperience() {
        const id = Date.now();
        const experience = {
            id,
            title: '',
            company: '',
            period: '',
            description: ''
        };
        
        this.cvData.experiences.push(experience);
        this.renderExperiences();
        this.updatePreview();
    }

    addEducation() {
        const id = Date.now();
        const education = {
            id,
            degree: '',
            school: '',
            year: '',
            description: ''
        };
        
        this.cvData.educations.push(education);
        this.renderEducations();
        this.updatePreview();
    }

    addLanguage() {
        const id = Date.now();
        const language = {
            id,
            name: '',
            level: 3
        };
        
        this.cvData.languages.push(language);
        this.renderLanguages();
        this.updatePreview();
    }

    removeExperience(id) {
        this.cvData.experiences = this.cvData.experiences.filter(exp => exp.id !== id);
        this.renderExperiences();
        this.updatePreview();
    }

    removeEducation(id) {
        this.cvData.educations = this.cvData.educations.filter(edu => edu.id !== id);
        this.renderEducations();
        this.updatePreview();
    }

    removeLanguage(id) {
        this.cvData.languages = this.cvData.languages.filter(lang => lang.id !== id);
        this.renderLanguages();
        this.updatePreview();
    }

    renderExperiences() {
        const container = document.getElementById('experience-container');
        if (!container) return;
        
        container.innerHTML = this.cvData.experiences.map(exp => `
            <div class="dynamic-item" data-id="${exp.id}">
                <button class="remove-item" onclick="app.removeExperience(${exp.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Poste *</label>
                        <input type="text" class="form-input experience-title" 
                               value="${exp.title}" 
                               oninput="app.updateExperienceField(${exp.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Entreprise *</label>
                        <input type="text" class="form-input experience-company" 
                               value="${exp.company}" 
                               oninput="app.updateExperienceField(${exp.id}, 'company', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Période</label>
                        <input type="text" class="form-input experience-period" 
                               value="${exp.period}" 
                               oninput="app.updateExperienceField(${exp.id}, 'period', this.value)"
                               placeholder="2020 - 2023">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-textarea experience-description" 
                                  oninput="app.updateExperienceField(${exp.id}, 'description', this.value)"
                                  rows="3">${exp.description}</textarea>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEducations() {
        const container = document.getElementById('education-container');
        if (!container) return;
        
        container.innerHTML = this.cvData.educations.map(edu => `
            <div class="dynamic-item" data-id="${edu.id}">
                <button class="remove-item" onclick="app.removeEducation(${edu.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Diplôme *</label>
                        <input type="text" class="form-input education-degree" 
                               value="${edu.degree}" 
                               oninput="app.updateEducationField(${edu.id}, 'degree', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Établissement *</label>
                        <input type="text" class="form-input education-school" 
                               value="${edu.school}" 
                               oninput="app.updateEducationField(${edu.id}, 'school', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Année</label>
                        <input type="text" class="form-input education-year" 
                               value="${edu.year}" 
                               oninput="app.updateEducationField(${edu.id}, 'year', this.value)"
                               placeholder="2023">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-textarea education-description" 
                                  oninput="app.updateEducationField(${edu.id}, 'description', this.value)"
                                  rows="3">${edu.description}</textarea>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderLanguages() {
        const container = document.getElementById('languages-container');
        if (!container) return;
        
        container.innerHTML = this.cvData.languages.map(lang => `
            <div class="dynamic-item" data-id="${lang.id}">
                <button class="remove-item" onclick="app.removeLanguage(${lang.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Langue *</label>
                        <input type="text" class="form-input language-name" 
                               value="${lang.name}" 
                               oninput="app.updateLanguageField(${lang.id}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Niveau</label>
                        <div class="language-rating" data-id="${lang.id}">
                            ${[1,2,3,4,5].map(i => `
                                <button class="star-btn ${i <= lang.level ? 'active' : ''}" 
                                        data-level="${i}"
                                        onclick="app.updateLanguageLevel(${lang.id}, ${i})">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateExperienceField(id, field, value) {
        const experience = this.cvData.experiences.find(exp => exp.id === id);
        if (experience) {
            experience[field] = value;
            this.updatePreview();
        }
    }

    updateEducationField(id, field, value) {
        const education = this.cvData.educations.find(edu => edu.id === id);
        if (education) {
            education[field] = value;
            this.updatePreview();
        }
    }

    updateLanguageField(id, field, value) {
        const language = this.cvData.languages.find(lang => lang.id === id);
        if (language) {
            language[field] = value;
            this.updatePreview();
        }
    }

    updateLanguageLevel(id, level) {
        const language = this.cvData.languages.find(lang => lang.id === id);
        if (language) {
            language.level = level;
            
            // Mettre à jour les étoiles visuelles
            const ratingContainer = document.querySelector(`.language-rating[data-id="${id}"]`);
            if (ratingContainer) {
                ratingContainer.querySelectorAll('.star-btn').forEach((btn, index) => {
                    if (index + 1 <= level) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
            
            this.updatePreview();
        }
    }

    async handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier la taille (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('L\'image ne doit pas dépasser 2MB', 'error');
            return;
        }

        // Vérifier le type
        if (!file.type.match('image.*')) {
            this.showNotification('Veuillez sélectionner une image', 'error');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.cvData.personal.photo = e.target.result;
                
                // Mettre à jour la prévisualisation
                const preview = document.getElementById('photo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
                }
                
                this.updatePreview();
                this.showNotification('Photo ajoutée avec succès', 'success');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erreur upload photo:', error);
            this.showNotification('Erreur lors du chargement de l\'image', 'error');
        }
    }

    removePhoto() {
        this.cvData.personal.photo = '';
        
        // Réinitialiser la prévisualisation
        const preview = document.getElementById('photo-preview');
        if (preview) {
            preview.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-user-circle"></i>
                </div>
            `;
        }
        
        this.updatePreview();
        this.showNotification('Photo supprimée', 'info');
    }

    updatePreview() {
        if (this.templateLoader) {
            this.templateLoader.renderCV(this.cvData);
        }
    }

    adjustZoom(amount) {
        this.zoomLevel = Math.max(50, Math.min(200, this.zoomLevel + amount));
        
        const zoomValue = document.querySelector('.zoom-value');
        const previewWrapper = document.getElementById('preview-wrapper');
        
        if (zoomValue) {
            zoomValue.textContent = `${this.zoomLevel}%`;
        }
        
        if (previewWrapper) {
            previewWrapper.style.transform = `scale(${this.zoomLevel / 100})`;
        }
    }

    async downloadPDF() {
        try {
<<<<<<< HEAD
            if (!this.pdfGenerator) {
                this.pdfGenerator = new PDFGenerator();
                this.pdfGenerator.setQualityProfile('high');
=======
            this.showLoading(true, 'Génération du PDF...');
            
            if (!this.pdfGenerator) {
                this.pdfGenerator = new PDFGenerator();
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
            }
            
            await this.pdfGenerator.generatePDF(this.cvData);
            
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            this.showNotification('Erreur lors de la génération du PDF', 'error');
        } finally {
            this.showLoading(false);
        }
        // Dans app.js, dans la méthode downloadPDF()
        if (!this.pdfGenerator) {
            this.pdfGenerator = new PDFGenerator();
            this.pdfGenerator.setQualityProfile('high'); // Qualité maximale
       }
    }

    async exportImage() {
        try {
            this.showLoading(true, 'Génération de l\'image...');
            
            const preview = document.getElementById('cv-preview');
            if (!preview) throw new Error('Aperçu non trouvé');

            const canvas = await html2canvas(preview, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `CV_${this.cvData.personal.fullName?.replace(/[^\w]/g, '_') || 'CV'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('Image téléchargée avec succès', 'success');
        } catch (error) {
            console.error('Erreur export image:', error);
            this.showNotification('Erreur lors de la génération de l\'image', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async exportJSON() {
        try {
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                application: 'CV Builder',
                data: this.cvData
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `CV_${this.cvData.personal.fullName?.replace(/[^\w]/g, '_') || 'Export'}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            this.showNotification('Données exportées avec succès', 'success');
        } catch (error) {
            console.error('Erreur export JSON:', error);
            this.showNotification('Erreur lors de l\'export', 'error');
        }
    }

    importJSON() {
        document.getElementById('json-import-file').click();
    }

    async handleJSONImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            this.showLoading(true, 'Import des données...');
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    if (!importedData.data || !importedData.data.personal) {
                        throw new Error('Format de fichier invalide');
                    }
                    
                    // Mettre à jour les données
                    this.cvData = importedData.data;
                    
                    // Mettre à jour le formulaire
                    this.populateForm();
                    
                    // Mettre à jour le template
                    if (this.cvData.template) {
                        this.selectTemplate(this.cvData.template);
                    }
                    
                    // Mettre à jour l'aperçu
                    this.updatePreview();
                    
                    this.showNotification('Données importées avec succès', 'success');
                } catch (error) {
                    console.error('Erreur import JSON:', error);
                    this.showNotification('Format de fichier invalide', 'error');
                } finally {
                    this.showLoading(false);
                }
            };
            reader.readAsText(file);
            
            // Réinitialiser l'input file
            event.target.value = '';
            
        } catch (error) {
            console.error('Erreur import:', error);
            this.showNotification('Erreur lors de l\'import', 'error');
            this.showLoading(false);
        }
    }

    populateForm() {
        // Remplir les champs de base
        document.getElementById('fullName').value = this.cvData.personal.fullName || '';
        document.getElementById('profession').value = this.cvData.personal.profession || '';
        document.getElementById('email').value = this.cvData.personal.email || '';
        document.getElementById('phone').value = this.cvData.personal.phone || '';
        document.getElementById('location').value = this.cvData.personal.location || '';
        document.getElementById('summary').value = this.cvData.personal.summary || '';
        document.getElementById('linkedin').value = this.cvData.personal.linkedin || '';
        document.getElementById('github').value = this.cvData.personal.github || '';
        document.getElementById('portfolio').value = this.cvData.personal.portfolio || '';
        
        // Compétences
        document.getElementById('skills').value = this.cvData.skills?.join(', ') || '';
        
        // Intérêts
        document.getElementById('interests').value = this.cvData.interests?.join(', ') || '';
        
        // Photo
        if (this.cvData.personal.photo) {
            const preview = document.getElementById('photo-preview');
            if (preview) {
                preview.innerHTML = `<img src="${this.cvData.personal.photo}" alt="Photo">`;
            }
        }
        
        // Rendre les sections dynamiques
        this.renderExperiences();
        this.renderEducations();
        this.renderLanguages();
    }

    async shareCV(platform) {
        try {
            switch (platform) {
                case 'linkedin':
                    const linkedinText = encodeURIComponent(
                        `Découvrez mon CV professionnel: ${this.cvData.personal.fullName} - ${this.cvData.personal.profession}`
                    );
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${linkedinText}`, '_blank');
                    break;

                case 'email':
                    const emailSubject = encodeURIComponent(`CV - ${this.cvData.personal.fullName}`);
                    const emailBody = encodeURIComponent(
                        `Bonjour,\n\nVoici mon CV professionnel.\n\nCordialement,\n${this.cvData.personal.fullName}`
                    );
                    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
                    break;

                case 'link':
                    await navigator.clipboard.writeText(window.location.href);
                    this.showNotification('Lien copié dans le presse-papier', 'success');
                    break;
            }
        } catch (error) {
            console.error('Erreur partage:', error);
            this.showNotification('Erreur lors du partage', 'error');
        }
    }

    printCV() {
        window.print();
    }

    async saveData() {
        try {
            await this.dbManager.saveCV(this.cvData, this.cvData.personal.fullName || 'CV Sans nom');
            
            // Mettre à jour le timestamp de sauvegarde
            const now = new Date();
            document.getElementById('last-save').textContent = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            this.showNotification('CV sauvegardé avec succès', 'success');
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    async loadSavedData() {
        try {
            const savedData = await this.dbManager.getSetting('lastCV');
            if (savedData) {
                this.cvData = savedData;
                this.populateForm();
                
                // Charger le template sauvegardé
                if (this.cvData.template) {
                    this.selectTemplate(this.cvData.template);
                }
                
                this.updatePreview();
                this.showNotification('Données chargées depuis la sauvegarde', 'success');
            }
        } catch (error) {
            console.log('Aucune donnée sauvegardée trouvée');
        }
    }

    loadExampleData() {
        this.cvData = {
            personal: {
                fullName: 'Alexandre Martin',
                profession: 'Développeur Full Stack',
                email: 'alexandre.martin@email.com',
                phone: '+33 6 12 34 56 78',
                location: 'Paris, France',
                summary: 'Développeur Full Stack passionné avec 5 ans d\'expérience dans la création d\'applications web modernes. Expert en React, Node.js et architectures cloud. Toujours à la recherche de nouveaux défis technologiques.',
                photo: '',
                linkedin: 'https://linkedin.com/in/alexandremartin',
                github: 'https://github.com/alexandremartin',
                portfolio: 'https://alexandremartin.dev'
            },
            experiences: [
                {
                    id: 1,
                    title: 'Développeur Full Stack Senior',
                    company: 'Tech Solutions Inc.',
                    period: '2020 - Présent',
                    description: 'Développement d\'applications web pour des clients internationaux. Gestion d\'une équipe de 3 développeurs.'
                },
                {
                    id: 2,
                    title: 'Développeur Frontend',
                    company: 'Digital Agency',
                    period: '2018 - 2020',
                    description: 'Création d\'interfaces utilisateur pour des sites e-commerce et applications mobiles.'
                }
            ],
            educations: [
                {
                    id: 1,
                    degree: 'Master en Informatique',
                    school: 'Université Paris-Saclay',
                    year: '2018',
                    description: 'Spécialisation en développement web et intelligence artificielle.'
                }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS'],
            languages: [
                { id: 1, name: 'Français', level: 5 },
                { id: 2, name: 'Anglais', level: 4 },
                { id: 3, name: 'Espagnol', level: 3 }
            ],
            interests: ['Voyages', 'Photographie', 'Sport', 'Lecture', 'Technologie'],
            template: 'modern'
        };
        
        this.populateForm();
        this.updatePreview();
        this.showNotification('Exemple chargé avec succès', 'success');
    }

    resetForm() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données non sauvegardées seront perdues.')) {
            this.cvData = this.getDefaultData();
            this.populateForm();
            this.selectTemplate('modern');
            this.updatePreview();
            this.showNotification('Formulaire réinitialisé', 'info');
        }
    }

    updateStats() {
        // Sections remplies
        let filledSections = 0;
        const personal = this.cvData.personal;
        if (personal.fullName && personal.profession && personal.email) filledSections++;
        if (this.cvData.experiences.length > 0) filledSections++;
        if (this.cvData.educations.length > 0) filledSections++;
        if (this.cvData.skills.length > 0) filledSections++;
        if (this.cvData.languages.length > 0) filledSections++;
        if (this.cvData.interests.length > 0) filledSections++;
        
        document.getElementById('total-sections').textContent = filledSections;
        
        // Nombre de mots
        let wordCount = 0;
        wordCount += (personal.summary || '').split(/\s+/).length;
        this.cvData.experiences.forEach(exp => {
            wordCount += (exp.description || '').split(/\s+/).length;
        });
        this.cvData.educations.forEach(edu => {
            wordCount += (edu.description || '').split(/\s+/).length;
        });
        
        document.getElementById('word-count').textContent = wordCount;
        
        // Taille estimée
        const jsonSize = JSON.stringify(this.cvData).length;
        document.getElementById('file-size').textContent = `${Math.round(jsonSize / 1024)} KB`;
    }

    showHelp() {
        alert('CV Builder - Aide\n\n' +
              '1. Remplissez vos informations personnelles\n' +
              '2. Choisissez un modèle de CV\n' +
              '3. Visualisez votre CV en temps réel\n' +
              '4. Exportez en PDF, image ou JSON\n' +
              '\n' +
              'Astuces :\n' +
              '- Utilisez l\'exemple pour voir un CV complet\n' +
              '- Sauvegardez régulièrement vos données\n' +
              '- Testez différents templates pour trouver votre style');
    }

    showLoading(show, message = 'Chargement...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingMessage = document.getElementById('loading-message');
        
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        }
        
        if (loadingMessage && message) {
            loadingMessage.textContent = message;
        }
    }

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
        
        // Suppression après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialiser l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CVBuilderApp();
});