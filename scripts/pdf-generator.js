/**
 * PDFGenerator - Générateur de PDF pour CV
 * Utilise jsPDF pour créer des PDF professionnels
 */

class PDFGenerator {
    constructor() {
        this.pdf = null;
        this.pageWidth = 210; // A4 en mm
        this.pageHeight = 297; // A4 en mm
        this.margin = 20;
        this.currentY = 0;
        this.lineHeight = 5;
        this.fontSizes = {
            title: 24,
            subtitle: 18,
            heading: 14,
            subheading: 12,
            normal: 11,
            small: 9
        };
    }

    // ========== GÉNÉRATION PRINCIPALE ==========
    async generatePDF(cvData) {
        this.showLoading(true);
        
        try {
            // Initialiser jsPDF
            const { jsPDF } = window.jspdf;
            this.pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Générer selon le template
            switch (cvData.template) {
                case 'modern':
                    await this.generateModernPDF(cvData);
                    break;
                case 'professional':
                    await this.generateProfessionalPDF(cvData);
                    break;
                case 'creative':
                    await this.generateCreativePDF(cvData);
                    break;
                case 'executive':
                    await this.generateExecutivePDF(cvData);
                    break;
                default:
                    await this.generateModernPDF(cvData);
            }

            // Sauvegarder le PDF
            const fileName = this.getFileName(cvData);
            this.pdf.save(fileName);
            
            return Promise.resolve();
            
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            return Promise.reject(error);
            
        } finally {
            this.showLoading(false);
        }
    }

    // ========== TEMPLATE MODERNE ==========
    async generateModernPDF(cvData) {
        this.currentY = this.margin;
        
        // En-tête avec dégradé
        this.drawGradientHeader();
        
        // Nom et profession
        this.addTitle(cvData.personal.fullName || 'Nom Prénom');
        this.addSubtitle(cvData.personal.profession || 'Profession');
        
        // Informations de contact
        this.addContactInfo(cvData.personal);
        
        // Profil
        if (cvData.personal.summary) {
            this.addSectionTitle('PROFIL');
            this.addParagraph(cvData.personal.summary);
        }
        
        // Expérience
        if (cvData.experiences.length > 0) {
            this.addSectionTitle('EXPÉRIENCE PROFESSIONNELLE');
            cvData.experiences.forEach(exp => {
                this.addExperience(exp);
            });
        }
        
        // Formation
        if (cvData.educations.length > 0) {
            this.addSectionTitle('FORMATION');
            cvData.educations.forEach(edu => {
                this.addEducation(edu);
            });
        }
        
        // Compétences
        if (cvData.skills.length > 0) {
            this.addSectionTitle('COMPÉTENCES TECHNIQUES');
            this.addSkills(cvData.skills);
        }
        
        // Langues
        if (cvData.languages.length > 0) {
            this.addSectionTitle('LANGUES');
            this.addLanguages(cvData.languages);
        }
        
        // Centres d'intérêt
        if (cvData.interests.length > 0) {
            this.addSectionTitle('CENTRES D\'INTÉRÊT');
            this.addInterests(cvData.interests);
        }
        
        // Pied de page
        this.addFooter();
    }

