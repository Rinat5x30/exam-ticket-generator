# 🚀 Развертывание на хостинге

## Быстрый старт

### Рекомендуемые хостинги:
1. **Vercel** (best for Next.js)
2. **Netlify**
3. **AWS Amplify**
4. **Self-hosted на VPS**

---

## Вариант 1: Vercel (Рекомендуется)

### Шаг 1: Подготовка
```bash
git add .
git commit -m "Security improvements"
git push origin main
```

### Шаг 2: Развертывание
1. Перейти на https://vercel.com
2. Нажать "New Project"
3. Выбрать репозиторий `exam-ticket-generator`
4. Vercel автоматически обнаружит Next.js
5. Нажать "Deploy"

### Шаг 3: Домен (опционально)
```
Settings → Domains → Add Domain
```

**Преимущества Vercel:**
- ✅ Автоматический HTTPS
- ✅ Автоматические обновления из GitHub
- ✅ DDoS protection
- ✅ CDN глобально
- ✅ Бесплатная tier достаточна

---

## Вариант 2: Netlify

### Шаг 1: Подготовка
```bash
npm run build
```

### Шаг 2: Развертывание
1. Перейти на https://netlify.com
2. Нажать "Add new site"
3. "Import an existing project"
4. Выбрать GitHub репозиторий
5. Build command: `npm run build`
6. Publish directory: `.next`

### Шаг 3: Deploy
Нажать "Deploy site"

---

## Вариант 3: Собственный VPS

### Требования:
- Node.js 18+
- npm или yarn
- nginx или Apache для reverse proxy
- SSL сертификат (Let's Encrypt бесплатно)

### Установка:

```bash
# 1. Подключитесь к серверу
ssh root@your-server.com

# 2. Обновите систему
apt update && apt upgrade -y

# 3. Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 4. Установите PM2 для управления процессом
npm install -g pm2

# 5. Клонируйте репозиторий
cd /var/www
git clone https://github.com/Rinat5x30/exam-ticket-generator.git
cd exam-ticket-generator

# 6. Установите зависимости
npm install

# 7. Создайте .env.local
cp .env.example .env.local
# Отредактируйте если нужно

# 8. Соберите проект
npm run build

# 9. Запустите с PM2
pm2 start npm --name "exam-generator" -- start
pm2 startup
pm2 save

# 10. Установите nginx
apt install -y nginx

# 11. Создайте конфиг nginx
cat > /etc/nginx/sites-available/exam-generator << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL параметры
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers (проверяйте что совпадают с next.config.js)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 12. Активируйте конфиг
ln -s /etc/nginx/sites-available/exam-generator /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 13. Установите Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot certonly --nginx -d your-domain.com

# 14. Автоматическое обновление сертификата
certbot renew --dry-run

# 15. Готово! Посетите https://your-domain.com
```

### Автоматические обновления из GitHub:

Создайте webhook на сервере:

```bash
cat > /home/deploy.sh << 'EOF'
#!/bin/bash

cd /var/www/exam-ticket-generator
git pull origin main
npm install
npm run build
pm2 restart exam-generator

echo "Deploy completed at $(date)" >> /var/log/deploy.log
EOF

chmod +x /home/deploy.sh
```

Затем на GitHub: **Settings → Webhooks → Add webhook**
- Payload URL: `https://your-domain.com/api/webhook`
- Content type: `application/json`
- Events: `push`

---

## Мониторинг

### Проверьте здоровье приложения:

```bash
# 1. Проверьте что процесс запущен
pm2 status

# 2. Посмотрите логи
pm2 logs exam-generator

# 3. Проверьте статус SSL
curl -I https://your-domain.com

# 4. Проверьте security headers
curl -I https://your-domain.com | grep -E "X-|Content-Security"
```

### Настройте мониторинг:

```bash
# Установите UptimeRobot (бесплатно)
# https://uptimerobot.com
# Добавьте https://your-domain.com в мониторинг
```

---

## Обновления и обслуживание

### Еженедельно:
```bash
# Проверьте обновления
npm audit

# Обновите при необходимости
npm update
npm audit fix
```

### Ежемесячно:
```bash
# Обновите систему
apt update && apt upgrade -y

# Проверьте статус сертификата
certbot certificates

# Перезагрузитесь если нужны обновления ядра
```

### Ежегодно:
```bash
# Обновите Node.js (если вышла новая LTS версия)
# Перестройте и протестируйте приложение
npm run build
npm start
```

---

## Обмен данных между локальной и хостингом

### Экспорт с локального:
```bash
# На локальном компьютере
1. Откройте приложение
2. Перейдите на страницу вопросов
3. Нажмите "Экспорт JSON"
4. Сохраните файл
```

### Импорт на хостинге:
```bash
# На хостинге
1. Откройте https://your-domain.com/questions
2. Нажмите "Импорт JSON"
3. Выберите сохраненный файл
4. Done! ✓
```

---

## Troubleshooting

### Приложение не загружается

```bash
# Проверьте логи
pm2 logs exam-generator

# Перезагрузите
pm2 restart exam-generator

# Если ошибка в build, пересоберите
npm run build
pm2 restart exam-generator
```

### SSL ошибка

```bash
# Проверьте сертификат
certbot certificates

# Обновите если нужно
certbot renew --force-renewal

# Перезагрузите nginx
systemctl restart nginx
```

### Медленная загрузка

```bash
# Проверьте памяти на сервере
free -h

# Если мало памяти, увеличьте swap:
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

---

## Безопасность хостинга

### Firewall:

```bash
# Установите UFW
apt install -y ufw

# Разрешите SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Включите firewall
ufw enable
```

### Регулярные резервные копии:

```bash
# Скрипт резервной копии
cat > /home/backup.sh << 'EOF'
#!/bin/bash
tar -czf /backups/exam-generator-$(date +%Y%m%d).tar.gz \
  /var/www/exam-ticket-generator

# Удалите старые резервные копии
find /backups -name "*.tar.gz" -mtime +30 -delete
EOF

# Добавьте в crontab
crontab -e
# 0 2 * * * /home/backup.sh  # Каждый день в 2:00 AM
```

---

## Готово! 🎉

Ваше приложение теперь на production. Поздравляем!

**Для любых вопросов - консультируйтесь с документацией:**
- [Next.js deployment](https://nextjs.org/docs/deployment)
- [Vercel docs](https://vercel.com/docs)
- [Netlify docs](https://docs.netlify.com)
