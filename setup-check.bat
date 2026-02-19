@echo off
echo ========================================
echo Quick Show - Setup Verification
echo ========================================
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    exit /b 1
)

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    exit /b 1
)

echo.
echo ========================================
echo Environment Check
echo ========================================

echo.
echo Checking server .env file...
if exist "server\.env" (
    echo [OK] server\.env exists
) else (
    echo [ERROR] server\.env not found!
)

echo.
echo Checking client .env file...
if exist "client\.env" (
    echo [OK] client\.env exists
) else (
    echo [ERROR] client\.env not found!
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Update Clerk keys in both .env files
echo 2. Run: cd server ^&^& npm install
echo 3. Run: cd client ^&^& npm install
echo 4. Run: cd server ^&^& npm run seed
echo 5. Start server: cd server ^&^& npm run server
echo 6. Start client: cd client ^&^& npm run dev
echo.
echo See README.md for detailed instructions
echo ========================================

pause