    // ========== TEMPLATE PROFESSIONNEL ==========
    async generateProfessionalPDF(cvData) {
        this.currentY = this.margin;
        
        // Barre latérale
        this.drawSidebar();
        
        // Contenu principal
        this.pdf.setTextColor(30, 41, 59);
        
        // Nom et profession
        this.pdf.setFontSize(this.fontSizes.title);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(cvData.personal.fullName || 'Nom Prénom', 50, 30);
        
        this.pdf.setFontSize(this.fontSizes.subtitle);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(cvData.personal.profession || 'Profession', 50, 37);
        
        this.currentY = 45;
        
        // Profil
        if (cvData.personal.summary) {
            this.pdf.setFontSize(this.fontSizes.heading);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text('PROFIL', 50, this.currentY);
            
            this.pdf.setFontSize(this.fontSizes.normal);
            this.pdf.setFont('helvetica', 'normal');
            const profileLines = this.wrapText(cvData.personal.summary, 140);
            profileLines.forEach(line => {
                this.pdf.text(line, 50, this.currentY + 7);
                this.currentY += 5;
            });
            this.currentY += 10;
        }
        
        // Expérience avec timeline
        if (cvData.experiences.length > 0) {
            this.pdf.setFontSize(this.fontSizes.heading);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text('EXPÉRIENCE', 50, this.currentY);
            
            this.currentY += 7;
            
            cvData.experiences.forEach((exp, index) => {
                // Point de timeline
                this.pdf.setFillColor(99, 102, 241);
                this.pdf.circle(45, this.currentY - 1, 1.5, 'F');
                
                // Ligne verticale
                if (index < cvData.experiences.length - 1) {
                    this.pdf.setDrawColor(99, 102, 241);
                    this.pdf.setLineWidth(0.5);
                    this.pdf.line(45, this.currentY, 45, this.currentY + 25);
                }
                
                // Contenu
                this.pdf.setFontSize(this.fontSizes.subheading);
                this.pdf.setFont('helvetica', 'bold');
                this.pdf.text(exp.title || 'Poste', 50, this.currentY);
                
                this.pdf.setFontSize(this.fontSizes.small);
                this.pdf.setFont('helvetica', 'italic');
                this.pdf.setTextColor(99, 102, 241);
                this.pdf.text(`${exp.company || 'Entreprise'} | ${exp.period || 'Période'}`, 50, this.currentY + 4);
                
                if (exp.description) {
                    this.pdf.setFontSize(this.fontSizes.small);
                    this.pdf.setFont('helvetica', 'normal');
                    this.pdf.setTextColor(71, 85, 105);
                    const lines = this.wrapText(exp.description, 140);
                    lines.forEach((line, i) => {
                        this.pdf.text(`• ${line}`, 52, this.currentY + 9 + (i * 4));
                    });
                    this.currentY += 9 + (lines.length * 4);
                }
                
                this.currentY += 15;
            });
        }
        
        // Compétences dans la sidebar
        this.addSkillsToSidebar(cvData.skills);
    }

    // ========== TEMPLATE CRÉATIF ==========
    async generateCreativePDF(cvData) {
        this.currentY = this.margin;
        
        // Fond coloré
        this.pdf.setFillColor(240, 147, 251, 0.1);
        this.pdf.rect(0, 0, this.pageWidth, 50, 'F');
        
        // Nom stylisé
        this.pdf.setFontSize(28);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(240, 147, 251);
        this.pdf.text(cvData.personal.fullName || 'Nom Prénom', this.margin, 30);
        
        // Profession
        this.pdf.setFontSize(16);
        this.pdf.setTextColor(245, 87, 108);
        this.pdf.text(cvData.personal.profession || 'Profession', this.margin, 40);
        
        this.currentY = 55;
        
        // Cartes de contact
        this.addContactCards(cvData.personal);
        
        // Sections avec icônes
        if (cvData.personal.summary) {
            this.addIconSection('PROFIL', 'user', cvData.personal.summary);
        }
        
        if (cvData.experiences.length > 0) {
            this.addIconSection('EXPÉRIENCE', 'briefcase', '', cvData.experiences);
        }
        
        if (cvData.skills.length > 0) {
            this.addBubbleSkills(cvData.skills);
        }
    }

