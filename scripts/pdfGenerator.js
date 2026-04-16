/**
 * PDFGenerator - Version fiable
 * Utilise html2canvas avec une approche simplifiée
 * Capture directe sans manipulation de styles destructive
 */
class PDFGenerator {
    constructor() {
        this.isGenerating = false;
        this.qualityProfile = 'high';
        
        // Dimensions A4
        this.A4_WIDTH_MM = 210;
        this.A4_HEIGHT_MM = 297;
        this.A4_WIDTH_PX = 794;
        this.A4_HEIGHT_PX = 1123;
        
        this.profiles = {
            high: { scale: 2, jpegQuality: 0.98, timeout: 60000 },
            medium: { scale: 1.5, jpegQuality: 0.92, timeout: 45000 },
            fast: { scale: 1, jpegQuality: 0.85, timeout: 30000 }
        };
        
        console.log('🎨 PDFGenerator initialisé');
    }

    async generatePDF(cvData) {
        if (this.isGenerating) {
            this.showNotification('Génération en cours...', 'warning');
            return false;
        }

        this.isGenerating = true;
        this.showLoading(true, 'Préparation...');

        try {
            if (!this.validateQuick(cvData)) {
                throw new Error('Données CV incomplètes');
            }

            // S'assurer que la preview est active
            this.showLoading(true, 'Activation de l\'aperçu...');
            await this.ensurePreviewActive();
            await this.wait(600);

            // Créer un conteneur hors écran avec le CV
            this.showLoading(true, 'Préparation de la capture...');
            const offscreenContainer = await this.createOffscreenCV();

            // Capture
            this.showLoading(true, 'Capture en cours...');
            const canvas = await this.captureElement(offscreenContainer);

            // Nettoyage du conteneur hors écran
            if (offscreenContainer && offscreenContainer.parentNode) {
                offscreenContainer.parentNode.removeChild(offscreenContainer);
            }

            // Validation
            if (!canvas || canvas.width < 50 || canvas.height < 50) {
                throw new Error('Capture échouée - canvas vide');
            }

            // Génération du PDF
            this.showLoading(true, 'Création du PDF...');
            this.createPDF(canvas, cvData);

            this.showNotification('✅ PDF téléchargé avec succès !', 'success');
            return true;

        } catch (error) {
            console.error('❌ Erreur PDF:', error);
            this.showNotification('Erreur: ' + error.message, 'error');
            return false;
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
            // Nettoyage de sécurité
            document.querySelectorAll('.pdf-offscreen-container').forEach(el => el.remove());
        }
    }

    async ensurePreviewActive() {
        const previewSection = document.getElementById('preview-section');
        if (previewSection && !previewSection.classList.contains('active')) {
            const previewTab = document.querySelector('[data-section="preview"]');
            if (previewTab) {
                previewTab.click();
                await this.wait(500);
            }
        }
    }

    async createOffscreenCV() {
        const cvPreview = document.getElementById('cv-preview');
        if (!cvPreview) throw new Error('Élément CV non trouvé');

        // Vérifier qu'il y a du contenu
        if (cvPreview.querySelector('.cv-placeholder')) {
            throw new Error('Veuillez remplir le formulaire avant de générer le PDF');
        }

        // Copier toutes les feuilles de style nécessaires
        const allStyles = this.getAllStyles();

        // Créer un conteneur hors écran
        const container = document.createElement('div');
        container.className = 'pdf-offscreen-container';
        container.style.cssText = `
            position: fixed;
            left: -10000px;
            top: 0;
            width: ${this.A4_WIDTH_PX}px;
            z-index: -9999;
            background: white;
            overflow: visible;
        `;

        // Injecter les styles
        const styleEl = document.createElement('style');
        styleEl.textContent = allStyles + `
            .pdf-offscreen-container .cv-preview {
                width: ${this.A4_WIDTH_PX}px !important;
                min-height: ${this.A4_HEIGHT_PX}px !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                overflow: visible !important;
                transform: none !important;
            }
            .pdf-offscreen-container .cv-preview,
            .pdf-offscreen-container .cv-preview * {
                animation: none !important;
                transition: none !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        `;
        container.appendChild(styleEl);

        // Cloner le CV
        const clone = cvPreview.cloneNode(true);
        clone.id = 'cv-preview-pdf-clone';
        clone.style.cssText = `
            width: ${this.A4_WIDTH_PX}px;
            min-height: ${this.A4_HEIGHT_PX}px;
            background: white;
            overflow: visible;
            transform: none;
            margin: 0;
            padding: 0;
            box-shadow: none;
        `;
        container.appendChild(clone);

        // Injecter dans le DOM
        document.body.appendChild(container);

        // Attendre le rendu
        await this.wait(500);

        return container;
    }

    getAllStyles() {
        let styles = '';
        
        // Récupérer toutes les feuilles de style
        for (const sheet of document.styleSheets) {
            try {
                if (sheet.cssRules) {
                    for (const rule of sheet.cssRules) {
                        styles += rule.cssText + '\n';
                    }
                }
            } catch (e) {
                // Ignorer les erreurs CORS sur les feuilles de style externes
                // Essayer de récupérer via le lien
                if (sheet.href) {
                    try {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = sheet.href;
                    } catch (e2) {
                        // Ignorer
                    }
                }
            }
        }

        return styles;
    }

