/**
 * TemplateLoader - Gestionnaire de templates CV
 * Charge et rend les différents templates
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
        // Charger le template par défaut
        this.loadTemplate(this.currentTemplate);
    }

    async loadTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.warn(`Template ${templateName} non trouvé, utilisation du template moderne`);
            templateName = 'modern';
        }

        this.currentTemplate = templateName;
        
        // Charger le fichier CSS du template
        const link = document.getElementById('template-css');
        if (link) {
            link.href = this.templates[templateName];
        }
        
        // Sauvegarder la préférence
        localStorage.setItem('selectedTemplate', templateName);
        
        return templateName;
    }

    renderCV(cvData) {
        const preview = document.getElementById('cv-preview');
        if (!preview) return;

        // Appliquer la classe du template actuel
        preview.className = `cv-preview cv-${this.currentTemplate}`;
        
        // Générer le HTML selon le template sélectionné
        let html = '';
        switch (this.currentTemplate) {
            case 'modern':
                html = this.generateModernHTML(cvData);
                break;
            case 'professional':
                html = this.generateProfessionalHTML(cvData);
                break;
            case 'creative':
                html = this.generateCreativeHTML(cvData);
                break;
            case 'executive':
                html = this.generateExecutiveHTML(cvData);
                break;
            default:
                html = this.generateModernHTML(cvData);
        }
        
        preview.innerHTML = html;
    }

    // ========== TEMPLATE MODERNE ==========
    generateModernHTML(data) {
        const { personal, experiences, educations, skills, languages, interests } = data;
        
        return `
            <div class="cv-modern">
                <!-- En-tête -->
                <div class="cv-header">
                    <div class="cv-main-info">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                    </div>
                    
                    <div class="cv-contact-info">
                        ${personal.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                        ${personal.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                        ${personal.location ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                    </div>
                </div>

                <!-- Informations complémentaires -->
                <div class="cv-links">
                    ${personal.linkedin ? `<a href="${personal.linkedin}" class="cv-link" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                    ${personal.github ? `<a href="${personal.github}" class="cv-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${personal.portfolio ? `<a href="${personal.portfolio}" class="cv-link" target="_blank"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
                </div>

                <!-- Sections principales -->
                <div class="cv-sections">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-user"></i>Profil Professionnel</h3>
                        <div class="section-content">
                            <p>${personal.summary}</p>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-briefcase"></i>Expérience Professionnelle</h3>
                        <div class="section-content">
                            ${experiences.map(exp => `
                                <div class="cv-item">
                                    <div class="item-header">
                                        <h4>${exp.title || 'Poste'}</h4>
                                        <span class="company">${exp.company || 'Entreprise'}</span>
                                        <span class="date">${exp.period || 'Période'}</span>
                                    </div>
                                    ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-graduation-cap"></i>Formation</h3>
                        <div class="section-content">
                            ${educations.map(edu => `
                                <div class="cv-item">
                                    <div class="item-header">
                                        <h4>${edu.degree || 'Diplôme'}</h4>
                                        <span class="company">${edu.school || 'Établissement'}</span>
                                        <span class="date">${edu.year || 'Année'}</span>
                                    </div>
                                    ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-code"></i>Compétences Techniques</h3>
                        <div class="section-content">
                            <div class="skills-container">
                                ${skills.map(skill => `
                                    <span class="skill-tag">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Langues -->
                    ${languages.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-language"></i>Langues</h3>
                        <div class="section-content">
                            <div class="languages-list">
                                ${languages.map(lang => `
                                    <div class="language-item">
                                        <span class="language-name">${lang.trim()}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Centres d'intérêt -->
                    ${interests.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-heart"></i>Centres d'Intérêt</h3>
                        <div class="section-content">
                            <div class="interests-container">
                                ${interests.map(interest => `
                                    <span class="interest-tag">${interest.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE PROFESSIONNEL ==========
    generateProfessionalHTML(data) {
        const { personal, experiences, educations, skills, languages, interests } = data;
        
        return `
            <div class="cv-professional">
                <!-- Sidebar -->
                <div class="cv-sidebar">
                    <!-- Photo de profil -->
                    <div class="cv-avatar">
                        <div class="avatar-placeholder">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    
                    <!-- Informations de contact -->
                    <div class="cv-contact-sidebar">
                        <h3 class="sidebar-title">Contact</h3>
                        ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                        ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                        ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                    </div>

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="cv-skills-sidebar">
                        <h3 class="sidebar-title">Compétences</h3>
                        <div class="skills-list">
                            ${skills.map(skill => `
                                <div class="skill-item">
                                    <span class="skill-name">${skill.trim()}</span>
                                    <div class="skill-bar">
                                        <div class="skill-level" style="width: ${70 + Math.random() * 30}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Langues -->
                    ${languages.length > 0 ? `
                    <div class="cv-languages-sidebar">
                        <h3 class="sidebar-title">Langues</h3>
                        <div class="languages-list">
                            ${languages.map(lang => `
                                <div class="language-item">
                                    <span class="language-name">${lang.trim()}</span>
                                    <div class="language-level">${this.getLanguageLevel(lang)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Contenu principal -->
                <div class="cv-main">
                    <!-- En-tête -->
                    <div class="cv-header-professional">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                    </div>

                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-user"></i>Profil</h3>
                        <div class="section-content">
                            <p>${personal.summary}</p>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-briefcase"></i>Expérience Professionnelle</h3>
                        <div class="section-content">
                            <div class="timeline">
                                ${experiences.map(exp => `
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <h4>${exp.title || 'Poste'}</h4>
                                            <div class="timeline-subtitle">
                                                <span class="company">${exp.company || 'Entreprise'}</span>
                                                <span class="date">${exp.period || 'Période'}</span>
                                            </div>
                                            ${exp.description ? `<p>${exp.description}</p>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-graduation-cap"></i>Formation</h3>
                        <div class="section-content">
                            <div class="timeline">
                                ${educations.map(edu => `
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <h4>${edu.degree || 'Diplôme'}</h4>
                                            <div class="timeline-subtitle">
                                                <span class="company">${edu.school || 'Établissement'}</span>
                                                <span class="date">${edu.year || 'Année'}</span>
                                            </div>
                                            ${edu.description ? `<p>${edu.description}</p>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Centres d'intérêt -->
                    ${interests.length > 0 ? `
                    <div class="cv-section">
                        <h3 class="section-title"><i class="fas fa-heart"></i>Centres d'Intérêt</h3>
                        <div class="section-content">
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
            </div>
        `;
    }

    // ========== TEMPLATE CRÉATIF ==========
    generateCreativeHTML(data) {
        const { personal, experiences, educations, skills, languages, interests } = data;
        
        return `
            <div class="cv-creative">
                <!-- En-tête créatif -->
                <div class="cv-creative-header">
                    <div class="creative-accent"></div>
                    <div class="creative-content">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                    </div>
                </div>

                <!-- Informations de contact -->
                <div class="cv-contact-creative">
                    <div class="contact-grid">
                        ${personal.email ? `
                        <div class="contact-card">
                            <i class="fas fa-envelope"></i>
                            <div class="contact-info">
                                <span class="contact-label">Email</span>
                                <span class="contact-value">${personal.email}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${personal.phone ? `
                        <div class="contact-card">
                            <i class="fas fa-phone"></i>
                            <div class="contact-info">
                                <span class="contact-label">Téléphone</span>
                                <span class="contact-value">${personal.phone}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${personal.location ? `
                        <div class="contact-card">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="contact-info">
                                <span class="contact-label">Localisation</span>
                                <span class="contact-value">${personal.location}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Contenu principal -->
                <div class="cv-creative-content">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="cv-section creative-section">
                        <div class="section-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="section-content">
                            <h3 class="section-title">Profil</h3>
                            <p>${personal.summary}</p>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="cv-section creative-section">
                        <div class="section-icon">
                            <i class="fas fa-briefcase"></i>
                        </div>
                        <div class="section-content">
                            <h3 class="section-title">Expérience</h3>
                            <div class="experience-cards">
                                ${experiences.map(exp => `
                                    <div class="experience-card">
                                        <div class="card-header">
                                            <h4>${exp.title || 'Poste'}</h4>
                                            <div class="card-subtitle">
                                                <span class="company">${exp.company || 'Entreprise'}</span>
                                                <span class="date">${exp.period || 'Période'}</span>
                                            </div>
                                        </div>
                                        ${exp.description ? `<p class="card-description">${exp.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="cv-section creative-section">
                        <div class="section-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <div class="section-content">
                            <h3 class="section-title">Compétences</h3>
                            <div class="skills-bubbles">
                                ${skills.map(skill => `
                                    <span class="skill-bubble">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Langues et centres d'intérêt -->
                    <div class="creative-row">
                        ${languages.length > 0 ? `
                        <div class="cv-section creative-section half">
                            <div class="section-icon">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="section-content">
                                <h3 class="section-title">Langues</h3>
                                <div class="languages-list">
                                    ${languages.map(lang => `
                                        <div class="language-item">
                                            <span class="language-name">${lang.trim()}</span>
                                            <div class="language-dots">
                                                ${this.generateLanguageDots(lang)}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${interests.length > 0 ? `
                        <div class="cv-section creative-section half">
                            <div class="section-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="section-content">
                                <h3 class="section-title">Intérêts</h3>
                                <div class="interests-grid">
                                    ${interests.map(interest => `
                                        <div class="interest-circle">
                                            <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                            <span>${interest.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE EXECUTIVE ==========
    generateExecutiveHTML(data) {
        const { personal, experiences, educations, skills, languages, interests } = data;
        
        return `
            <div class="cv-executive">
                <!-- Barre latérale -->
                <div class="cv-executive-sidebar">
                    <!-- Nom et profession -->
                    <div class="sidebar-header">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                    </div>

                    <!-- Contact -->
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">Contact</h3>
                        <div class="sidebar-content">
                            ${personal.email ? `<div class="contact-line"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                            ${personal.phone ? `<div class="contact-line"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                            ${personal.location ? `<div class="contact-line"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                        </div>
                    </div>

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">Expertise</h3>
                        <div class="sidebar-content">
                            <div class="expertise-list">
                                ${skills.map(skill => `
                                    <div class="expertise-item">
                                        <span class="expertise-name">${skill.trim()}</span>
                                        <div class="expertise-level">
                                            ${this.generateSkillLevel(5)}
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
                        <h3 class="sidebar-title">Langues</h3>
                        <div class="sidebar-content">
                            ${languages.map(lang => `
                                <div class="language-item-executive">
                                    <span class="language-name">${lang.trim()}</span>
                                    <span class="language-level">${this.getExecutiveLanguageLevel(lang)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Contenu principal -->
                <div class="cv-executive-main">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="executive-section">
                        <h3 class="executive-title"><span>Profil</span></h3>
                        <div class="executive-content">
                            <p>${personal.summary}</p>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="executive-section">
                        <h3 class="executive-title"><span>Expérience</span></h3>
                        <div class="executive-content">
                            <div class="executive-timeline">
                                ${experiences.map(exp => `
                                    <div class="executive-item">
                                        <div class="item-header">
                                            <h4>${exp.title || 'Poste'}</h4>
                                            <div class="item-subtitle">
                                                <span class="company">${exp.company || 'Entreprise'}</span>
                                                <span class="separator">|</span>
                                                <span class="date">${exp.period || 'Période'}</span>
                                            </div>
                                        </div>
                                        ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <div class="executive-section">
                        <h3 class="executive-title"><span>Formation</span></h3>
                        <div class="executive-content">
                            ${educations.map(edu => `
                                <div class="executive-item">
                                    <div class="item-header">
                                        <h4>${edu.degree || 'Diplôme'}</h4>
                                        <div class="item-subtitle">
                                            <span class="company">${edu.school || 'Établissement'}</span>
                                            <span class="separator">|</span>
                                            <span class="date">${edu.year || 'Année'}</span>
                                        </div>
                                    </div>
                                    ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Centres d'intérêt -->
                    ${interests.length > 0 ? `
                    <div class="executive-section">
                        <h3 class="executive-title"><span>Intérêts</span></h3>
                        <div class="executive-content">
                            <div class="executive-interests">
                                ${interests.map(interest => `
                                    <span class="interest-tag-executive">${interest.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Liens professionnels -->
                    ${(personal.linkedin || personal.github || personal.portfolio) ? `
                    <div class="executive-section">
                        <h3 class="executive-title"><span>Réseaux</span></h3>
                        <div class="executive-content">
                            <div class="executive-links">
                                ${personal.linkedin ? `<a href="${personal.linkedin}" class="executive-link"><i class="fab fa-linkedin"></i></a>` : ''}
                                ${personal.github ? `<a href="${personal.github}" class="executive-link"><i class="fab fa-github"></i></a>` : ''}
                                ${personal.portfolio ? `<a href="${personal.portfolio}" class="executive-link"><i class="fas fa-globe"></i></a>` : ''}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ========== UTILITAIRES ==========
    getLanguageLevel(lang) {
        const langLower = lang.toLowerCase();
        if (langLower.includes('natif') || langLower.includes('maternelle')) return 'Natif';
        if (langLower.includes('courant') || langLower.includes('fluent')) return 'Courant';
        if (langLower.includes('intermédiaire') || langLower.includes('intermediaire')) return 'Intermédiaire';
        if (langLower.includes('débutant') || langLower.includes('debutant')) return 'Débutant';
        return 'Intermédiaire';
    }

    getExecutiveLanguageLevel(lang) {
        const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif'];
        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
        return randomLevel;
    }

    getInterestIcon(interest) {
        const interestLower = interest.toLowerCase();
        if (interestLower.includes('voyage') || interestLower.includes('travel')) return 'plane';
        if (interestLower.includes('photo') || interestLower.includes('camera')) return 'camera';
        if (interestLower.includes('sport') || interestLower.includes('football') || interestLower.includes('basketball')) return 'futbol';
        if (interestLower.includes('music') || interestLower.includes('musique')) return 'music';
        if (interestLower.includes('book') || interestLower.includes('lecture') || interestLower.includes('reading')) return 'book';
        if (interestLower.includes('film') || interestLower.includes('movie') || interestLower.includes('cinema')) return 'film';
        return 'heart';
    }

    generateLanguageDots(lang) {
        const level = this.getLanguageLevel(lang);
        const dotCount = level === 'Natif' ? 5 : level === 'Courant' ? 4 : level === 'Intermédiaire' ? 3 : 2;
        
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            dots += `<span class="language-dot ${i <= dotCount ? 'filled' : ''}"></span>`;
        }
        return dots;
    }

    generateSkillLevel(max = 5) {
        const level = Math.floor(Math.random() * max) + 1;
        let html = '';
        for (let i = 1; i <= max; i++) {
            html += `<span class="skill-level-dot ${i <= level ? 'active' : ''}"></span>`;
        }
        return html;
    }
}

// Exporter la classe
window.TemplateLoader = TemplateLoader;
