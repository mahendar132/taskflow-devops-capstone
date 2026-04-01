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
1. taskflow-devops-capstone/nginx.conf
   ```bash
   server {
      listen 80;
      server_name localhost;

      root /usr/share/nginx/html;
      index index.html;

      location / {
        try_files $uri /index.html;
      }

      location /api/ {
        proxy_pass http://backend:8000/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
    }
    ```

2. app/backend/.env
   ```bash
    DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/taskflow
    APP_HOST=0.0.0.0
    APP_PORT=8000
    CORS_ORIGINS=http://localhost:5173
   ```
3. app/frnotned/.env
   ```bash
   VITE_API_BASE_URL=/api
   ```
