// netlify/functions/admin-data.js

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Auth
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim();

  if (!ADMIN_PASSWORD || token !== ADMIN_PASSWORD) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Non autorisé' }) };
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

  console.log('URL:', JSON.stringify(SUPABASE_URL));
  console.log('KEY length:', SUPABASE_KEY.length);

  // Pas de Supabase → données démo
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify(getDemoData()) };
  }

  const sbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json'
  };

  try {
    const [vRes, rRes, qRes, sRes] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/visits?select=id', { headers: sbHeaders }),
      fetch(SUPABASE_URL + '/rest/v1/results?select=id', { headers: sbHeaders }),
      fetch(SUPABASE_URL + '/rest/v1/questions?select=id', { headers: sbHeaders }),
      fetch(SUPABASE_URL + '/rest/v1/shares?select=id', { headers: sbHeaders })
    ]);

    if (!vRes.ok) {
      const errText = await vRes.text();
      console.error('Supabase error:', vRes.status, errText);
      // Retourner démo avec message d erreur
      return { statusCode: 200, headers, body: JSON.stringify({
        ...getDemoData(),
        mode: 'error',
        debug: 'Supabase ' + vRes.status + ': ' + errText.substring(0, 100)
      })};
    }

    const [visits, results, questions, shares] = await Promise.all([
      vRes.json(), rRes.json(), qRes.json(), sRes.json()
    ]);

    const [rDetail, qDetail] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/results?select=profil,region,created_at&order=created_at.desc&limit=500', { headers: sbHeaders }).then(r => r.json()),
      fetch(SUPABASE_URL + '/rest/v1/questions?select=question,langue_reponse,created_at&order=created_at.desc&limit=200', { headers: sbHeaders }).then(r => r.json())
    ]);

    const regionCount = {}, profilCount = {}, questionCount = {}, langueCount = {};

    (Array.isArray(rDetail) ? rDetail : []).forEach(r => {
      if (r.region) regionCount[r.region] = (regionCount[r.region] || 0) + 1;
      if (r.profil) profilCount[r.profil] = (profilCount[r.profil] || 0) + 1;
    });

    (Array.isArray(qDetail) ? qDetail : []).forEach(q => {
      const text = (q.question || '').toLowerCase().trim().substring(0, 100);
      if (text) questionCount[text] = (questionCount[text] || 0) + 1;
      const lang = q.langue_reponse || 'fr';
      langueCount[lang] = (langueCount[lang] || 0) + 1;
    });

    const visitsByDay = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      visitsByDay[d.toISOString().substr(0, 10)] = 0;
    }
    (Array.isArray(visits) ? visits : []).forEach(v => {
      const day = (v.created_at || '').substr(0, 10);
      if (day && visitsByDay[day] !== undefined) visitsByDay[day]++;
    });

    return { statusCode: 200, headers, body: JSON.stringify({
      mode: 'live',
      totals: {
        visits: Array.isArray(visits) ? visits.length : 0,
        results_generated: Array.isArray(results) ? results.length : 0,
        questions_asked: Array.isArray(questions) ? questions.length : 0,
        shares: Array.isArray(shares) ? shares.length : 0
      },
      top_regions: Object.entries(regionCount).sort((a,b)=>b[1]-a[1]).map(([r,c])=>({region:r,count:c})),
      top_profils: Object.entries(profilCount).sort((a,b)=>b[1]-a[1]).map(([p,c])=>({profil:p,count:c})),
      top_questions: Object.entries(questionCount).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([q,c])=>({question:q,count:c})),
      langue_faq: Object.entries(langueCount).sort((a,b)=>b[1]-a[1]).map(([l,c])=>({langue:l,count:c})),
      visits_by_day: Object.entries(visitsByDay).map(([d,c])=>({date:d,count:c})),
      recent_questions: (Array.isArray(qDetail) ? qDetail : []).slice(0,30).map(q=>({
        question: q.question, langue: q.langue_reponse, date: (q.created_at||'').substr(0,10)
      })),
      updated_at: new Date().toISOString()
    })};

  } catch (err) {
    console.error('Exception:', err.message);
    return { statusCode: 200, headers, body: JSON.stringify({
      ...getDemoData(), mode: 'exception', debug: err.message
    })};
  }
};

function getDemoData() {
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().substr(0,10), count: 0 });
  }
  return {
    mode: 'demo',
    totals: { visits: 0, results_generated: 0, questions_asked: 0, shares: 0 },
    top_regions: [], top_profils: [], top_questions: [], langue_faq: [],
    visits_by_day: days, recent_questions: [],
    updated_at: new Date().toISOString()
  };
}
