# Funcionamento das funções

Por enquanto o foco da solução está nos mapas de coleta (basicamente conjuntos de chave-valor)

## 1. Transformar JSON em PDF

### 1.1 pdfToJson (pdf2text.js)

Usei o pacote [pdf2json](https://www.npmjs.com/package/pdf2json) para extrair os dados do pdf em uma estrutura de JSON.
Em seguida, são feitas algumas formatações no conteúdo, pois como vou precisar transformar num objeto depois, ocorrem alguns erros caso o conteúdo tenha aspas `"`, além de mudar a estrutura pela primeira vez.

### 1.2 formatJson

Aqui é feito o tratamento para trocar aspas duplas por simples `'` utilizando regex, e também é trocada a estrutura do JSON gerado pela biblioteca. Escolhi deixar de lado a maior parte das informações, e só utilizar a posição (coordenadas x e y) e o texto de cada entrada. Dessa forma o output fica muito semelhante ao da [Vision API](https://cloud.google.com/vision/docs/reference/rest/?apix=true) do GCP, que foi utilizada na primeira versão dessa solução tempos atrás.

### 1.3 extractEvents (extractEvents.js)

A principal parte da solução está aqui. A maior dificuldade é pegar o dado desestruturado (textos e posições), agrupá-los de acordo com a posição e então extrair as informações de chave-valor dos documentos.
Existem diversas funções dentro deste arquivo, mas resumindo:

1. Agrupar os textos de acordo com a posição
2. Procurar as palavras-chave definidas no arquivo de configuração (titulo do pageview e dos eventos), juntar textos que podem ter sido separados nos metadados do pdf,  e montar os objetos de eventos com base nessas chaves. No fim é retornado um objeto com as informações do mapa(se disponíveis) e todos os eventos, incluindo o pageview.

## 2. Formatar eventos

Parte final da solução, consiste em pegar os objetos de eventos e estruturar da forma que serão escritos no BigQuery. Como o esforço para tratar os dados foi feito nas partes anteriores, o ideal é que essa seja a função mais fácil de mexer, além de ser a que pode ser personalizada de acordo com o projeto.