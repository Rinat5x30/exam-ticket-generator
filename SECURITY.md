# 🔒 Руководство по безопасности - Exam Ticket Generator

## Реализованные меры безопасности

### 1. **Валидация входных данных** ✅
- Максимальная длина текста вопроса: 5000 символов
- Максимум вопросов за раз: 1000
- Максимум вопросов всего: 10000
- Максимум размер импорта: 1MB
- Проверка формата и типов данных

### 2. **Защита от XSS (Cross-Site Scripting)** ✅
- Content Security Policy в заголовках
- Санитизация текста вопросов
- Удаление опасных HTML тегов и атрибутов
- Проверка на injection паттерны:
  - `<script>`, `javascript:`, event handlers
  - `<iframe>`, `<embed>`, `<object>`

### 3. **Security Headers** ✅
```
X-Content-Type-Options: nosniff        - Запрет угадывания типа контента
X-Frame-Options: DENY                   - Защита от Clickjacking
X-XSS-Protection: 1; mode=block         - Дополнительная XSS защита
Strict-Transport-Security: ...          - Принудительный HTTPS
Content-Security-Policy: ...            - Очень строгая CSP
Referrer-Policy: strict-no-referrer     - Скрытие referrer
Permissions-Policy: ...                 - Запрет на опасные API
```

### 4. **Защита от JSON injection** ✅
- Валидация структуры JSON
- Проверка обязательных полей
- Тип-чекинг всех данных
- Безопасный JSON.parse с try-catch

### 5. **Rate Limiting & DoS Protection** ✅
- Ограничение размера файла
- Ограничение количества вопросов
- Ограничение длины текста
- Проверка памяти localStorage

### 6. **Error Handling** ✅
- Подробные сообщения об ошибках без leak'а sensitive инфо
- Логирование в консоль для отладки
- User-friendly UI сообщения

---

## Настройки хостинга

### Рекомендации для production

#### 1. **HTTPS обязателен**
```bash
# В next.config.js уже стоит HSTS header
# Убедитесь что хостинг использует SSL/TLS
```

#### 2. **Environment переменные**
Создайте `.env.local`:
```env
# Не закоммитьте этот файл!
# Используется для production секретов
```

#### 3. **CSP для вашего домена**
Если используете внешние ресурсы:
```javascript
// next.config.js - обновите CSP если нужны внешние скрипты
"script-src 'self' https://trusted-cdn.com"
```

#### 4. **WAF (Web Application Firewall)**
На уровне хостинга рекомендуется:
- Cloudflare, AWS WAF, или другой WAF
- Блокировка известных attack patterns
- Rate limiting на уровне сервера

---

## Тестирование безопасности

### Проверьте эти сценарии:

#### 1. **XSS Protection**
```javascript
// Попробуйте добавить вопрос с:
"<script>alert('XSS')</script>"
"<img src=x onerror=alert('XSS')>"
"javascript:alert('XSS')"

// Результат: Текст очищается, скрипты не выполняются ✓
```

#### 2. **JSON Injection**
```javascript
// Попробуйте импортировать:
{
  "subject": "Хакинг",
  "text": "<script>alert('Hacked')</script>",
  "type": "malicious"
}

// Результат: Валидация отклонит неизвестный тип ✓
```

#### 3. **Large File Upload**
```javascript
// Попробуйте загрузить JSON > 1MB
// Результат: Ошибка "Файл слишком большой" ✓
```

#### 4. **Large Question Count**
```javascript
// Попробуйте импортировать > 1000 вопросов за раз
// Результат: Ошибка валидации ✓
```

---

## Мониторинг и обслуживание

### Что регулярно проверять:

1. **Security headers**
```bash
curl -I https://your-domain.com
# Проверьте наличие всех security headers
```

2. **Dependencies**
```bash
npm audit
npm audit fix
```

3. **Browser console errors**
```javascript
// В браузере: F12 -> Console
// Не должно быть ошибок или warning'ов
```

4. **Logs on hosting**
- Проверяйте логи ошибок
- Ищите необычную активность
- Мониторьте использование памяти/CPU

---

## Уязвимости и как их избежать

### ✅ Защищено в этом проекте:

| Уязвимость | Защита |
|-----------|--------|
| XSS | CSP + Sanitization |
| CSRF | Next.js built-in |
| SQL Injection | Нет БД (localStorage) |
| Command Injection | Нет shell commands |
| File Upload | Валидация + Size limit |
| DoS | Rate limiting + Size limits |
| Information Disclosure | Minimal error messages |

### ⚠️ Что НЕ защищено (frontend):

- **Брутфорс** - используйте backend
- **DDoS** - используйте Cloudflare/CDN
- **Session hijacking** - добавьте аутентификацию
- **Man-in-the-Middle** - убедитесь в HTTPS

---

## Для production deployment:

1. **Используйте managed hosting** (Vercel, Netlify, Heroku)
   - Автоматический HTTPS
   - DDoS protection
   - Security updates

2. **Включите 2FA на GitHub**
   - Settings → Account security → Two-factor authentication

3. **Регулярно обновляйте зависимости**
   ```bash
   npm update
   npm audit fix
   ```

4. **Включите branch protection на GitHub**
   - Settings → Branches → Add branch protection rule
   - Require pull request reviews
   - Require status checks

5. **Используйте environment secrets**
   - GitHub Actions secrets для API keys
   - Never commit sensitive data

---

## Ссылки для дальнейшего изучения:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web.dev - Security](https://web.dev/security/)
- [Next.js - Security](https://nextjs.org/docs/advanced-features/security)
- [MDN - Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Последнее обновление:** 12 мая 2026

Если у вас есть вопросы по безопасности - обращайтесь! 🔐
