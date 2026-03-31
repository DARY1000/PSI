// netlify/functions/admin-data.js
// Expose les données agrégées pour le back-office admin
// Protégé par mot de passe via variable d'environnement ADMIN_PASSWORD

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Vérification mot de passe admin
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wadagni2026admin';

  if (token !== ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Non autorisé' })
    };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Retourner des données de démo si pas de DB configurée
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(getDemoData())
    };
  }

  try {
    const supabaseHeaders = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };

    // Récupérer toutes les données en parallèle
    const [visitsRes, resultsRes, questionsRes, sharesRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/visits?select=*&order=created_at.desc&limit=500`, { headers: supabaseHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/results?select=*&order=created_at.desc&limit=500`, { headers: supabaseHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/questions?select=*&order=created_at.desc&limit=200`, { headers: supabaseHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/shares?select=*&order=created_at.desc&limit=200`, { headers: supabaseHeaders })
    ]);

    const [visits, results, questions, shares] = await Promise.all([
      visitsRes.json(),
      resultsRes.json(),
      questionsRes.json(),
      sharesRes.json()
    ]);

    // Agréger les données
    const regionCount = {};
    const profilCount = {};
    const questionCount = {};
    const langueCount = {};

    (results || []).forEach(r => {
      regionCount[r.region] = (regionCount[r.region] || 0) + 1;
      profilCount[r.profil] = (profilCount[r.profil] || 0) + 1;
    });

    (questions || []).forEach(q => {
      const text = q.question?.toLowerCase().trim();
      if (text) questionCount[text] = (questionCount[text] || 0) + 1;
      langueCount[q.langue_reponse] = (langueCount[q.langue_reponse] || 0) + 1;
    });

    // Top questions (triées par fréquence)
    const topQuestions = Object.entries(questionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([q, count]) => ({ question: q, count }));

    // Visites par jour (7 derniers jours)
    const visitsByDay = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      visitsByDay[d.toISOString().substr(0, 10)] = 0;
    }
    (visits || []).forEach(v => {
      const day = v.created_at?.substr(0, 10);
      if (day && visitsByDay[day] !== undefined) visitsByDay[day]++;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totals: {
          visits: (visits || []).length,
          results_generated: (results || []).length,
          questions_asked: (questions || []).length,
          shares: (shares || []).length
        },
        top_regions: Object.entries(regionCount).sort((a, b) => b[1] - a[1]).map(([r, c]) => ({ region: r, count: c })),
        top_profils: Object.entries(profilCount).sort((a, b) => b[1] - a[1]).map(([p, c]) => ({ profil: p, count: c })),
        top_questions: topQuestions,
        langue_faq: Object.entries(langueCount).sort((a, b) => b[1] - a[1]).map(([l, c]) => ({ langue: l, count: c })),
        visits_by_day: Object.entries(visitsByDay).map(([d, c]) => ({ date: d, count: c })),
        recent_questions: (questions || []).slice(0, 30).map(q => ({
          question: q.question,
          langue: q.langue_reponse,
          date: q.created_at?.substr(0, 10)
        })),
        updated_at: new Date().toISOString()
      })
    };

  } catch (err) {
    console.error('Admin data error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

function getDemoData() {
  return {
    totals: { visits: 247, results_generated: 189, questions_asked: 43, shares: 67 },
    top_regions: [
      { region: 'Atlantique-Littoral', count: 89 },
      { region: 'Borgou-Alibori', count: 34 },
      { region: 'Ouémé-Plateau', count: 28 },
      { region: 'Zou-Collines', count: 21 },
      { region: 'Mono-Couffo', count: 11 },
      { region: 'Atacora-Donga', count: 6 }
    ],
    top_profils: [
      { profil: 'jeune', count: 67 },
      { profil: 'agriculteur', count: 34 },
      { profil: 'entrepreneur', count: 31 },
      { profil: 'mere', count: 22 },
      { profil: 'commercant', count: 18 }
    ],
    top_questions: [
      { question: 'que prévoit wadagni pour les jeunes ?', count: 8 },
      { question: 'comment obtenir le crédit en 48h ?', count: 6 },
      { question: 'quand sera construit le chip parakou ?', count: 5 },
      { question: 'q\'est-ce que la gdiz ?', count: 4 }
    ],
    langue_faq: [
      { langue: 'fr', count: 38 },
      { langue: 'fon', count: 3 },
      { langue: 'yoruba', count: 2 }
    ],
    visits_by_day: [
      { date: '2026-03-25', count: 12 },
      { date: '2026-03-26', count: 28 },
      { date: '2026-03-27', count: 45 },
      { date: '2026-03-28', count: 67 },
      { date: '2026-03-29', count: 52 },
      { date: '2026-03-30', count: 34 },
      { date: '2026-03-31', count: 9 }
    ],
    recent_questions: [
      { question: 'Que prévoit Wadagni pour les agriculteurs ?', langue: 'fr', date: '2026-03-31' },
      { question: 'Credit 48h comment ça marche ?', langue: 'fr', date: '2026-03-31' }
    ],
    updated_at: new Date().toISOString(),
    mode: 'demo'
  };
}
