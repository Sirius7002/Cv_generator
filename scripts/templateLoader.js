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
        
        // Mettre à jour le nom du template dans l'interface
        const templateNameElement = document.getElementById('current-template-name');
        if (templateNameElement) {
            const templateNames = {
                'modern': 'Moderne',
                'professional': 'Professionnel',
                'creative': 'Créatif',
                'executive': 'Executive'
            };
            templateNameElement.textContent = templateNames[templateName] || templateName;
        }
        
        // Sauvegarder la préférence
        localStorage.setItem('cvTemplate', templateName);
        
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
        this.attachDynamicBehaviors();
    }

    // ========== TEMPLATE MODERNE ==========
    
    generateModernHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-modern">
                <!-- En-tête -->
                <div class="cv-header">
                    <div class="header-content">
                        <div class="header-left">
                            <div class="cv-photo">
                                ${personal.photo ? 
                                    `<img src="${personal.photo}" alt="${personal.fullName || 'Photo'}" crossorigin="anonymous">` : 
                                    `<div class="photo-placeholder"><i class="fas fa-user-circle"></i></div>`
                                }
                            </div>
                            <div class="header-text">
                                <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                                <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>
                            </div>
                        </div>
                        <div class="contact-info">
                            ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                            ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                            ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                            ${personal.linkedin ? `<div class="contact-item"><i class="fab fa-linkedin"></i>${personal.linkedin}</div>` : ''}
                            ${personal.github ? `<div class="contact-item"><i class="fab fa-github"></i>${personal.github}</div>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Contenu principal -->
                <div class="cv-content">
                    <!-- Profil -->
                    ${personal.summary ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-user"></i>Profil Professionnel</h3>
                        <div class="section-content">
                            <p class="profile-text">${personal.summary}</p>
                        </div>
                    </section>
                    ` : ''}

                    <!-- Expériences -->
                    ${experiences.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-briefcase"></i>Expérience Professionnelle</h3>
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

                    <!-- Formation -->
                    ${educations.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-graduation-cap"></i>Formation</h3>
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

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-code"></i>Compétences Techniques</h3>
                        <div class="section-content">
                            <div class="skills-list">
                                ${skills.map(skill => `
                                    <span class="skill-tag">${skill.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </section>
                    ` : ''}

                    <!-- Langues -->
                    ${languages.length > 0 ? `
                    <section class="cv-section">
                        <h3 class="section-title"><i class="fas fa-language"></i>Langues</h3>
                        <div class="section-content">
                            ${languages.map(lang => `
                                <div class="language-item">
                                    <div class="language-header">
                                        <span class="language-name">${lang.name || lang}</span>
                                        <span class="language-level">${this.getLanguageLevelLabel(lang.level || 3)}</span>
                                    </div>
                                    <div class="language-bar">
                                        <div class="language-progress" style="width: ${((lang.level || 3) / 5) * 100}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}

                    <!-- Intérêts -->
                    ${interests.length > 0 ? `
                    <section class="cv-section">
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
                    </section>
                    ` : ''}
                </div>

                <!-- Footer -->
                <div class="cv-footer">
                    <div class="footer-info">
                        ${personal.portfolio ? `<p>Portfolio: ${personal.portfolio}</p>` : ''}
                    </div>
                    <div class="social-links">
                        ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personal.github ? `<a href="${personal.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${personal.email ? `<a href="mailto:${personal.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE PROFESSIONNEL ==========
    
    generateProfessionalHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-professional">
                <!-- Sidebar -->
                <div class="cv-sidebar">
                    <div class="sidebar-photo">
                        ${personal.photo ? 
                            `<img src="${personal.photo}" alt="${personal.fullName || 'Photo'}" crossorigin="anonymous">` : 
                            `<div class="sidebar-photo-placeholder"><i class="fas fa-user-circle"></i></div>`
                        }
                    </div>
                    
                    <h1 class="cv-name">${personal.fullName || 'Nom Prénom'}</h1>
                    <h2 class="cv-profession">${personal.profession || 'Profession'}</h2>

                    <!-- Contact -->
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-address-card"></i> Contact</h3>
                        <div class="contact-info">
                            ${personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><span>${personal.email}</span></div>` : ''}
                            ${personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><span>${personal.phone}</span></div>` : ''}
                            ${personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>${personal.location}</span></div>` : ''}
                        </div>
                    </div>

                    <!-- Compétences -->
                    ${skills.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-code"></i> Compétences</h3>
                        <div class="skills-list">
                            ${skills.slice(0, 6).map(skill => {
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
                    ${languages.length > 0 ? `
                    <div class="sidebar-section">
                        <h3 class="sidebar-title"><i class="fas fa-language"></i> Langues</h3>
                        <div class="languages-sidebar">
                            ${languages.map(lang => `
                                <div class="language-sidebar-item">
                                    <div class="language-sidebar-name">
                                        <span>${lang.name || lang}</span>
                                        <span>${this.getLanguageLevelLabel(lang.level || 3)}</span>
                                    </div>
                                    <div class="language-sidebar-dots">
                                        ${[1,2,3,4,5].map(i => `
                                            <span class="language-sidebar-dot ${i <= (lang.level || 3) ? 'active' : ''}"></span>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
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
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE CRÉATIF ==========
    
    generateCreativeHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-creative">
                <div class="cv-container">
                    <!-- En-tête créatif -->
                    <div class="cv-header">
                        <div class="header-left">
                            <div class="cv-photo">
                                ${personal.photo ? 
                                    `<img src="${personal.photo}" alt="${personal.fullName || 'Photo'}" crossorigin="anonymous">` : 
                                    `<div class="photo-placeholder"><i class="fas fa-user-circle"></i></div>`
                                }
                            </div>
                            <div class="header-info">
                                <h1 class="cv-name creative-name">${personal.fullName || 'Nom Prénom'}</h1>
                                <h2 class="cv-profession creative-profession">${personal.profession || 'Profession'}</h2>
                                <div class="contact-badges">
                                    ${personal.email ? `<div class="contact-badge"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                                    ${personal.phone ? `<div class="contact-badge"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                                    ${personal.location ? `<div class="contact-badge"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="header-decoration"></div>
                    </div>

                    <!-- Contenu principal -->
                    <div class="cv-content">
                        <div class="main-sections">
                            <!-- Profil -->
                            ${personal.summary ? `
                            <section class="section-creative">
                                <h3 class="section-title-creative"><i class="fas fa-user"></i> Profil</h3>
                                <div class="profile-creative">
                                    <p>${personal.summary}</p>
                                </div>
                            </section>
                            ` : ''}

                            <!-- Expérience -->
                            ${experiences.length > 0 ? `
                            <section class="section-creative">
                                <h3 class="section-title-creative"><i class="fas fa-briefcase"></i> Expérience</h3>
                                <div class="timeline-creative">
                                    ${experiences.map(exp => `
                                        <div class="timeline-item-creative">
                                            <div class="timeline-header">
                                                <h4 class="timeline-title">${exp.title || 'Poste'}</h4>
                                                <div class="timeline-subtitle">${exp.company || 'Entreprise'}</div>
                                                <div class="timeline-date">${exp.period || 'Période'}</div>
                                            </div>
                                            ${exp.description ? `<div class="timeline-description">${exp.description}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                            ` : ''}

                            <!-- Formation -->
                            ${educations.length > 0 ? `
                            <section class="section-creative">
                                <h3 class="section-title-creative"><i class="fas fa-graduation-cap"></i> Formation</h3>
                                <div class="timeline-creative">
                                    ${educations.map(edu => `
                                        <div class="timeline-item-creative">
                                            <div class="timeline-header">
                                                <h4 class="timeline-title">${edu.degree || 'Diplôme'}</h4>
                                                <div class="timeline-subtitle">${edu.school || 'Établissement'}</div>
                                                <div class="timeline-date">${edu.year || 'Année'}</div>
                                            </div>
                                            ${edu.description ? `<div class="timeline-description">${edu.description}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                            ` : ''}
                        </div>

                        <div class="sidebar-creative">
                            <!-- Compétences -->
                            ${skills.length > 0 ? `
                            <section class="skills-creative">
                                <h3 class="creative-section-title">Compétences</h3>
                                <div class="skills-creative-content">
                                    ${skills.map(skill => `
                                        <div class="skill-creative">
                                            <div class="skill-header">
                                                <span class="skill-name">${skill.trim()}</span>
                                                <span class="skill-percentage">${70 + Math.floor(Math.random() * 30)}%</span>
                                            </div>
                                            <div class="skill-bar-creative" style="--skill-level: ${0.7 + Math.random() * 0.3}"></div>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                            ` : ''}

                            <!-- Langues -->
                            ${languages.length > 0 ? `
                            <section class="languages-creative">
                                <h3 class="creative-section-title">Langues</h3>
                                <div class="languages-creative-content">
                                    ${languages.map(lang => `
                                        <div class="language-creative">
                                            <div class="language-flag">
                                                <i class="fas fa-globe"></i>
                                            </div>
                                            <div class="language-info">
                                                <div class="language-name">${lang.name || lang}</div>
                                                <div class="language-level-bars">
                                                    ${[1,2,3,4,5].map(i => `
                                                        <div class="level-bar ${i <= (lang.level || 3) ? 'active' : ''}"></div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                            ` : ''}

                            <!-- Intérêts -->
                            ${interests.length > 0 ? `
                            <section class="interests-creative">
                                <h3 class="creative-section-title">Intérêts</h3>
                                <div class="interests-grid-creative">
                                    ${interests.map(interest => `
                                        <div class="interest-item-creative">
                                            <div class="interest-icon">
                                                <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                            </div>
                                            <div class="interest-label">${interest.trim()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Footer créatif -->
                    <div class="cv-footer-creative">
                        ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link-creative" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personal.github ? `<a href="${personal.github}" class="social-link-creative" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${personal.email ? `<a href="mailto:${personal.email}" class="social-link-creative"><i class="fas fa-envelope"></i></a>` : ''}
                        ${personal.portfolio ? `<a href="${personal.portfolio}" class="social-link-creative" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ========== TEMPLATE EXECUTIF ==========
    
    generateExecutiveHTML(data) {
        const { personal, experiences = [], educations = [], skills = [], languages = [], interests = [] } = data;
        
        return `
            <div class="cv-executive">
                <!-- En-tête exécutif -->
                <div class="cv-header-executive">
                    <div class="header-executive-content">
                        <div class="executive-info">
                            <h1 class="cv-name-executive">${personal.fullName || 'Nom Prénom'}</h1>
                            <h2 class="cv-profession-executive">${personal.profession || 'Profession'}</h2>
                            <div class="executive-contact">
                                ${personal.email ? `<div class="contact-item-executive"><i class="fas fa-envelope"></i>${personal.email}</div>` : ''}
                                ${personal.phone ? `<div class="contact-item-executive"><i class="fas fa-phone"></i>${personal.phone}</div>` : ''}
                                ${personal.location ? `<div class="contact-item-executive"><i class="fas fa-map-marker-alt"></i>${personal.location}</div>` : ''}
                            </div>
                        </div>
                        <div class="executive-photo">
                            ${personal.photo ? 
                                `<img src="${personal.photo}" alt="${personal.fullName || 'Photo'}" crossorigin="anonymous">` : 
                                `<div class="photo-placeholder-executive"><i class="fas fa-user-circle"></i></div>`
                            }
                        </div>
                    </div>
                </div>

                <!-- Contenu principal -->
                <div class="cv-content-executive">
                    <div class="main-sections-executive">
                        <!-- Profil -->
                        ${personal.summary ? `
                        <section class="section-executive">
                            <h3 class="section-title-executive"><i class="fas fa-user-tie"></i>PROFIL PROFESSIONNEL</h3>
                            <div class="profile-executive">
                                ${personal.summary}
                            </div>
                        </section>
                        ` : ''}

                        <!-- Expérience -->
                        ${experiences.length > 0 ? `
                        <section class="section-executive">
                            <h3 class="section-title-executive"><i class="fas fa-briefcase"></i>EXPÉRIENCE PROFESSIONNELLE</h3>
                            <div class="experiences-executive">
                                ${experiences.map(exp => `
                                    <div class="experience-executive">
                                        <div class="experience-header-executive">
                                            <div class="experience-info">
                                                <h4 class="experience-title-executive">${exp.title || 'Poste'}</h4>
                                                <div class="experience-company-executive">${exp.company || 'Entreprise'}</div>
                                            </div>
                                            <div class="experience-period-executive">${exp.period || 'Période'}</div>
                                        </div>
                                        ${exp.description ? `<div class="experience-description-executive">${exp.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}

                        <!-- Formation -->
                        ${educations.length > 0 ? `
                        <section class="section-executive">
                            <h3 class="section-title-executive"><i class="fas fa-graduation-cap"></i>FORMATION</h3>
                            <div class="educations-executive">
                                ${educations.map(edu => `
                                    <div class="education-executive">
                                        <div class="education-icon">
                                            <i class="fas fa-university"></i>
                                        </div>
                                        <div class="education-info">
                                            <h4 class="education-degree-executive">${edu.degree || 'Diplôme'}</h4>
                                            <div class="education-school-executive">${edu.school || 'Établissement'}</div>
                                            <div class="education-year-executive">${edu.year || 'Année'}</div>
                                            ${edu.description ? `<div class="education-description-executive">${edu.description}</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </div>

                    <div class="sidebar-executive">
                        <!-- Compétences -->
                        ${skills.length > 0 ? `
                        <section class="skills-executive">
                            <h3 class="section-title-executive"><i class="fas fa-code"></i>COMPÉTENCES</h3>
                            <div class="skills-executive-content">
                                ${skills.slice(0, 8).map(skill => {
                                    const percentage = 75 + Math.floor(Math.random() * 25);
                                    return `
                                        <div class="skill-executive">
                                            <div class="skill-label-executive">
                                                <span class="skill-name-executive">${skill.trim()}</span>
                                                <span class="skill-value-executive">${percentage}%</span>
                                            </div>
                                            <div class="skill-bar-executive">
                                                <div class="skill-level-executive" style="width: ${percentage}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </section>
                        ` : ''}

                        <!-- Langues -->
                        ${languages.length > 0 ? `
                        <section class="languages-executive">
                            <h3 class="section-title-executive"><i class="fas fa-language"></i>LANGUES</h3>
                            <div class="languages-executive-content">
                                ${languages.map(lang => `
                                    <div class="language-executive">
                                        <span class="language-name-executive">${lang.name || lang}</span>
                                        <div class="language-dots-executive">
                                            ${[1,2,3,4,5].map(i => `
                                                <span class="language-dot ${i <= (lang.level || 3) ? 'active' : ''}"></span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}

                        <!-- Intérêts -->
                        ${interests.length > 0 ? `
                        <section class="interests-executive">
                            <h3 class="section-title-executive"><i class="fas fa-heart"></i>CENTRES D'INTÉRÊT</h3>
                            <div class="interests-grid-executive">
                                ${interests.slice(0, 8).map(interest => `
                                    <div class="interest-item-executive">
                                        <div class="interest-icon-executive">
                                            <i class="fas fa-${this.getInterestIcon(interest)}"></i>
                                        </div>
                                        <div class="interest-label-executive">${interest.trim()}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </div>
                </div>

                <!-- Footer exécutif -->
                <div class="cv-footer-executive">
                    <div class="signature">${personal.fullName ? personal.fullName.split(' ')[0] : 'Signature'}</div>
                    <div class="social-links-executive">
                        ${personal.linkedin ? `<a href="${personal.linkedin}" class="social-link-executive" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personal.github ? `<a href="${personal.github}" class="social-link-executive" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${personal.email ? `<a href="mailto:${personal.email}" class="social-link-executive"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
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
            'randonnée': 'hiking',
            'yoga': 'spa',
            'meditation': 'spa',
            'écriture': 'pen',
            'peinture': 'palette',
            'danse': 'music',
            'théâtre': 'masks',
            'science': 'flask',
            'histoire': 'landmark',
            'politique': 'vote-yea',
            'bénévolat': 'hands-helping',
            'entrepreneuriat': 'lightbulb',
            'innovation': 'rocket'
        };
        
        for (const [key, icon] of Object.entries(iconMap)) {
            if (interestLower.includes(key)) {
                return icon;
            }
        }
        
        return 'heart';
    }

    attachDynamicBehaviors() {
        // Animation des barres de progression
        const progressBars = document.querySelectorAll('.language-progress, .skill-level, .skill-level-executive');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
}

// Export global
window.TemplateLoader = TemplateLoader;