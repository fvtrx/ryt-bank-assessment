# Ryt Bank Front End Assessment

A React Native mobile banking application built with Expo. This app provides banking features including fund transfers, transaction history, and profile management.

## Features

- **Home Dashboard**: View account balance and recent transactions
- **Fund Transfers**: Transfer money to contacts using DuitNow or Interbank transfers
- **Transaction History**: View past transactions
- **Profile Management**: Update user profile and settings
- **Biometric Authentication**: Support for secure login with biometrics
- **PIN Authentication**: Secure transfers with PIN verification

## Tech Stack

- [Expo](https://expo.dev): React Native framework for cross-platform development
- [Expo Router](https://docs.expo.dev/router/introduction): File-based routing system
- [React Query](https://tanstack.com/query/v5): Data fetching and state management
- [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/): Biometric authentication
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/): Animations library
- [Lucide React Native](https://lucide.dev/): Icon library

## Project Structure

- `app/`: Main application screens with file-based routing
  - `(tabs)/`: Tab-based navigation screens (Home, History, Transfer, Profile)
  - `transfer/`: Transfer flow screens (confirmation, success)
- `components/`: Reusable UI components
  - `ui/`: Base UI components (Button, Card, Input, etc.)
  - `transfer/`: Transfer-specific components
- `constants/`: App constants and theme configuration
- `hooks/`: Custom React hooks
- `services/`: API services and mock data
- `store/`: State management stores using Zustand
- `types/`: TypeScript type definitions

## Getting Started

1. Clone or fork out this repo

   ```bash
   https://github.com/fvtrx/ryt-bank-assessment.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:

   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Expo Go](https://expo.dev/go) on your physical device

## Development

This project uses:

- TypeScript for type safety
- ESLint for code linting
- File-based routing with Expo Router

You can start developing by editing the files inside the **app** directory.

## Mock PIN

Upon reaching payment transfer confirmation screen, you'll be prompt with a modal requesting for the 6-digit in-app PIN number before proceeding with the transfer.

Therefore, the correct PIN number that is used for this project is `123456`.

## Reset Project

To reset the project to its initial state, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
