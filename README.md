# Sports Probability Engine

Plataforma de análise estatística e probabilística de partidas esportivas. A primeira versão é focada em futebol e usa API-Football, Supabase, Next.js e Vercel.

## Princípios

- Dados reais; nenhum dado esportivo é inventado.
- Probabilidade não é certeza nem promessa de lucro.
- Odds só geram edge quando existe preço real armazenado.
- Modelo inicial explicável por Poisson, preparado para modelos futuros.

## Arquitetura

`API-Football -> sincronização -> normalização -> Supabase -> modelo -> dashboard`

O banco contém ligas, times, partidas, estatísticas, odds, versões de modelo, previsões, resultados, backtesting, métricas, sincronizações, logs e configurações. RLS está habilitado nas tabelas públicas e escritas são restritas ao backend.

## Ambiente

Use `.env.example`. A chave da API esportiva não fica no repositório; em produção ela é armazenada como segredo.

## Local

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
npm run typecheck
npm run build
```

## Modelo

Os gols esperados alimentam distribuições de Poisson independentes. A matriz de placares gera 1X2, totais, ambas marcam e placares prováveis. Confidence Score representa qualidade e amostra dos dados, não a probabilidade do evento.

## Odds e valor esperado

Probabilidade implícita = `1 / odd`. Edge = `P(modelo) - P(implícita)`. EV por unidade = `P(modelo) * odd - 1`.

## Backtesting

Avaliar com acurácia, Brier Score, Log Loss, calibração e ROI hipotético. Nunca usar partidas futuras como informação para prever partidas passadas.
