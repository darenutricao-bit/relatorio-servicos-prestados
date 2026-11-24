# Fabrizzio Cucina & Catering · Evento Toyota Boshoku

Painel visual do relatório técnico de acompanhamento do evento corporativo de 15/11/2026
(Fourplay Sports Arena, Sorocaba/SP), elaborado pela DaRê Consultoria de Alimentos
(Renata Flosi Coli, nutricionista).

## Estrutura

- `index.html`: página única, em português (pt-BR).
- `style.css`: identidade visual (azul-marinho, vermelho e verde pontual) e componentes.
- `app.js`: lê os arquivos de `data/` e desenha indicadores, gráficos e cartões. Sem dependências.
- `data/*.json`: dados do relatório (temperaturas, matriz do briefing, amostras, plano de ação, fatos).
- `img/`: logomarcas e registro fotográfico do evento.
- `vercel.json`: cabeçalhos de segurança e `noindex` (a página não deve ser indexada por buscadores).

## Rodar localmente

Use qualquer servidor estático, pois a página carrega os dados com `fetch`:

```bash
python3 -m http.server 8080
```

Depois abra http://localhost:8080.

## Observações

- Os dados refletem o relatório técnico de 15/11/2026. Aferições pontuais indicam onde corrigir e não bastam, sozinhas, para concluir descumprimento do tempo máximo de exposição.
- Base normativa: Portaria CVS nº 5/2013, arts. 47 e 52, aplicável à data do evento.
- O painel não substitui auditoria.
