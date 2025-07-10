# Ryt Bank Front End Assessment

A React Native mobile banking application built with Expo. This app provides banking features including fund transfers, transaction history, and profile management.


## App Walkthrough
https://github.com/user-attachments/assets/d5a8be14-9c58-4bef-a9fb-c5ef1cd97a0c

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

## Mock Data/Credentials

### In-app PIN
Upon reaching payment transfer confirmation screen, you'll be prompt with a modal requesting for the 6-digit in-app PIN number before proceeding with the transfer.

Therefore, the correct PIN number that is used for this project is `123456`.

### Money Transfers - 3rd Party Accounts Recipients
Below are the mock account number data that you can use for searching the account holders details to perform money transfers.

| Account No.              | isFrequent |
| :---------------- | :------: |
| "4444555566"       |   `True`   |
| "1111222233"         |   `True`   | 
| "5555666677"    |  `False`   |
| "9876543210" |  `False`   | 

## Reset Project

To reset the project to its initial state, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

## Design Decisions & Challenges

This project was completed within a 3-day timeframe (deadline: July 12, 2025), which presented several interesting challenges and required strategic design decisions.

### Design Decisions

1. **Expo Framework**: Choosing Expo for rapid development and deployment across platforms without dealing with native build configurations. The Expo SDK provided ready-to-use components like biometric authentication and camera access that accelerated development.

2. **State Management Strategy**: I've opted for a lightweight approach using Zustand instead of Redux to reduce boilerplate code while maintaining a predictable state container. This decision saved significant development time while providing good performance.

3. **Mock API Services**: Manage to implement a mock API service with simulated network delays and randomized failures to mimic real-world conditions without backend dependencies. This allowed for realistic user experience testing with transfer validation, error handling, and success scenarios.

4. **Component Architecture**: Created a hierarchy of reusable components (especially in the UI and transfer folders) to maintain consistency and accelerate development of new screens. The component architecture follows atomic design principles where possible.

5. **File-Based Routing**: Leveraged Expo Router's file-based routing to create an intuitive navigation structure that maps directly to the file system, making the codebase more maintainable and easier to understand.

### Challenges Faced

1. **Time Constraints**: The 3-day deadline required prioritizing core banking features while ensuring a polished user experience. Some nice-to-have features like transaction categorization and detailed reporting had to be deprioritized.

2. **Biometric Authentication**: Implementing secure biometric authentication across different platforms required extensive testing to ensure consistent behavior on both iOS and Android devices.

3. **Transfer Flow UX**: Creating an intuitive yet secure transfer flow that balances user convenience with necessary security measures (PIN verification, confirmation screens) was challenging to get right within the time constraints.

4. **Form Validation**: Implementing robust validation for transfer amounts, account numbers, and recipient details while maintaining a smooth user experience required careful error handling and feedback mechanisms.

5. **Testing Without Backend**: Creating a realistic testing environment with mock data that covers various edge cases (insufficient funds, network errors, validation failures) was crucial for ensuring app reliability.

### Future Improvements

With additional time, these enhancements would be valuable:

1. Implement comprehensive unit and integration tests
2. Add transaction categorization and analytics features
3. Support for scheduled/recurring transfers
4. Enhanced security features like transaction limits and suspicious activity detection
5. Offline mode for viewing transaction history when network is unavailable

This assessment demonstrates the ability to deliver a functional, user-friendly banking application with core features under tight deadlines while maintaining code quality and architecture best practices.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
