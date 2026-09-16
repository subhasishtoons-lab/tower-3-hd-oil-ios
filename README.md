# Tower 3 HD Oil Housing - iPhone Resident Portal

A dedicated, mobile-first iPhone compatible application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, mirroring all features of the Tower 3 HD Oil Housing Society portal (Oil India Limited, Duliajan, Assam 786602).

## Features

- **Mobile-First & iPhone Native Feel**:
  - iOS Safe Areas (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`)
  - Dynamic Island status bar with network, cellular, battery, and real-time clock
  - iOS Cupertino Navigation Header with active unit badge & quick unit switch
  - iOS Bottom Tab Bar with notification badges and Home indicator bar
  - Smooth rounded card geometry, iOS spring/slide modals, and bottom sheets

- **Tower 3 Navigation & Units Directory**:
  - All 24 units (049 to 072) across Floors 1 to 6
  - Floor filter tabs, search by unit/resident/designation
  - Officer designations at Oil India Limited (Production, Drilling, R&D, Civil, Finance)
  - Dedicated parking slots (P-049 to P-072), intercom numbers, and employee IDs

- **Society Maintenance & Bills**:
  - Society maintenance schedule from September 2026 to March 2027
  - Notice indicating monthly dues may change from month to month as decided by the society
  - Direct "Pay Society Dues" and "Pay Bill" actions
  - Dynamic, editable payment amount support
  - Integrated Payment Gateway:
    - **UPI**: Google Pay, PhonePe, Paytm, BHIM, and custom UPI ID
    - **Debit / Credit Card**: Card number, Expiry, CVV, Cardholder Name
    - **Net Banking**: State Bank of India, HDFC, ICICI, OIL Staff Co-op Bank
    - **OIL Salary Deduction**: Automatic payroll adjustment for company quarters
  - Official Tower 3 HD Oil Housing digital receipt generation with printable/shareable actions

- **Digital Notice Board**:
  - Categories: Urgent Alerts, Maintenance, Water Works, Power & DG, Meetings, Festivals
  - Pinned circulars & priority tags
  - In-app notice posting modal

- **Resident Discussion Forum**:
  - Discussion topics including "Grass cutting that will work very soon" and "Car shed work that will start from this month"
  - Upvoting/support reactions with animated counters
  - Comments sheet with resident identification
  - New discussion topic creation

- **Profile & PIN Security**:
  - Resident profile metadata & OIL details
  - 4-digit security PIN verification and update functionality
  - Tower 3 Secretary, Caretaker, Electrical Maintenance, and Security Gate contact directory

## Development & Build

From `/iphone-app`:
```bash
npm install
npm run dev      # Local Vite dev server on port 3000
npm run build    # Production TypeScript compile & Vite build
```

## Native iOS Deployment (Capacitor)

The native iOS Xcode project is located at `/iphone-app/ios/App`:

- **App Name**: `Tower 3 HD Oil`
- **Bundle ID**: `com.tower3hdoil.app`
- **Capacitor Version**: 8.5.2
- **Native Project Path**: `/iphone-app/ios/App/App.xcodeproj`

### Exact Commands to Open and Run in Xcode

On your macOS development machine with Xcode installed:

1. Navigate to the `iphone-app` directory:
   ```bash
   cd iphone-app
   ```

2. Build the web app and synchronize web assets with the native iOS shell:
   ```bash
   npm run cap:build
   # or manually:
   # npm run build && npx cap sync ios
   ```

3. Open the native project directly in Xcode:
   ```bash
   npx cap open ios
   # or open Xcode workspace directly:
   # open ios/App/App.xcworkspace
   ```

4. Alternatively, launch the app directly into an iOS Simulator from your terminal:
   ```bash
   npx cap run ios
   ```

