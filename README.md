# Relatório de Serviços Prestados – Nova Sueli Bolos

Apresentação web do relatório da consultoria técnica realizada pela **DaRê Consultoria de Alimentos** (Renata Flosi Coli, CRN 7377) na **Nova Sueli Bolos**, Boituva/SP.

Site estático (HTML, CSS e JavaScript simples), sem etapa de build.

## Estrutura

- `index.html`: os 11 slides (1920×1080), escalados para a tela
- `styles.css`: identidade visual inspirada na referência da Confeitaria Dama, com animações de entrada
- `app.js`: ajuste de escala, rolagem por slide, navegação por teclado e contador
- `img/`: fotografias da Nova Sueli Bolos (uso autorizado pelo cliente)
- `vercel.json`: configuração de publicação

## Navegação

Role a página ou use as setas, Page Up/Page Down, Home e End.

## Publicação

Hospedado na Vercel como projeto estático. Para publicar manualmente: `vercel --prod` na raiz do projeto.

## Observações

- A coluna "Antes" do slide de antes e depois está em termos gerais e deve ser confirmada com os dados do levantamento inicial.
- A página usa `noindex`, para não aparecer em buscadores.