    // ========== TEMPLATE EXECUTIVE ==========
    async generateExecutivePDF(cvData) {
        this.currentY = this.margin;
        
        // Barre latérale gauche
        this.pdf.setFillColor(15, 23, 42);
        this.pdf.rect(0, 0, 40, this.pageHeight, 'F');
        
        // Nom
        this.pdf.setFontSize(22);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(26, 26, 26);
        this.pdf.text(cvData.personal.fullName || 'Nom Prénom', 45, 30);
        
        // Profession
        this.pdf.setFontSize(14);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(75, 85, 99);
        this.pdf.text(cvData.personal.profession || 'Profession', 45, 38);
        
        // Ligne de séparation
        this.pdf.setDrawColor(229, 231, 235);
        this.pdf.setLineWidth(0.5);
        this.pdf.line(45, 45, this.pageWidth - this.margin, 45);
        
        this.currentY = 50;
        
        // Contact dans la sidebar
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        
        let contactY = 50;
        if (cvData.personal.email) {
            this.pdf.text(`📧 ${cvData.personal.email}`, 10, contactY);
            contactY += 6;
        }
        if (cvData.personal.phone) {
            this.pdf.text(`📱 ${cvData.personal.phone}`, 10, contactY);
            contactY += 6;
        }
        if (cvData.personal.location) {
            this.pdf.text(`📍 ${cvData.personal.location}`, 10, contactY);
            contactY += 10;
        }
        
        // Compétences dans la sidebar
        if (cvData.skills.length > 0) {
            this.pdf.setFontSize(11);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text('EXPERTISE', 10, contactY);
            contactY += 8;
            
            this.pdf.setFontSize(9);
            this.pdf.setFont('helvetica', 'normal');
            cvData.skills.forEach(skill => {
                this.pdf.text(`• ${skill.trim()}`, 12, contactY);
                contactY += 5;
            });
        }
        
        // Contenu principal
        this.currentY = 50;
        
        // Profil
        if (cvData.personal.summary) {
            this.addExecutiveSection('PROFIL');
            this.addParagraph(cvData.personal.summary, 45);
        }
        
        // Expérience
        if (cvData.experiences.length > 0) {
            this.addExecutiveSection('EXPÉRIENCE');
            cvData.experiences.forEach(exp => {
                this.addExecutiveItem(exp);
            });
        }
        
        // Formation
        if (cvData.educations.length > 0) {
            this.addExecutiveSection('FORMATION');
            cvData.educations.forEach(edu => {
                this.addExecutiveItem(edu, true);
            });
        }
    }

    // ========== MÉTHODES DE DESSIN ==========
    drawGradientHeader() {
        // Dégradé pour l'en-tête moderne
        const gradient = this.pdf.createLinearGradient(0, 0, this.pageWidth, 40);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        this.pdf.setFillColor(102, 126, 234);
        this.pdf.rect(0, 0, this.pageWidth, 40, 'F');
        
        // Texte en blanc
        this.pdf.setTextColor(255, 255, 255);
    }

    drawSidebar() {
        // Sidebar pour template professionnel
        this.pdf.setFillColor(30, 41, 59);
        this.pdf.rect(0, 0, 40, this.pageHeight, 'F');
        
        // Photo de profil
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.circle(20, 60, 15, 'F');
        
        // Texte en blanc dans la sidebar
        this.pdf.setTextColor(255, 255, 255);
    }

    // ========== MÉTHODES D'AJOUT DE CONTENU ==========
    addTitle(text) {
        this.pdf.setFontSize(this.fontSizes.title);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(text, this.margin, this.currentY);
        this.currentY += 10;
    }

    addSubtitle(text) {
        this.pdf.setFontSize(this.fontSizes.subtitle);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(text, this.margin, this.currentY);
        this.currentY += 7;
    }

    addSectionTitle(text) {
        if (this.currentY > this.pageHeight - 40) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        this.pdf.setFontSize(this.fontSizes.heading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(99, 102, 241);
        this.pdf.text(text, this.margin, this.currentY);
        
        // Ligne de séparation
        this.pdf.setDrawColor(99, 102, 241);
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin, this.currentY + 2, this.margin + 30, this.currentY + 2);
        
        this.currentY += 10;
    }

