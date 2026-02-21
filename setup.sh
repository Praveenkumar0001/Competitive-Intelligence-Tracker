#!/bin/bash

# Competitive Intelligence Tracker - Setup Script
# This script automates the initial setup

echo "🚀 Setting up Competitive Intelligence Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OPENAI_API_KEY"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🗄️  Setting up database..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Failed to run database migrations"
    exit 1
fi

echo "✅ Database setup complete"
echo ""

# Done
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env and add your OPENAI_API_KEY"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📖 For more information, see README.md or QUICKSTART.md"
