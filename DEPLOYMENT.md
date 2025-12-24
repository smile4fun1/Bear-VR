# 🌐 Deployment Guide

Deploy Servi VR to production.

---

## ⚠️ Important: WebSocket Limitations

**Vercel Serverless** has limitations with WebSocket connections needed for Socket.io multi-user features.

**Recommended platforms**:
- ✅ **Railway.app** (easiest, supports WebSocket)
- ✅ **Heroku**
- ✅ **DigitalOcean App Platform**
- ✅ **AWS EC2** (most control)
- ⚠️ **Vercel** (static only, Socket.io won't work in production)

---

## 🚂 Deploy to Railway (Recommended)

Railway automatically detects Next.js and handles WebSocket correctly.

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repo
   - Railway auto-detects Next.js ✅

3. **Configure**
   - Railway sets `PORT` automatically
   - Add environment variables if needed
   - Click "Deploy"

4. **Get URL**
   - Railway generates URL: `your-app.railway.app`
   - Access from Quest 3: `https://your-app.railway.app`

**Done!** 🎉

---

## 🟣 Deploy to Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create `Procfile`**
```
web: npm run start
```

2. **Deploy**
```bash
heroku login
heroku create servi-vr
git push heroku main
```

3. **Set Config**
```bash
heroku config:set NODE_ENV=production
```

4. **Open**
```bash
heroku open
```

---

## 🔵 Deploy to DigitalOcean

### Using App Platform

1. Connect GitHub repo
2. Select "Node.js" app type
3. Build command: `npm run build`
4. Run command: `npm run start`
5. Deploy

### Using Droplet (VM)

```bash
# SSH into droplet
ssh root@YOUR_IP

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Clone repo
git clone YOUR_REPO_URL
cd servi-vr

# Install and build
npm install
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "servi-vr" -- start
pm2 save
pm2 startup

# Configure Nginx (optional)
apt install nginx
# ... nginx config for reverse proxy
```

---

## 🟠 Deploy to AWS EC2

### Launch Instance

1. Ubuntu 22.04 LTS
2. t3.medium or larger
3. Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (app)

### Setup

```bash
# SSH to instance
ssh -i your-key.pem ubuntu@ec2-xxx.compute.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install git

# Clone repo
git clone YOUR_REPO_URL
cd servi-vr

# Install dependencies
npm install

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start app
pm2 start npm --name "servi-vr" -- start

# Save PM2 config
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/servi-vr
```

**Nginx config**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/servi-vr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🟢 Deploy to Vercel (Static Only)

⚠️ **Socket.io multi-user won't work on Vercel**. Use for demo/static version only.

### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts**
   - Link to project
   - Set build settings
   - Deploy

**Note**: You'll need to remove Socket.io functionality or use external WebSocket service.

---

## 🔒 HTTPS for Quest 3

WebXR **requires HTTPS** (or localhost). All platforms above provide automatic HTTPS:

- ✅ Railway: Auto HTTPS
- ✅ Heroku: Auto HTTPS  
- ✅ DigitalOcean: Auto HTTPS on App Platform
- ✅ AWS: Use Let's Encrypt (see above)
- ✅ Vercel: Auto HTTPS

---

## 📊 Performance Monitoring

### Add Analytics

Install Vercel Analytics:
```bash
npm install @vercel/analytics
```

Edit `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitor with PM2

```bash
pm2 monit
pm2 logs servi-vr
```

---

## 🔄 Continuous Deployment

### GitHub Actions (for Railway/Heroku)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      # Add your deploy command here
```

---

## 🧪 Testing Before Deploy

```bash
# Build production version locally
npm run build

# Test production build
NODE_ENV=production npm run start

# Open http://localhost:3000
# Test all features in VR
```

---

## 📦 Environment Variables

Set these on your platform:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3000` (or platform default) | No |
| `NEXT_PUBLIC_ROS_WS_URL` | `ws://your-robot:9090` | No |

---

## 🔧 Post-Deployment Checklist

- [ ] HTTPS working
- [ ] WebXR detected on Quest 3
- [ ] Socket.io connections working
- [ ] Multi-user collaboration tested
- [ ] 3D model loads correctly
- [ ] Terminal commands work
- [ ] Annotations persist across users
- [ ] Performance is smooth (60+ FPS)
- [ ] Mobile browser fallback works

---

## 🐛 Troubleshooting

**Socket.io not connecting in production**
- Check WebSocket support on platform
- Verify firewall rules
- Check server logs
- Test with `wscat -c wss://your-domain.com/api/socket`

**VR mode not working**
- Ensure HTTPS is enabled
- Check SSL certificate is valid
- Verify WebXR API support
- Test on Quest Browser (not Firefox/Chrome)

**Slow performance**
- Enable gzip compression
- Use CDN for static assets
- Optimize 3D model (use Draco compression)
- Reduce polygon count

**Build fails**
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check Node.js version (20+)
- Verify all dependencies in package.json

---

## 💰 Cost Estimates

| Platform | Free Tier | Paid |
|----------|-----------|------|
| Railway | $5 credit/month | ~$10-20/month |
| Heroku | No free tier | $7/month (Eco) |
| DigitalOcean | $200 credit (60 days) | $12/month (App) |
| AWS EC2 | 750 hrs/month (1 year) | ~$15/month (t3.medium) |
| Vercel | Yes (no Socket.io) | $20/month (Pro) |

**Recommendation**: Start with Railway free credit, then upgrade to paid if needed.

---

## 🚀 Scaling

For production with many concurrent users:

1. **Use Redis for Socket.io** (session sharing)
2. **Add load balancer**
3. **Use CDN** for static assets
4. **Database** for persistent annotations/maps
5. **Monitoring** with DataDog or New Relic

---

**Questions?** Open an issue or check the main [README.md](./README.md)!