    async captureElement(container) {
        const profile = this.profiles[this.qualityProfile];
        const targetElement = container.querySelector('.cv-preview') || container;

        try {
            const canvas = await html2canvas(targetElement, {
                scale: profile.scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: profile.timeout,
                width: this.A4_WIDTH_PX,
                height: Math.max(this.A4_HEIGHT_PX, targetElement.scrollHeight || this.A4_HEIGHT_PX),
                onclone: (clonedDoc, clonedEl) => {
                    // Seulement désactiver les animations dans le clone interne
                    const s = clonedDoc.createElement('style');
                    s.textContent = `
                        * { 
                            animation: none !important; 
                            transition: none !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    `;
                    clonedDoc.head.appendChild(s);
                }
            });

            console.log('✅ Canvas capturé:', canvas.width, 'x', canvas.height);
            return canvas;

        } catch (error) {
            console.error('Erreur html2canvas:', error);
            // Fallback : capturer directement depuis le DOM visible
            return await this.fallbackCapture();
        }
    }

    async fallbackCapture() {
        console.log('⚠️ Fallback: capture directe du preview visible');
        const cvPreview = document.getElementById('cv-preview');
        if (!cvPreview) throw new Error('CV non trouvé pour la capture');

        const profile = this.profiles[this.qualityProfile];

        // Sauvegarder le style
        const savedStyle = cvPreview.getAttribute('style') || '';
        const wrapper = document.getElementById('preview-wrapper');
        const savedWrapperStyle = wrapper ? wrapper.getAttribute('style') || '' : '';

        // Préparer pour la capture
        cvPreview.style.width = this.A4_WIDTH_PX + 'px';
        cvPreview.style.transform = 'none';
        if (wrapper) wrapper.style.transform = 'none';

        await this.wait(300);

        try {
            const canvas = await html2canvas(cvPreview, {
                scale: profile.scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            return canvas;
        } finally {
            // Restaurer
            if (savedStyle) {
                cvPreview.setAttribute('style', savedStyle);
            } else {
                cvPreview.removeAttribute('style');
            }
            if (wrapper) {
                if (savedWrapperStyle) {
                    wrapper.setAttribute('style', savedWrapperStyle);
                } else {
                    wrapper.removeAttribute('style');
                }
            }
        }
    }

    createPDF(canvas, cvData) {
        if (typeof window.jspdf === 'undefined') {
            throw new Error('Bibliothèque jsPDF non disponible');
        }

        const { jsPDF } = window.jspdf;
        const profile = this.profiles[this.qualityProfile];

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pdfW = this.A4_WIDTH_MM;
        const pdfH = this.A4_HEIGHT_MM;
        const canvasRatio = canvas.height / canvas.width;

        // Calcul dimensions image dans le PDF
        const imgW = pdfW;
        const imgH = imgW * canvasRatio;

        // Si le contenu dépasse une page A4
        if (imgH <= pdfH) {
            // Tout tient sur une page
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgW, imgH);
        } else {
            // Multi-pages
            const pageCount = Math.ceil(imgH / pdfH);
            const sourcePageHeight = canvas.width * (pdfH / pdfW);

            for (let i = 0; i < pageCount; i++) {
                if (i > 0) pdf.addPage();

                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                const remainH = canvas.height - i * sourcePageHeight;
                pageCanvas.height = Math.min(sourcePageHeight, remainH);

                const ctx = pageCanvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                ctx.drawImage(
                    canvas,
                    0, i * sourcePageHeight,
                    canvas.width, pageCanvas.height,
                    0, 0,
                    pageCanvas.width, pageCanvas.height
                );

                const pageData = pageCanvas.toDataURL('image/png');
                const pageImgH = pdfW * (pageCanvas.height / pageCanvas.width);
                pdf.addImage(pageData, 'PNG', 0, 0, pdfW, pageImgH);
            }
        }

        // Métadonnées
        const name = cvData.personal?.fullName || 'CV';
        try {
            pdf.setProperties({
                title: `CV - ${name}`,
                author: name,
                subject: cvData.personal?.profession || '',
                creator: 'CV Builder'
            });
        } catch (e) { /* ignore */ }

        // Télécharger
        const fileName = this.generateFileName(cvData);
        pdf.save(fileName);
        console.log('✅ PDF sauvegardé:', fileName);
    }

    generateFileName(cvData) {
        try {
            const name = cvData.personal?.fullName || 'mon_cv';
            const cleanName = name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '_')
                .toLowerCase();

            const d = new Date();
            const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            return `cv_${cleanName}_${dateStr}.pdf`;
        } catch (e) {
            return `cv_${Date.now()}.pdf`;
        }
    }

    validateQuick(cvData) {
        if (!cvData.personal?.fullName?.trim()) {
            this.showNotification('Veuillez saisir votre nom complet', 'warning');
            return false;
        }
        if (!cvData.personal?.profession?.trim()) {
            this.showNotification('Veuillez saisir votre profession', 'warning');
            return false;
        }
        return true;
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading(show, message = 'Chargement...') {
        const overlay = document.getElementById('loading-overlay');
        const msg = document.getElementById('loading-message');

        if (overlay) {
            if (show) {
                overlay.style.display = 'flex';
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
                setTimeout(() => { overlay.style.display = 'none'; }, 300);
            }
        }
        if (msg && message) msg.textContent = message;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) { console.log(`${type}: ${message}`); return; }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    setQualityProfile(profile) {
        if (this.profiles[profile]) {
            this.qualityProfile = profile;
        }
    }
}

// Init
if (typeof window !== 'undefined') {
    window.PDFGenerator = PDFGenerator;
    console.log('✅ PDFGenerator chargé');

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const missing = [];
            if (typeof html2canvas === 'undefined') missing.push('html2canvas');
            if (typeof window.jspdf === 'undefined') missing.push('jsPDF');
            if (missing.length > 0) {
                console.error('❌ Dépendances manquantes:', missing.join(', '));
            } else {
                console.log('✅ Dépendances PDF OK');
            }
        }, 1000);
    });
}