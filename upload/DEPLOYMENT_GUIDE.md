# 🚀 Vajrakaaya Application - Upload Guide

## 📁 **Upload Folder Structure**

This `upload` folder contains all files needed for Hostinger deployment, organized exactly as they should be uploaded.

## 📋 **Step-by-Step Upload Instructions**

### **Step 1: Access Hostinger File Manager**
1. Log into your Hostinger account
2. Go to **"Websites"** → **"Manage"**
3. Click on your domain: `navajowhite-albatross-713944.hostingersite.com`
4. Click **"File Manager"**

### **Step 2: Navigate to Public HTML**
1. In File Manager, navigate to **`public_html`** folder
2. This is your website's root directory

### **Step 3: Upload Files**
**Upload the entire contents of this `upload` folder to `public_html`**

#### **Files to Upload:**
- ✅ **`index.php`** → Upload to `public_html/`
- ✅ **`.htaccess`** → Upload to `public_html/`
- ✅ **`build/`** folder → Upload to `public_html/build/`

## 📁 **Final Structure on Hostinger**

After upload, your `public_html` should look like this:
```
public_html/
├── index.php
├── .htaccess
└── build/
    ├── index.html
    ├── asset-manifest.json
    └── static/
        └── js/
            ├── main.e1fd8dc7.js
            ├── main.e1fd8dc7.js.map
            └── main.e1fd8dc7.js.LICENSE.txt
```

## ✅ **After Upload**

1. **Visit your domain**: `https://navajowhite-albatross-713944.hostingersite.com`
2. **Your Vajrakaaya app will be live!** 🎉

## 🔧 **Troubleshooting**

### **If you see "Build files not found":**
- Check if `build` folder exists in `public_html`
- Verify all files from `build` folder are uploaded
- Check file permissions (should be 644 for files, 755 for folders)

### **If React Router doesn't work:**
- Verify `.htaccess` file is uploaded correctly
- Check if Apache mod_rewrite is enabled

### **If styles don't load:**
- Check if `build/static/js/` files are uploaded
- Verify file paths in browser developer tools

## 📞 **Need Help?**

- **Hostinger Support**: Available 24/7 in your Business plan
- **Check Logs**: Use Hostinger's error logging features
- **File Permissions**: Ensure files have correct permissions

---

**Your Vajrakaaya Application will be live at:** `https://navajowhite-albatross-713944.hostingersite.com`
