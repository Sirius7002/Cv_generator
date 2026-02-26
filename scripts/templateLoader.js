/**
 * TemplateLoader - Charge et rend les templates de CV
 */
class TemplateLoader {
    constructor() {
        this.templates = {
            'modern': 'styles/templates/modern.css',
            'professional': 'styles/templates/professional.css',
            'creative': 'styles/templates/creative.css',
            'executive': 'styles/templates/executive.css'
        };
        
        this.currentTemplate = 'modern';
        this.init();
    }

    init() {
        // Charger le template sauvegardé ou par défaut
        const savedTemplate = localStorage.getItem('cvTemplate') || 'modern';
        this.loadTemplate(savedTemplate);
        
        // Mettre à jour le sélecteur de template s'il existe
        this.updateTemplateSelector(savedTemplate);
    }

    updateTemplateSelector(templateName) {
        const selector = document.getElementById('template-selector');
        if (selector) {
            selector.value = templateName;
        }
    }

    loadTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.warn(`Template "${templateName}" non trouvé, utilisation du template moderne`);
            templateName = 'modern';
        }

        this.currentTemplate = templateName;
        
        // Mettre à jour le CSS
        const link = document.getElementById('template-css');
        if (link) {
            link.href = this.templates[templateName];
        }
        
        // Sauvegarder la préférence
        localStorage.setItem('cvTemplate', templateName);
        
        // Mettre à jour le sélecteur
        this.updateTemplateSelector(templateName);
        
        console.log(`🎨 Template chargé: ${templateName}`);
        return templateName;
    }

    renderCV(cvData) {
        const preview = document.getElementById('cv-preview');
        if (!preview) {
            console.error('Élément preview non trouvé');
            return;
        }

        // Appliquer la classe du template
        preview.className = `cv-preview cv-${this.currentTemplate}`;
        
        // Générer le HTML selon le template
        let html = '';
        switch (this.currentTemplate) {
            case 'professional':
                html = this.generateProfessionalHTML(cvData);
                break;
            case 'creative':
                html = this.generateCreativeHTML(cvData);
                break;
            case 'executive':
                html = this.generateExecutiveHTML(cvData);
                break;
            case 'modern':
            default:
                html = this.generateModernHTML(cvData);
        }
        
        preview.innerHTML = html;
        
        // Déclencher un événement pour informer que le CV a été rendu
        document.dispatchEvent(new CustomEvent('cvRendered', {
            detail: { template: this.currentTemplate }
        }));
    }

    generateModernHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-modern">
                <div class="cv-container">
                    <!-- Colonne de gauche -->
                    <div class="cv-sidebar">
                        <!-- Photo en haut à gauche -->
                        ${personal.photo ? `
                            <div class="cv-photo sidebar-photo">
                                <img src="${personal.photo}" alt="${personal.fullName}" crossorigin="anonymous">
                            </div>
                        ` : ''}
                        
                        <!-- Informations de contact -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">
                                <i class="fas fa-address-card"></i>
                                <span>Contact</span>
                            </h3>
                            <div class="sidebar-content">
                                ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span>${personal.email}</span></div>` : ''}
                                ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span>${personal.phone}</span></div>` : ''}
                                ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>${personal.location}</span></div>` : ''}
                                ${personal.website ? `<div class="contact-item"><i class="fas fa-globe"></i><span>${personal.website}</span></div>` : ''}
                                ${personal.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i><span>${personal.linkedin}</span></div>` : ''}
                                ${personal.github ? `<div class="contact-item"><i class="fab fa-github"></i><span>${personal.github}</span></div>` : ''}
                            </div>
                        </div>
                        
                        <!-- Compétences/Expertises -->
                        ${skills.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">
                                <i class="fas fa-cogs"></i>
                                <span>Expertises</span>
                            </h3>
                            <div class="sidebar-content">
                                <div class="sidebar-skills">
                                    ${skills.map(skill => `
                                        <div class="sidebar-skill-item">
                                            <span class="sidebar-skill-name">${skill.trim()}</span>
                                            <div class="sidebar-skill-bar">
                                                <div class="sidebar-skill-level" style="width: ${Math.floor(Math.random() * 30) + 70}%"></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Langues -->
                        ${languages.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">
                                <i class="fas fa-language"></i>
                                <span>Langues</span>
                            </h3>
                            <div class="sidebar-content">
                                <div class="sidebar-languages">
                                    ${languages.map(lang => `
                                        <div class="sidebar-language-item">
                                            <div class="sidebar-language-header">
                                                <span class="sidebar-language-name">${lang.name || lang}</span>
                                                <span class="sidebar-language-level">${this.getLanguageLevelLabel(lang.level || 3)}</span>
                                            </div>
                                            <div class="sidebar-language-bar">
                                                <div class="sidebar-language-progress" style="width: ${((lang.level || 3) / 5) * 100}%"></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Intérêts -->
                        ${interests.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title">
                                <i class="fas fa-heart"></i>
                                <span>Centres d'Intérêt</span>
                            </h3>
                            <div class="sidebar-content">
                                <div class="sidebar-interests">
                                    ${interests.map(interest => `
                                        <div class="sidebar-interest-item">
                                            <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                            <span>${interest.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Contenu principal -->
                    <div class="cv-main">
                        <!-- Header avec nom et profession -->
                        <div class="main-header">
                            <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                            <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                        </div>
                        
                        ${personal.summary ? `
                        <section class="cv-section">
                            <h3 class="section-title">
                                <i class="fas fa-user"></i>
                                <span>Profil Professionnel</span>
                            </h3>
                            <div class="section-content">
                                <p class="profile-text">${personal.summary}</p>
                            </div>
                        </section>
                        ` : ''}
                        
                        ${experiences.length > 0 ? `
                        <section class="cv-section">
                            <h3 class="section-title">
                                <i class="fas fa-briefcase"></i>
                                <span>Expérience Professionnelle</span>
                            </h3>
                            <div class="section-content">
                                ${experiences.map(exp => `
                                    <div class="experience-item">
                                        <div class="experience-header">
                                            <h4 class="experience-title">${exp.title || 'Poste'}</h4>
                                            <div class="experience-subtitle">
                                                <span class="company">${exp.company || 'Entreprise'}</span>
                                                <span class="period">${exp.period || 'Période'}</span>
                                            </div>
                                        </div>
                                        ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                        
                        ${educations.length > 0 ? `
                        <section class="cv-section">
                            <h3 class="section-title">
                                <i class="fas fa-graduation-cap"></i>
                                <span>Formation</span>
                            </h3>
                            <div class="section-content">
                                ${educations.map(edu => `
                                    <div class="education-item">
                                        <div class="education-header">
                                            <h4 class="education-title">${edu.degree || 'Diplôme'}</h4>
                                            <div class="education-subtitle">
                                                <span class="school">${edu.school || 'Établissement'}</span>
                                                <span class="year">${edu.year || 'Année'}</span>
                                            </div>
                                        </div>
                                        ${edu.description ? `<div class="education-description">${edu.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateProfessionalHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-professional">
                <div class="cv-sidebar">
                    ${personal.photo ? `
                        <div class="cv-photo">
                            <img src="${personal.photo}" alt="${personal.fullName}" crossorigin="anonymous">
                        </div>
                    ` : ''}
                    
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-user"></i>Contact</h3>
                        <div class="sidebar-content">
                            ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span>${personal.email}</span></div>` : ''}
                            ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span>${personal.phone}</span></div>` : ''}
                            ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>${personal.location}</span></div>` : ''}
                        </div>
                    </div>

                    ${skills.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-code"></i>Compétences</h3>
                        <div class="sidebar-content">
                            <div class="skills-grid">
                                ${skills.map(skill => `
                                    <div class="skill-item">${skill.trim()}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    ${languages.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-language"></i>Langues</h3>
                        <div class="sidebar-content">
                            ${languages.map(lang => `
                                <div class="language-item">
                                    <span class="language-name">${lang.name || lang}</span>
                                    <div class="language-dots">
                                        ${Array.from({length: 5}, (_, i) => `
                                            <span class="language-dot ${i < (lang.level || 3) ? 'filled' : ''}"></span>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${interests.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-heart"></i>Intérêts</h3>
                        <div class="sidebar-content">
                            <div class="interests-list">
                                ${interests.map(interest => `
                                    <span class="interest-tag">${interest.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <div class="cv-main">
                    <div class="cv-header">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                    </div>

                    ${personal.summary ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-user-tie"></i>Profil</h3>
                        <div class="section-content">
                            <p class="profile-text">${personal.summary}</p>
                        </div>
                    </section>
                    ` : ''}

                    ${experiences.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-briefcase"></i>Expérience</h3>
                        <div class="section-content">
                            ${experiences.map(exp => `
                                <div class="experience-item">
                                    <div class="experience-header">
                                        <div class="experience-left">
                                            <h4 class="experience-title">${exp.title || 'Poste'}</h4>
                                            <span class="company">${exp.company || 'Entreprise'}</span>
                                        </div>
                                        <span class="period">${exp.period || 'Période'}</span>
                                    </div>
                                    ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    ${educations.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-graduation-cap"></i>Formation</h3>
                        <div class="section-content">
                            ${educations.map(edu => `
                                <div class="education-item">
                                    <div class="education-header">
                                        <div class="education-left">
                                            <h4 class="education-title">${edu.degree || 'Diplôme'}</h4>
                                            <span class="school">${edu.school || 'Établissement'}</span>
                                        </div>
                                        <span class="year">${edu.year || 'Année'}</span>
                                    </div>
                                    ${edu.description ? `<div class="education-description">${edu.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Dans generateCreativeHTML() - Modifier la structure du header
    generateCreativeHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-creative">
                <!-- Header avec photo à gauche et nom à droite -->
                <div class="cv-header">
                    <div class="header-bg"></div>
                    <div class="header-content">
                        <div class="header-left">
                            ${personal.photo ? `
                                <div class="cv-photo header-photo">
                                    <img src="${personal.photo}" alt="${personal.fullName}" crossorigin="anonymous">
                                </div>
                            ` : ''}
                        </div>
                        <div class="header-right">
                            <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                            <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                        </div>
                    </div>
                </div>

                <div class="cv-container">
                    <!-- Colonne latérale sans photo -->
                    <div class="cv-sidebar">
                        <!-- Contact dans sidebar -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-address-card"></i>Contact</h3>
                            <div class="sidebar-content">
                                ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span class="contact-text">${personal.email}</span></div>` : ''}
                                ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span class="contact-text">${personal.phone}</span></div>` : ''}
                                ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span class="contact-text">${personal.location}</span></div>` : ''}
                                ${personal.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i><span class="contact-text">${personal.linkedin}</span></div>` : ''}
                                ${personal.github ? `<div class="contact-item"><i class="fab fa-github"></i><span class="contact-text">${personal.github}</span></div>` : ''}
                            </div>
                        </div>

                        <!-- Compétences dans sidebar -->
                        ${skills.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-code"></i>Compétences</h3>
                            <div class="sidebar-content">
                                ${skills.map(skill => `
                                    <div class="skill-item">
                                        <div class="skill-header">
                                            <span class="skill-name">${skill.trim()}</span>
                                        </div>
                                        <div class="skill-bar" style="--skill-level: ${Math.random() * 60 + 40}%"></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Langues dans sidebar -->
                        ${languages.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-language"></i>Langues</h3>
                            <div class="sidebar-content">
                                ${languages.map(lang => `
                                    <div class="language-item">
                                        <div class="language-header">
                                            <span class="language-name">${lang.name || lang}</span>
                                            <span class="language-level">${this.getLanguageLevelLabel(lang.level || 3)}</span>
                                        </div>
                                        <div class="language-dots">
                                            ${Array.from({length: 5}, (_, i) => `
                                                <span class="language-dot ${i < (lang.level || 3) ? 'filled' : ''}"></span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Intérêts dans sidebar -->
                        ${interests.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-heart"></i>Centres d'Intérêt</h3>
                            <div class="sidebar-content">
                                <div class="interests-grid">
                                    ${interests.map(interest => `
                                        <div class="interest-item">
                                            <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                            <span>${interest.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <div class="cv-main">
                        ${personal.summary ? `
                        <section class="cv-section">
                            <h3 class="section-title creative-title">
                                <span class="title-icon"><i class="fas fa-user"></i></span>
                                <span class="title-text">Profil</span>
                            </h3>
                            <div class="section-content">
                                <p class="profile-text">${personal.summary}</p>
                            </div>
                        </section>
                        ` : ''}

                        ${experiences.length > 0 ? `
                        <section class="cv-section">
                            <h3 class="section-title creative-title">
                                <span class="title-icon"><i class="fas fa-briefcase"></i></span>
                                <span class="title-text">Expériences</span>
                            </h3>
                            <div class="section-content">
                                <div class="timeline-creative">
                                    ${experiences.map((exp, index) => `
                                        <div class="timeline-item-creative">
                                            <div class="timeline-header">
                                                <h4 class="timeline-title">${exp.title || 'Poste'}</h4>
                                                <div class="timeline-subtitle">${exp.company || 'Entreprise'}</div>
                                                <span class="timeline-date">${exp.period || 'Période'}</span>
                                            </div>
                                            ${exp.description ? `<div class="timeline-description">${exp.description}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </section>
                        ` : ''}

                        ${educations.length > 0 ? `
                        <section class="cv-section">
                            <h3 class="section-title creative-title">
                                <span class="title-icon"><i class="fas fa-graduation-cap"></i></span>
                                <span class="title-text">Formation</span>
                            </h3>
                            <div class="section-content">
                                ${educations.map(edu => `
                                    <div class="education-item-creative">
                                        <div class="education-icon">
                                            <i class="fas fa-university"></i>
                                        </div>
                                        <div class="education-content">
                                            <h4 class="education-title">${edu.degree || 'Diplôme'}</h4>
                                            <div class="education-subtitle">
                                                <span class="school">${edu.school || 'Établissement'}</span>
                                                <span class="year">${edu.year || 'Année'}</span>
                                            </div>
                                            ${edu.description ? `<div class="education-description">${edu.description}</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Dans generateExecutiveHTML() - Modifier la structure du header
    generateExecutiveHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-executive">
                <!-- Header avec photo à gauche et nom à droite -->
                <div class="cv-header">
                    <div class="header-content">
                        <div class="header-left">
                            ${personal.photo ? `
                                <div class="cv-photo header-photo">
                                    <img src="${personal.photo}" alt="${personal.fullName}" crossorigin="anonymous">
                                </div>
                            ` : ''}
                        </div>
                        <div class="header-right">
                            <div class="header-text">
                                <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                                <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cv-container">
                    <!-- Colonne latérale sans photo -->
                    <div class="cv-sidebar">
                        <!-- Contact dans sidebar -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-address-card"></i>Contact</h3>
                            <div class="sidebar-content">
                                ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span class="contact-text">${personal.email}</span></div>` : ''}
                                ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span class="contact-text">${personal.phone}</span></div>` : ''}
                                ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span class="contact-text">${personal.location}</span></div>` : ''}
                                ${personal.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i><span class="contact-text">${personal.linkedin}</span></div>` : ''}
                            </div>
                        </div>

                        <!-- Compétences dans sidebar -->
                        ${skills.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-cogs"></i>Expertise</h3>
                            <div class="sidebar-content">
                                ${skills.map(skill => `
                                    <div class="skill-item">
                                        <div class="skill-header">
                                            <span class="skill-name">${skill.trim()}</span>
                                            <span class="skill-percentage">${Math.floor(Math.random() * 30) + 70}%</span>
                                        </div>
                                        <div class="skill-bar">
                                            <div class="skill-level" style="width: ${Math.floor(Math.random() * 30) + 70}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Langues dans sidebar -->
                        ${languages.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-language"></i>Langues</h3>
                            <div class="sidebar-content">
                                ${languages.map(lang => `
                                    <div class="language-item">
                                        <span class="language-name">${lang.name || lang}</span>
                                        <div class="language-dots">
                                            ${Array.from({length: 5}, (_, i) => `
                                                <span class="language-dot ${i < (lang.level || 3) ? 'filled' : ''}"></span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Intérêts dans sidebar -->
                        ${interests.length > 0 ? `
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-star"></i>Intérêts</h3>
                            <div class="sidebar-content">
                                <div class="interests-grid">
                                    ${interests.map(interest => `
                                        <div class="interest-item">
                                            <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                            <span>${interest.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <div class="cv-main">
                        ${personal.summary ? `
                        <section class="cv-section">
                            <div class="section-header">
                                <div class="section-icon">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <h3 class="section-title">Profil Professionnel</h3>
                            </div>
                            <div class="section-content">
                                <p class="profile-text">${personal.summary}</p>
                            </div>
                        </section>
                        ` : ''}

                        ${experiences.length > 0 ? `
                        <section class="cv-section">
                            <div class="section-header">
                                <div class="section-icon">
                                    <i class="fas fa-briefcase"></i>
                                </div>
                                <h3 class="section-title">Expérience Professionnelle</h3>
                            </div>
                            <div class="section-content">
                                ${experiences.map(exp => `
                                    <div class="experience-item">
                                        <div class="experience-header">
                                            <h4 class="experience-title">${exp.title || 'Poste'}</h4>
                                            <div class="experience-subtitle">
                                                <span class="company">${exp.company || 'Entreprise'}</span>
                                                <span class="period">${exp.period || 'Période'}</span>
                                            </div>
                                        </div>
                                        ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}

                        ${educations.length > 0 ? `
                        <section class="cv-section">
                            <div class="section-header">
                                <div class="section-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <h3 class="section-title">Formation</h3>
                            </div>
                            <div class="section-content">
                                ${educations.map(edu => `
                                    <div class="education-item">
                                        <div class="education-icon">
                                            <i class="fas fa-certificate"></i>
                                        </div>
                                        <div class="education-content">
                                            <h4 class="education-title">${edu.degree || 'Diplôme'}</h4>
                                            <div class="education-subtitle">
                                                <span class="school">${edu.school || 'Établissement'}</span>
                                                <span class="year">${edu.year || 'Année'}</span>
                                            </div>
                                            ${edu.description ? `<div class="education-description">${edu.description}</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getLanguageLevelLabel(level) {
        const labels = ['Débutant', 'Intermédiaire', 'Bon', 'Courant', 'Natif'];
        return labels[level - 1] || labels[2];
    }

    getInterestIcon(interest) {
        const interestLower = interest.toLowerCase();
        const iconMap = {
            'voyage': 'plane',
            'photo': 'camera',
            'sport': 'futbol',
            'musique': 'music',
            'lecture': 'book',
            'film': 'film',
            'cuisine': 'utensils',
            'art': 'palette',
            'design': 'palette',
            'tech': 'code',
            'jeux': 'gamepad',
            'nature': 'tree',
            'muscu': 'dumbbell',
            'course': 'running',
            'yoga': 'spa',
            'peinture': 'paint-brush',
            'écriture': 'pen',
            'vélo': 'bicycle',
            'rando': 'hiking'
        };
        
        for (const [key, icon] of Object.entries(iconMap)) {
            if (interestLower.includes(key)) {
                return icon;
            }
        }
        
        return 'heart';
    }
}

// Export global
window.TemplateLoader = TemplateLoader;