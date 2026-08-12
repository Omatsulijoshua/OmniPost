# Deployment Strategy

## Web & Admin Applications
Deployed to Vercel with automatic preview deployments per PR.

## API & Queue Workers
Deployed to Docker containers on AWS ECS / Railway / Render with managed PostgreSQL (RDS/Supabase) and managed Redis (Upstash/ElastiCache).
