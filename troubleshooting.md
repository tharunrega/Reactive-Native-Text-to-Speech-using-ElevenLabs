# Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. **React Native Web Error**
**Error**: `Unable to resolve module react-native-web/dist/index`

**Solution**:
```bash
npm install react-native-web --legacy-peer-deps
```

### 2. **API Key Error**
**Error**: `ELEVENLABS_API_KEY environment variable is required`

**Solution**:
- Check that your API key is in the code (it's hardcoded as fallback)
- If using .env file, ensure it's in the root directory
- Restart the development server

### 3. **Metro Bundler Issues**
**Error**: Bundling failed or module resolution errors

**Solutions**:
```bash
# Clear cache
npx expo start --clear

# Reset Metro cache
npx expo start --reset-cache

# Update dependencies
npx expo install --check
```

### 4. **Expo Router Issues**
**Error**: Router-related bundling errors

**Solutions**:
```bash
# Reinstall expo-router
npx expo install expo-router

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### 5. **Android Build Issues**
**Error**: Android SDK not found

**Solutions**:
- Install Android Studio
- Set ANDROID_HOME environment variable
- Use Expo Go instead for demos

## 🔧 Quick Fix Commands

### Reset Everything:
```bash
# Stop the server (Ctrl+C)
# Clear everything
npx expo start --clear --reset-cache
```

### Update Dependencies:
```bash
npx expo install --check
npm audit fix
```

### Reinstall Everything:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 📱 For Demo/Submission

### Best Approach:
1. Use Expo Go on your phone
2. Scan QR code from `npm start`
3. Record demo video
4. No APK build needed

### If APK Needed:
1. Use EAS Build (requires Expo account)
2. Or use local build with Android Studio
3. See `build-apk-simple.md` for details

## 🆘 Still Having Issues?

1. **Check Expo Doctor**:
   ```bash
   npx expo-doctor
   ```

2. **Check Metro Logs**:
   - Look for specific error messages
   - Check if modules are missing

3. **Verify Dependencies**:
   ```bash
   npm list --depth=0
   ```

4. **Restart Everything**:
   - Close terminal/command prompt
   - Restart your computer
   - Try again

## ✅ Success Indicators

Your app is working correctly when you see:
- ✅ Metro bundler starts without errors
- ✅ QR code appears in terminal
- ✅ App loads on Expo Go
- ✅ Text-to-speech works
- ✅ Speech-to-text works 