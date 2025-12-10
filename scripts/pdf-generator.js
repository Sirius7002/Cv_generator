// Fonctions avancées pour la génération PDF
function generatePDFWithOptions() {
    const element = document.getElementById('cv-preview');
    
    // Options avancées pour le PDF
    const options = {
        margin: [10, 10, 10, 10],
        filename: `CV_${cvData.personal.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
            type: 'jpeg', 
            quality: 1 
        },
        html2canvas: { 
            scale: 3,
            useCORS: true,
            allowTaint: true,
            logging: false,
            letterRendering: true,
            width: element.scrollWidth,
            height: element.scrollHeight
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'] 
        }
    };

    // Afficher le loader
    showPDFLoader();
    
    // Générer le PDF
    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            hidePDFLoader();
            showNotification('PDF généré avec succès !', 'success');
        })
        .catch(error => {
            hidePDFLoader();
            console.error('Erreur génération PDF:', error);
            showNotification('Erreur lors de la génération du PDF', 'error');
        });
}

function showPDFLoader() {
    let loader = document.getElementById('pdf-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'pdf-loader';
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p>Génération du PDF en cours...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hidePDFLoader() {
    const loader = document.getElementById('pdf-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Disparaître après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
