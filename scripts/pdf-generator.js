/**
 * PDFGenerator - Générateur de PDF robuste
 */

class PDFGenerator {
    constructor() {
        this.pdf = null;
        this.margin = 20;
        this.pageWidth = 210; // A4 en mm
        this.pageHeight = 297; // A4 en mm
        this.lineHeight = 5;
    }

    async generatePDF(cvData) {
        try {
            this.showLoading(true);
            
            // Utiliser html2canvas pour capturer exactement l'aperçu
            return await this.generatePDFWithCanvas(cvData);
            
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            
            // Fallback: Génération manuelle
            return this.generatePDFManually(cvData);
            
        } finally {
            this.showLoading(false);
        }
    }

    // ========== GÉNÉRATION AVEC HTML2CANVAS ==========
    async generatePDFWithCanvas(cvData) {
        try {
            const preview = document.getElementById('cv-preview');
            if (!preview) throw new Error('Aperçu non trouvé');
            
            // Appliquer les styles d'impression
            const originalStyles = preview.getAttribute('style') || '';
            preview.style.boxShadow = 'none';
            preview.style.margin = '0';
            
            const canvas = await html2canvas(preview, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 794, // 210mm * 3.78 (px/mm)
                height: 1123, // 297mm * 3.78
                windowWidth: 794
            });
            
            // Restaurer les styles originaux
            preview.setAttribute('style', originalStyles);
            
            const imgData = canvas.toDataURL('image/png', 1.0);
            const { jsPDF } = window.jspdf;
            this.pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Calculer les dimensions pour remplir la page A4
            const imgWidth = this.pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Centrer l'image sur la page
            const xPos = (this.pageWidth - imgWidth) / 2;
            const yPos = (this.pageHeight - imgHeight) / 2;
            
            this.pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
            
            // Ajouter les métadonnées
            this.pdf.setProperties({
                title: `CV - ${cvData.personal.fullName || 'Curriculum Vitae'}`,
                subject: 'Curriculum Vitae Professionnel',
                author: cvData.personal.fullName || 'CVBuilder Pro',
                keywords: 'cv, curriculum vitae, emploi, recrutement',
                creator: 'CVBuilder Pro'
            });
            
            const fileName = this.getFileName(cvData);
            this.pdf.save(fileName);
            
            return Promise.resolve();
            
        } catch (error) {
            console.error('Erreur fallback PDF:', error);
            this.showNotification('Erreur lors de la génération du PDF', 'error');
            return Promise.reject(error);
        }
    }

    // ========== GÉNÉRATION MANUELLE (FALLBACK) ==========
    generatePDFManually(cvData) {
        const { jsPDF } = window.jspdf;
        this.pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        this.currentY = this.margin;
        
        // Choisir la méthode selon le template
        switch (cvData.template) {
            case 'professional':
                this.generateProfessionalPDFManual(cvData);
                break;
            case 'creative':
                this.generateCreativePDFManual(cvData);
                break;
            case 'executive':
                this.generateExecutivePDFManual(cvData);
                break;
            default:
                this.generateModernPDFManual(cvData);
        }

        // Ajouter les métadonnées
        this.pdf.setProperties({
            title: `CV - ${cvData.personal.fullName || 'Curriculum Vitae'}`,
            subject: 'Curriculum Vitae Professionnel',
            author: cvData.personal.fullName || 'CVBuilder Pro',
            keywords: 'cv, curriculum vitae, emploi, recrutement',
            creator: 'CVBuilder Pro'
        });

        const fileName = this.getFileName(cvData);
        this.pdf.save(fileName);
    }

    // ========== MÉTHODES MANUELLES PAR TEMPLATE ==========
    generateModernPDFManual(cvData) {
        // Couleurs
        const primaryColor = [67, 97, 238]; // #4361ee
        const darkColor = [30, 41, 59]; // #1e293b
        const grayColor = [100, 116, 139]; // #64748b
        
        // Header
        this.pdf.setFillColor(...primaryColor);
        this.pdf.rect(0, 0, this.pageWidth, 60, 'F');
        
        // Nom
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(28);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(cvData.personal.fullName || 'Nom Prénom', this.margin, 30);
        
        // Profession
        this.pdf.setFontSize(14);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(cvData.personal.profession || 'Profession', this.margin, 38);
        
        this.currentY = 60;
        
        // Contact
        this.pdf.setFontSize(10);
        this.pdf.setTextColor(255, 255, 255, 0.9);
        
        let contactY = this.currentY - 15;
        const contactMargin = this.pageWidth - this.margin - 80;
        
        if (cvData.personal.email) {
            this.pdf.text(`📧 ${cvData.personal.email}`, contactMargin, contactY);
            contactY += 5;
        }
        if (cvData.personal.phone) {
            this.pdf.text(`📱 ${cvData.personal.phone}`, contactMargin, contactY);
            contactY += 5;
        }
        if (cvData.personal.location) {
            this.pdf.text(`📍 ${cvData.personal.location}`, contactMargin, contactY);
        }
        
        this.currentY += 10;
        this.pdf.setTextColor(...darkColor);
        
        // Profil
        if (cvData.personal.summary) {
            this.addSectionTitleManual('PROFIL PROFESSIONNEL', primaryColor);
            this.addParagraphManual(cvData.personal.summary, grayColor);
        }
        
        // Expérience
        if (cvData.experiences.length > 0) {
            this.addSectionTitleManual('EXPÉRIENCE PROFESSIONNELLE', primaryColor);
            cvData.experiences.forEach(exp => {
                this.addExperienceManual(exp, primaryColor, darkColor, grayColor);
            });
        }
        
        // Formation
        if (cvData.educations.length > 0) {
            this.addSectionTitleManual('FORMATION', primaryColor);
            cvData.educations.forEach(edu => {
                this.addEducationManual(edu, primaryColor, darkColor, grayColor);
            });
        }
        
        // Compétences
        if (cvData.skills.length > 0) {
            this.addSectionTitleManual('COMPÉTENCES TECHNIQUES', primaryColor);
            this.addSkillsManual(cvData.skills, primaryColor);
        }
        
        // Langues
        if (cvData.languages && cvData.languages.length > 0) {
            this.addSectionTitleManual('LANGUES', primaryColor);
            this.addLanguagesManual(cvData.languages, primaryColor);
        }
        
        // Footer
        this.addFooterManual();
    }

    // ========== MÉTHODES DE BASE MANUELLES ==========
    addSectionTitleManual(title, color) {
        if (this.currentY > this.pageHeight - 30) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        this.pdf.setFontSize(14);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(...color);
        this.pdf.text(title, this.margin, this.currentY);
        
        // Ligne de séparation
        this.pdf.setDrawColor(...color);
        this.pdf.setLineWidth(0.5);
        this.pdf.line(this.margin, this.currentY + 2, this.margin + 30, this.currentY + 2);
        
        this.currentY += 10;
    }

    addParagraphManual(text, color) {
        this.pdf.setFontSize(11);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setTextColor(...color);
        
        const lines = this.wrapTextManual(text, this.pageWidth - (2 * this.margin));
        lines.forEach(line => {
            if (this.currentY > this.pageHeight - 20) {
                this.pdf.addPage();
                this.currentY = this.margin;
            }
            this.pdf.text(line, this.margin, this.currentY);
            this.currentY += 5;
        });
        
        this.currentY += 5;
    }

    addExperienceManual(exp, primaryColor, darkColor, grayColor) {
        if (this.currentY > this.pageHeight - 40) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        // Titre du poste
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(...darkColor);
        this.pdf.text(exp.title || 'Poste', this.margin, this.currentY);
        
        // Entreprise et période
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(...primaryColor);
        this.pdf.text(`${exp.company || 'Entreprise'} | ${exp.period || 'Période'}`, this.margin, this.currentY + 5);
        
        // Description
        if (exp.description) {
            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(...grayColor);
            const lines = this.wrapTextManual(exp.description, this.pageWidth - (2 * this.margin));
            lines.forEach((line, i) => {
                if (i === 0) {
                    this.pdf.text(`• ${line}`, this.margin + 5, this.currentY + 12 + (i * 5));
                } else {
                    this.pdf.text(`  ${line}`, this.margin + 5, this.currentY + 12 + (i * 5));
                }
            });
            this.currentY += 12 + (lines.length * 5);
        } else {
            this.currentY += 12;
        }
        
        this.currentY += 5;
    }

    addEducationManual(edu, primaryColor, darkColor, grayColor) {
        if (this.currentY > this.pageHeight - 30) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
        
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(...darkColor);
        this.pdf.text(edu.degree || 'Diplôme', this.margin, this.currentY);
        
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.setTextColor(...primaryColor);
        this.pdf.text(`${edu.school || 'Établissement'} | ${edu.year || 'Année'}`, this.margin, this.currentY + 5);
        
        if (edu.description) {
            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'normal');
            this.pdf.setTextColor(...grayColor);
            const lines = this.wrapTextManual(edu.description, this.pageWidth - (2 * this.margin));
            lines.forEach((line, i) => {
                this.pdf.text(line, this.margin + 5, this.currentY + 12 + (i * 5));
            });
            this.currentY += 12 + (lines.length * 5);
        } else {
            this.currentY += 15;
        }
        
        this.currentY += 5;
    }

    addSkillsManual(skills, color) {
        const skillsPerLine = 3;
        const skillWidth = (this.pageWidth - (2 * this.margin)) / skillsPerLine - 5;
        
        let startX = this.margin;
        
        skills.forEach((skill, index) => {
            if (index % skillsPerLine === 0) {
                if (this.currentY > this.pageHeight - 20) {
                    this.pdf.addPage();
                    this.currentY = this.margin;
                    startX = this.margin;
                }
                this.currentY += 10;
            }
            
            const x = startX + (index % skillsPerLine) * (skillWidth + 5);
            
            // Boîte de compétence
            this.pdf.setFillColor(...color, 0.1);
            this.pdf.roundedRect(x, this.currentY, skillWidth, 8, 4, 4, 'F');
            
            // Bordure
            this.pdf.setDrawColor(...color, 0.3);
            this.pdf.setLineWidth(0.2);
            this.pdf.roundedRect(x, this.currentY, skillWidth, 8, 4, 4, 'S');
            
            // Texte
            this.pdf.setFontSize(9);
            this.pdf.setTextColor(...color);
            this.pdf.text(skill.trim(), x + 4, this.currentY + 5);
            
            if ((index + 1) % skillsPerLine === 0) {
                this.currentY += 12;
            }
        });
        
        if (skills.length % skillsPerLine !== 0) {
            this.currentY += 12;
        }
        
        this.currentY += 5;
    }

    addLanguagesManual(languages, color) {
        const languagesPerLine = 2;
        const langWidth = (this.pageWidth - (2 * this.margin)) / languagesPerLine - 10;
        
        languages.forEach((lang, index) => {
            if (index % languagesPerLine === 0) {
                if (this.currentY > this.pageHeight - 20) {
                    this.pdf.addPage();
                    this.currentY = this.margin;
                }
                this.currentY += 8;
            }
            
            const x = this.margin + (index % languagesPerLine) * (langWidth + 10);
            const level = lang.level || 3;
            const levelPercent = (level / 5) * 100;
            
            // Nom de la langue
            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(...color);
            this.pdf.text(lang.name || lang, x, this.currentY);
            
            // Barre de niveau
            this.pdf.setDrawColor(200, 200, 200);
            this.pdf.setLineWidth(0.5);
            this.pdf.line(x, this.currentY + 3, x + langWidth, this.currentY + 3);
            
            // Remplissage
            this.pdf.setDrawColor(...color);
            this.pdf.setLineWidth(2);
            this.pdf.line(x, this.currentY + 3, x + (langWidth * levelPercent / 100), this.currentY + 3);
            
            // Niveau textuel
            this.pdf.setFontSize(8);
            this.pdf.setTextColor(100, 100, 100);
            this.pdf.text(this.getLanguageLevelLabel(level), x + langWidth - 20, this.currentY);
            
            if ((index + 1) % languagesPerLine === 0) {
                this.currentY += 10;
            }
        });
        
        if (languages.length % languagesPerLine !== 0) {
            this.currentY += 10;
        }
        
        this.currentY += 10;
    }

    addFooterManual() {
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(100, 116, 139);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.text(`Généré avec CVBuilder Pro - ${new Date().toLocaleDateString('fr-FR')}`, 
                     this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }

    // ========== UTILITAIRES ==========
    wrapTextManual(text, maxWidth) {
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

    getLanguageLevelLabel(level) {
        const labels = ['Débutant', 'Intermédiaire', 'Bon', 'Courant', 'Natif'];
        return labels[level - 1] || labels[2];
    }

    getFileName(cvData) {
        const name = cvData.personal.fullName 
            ? cvData.personal.fullName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')
            : 'CV';
        const date = new Date().toISOString().split('T')[0];
        return `CV_${name}_${date}.pdf`;
    }

    // ========== AUTRES TEMPLATES (simplifiés) ==========
    generateProfessionalPDFManual(cvData) {
        this.generateModernPDFManual(cvData);
    }

    generateCreativePDFManual(cvData) {
        this.generateModernPDFManual(cvData);
    }

    generateExecutivePDFManual(cvData) {
        this.generateModernPDFManual(cvData);
    }

    // ========== LOADING ==========
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Exporter la classe
window.PDFGenerator = PDFGenerator;
