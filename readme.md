# Desafio Back-end - Grupo Adriano Cobuccio

## Descrição

Este repositório contém a implementação de uma carteira financeira, onde os usuários podem realizar transferências de saldo.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para construir aplicações do lado do servidor.
- **Nest.js**: Framework para Node.js que permite criar aplicações escaláveis e testáveis.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **MongoDB**: Banco de dados NoSQL escolhido para modelar e armazenar dados de forma eficiente.

## Funcionalidades

- **Cadastro de Usuário**: Usuários podem se cadastrar na aplicação.
- **Autenticação**: Implementação de autenticação para garantir a segurança dos usuários.
- **Transferências**: Usuários podem enviar e receber dinheiro.
- **Validação de Saldo**: A aplicação valida se o usuário possui saldo suficiente antes de permitir transferências.
- **Transações Reversíveis**: As operações de transferência são tratadas como transações passíveis de reversão em caso de inconsistências ou por solicitação do usuário.

## Requisitos

1. Criar um cadastro de usuário.
2. Implementar autenticação.
3. Permitir envio e recebimento de dinheiro entre usuários.
4. Validar saldo antes da transferência.
5. Implementar a reversibilidade de transferências.

## Como Executar a Aplicação

### Pré-requisitos

Antes de iniciar o projeto, certifique-se de que você tem o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [Docker](https://www.docker.com/products/docker-desktop) (opcional, se você estiver usando MongoDB via Docker)

### Passos para Iniciar o Projeto

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/pedrobits/carteira-gac-backend
   cd seurepo
   ```
2. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```
3. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

   Isso executará a aplicação em modo de desenvolvimento. Por padrão, ela estará disponível em `http://localhost:3000`.

## Instruções para Uso com Docker

Este projeto utiliza Docker para facilitar a configuração e execução do MongoDB. Siga os passos abaixo para iniciar o MongoDB usando apenas Docker.

- `-d`: Executa o contêiner em segundo plano (modo detach).

### Passos para Subir o MongoDB

1. **Crie um arquivo `.env`** com as seguintes variáveis:

   ```env
   MONGO_INITDB_ROOT_USERNAME=root
   MONGO_INITDB_ROOT_PASSWORD=example
   ```
2. **Crie um `Dockerfile` com o seguinte conteúdo:**

   ```dockerfile
   FROM mongo:latest

   EXPOSE 27017

   CMD ["mongod", "--bind_ip_all"]
   ```
3. **Construa a imagem Docker** usando o seguinte comando no diretório onde o seu `Dockerfile` está localizado:

   ```bash
   docker build -t mongo .
   ```

   - `-t mongo`: Nomeia a imagem como `mongo`.
   - `.`: Indica que o contexto de construção é o diretório atual.
4. **Inicie o MongoDB** usando o seguinte comando:

   ```bash
   docker run -d --name mongo --env-file .env -p 27017:27017 mongo
   ```

   - `-d`: Executa o contêiner em segundo plano (modo detach).
   - `--name mongo`: Nomeia o contêiner como "mongo".
   - `--env-file .env`: Utiliza o arquivo `.env` para definir as variáveis de ambiente.
   - `-p 27017:27017`: Mapeia a porta 27017 do contêiner para a porta 27017 da sua máquina local.
5. **Acesse o MongoDB** na URL:

   ```
   mongodb://root:example@localhost:27017/carteiragac?authSource=admin
   ```

   Use essa URL para conectar-se ao MongoDB no seu aplicativo ou através de ferramentas como MongoDB Compass.

### Parar o MongoDB

Para parar o contêiner do MongoDB, execute:

```bash
docker stop mongo
```

### Remover o Contêiner

Se você deseja remover o contêiner após pará-lo, execute:

```bash
docker rm mongo
```

## Documentação da API

A documentação da API pode ser acessada ao iniciar a aplicação em [Swagger](http://localhost:3000/api).

## Contribuições

Sinta-se à vontade para abrir issues ou pull requests. Ficarei feliz em discutir melhorias ou correções.

## Considerações Finais

Este projeto foi desenvolvido como parte do desafio para a vaga no Grupo Adriano Cobuccio. Estou aberto a feedbacks e sugestões!

---
