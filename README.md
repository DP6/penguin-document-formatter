# Document Formatter Penguin

Solução desenvolvida para a leitura estruturada de PDFs.

## Dependências

Este módulo utiliza a biblioteca pdf2json, além dos serviços Google Cloud Functions, Google Cloud Storage e Google BigQuery.

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

## Próximos passos

- Finalizar a consolidação de eventos no BigQuery
- Implementar as duas cloud functions
- Acrescentar o processo de release, exportando o conteúdo das functions em .zip
