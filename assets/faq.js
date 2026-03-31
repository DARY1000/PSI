/* Wadagni Simulateur — FAQ Vocale Intelligente
 * Nécessite une clé API Anthropic : console.anthropic.com
 * Remplacez VOTRE_CLE_API_ICI par votre clé sk-ant-...
 */

// ============================================
// FAQ VOCALE INTELLIGENTE — Module complet
// ============================================

// Clé API Anthropic — À remplacer par votre clé
// Pour obtenir : console.anthropic.com → API Keys
const ANTHROPIC_API_KEY = 'VOTRE_CLE_API_ICI';

// État
let faqOpen = false;
let faqLang = 'fr';
let faqRecognition = null;
let faqIsRecording = false;
let faqHistory = [];
let faqCurrentResponse = '';

// Labels par langue
const langLabels = {
  fr: { placeholder: 'Que prévoit Wadagni pour les agriculteurs ?', status: 'Appuyez pour parler', recording: '🔴 Enregistrement... Parlez maintenant', processing: 'Consultation du programme en cours…', responseHeader: 'Réponse du programme officiel', speak: '🔊 Écouter la réponse' },
  fon: { placeholder: 'Nú ɖò Wadagni jló bló nú ganji lɛ?', status: 'Kpɔ́n bo ɖɔ nǔ', recording: '🔴 Un na ɖiɖi...', processing: 'Nú ɖiɖi lɛ kpo...', responseHeader: 'Xóɖiɖó sín wema', speak: '🔊 Ðiɖe' },
  yoruba: { placeholder: 'Kini Wadagni gbero fun awon agbe?', status: 'Tẹ lati soro', recording: '🔴 Gbigba… Soro bayi', processing: 'N wo eto naa…', responseHeader: 'Idahun lati eto osise', speak: '🔊 Gbọ idahun' },
  bariba: { placeholder: 'Muri Wadagni bani...', status: 'Gaa doo kpe', recording: '🔴 Yaa doo...', processing: 'Waa dii...', responseHeader: 'Tɔmburu siri', speak: '🔊 Mɛ doo' },
  en: { placeholder: 'What does Wadagni plan for farmers?', status: 'Press to speak', recording: '🔴 Recording… Speak now', processing: 'Consulting the program…', responseHeader: 'Official program response', speak: '🔊 Listen to answer' }
};

// Contexte programme complet pour Claude
const PROGRAMME_CONTEXT = `Tu es l'assistant officiel du programme présidentiel "Plus Loin, Ensemble" de Romuald Wadagni-Talata, candidat à l'élection présidentielle béninoise du 12 avril 2026.

Voici les points clés du programme 2026-2033 que tu dois utiliser pour répondre :

PRIORITÉ 1 — BIEN-ÊTRE SOCIAL
- SANTÉ : Urgences vitales gratuites (paiement différé), carnet de santé digital, construction CHIP Parakou, télémédecine et IA dans tous les hôpitaux, pharmacopée traditionnelle modernisée, nouvelle faculté de médecine
- PROTECTION SOCIALE : Plateforme nationale de prestations sociales, registre national des ménages, transferts monétaires numériques, SAMU social national
- ÉDUCATION : 9000 salles de classe construites, taux CEP passé de 42% à 89%, cantines scolaires dans 100% des écoles, gratuité secondaire pour les filles, Sèmè City Hubs dans chaque pôle, télé-enseignement
- EAU POTABLE : Programme "Eau pour tous", 314 nouveaux systèmes multi-villages, abonnement domicile à 10 000 FCFA (au lieu de 85 000)
- SPORTS : Infrastructure sportive dans les 546 arrondissements, bourses sportives, Académie Nationale des Sports

PRIORITÉ 2 — ÉCONOMIE DIVERSIFIÉE
- AGRICULTURE : Assurance récolte + épargne + retraite agricole, tripler rendements manioc/maïs, agritech (drones, IA, capteurs), 314 nouveaux périmètres irrigués, Bénin 1er producteur africain de coton (641 000 tonnes)
- INDUSTRIE : GDIZ Glo-Djigbé (20 000 emplois), fonds développement industriel, tarif industriel garanti
- ÉNERGIE : Doublement accès électricité (30% → 61%), +100 MW tous les 2 ans, barrage Dogo-Bis (128 MW), branchement "payer plus tard"
- INCLUSION FINANCIÈRE : Crédit digital en 48h (50 000 à 50 millions FCFA), Bénin 1er UEMOA (90% inclusion financière)
- ARTISANAT : Bases d'appui dans chaque commune, ateliers d'excellence, crédit ARCH Artisan, village artisanal Marina Ouidah
- TOURISME : 2,5 millions visiteurs/an d'ici 2033, station Avlékété, Parc Monts Kouffè-Wari Maro, "Villes et Villages de Splendeurs"

PRIORITÉ 3 — COHÉSION NATIONALE
- SÉCURITÉ : Police républicaine renforcée (+5600 agents), drones surveillance frontières, Programme Engagement Civique jeunesse
- FINANCES PUBLIQUES : Croissance 8% en 2025, budget triplé (1200 → 3500 milliards FCFA), notation S&P BB-, fonds national d'investissements stratégiques
- TECHNOLOGIE : Bénin exportateur de solutions tech, IA Factory, Sèmè City campus Ouidah (330 ha), Super App IA gouvernementale, data centers nationaux
- CULTURE : Programme National d'Excellence Artistique (salaires artistes), Content City, label "Bénin Originals", port franc des arts

6 PÔLES DE DÉVELOPPEMENT TERRITORIAL :
- Atlantique-Littoral : GDIZ, économie bleue, Ganvié, Sèmè City
- Ouémé-Plateau : Zone Kétou-Nigeria, Porto-Novo, industries
- Zou-Collines : Abomey, agro-industrie, patrimoine
- Mono-Couffo : Grand-Popo, tourisme balnéaire
- Borgou-Alibori : CHIP Parakou, agriculture Nord, Nikki
- Atacora-Donga : Monts Kouffè, safari, écotourisme, Natitingou

RÈGLES DE RÉPONSE IMPORTANTES :
1. Réponds TOUJOURS dans la langue demandée par l'utilisateur
2. Si la question est en fon → réponds en fon
3. Si la question est en yoruba → réponds en yoruba  
4. Si la question est en bariba → réponds en bariba (ou français si bariba trop difficile)
5. Sois concis (3-5 phrases max), direct et factuel
6. Cite des chiffres réels du programme quand c'est pertinent
7. Si une question ne concerne pas le programme Wadagni, réponds poliment que tu es limité au programme officiel`;

