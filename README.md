# TaskFlow DevOps Capstone# project.

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI
- Database: PostgreSQL

## Current Status
- [x] App development
- [ ] Dockerization
- [ ] CI with GitHub Actions
- [ ] Docker Hub push
- [ ] Terraform for AWS
- [ ] Kubernetes on EKS
- [ ] Argo CD GitOps
- [ ] Prometheus monitoring

Files I could npt push 
1. app/backend/.env
   ```bash
    DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/taskflow
    APP_HOST=0.0.0.0
    APP_PORT=8000
    CORS_ORIGINS=http://localhost:5173
   ```
2. app/frnotned/.env
   ```bash
   VITE_API_BASE_URL=/api
   ```
