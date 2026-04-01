/* Wadagni Simulateur — FAQ Vocale Intelligente
 * Nécessite une clé API Anthropic : console.anthropic.com
 * La clé API est gérée côté serveur via Netlify Functions
 */

// ============================================
// FAQ VOCALE INTELLIGENTE — Module complet
// ============================================

// Clé API Anthropic — À remplacer par votre clé
// Pour obtenir : console.anthropic.com → API Keys
// Clé API gérée côté serveur via Netlify Function — ne jamais mettre de clé ici

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

// Contexte programme géré côté serveur dans netlify/functions/ask-claude.js

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
  showFaqNotice('🎙️ La reconnaissance vocale sera disponible prochainement. Utilisez la saisie texte ci-dessous.');
}

function startMic() {
  showFaqNotice('🎙️ La reconnaissance vocale sera disponible prochainement. Utilisez la saisie texte ci-dessous.');
  return;
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
  console.log('[FAQ] Envoi question vers /.netlify/functions/ask-claude :', question, 'langue:', faqLang);
  
  // Masquer réponse précédente, montrer loader
  document.getElementById('faqResponse').classList.remove('visible');
  document.getElementById('faqLoader').classList.add('visible');
  
  // Construire le prompt avec instruction de langue
  // Instructions de langue et prompt gérés côté serveur

  try {
    // Appel sécurisé via Netlify Function (clé API côté serveur uniquement)
    const response = await fetch('/.netlify/functions/ask-claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, langue: faqLang })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur serveur');
    }

    const data = await response.json();

    if (data.answer) {
      showFaqResponse(question, data.answer);
    } else if (data.error) {
      showFaqResponse(question, '⚠️ Erreur serveur : ' + data.error);
    } else {
      showFaqResponse(question, '⚠️ Réponse vide reçue du serveur.');
    }
  } catch (err) {
    console.error('FAQ API error:', err);
    document.getElementById('faqLoader').classList.remove('visible');
    showFaqResponse(question, '⚠️ Erreur : ' + (err.message || 'connexion impossible') + '. Vérifiez que le site est déployé sur Netlify avec la variable ANTHROPIC_API_KEY configurée.');
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



// Bouton FAB visible
setTimeout(() => {
  const label = document.getElementById('faqFabLabel');
  if (label) {
    label.style.transition = 'opacity 0.5s';
    label.style.opacity = '0';
    setTimeout(() => label.style.display = 'none', 500);
  }
}, 4000);