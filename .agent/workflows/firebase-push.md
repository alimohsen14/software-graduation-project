---
description: How to maintain and test the Firebase Web Push Notification system
---

# Firebase Web Push Notification Workflow

This workflow guides you through verifying, testing, and troubleshooting the Firebase Cloud Messaging (FCM) implementation.

## 1. Prerequisites
- [ ] Ensure `REACT_APP_FIREBASE_VAPID_KEY` (or `VITE_FIREBASE_VAPID_KEY`) is set in your `.env` file.
- [ ] Ensure `public/firebase-messaging-sw.js` exists and contains the correct Firebase config.

## 2. Verification Steps

### Step 1: Service Worker Registration
1. Open the app in your browser (e.g., `http://localhost:3000`).
2. Open DevTools (F12) -> Console.
3. Verify you see the log: `✅ FCM Service Worker registered with scope: ...`
   - If you see an error, check if `public/firebase-messaging-sw.js` is accessible in the browser at `/firebase-messaging-sw.js`.

### Step 2: Push Token Registration
1. Log in as a **User** or **Seller** (Admin accounts are excluded from push notifications).
2. Accept the browser's "Allow Notifications" prompt.
3. Check the Console for: `✅ FCM Token registered with platform: web`.
   - If not found, ensure you are not an Admin and that permissions were granted.

### Step 3: Test Foreground Notifications (App Open)
1. Keep the app open and focused.
2. Go to the [Firebase Console](https://console.firebase.google.com/) -> Messaging.
3. Send a **Test Message**.
   - **FCM Token**: Copy the token from the console logs (or network request to `/users/push-token`).
4. **Expected Result**: A Toast notification should appear at the top-right of the screen.

### Step 4: Test Background Notifications (App Closed/Minimized)
1. Minimize the browser window or switch to a different tab.
2. Send another **Test Message** from Firebase Console.
3. **Expected Result**: A system notification (native OS notification) should appear.
4. Click the notification; it should focus the app window.

## 3. Maintenance & Troubleshooting

### Updating the Service Worker
If you modify `public/firebase-messaging-sw.js`, users' browsers might hold onto the old version.
- **Force Update**: In DevTools -> Application -> Service Workers, check "Update on reload" or click "Unregister" to force a fresh fetch.

### clearing Permissions
To reset the testing state:
1. Click the "lock" icon in the address bar.
2. Click "Reset permission" or "Ask (default)" for Notifications.
3. Reload the page.
4. Trigger the login/setup flow again to re-request permission.

### "Token Retrieval Failed" Errors
- **Mismatched Keys**: Ensure the VAPID key in `.env` matches the "Web Push Certificate" key pair in Firebase Console -> Project Settings -> Cloud Messaging.
- **Blocked**: Ensure your browser or OS "Do Not Disturb" mode is OFF.
