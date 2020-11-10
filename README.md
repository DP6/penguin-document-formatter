# Document Formatter Penguin

Solução desenvolvida para a leitura estruturada de PDFs.

## Dependências

Este módulo utiliza Google Cloud Functions, Google Cloud Storage e Google BigQuery.

## Utilizando

Para adaptar, faça alterações nos arquivos nas pastas `src` e `test`.

Testes ainda em desenvolvimento; para qualquer nova funcionalidade, adicione um novo teste.

Para executar localmente, basta executar na raiz:

```shell
node index.js [nome-do-arquivo]
```

No nosso exemplo:

```shell
node index.js sitedp6.pdf;
```

Após o desenvolvimento, executar `gulp build` para estruturar o que será inserido nas cloud functions. Até o momento temos as seguintes:

| Nome                | Função                                       | Status             |
| ------------------- | -------------------------------------------- | ------------------ |
| convert-pdf-to-json | Extrair o json estruturado dos pdfs e salvar | Em desenvolvimento |
| extract-events      | Extrair eventos do mapa de coleta            | Em desenvolvimento |

