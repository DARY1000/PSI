/* Wadagni Simulateur — Tracking anonyme
 * Mainteneur : Armel Kouandi DARI — iCODE Cotonou
 */

(function() {
  const sessionId = Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
  const startTime = Date.now();

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

  // Helpers pour lire les sélections depuis le DOM
  function getSelectedProfil() {
    const card = document.querySelector('.profil-card.selected');
    return card ? card.dataset.profil : 'unknown';
  }
  function getSelectedRegion() {
    const card = document.querySelector('.region-card.selected');
    return card ? card.dataset.region : 'unknown';
  }
  function getSelectedConcerns() {
    return Array.from(document.querySelectorAll('.concern-chip.selected'))
      .map(c => c.textContent.trim()).join(',');
  }

  // === VISITE ===
  track('page_view', {
    referrer: document.referrer || 'direct',
    langue_navigateur: navigator.language || 'fr',
    screen: screen.width + 'x' + screen.height
  });

  // === CLICS sur les cartes — écoute directe sur le document ===
  document.addEventListener('click', function(e) {
    const profilCard = e.target.closest('.profil-card');
    if (profilCard) {
      track('select_profil', { profil: profilCard.dataset.profil });
    }

    const regionCard = e.target.closest('.region-card');
    if (regionCard) {
      track('select_region', { region: regionCard.dataset.region });
    }

    // Bouton générer résultat
    const genBtn = e.target.closest('#genBtn');
    if (genBtn) {
      setTimeout(() => {
        track('generate_result', {
          profil: getSelectedProfil(),
          region: getSelectedRegion(),
          concerns: getSelectedConcerns()
        });
      }, 100);
    }

    // Bouton partage WhatsApp
    const shareBtn = e.target.closest('.btn-share');
    if (shareBtn) {
      track('share_whatsapp', {
        profil: getSelectedProfil(),
        region: getSelectedRegion()
      });
    }

    // Bouton envoyer FAQ
    const sendBtn = e.target.closest('.faq-send-btn');
    if (sendBtn) {
      setTimeout(() => {
        const input = document.getElementById('faqInput');
        const question = input ? input.value.trim() : '';
        const langue = window.faqLang || 'fr';
        if (question) {
          track('faq_question', {
            question: question.substring(0, 200),
            langue_reponse: langue
          });
        }
      }, 50);
    }
  });

  // Touche Entrée dans la FAQ
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('faqInput');
      if (document.activeElement === input && input.value.trim()) {
        track('faq_question', {
          question: input.value.trim().substring(0, 200),
          langue_reponse: window.faqLang || 'fr'
        });
      }
    }
  });

  // === FIN DE SESSION ===
  window.addEventListener('beforeunload', () => {
    navigator.sendBeacon('/.netlify/functions/track', JSON.stringify({
      event_type: 'session_end',
      session_id: sessionId,
      duration_seconds: Math.round((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString()
    }));
  });

})();
