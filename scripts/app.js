// Données du CV
let cvData = {
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

// Navigation entre les sections
function setupNavigation() {
    console.log('🔧 Configuration de la navigation...');
    
    const sections = {
        form: document.getElementById('form-section'),
        templates: document.getElementById('templates-section'),
        preview: document.getElementById('preview-section')
    };

    const navButtons = document.querySelectorAll('.nav-btn');

    // Cacher toutes les sections sauf la première
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    if (sections.form) sections.form.classList.add('active');

    // Configurer les écouteurs de clic
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            console.log('Clic sur:', targetSection);

            // Mettre à jour les boutons actifs
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Cacher toutes les sections
            Object.values(sections).forEach(section => {
                if (section) section.classList.remove('active');
            });

            // Afficher la section cible
            if (sections[targetSection]) {
                sections[targetSection].classList.add('active');
                console.log('✅ Section affichée:', targetSection);
                
                // Si on va sur l'aperçu, mettre à jour
                if (targetSection === 'preview') {
                    updatePreview();
                }
            }
        });
    });
}

// Configuration des templates
function setupTemplates() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            // Retirer la classe active de toutes les cartes
            templateCards.forEach(c => c.classList.remove('active'));
            // Ajouter la classe active à la carte cliquée
            this.classList.add('active');
            
            // Mettre à jour le template
            cvData.template = this.dataset.template;
            updatePreview();
            saveData();
            
            showToast(`Template "${this.dataset.template}" sélectionné !`);
        });
    });
}

// Configuration du formulaire
function setupForm() {
    // Champs d'informations personnelles
    const personalFields = ['fullName', 'profession', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio', 'summary'];
    personalFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', function() {
                cvData.personal[field] = this.value;
                updatePreview();
                saveData();
            });
        }
    });

    // Champs de compétences
    const listFields = ['skills', 'languages', 'interests'];
    listFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', function() {
                cvData[field] = this.value.split(',').map(item => item.trim()).filter(item => item);
                updatePreview();
                saveData();
            });
        }
    });

    // Boutons d'ajout
    document.getElementById('add-experience').addEventListener('click', addExperience);
    document.getElementById('add-education').addEventListener('click', addEducation);
}

// Gestion des expériences
function addExperience() {
    const container = document.getElementById('experience-container');
    const experienceId = Date.now();
    
    const experienceHTML = `
        <div class="dynamic-item" data-id="${experienceId}">
            <input type="text" placeholder="Poste (ex: Développeur Frontend)" 
                   oninput="updateExperienceField(${experienceId}, 'title', this.value)">
            <input type="text" placeholder="Entreprise (ex: Google)" 
                   oninput="updateExperienceField(${experienceId}, 'company', this.value)">
            <input type="text" placeholder="Période (ex: 2020-2022)" 
                   oninput="updateExperienceField(${experienceId}, 'period', this.value)">
            <textarea placeholder="Description et réalisations..." 
                     oninput="updateExperienceField(${experienceId}, 'description', this.value)"></textarea>
            <button onclick="removeExperience(${experienceId})">Supprimer cette expérience</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', experienceHTML);
}

// Gestion des formations
function addEducation() {
    const container = document.getElementById('education-container');
    const educationId = Date.now();
    
    const educationHTML = `
        <div class="dynamic-item" data-id="${educationId}">
            <input type="text" placeholder="Diplôme (ex: Master en Informatique)" 
                   oninput="updateEducationField(${educationId}, 'degree', this.value)">
            <input type="text" placeholder="Établissement (ex: Université Paris-Saclay)" 
                   oninput="updateEducationField(${educationId}, 'school', this.value)">
            <input type="text" placeholder="Année (ex: 2022)" 
                   oninput="updateEducationField(${educationId}, 'year', this.value)">
            <textarea placeholder="Description complémentaire..." 
                     oninput="updateEducationField(${educationId}, 'description', this.value)"></textarea>
            <button onclick="removeEducation(${educationId})">Supprimer cette formation</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', educationHTML);
}

// Fonctions globales pour les expériences
window.updateExperienceField = function(id, field, value) {
    let experience = cvData.experiences.find(exp => exp.id === id);
    if (!experience) {
        experience = { id: id };
        cvData.experiences.push(experience);
    }
    experience[field] = value;
    updatePreview();
    saveData();
};

window.removeExperience = function(id) {
    cvData.experiences = cvData.experiences.filter(exp => exp.id !== id);
    const element = document.querySelector(`.dynamic-item[data-id="${id}"]`);
    if (element) element.remove();
    updatePreview();
    saveData();
};

