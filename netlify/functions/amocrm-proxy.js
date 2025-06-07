import fetch from 'node-fetch';

export async function handler(event) {
  // 1) Логируем всё входящее
  console.log('--- New invocation ---');
  console.log('event.path           =', event.path);
  console.log('event.rawQuery       =', event.rawQuery);
  console.log('event.queryStringParameters =', event.queryStringParameters);

  // 2) Вырезаем apiPath точно по redirect’у из netlify.toml
  //    У вас from = "/api/amocrm/*" → :splat = "leads"
  const apiPath = event.path.replace(/^\/api\/amocrm\//, '');
  console.log('apiPath              =', apiPath);

  // 3) Собираем полный URL
  const qs = event.rawQuery || '';
  const url = `https://${process.env.AMO_SUBDOMAIN}.amocrm.ru/api/v4/${apiPath}${qs ? `?${qs}` : ''}`;
  console.log('Fetching URL         =', url);

  try {
    const apiRes = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${process.env.AMO_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('AmoCRM status        =', apiRes.status);
    const text = await apiRes.text();
    console.log('AmoCRM response body =', text);

    return {
      statusCode: apiRes.status,
      headers: {
        'Content-Type': apiRes.headers.get('content-type'),
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
      body: JSON.stringify({ error: 'Proxy error', message: error.message })
    };
  }
}
