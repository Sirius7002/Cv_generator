/**
 * CVBuilder Pro - Application Principale
 */

class CVBuilderApp {
    constructor() {
        this.cvData = this.getInitialData();
        this.currentSection = 'editor';
        this.currentZoom = 1;
        
        this.templateLoader = new TemplateLoader();
        this.pdfGenerator = new PDFGenerator();
        
        this.init();
    }

    init() {
        console.log('🚀 CVBuilder Pro - Initialisation');
        
        // Charger les données
        this.loadData();
        
        // Configurer les événements
        this.setupNavigation();
        this.setupForm();
        this.setupTemplates();
        this.setupActions();
        this.setupPreviewControls();
        this.setupPhotoUpload();
        
        // Initialiser l'affichage
        this.showSection(this.currentSection);
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
                summary: '',
                photo: ''
            },
            experiences: [],
            educations: [],
            skills: [],
            languages: [],
            interests: [],
            template: 'modern'
        };
    }

    // ========== NAVIGATION ==========
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });
    }

    switchSection(sectionId) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // Cacher toutes les sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Mettre à jour l'aperçu si nécessaire
        if (sectionId === 'preview') {
            setTimeout(() => {
                this.updatePreview();
                this.resetZoom();
            }, 100);
        }

        this.currentSection = sectionId;
    }

    showSection(sectionId) {
        this.switchSection(sectionId);
    }

    // ========== GESTION DES DONNÉES ==========
    loadData() {
        const saved = localStorage.getItem('cvData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.cvData = { ...this.getInitialData(), ...data };
                this.populateForm();
                this.updateTemplateSelection();
            } catch (error) {
                console.error('Erreur de chargement:', error);
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('cvData', JSON.stringify(this.cvData));
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
        }
    }

    // ========== FORMULAIRE ==========
    setupForm() {
        // Champs personnels
        const personalFields = ['fullName', 'profession', 'email', 'phone', 'location', 
                              'linkedin', 'github', 'portfolio', 'summary'];
        
        personalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.cvData.personal[field] = e.target.value;
                    this.saveData();
                    this.updatePreview();
                });
            }
        });

        // Compétences et intérêts
        ['skills', 'interests'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    const value = e.target.value;
                    this.cvData[field] = value.split(',')
                        .map(item => item.trim())
                        .filter(item => item);
                    this.saveData();
                    this.updatePreview();
                });
            }
        });

        // Boutons d'ajout
        document.getElementById('add-experience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('add-education')?.addEventListener('click', () => this.addEducation());
        document.getElementById('add-language')?.addEventListener('click', () => this.addLanguage());
    }

    setupPhotoUpload() {
        const photoInput = document.getElementById('photo');
        const preview = document.getElementById('photo-preview');
        
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Vérifier la taille (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        this.showNotification('La photo doit faire moins de 5MB', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.cvData.personal.photo = event.target.result;
                        this.saveData();
                        this.updatePreview();
                        
                        if (preview) {
                            preview.innerHTML = `
                                <img src="${this.cvData.personal.photo}" 
                                     style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #4361ee">
                            `;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    populateForm() {
        // Remplir les champs personnels
        Object.keys(this.cvData.personal).forEach(field => {
            const element = document.getElementById(field);
            if (element && field !== 'photo') {
                element.value = this.cvData.personal[field] || '';
            }
        });

        // Afficher la photo si elle existe
        if (this.cvData.personal.photo) {
            const preview = document.getElementById('photo-preview');
            if (preview) {
                preview.innerHTML = `
                    <img src="${this.cvData.personal.photo}" 
                         style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #4361ee">
                `;
            }
        }

        // Remplir les listes
        const skillsInput = document.getElementById('skills');
        const interestsInput = document.getElementById('interests');
        
        if (skillsInput) skillsInput.value = this.cvData.skills.join(', ');
        if (interestsInput) interestsInput.value = this.cvData.interests.join(', ');

        // Remplir les expériences
        this.cvData.experiences.forEach(exp => this.renderExperience(exp));

        // Remplir les formations
        this.cvData.educations.forEach(edu => this.renderEducation(edu));

        // Remplir les langues
        this.cvData.languages.forEach(lang => this.renderLanguage(lang));
    }

    // ========== EXPÉRIENCES ==========
    addExperience() {
        const experience = {
            id: Date.now(),
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
                    <div class="input-group floating">
                        <input type="text" 
                               value="${experience.title}"
                               oninput="app.updateExperience(${experience.id}, 'title', this.value)"
                               placeholder="Développeur Full Stack">
                        <label>Poste</label>
                        <div class="focus-line"></div>
                    </div>
                    <div class="input-group floating">
                        <input type="text" 
                               value="${experience.company}"
                               oninput="app.updateExperience(${experience.id}, 'company', this.value)"
                               placeholder="Nom de l'entreprise">
                        <label>Entreprise</label>
                        <div class="focus-line"></div>
                    </div>
                    <div class="input-group floating">
                        <input type="text" 
                               value="${experience.period}"
                               oninput="app.updateExperience(${experience.id}, 'period', this.value)"
                               placeholder="2020 - 2023">
                        <label>Période</label>
                        <div class="focus-line"></div>
                    </div>
                </div>
                <div class="input-group floating full-width">
                    <textarea 
                        oninput="app.updateExperience(${experience.id}, 'description', this.value)"
                        placeholder="Description des responsabilités et réalisations..."
                        rows="3">${experience.description}</textarea>
                    <label>Description</label>
                    <div class="focus-line"></div>
                </div>
                <button class="btn btn-outline" onclick="app.removeExperience(${experience.id})">
                    <i class="fas fa-trash"></i>
                    Supprimer
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
            id: Date.now(),
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
                    <div class="input-group floating">
                        <input type="text" 
                               value="${education.degree}"
                               oninput="app.updateEducation(${education.id}, 'degree', this.value)"
                               placeholder="Master en Informatique">
                        <label>Diplôme</label>
                        <div class="focus-line"></div>
                    </div>
                    <div class="input-group floating">
                        <input type="text" 
                               value="${education.school}"
                               oninput="app.updateEducation(${education.id}, 'school', this.value)"
                               placeholder="Université Paris-Saclay">
                        <label>Établissement</label>
                        <div class="focus-line"></div>
                    </div>
                    <div class="input-group floating">
                        <input type="text" 
                               value="${education.year}"
                               oninput="app.updateEducation(${education.id}, 'year', this.value)"
                               placeholder="2022">
                        <label>Année</label>
                        <div class="focus-line"></div>
                    </div>
                </div>
                <div class="input-group floating full-width">
                    <textarea 
                        oninput="app.updateEducation(${education.id}, 'description', this.value)"
                        placeholder="Description complémentaire..."
                        rows="2">${education.description}</textarea>
                    <label>Description</label>
                    <div class="focus-line"></div>
                </div>
                <button class="btn btn-outline" onclick="app.removeEducation(${education.id})">
                    <i class="fas fa-trash"></i>
                    Supprimer
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

    // ========== LANGUES ==========
    addLanguage() {
        const language = {
            id: Date.now(),
            name: '',
            level: 3
        };
        
        this.cvData.languages.push(language);
        this.saveData();
        this.renderLanguage(language);
        this.updatePreview();
    }

    renderLanguage(language) {
        const container = document.getElementById('languages-container');
        if (!container) return;

        const html = `
            <div class="dynamic-item" data-id="${language.id}">
                <div class="form-grid">
                    <div class="input-group floating">
                        <input type="text" 
                               value="${language.name}"
                               oninput="app.updateLanguage(${language.id}, 'name', this.value)"
                               placeholder="Français">
                        <label>Langue</label>
                        <div class="focus-line"></div>
                    </div>
                    <div class="input-group">
                        <label>Niveau</label>
                        <div class="language-rating">
                            ${[1,2,3,4,5].map(star => `
                                <button type="button" 
                                        class="star-btn ${star <= language.level ? 'active' : ''}"
                                        onclick="app.updateLanguageLevel(${language.id}, ${star})">
                                    ★
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="app.removeLanguage(${language.id})">
                    <i class="fas fa-trash"></i>
                    Supprimer
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }

    updateLanguage(id, field, value) {
        const language = this.cvData.languages.find(lang => lang.id === id);
        if (language) {
            language[field] = value;
            this.saveData();
            this.updatePreview();
        }
    }

    updateLanguageLevel(id, level) {
        const language = this.cvData.languages.find(lang => lang.id === id);
        if (language) {
            language.level = level;
            this.saveData();
            
            // Mettre à jour l'affichage des étoiles
            const stars = document.querySelectorAll(`.dynamic-item[data-id="${id}"] .star-btn`);
            stars.forEach((star, index) => {
                if (index < level) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
            
            this.updatePreview();
        }
    }

    removeLanguage(id) {
        this.cvData.languages = this.cvData.languages.filter(lang => lang.id !== id);
        const element = document.querySelector(`.dynamic-item[data-id="${id}"]`);
        if (element) element.remove();
        this.saveData();
        this.updatePreview();
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
        if (this.templateLoader) {
            this.templateLoader.renderCV(this.cvData);
        }
    }

    setupPreviewControls() {
        // Zoom
        document.getElementById('zoom-in')?.addEventListener('click', () => this.adjustZoom(0.1));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.adjustZoom(-0.1));
        
        // Impression
        document.getElementById('print-btn')?.addEventListener('click', () => this.printCV());
    }

    adjustZoom(delta) {
        this.currentZoom = Math.max(0.5, Math.min(2, this.currentZoom + delta));
        const preview = document.getElementById('cv-preview');
        if (preview) {
            preview.style.transform = `scale(${this.currentZoom})`;
            
            // Mettre à jour l'affichage du zoom
            const zoomValue = document.querySelector('.zoom-value');
            if (zoomValue) {
                zoomValue.textContent = `${Math.round(this.currentZoom * 100)}%`;
            }
        }
    }

    resetZoom() {
        this.currentZoom = 1;
        const preview = document.getElementById('cv-preview');
        if (preview) {
            preview.style.transform = `scale(${this.currentZoom})`;
            const zoomValue = document.querySelector('.zoom-value');
            if (zoomValue) {
                zoomValue.textContent = '100%';
            }
        }
    }

    printCV() {
        const originalContent = document.body.innerHTML;
        const printContent = document.getElementById('cv-preview').outerHTML;
        
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>CV - Impression</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    
                    body { 
                        font-family: 'Inter', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f5f7fa;
                    }
                    
                    .cv-preview { 
                        width: 210mm; 
                        min-height: 297mm; 
                        margin: 0 auto; 
                        background: white; 
                        box-shadow: none;
                        transform: none !important;
                    }
                    
                    @media print {
                        body { margin: 0; padding: 0; }
                        .cv-preview { 
                            box-shadow: none; 
                            width: 100%;
                            min-height: 100vh;
                        }
                    }
                </style>
            </head>
            <body>
                <div>${printContent}</div>
                <script>
                    window.onafterprint = function() {
                        window.location.reload();
                    };
                    setTimeout(() => window.print(), 500);
                </script>
            </body>
            </html>
        `;
    }

    // ========== ACTIONS ==========
    setupActions() {
        // Téléchargement PDF
        const downloadBtn = document.getElementById('download-btn');
        const generatePdfBtn = document.getElementById('generate-pdf');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.generatePDF());
        }
        
        if (generatePdfBtn) {
            generatePdfBtn.addEventListener('click', () => this.generatePDF());
        }
        
        // Réinitialisation
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }
    }

    async generatePDF() {
        try {
            await this.pdfGenerator.generatePDF(this.cvData);
            this.showNotification('PDF généré avec succès !', 'success');
        } catch (error) {
            console.error('Erreur PDF:', error);
            this.showNotification('Erreur lors de la génération du PDF', 'error');
        }
    }

    resetData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
            this.cvData = this.getInitialData();
            
            // Réinitialiser le formulaire
            const form = document.getElementById('cv-form');
            if (form) form.reset();
            
            // Vider les conteneurs dynamiques
            const containers = ['experience-container', 'education-container', 'languages-container'];
            containers.forEach(containerId => {
                const container = document.getElementById(containerId);
                if (container) container.innerHTML = '';
            });
            
            // Vider la photo
            const photoPreview = document.getElementById('photo-preview');
            if (photoPreview) photoPreview.innerHTML = '';
            
            // Réinitialiser le template
            this.cvData.template = 'modern';
            this.templateLoader.loadTemplate('modern');
            this.updateTemplateSelection();
            
            // Effacer le stockage local
            localStorage.removeItem('cvData');
            
            // Mettre à jour l'affichage
            this.updatePreview();
            
            this.showNotification('Toutes les données ont été réinitialisées', 'success');
        }
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

    // ========== DONNÉES EXEMPLE ==========
    loadExampleData() {
        this.cvData = {
            personal: {
                fullName: 'Alexandre Martin',
                profession: 'Développeur Full Stack Senior',
                email: 'alexandre.martin@email.com',
                phone: '+33 6 12 34 56 78',
                location: 'Paris, France',
                linkedin: 'https://linkedin.com/in/alexandremartin',
                github: 'https://github.com/alexandremartin',
                portfolio: 'https://alexandre-martin.dev',
                summary: 'Développeur passionné avec 6 ans d\'expérience dans la création d\'applications web modernes. Expert en React, Node.js et architectures cloud. Passionné par l\'innovation et les technologies émergentes. Leader d\'équipe avec une solide expérience en gestion de projets Agile.',
                photo: ''
            },
            experiences: [
                {
                    id: 1,
                    title: 'Lead Développeur Full Stack',
                    company: 'TechVision Solutions',
                    period: '2021 - Présent',
                    description: 'Direction d\'une équipe de 8 développeurs, architecture de microservices, développement d\'API REST, optimisation des performances. Mise en place de CI/CD et migration vers le cloud AWS.'
                },
                {
                    id: 2,
                    title: 'Développeur Frontend Senior',
                    company: 'WebSolutions SARL',
                    period: '2019 - 2021',
                    description: 'Développement d\'applications React/TypeScript, mise en place de tests unitaires, intégration de design systems. Participation à l\'architecture technique et au recrutement.'
                },
                {
                    id: 3,
                    title: 'Développeur Web',
                    company: 'Digital Agency',
                    period: '2018 - 2019',
                    description: 'Création de sites web responsive, intégration de maquettes, développement de fonctionnalités frontend et backend.'
                }
            ],
            educations: [
                {
                    id: 1,
                    degree: 'Master en Informatique',
                    school: 'École Polytechnique',
                    year: '2018',
                    description: 'Spécialisation en intelligence artificielle et machine learning. Projet de fin d\'études sur l\'optimisation des algorithmes de recommandation.'
                },
                {
                    id: 2,
                    degree: 'Licence en Informatique',
                    school: 'Université Paris-Saclay',
                    year: '2016',
                    description: 'Fondements de la programmation orientée objet, bases de données, algorithmique et structures de données.'
                }
            ],
            skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'CI/CD', 'Agile', 'Scrum'],
            languages: [
                { id: 1, name: 'Français', level: 5 },
                { id: 2, name: 'Anglais', level: 4 },
                { id: 3, name: 'Espagnol', level: 3 },
                { id: 4, name: 'Allemand', level: 2 }
            ],
            interests: ['Voyages', 'Photographie', 'Randonnée', 'Musique', 'Lecture', 'Technologie', 'Cuisine', 'Jeux vidéo'],
            template: 'modern'
        };
        
        this.populateForm();
        this.updateTemplateSelection();
        this.updatePreview();
        this.saveData();
        
        this.showNotification('Données exemple chargées avec succès', 'success');
    }
}

// Initialiser l'application
window.app = new CVBuilderApp();

// Exposer les méthodes globales
window.loadExampleData = () => app.loadExampleData();