    addContactInfo(personal) {
        this.pdf.setFontSize(this.fontSizes.small);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(100, 116, 139);
        
        let contactX = this.margin;
        const contactY = this.currentY;
        
        if (personal.email) {
            this.pdf.text(`📧 ${personal.email}`, contactX, contactY);
            contactX += 60;
        }
        
        if (personal.phone) {
            this.pdf.text(`📱 ${personal.phone}`, contactX, contactY);
            contactX += 50;
        }
        
        if (personal.location) {
            this.pdf.text(`📍 ${personal.location}`, contactX, contactY);
        }
        
        this.currentY += 10;
    }

    addParagraph(text, x = this.margin) {
        this.pdf.setFontSize(this.fontSizes.normal);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(71, 85, 105);
        
        const lines = this.wrapText(text, this.pageWidth - (2 * this.margin));
        lines.forEach(line => {
            if (this.currentY > this.pageHeight - 20) {
                this.pdf.addPage();
                this.currentY = this.margin;
            }
            this.pdf.text(line, x, this.currentY);
            this.currentY += 5;
        });
        
        this.currentY += 5;
    }

    addExperience(exp) {
        if (this.currentY > this.pageHeight - 40) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        // Poste
        this.pdf.setFontSize(this.fontSizes.subheading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text(exp.title || 'Poste', this.margin, this.currentY);
        
        // Entreprise et période
        this.pdf.setFontSize(this.fontSizes.small);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(99, 102, 241);
        this.pdf.text(`${exp.company || 'Entreprise'} | ${exp.period || 'Période'}`, this.margin, this.currentY + 4);
        
        // Description
        if (exp.description) {
            this.pdf.setFontSize(this.fontSizes.small);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(71, 85, 105);
            const lines = this.wrapText(exp.description, this.pageWidth - (2 * this.margin));
            lines.forEach((line, i) => {
                this.pdf.text(`• ${line}`, this.margin + 5, this.currentY + 9 + (i * 4));
            });
            this.currentY += 9 + (lines.length * 4);
        }
        
        this.currentY += 10;
    }

    addEducation(edu) {
        if (this.currentY > this.pageHeight - 30) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        this.pdf.setFontSize(this.fontSizes.subheading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text(edu.degree || 'Diplôme', this.margin, this.currentY);
        
        this.pdf.setFontSize(this.fontSizes.small);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(99, 102, 241);
        this.pdf.text(`${edu.school || 'Établissement'} | ${edu.year || 'Année'}`, this.margin, this.currentY + 4);
        
        this.currentY += 10;
    }

    addSkills(skills) {
        const skillsPerLine = 3;
        const skillWidth = (this.pageWidth - (2 * this.margin)) / skillsPerLine - 5;
        
        skills.forEach((skill, index) => {
            if (index % skillsPerLine === 0) {
                if (this.currentY > this.pageHeight - 20) {
                    this.pdf.addPage();
                    this.currentY = this.margin;
                }
                this.currentY += 5;
            }
            
            const x = this.margin + (index % skillsPerLine) * (skillWidth + 5);
            
            // Boîte de compétence
            this.pdf.setFillColor(224, 231, 255);
            this.pdf.roundedRect(x, this.currentY - 3, skillWidth, 6, 2, 2, 'F');
            
            // Texte de la compétence
            this.pdf.setFontSize(this.fontSizes.small);
            this.pdf.setTextColor(55, 48, 163);
            this.pdf.text(skill.trim(), x + 3, this.currentY + 1);
            
            if ((index + 1) % skillsPerLine === 0) {
                this.currentY += 10;
            }
        });
        
        this.currentY += 10;
    }

    addSkillsToSidebar(skills) {
        let skillY = 120;
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(10);
        
        skills.forEach(skill => {
            // Barre de progression
            this.pdf.setFillColor(99, 102, 241);
            const width = 30 + (Math.random() * 10);
            this.pdf.rect(10, skillY - 2, width, 4, 'F');
            
            // Nom de la compétence
            this.pdf.text(skill.trim(), 45, skillY + 1);
            
            skillY += 8;
        });
    }

    addLanguages(languages) {
        this.pdf.setFontSize(this.fontSizes.small);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(71, 85, 105);
        
        languages.forEach(lang => {
            if (this.currentY > this.pageHeight - 20) {
                this.pdf.addPage();
                this.currentY = this.margin;
            }
            
            this.pdf.text(`• ${lang.trim()}`, this.margin, this.currentY);
            this.currentY += 5;
        });
        
        this.currentY += 5;
    }

    addInterests(interests) {
        interests.forEach(interest => {
            if (this.currentY > this.pageHeight - 20) {
                this.pdf.addPage();
                this.currentY = this.margin;
            }
            
            // Cercle d'intérêt
            this.pdf.setFillColor(241, 245, 249);
            this.pdf.circle(this.margin + 5, this.currentY, 3, 'F');
            
            this.pdf.setFontSize(this.fontSizes.small);
            this.pdf.setTextColor(71, 85, 105);
            this.pdf.text(interest.trim(), this.margin + 10, this.currentY + 1);
            
            this.currentY += 7;
        });
    }

    addContactCards(personal) {
        const cardWidth = 55;
        let cardX = this.margin;
        const cardY = this.currentY;
        
        if (personal.email) {
            this.drawContactCard(cardX, cardY, cardWidth, '📧', 'Email', personal.email);
            cardX += cardWidth + 5;
        }
        
        if (personal.phone) {
            this.drawContactCard(cardX, cardY, cardWidth, '📱', 'Téléphone', personal.phone);
            cardX += cardWidth + 5;
        }
        
        if (personal.location) {
            this.drawContactCard(cardX, cardY, cardWidth, '📍', 'Localisation', personal.location);
        }
        
        this.currentY += 30;
    }

    drawContactCard(x, y, width, icon, label, value) {
        // Carte
        this.pdf.setFillColor(255, 255, 255);
        this.pdf.roundedRect(x, y, width, 25, 3, 3, 'F');
        this.pdf.setDrawColor(226, 232, 240);
        this.pdf.setLineWidth(0.5);
        this.pdf.roundedRect(x, y, width, 25, 3, 3, 'D');
        
        // Icône
        this.pdf.setFontSize(12);
        this.pdf.text(icon, x + 5, y + 7);
        
        // Label
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.text(label, x + 15, y + 7);
        
        // Valeur
        this.pdf.setFontSize(9);
        this.pdf.setTextColor(30, 41, 59);
        const lines = this.wrapText(value, width - 10);
        lines.forEach((line, i) => {
            this.pdf.text(line, x + 5, y + 15 + (i * 4));
        });
    }

    addIconSection(title, icon, content, items = []) {
        if (this.currentY > this.pageHeight - 50) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        // Icône
        this.pdf.setFontSize(16);
        this.pdf.setTextColor(240, 147, 251);
        this.pdf.text(this.getIcon(icon), this.margin, this.currentY);
        
        // Titre
        this.pdf.setFontSize(this.fontSizes.heading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(30, 41, 59);
        this.pdf.text(title, this.margin + 10, this.currentY);
        
        this.currentY += 8;
        
        // Contenu ou items
        if (content) {
            this.addParagraph(content, this.margin + 10);
        } else if (items.length > 0) {
            items.forEach(item => {
                this.pdf.setFontSize(this.fontSizes.subheading);
                this.pdf.setFont('helvetica', 'bold');
                this.pdf.text(item.title || item.degree || '', this.margin + 10, this.currentY);
                
                this.pdf.setFontSize(this.fontSizes.small);
                this.pdf.setFont('helvetica', 'italic');
                this.pdf.setTextColor(245, 87, 108);
                this.pdf.text(`${item.company || item.school || ''} | ${item.period || item.year || ''}`, 
                            this.margin + 10, this.currentY + 4);
                
                this.currentY += 10;
            });
        }
        
        this.currentY += 10;
    }

    addBubbleSkills(skills) {
        this.pdf.setFontSize(this.fontSizes.heading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('COMPÉTENCES', this.margin, this.currentY);
        this.currentY += 8;
        
        let bubbleX = this.margin;
        let bubbleY = this.currentY;
        
        skills.forEach(skill => {
            const textWidth = this.pdf.getTextWidth(skill.trim()) + 8;
            
            if (bubbleX + textWidth > this.pageWidth - this.margin) {
                bubbleX = this.margin;
                bubbleY += 12;
            }
            
            // Bulle
            this.pdf.setFillColor(240, 147, 251, 0.2);
            this.pdf.roundedRect(bubbleX, bubbleY, textWidth, 8, 4, 4, 'F');
            this.pdf.setDrawColor(240, 147, 251);
            this.pdf.setLineWidth(0.5);
            this.pdf.roundedRect(bubbleX, bubbleY, textWidth, 8, 4, 4, 'D');
            
            // Texte
            this.pdf.setFontSize(this.fontSizes.small);
            this.pdf.setTextColor(240, 147, 251);
            this.pdf.text(skill.trim(), bubbleX + 4, bubbleY + 5);
            
            bubbleX += textWidth + 5;
        });
        
        this.currentY = bubbleY + 15;
    }

    addExecutiveSection(title) {
        if (this.currentY > this.pageHeight - 40) {
            this.pdf.addPage();
            this.currentY = this.margin + 10;
        }
        
        this.pdf.setFontSize(this.fontSizes.heading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(26, 26, 26);
        this.pdf.text(title, 45, this.currentY);
        
        // Ligne sous le titre
        this.pdf.setDrawColor(26, 26, 26);
        this.pdf.setLineWidth(1);
        this.pdf.line(45, this.currentY + 2, 65, this.currentY + 2);
        
        this.currentY += 10;
    }

    addExecutiveItem(item, isEducation = false) {
        if (this.currentY > this.pageHeight - 30) {
            this.pdf.addPage();
            this.currentY = this.margin + 10;
        }
        
        // Titre
        this.pdf.setFontSize(this.fontSizes.subheading);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(item.title || item.degree || '', 45, this.currentY);
        
        // Sous-titre
        this.pdf.setFontSize(this.fontSizes.small);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(75, 85, 99);
        
        const subtitle = isEducation 
            ? `${item.school || 'Établissement'} | ${item.year || 'Année'}`
            : `${item.company || 'Entreprise'} | ${item.period || 'Période'}`;
        
        this.pdf.text(subtitle, 45, this.currentY + 4);
        
        // Description
        if (item.description) {
            this.pdf.setFontSize(this.fontSizes.small);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(55, 65, 81);
            const lines = this.wrapText(item.description, 140);
            lines.forEach((line, i) => {
                this.pdf.text(line, 47, this.currentY + 9 + (i * 4));
            });
            this.currentY += 9 + (lines.length * 4);
        }
        
        this.currentY += 10;
    }

    addFooter() {
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.text(`CV généré avec CVBuilder Pro - ${new Date().toLocaleDateString('fr-FR')}`, 
                     this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }

    // ========== UTILITAIRES ==========
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = this.pdf.getTextWidth(testLine);
            
            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    getFileName(cvData) {
        const name = cvData.personal.fullName 
            ? cvData.personal.fullName.replace(/\s+/g, '_')
            : 'CV';
        const date = new Date().toISOString().split('T')[0];
        return `CV_${name}_${date}.pdf`;
    }

    getIcon(iconName) {
        const icons = {
            'user': '👤',
            'briefcase': '💼',
            'graduation-cap': '🎓',
            'code': '💻',
            'language': '🌐',
            'heart': '❤️',
            'envelope': '✉️',
            'phone': '📱',
            'map-marker': '📍'
        };
        return icons[iconName] || '●';
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }
}

// Exporter la classe
window.PDFGenerator = PDFGenerator;
