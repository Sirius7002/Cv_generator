/**
<<<<<<< HEAD
 * PDFGenerator - Version fiable
 * Utilise html2canvas avec une approche simplifiée
 * Capture directe sans manipulation de styles destructive
=======
 * PDFGenerator - Version avec préservation des templates
 * Capture haute fidélité avec respect des couleurs et styles
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
 */
class PDFGenerator {
    constructor() {
        this.isGenerating = false;
<<<<<<< HEAD
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
=======
        this.originalStates = new Map();
        this.qualityProfile = 'high'; // high, medium, fast
        
        // Dimensions A4 en pixels (96 DPI)
        this.A4_WIDTH_PX = 794;   // 210mm
        this.A4_HEIGHT_PX = 1123; // 297mm
        this.A4_WIDTH_MM = 210;
        this.A4_HEIGHT_MM = 297;
        
        // Profils de qualité
        this.profiles = {
            high: { scale: 3, dpi: 288, jpegQuality: 1.0, timeout: 60000 },
            medium: { scale: 2, dpi: 192, jpegQuality: 0.95, timeout: 45000 },
            fast: { scale: 1.5, dpi: 144, jpegQuality: 0.9, timeout: 30000 }
        };
        
        console.log('🎨 PDFGenerator avec préservation des templates initialisé');
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
    }