// ===== FONCTIONS PRINCIPALES =====

function toggleFaq() {
  if (faqOpen) closeFaq();
  else openFaq();
}

function openFaq() {
  faqOpen = true;
  const panel = document.getElementById('faqPanel');
  panel.classList.add('open');
  document.getElementById('faqFab').style.display = 'none';
  
  // Vérifier support micro
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    document.getElementById('faqBrowserWarn').classList.add('visible');
  }
  
  setTimeout(() => document.getElementById('faqInput').focus(), 400);
}

function closeFaq() {
  faqOpen = false;
  document.getElementById('faqPanel').classList.remove('open');
  document.getElementById('faqFab').style.display = 'flex';
  if (faqIsRecording) stopMic();
}

function setLang(btn) {
  document.querySelectorAll('.faq-lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  faqLang = btn.dataset.lang;
  
  // Mettre à jour les textes de l'interface
  const labels = langLabels[faqLang];
  document.getElementById('faqInput').placeholder = labels.placeholder;
  document.getElementById('faqMicStatus').textContent = labels.status;
  
  // Mettre à jour la langue de reconnaissance vocale
  if (faqRecognition) {
    const langMap = { fr: 'fr-FR', en: 'en-US', fon: 'fr-FR', yoruba: 'yo-NG', bariba: 'fr-FR' };
    faqRecognition.lang = langMap[faqLang] || 'fr-FR';
  }
}

function toggleMic() {
  if (faqIsRecording) stopMic();
  else startMic();
}

function startMic() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('faqBrowserWarn').classList.add('visible');
    return;
  }

  // Vérifier si contexte sécurisé
  if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    showFaqNotice('🔒 Le microphone nécessite HTTPS ou localhost. Déployez sur Netlify pour activer cette fonction.');
    return;
  }

  faqRecognition = new SpeechRecognition();
  
  // Langue de reconnaissance (fon/bariba → fr-FR car navigateur)
  const langMap = { fr: 'fr-FR', en: 'en-US', fon: 'fr-FR', yoruba: 'yo', bariba: 'fr-FR' };
  faqRecognition.lang = langMap[faqLang] || 'fr-FR';
  faqRecognition.continuous = false;
  faqRecognition.interimResults = true;
  faqRecognition.maxAlternatives = 1;

  faqRecognition.onstart = () => {
    faqIsRecording = true;
    const labels = langLabels[faqLang];
    document.getElementById('faqMicBtn').classList.add('recording');
    document.getElementById('faqMicBtn').textContent = '⏹️';
    const statusEl = document.getElementById('faqMicStatus');
    statusEl.textContent = labels.recording;
    statusEl.classList.add('recording');
    document.getElementById('faqFabBtn').classList.add('recording');
  };

  faqRecognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join('');
    
    const transcriptEl = document.getElementById('faqTranscript');
    transcriptEl.textContent = '🗣️ "' + transcript + '"';
    transcriptEl.classList.add('visible');
    
    // Si résultat final, envoyer automatiquement
    if (event.results[event.results.length - 1].isFinal) {
      document.getElementById('faqInput').value = transcript;
      stopMic();
      setTimeout(() => sendFaqQuestion(), 500);
    }
  };

  faqRecognition.onerror = (event) => {
    console.error('Mic error:', event.error);
    const statusEl = document.getElementById('faqMicStatus');
    const isLocalFile = location.protocol === 'file:';
    const isHttp = location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';

    if (event.error === 'not-allowed') {
      if (isLocalFile) {
        statusEl.textContent = '⚠️ Fichier local — lancez un serveur HTTP';
        showFaqNotice('🖥️ Vous ouvrez le fichier directement. Le micro nécessite un serveur. Lancez dans le terminal : python -m http.server 8080  puis ouvrez http://localhost:8080 dans le navigateur.');
      } else if (isHttp) {
        statusEl.textContent = '⚠️ HTTPS requis pour le micro';
        showFaqNotice('🔒 Le micro nécessite HTTPS. Déployez sur Netlify (gratuit) ou activez SSL Let\'s Encrypt sur Hostinger.');
      } else {
        statusEl.textContent = '⚠️ Permission micro refusée';
        showFaqNotice('🎙️ Cliquez sur l\'icône 🔒 dans la barre d\'adresse → Microphone → Autoriser, puis réessayez.');
      }
    } else if (event.error === 'no-speech') {
      statusEl.textContent = 'Aucune voix détectée — réessayez';
    } else if (event.error === 'network') {
      statusEl.textContent = 'Erreur réseau — vérifiez votre connexion';
    } else {
      statusEl.textContent = 'Erreur micro — utilisez la saisie texte';
    }
    statusEl.classList.remove('recording');
    resetMicUI();
  };

  faqRecognition.onend = () => {
    faqIsRecording = false;
    resetMicUI();
  };

  faqRecognition.start();
}

