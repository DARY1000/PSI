/* Wadagni Simulateur — Tracking anonyme des visites
 * Envoie les événements à Netlify Functions → Supabase
 * Aucune donnée personnelle collectée (pas de nom, pas d'IP stockée)
 * Mainteneur : Armel Kouandi DARI — iCODE Cotonou
 */

(function() {
  // Générer un ID de session anonyme
  const sessionId = Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
  const startTime = Date.now();

  // Données de session
  const sessionData = {
    session_id: sessionId,
    referrer: document.referrer || 'direct',
    user_agent: navigator.userAgent.substring(0, 100),
    screen: `${screen.width}x${screen.height}`,
    langue_navigateur: navigator.language || 'fr',
    timestamp: new Date().toISOString()
  };

  // === FONCTION D'ENVOI PRINCIPALE ===
  async function track(event_type, payload = {}) {
    try {
      await fetch('/.netlify/functions/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type,
          session_id: sessionId,
          ...payload,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      // Silencieux en cas d'erreur (pas de console.error en prod)
    }
  }

  // === ÉVÉNEMENT : VISITE ===
  track('page_view', {
    referrer: sessionData.referrer,
    langue_navigateur: sessionData.langue_navigateur,
    screen: sessionData.screen
  });

  // === HOOK : SÉLECTION PROFIL ===
  const origSelectProfil = window.selectProfil;
  window.selectProfil = function(card) {
    track('select_profil', { profil: card.dataset.profil });
    if (origSelectProfil) origSelectProfil.call(this, card);
  };

  // === HOOK : SÉLECTION RÉGION ===
  const origSelectRegion = window.selectRegion;
  window.selectRegion = function(card) {
    track('select_region', { region: card.dataset.region });
    if (origSelectRegion) origSelectRegion.call(this, card);
  };

  // === HOOK : GÉNÉRATION RÉSULTAT ===
  const origGenerateResult = window.generateResult;
  window.generateResult = function() {
    track('generate_result', {
      profil: window.selProfil || 'unknown',
      region: window.selRegion || 'unknown',
      concerns: (window.selConcerns || []).join(',')
    });
    if (origGenerateResult) origGenerateResult.call(this);
  };

  // === HOOK : PARTAGE WHATSAPP ===
  const origShareWhatsApp = window.shareWhatsApp;
  window.shareWhatsApp = function() {
    track('share_whatsapp', {
      profil: window.selProfil || 'unknown',
      region: window.selRegion || 'unknown'
    });
    if (origShareWhatsApp) origShareWhatsApp.call(this);
  };

  // === HOOK : QUESTION FAQ ===
  const origSendFaqQuestion = window.sendFaqQuestion;
  window.sendFaqQuestion = function() {
    const input = document.getElementById('faqInput');
    const question = input ? input.value.trim() : '';
    const langue = window.faqLang || 'fr';
    if (question) {
      track('faq_question', {
        question: question.substring(0, 200), // Max 200 chars
        langue_reponse: langue
      });
    }
    if (origSendFaqQuestion) origSendFaqQuestion.call(this);
  };

  // === DURÉE DE SESSION (à la fermeture) ===
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    // Utiliser sendBeacon pour envoyer même si la page se ferme
    const payload = JSON.stringify({
      event_type: 'session_end',
      session_id: sessionId,
      duration_seconds: duration,
      timestamp: new Date().toISOString()
    });
    navigator.sendBeacon('/.netlify/functions/track', payload);
  });

})();
