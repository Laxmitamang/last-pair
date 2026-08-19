# Last Pair

Last Pair is a portfolio-ready e-commerce prototype for a UK clearance-footwear business. The concept is to source genuine end-of-season, warehouse, and heavily discounted shoes, then make those deals easier to discover for students and other price-conscious customers.

The project is also a practical learning environment for modern web development, database design, automated testing, Docker, GitHub Actions, CI/CD, and eventual deployment to AWS ECS on Fargate.

## Current prototype

- Responsive editorial storefront
- Search and category filters
- UK shoe-size selection
- Interactive shopping bag
- Retail-price and customer-savings calculations
- Product catalogue API
- Automated rendering and API tests
- Initial GitHub Actions quality workflow

Product names are currently fictional, and no brand partnerships are implied. Authentication, persistent inventory, and checkout are planned but not yet implemented.

## Requirements

- Node.js 24 LTS (Node.js 22.13 or later is supported)
- pnpm 11

## Run locally

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Stop the development server with `Control + C`.

## Quality checks

```bash
pnpm lint
pnpm build
pnpm test:rendered
```

The same checks run in GitHub Actions for pushes to `main` and for pull requests.

## Learning roadmap

1. Git and GitHub workflow
2. GitHub Actions and YAML fundamentals
3. PostgreSQL schema, migrations, and seed data
4. Backend API validation and integration testing
5. Docker and local multi-container development
6. Authentication, cart persistence, inventory, and orders
7. AWS infrastructure, ECR, ECS/Fargate, and RDS
8. Secure CI/CD deployment, monitoring, and scaling

## Project status

Early prototype. The application is not currently accepting real orders or payments.
