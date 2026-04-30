# DataEater

An AI-powered business analytics platform that connects to your Stripe account and turns raw payment data into actionable insights — revenue trends, customer health scores, MRR/ARR tracking, and a daily AI-generated business brief.

**Live demo:** [https://dataeater.site](https://dataeater.site)

---

## Features

- **Real-time Dashboard** — Revenue, MRR, ARR, active subscriptions, new customers, and payment success rate updated from your live Stripe data
- **Business Health Score** — Composite score (0–100) derived from retention, churn, and payment success metrics
- **AI Insights** — Claude-powered analysis of your business metrics with prioritised recommendations
- **Daily Brief** — A concise AI-generated summary of what happened in your business over the last 24 hours
- **Stripe Connect** — OAuth-based Stripe account linking; data syncs automatically after onboarding
- **Interactive Charts** — Weekly/monthly trend charts across revenue, customers, subscriptions, and invoices
- **Demo Mode** — Visitors see a realistic pre-populated dashboard before connecting Stripe
- **Secure Auth** — Clerk-based authentication with JWT validation on every backend request
- **API Key Management** — Configure your own AI provider key from the settings page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Spring Boot 3, Java 17, Maven |
| Database | PostgreSQL |
| Auth | Clerk (frontend SDK + JWT validation) |
| Payments | Stripe Connect (Express accounts) |
| AI | Anthropic Claude API,Open AI API,Ollama |
| Deployment | Vercel (frontend), Docker (backend) |

---

## Screenshots

> _Coming soon_

---

## Local Setup

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL running locally
- A [Stripe](https://stripe.com) account (for Connect features)
- A [Clerk](https://clerk.com) application

### 1. Clone the repository

```bash
git clone https://github.com/your-username/dataeater.git
cd dataeater
```

### 2. Backend

Create a `src/main/resources/application.properties` file (or set the values as environment variables):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_advisor
spring.datasource.username=your_pg_username
spring.datasource.password=your_pg_password

stripe.api.key=sk_live_...
clerk.secret-key=sk_test_...
clerk.jwks-url=https://<your-clerk-domain>/.well-known/jwks.json
encryption.secret=your_32_char_secret

app.base-url=http://localhost:8080
frontend.url=http://localhost:5173
```

Run the backend:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend/dataEater
cp .env.example .env   # or create .env manually
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Docker (backend only)

```bash
docker build -t dataeater-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/ai_advisor \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=yourpassword \
  -e STRIPE_API_KEY=sk_live_... \
  -e CLERK_SECRET_KEY=sk_test_... \
  -e CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json \
  -e ENCRYPTION_SECRET=your_32_char_secret \
  -e FRONTEND_URL=https://dataeater.site \
  dataeater-backend
```

---

## Environment Variables

### Backend (`application.properties` or env)

| Variable | Description |
|---|---|
| `spring.datasource.url` | PostgreSQL JDBC connection URL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `stripe.api.key` | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `clerk.secret-key` | Clerk secret key |
| `clerk.jwks-url` | Clerk JWKS endpoint for JWT verification |
| `encryption.secret` | Secret used for encrypting stored credentials |
| `app.base-url` | Public URL of the backend (used in Stripe redirect URLs) |
| `frontend.url` | Public URL of the frontend (used in Stripe redirect URLs and CORS) |

### Frontend (`frontend/dataEater/.env`)

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_...` or `pk_live_...`) |
| `VITE_API_BASE_URL` | Backend base URL (defaults to `http://localhost:8080`) |

---

## Project Structure

```
/
├── src/                        # Spring Boot backend
│   └── main/java/.../
│       ├── Auth/               # Stripe Connect controller & service
│       ├── Security/           # JWT filter, CORS config, Clerk validation
│       ├── Service/            # Business logic, AI insights, metrics
│       ├── Model/              # JPA entities
│       └── Repositories/      # Spring Data repositories
├── frontend/dataEater/         # React + Vite frontend
│   └── src/
│       ├── pages/              # Route-level components
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       ├── contexts/           # Stripe context, auth context
│       └── api/                # Axios/fetch base client
└── Dockerfile                  # Multi-stage Docker build for backend
```

---

## License

MIT
