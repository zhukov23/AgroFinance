@echo off
echo Creating Pesticides Reference GUI structure...

REM Создаем основную папку справочника пестицидов
mkdir "src\pages\References\Pesticides" 2>nul

REM Создаем подпапки
mkdir "src\pages\References\Pesticides\components" 2>nul
mkdir "src\pages\References\Pesticides\hooks" 2>nul
mkdir "src\pages\References\Pesticides\config" 2>nul
mkdir "src\pages\References\Pesticides\services" 2>nul

REM Основные компоненты
echo. > "src\pages\References\Pesticides\PesticidesList.tsx"
echo. > "src\pages\References\Pesticides\PesticideEdit.tsx"

REM Три стандартных компонента табов
echo. > "src\pages\References\Pesticides\components\BasicInfoTab.tsx"
echo. > "src\pages\References\Pesticides\components\RequisitesTab.tsx"
echo. > "src\pages\References\Pesticides\components\AdditionalTab.tsx"

REM Хуки
echo. > "src\pages\References\Pesticides\hooks\usePesticideData.ts"
echo. > "src\pages\References\Pesticides\hooks\usePesticideEdit.ts"
echo. > "src\pages\References\Pesticides\hooks\useSavePesticide.ts"
echo. > "src\pages\References\Pesticides\hooks\useTestDataGeneration.ts"

REM Конфигурация
echo. > "src\pages\References\Pesticides\config\editConfig.ts"
echo. > "src\pages\References\Pesticides\config\tableConfig.ts"
echo. > "src\pages\References\Pesticides\config\syncConfig.ts"
echo. > "src\pages\References\Pesticides\config\formaters.tsx"
echo. > "src\pages\References\Pesticides\config\testDataAIScript.ts"
echo. > "src\pages\References\Pesticides\config\index.ts"

REM Сервисы
echo. > "src\pages\References\Pesticides\services\testDataGenerator.ts"

echo.
echo ✅ Pesticides Reference structure created successfully!
echo.
echo 📁 Created structure:
echo    src\pages\References\Pesticides\
echo    ├── PesticidesList.tsx
echo    ├── PesticideEdit.tsx
echo    ├── components\
echo    │   ├── BasicInfoTab.tsx      (Основная информация)
echo    │   ├── RequisitesTab.tsx     (Регистрация и применение)
echo    │   └── AdditionalTab.tsx     (Безопасность и ценообразование)
echo    ├── hooks\
echo    │   ├── usePesticideData.ts
echo    │   ├── usePesticideEdit.ts
echo    │   ├── useSavePesticide.ts
echo    │   └── useTestDataGeneration.ts
echo    ├── config\
echo    │   ├── editConfig.ts
echo    │   ├── tableConfig.ts
echo    │   ├── syncConfig.ts
echo    │   ├── formaters.tsx
echo    │   ├── testDataAIScript.ts
echo    │   └── index.ts
echo    └── services\
echo        └── testDataGenerator.ts
echo.
echo 📋 Tab Content Distribution:
echo    • BasicInfoTab    → Основная информация (название, тип, производитель, активные вещества)
echo    • RequisitesTab   → Регистрация и применение (номер регистрации, целевые культуры/вредители, дозировка)
echo    • AdditionalTab   → Безопасность и ценообразование (класс опасности, цены, условия хранения)
echo.
pause