# MarginPilot AI — Production Deployment Guide

## 1. Deployment Topology

MarginPilot AI is built to deploy natively across managed cloud services:

- **Next.js Frontend**: Vercel (Edge-cached CDN, server-side SSR / ISR routes).
- **FastAPI Backend Gateway**: Render Web Service (`Python 3.12+`, native ASGI worker).
- **Background Worker**: Render Background Worker (`celery` / `rq` / native python background thread).
- **Relational Database & Vector Store**: Neon PostgreSQL 16 with `pgvector` extension enabled.
- **Cache & Broker**: Managed Redis (Upstash / Render Redis).
- **Private Object Storage**: S3-compatible private bucket (AWS / Cloudinary).

---

## 2. Backend Deployment on Render

### Web Service Specification
- **Environment**: Python 3.12+
- **Build Command**:
  ```bash
  pip install -r backend/requirements.txt
  ```
- **Start Command**:
  ```bash
  cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
  ```
- **Health Check Path**: `/health`

---

## 3. Frontend Deployment on Vercel

### Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://api.marginpilot.ai/api/v1`
