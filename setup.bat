@echo off
REM Competitive Intelligence Tracker - Setup Script for Windows
REM This script automates the initial setup

echo.
echo 🚀 Setting up Competitive Intelligence Tracker...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Setup .env file
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your OPENAI_API_KEY
    echo.
) else (
    echo ✅ .env file already exists
    echo.
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)

echo ✅ Prisma client generated
echo.

REM Run migrations
echo 🗄️  Setting up database...
call npx prisma migrate deploy

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to run database migrations
    exit /b 1
)

echo ✅ Database setup complete
echo.

REM Done
echo ✨ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env and add your OPENAI_API_KEY
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo 📖 For more information, see README.md or QUICKSTART.md
echo.
pause
