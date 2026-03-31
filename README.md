# Simulateur Wadagni — "Ce que ça change pour moi"

Application web interactive permettant à chaque Béninois de découvrir les mesures du programme présidentiel **"Plus Loin, Ensemble"** de Romuald Wadagni (2026–2033) qui le concernent directement, selon son profil, sa région et ses priorités.

**Mainteneur :** Armel Kouandi DARI — CEO, iCODE Cotonou  
**Statut :** Production — Élection présidentielle du 12 avril 2026

---

## Aperçu

L'idée est simple : personne ne lit un programme de 68 pages. Mais tout le monde veut savoir ce que ça change concrètement pour lui. Ce simulateur répond à ça en 3 clics.

L'utilisateur choisit son profil (jeune, agriculteur, artiste, entrepreneur…), sa région parmi les 6 pôles de développement territorial, ses priorités du moment — et reçoit un résumé personnalisé des mesures qui le touchent directement, avec les vrais chiffres du programme officiel. Le résultat est partageable sur WhatsApp en un clic.

---

## Stack

- HTML5 / CSS3 / JavaScript vanilla — aucune dépendance, aucun framework
- Fichier unique `index.html` — déploiement sur n'importe quel hébergeur statique
- Données issues du programme officiel Wadagni-Talata 2026-2033 (68 pages, 23 secteurs)

---

## Lancer localement

```bash
git clone https://github.com/[votre-org]/wadagni-simulateur
cd wadagni-simulateur
# Ouvrir index.html dans un navigateur — c'est tout
open index.html
```

Aucune installation, aucune dépendance, aucun build. C'est du HTML statique.

---

## Déploiement

### Netlify (recommandé)

```bash
# Installer la CLI Netlify
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir .
```

Ou simplement connecter le repo GitHub depuis l'interface Netlify — déploiement automatique à chaque push sur `main`.

### Vercel

```bash
npx vercel --prod
```

### Manuellement

Uploader `index.html` sur n'importe quel hébergeur (Hostinger, o2switch, etc.). Le fichier n'a besoin de rien d'autre.

---

## Structure du projet

```
/
├── index.html          # Application complète (HTML + CSS + JS)
├── README.md
└── assets/             # (optionnel) si vous séparez les ressources
    ├── styles.css
    ├── data.js         # Données programme par profil
    └── app.js          # Logique navigation et rendu
```

Pour l'instant tout est dans `index.html`. Si vous voulez contribuer en séparant les fichiers, c'est bienvenu — voir section contribution ci-dessous.

---

## Données programme

Les données sont dans le fichier `index.html`, objet JavaScript `D` (ou `profilData` selon la version). Chaque profil contient :

```js
{
  emoji: '🌾',
  label: 'Agriculteur / Éleveur',
  bilan: [
    { val: '641 000T', lbl: 'coton (1er producteur africain)' },
    ...
  ],
  measures: [
    {
      icon: '🛡️',
      title: 'Assurance récolte, épargne et retraite agricole',
      desc: 'Description détaillée de la mesure...'
    },
    ...
  ],
  quote: 'Citation officielle de Wadagni'
}
```

**Source :** Programme officiel Wadagni-Talata 2026-2033, présenté au Palais des Congrès de Cotonou le 21 mars 2026. Téléchargeable sur [wadagnitalata.bj](https://wadagnitalata.bj).

---

## Contribuer

Le repo est public. Les contributions sont les bienvenues, en particulier sur ces axes :

### Ce qu'on cherche

- **Traductions** — adapter l'interface et les résultats en fon, yoruba, bariba, dendi
- **Nouveaux profils** — retraité, étudiant universitaire, pêcheur, agent de santé
- **Version API Claude** — remplacer les données statiques par des réponses générées dynamiquement à partir du programme complet (voir branche `feature/claude-api`)
- **FAQ vocale** — intégrer Web Speech API pour permettre aux utilisateurs de poser leurs questions oralement en langues locales
- **Corrections de données** — si une mesure est mal transcrite ou incomplète par rapport au programme officiel, ouvrez une issue ou une PR

### Comment contribuer

```bash
# Fork le repo, puis
git checkout -b feature/votre-feature
# Faites vos modifications
git commit -m "feat: description courte"
git push origin feature/votre-feature
# Ouvrir une Pull Request sur GitHub
```

### Conventions de commit

```
feat: nouvelle fonctionnalité
fix: correction de bug
data: mise à jour des données programme
style: ajustement CSS sans impact fonctionnel
docs: modification README ou commentaires
```

### Règles

- Ne pas modifier les données programme sans source officielle
- Tester sur mobile avant de soumettre (l'usage principal est WhatsApp → mobile)
- Les PR sans description seront ignorées

---

## Roadmap

- [ ] Intégration API Claude pour réponses dynamiques
- [ ] FAQ en langues locales (fon, yoruba, bariba)
- [ ] Comparateur Wadagni vs Hounkpè par thème
- [ ] Générateur de post WhatsApp/Facebook personnalisé
- [ ] Version PWA installable sur mobile
- [ ] Analytics anonymisés (Plausible ou Umami)
- [ ] Traductions en anglais pour la diaspora anglophone

---

## Licence

MIT — libre d'utilisation, de modification et de redistribution avec attribution.

---

*Projet développé par [iCODE](https://icode.bj) — Cotonou, Bénin.*  
*Pour toute question : contact via GitHub Issues.*
