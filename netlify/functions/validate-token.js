const crypto = require('crypto');

// Netlify автоматически подтянет CALC_SECRET_KEY из панели управления, которую мы настроили
const SECRET = process.env.CALC_SECRET_KEY;

exports.handler = async (event, context) => {
  // Разрешаем запросы только методом POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { token } = JSON.parse(event.body || '{}');
    
    if (!token) {
      return { 
        statusCode: 403, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Доступ запрещен: токен отсутствует' }) 
      };
    }

    // Разбиваем токен на полезную нагрузку и подпись
    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) {
      return { statusCode: 400, body: JSON.stringify({ valid: false, error: 'Неверный формат токена' }) };
    }

    // Декодируем payload из Base64 обратно в строку JSON
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    
    // Генерируем проверочную подпись на основе нашего SECRET
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(payloadStr)
      .digest('hex');
      
    // Если подписи не совпадают — токен подделан
    if (signature !== expectedSignature) {
      return { 
        statusCode: 403, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Критическая ошибка безопасности' }) 
      };
    }

    // Проверяем время "смерти" ссылки
    const { expiresAt } = JSON.parse(payloadStr);
    if (Date.now() > expiresAt) {
      return { 
        statusCode: 403, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false, error: 'Срок действия ссылки истек' }) 
      };
    }

    // Если всё отлично, возвращаем valid: true
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: true })
    };

  } catch (e) {
    return { 
      statusCode: 400, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: false, error: 'Не удалось обработать запрос' }) 
    };
  }
};