@echo off
echo Creating Banks structure...

:: Create main directory
mkdir "C:\Users\User2\YandexDisk\Projs\NodeJS\agro-frontend-new\src\pages\References\Banks"

:: Navigate to Banks directory
cd "C:\Users\User2\YandexDisk\Projs\NodeJS\agro-frontend-new\src\pages\References\Banks"

:: Create main files
echo. > BankEdit.tsx
echo. > BanksList.tsx

:: Create subdirectories
mkdir components
mkdir config
mkdir hooks
mkdir services

:: Create component files
cd components
echo. > AdditionalTab.tsx
echo. > BankAccountItem.tsx
echo. > BasicInfoTab.tsx
echo. > RequisitesTab.tsx
cd ..

:: Create config files
cd config
echo. > editConfig.ts
echo. > formaters.tsx
echo. > index.ts
echo. > syncConfig.ts
echo. > tableConfig.ts
echo. > testDataAIScript.ts
cd ..

:: Create hooks files
cd hooks
echo. > useBankAccountsManager.ts
echo. > useBankData.ts
echo. > useBankEdit.ts
echo. > useErrorHandlers.ts
echo. > useSaveBank.ts
echo. > useTestDataGeneration.ts
cd ..

:: Create services files
cd services
echo. > testDataGenerator.ts
cd ..

echo Banks structure created successfully!
echo.
echo Created structure:
echo Banks/
echo ├── BankEdit.tsx
echo ├── BanksList.tsx
echo ├── components/
echo │   ├── AdditionalTab.tsx
echo │   ├── BankAccountItem.tsx
echo │   ├── BasicInfoTab.tsx
echo │   └── RequisitesTab.tsx
echo ├── config/
echo │   ├── editConfig.ts
echo │   ├── formaters.tsx
echo │   ├── index.ts
echo │   ├── syncConfig.ts
echo │   ├── tableConfig.ts
echo │   └── testDataAIScript.ts
echo ├── hooks/
echo │   ├── useBankAccountsManager.ts
echo │   ├── useBankData.ts
echo │   ├── useBankEdit.ts
echo │   ├── useErrorHandlers.ts
echo │   ├── useSaveBank.ts
echo │   └── useTestDataGeneration.ts
echo └── services/
echo     └── testDataGenerator.ts

pause