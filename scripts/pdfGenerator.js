/**
 * PDFGenerator - Générateur de PDF haute fidélité
 */

class PDFGenerator {
    constructor() {
        this.isGenerating = false;
        this.quality = 'high'; // high, medium, low
        this.removeBranding = true;
    }

    async generatePDF(cvData) {
        if (this.isGenerating) {
            console.warn('⚠️ Génération PDF déjà en cours');
            this.showNotification('Génération PDF déjà en cours', 'warning');
            return;
        }

        try {
            this.isGenerating = true;
            this.showLoading(true, 'Préparation du PDF...');
            
            console.log('🚀 Début génération PDF haute qualité...');
            
            // Utiliser la méthode haute fidélité
            await this.generateHighQualityPDF(cvData);
            
            console.log('✅ PDF généré avec succès');
            this.showNotification('PDF généré avec succès !', 'success');
            
        } catch (error) {
            console.error('❌ Erreur génération PDF:', error);
            // Fallback vers méthode simple
            this.showLoading(true, 'Chargement en cours (méthode alternative)...');
            await this.generateSimplePDF(cvData);
            this.showNotification('PDF généré (version simplifiée)', 'info');
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
        }
    }

    async generateHighQualityPDF(cvData) {
        return new Promise((resolve, reject) => {
            const preview = document.getElementById('cv-preview');
            if (!preview) {
                reject(new Error('Aperçu non trouvé'));
                return;
            }

            // Sauvegarder les styles originaux
            const originalStyles = {
                transform: preview.style.transform,
                boxShadow: preview.style.boxShadow,
                margin: preview.style.margin,
                position: preview.style.position,
                width: preview.style.width,
                minHeight: preview.style.minHeight,
                maxWidth: preview.style.maxWidth,
                backgroundColor: preview.style.backgroundColor
            };

            // Appliquer les styles optimisés pour le PDF
            preview.style.transform = 'none';
            preview.style.boxShadow = 'none';
            preview.style.margin = '0';
            preview.style.position = 'relative';
            preview.style.backgroundColor = '#ffffff';
            
            // Appliquer les styles A4
            preview.style.width = '210mm';
            preview.style.minHeight = '297mm';
            preview.style.maxWidth = '210mm';
            preview.style.overflow = 'hidden';

            // Mettre à jour l'UI
            this.updateProgress(20);

            // Attendre que le style soit appliqué
            setTimeout(() => {
                const options = {
                    scale: this.getScaleForQuality(),
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: 794, // 210mm * 3.78
                    height: 1123, // 297mm * 3.78
                    windowWidth: 794,
                    onclone: (clonedDoc) => {
                        this.updateProgress(40);
                        
                        // Nettoyer les éléments de l'application
                        const clonedPreview = clonedDoc.getElementById('cv-preview');
                        if (clonedPreview) {
                            // Supprimer toutes les mentions de CVBuilder
                            this.removeBrandingElements(clonedPreview);
                            
                            // Appliquer les styles d'impression
                            clonedPreview.style.width = '210mm';
                            clonedPreview.style.height = 'auto';
                            clonedPreview.style.boxShadow = 'none';
                            clonedPreview.style.margin = '0';
                            clonedPreview.style.padding = '0';
                            clonedPreview.style.background = '#ffffff';
                            
                            // Forcer le chargement des images
                            const images = clonedPreview.querySelectorAll('img');
                            images.forEach(img => {
                                img.crossOrigin = 'anonymous';
                                img.style.maxWidth = '100%';
                                img.style.height = 'auto';
                            });
                        }
                    }
                };

                this.updateProgress(60);

                html2canvas(preview, options)
                    .then(canvas => {
                        this.updateProgress(80);
                        
                        // Restaurer les styles originaux
                        preview.style.transform = originalStyles.transform;
                        preview.style.boxShadow = originalStyles.boxShadow;
                        preview.style.margin = originalStyles.margin;
                        preview.style.position = originalStyles.position;
                        preview.style.width = originalStyles.width;
                        preview.style.minHeight = originalStyles.minHeight;
                        preview.style.maxWidth = originalStyles.maxWidth;
                        preview.style.backgroundColor = originalStyles.backgroundColor;

                        this.convertCanvasToPDF(canvas, cvData);
                        resolve(true);
                    })
                    .catch(error => {
                        // Restaurer les styles en cas d'erreur
                        preview.style.transform = originalStyles.transform;
                        preview.style.boxShadow = originalStyles.boxShadow;
                        preview.style.margin = originalStyles.margin;
                        preview.style.position = originalStyles.position;
                        preview.style.width = originalStyles.width;
                        preview.style.minHeight = originalStyles.minHeight;
                        preview.style.maxWidth = originalStyles.maxWidth;
                        preview.style.backgroundColor = originalStyles.backgroundColor;
                        
                        reject(error);
                    });
            }, 300);
        });
    }

