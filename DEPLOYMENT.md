# Deployment Guide

## Quick Start with Docker

1. **Set your OpenAI API key:**
   ```bash
   export OPENAI_API_KEY=your-openai-api-key
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up
   ```

3. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000)

## Hosting Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub

2. Import project in Vercel

3. Add environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key

4. Deploy

**Note:** Vercel uses serverless functions, so the SQLite database will be ephemeral. For production, consider using:
- Vercel Postgres
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

### Option 2: Railway

1. Create new project on Railway

2. Connect GitHub repository

3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (Railway provides this)

4. Deploy

### Option 3: Docker on any VPS

1. **On your server:**
   ```bash
   git clone <your-repo>
   cd competitive-intelligence-tracker
   ```

2. **Set environment variables:**
   ```bash
   echo "OPENAI_API_KEY=your-key" > .env
   ```

3. **Run:**
   ```bash
   docker-compose up -d
   ```

### Option 4: Heroku

1. Install Heroku CLI

2. Create app:
   ```bash
   heroku create your-app-name
   ```

3. Set environment:
   ```bash
   heroku config:set OPENAI_API_KEY=your-key
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

## Database Considerations

For production hosting with persistence:

1. **Update DATABASE_URL** in `.env` to use PostgreSQL:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

2. **Update Prisma schema** to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## Health Check

After deployment, visit `/status` to verify:
- ✅ Backend is running
- ✅ Database is connected
- ✅ LLM integration is working

## Troubleshooting

- **LLM unhealthy**: Check OPENAI_API_KEY is set correctly
- **Database errors**: Ensure DATABASE_URL is valid
- **Port conflicts**: Change port in docker-compose.yml if needed
