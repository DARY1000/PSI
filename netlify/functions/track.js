// netlify/functions/track.js
// Reçoit les événements du simulateur et les stocke dans Supabase
// Variables d'environnement requises dans Netlify :
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_ANON_KEY=eyJhbGci...

exports.handler = async (event, context) => {
  // CORS
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

  try {
    const data = JSON.parse(event.body || '{}');
    const { event_type, session_id, timestamp } = data;

    if (!event_type || !session_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // Si pas configuré, ignorer silencieusement
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, mode: 'no-db' }) };
    }

    // Choisir la table selon le type d'événement
    let table, payload;

    if (event_type === 'page_view') {
      table = 'visits';
      payload = {
        session_id,
        referrer: data.referrer || 'direct',
        langue_navigateur: data.langue_navigateur || 'fr',
        screen: data.screen || '',
        created_at: timestamp
      };

    } else if (event_type === 'generate_result') {
      table = 'results';
      payload = {
        session_id,
        profil: data.profil || 'unknown',
        region: data.region || 'unknown',
        concerns: data.concerns || '',
        created_at: timestamp
      };

    } else if (event_type === 'faq_question') {
      table = 'questions';
      payload = {
        session_id,
        question: data.question || '',
        langue_reponse: data.langue_reponse || 'fr',
        created_at: timestamp
      };

    } else if (event_type === 'share_whatsapp') {
      table = 'shares';
      payload = {
        session_id,
        profil: data.profil || 'unknown',
        region: data.region || 'unknown',
        created_at: timestamp
      };

    } else if (event_type === 'session_end') {
      table = 'sessions';
      payload = {
        session_id,
        duration_seconds: data.duration_seconds || 0,
        created_at: timestamp
      };

    } else {
      // Événement générique (select_profil, select_region, etc.)
      table = 'events';
      payload = {
        session_id,
        event_type,
        payload: JSON.stringify(data),
        created_at: timestamp
      };
    }

    // Insérer dans Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`Supabase error [${table}]:`, err);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, warning: 'db_error' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error('Track function error:', err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, warning: 'exception' }) };
  }
};
