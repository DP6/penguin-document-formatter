# Document Formatter Penguin

<div align="center">
<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/centro_de_inovacao_dp6.png" height="100px" />
</div>

[![Build Status](https://travis-ci.org/DP6/penguin-document-formatter.svg?branch=main)](https://travis-ci.org/DP6/penguin-document-formatter)

O penguin-document-formatter é um módulo do ecossistema raft-suite criado pela [DP6](https://www.dp6.com.br) para garantir a qualidade dos dados ([Data Quality](https://en.wikipedia.org/wiki/Data_quality)) nos projetos de engenharia de dados implementados nos clientes da DP6, através de monitoramento automatizados de dados.

## Ecossistema raft-suite

O penguin-datalayer-collect consegue auxiliar as áreas de digital analytics das empresas nos seguintes pilares da qualidade de dados:

- Disponibilidade
- Completude
- Consistência

O ecossistema raft-suite é uma solução da DP6 que visa suprir as necessidades de monitoria do ciclo de vida dos dados para antecipar possíveis inconsistências.

## Dependências

Este módulo utiliza a biblioteca pdf2json, além dos serviços Google Cloud Functions, Google Cloud Storage, Google Pub/Sub e Google BigQuery.

## Executando localmente

Para adaptar, faça alterações nos arquivos nas pastas `src` e `test`.

Para executar localmente, basta copiar o mapa de coleta e executar o comando na raiz:

```shell
node index.js [nome-do-arquivo]
```

No nosso exemplo:

```shell
node index.js sitedp6.pdf;
```

O arquivo index.js serve para executar todas as funções presentes nos outros arquivos. Para utilização de teestes as funções foram consolidadas no arquivo `local.js`.

## Build

Após o desenvolvimento, executar `gulp build` para estruturar o que será inserido nas cloud functions. Até o momento temos as seguintes:

| Nome                | Função                                       | Status             |
| ------------------- | -------------------------------------------- | ------------------ |
| convert-pdf-to-json | Extrair o json estruturado dos pdfs e salvar | Em desenvolvimento |
| extract-events      | Extrair eventos do mapa de coleta            | Em desenvolvimento |

## Testes

Testes ainda em desenvolvimento; para qualquer nova funcionalidade, adicione um novo arquivo de teste.
Os testes são configurados pra funcionar com o modelo de mapa que está na raiz do projeto, e com as configurações `test_config.json`. Caso precise adaptar as funções para extrair mais ou menos informações, adicione condições para que a versão padrão continue funcionando, pois assim os testes podem garantir que o projeto continua sendo construído conforme esperado.

## Suporte:

**DP6 Koopa-troopa Team**

_e-mail: <koopas@dp6.com.br>_

<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/koopa.png" height="100" />