function stopMic() {
  if (faqRecognition) {
    faqRecognition.stop();
    faqRecognition = null;
  }
  faqIsRecording = false;
  resetMicUI();
}

function resetMicUI() {
  const labels = langLabels[faqLang];
  document.getElementById('faqMicBtn').classList.remove('recording');
  document.getElementById('faqMicBtn').textContent = '🎙️';
  const statusEl = document.getElementById('faqMicStatus');
  statusEl.textContent = labels.status;
  statusEl.classList.remove('recording');
  document.getElementById('faqFabBtn').classList.remove('recording');
}

function showFaqNotice(message) {
  // Afficher ou créer une notice dans le panneau FAQ
  let notice = document.getElementById('faqNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'faqNotice';
    notice.style.cssText = 'background:#FFF3CD;border:1px solid #F0C040;border-radius:10px;padding:12px 14px;font-size:13px;color:#7D6008;margin:10px 0;line-height:1.5;';
    const micZone = document.querySelector('.faq-mic-zone');
    if (micZone) micZone.insertAdjacentElement('afterend', notice);
  }
  notice.textContent = message;
  notice.style.display = 'block';
  // Auto-hide après 8 secondes
  setTimeout(() => { if (notice) notice.style.display = 'none'; }, 8000);
}

async function sendFaqQuestion() {
  const input = document.getElementById('faqInput');
  const question = input.value.trim();
  if (!question) return;
  
  // Masquer réponse précédente, montrer loader
  document.getElementById('faqResponse').classList.remove('visible');
  document.getElementById('faqLoader').classList.add('visible');
  
  // Construire le prompt avec instruction de langue
  const langInstructions = {
    fr: 'Réponds en français.',
    fon: 'Réponds en langue fon du Bénin. Si tu ne peux pas répondre parfaitement en fon, utilise un mélange fon-français compréhensible.',
    yoruba: 'Réponds en langue yoruba. Si difficile, mélange yoruba et français.',
    bariba: 'Réponds en langue bariba (baatonu) du Bénin. Si tu ne peux pas, réponds en français.',
    en: 'Reply in English.'
  };

  const prompt = `${langInstructions[faqLang]}

Question : "${question}"

${PROGRAMME_CONTEXT}`;

  try {
    if (ANTHROPIC_API_KEY === 'VOTRE_CLE_API_ICI') {
      // Mode démo sans API — réponse simulée
      await simulateApiDelay(1500);
      const demoResponse = getDemoResponse(question, faqLang);
      showFaqResponse(question, demoResponse);
    } else {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Erreur API');
      }

      const data = await response.json();
      const answer = data.content[0].text;
      showFaqResponse(question, answer);
    }
  } catch (err) {
    console.error('FAQ API error:', err);
    document.getElementById('faqLoader').classList.remove('visible');
    showFaqResponse(question, 
      faqLang === 'fr' 
        ? '⚠️ Erreur de connexion. Vérifiez votre clé API dans le fichier index.html (variable ANTHROPIC_API_KEY).'
        : '⚠️ Connection error. Check your API key.'
    );
  }

  input.value = '';
  document.getElementById('faqTranscript').classList.remove('visible');
}

