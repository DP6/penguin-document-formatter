# Como desenvolver e atuar nos testes

Por ter muitas funções, pode ser difícil dar manutenção, principalmente considerando que são utilizadas Cloud Functions. Minha ideia desde o início é que todo desenvolvimento e qualquer modificação seja feita em ambiente local, para não precisar fazer inúmeros deploys na CF. 

Por isso todas as funções estão na pasta `/src`, e é onde elas devem ser alteradas. No fim, basta executar o comando de build que os arquivos serão copiados para as pastas das cloud functions.

Como a estrutura dos documentos é muito variável, tentei deixar o mais configurável possível. O arquivo `/src/config.json` é onde se encontram as regras utilizadas, e acredito que mexer nele seja o suficiente na maioria dos casos.

| Chave         | Descrição                                                     | Valor default |
| ------------- | ------------------------------------------------------------- | ------------- |
| eventTitle    | Regex com o título das caixas de eventos no mapa              | "evento"      |
| pageviewTitle | Regex com o título ou nome do parâmetro que contém o pageView | "(page        | screen)(name | view)?$" |
| parameters    | Quantidade de colunas que a caixa de eventos deve ter         | 2             |
| keyIndex      | Índice da coluna que contém a chave                           | 0             |
| valueIndex    | Índice da coluna que contém o valor                           | 1             |
| metadata      | Se o mapa contém as informações de versão e tela              | true          |

Caso essas alterações não sejam suficientes, o melhor a se fazer é acrescentar um `console.log` dentro da função `groupEvents`do arquivo `/src/extractEvents.js`. Os problemas mais comuns são na função `mergeRow`, que usa uma média do tamanho dos caracteres dos meus testes pra entender se 2 palavras/textos deveriam estar juntos pelas suas posições (basicamente se y é igual e se a diferença em x é equivalente ao tamanho do texto da esquerda)