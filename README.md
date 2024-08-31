<h1 align="center">Projeto de API com Gemini</h1>

<p align="center">API para processamento de imagens e extração de informações numéricas usando o modelo Gemini da Google API.</p>

---

## 🚀 Tecnologias Utilizadas

- **Node.js**: Plataforma JavaScript para desenvolvimento do back-end.
- **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática opcional.
- **Express.js**: Framework minimalista para construção de aplicações web.
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições.
- **Prisma**: ORM para gerenciamento de banco de dados PostgreSQL.
- **Docker**: Plataforma para criar, executar e gerenciar containers.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar as leituras.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.

---

## 📁 Estrutura do Projeto

- `src/controllers`: Controladores de requisições e respostas da API.
- `src/services`: Serviços para processamento de imagens e integração com a API Gemini.
- `src/utils`: Funções utilitárias para validações e tratamento de erros.
- `Dockerfile`: Configuração para construção da imagem Docker.
- `docker-compose.yml`: Orquestração de múltiplos containers com Docker.
- `.env`: Variáveis de ambiente para chaves e credenciais.

---

## 📡 Endpoints da API

### `POST /upload`

Endpoint para upload de uma imagem em base64 e extração do valor de medição.

- **Parâmetros do Corpo da Requisição**:
  - `base64Image` (string): Imagem em formato base64.
  - `customer_code` (string): Código identificador do cliente.
  - `measure_datetime` (string): Data e hora da medição.
  - `measure_type` (string): Tipo de medição (`WATER` ou `GAS`).

- **Resposta**:
  - `200 OK`: Sucesso, retorna o `image_url`, `measure_value` e `measure_uuid`.
  - `400 Bad Request`: Dados inválidos ou imagem não fornecida.
  - `409 Conflict`: Leitura duplicada para o mesmo mês.
  - `500 Internal Server Error`: Erro ao processar a imagem ou salvar a leitura.

### `GET /readings`

Endpoint para listar todas as leituras de medição.

- **Resposta**:
  - `200 OK`: Sucesso, retorna a lista de todas as leituras de medição.
  - `500 Internal Server Error`: Erro ao buscar as leituras.

### `PATCH /readings/:id`

Endpoint para atualizar uma leitura de medição existente.

- **Parâmetros de Rota**:
  - `id` (string): UUID da leitura que será atualizada.

- **Parâmetros do Corpo da Requisição**:
  - `measure_value` (number): Novo valor da medição (opcional).
  - `measure_datetime` (string): Nova data e hora da medição (opcional).

- **Resposta**:
  - `200 OK`: Sucesso, retorna a leitura atualizada.
  - `400 Bad Request`: Dados inválidos.
  - `404 Not Found`: Leitura não encontrada.
  - `500 Internal Server Error`: Erro ao atualizar a leitura.

---
---

## 🛠️ Como Executar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DO_DIRETORIO>
   ```

   <h3 align="center">1. Configure as Variáveis de Ambiente:</h3>

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
GEMINI_API_KEY=SuaChaveDeAPI
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=mydatabase
```


<h3 align="center">2. Inicie a Aplicação com Docker:</h3>


```
docker-compose up --build
```



<h3 align="center">Feito por Guilherme Padilha </h3>

