/**
 * CVBuilder Pro - Application Principale
 * Gestion des données, événements et coordination des modules
 */

class CVBuilderApp {
    constructor() {
        this.cvData = this.getInitialData();
        this.currentZoom = 1;
        this.currentSection = 'form';
        this.nextExperienceId = 1;
        this.nextEducationId = 1;
        
        this.templateLoader = new TemplateLoader();
        this.pdfGenerator = new PDFGenerator();
        
        this.init();
    }

    // ========== INITIALISATION ==========
    init() {
        console.log('🚀 CVBuilder Pro - Initialisation');
        
        // Charger les données sauvegardées
        this.loadData();
        
        // Configurer les écouteurs d'événements
        this.setupNavigation();
        this.setupForm();
        this.setupTemplates();
        this.setupActions();
        this.setupPreviewControls();
        
        // Initialiser l'affichage
        this.updateNavigation();
        this.updatePreview();
        
        console.log('✅ Application prête !');
    }

    getInitialData() {
        return {
            personal: {
                fullName: '',
                profession: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                portfolio: '',
                summary: ''
            },
            experiences: [],
            educations: [],
            skills: [],
            languages: [],
            interests: [],
            template: 'modern'
        };
    }

    // ========== GESTION DES DONNÉES ==========
    loadData() {
        const saved = localStorage.getItem('cvData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.cvData = { ...this.getInitialData(), ...data };
                
                // S'assurer que les IDs sont uniques
                this.nextExperienceId = Math.max(...this.cvData.experiences.map(e => e.id || 0), 0) + 1;
                this.nextEducationId = Math.max(...this.cvData.educations.map(e => e.id || 0), 0) + 1;
                
                this.populateForm();
                this.updateTemplateSelection();
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                this.showNotification('Erreur lors du chargement des données sauvegardées', 'error');
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('cvData', JSON.stringify(this.cvData));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }

    // ========== FORMULAIRE ==========
    setupForm() {
        // Champs personnels
        const fields = ['fullName', 'profession', 'email', 'phone', 'location', 
                       'linkedin', 'github', 'portfolio', 'summary'];
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.cvData.personal[field] = e.target.value;
                    this.saveData();
                    this.updatePreview();
                });
            }
        });

        // Compétences, langues et centres d'intérêt
        ['skills', 'languages', 'interests'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.cvData[field] = e.target.value
                        .split(',')
                        .map(item => item.trim())
                        .filter(item => item);
                    this.saveData();
                    this.updatePreview();
                });
            }
        });

        // Boutons d'ajout dynamiques
        document.getElementById('add-experience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('add-education')?.addEventListener('click', () => this.addEducation());
    }

    populateForm() {
        // Remplir les champs personnels
        Object.keys(this.cvData.personal).forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = this.cvData.personal[field] || '';
            }
        });

        // Remplir les listes
        document.getElementById('skills').value = this.cvData.skills.join(', ');
        document.getElementById('languages').value = this.cvData.languages.join(', ');
        document.getElementById('interests').value = this.cvData.interests.join(', ');

        // Remplir les expériences
        this.cvData.experiences.forEach(exp => this.renderExperience(exp));

        // Remplir les formations
        this.cvData.educations.forEach(edu => this.renderEducation(edu));
    }

    // ========== EXPÉRIENCES ==========
    addExperience() {
        const experience = {
            id: this.nextExperienceId++,
            title: '',
            company: '',
            period: '',
            description: ''
        };
        
        this.cvData.experiences.push(experience);
        this.saveData();
        this.renderExperience(experience);
        this.updatePreview();
    }

    renderExperience(experience) {
        const container = document.getElementById('experience-container');
        if (!container) return;

        const html = `
            <div class="dynamic-item" data-id="${experience.id}">
                <div class="form-grid">
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${experience.title}"
                               oninput="app.updateExperience(${experience.id}, 'title', this.value)"
                               placeholder="Développeur Full Stack">
                        <label>Poste</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${experience.company}"
                               oninput="app.updateExperience(${experience.id}, 'company', this.value)"
                               placeholder="Nom de l'entreprise">
                        <label>Entreprise</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${experience.period}"
                               oninput="app.updateExperience(${experience.id}, 'period', this.value)"
                               placeholder="2020 - 2023">
                        <label>Période</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label full-width">
                        <textarea 
                            oninput="app.updateExperience(${experience.id}, 'description', this.value)"
                            placeholder="Description des responsabilités..."
                            rows="2">${experience.description}</textarea>
                        <label>Description</label>
                        <div class="form-underline"></div>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="app.removeExperience(${experience.id})">
                    <i class="fas fa-trash"></i>
                    Supprimer cette expérience
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }

    updateExperience(id, field, value) {
        const experience = this.cvData.experiences.find(exp => exp.id === id);
        if (experience) {
            experience[field] = value;
            this.saveData();
            this.updatePreview();
        }
    }

    removeExperience(id) {
        this.cvData.experiences = this.cvData.experiences.filter(exp => exp.id !== id);
        const element = document.querySelector(`.dynamic-item[data-id="${id}"]`);
        if (element) element.remove();
        this.saveData();
        this.updatePreview();
    }

    // ========== FORMATIONS ==========
    addEducation() {
        const education = {
            id: this.nextEducationId++,
            degree: '',
            school: '',
            year: '',
            description: ''
        };
        
        this.cvData.educations.push(education);
        this.saveData();
        this.renderEducation(education);
        this.updatePreview();
    }

    renderEducation(education) {
        const container = document.getElementById('education-container');
        if (!container) return;

        const html = `
            <div class="dynamic-item" data-id="${education.id}">
                <div class="form-grid">
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${education.degree}"
                               oninput="app.updateEducation(${education.id}, 'degree', this.value)"
                               placeholder="Master en Informatique">
                        <label>Diplôme</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${education.school}"
                               oninput="app.updateEducation(${education.id}, 'school', this.value)"
                               placeholder="Université Paris-Saclay">
                        <label>Établissement</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label">
                        <input type="text" 
                               value="${education.year}"
                               oninput="app.updateEducation(${education.id}, 'year', this.value)"
                               placeholder="2022">
                        <label>Année</label>
                        <div class="form-underline"></div>
                    </div>
                    <div class="form-group floating-label full-width">
                        <textarea 
                            oninput="app.updateEducation(${education.id}, 'description', this.value)"
                            placeholder="Description complémentaire..."
                            rows="2">${education.description}</textarea>
                        <label>Description</label>
                        <div class="form-underline"></div>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="app.removeEducation(${education.id})">
                    <i class="fas fa-trash"></i>
                    Supprimer cette formation
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }

    updateEducation(id, field, value) {
        const education = this.cvData.educations.find(edu => edu.id === id);
        if (education) {
            education[field] = value;
            this.saveData();
            this.updatePreview();
        }
    }

    removeEducation(id) {
        this.cvData.educations = this.cvData.educations.filter(edu => edu.id !== id);
        const element = document.querySelector(`.dynamic-item[data-id="${id}"]`);
        if (element) element.remove();
        this.saveData();
        this.updatePreview();
    }

    // ========== NAVIGATION ==========
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionId) {
        this.currentSection = sectionId;
        
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // Mettre à jour les sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
            }
        });

        // Mettre à jour l'aperçu si nécessaire
        if (sectionId === 'preview') {
            this.updatePreview();
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === this.currentSection) {
                item.classList.add('active');
            }
        });
    }

    // ========== TEMPLATES ==========
    setupTemplates() {
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const template = card.dataset.template;
                this.selectTemplate(template);
            });
        });
    }

    selectTemplate(template) {
        this.cvData.template = template;
        this.templateLoader.loadTemplate(template);
        this.updateTemplateSelection();
        this.saveData();
        this.updatePreview();
        
        this.showNotification(`Template "${template}" sélectionné`, 'success');
    }

    updateTemplateSelection() {
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.template === this.cvData.template) {
                card.classList.add('active');
            }
        });
    }

    // ========== APERÇU ==========
    updatePreview() {
        this.templateLoader.renderCV(this.cvData);
    }

    setupPreviewControls() {
        // Zoom
        document.getElementById('zoom-in')?.addEventListener('click', () => this.adjustZoom(0.1));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.adjustZoom(-0.1));
        
        // Impression
        document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    }

    adjustZoom(delta) {
        this.currentZoom = Math.max(0.5, Math.min(2, this.currentZoom + delta));
        const preview = document.getElementById('cv-preview');
        if (preview) {
            preview.style.transform = `scale(${this.currentZoom})`;
            preview.style.transformOrigin = 'top center';
            
            // Mettre à jour l'affichage du zoom
            const zoomLevel = document.querySelector('.zoom-level');
            if (zoomLevel) {
                zoomLevel.textContent = `${Math.round(this.currentZoom * 100)}%`;
            }
        }
    }

    // ========== ACTIONS ==========
    setupActions() {
        // Téléchargement PDF
        document.getElementById('download-btn')?.addEventListener('click', () => this.generatePDF());
        document.getElementById('generate-pdf')?.addEventListener('click', () => this.generatePDF());
        
        // Réinitialisation
        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetData());
    }

    generatePDF() {
        this.pdfGenerator.generatePDF(this.cvData)
            .then(() => {
                this.showNotification('PDF généré avec succès !', 'success');
            })
            .catch(error => {
                console.error('Erreur lors de la génération du PDF:', error);
                this.showNotification('Erreur lors de la génération du PDF', 'error');
            });
    }

    resetData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
            this.cvData = this.getInitialData();
            this.nextExperienceId = 1;
            this.nextEducationId = 1;
            
            // Réinitialiser le formulaire
            document.getElementById('cv-form').reset();
            document.getElementById('experience-container').innerHTML = '';
            document.getElementById('education-container').innerHTML = '';
            
            // Réinitialiser le template
            this.templateLoader.loadTemplate('modern');
            this.cvData.template = 'modern';
            this.updateTemplateSelection();
            
            // Effacer le stockage local
            localStorage.removeItem('cvData');
            
            // Mettre à jour l'affichage
            this.updatePreview();
            
            this.showNotification('Données réinitialisées avec succès', 'success');
        }
    }

    // ========== NOTIFICATIONS ==========
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
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

    // ========== DONNÉES EXEMPLE ==========
    loadExampleData() {
        this.cvData = {
            personal: {
                fullName: 'Marie Dubois',
                profession: 'Développeuse Full Stack',
                email: 'marie.dubois@email.com',
                phone: '+33 6 12 34 56 78',
                location: 'Paris, France',
                linkedin: 'linkedin.com/in/mariedubois',
                github: 'github.com/mariedubois',
                portfolio: 'marie-dubois.dev',
                summary: 'Développeuse passionnée avec 5 ans d\'expérience dans la création d\'applications web modernes. Expertise en React, Node.js et architectures cloud.'
            },
            experiences: [
                {
                    id: 1,
                    title: 'Développeuse Full Stack Senior',
                    company: 'TechCorp SAS',
                    period: '2022 - Présent',
                    description: 'Développement d\'applications React/Node.js, gestion d\'équipe, architecture microservices.'
                },
                {
                    id: 2,
                    title: 'Développeuse Frontend',
                    company: 'WebSolutions SARL',
                    period: '2020 - 2022',
                    description: 'Création d\'interfaces utilisateur avec React et TypeScript, optimisation des performances.'
                }
            ],
            educations: [
                {
                    id: 1,
                    degree: 'Master en Informatique',
                    school: 'Université Paris-Saclay',
                    year: '2020',
                    description: 'Spécialisation en développement web et architectures distribuées'
                },
                {
                    id: 2,
                    degree: 'Licence en Informatique',
                    school: 'Université Paris Descartes',
                    year: '2018',
                    description: 'Fondements de la programmation et des systèmes d\'information'
                }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Docker', 'AWS'],
            languages: ['Français (Natif)', 'Anglais (Courant)', 'Espagnol (Intermédiaire)'],
            interests: ['Photographie', 'Randonnée', 'Lecture', 'Voyages'],
            template: 'modern'
        };
        
        this.nextExperienceId = 3;
        this.nextEducationId = 3;
        
        this.populateForm();
        this.updateTemplateSelection();
        this.updatePreview();
        this.saveData();
        
        this.showNotification('Données exemple chargées avec succès', 'success');
    }
}

// Initialiser l'application globale
window.app = new CVBuilderApp();

// Exposer les méthodes globales
window.loadExampleData = () => app.loadExampleData();