function showFaqResponse(question, answer) {
  document.getElementById('faqLoader').classList.remove('visible');
  
  faqCurrentResponse = answer;
  document.getElementById('faqResponseText').textContent = answer;
  document.getElementById('faqResponse').classList.add('visible');
  
  // Mettre à jour le label du bouton écouter
  document.getElementById('faqSpeakBtn').textContent = langLabels[faqLang].speak;
  
  // Ajouter à l'historique (max 5 entrées)
  faqHistory.unshift({ q: question, a: answer, lang: faqLang });
  if (faqHistory.length > 5) faqHistory.pop();
  renderFaqHistory();
  
  // Auto-lecture si langue sélectionnée
  if (['fon', 'yoruba', 'bariba'].includes(faqLang)) {
    setTimeout(() => speakResponse(), 600);
  }
}

function speakResponse() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  
  const text = faqCurrentResponse;
  if (!text) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Langue de synthèse vocale
  const voiceLangMap = { fr: 'fr-FR', en: 'en-US', fon: 'fr-FR', yoruba: 'yo', bariba: 'fr-FR' };
  utterance.lang = voiceLangMap[faqLang] || 'fr-FR';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const btn = document.getElementById('faqSpeakBtn');
  btn.textContent = '⏸️ Lecture...';
  utterance.onend = () => { btn.textContent = langLabels[faqLang].speak; };
  utterance.onerror = () => { btn.textContent = langLabels[faqLang].speak; };

  window.speechSynthesis.speak(utterance);
}

function renderFaqHistory() {
  const histEl = document.getElementById('faqHistory');
  if (faqHistory.length <= 1) { histEl.innerHTML = ''; return; }
  
  // Afficher à partir du 2ème (le 1er est la réponse courante)
  const items = faqHistory.slice(1).map(item => `
    <div class="faq-history-item">
      <div class="faq-history-q">💬 ${item.q}</div>
      <div class="faq-history-a">${item.a}</div>
    </div>
  `).join('');
  histEl.innerHTML = '<div style="font-size:11px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Historique</div>' + items;
}

// Réponse démo sans API (pour tester l'interface)
function getDemoResponse(question, lang) {
  const demos = {
    fr: `⚡ Mode démo (sans clé API)

Sur le thème de votre question, le programme "Plus Loin, Ensemble" prévoit des mesures concrètes issues des 23 secteurs du projet 2026-2033. Pour obtenir des réponses dynamiques générées par IA, ajoutez votre clé API Anthropic dans la variable ANTHROPIC_API_KEY du fichier index.html.

→ console.anthropic.com pour obtenir votre clé ($5 suffisent pour commencer)`,
    fon: `⚡ Mode démo

Wadagni sín wema "Plus Loin, Ensemble" ɖó nǔ ɖaxó lɛ bló. API key sí bló nú xóɖiɖó vívɛ́. console.anthropic.com.`,
    en: `⚡ Demo mode (no API key)

The "Plus Loin, Ensemble" program covers 23 sectors for 2026-2033. Add your Anthropic API key in the ANTHROPIC_API_KEY variable to get real AI-powered answers.`
  };
  return demos[lang] || demos.fr;
}

function simulateApiDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Masquer le label FAB après 4 secondes
setTimeout(() => {
  const label = document.getElementById('faqFabLabel');
  if (label) {
    label.style.transition = 'opacity 0.5s';
    label.style.opacity = '0';
    setTimeout(() => label.style.display = 'none', 500);
  }
}, 4000);