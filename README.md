# CVBuilder - Créateur de CV Professionnel

CVBuilder est une application web moderne pour créer, personnaliser et exporter des CV professionnels en toute simplicité.

## ✨ Fonctionnalités

### 🎨 4 Templates Professionnels
- **Moderne** : Design épuré et contemporain
- **Professionnel** : Style corporate élégant avec sidebar
- **Créatif** : Design original avec animations
- **Executive** : Luxueux et sophistiqué

### 📝 Éditeur Intuitif
- Interface utilisateur moderne et responsive
- Formulaire avec validation en temps réel
- Ajout dynamique d'expériences et formations
- Évaluation visuelle des compétences linguistiques
- Upload de photo avec prévisualisation

### 🔄 Gestion des Données
- Sauvegarde automatique dans le navigateur
- Import/Export des données en JSON
- Chargement d'exemples prédéfinis
- Thème clair/sombre personnalisable

### 📤 Export Avancé
- Génération de PDF haute qualité
- Options de zoom et impression
- Export en image PNG
- Partage direct des données

### 📱 Design Responsive
- Compatible avec tous les appareils
- Optimisé pour l'impression
- Interface adaptative

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3 (Flexbox, Grid, Variables CSS)
- **JavaScript** : ES6+ (Classes, Modules, Async/Await)
- **Stockage** : IndexedDB pour sauvegarde locale
- **PDF** : jsPDF + html2canvas
- **Icônes** : Font Awesome 6
- **Polices** : Google Fonts (Inter, Poppins, Montserrat)


## 📁 Structure du Projet
CVBuilder/
├── index.html
├── README.md
├── styles/
│   ├── style.css
│   └── templates/
│       ├── modern.css
│       ├── professional.css
│       ├── creative.css
│       └── executive.css
└── scripts/
    ├── app.js
    ├── database.js
    ├── templateLoader.js
    └── pdfGenerator.js