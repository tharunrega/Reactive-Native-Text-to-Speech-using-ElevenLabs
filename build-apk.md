# APK Build Instructions

## Option 1: Using Expo Go (Recommended for Demo)
1. Install Expo Go on your Android phone from Google Play Store
2. Run `npm start` in your project
3. Scan the QR code with Expo Go
4. Your app will run on your phone - perfect for demo videos!

## Option 2: Using EAS Build (Requires Expo Account)
1. Create an Expo account at https://expo.dev
2. Run `eas login` and sign in
3. Run `eas build --platform android --profile preview`
4. Download the APK from the provided link

## Option 3: Using Expo Development Build
1. Run `npx expo install expo-dev-client`
2. Run `npx expo run:android` (requires Android Studio setup)
3. This will create a local APK in your project

## Option 4: Using Expo Snack (Online Demo)
1. Go to https://snack.expo.dev
2. Upload your code
3. Share the snack link for demo purposes

## For Your Submission:
- **Demo Video**: Use Expo Go method (Option 1) - record your phone screen
- **APK**: Use EAS Build method (Option 2) if you have Expo account
- **Alternative**: Use Expo Snack link for online demo 