    removeBrandingElements(element) {
        if (!this.removeBranding) return;
        
        // Supprimer tous les éléments qui pourraient contenir des mentions
        const elements = element.querySelectorAll('*');
        elements.forEach(el => {
            if (el.textContent && (
                el.textContent.includes('CVBuilder') || 
                el.textContent.includes('CV Builder') ||
                el.textContent.includes('Généré avec') ||
                el.textContent.includes('www.cvbuilder')
            )) {
                el.remove();
            }
        });
        
        // Supprimer les éléments de footer spécifiques
        const footers = element.querySelectorAll('.cv-footer, .executive-badge, .quality-badge, .footer, .logo-subtitle');
        footers.forEach(footer => {
            if (footer.textContent && (
                footer.textContent.includes('Builder') || 
                footer.textContent.includes('©') ||
                footer.textContent.includes('Créez votre CV')
            )) {
                footer.remove();
            }
        });
        
        // Supprimer les logos
        const logos = element.querySelectorAll('.logo-icon, .logo-text');
        logos.forEach(logo => logo.remove());
    }

    getScaleForQuality() {
        switch (this.quality) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 2;
        }
    }

    convertCanvasToPDF(canvas, cvData) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true,
                precision: 100
            });

            // Calcul des dimensions
            const imgWidth = 210; // Largeur A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Convertir en image PNG pour meilleure qualité
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Ajouter l'image
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

            // Ajouter les métadonnées
            pdf.setProperties({
                title: `CV - ${cvData.personal?.fullName || 'Curriculum Vitae'}`,
                subject: 'Curriculum Vitae Professionnel',
                author: cvData.personal?.fullName || '',
                keywords: 'cv, curriculum vitae, emploi, recrutement, professionnel',
                creator: '',
                producer: ''
            });

            // Générer le nom de fichier
            const fileName = this.generateFileName(cvData);

            this.updateProgress(95);

            // Télécharger le PDF
            setTimeout(() => {
                pdf.save(fileName);
                this.updateProgress(100);
            }, 500);

        } catch (error) {
            console.error('❌ Erreur conversion canvas vers PDF:', error);
            throw error;
        }
    }

    async generateSimplePDF(cvData) {
        // Méthode fallback simple sans html2canvas
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const margin = 20;
        let y = margin;
        const pageWidth = 210;
        const pageHeight = 297;
        const contentWidth = pageWidth - (2 * margin);

        // Couleurs
        const primaryColor = [67, 97, 238];
        const darkColor = [30, 41, 59];
        const grayColor = [100, 116, 139];

        // Titre
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...darkColor);
        pdf.text(cvData.personal.fullName || 'Nom Prénom', margin, y);
        y += 10;

        // Profession
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...primaryColor);
        pdf.text(cvData.personal.profession || 'Profession', margin, y);
        y += 15;

        // Contact
        pdf.setFontSize(10);
        pdf.setTextColor(...grayColor);
        
        let contactX = margin;
        if (cvData.personal.email) {
            pdf.text(`Email: ${cvData.personal.email}`, contactX, y);
            contactX += 70;
        }
        if (cvData.personal.phone) {
            pdf.text(`Tél: ${cvData.personal.phone}`, contactX, y);
            contactX += 70;
        }
        if (cvData.personal.location) {
            pdf.text(`Localisation: ${cvData.personal.location}`, contactX, y);
        }
        y += 10;

        // Ligne de séparation
        pdf.setDrawColor(...primaryColor);
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 15;

        // Profil
        if (cvData.personal.summary) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...darkColor);
            pdf.text('PROFIL', margin, y);
            y += 8;
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...grayColor);
            const profileLines = pdf.splitTextToSize(cvData.personal.summary, contentWidth);
            profileLines.forEach(line => {
                if (y > pageHeight - 30) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += 5;
            });
            y += 10;
        }

        // Expériences
        if (cvData.experiences && cvData.experiences.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...darkColor);
            pdf.text('EXPÉRIENCE PROFESSIONNELLE', margin, y);
            y += 10;

            cvData.experiences.forEach(exp => {
                if (y > pageHeight - 40) {
                    pdf.addPage();
                    y = margin;
                }

                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text(exp.title || 'Poste', margin, y);
                y += 5;

                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'italic');
                pdf.setTextColor(...primaryColor);
                pdf.text(`${exp.company || 'Entreprise'} | ${exp.period || 'Période'}`, margin, y);
                y += 5;

                if (exp.description) {
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...grayColor);
                    const descLines = pdf.splitTextToSize(exp.description, contentWidth);
                    descLines.forEach(line => {
                        if (y > pageHeight - 30) {
                            pdf.addPage();
                            y = margin;
                        }
                        pdf.text(`• ${line}`, margin + 5, y);
                        y += 5;
                    });
                }
                y += 5;
            });
        }

        // Formation
        if (cvData.educations && cvData.educations.length > 0) {
            if (y > pageHeight - 50) {
                pdf.addPage();
                y = margin;
            }
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...darkColor);
            pdf.text('FORMATION', margin, y);
            y += 10;

            cvData.educations.forEach(edu => {
                if (y > pageHeight - 40) {
                    pdf.addPage();
                    y = margin;
                }

                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text(edu.degree || 'Diplôme', margin, y);
                y += 5;

                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'italic');
                pdf.setTextColor(...primaryColor);
                pdf.text(`${edu.school || 'Établissement'} | ${edu.year || 'Année'}`, margin, y);
                y += 5;

                if (edu.description) {
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...grayColor);
                    const descLines = pdf.splitTextToSize(edu.description, contentWidth);
                    descLines.forEach(line => {
                        if (y > pageHeight - 30) {
                            pdf.addPage();
                            y = margin;
                        }
                        pdf.text(`• ${line}`, margin + 5, y);
                        y += 5;
                    });
                }
                y += 5;
            });
        }

        // Compétences
        if (cvData.skills && cvData.skills.length > 0) {
            if (y > pageHeight - 30) {
                pdf.addPage();
                y = margin;
            }
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...darkColor);
            pdf.text('COMPÉTENCES', margin, y);
            y += 10;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...grayColor);
            
            const skillsText = cvData.skills.join(', ');
            const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
            skillsLines.forEach(line => {
                if (y > pageHeight - 30) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += 5;
            });
        }

        // Générer le nom de fichier
        const fileName = this.generateFileName(cvData);
        pdf.save(fileName);
    }

    generateFileName(cvData) {
        const name = cvData.personal?.fullName 
            ? cvData.personal.fullName
                  .replace(/\s+/g, '_')
                  .replace(/[^\w\s]/gi, '')
                  .substring(0, 50)
            : 'CV';
        
        const date = new Date().toISOString().split('T')[0];
        return `CV_${name}_${date}.pdf`;
    }

    // ========== UI HELPERS ==========
    
    showLoading(show, message = 'Chargement...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingMessage = document.getElementById('loading-message');
        
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
                if (loadingMessage) {
                    loadingMessage.textContent = message;
                }
            } else {
                overlay.classList.remove('active');
            }
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progress-fill');
        const loadingMessage = document.getElementById('loading-message');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (loadingMessage) {
            const messages = {
                20: 'Capture de l\'aperçu...',
                40: 'Traitement des images...',
                60: 'Conversion en image...',
                80: 'Création du PDF...',
                95: 'Finalisation...',
                100: 'Téléchargement...'
            };
            
            if (messages[percentage]) {
                loadingMessage.textContent = messages[percentage];
            }
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
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Export global
window.PDFGenerator = PDFGenerator;