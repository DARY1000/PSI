// netlify/functions/ask-claude.js
// Proxy sécurisé — la clé API Anthropic ne quitte jamais le serveur
// Variable d'environnement requise dans Netlify : ANTHROPIC_API_KEY

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Clé API non configurée — ajoutez ANTHROPIC_API_KEY dans les variables Netlify.' })
    };
  }

  try {
    const { question, langue } = JSON.parse(event.body || '{}');

    if (!question || !langue) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'question et langue requis' }) };
    }

    // Instructions par langue
    const langInstructions = {
      fr: 'Réponds en français.',
      fon: 'Réponds en langue fon du Bénin. Si tu ne peux pas répondre parfaitement en fon, utilise un mélange fon-français compréhensible.',
      yoruba: 'Réponds en langue yoruba. Si difficile, mélange yoruba et français.',
      bariba: 'Réponds en langue bariba (baatonu) du Bénin. Si tu ne peux pas, réponds en français.',
      en: 'Reply in English.'
    };

    const PROGRAMME_CONTEXT = `Tu es l'assistant officiel du programme présidentiel "Plus Loin, Ensemble" de Romuald Wadagni-Talata, candidat à l'élection présidentielle béninoise du 12 avril 2026.

Voici les points clés du programme 2026-2033 :

PRIORITÉ 1 — BIEN-ÊTRE SOCIAL
- SANTÉ : Urgences vitales gratuites (paiement différé), carnet de santé digital, CHIP Parakou, télémédecine et IA, pharmacopée traditionnelle modernisée
- PROTECTION SOCIALE : Plateforme nationale de prestations sociales, registre national des ménages, SAMU social national
- ÉDUCATION : 9000 salles de classe, taux CEP 42%→89%, cantines 100% écoles, gratuité secondaire filles, Sèmè City Hubs, télé-enseignement
- EAU POTABLE : Programme "Eau pour tous", 314 nouveaux systèmes, abonnement 10 000 FCFA
- SPORTS : Infrastructure dans les 546 arrondissements, bourses sportives

PRIORITÉ 2 — ÉCONOMIE DIVERSIFIÉE
- AGRICULTURE : Assurance récolte + retraite agricole, tripler rendements, agritech (drones, IA), Bénin 1er producteur africain de coton (641 000 tonnes)
- INDUSTRIE : GDIZ Glo-Djigbé (20 000 emplois), fonds développement industriel
- ÉNERGIE : Accès électricité 30%→61%, +100 MW tous les 2 ans, barrage Dogo-Bis (128 MW)
- INCLUSION FINANCIÈRE : Crédit digital 48h (50 000 à 50 millions FCFA), Bénin 1er UEMOA inclusion financière
- ARTISANAT : Bases d'appui dans chaque commune, ateliers d'excellence, crédit ARCH Artisan
- TOURISME : 2,5 millions visiteurs/an d'ici 2033, Parc Monts Kouffè-Wari Maro

PRIORITÉ 3 — COHÉSION NATIONALE
- SÉCURITÉ : +5600 agents Police républicaine, drones frontières, Programme Engagement Civique
- FINANCES : Croissance 8%, budget 1200→3500 milliards FCFA, notation S&P BB-
- TECHNOLOGIE : Bénin exportateur de solutions tech, IA Factory, Super App IA gouvernementale

6 PÔLES DE DÉVELOPPEMENT TERRITORIAL :
Atlantique-Littoral, Ouémé-Plateau, Zou-Collines, Mono-Couffo, Borgou-Alibori, Atacora-Donga

RÈGLES : Réponds en 3-5 phrases max. Cite des chiffres réels. Reste factuel. Si hors programme, dis-le poliment.`;

    const prompt = `${langInstructions[langue] || langInstructions.fr}

Question : "${question}"

${PROGRAMME_CONTEXT}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
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
      console.error('Anthropic API error:', err);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Erreur API Claude — réessayez dans un moment.' })
      };
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };

  } catch (err) {
    console.error('ask-claude error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur — réessayez.' })
    };
  }
};
