# Wadagni Simulateur — Guide de déploiement

Armel Kouandi DARI — iCODE Cotonou  
Projet : Simulateur programme présidentiel Wadagni 2026

---

## Structure des fichiers

```
wadagni-simulateur/
├── index.html                    # Application principale
├── admin/
│   └── index.html                # Back-office admin
├── assets/
│   ├── styles.css                # Styles
│   ├── data.js                   # Données programme officiel
│   ├── simulator.js              # Logique simulateur
│   ├── faq.js                    # FAQ vocale (mettre clé API ici)
│   └── tracking.js               # Tracking anonyme
├── netlify/
│   └── functions/
│       ├── track.js              # Reçoit les événements → Supabase
│       └── admin-data.js         # Alimente le back-office
├── netlify.toml                  # Configuration Netlify
├── supabase-schema.sql           # Tables à créer dans Supabase
└── README.md
```

---

## Étape 1 — Mettre sur GitHub

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "feat: simulateur wadagni v1 — programme officiel 2026-2033"

# Sur github.com → New repository → nom : wadagni-simulateur → Public
# Puis :
git remote add origin https://github.com/VOTRE_USERNAME/wadagni-simulateur.git
git branch -M main
git push -u origin main
```

---

## Étape 2 — Créer le compte Supabase (gratuit)

1. Aller sur **supabase.com** → Sign up (gratuit)
2. New project → nom : `wadagni-simulateur` → choisir région `East US` ou `Europe West`
3. Attendre 2 minutes que le projet démarre
4. Menu gauche → **SQL Editor** → coller le contenu de `supabase-schema.sql` → Run
5. Récupérer les clés : **Settings → API**
   - `URL` → copier (format : `https://xxxx.supabase.co`)
   - `anon public` → copier (pour le tracking)
   - `service_role` → copier (pour le back-office admin — **garder secret**)

---

## Étape 3 — Déployer sur Netlify

1. Aller sur **netlify.com** → Sign up avec GitHub
2. **Add new site → Import an existing project → GitHub**
3. Choisir le repo `wadagni-simulateur`
4. Build settings : laisser vide (site statique, pas de build)
5. **Deploy site**

### Configurer les variables d'environnement

Dans Netlify : **Site settings → Environment variables → Add variable**

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | https://xxxx.supabase.co |
| `SUPABASE_ANON_KEY` | eyJhbGci... (clé anon) |
| `SUPABASE_SERVICE_KEY` | eyJhbGci... (clé service_role) |
| `ADMIN_PASSWORD` | votre-mot-de-passe-admin |

Après avoir ajouté les variables : **Deploys → Trigger deploy** pour redéployer.

---

## Étape 4 — Configurer la clé API Claude

Dans `assets/faq.js`, ligne 10 :

```js
const ANTHROPIC_API_KEY = 'sk-ant-VOTRE_CLE_ICI';
```

Obtenir la clé : **console.anthropic.com → API Keys → Create Key**  
Budget recommandé pour démarrer : **$5** (environ 1 600 requêtes Haiku)

Après modification : `git commit -am "config: add api key" && git push`  
Netlify redéploie automatiquement.

---

## Étape 5 — Accéder au back-office

URL : `https://votre-site.netlify.app/admin`

Mot de passe : celui défini dans `ADMIN_PASSWORD`

Le back-office affiche :
- Nombre total de visites, résultats générés, questions FAQ, partages WhatsApp
- Graphique des visites sur 7 jours
- Régions les plus actives
- Profils les plus consultés
- Langues utilisées pour la FAQ
- Top questions posées
- Questions récentes

---

## Domaine personnalisé (optionnel)

Dans Netlify → **Domain management → Add domain** → entrer `simulateur.wadagni.bj`  
Puis chez votre registrar DNS, ajouter un CNAME :
```
simulateur → votre-site.netlify.app
```

---

## Dépannage

**Erreur micro "not-allowed"** → Ouvrir via `http://localhost:8080` en local, ou déployer sur Netlify (HTTPS automatique)

```bash
# Lancer un serveur local
python -m http.server 8080
# Ouvrir : http://localhost:8080
```

**Back-office vide / mode démo** → Vérifier que les variables Supabase sont bien configurées dans Netlify et redéployer

**FAQ ne répond pas** → Vérifier la clé API dans `assets/faq.js` et que la clé Anthropic a du crédit
