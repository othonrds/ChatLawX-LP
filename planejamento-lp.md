# Planejamento - LP Lawx

Este documento descreve o plano de ação em fases para a landing page com SSR, Meta Conversions API e Stripe.

## Fase 1 - Base do Projeto (Infraestrutura)
- [x] Configurar Next.js (App Router) com TypeScript e SSR.
- [x] Estruturar pastas: `app/`, `_lib/`, `_components/`.
- [x] Configurações essenciais (`next.config.mjs`, `tsconfig.json`).
- [x] Gitignore, scripts de npm e validação de variáveis de ambiente.

## Fase 2 - Integração Meta Conversions API (Backend)
- [x] Criar util `@/_lib/meta/capi.ts` para envio de eventos (CAPI v17).
- [x] Rota `POST /api/meta/events` com validação (Zod), hashing de e-mail (sha256) e campos padrão (`action_source`/`event_time`).
- [x] Definir contrato mínimo do corpo (event_name, email opcional, fbc/fbp, user_agent, custom_data).
- [x] Tratamento de erros e respostas padronizadas.

## Fase 3 - Integração Stripe (Backend)
- [x] Criar util de servidor `@/_lib/stripe/server.ts` com SDK oficial e versão de API.
- [x] Rota `POST /api/stripe/checkout` para criar sessão de Checkout (price dinâmico e quantity).
- [x] Rota `POST /api/stripe/webhook` para receber eventos (verificação por assinatura com corpo bruto).
- [x] Estrutura base para tratar eventos relevantes (ex.: `checkout.session.completed`) — handlers específicos serão definidos na próxima etapa.

## Fase 4 - Observabilidade e Boas Práticas
- [x] Padronizar logs de request/response nas rotas de API.
- [x] Adicionar métricas leves (ex.: Web Vitals) e monitoramento de erros.
- [x] Documentar variáveis de ambiente em arquivo de exemplo.

## Fase 5 - Design Visual (Landing Page)

Com base no layout de referência, implementar a landing page com componentes modulares e i18n por subdomínio (PT/ES).

- [ ] Design System básico
  - [ ] Definir tokens de tema (cores, tipografia, espaçamentos, sombras) em `app/globals.css` usando CSS variables.
  - [ ] Grid e containers responsivos (mobile-first). 
  - [ ] Paleta dark por padrão (conforme referência) e contraste AA.

- [ ] i18n (PT/ES)
  - [ ] Criar `messages/pt.json` e `messages/es.json` com todas as chaves da página.
  - [ ] Criar util `@/_lib/i18n/dictionary.ts` com `getDictionary(locale)` (import dinâmico por locale).
  - [ ] Atualizar `app/page.tsx` para consumir o dicionário e repassar textos aos componentes.

- [ ] Componentização da LP (em `app/_components/*`)
  - [ ] `Header` (logo, navegação mínima/anchors) — fixo no topo.
  - [ ] `HeroSection` (headline, subheadline, imagem mock, CTAs, badges de confiança). 
  - [ ] `StatsBar` (cards com métricas: +50k, +35, etc.).
  - [ ] `WhyChoose` (3 destaques com ícones/descrição e CTA secundária).
  - [ ] `ToolsGrid` (cards das ferramentas: Recursos, Contestação, Réplica, Impugnação, etc.).
  - [ ] `ComparisonTable` (tabela comparativa LawX vs outras IAs, com checks/x, CTAs abaixo).
  - [ ] `Testimonials` (3 depoimentos em cards).
  - [ ] `FAQ` (acordeão com ~12 perguntas e respostas).
  - [ ] `Footer` (links Produto/Legal/Social + direitos). 

- [ ] Conteúdo e dados
  - [ ] Centralizar listas (ferramentas, perguntas, comparativo) em arquivos TS/JSON por locale (ex.: `messages/*` ou `@/_lib/content/*`).
  - [ ] Imagens/ícones otimizados em `public/` (logos parceiros, checks, ícones seção).

- [ ] SEO e Acessibilidade
  - [ ] `generateMetadata()` com `alternates.languages` apontando para subdomínios por idioma.
  - [ ] Semântica (h1-h2, nav, main, section, footer) e rótulos ARIA nos acordes/CTAs.
  - [ ] `next/image` para otimização e `alt` descritivos.

- [ ] Performance
  - [ ] Lazy-load de imagens abaixo da dobra e componentes pesados (ex.: `Testimonials`).
  - [ ] Minificar assets e remover imports não utilizados.

- [ ] QA
  - [ ] Validar conteúdo PT em `http://pt.lawx.local:3000` e ES em `http://es.lawx.local:3000`.
  - [ ] Revisar responsividade (320px, 768px, 1024px, 1440px) e contrastes.

## Variáveis de Ambiente (referência)
- Meta: `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_ACCESS_TOKEN`.
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- App: `NEXT_PUBLIC_APP_URL`.

> Observações:
> - Rotas sensíveis (Stripe e Meta CAPI) usam `runtime = 'nodejs'`.
> - Componentes no `app/` são Server Components por padrão; usar `"use client"` somente quando necessário.