// Fonctions globales pour les formations
window.updateEducationField = function(id, field, value) {
    let education = cvData.educations.find(edu => edu.id === id);
    if (!education) {
        education = { id: id };
        cvData.educations.push(education);
    }
    education[field] = value;
    updatePreview();
    saveData();
};

window.removeEducation = function(id) {
    cvData.educations = cvData.educations.filter(edu => edu.id !== id);
    const element = document.querySelector(`.dynamic-item[data-id="${id}"]`);
    if (element) element.remove();
    updatePreview();
    saveData();
};

// Mise à jour de l'aperçu
function updatePreview() {
    const preview = document.getElementById('pdf-content');
    if (!preview) return;

    const template = cvData.template || 'modern';
    
    preview.className = `cv-template ${template}`;
    preview.innerHTML = `
        <!-- En-tête -->
        <div class="cv-header">
            <h1 class="cv-name">${cvData.personal.fullName || 'Votre Nom'}</h1>
            <div class="cv-profession">${cvData.personal.profession || 'Poste recherché'}</div>
            <div class="cv-contact">
                ${cvData.personal.email ? `<span>📧 ${cvData.personal.email}</span>` : ''}
                ${cvData.personal.phone ? `<span>📱 ${cvData.personal.phone}</span>` : ''}
                ${cvData.personal.location ? `<span>📍 ${cvData.personal.location}</span>` : ''}
                ${cvData.personal.linkedin ? `<span>💼 ${cvData.personal.linkedin}</span>` : ''}
            </div>
        </div>

        <!-- Profil -->
        ${cvData.personal.summary ? `
        <div class="cv-section">
            <h2><i class="fas fa-user"></i>Profil</h2>
            <p>${cvData.personal.summary}</p>
        </div>
        ` : ''}

        <!-- Expériences -->
        ${cvData.experiences.length > 0 ? `
        <div class="cv-section">
            <h2><i class="fas fa-briefcase"></i>Expérience Professionnelle</h2>
            ${cvData.experiences.map(exp => `
                <div class="cv-item">
                    <h3>${exp.title || 'Poste'}</h3>
                    <div class="company">${exp.company || 'Entreprise'}</div>
                    <div class="date">${exp.period || 'Période'}</div>
                    <div class="description">${exp.description || ''}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Formations -->
        ${cvData.educations.length > 0 ? `
        <div class="cv-section">
            <h2><i class="fas fa-graduation-cap"></i>Formation</h2>
            ${cvData.educations.map(edu => `
                <div class="cv-item">
                    <h3>${edu.degree || 'Diplôme'}</h3>
                    <div class="company">${edu.school || 'Établissement'}</div>
                    <div class="date">${edu.year || 'Année'}</div>
                    <div class="description">${edu.description || ''}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Compétences -->
        ${cvData.skills.length > 0 ? `
        <div class="cv-section">
            <h2><i class="fas fa-code"></i>Compétences</h2>
            <div class="skills-container">
                ${cvData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Langues -->
        ${cvData.languages.length > 0 ? `
        <div class="cv-section">
            <h2><i class="fas fa-language"></i>Langues</h2>
            <div class="skills-container">
                ${cvData.languages.map(lang => `<span class="skill-tag">${lang}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Centres d'intérêt -->
        ${cvData.interests.length > 0 ? `
        <div class="cv-section">
            <h2><i class="fas fa-heart"></i>Centres d'Intérêt</h2>
            <div class="skills-container">
                ${cvData.interests.map(interest => `<span class="skill-tag">${interest}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

// Sauvegarde et chargement
function saveData() {
    localStorage.setItem('cvData', JSON.stringify(cvData));
}

function loadData() {
    const saved = localStorage.getItem('cvData');
    if (saved) {
        cvData = JSON.parse(saved);
        populateForm();
    }
}

function populateForm() {
    // Remplir les champs personnels
    Object.keys(cvData.personal).forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = cvData.personal[field] || '';
        }
    });

    // Remplir les listes
    document.getElementById('skills').value = cvData.skills.join(', ');
    document.getElementById('languages').value = cvData.languages.join(', ');
    document.getElementById('interests').value = cvData.interests.join(', ');

    // Mettre à jour le template sélectionné
    const templateCard = document.querySelector(`[data-template="${cvData.template}"]`);
    if (templateCard) {
        document.querySelectorAll('.template-card').forEach(card => card.classList.remove('active'));
        templateCard.classList.add('active');
    }
}

// Téléchargement PDF - SOLUTION CORRIGÉE
function setupDownload() {
    document.getElementById('download-btn').addEventListener('click', generatePDF);
}

function generatePDF() {
    const element = document.getElementById('pdf-content');
    if (!element) {
        showToast('Erreur: Contenu du CV non trouvé');
        return;
    }

    // Afficher le loading
    const loading = document.getElementById('pdf-loading');
    loading.classList.add('show');

    // Options optimisées pour html2pdf
    const options = {
        margin: [10, 10, 10, 10],
        filename: `CV_${cvData.personal.fullName || 'Mon_CV'}.pdf`,
        image: { 
            type: 'jpeg', 
            quality: 1 
        },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight,
            onclone: function(clonedDoc) {
                // S'assurer que le contenu est bien visible dans le clone
                const clonedElement = clonedDoc.getElementById('pdf-content');
                if (clonedElement) {
                    clonedElement.style.width = '100%';
                    clonedElement.style.background = 'white';
                    clonedElement.style.color = 'black';
                }
            }
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };

    // Forcer un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                loading.classList.remove('show');
                showToast('CV téléchargé avec succès !');
            })
            .catch(error => {
                console.error('Erreur PDF:', error);
                loading.classList.remove('show');
                showToast('Erreur lors du téléchargement');
                
                // Solution de secours
                setTimeout(() => {
                    if (confirm('Le téléchargement a échoué. Voulez-vous essayer la méthode alternative ?')) {
                        downloadAlternativePDF();
                    }
                }, 500);
            });
    }, 500);
}

// Méthode alternative
function downloadAlternativePDF() {
    const element = document.getElementById('pdf-content');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CV - ${cvData.personal.fullName}</title>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.4;
                    color: #333;
                }
                .cv-template { 
                    max-width: 800px; 
                    margin: 0 auto;
                    padding: 20px;
                }
                .cv-header { 
                    text-align: center; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .cv-name { 
                    font-size: 2rem; 
                    font-weight: bold; 
                    margin-bottom: 0.5rem; 
                }
                .cv-profession { 
                    font-size: 1.25rem; 
                    margin-bottom: 1rem; 
                }
                .cv-contact { 
                    display: flex; 
                    justify-content: center; 
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .cv-section { 
                    margin-bottom: 1.5rem; 
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                }
                .cv-section h2 { 
                    font-size: 1.25rem; 
                    color: #6366f1;
                    margin-bottom: 1rem;
                }
                .cv-item { margin-bottom: 1rem; }
                .cv-item h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
                .company { font-style: italic; color: #666; }
                .date { color: #999; font-size: 0.9rem; }
                .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-tag { 
                    background: #e0e7ff; 
                    color: #3730a3; 
                    padding: 0.25rem 0.5rem; 
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
                @media print {
                    body { margin: 0; }
                    .cv-template { padding: 0; }
                }
            </style>
        </head>
        <body>
            ${element.innerHTML}
            <script>
                window.print();
                setTimeout(() => window.close(), 1000);
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Reset
function setupReset() {
    document.getElementById('reset-btn').addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
            cvData = {
                personal: { fullName: '', profession: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
                experiences: [],
                educations: [],
                skills: [],
                languages: [],
                interests: [],
                template: 'modern'
            };
            localStorage.removeItem('cvData');
            document.getElementById('cv-form').reset();
            document.getElementById('experience-container').innerHTML = '';
            document.getElementById('education-container').innerHTML = '';
            updatePreview();
            showToast('Données effacées avec succès');
        }
    });
}

// Notifications
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Zoom
function setupZoom() {
    let scale = 1;
    const preview = document.getElementById('cv-preview');
    
    document.getElementById('zoom-in').addEventListener('click', function() {
        scale = Math.min(scale + 0.1, 1.5);
        preview.style.transform = `scale(${scale})`;
        preview.style.transformOrigin = 'top center';
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        scale = Math.max(scale - 0.1, 0.5);
        preview.style.transform = `scale(${scale})`;
        preview.style.transformOrigin = 'top center';
    });
}

// Impression
function setupPrint() {
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de CVBuilder Pro...');
    
    loadData();
    setupNavigation();
    setupTemplates();
    setupForm();
    setupDownload();
    setupReset();
    setupZoom();
    setupPrint();
    updatePreview();
    
    console.log('✅ Application prête !');
});

// Données exemple
function loadExampleData() {
    cvData = {
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
            }
        ],
        educations: [
            {
                id: 1,
                degree: 'Master en Informatique',
                school: 'Université Paris-Saclay',
                year: '2020',
                description: 'Spécialisation en développement web et architectures distribuées'
            }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'MongoDB'],
        languages: ['Français (Natif)', 'Anglais (Courant)', 'Espagnol (Intermédiaire)'],
        interests: ['Photographie', 'Randonnée', 'Lecture'],
        template: 'modern'
    };
    
    populateForm();
    updatePreview();
    saveData();
    showToast('Données exemple chargées !');
}
