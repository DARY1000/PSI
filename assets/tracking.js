/* Wadagni Simulateur — Tracking anonyme des visites
 * Envoie les événements à Netlify Functions → Supabase
 * Mainteneur : Armel Kouandi DARI — iCODE Cotonou
 */

(function() {
  const sessionId = Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
  const startTime = Date.now();

  // === FONCTION D'ENVOI ===
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
    } catch (e) {}
  }

  // === VISITE ===
  track('page_view', {
    referrer: document.referrer || 'direct',
    langue_navigateur: navigator.language || 'fr',
    screen: screen.width + 'x' + screen.height
  });

  // === HOOKS — attendre que simulator.js soit chargé ===
  window.addEventListener('DOMContentLoaded', () => {

    // HOOK : SÉLECTION PROFIL
    const origSelectProfil = window.selectProfil;
    window.selectProfil = function(card) {
      track('select_profil', { profil: card.dataset.profil });
      if (origSelectProfil) origSelectProfil.call(this, card);
    };

    // HOOK : SÉLECTION RÉGION
    const origSelectRegion = window.selectRegion;
    window.selectRegion = function(card) {
      track('select_region', { region: card.dataset.region });
      if (origSelectRegion) origSelectRegion.call(this, card);
    };

    // HOOK : GÉNÉRATION RÉSULTAT
    const origGenerateResult = window.generateResult;
    window.generateResult = function() {
      track('generate_result', {
        profil: window.selProfil || 'unknown',
        region: window.selRegion || 'unknown',
        concerns: (window.selConcerns || []).join(',')
      });
      if (origGenerateResult) origGenerateResult.call(this);
    };

    // HOOK : PARTAGE WHATSAPP
    const origShareWhatsApp = window.shareWhatsApp;
    window.shareWhatsApp = function() {
      track('share_whatsapp', {
        profil: window.selProfil || 'unknown',
        region: window.selRegion || 'unknown'
      });
      if (origShareWhatsApp) origShareWhatsApp.call(this);
    };

    // HOOK : QUESTION FAQ
    const origSendFaqQuestion = window.sendFaqQuestion;
    window.sendFaqQuestion = function() {
      const input = document.getElementById('faqInput');
      const question = input ? input.value.trim() : '';
      const langue = window.faqLang || 'fr';
      if (question) {
        track('faq_question', {
          question: question.substring(0, 200),
          langue_reponse: langue
        });
      }
      if (origSendFaqQuestion) origSendFaqQuestion.call(this);
    };

  });

  // === FIN DE SESSION ===
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    navigator.sendBeacon('/.netlify/functions/track', JSON.stringify({
      event_type: 'session_end',
      session_id: sessionId,
      duration_seconds: duration,
      timestamp: new Date().toISOString()
    }));
  });

})();
