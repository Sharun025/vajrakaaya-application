# 🚀 Hostinger Deployment Guide for Vajrakaaya Application

## 📋 Prerequisites
- Hostinger hosting account with Node.js support
- Git installed on your local machine
- Your Vajrakaaya application ready for deployment

## 🛠️ Method 1: Node.js Hosting (Recommended)

### Step 1: Prepare Your Application
```bash
# Build the production version
npm run build

# Install Express for serving the app
npm install express
```

### Step 2: Upload to Hostinger

#### Option A: Using Git (Recommended)
1. **In Hostinger Control Panel:**
   - Go to "Websites" → "Manage"
   - Click "Git" tab
   - Click "Connect Git Repository"
   - Enter your GitHub repository URL: `https://github.com/Sharun025/vajrakaaya-application.git`
   - Choose branch: `main`
   - Set deployment directory: `/public_html`

2. **Configure Node.js:**
   - Go to "Advanced" → "Node.js"
   - Enable Node.js
   - Set Node.js version to 18.x or higher
   - Set startup file to: `server.js`
   - Set Node.js URL to your domain

#### Option B: Manual Upload
1. **Upload files via File Manager:**
   - Go to "File Manager" in Hostinger
   - Navigate to `/public_html`
   - Upload all files from your project directory

### Step 3: Install Dependencies
```bash
# In Hostinger Terminal or SSH
cd public_html
npm install --production
```

### Step 4: Start the Application
```bash
# Start the server
npm run serve
```

## 🌐 Method 2: Static Hosting (Alternative)

### Step 1: Build Static Files
```bash
npm run build
```

### Step 2: Upload Build Folder
1. **Upload via File Manager:**
   - Go to "File Manager" in Hostinger
   - Navigate to `/public_html`
   - Upload contents of the `build` folder

### Step 3: Configure .htaccess (for React Router)
Create `.htaccess` file in `/public_html`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 🔧 Configuration Files

### package.json (Updated)
```json
{
  "name": "vajrakaaya-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "serve": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    // ... other dependencies
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### server.js
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🌍 Domain Configuration

### Custom Domain Setup
1. **In Hostinger Control Panel:**
   - Go to "Domains" → "Manage"
   - Add your custom domain
   - Point it to your hosting account

### SSL Certificate
1. **Enable SSL:**
   - Go to "SSL" in Control Panel
   - Enable "Free SSL Certificate"
   - Wait for activation (usually 24-48 hours)

## 📊 Performance Optimization

### Enable Compression
Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### Cache Headers
```javascript
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y',
  etag: false
}));
```

## 🔍 Troubleshooting

### Common Issues:
1. **Port Issues:** Make sure Hostinger allows your port
2. **Node.js Version:** Ensure you're using Node.js 16+ 
3. **Dependencies:** Run `npm install` after upload
4. **File Permissions:** Set proper permissions (755 for directories, 644 for files)

### Error Logs:
- Check Hostinger error logs in Control Panel
- Use `console.log()` for debugging
- Check Node.js logs in Hostinger Terminal

## 🚀 Post-Deployment

### Verify Deployment:
1. Visit your domain
2. Test all application features
3. Check mobile responsiveness
4. Verify SSL certificate

### Monitoring:
- Set up uptime monitoring
- Configure error tracking
- Monitor performance metrics

## 📞 Support
- Hostinger Support: Available 24/7 via live chat
- Documentation: Check Hostinger's Node.js hosting guide
- Community: Hostinger forums for additional help

---
**Your Vajrakaaya Application will be live at:** `https://yourdomain.com`
