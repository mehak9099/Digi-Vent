# Digi-Vent Deployment Guide

## 🚀 Quick Deployment

### Option 1: Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for automatic deployments

3. **Configure redirects**
   Create `public/_redirects` file:
   ```
   /*    /index.html   200
   ```

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/digi-vent",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
VITE_APP_NAME=Digi-Vent
VITE_API_URL=https://api.digi-vent.com
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn
```

## 📊 Performance Optimization

### Build Optimization
- Code splitting enabled
- Tree shaking for unused code
- Asset compression
- Image optimization

### Recommended Settings
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] CSRF protection implemented

## 📱 PWA Configuration

The app is PWA-ready. To enable:

1. **Add manifest.json**
2. **Configure service worker**
3. **Enable offline functionality**

## 🌐 Domain Configuration

### Custom Domain Setup
1. Purchase domain from registrar
2. Configure DNS settings
3. Update deployment platform settings
4. Enable SSL certificate

## 📈 Monitoring & Analytics

### Recommended Tools
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring
- **Lighthouse CI**: Performance monitoring
- **Uptime Robot**: Availability monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Routing Issues**
   - Ensure `_redirects` file is configured
   - Check SPA routing settings

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify environment variables

3. **Performance Issues**
   - Enable gzip compression
   - Optimize images
   - Use CDN for assets

### Support
For deployment issues, check:
- Build logs
- Browser console
- Network tab
- Platform-specific documentation

---

**Happy Deploying! 🎉**