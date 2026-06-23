---
name: vercel-github-deployment
description: Configure GitHub repository setup, Vercel deployment, CI, environment variables, preview deployments, production release checks, and deployment documentation. Use when preparing or changing hosting, repository, CI, or release workflow.
---

# Vercel and GitHub Deployment Skill

## Goal

Safely connect the project to GitHub and Vercel with repeatable deployment and clear environment management.

## Confirmation rules

Ask the user before:

- creating a GitHub repository;
- pushing code;
- changing repository visibility;
- connecting Vercel;
- deploying to production;
- adding paid services;
- adding secrets or environment variables;
- configuring a custom domain.

## Required user information

Ask for:

- GitHub username or organization;
- repository name;
- repository visibility preference;
- Vercel account/team;
- Vercel project name;
- preferred production domain or subdomain;
- database provider;
- whether automatic preview deployments should be enabled;
- whether production deployments should require manual confirmation.

## Deployment checklist

Implement or document:

- local setup commands;
- package manager;
- build command;
- test command;
- lint command;
- required environment variables;
- Vercel project settings;
- preview deployment flow;
- production deployment flow;
- rollback notes;
- daily task deployment requirements.

## Secret handling

Never print secrets. Never commit `.env` files. Provide `.env.example` with placeholder values only.

## CI expectations

Configure CI to run:

- install;
- type check;
- lint;
- tests;
- build.

Add parser/integration checks when the scraping pipeline exists.

## Output format

Return:

- files changed;
- setup steps completed;
- commands run;
- deployment status;
- environment variables still needed;
- confirmation needed before production actions.