    async generatePDF(cvData) {
        if (this.isGenerating) {
<<<<<<< HEAD
            this.showNotification('Génération en cours...', 'warning');
=======
            this.showNotification('Génération en cours, veuillez patienter...', 'warning');
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
            return false;
        }

        this.isGenerating = true;
<<<<<<< HEAD
        this.showLoading(true, 'Préparation...');

        try {
=======
        this.showLoading(true, 'Initialisation...');

        try {
            // 1. Validation rapide
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
            if (!this.validateQuick(cvData)) {
                throw new Error('Données CV incomplètes');
            }

<<<<<<< HEAD
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
=======
            // 2. Préparation minimale (sans altérer l'affichage)
            this.showLoading(true, 'Préparation minimale...');
            await this.minimalPreparation();
            
            // 3. Créer un clone pour la capture (sans toucher à l'original)
            this.showLoading(true, 'Clonage pour capture...');
            const clone = await this.createCloneForCapture();
            
            // 4. Capture avec préservation des styles
            this.showLoading(true, 'Capture haute fidélité...');
            const canvas = await this.captureWithStylePreservation(clone);
            
            // 5. Validation
            if (!this.isCaptureValid(canvas)) {
                throw new Error('La capture a échoué - résultat vide');
            }
            
            // 6. Génération PDF
            this.showLoading(true, 'Création du PDF...');
            await this.createPDFFromCanvas(canvas, cvData);
            
            this.showNotification('✅ PDF généré avec succès !', 'success');
            return true;
            
        } catch (error) {
            console.error('❌ Erreur de génération:', error);
            this.showNotification(`❌ ${error.message}`, 'error');
            return false;
            
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
        } finally {
            this.cleanup();
            this.isGenerating = false;
            this.showLoading(false);
            // Nettoyage de sécurité
            document.querySelectorAll('.pdf-offscreen-container').forEach(el => el.remove());
        }
    }

<<<<<<< HEAD
=======
    async minimalPreparation() {
        // Sauvegarder très peu d'état, juste le nécessaire
        const cvElement = document.getElementById('cv-preview');
        if (!cvElement) throw new Error('CV non trouvé');
        
        this.originalStates.set('cv', {
            parent: cvElement.parentNode,
            nextSibling: cvElement.nextSibling,
            style: cvElement.getAttribute('style')
        });
        
        // Activer la preview si nécessaire
        await this.ensurePreviewActive();
        
        // Attendre que l'UI se stabilise
        await this.wait(300);
    }

>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
    async ensurePreviewActive() {
        const previewSection = document.getElementById('preview-section');
        if (previewSection && !previewSection.classList.contains('active')) {
            const previewTab = document.querySelector('[data-section="preview"]');
            if (previewTab) {
                previewTab.click();
<<<<<<< HEAD
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
=======
                await this.wait(800);
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
            }
        }

        return styles;
    }

<<<<<<< HEAD
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

=======
    async createCloneForCapture() {
        const original = document.getElementById('cv-preview');
        if (!original) throw new Error('CV original introuvable');
        
        // Créer un clone profond
        const clone = original.cloneNode(true);
        
        // Donner un ID unique au clone
        clone.id = 'cv-preview-clone-' + Date.now();
        
        // Appliquer les styles de capture minimalistes
        this.applyCloneStyles(clone);
        
        // Ajuster le layout du clone (pas de l'original)
        this.adjustCloneLayout(clone);
        
        // Injecter le clone dans le DOM (caché)
        clone.style.position = 'fixed';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.zIndex = '-9999';
        clone.style.visibility = 'hidden';
        document.body.appendChild(clone);
        
        // Attendre que le clone soit rendu
        await this.wait(100);
        
        return clone;
    }

    applyCloneStyles(clone) {
        // Sauvegarder les classes originales
        const originalClasses = clone.className;
        
        // Appliquer les styles de base sans toucher aux couleurs
        clone.style.cssText = `
            width: ${this.A4_WIDTH_PX}px !important;
            height: ${this.A4_HEIGHT_PX}px !important;
            min-width: ${this.A4_WIDTH_PX}px !important;
            min-height: ${this.A4_HEIGHT_PX}px !important;
            max-width: ${this.A4_WIDTH_PX}px !important;
            max-height: ${this.A4_HEIGHT_PX}px !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background-color: inherit !important;
            position: relative !important;
            overflow: hidden !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
        `;
        
        // Réappliquer les classes originales pour garder les styles du template
        clone.className = originalClasses + ' pdf-capture-mode';
        
        // Injection CSS pour la capture uniquement
        this.injectCaptureCSS(clone);
    }

    injectCaptureCSS(clone) {
        const style = document.createElement('style');
        style.id = 'pdf-capture-styles';
        style.textContent = `
            /* Styles de capture - Préservation des templates */
            #${clone.id} {
                all: initial !important;
            }
            
            #${clone.id} * {
                all: revert !important;
                box-sizing: border-box !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            /* Forcer les dimensions A4 */
            #${clone.id} {
                width: ${this.A4_WIDTH_PX}px !important;
                height: ${this.A4_HEIGHT_PX}px !important;
                background: white !important;
                position: relative !important;
                overflow: visible !important;
            }
            
            /* Préserver les styles de template */
            #${clone.id}.modern-cv {
                /* Styles spécifiques au template moderne */
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            }
            
            #${clone.id}.professional-cv {
                /* Styles spécifiques au template professionnel */
                font-family: Georgia, 'Times New Roman', Times, serif !important;
            }
            
            #${clone.id}.creative-cv {
                /* Styles spécifiques au template créatif */
                font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif !important;
            }
            
            #${clone.id}.executive-cv {
                /* Styles spécifiques au template executive */
                font-family: 'Calibri', 'Candara', 'Segoe', 'Segoe UI', sans-serif !important;
            }
            
            /* Correction des colonnes */
            #${clone.id} .cv-sidebar,
            #${clone.id} .left-column,
            #${clone.id} [class*="sidebar"] {
                width: 35% !important;
                float: left !important;
                clear: none !important;
            }
            
            #${clone.id} .cv-main,
            #${clone.id} .right-column,
            #${clone.id} [class*="main"] {
                width: 65% !important;
                float: left !important;
                clear: none !important;
            }
            
            /* Nettoyer les flottants */
            #${clone.id} .clearfix::after {
                content: '' !important;
                display: table !important;
                clear: both !important;
            }
            
            /* Forcer la visibilité */
            #${clone.id},
            #${clone.id} * {
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
            }
            
            /* Images */
            #${clone.id} img {
                max-width: 100% !important;
                height: auto !important;
            }
            
            /* Désactiver les animations */
            #${clone.id} * {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    adjustCloneLayout(clone) {
        // Ajustements spécifiques au layout
        const adjustElements = (selector, styles) => {
            const elements = clone.querySelectorAll(selector);
            elements.forEach(el => {
                Object.assign(el.style, styles);
            });
        };
        
        // 1. Correction des colonnes
        adjustElements('.cv-sidebar, .left-column', {
            width: '35%',
            float: 'left',
            boxSizing: 'border-box',
            position: 'relative'
        });
        
        adjustElements('.cv-main, .right-column', {
            width: '65%',
            float: 'left',
            boxSizing: 'border-box',
            position: 'relative'
        });
        
        // 2. Correction des sections
        adjustElements('.cv-section, section', {
            width: '100%',
            clear: 'both',
            margin: '10px 0',
            padding: '5px 0'
        });
        
        // 3. Assurer la lisibilité du texte
        adjustElements('h1, h2, h3, h4, h5, h6, p, li, span', {
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: '1.4'
        });
        
        // 4. S'assurer que les couleurs de fond sont visibles
        adjustElements('[class*="bg-"], [style*="background"]', {
            backgroundColor: 'inherit'
        });
        
        // 5. Créer un clearfix à la fin
        const clearfix = document.createElement('div');
        clearfix.style.clear = 'both';
        clearfix.style.height = '0';
        clearfix.style.visibility = 'hidden';
        clone.appendChild(clearfix);
    }

    async captureWithStylePreservation(clone) {
        const profile = this.profiles[this.qualityProfile];
        
        try {
            const options = {
                scale: profile.scale,
                useCORS: true,
                backgroundColor: null, // null pour garder le fond du template
                logging: true,
                width: this.A4_WIDTH_PX,
                height: this.A4_HEIGHT_PX,
                windowWidth: this.A4_WIDTH_PX,
                windowHeight: this.A4_HEIGHT_PX,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                allowTaint: true,
                foreignObjectRendering: true,
                imageTimeout: profile.timeout,
                removeContainer: false,
                onclone: (clonedDoc, clonedElement) => {
                    // Cette fonction s'exécute sur le clone interne d'html2canvas
                    // On peut y faire des ajustements supplémentaires
                    this.finalizeCloneForCapture(clonedElement);
                }
            };
            
            console.log('🎨 Capture avec préservation des styles...');
            const canvas = await html2canvas(clone, options);
            
            // Vérification immédiate
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error('Canvas vide généré');
            }
            
            console.log('✅ Capture réussie:', {
                dimensions: `${canvas.width}x${canvas.height}`,
                scale: profile.scale
            });
            
            return canvas;
            
        } finally {
            // Nettoyer le clone du DOM
            if (clone && clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            
            // Nettoyer les styles injectés
            const captureStyles = document.getElementById('pdf-capture-styles');
            if (captureStyles) {
                captureStyles.remove();
            }
        }
    }

    finalizeCloneForCapture(clonedElement) {
        // Derniers ajustements avant la capture finale
        clonedElement.style.width = `${this.A4_WIDTH_PX}px`;
        clonedElement.style.height = `${this.A4_HEIGHT_PX}px`;
        clonedElement.style.overflow = 'visible';
        
        // S'assurer que toutes les couleurs sont préservées
        clonedElement.querySelectorAll('*').forEach(el => {
            // Sauvegarder les couleurs calculées
            const computedStyle = window.getComputedStyle(el);
            const color = computedStyle.color;
            const backgroundColor = computedStyle.backgroundColor;
            
            // Si la couleur de fond est transparente, la remplacer par blanc
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                el.style.backgroundColor = '#ffffff';
            } else {
                el.style.backgroundColor = backgroundColor;
            }
            
            el.style.color = color;
        });
    }

    isCaptureValid(canvas) {
        if (!canvas) return false;
        
        // Vérifier les dimensions
        const minDimension = 100;
        if (canvas.width < minDimension || canvas.height < minDimension) {
            console.error('Canvas trop petit:', canvas.width, 'x', canvas.height);
            return false;
        }
        
        // Vérifier si le canvas n'est pas entièrement blanc
        const ctx = canvas.getContext('2d');
        const sampleWidth = Math.min(100, canvas.width);
        const sampleHeight = Math.min(100, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imageData.data;
        
        let coloredPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Si le pixel n'est pas blanc pur
            if (!(r > 250 && g > 250 && b > 250)) {
                coloredPixels++;
            }
        }
        
        const coloredPercentage = (coloredPixels / (data.length / 4)) * 100;
        console.log('Pourcentage de pixels colorés:', coloredPercentage.toFixed(2) + '%');
        
        // Si moins de 10% des pixels sont colorés, la capture est probablement vide
        return coloredPercentage > 10;
    }

    validateQuick(cvData) {
        // Validation minimale
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

    async createPDFFromCanvas(canvas, cvData) {
        try {
            console.log('🖨️ Création du PDF...');
            
            if (typeof window.jspdf === 'undefined') {
                throw new Error('Bibliothèque jsPDF non disponible');
            }
            
            const { jsPDF } = window.jspdf;
            const profile = this.profiles[this.qualityProfile];
            
            // Créer un PDF A4
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true,
                precision: 16
            });
            
            // Calculer les dimensions pour remplir la page
            const pdfWidth = this.A4_WIDTH_MM;
            const pdfHeight = this.A4_HEIGHT_MM;
            
            // Ratio d'aspect du canvas
            const canvasRatio = canvas.height / canvas.width;
            const pdfRatio = pdfHeight / pdfWidth;
            
            let imgWidth, imgHeight, x, y;
            
            if (canvasRatio > pdfRatio) {
                // L'image est plus haute, on ajuste la largeur
                imgHeight = pdfHeight;
                imgWidth = imgHeight / canvasRatio;
                x = (pdfWidth - imgWidth) / 2;
                y = 0;
            } else {
                // L'image est plus large, on ajuste la hauteur
                imgWidth = pdfWidth;
                imgHeight = imgWidth * canvasRatio;
                x = 0;
                y = (pdfHeight - imgHeight) / 2;
            }
            
            // Convertir en image
            const imgData = canvas.toDataURL('image/jpeg', profile.jpegQuality);
            
            // Ajouter au PDF
            pdf.addImage(
                imgData,
                'JPEG',
                x,
                y,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );
            
            // Métadonnées
            const name = cvData.personal?.fullName || 'CV';
            const profession = cvData.personal?.profession || '';
            
            try {
                pdf.setProperties({
                    title: `CV - ${name}`,
                    author: name,
                    subject: profession,
                    keywords: 'CV, Curriculum Vitae',
                    creator: 'CV Builder',
                    creationDate: new Date()
                });
            } catch (e) {
                console.warn('Impossible de définir les métadonnées:', e);
            }
            
            // Nom du fichier
            const fileName = this.generateFileName(cvData);
            
            // Sauvegarder
            pdf.save(fileName);
            
            console.log('✅ PDF sauvegardé:', fileName);
            
        } catch (error) {
            console.error('❌ Erreur lors de la création du PDF:', error);
            throw error;
        }
    }

>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
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
<<<<<<< HEAD

            const d = new Date();
            const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            return `cv_${cleanName}_${dateStr}.pdf`;
        } catch (e) {
=======
            
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            
            return `cv_${cleanName}_${year}${month}${day}.pdf`;
            
        } catch (error) {
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
            return `cv_${Date.now()}.pdf`;
        }
    }

<<<<<<< HEAD
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
=======
    cleanup() {
        // Restaurer l'état original minimal
        const cvState = this.originalStates.get('cv');
        if (cvState) {
            const cvElement = document.getElementById('cv-preview');
            if (cvElement && cvState.style) {
                cvElement.setAttribute('style', cvState.style);
            } else if (cvElement) {
                cvElement.removeAttribute('style');
            }
        }
        
        this.originalStates.clear();
        
        // Nettoyer les éventuels styles restants
        const captureStyles = document.getElementById('pdf-capture-styles');
        if (captureStyles) captureStyles.remove();
        
        // Nettoyer les clones restants
        document.querySelectorAll('[id^="cv-preview-clone-"]').forEach(clone => {
            clone.parentNode.removeChild(clone);
        });
        
        console.log('🧹 Nettoyage effectué');
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading(show, message = 'Chargement...') {
        const overlay = document.getElementById('loading-overlay');
        const msg = document.getElementById('loading-message');

        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
            if (show) {
<<<<<<< HEAD
                overlay.style.display = 'flex';
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
                setTimeout(() => { overlay.style.display = 'none'; }, 300);
            }
        }
        if (msg && message) msg.textContent = message;
=======
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 10);
            } else {
                overlay.style.opacity = '0';
            }
        }
        
        if (loadingMessage && message) {
            loadingMessage.textContent = message;
        }
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
<<<<<<< HEAD
        if (!container) { console.log(`${type}: ${message}`); return; }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

=======
        if (!container) {
            console.log(`${type}: ${message}`);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
<<<<<<< HEAD

=======
        
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
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

<<<<<<< HEAD
    setQualityProfile(profile) {
        if (this.profiles[profile]) {
            this.qualityProfile = profile;
=======
    // Méthode pour changer le profil de qualité
    setQualityProfile(profile) {
        if (this.profiles[profile]) {
            this.qualityProfile = profile;
            console.log(`Profil de qualité défini sur: ${profile}`);
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
        }
    }
}

<<<<<<< HEAD
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
=======
// Initialisation globale
if (typeof window !== 'undefined') {
    window.PDFGenerator = PDFGenerator;
    console.log('✅ PDFGenerator avec préservation des templates chargé');
    
    // Vérifier les dépendances
    document.addEventListener('DOMContentLoaded', () => {
        const checkDependencies = () => {
            const missing = [];
            
            if (typeof html2canvas === 'undefined') {
                missing.push('html2canvas');
            }
            
            if (typeof window.jspdf === 'undefined') {
                missing.push('jsPDF');
            }
            
            if (missing.length > 0) {
                console.error('❌ Dépendances manquantes:', missing.join(', '));
                return false;
            }
            
            return true;
        };
        
        // Vérifier après un délai
        setTimeout(checkDependencies, 1000);
>>>>>>> 826a55fb71e72f5dcf8ec07fce54bd6f734ddf90
    });
}