import fetch from 'node-fetch';

// В Netlify Environment Variables:
//   AMO_SUBDOMAIN — ваш поддомен, например getmotorx
//   AMO_TOKEN     — ваш токен доступа

export async function handler(event) {
  const { path, httpMethod, queryStringParameters } = event;
  // path: "/.netlify/functions/amocrm-proxy/leads"
  // извлечь часть после имени функции:
  const apiPath = event.path.replace(/^\/api\/amocrm\//, ''); // "leads"
  // Собрать URL к amoCRM:
  const qs = event.rawQuery || '';
  const url = `https://${process.env.AMO_SUBDOMAIN}.amocrm.ru/api/v4/${apiPath}${qs ? `?${qs}` : ''}`;

  try {
    const apiRes = await fetch(url, {
      method: httpMethod,
      headers: {
        'Authorization': `Bearer ${process.env.AMO_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const text = await apiRes.text();
    return {
      statusCode: apiRes.status,
      headers: {
        'Content-Type': apiRes.headers.get('content-type'),
        // разрешить фронту обращаться к функции
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type'
      },
      body: text
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Proxy error' })
    };
  }
}