# System Architecture

## Overview
OmniPost is designed as a scalable multi-tenant SaaS application operating across a Next.js web application, NestJS API engine, Next.js admin dashboard, and shared monorepo packages.

## Workspace Isolation Strategy
All persistent records (Posts, Social Accounts, Media Assets, Analytics, Brand Kits) belong to a `Workspace`. All database operations enforce tenant boundaries via Prisma client middleware and NestJS guards.

## Async Job Queuing
Publishing operations, media transcoding, and AI video analysis are delegated to BullMQ queues powered by Redis.
