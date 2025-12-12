/**
 * TemplateLoader - Gestionnaire de templates
 */

class TemplateLoader {
    constructor() {
        this.templates = {
            'modern': 'styles/templates/moderne.css',
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

    loadTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.warn(`Template ${templateName} non trouvé, utilisation du template moderne`);
            templateName = 'modern';
        }

        this.currentTemplate = templateName;
        
        // Charger le fichier CSS
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

        // Appliquer la classe du template
        preview.className = `cv-preview cv-${this.currentTemplate}`;
        
        // Générer le HTML selon le template
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
                    ${personal.photo ? `
                    <div class="photo-container">
                        <img src="${personal.photo}" alt="${personal.fullName}" class="cv-photo">
                    </div>
                    ` : `
                    <div class="photo-container">
                        <div style="width: 140px; height: 140px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 3rem;">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    `}
                    
                    <div class="header-content">
                        <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                        <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                        
                        <div class="contact-info">
                            ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                            ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                            ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                        </div>
                        
                        ${(personal.linkedin || personal.github || personal.portfolio) ? `
                        <div class="cv-links">
                            ${personal.linkedin ? `<a href="${personal.linkedin}" class="cv-link" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                            ${personal.github ? `<a href="${personal.github}" class="cv-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                            ${personal.portfolio ? `<a href="${personal.portfolio}" class="cv-link" target="_blank"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Profil -->
                ${personal.summary ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-user"></i>Profil Professionnel</h3>
                    <p class="profile-text">${personal.summary}</p>
                </div>
                ` : ''}

                <!-- Expérience -->
                ${experiences.length > 0 ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-briefcase"></i>Expérience Professionnelle</h3>
                    ${experiences.map(exp => `
                        <div class="cv-item">
                            <h4 class="item-title">${exp.title || 'Poste'}</h4>
                            <div class="item-subtitle">${exp.company || 'Entreprise'}</div>
                            <div class="item-date">${exp.period || 'Période'}</div>
                            ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Formation -->
                ${educations.length > 0 ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-graduation-cap"></i>Formation</h3>
                    ${educations.map(edu => `
                        <div class="cv-item">
                            <h4 class="item-title">${edu.degree || 'Diplôme'}</h4>
                            <div class="item-subtitle">${edu.school || 'Établissement'}</div>
                            <div class="item-date">${edu.year || 'Année'}</div>
                            ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Compétences -->
                ${skills.length > 0 ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-code"></i>Compétences Techniques</h3>
                    <div class="skills-container">
                        ${skills.map(skill => `
                            <span class="skill-tag">${skill.trim()}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Langues -->
                ${languages && languages.length > 0 ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-language"></i>Langues</h3>
                    <div class="languages-container">
                        ${languages.map(lang => {
                            const level = lang.level || 3;
                            const levelPercent = (level / 5) * 100;
                            const levelLabel = this.getLanguageLevelLabel(level);
                            return `
                                <div class="language-item">
                                    <div class="language-name">
                                        <span>${lang.name || lang}</span>
                                        <span class="language-level">${levelLabel}</span>
                                    </div>
                                    <div class="language-bar">
                                        <div class="language-bar-fill" style="width: ${levelPercent}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Centres d'intérêt -->
                ${interests.length > 0 ? `
                <div class="cv-section">
                    <h3 class="section-title"><i class="fas fa-heart"></i>Centres d'Intérêt</h3>
                    <div class="interests-container">
                        ${interests.map(interest => `
                            <div class="interest-circle">
                                <div class="interest-icon">
                                    <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                </div>
                                <div class="interest-label">${interest.trim()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
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
                    ${personal.photo ? `
                    <div class="sidebar-photo">
                        <img src="${personal.photo}" alt="${personal.fullName}">
                    </div>
                    ` : `
                    <div class="sidebar-photo" style="display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 2.5rem;">
                        <i class="fas fa-user"></i>
                    </div>
                    `}
                    
                    <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                    <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>

                    <!-- Contact -->
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-address-card"></i>Contact</h3>
                        <div class="contact-info">
                            ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span>${personal.email}</span></div>` : ''}
                            ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span>${personal.phone}</span></div>` : ''}
                            ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>${personal.location}</span></div>` : ''}
                        </div>
                    </div>

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-cogs"></i>Compétences</h3>
                        <div class="skills-list">
                            ${skills.slice(0, 8).map(skill => {
                                const percentage = 70 + Math.floor(Math.random() * 30);
                                return `
                                    <div class="skill-item">
                                        <div class="skill-name">
                                            <span>${skill.trim()}</span>
                                            <span class="skill-percentage">${percentage}%</span>
                                        </div>
                                        <div class="skill-bar">
                                            <div class="skill-level" style="width: ${percentage}%"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Langues -->
                    ${languages && languages.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-language"></i>Langues</h3>
                        <div class="languages-sidebar">
                            ${languages.map(lang => {
                                const level = lang.level || 3;
                                return `
                                    <div class="language-sidebar-item">
                                        <div class="language-sidebar-name">
                                            <span>${lang.name || lang}</span>
                                            <span>${this.getLanguageLevelLabel(level)}</span>
                                        </div>
                                        <div class="language-sidebar-dots">
                                            ${[1,2,3,4,5].map(i => `
                                                <span class="language-sidebar-dot ${i <= level ? 'active' : ''}"></span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Contenu principal -->
                <div class="cv-main">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="main-section">
                        <h3 class="main-title">Profil</h3>
                        <div class="profile-content">
                            <p>${personal.summary}</p>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="main-section">
                        <h3 class="main-title">Expérience Professionnelle</h3>
                        <div class="timeline">
                            ${experiences.map(exp => `
                                <div class="timeline-item">
                                    <div class="item-header">
                                        <h4 class="item-title">${exp.title || 'Poste'}</h4>
                                        <div class="item-subtitle">${exp.company || 'Entreprise'}</div>
                                        <div class="item-date">${exp.period || 'Période'}</div>
                                    </div>
                                    ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <div class="main-section">
                        <h3 class="main-title">Formation</h3>
                        <div class="timeline">
                            ${educations.map(edu => `
                                <div class="timeline-item">
                                    <div class="item-header">
                                        <h4 class="item-title">${edu.degree || 'Diplôme'}</h4>
                                        <div class="item-subtitle">${edu.school || 'Établissement'}</div>
                                        <div class="item-date">${edu.year || 'Année'}</div>
                                    </div>
                                    ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Expertise technique -->
                    ${skills.length > 0 ? `
                    <div class="main-section">
                        <h3 class="main-title">Expertise Technique</h3>
                        <div class="expertise-grid">
                            ${this.chunkArray(skills, Math.ceil(skills.length / 2)).map(chunk => `
                                <div class="expertise-item">
                                    <h4 class="expertise-title">Compétences Clés</h4>
                                    <ul class="expertise-list">
                                        ${chunk.map(skill => `
                                            <li>${skill.trim()}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Langues (détails) -->
                    ${languages && languages.length > 0 ? `
                    <div class="main-section">
                        <h3 class="main-title">Langues Maîtrisées</h3>
                        <div class="languages-main">
                            ${languages.map(lang => {
                                const level = lang.level || 3;
                                return `
                                    <div class="language-main-item">
                                        <span class="language-main-name">${lang.name || lang}</span>
                                        <div class="language-main-dots">
                                            ${[1,2,3,4,5].map(i => `
                                                <span class="language-main-dot ${i <= level ? 'active' : ''}"></span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Intérêts -->
                    ${interests.length > 0 ? `
                    <div class="main-section">
                        <h3 class="main-title">Centres d'Intérêt</h3>
                        <div class="interests-minimal">
                            ${interests.slice(0, 6).map(interest => `
                                <div class="interest-minimal">
                                    <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                    <span>${interest.trim()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Réseaux sociaux -->
                    ${(personal.linkedin || personal.github || personal.portfolio) ? `
                    <div class="main-section">
                        <h3 class="main-title">Réseaux</h3>
                        <div class="social-links">
                            ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                            ${personal.github ? `<a href="${personal.github}" class="social-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                            ${personal.portfolio ? `<a href="${personal.portfolio}" class="social-link" target="_blank"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
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
                <!-- Header avec formes géométriques -->
                <div class="creative-header">
                    <div class="geometric-pattern">
                        <div class="shape-triangle"></div>
                        <div class="shape-circle"></div>
                    </div>
                    
                    <div class="header-content">
                        ${personal.photo ? `
                        <div class="creative-photo">
                            <img src="${personal.photo}" alt="${personal.fullName}">
                        </div>
                        ` : `
                        <div class="creative-photo" style="background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                            <i class="fas fa-user"></i>
                        </div>
                        `}
                        
                        <div class="creative-text">
                            <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                            <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                            
                            <!-- Contact -->
                            <div class="creative-contact">
                                ${personal.email ? `
                                <div class="contact-creative-item">
                                    <i class="fas fa-envelope"></i>
                                    <span>${personal.email}</span>
                                </div>
                                ` : ''}
                                
                                ${personal.phone ? `
                                <div class="contact-creative-item">
                                    <i class="fas fa-phone"></i>
                                    <span>${personal.phone}</span>
                                </div>
                                ` : ''}
                                
                                ${personal.location ? `
                                <div class="contact-creative-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${personal.location}</span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sections -->
                <div class="creative-section">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <div class="section-creative-title">
                        <i class="fas fa-user"></i>
                        <span>Profil Professionnel</span>
                    </div>
                    <div class="profile-creative">
                        <p class="profile-text">${personal.summary}</p>
                    </div>
                    ` : ''}

                    <!-- Expérience -->
                    ${experiences.length > 0 ? `
                    <div class="section-creative-title">
                        <i class="fas fa-briefcase"></i>
                        <span>Expérience</span>
                    </div>
                    <div class="creative-timeline">
                        ${experiences.map(exp => `
                            <div class="timeline-creative-item">
                                <div class="timeline-header">
                                    <div class="timeline-title">
                                        <span>${exp.title || 'Poste'}</span>
                                        <span class="timeline-company">${exp.company || 'Entreprise'}</span>
                                    </div>
                                    <div class="timeline-date">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>${exp.period || 'Période'}</span>
                                    </div>
                                </div>
                                ${exp.description ? `<p class="timeline-description">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <div class="section-creative-title">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Formation</span>
                    </div>
                    <div class="creative-timeline">
                        ${educations.map(edu => `
                            <div class="timeline-creative-item">
                                <div class="timeline-header">
                                    <div class="timeline-title">
                                        <span>${edu.degree || 'Diplôme'}</span>
                                        <span class="timeline-company">${edu.school || 'Établissement'}</span>
                                    </div>
                                    <div class="timeline-date">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>${edu.year || 'Année'}</span>
                                    </div>
                                </div>
                                ${edu.description ? `<p class="timeline-description">${edu.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="section-creative-title">
                        <i class="fas fa-code"></i>
                        <span>Compétences</span>
                    </div>
                    <div class="skills-radar">
                        ${skills.slice(0, 6).map(skill => {
                            const level = 60 + Math.floor(Math.random() * 40);
                            return `
                                <div class="radar-item">
                                    <div class="radar-icon">
                                        <i class="fas fa-${this.getSkillIcon(skill)}"></i>
                                    </div>
                                    <div class="radar-name">${skill.trim()}</div>
                                    <div class="radar-level">
                                        <div class="radar-progress" style="width: ${level}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ` : ''}

                    <!-- Langues -->
                    ${languages && languages.length > 0 ? `
                    <div class="section-creative-title">
                        <i class="fas fa-language"></i>
                        <span>Langues</span>
                    </div>
                    <div class="languages-creative">
                        ${languages.map(lang => {
                            const level = lang.level || 3;
                            const levelPercent = (level / 5) * 100;
                            return `
                                <div class="language-creative-item">
                                    <div class="semi-circle-container">
                                        <div class="semi-circle-bg">
                                            <div class="semi-circle-fill" style="--level: ${levelPercent}%"></div>
                                        </div>
                                    </div>
                                    <div class="language-creative-name">${lang.name || lang}</div>
                                    <div class="language-creative-level">${this.getLanguageLevelLabel(level)}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ` : ''}

                    <!-- Intérêts -->
                    ${interests.length > 0 ? `
                    <div class="section-creative-title">
                        <i class="fas fa-heart"></i>
                        <span>Intérêts</span>
                    </div>
                    <div class="interests-geometric">
                        ${interests.slice(0, 4).map((interest, index) => {
                            const shapes = ['shape-hexagon', 'shape-diamond', 'shape-pentagon', 'shape-hexagon'];
                            const icons = ['music', 'camera', 'plane', 'book', 'futbol', 'palette', 'code', 'headphones'];
                            return `
                                <div class="geometric-interest">
                                    <div class="geometric-shape ${shapes[index % shapes.length]}">
                                        <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                    </div>
                                    <div class="geometric-label">${interest.trim()}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ` : ''}

                    <!-- Réseaux sociaux -->
                    ${(personal.linkedin || personal.github || personal.portfolio) ? `
                    <div class="section-creative-title">
                        <i class="fas fa-share-alt"></i>
                        <span>Réseaux</span>
                    </div>
                    <div class="social-creative">
                        ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-creative-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personal.github ? `<a href="${personal.github}" class="social-creative-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${personal.portfolio ? `<a href="${personal.portfolio}" class="social-creative-link" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE EXECUTIVE ==========
    generateExecutiveHTML(data) {
        const { personal, experiences, educations, skills, languages, interests } = data;
        
        return `
            <div class="cv-executive">
                <!-- En-tête -->
                <div class="executive-header">
                    <div class="header-container">
                        ${personal.photo ? `
                        <div class="executive-photo">
                            <img src="${personal.photo}" alt="${personal.fullName}">
                        </div>
                        ` : `
                        <div class="executive-photo" style="background: linear-gradient(135deg, #374151, #1f2937); display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 3rem;">
                            <i class="fas fa-user"></i>
                        </div>
                        `}
                        
                        <div class="header-text">
                            <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                            <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                            
                            <div class="executive-contact">
                                ${personal.email ? `<div class="contact-line"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                                ${personal.phone ? `<div class="contact-line"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                                ${personal.location ? `<div class="contact-line"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="executive-accent"></div>
                </div>

                <!-- Corps -->
                <div class="executive-body">
                    <!-- Colonne gauche -->
                    <div class="executive-column">
                        <!-- Profil -->
                        ${personal.summary ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-user"></i>Profil Exécutif</h3>
                            </div>
                            <div class="executive-profile">
                                <p class="profile-text-executive">${personal.summary}</p>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Expérience -->
                        ${experiences.length > 0 ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-briefcase"></i>Expérience Professionnelle</h3>
                            </div>
                            <div class="executive-timeline">
                                ${experiences.map(exp => `
                                    <div class="timeline-item">
                                        <div class="item-header-executive">
                                            <h4 class="item-title-executive">${exp.title || 'Poste'}</h4>
                                            <div class="item-subtitle-executive">${exp.company || 'Entreprise'}</div>
                                            <div class="item-date-executive">
                                                <i class="fas fa-calendar"></i>
                                                ${exp.period || 'Période'}
                                            </div>
                                        </div>
                                        ${exp.description ? `<p class="item-description-executive">${exp.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Formation -->
                        ${educations.length > 0 ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-graduation-cap"></i>Formation</h3>
                            </div>
                            <div class="executive-timeline">
                                ${educations.map(edu => `
                                    <div class="timeline-item">
                                        <div class="item-header-executive">
                                            <h4 class="item-title-executive">${edu.degree || 'Diplôme'}</h4>
                                            <div class="item-subtitle-executive">${edu.school || 'Établissement'}</div>
                                            <div class="item-date-executive">
                                                <i class="fas fa-calendar"></i>
                                                ${edu.year || 'Année'}
                                            </div>
                                        </div>
                                        ${edu.description ? `<p class="item-description-executive">${edu.description}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Colonne droite -->
                    <div class="executive-column">
                        <!-- Compétences -->
                        ${skills.length > 0 ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-cogs"></i>Expertise</h3>
                            </div>
                            <div class="expertise-executive">
                                ${skills.slice(0, 6).map(skill => {
                                    const level = 3 + Math.floor(Math.random() * 2);
                                    const levelPercent = (level / 5) * 100;
                                    return `
                                        <div class="expertise-item-executive">
                                            <div class="expertise-header">
                                                <span class="expertise-name">${skill.trim()}</span>
                                                <span class="expertise-level">${this.getLanguageLevelLabel(level)}</span>
                                            </div>
                                            <div class="expertise-bar">
                                                <div class="expertise-progress" style="width: ${levelPercent}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Langues améliorées -->
                        ${languages && languages.length > 0 ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-language"></i>Langues</h3>
                            </div>
                            <div class="languages-executive-container">
                                ${languages.map(lang => {
                                    const level = lang.level || 3;
                                    const levelPercent = (level / 5) * 100;
                                    return `
                                        <div class="language-executive-item">
                                            <div class="language-header">
                                                <span class="language-name-executive">${lang.name || lang}</span>
                                                <span class="language-level-label">${this.getLanguageLevelLabel(level)}</span>
                                            </div>
                                            <div class="language-executive-bar">
                                                <div class="language-level-executive" style="--level: ${levelPercent}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Intérêts -->
                        ${interests.length > 0 ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-heart"></i>Intérêts</h3>
                            </div>
                            <div class="interests-executive">
                                ${interests.slice(0, 4).map(interest => `
                                    <div class="interest-hexagon">
                                        <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                        <div class="interest-label-executive">${interest.trim()}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Réseaux -->
                        ${(personal.linkedin || personal.github || personal.portfolio) ? `
                        <div class="executive-section">
                            <div class="section-header-executive">
                                <h3 class="section-title-executive"><i class="fas fa-share-alt"></i>Réseaux Professionnels</h3>
                            </div>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                ${personal.linkedin ? `
                                <div class="contact-line" style="flex: 1; min-width: 120px;">
                                    <i class="fab fa-linkedin"></i>
                                    <span>LinkedIn</span>
                                </div>
                                ` : ''}
                                
                                ${personal.github ? `
                                <div class="contact-line" style="flex: 1; min-width: 120px;">
                                    <i class="fab fa-github"></i>
                                    <span>GitHub</span>
                                </div>
                                ` : ''}
                                
                                ${personal.portfolio ? `
                                <div class="contact-line" style="flex: 1; min-width: 120px;">
                                    <i class="fas fa-globe"></i>
                                    <span>Portfolio</span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer -->
                <div class="executive-footer">
                    <p class="footer-text">Curriculum Vitae - ${personal.fullName || 'Nom Prénom'}</p>
                </div>
            </div>
        `;
    }

    // ========== UTILITAIRES ==========
    getLanguageLevelLabel(level) {
        const labels = ['Débutant', 'Intermédiaire', 'Bon', 'Courant', 'Natif'];
        return labels[level - 1] || labels[2];
    }

    getInterestIcon(interest) {
        const interestLower = interest.toLowerCase();
        if (interestLower.includes('voyage')) return 'plane';
        if (interestLower.includes('photo')) return 'camera';
        if (interestLower.includes('sport')) return 'futbol';
        if (interestLower.includes('musique') || interestLower.includes('music')) return 'music';
        if (interestLower.includes('lecture') || interestLower.includes('book')) return 'book';
        if (interestLower.includes('film') || interestLower.includes('movie')) return 'film';
        if (interestLower.includes('cuisine') || interestLower.includes('cooking')) return 'utensils';
        if (interestLower.includes('art') || interestLower.includes('design')) return 'palette';
        if (interestLower.includes('tech') || interestLower.includes('code')) return 'code';
        return 'heart';
    }

    getSkillIcon(skill) {
        const skillLower = skill.toLowerCase();
        if (skillLower.includes('js') || skillLower.includes('javascript')) return 'js';
        if (skillLower.includes('react')) return 'react';
        if (skillLower.includes('node')) return 'node-js';
        if (skillLower.includes('python')) return 'python';
        if (skillLower.includes('java')) return 'java';
        if (skillLower.includes('html')) return 'html5';
        if (skillLower.includes('css')) return 'css3-alt';
        if (skillLower.includes('database') || skillLower.includes('sql')) return 'database';
        if (skillLower.includes('git')) return 'git-alt';
        if (skillLower.includes('docker')) return 'docker';
        return 'code';
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}

// Exporter la classe
window.TemplateLoader = TemplateLoader;
