# backend-node-healthp-as-pands

Bem-vindo ao repositório do backend da aplicação HealthP. Esta aplicação fornece uma API para gerenciamento de usuários, lembretes e exercícios, utilizando Node.js, Express e MySQL.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:


Claro! Aqui está um exemplo de um arquivo README.md para sua aplicação backend em Node.js com Express e MySQL.

markdown
Copiar código
# HealthP Backend

Bem-vindo ao repositório do backend da aplicação HealthP. Esta aplicação fornece uma API para gerenciamento de usuários, lembretes e exercícios, utilizando Node.js, Express e MySQL.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

```plaintext
.
├── index.js                        # Arquivo principal do servidor
├── .env                            # Arquivo de variáveis de ambiente
├── package.json                    # Dependências e scripts do projeto
│
├── routes                          # Rotas da aplicação
│   ├── auth.js                     # Rotas de autenticação
│   ├── reminder.js                 # Rotas de lembretes
│   ├── user.js
│   └── views                       # Rotas de views
│       ├── averageWeightByType.js  # Rotas de views
│       ├── exerciseDetails.js      # Rotas de views
│       ├── heavyUsers.js           # Rotas de views
│       └── userDetails.js          # Rotas de views
│
├── services                        # Serviços para manipulação de dados
│   └── updateUserAndReminder.js    # Função para atualizar usuário 
│
└── middleware                      # Middlewares
    └── authMiddleware.js           # Middleware de autenticação JWT
```

## Instalação

1. **Clone o repositório:**

   ~~~bash
   git clone https://github.com/yourusername/healthp-backend.git
   ~~~

2. **Navegue para o diretório do projeto:**
    
    ~~~~bash
    cd healthp-backend
    ~~~~

3. **Instale as dependências:**

    ~~~~node
    npm install
    ~~~~

3. **Configure o arquivo .env:**

    Crie um arquivo .env na raiz do projeto e adicione suas variáveis de ambiente:

    ~~~~env
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=pands_database
    JWT_SECRET=yourjwtsecret
    JWT_EXPIRES_IN=3600
    PORT=5000
    ~~~~

## Uso

1. **Inicie o servidor:**
    
    O servidor será iniciado na porta especificada em PORT (por padrão, 5000).
    ~~~node
    npm start
    ~~~

## Endpoints

**Autenticação**
    
- POST `/auth/login`

    Realiza o login e retorna um token JWT.

    **Corpo da Requisição:**

    ~~~json
    {
    "email": "user@example.com",
    "password": "yourpassword"
    }
    ~~~~

    **Resposta:**

    ~~~json
    {
    "token": "your.jwt.token"
    }
    ~~~

**Usuários**

- GET `/user/profile`

    Obtém dados do perfil do usuário logado.

    **Headers:**

    - Authorization: `Bearer YOUR_JWT_TOKEN`

- POST  user/update-weight`

    Atualiza o peso do usuário.

    **Corpo da Requisição:**

    ~~~json
    {
    "novoPeso": 75.0
    }
    ~~~

    **Resposta:**

    ~~~json
    {
    "message": "Peso atualizado com sucesso!"
    }
    ~~~
    
**Lembretes**

- PUT `/user/updateUserAndReminder`

    Atualiza o peso do usuário e o horário final de um lembrete.

    **Corpo da Requisição:**
    
    ~~~json
    {
    "userId": 2,
    "newWeight": 75.0,
    "newReminderTime": "2024-08-15 10:00:00"
    }
    ~~~
    
    **Resposta:**

    ~~~json
    {
    "message": "Atualização bem-sucedida"
    }
    ~~~~

## Testes

Para testar as rotas, você pode usar o Postman. Crie requisições conforme descrito nas seções acima e verifique as respostas.

## Contribuição

Se você quiser contribuir com o projeto, por favor, siga estas etapas:

## Contato

Se você tiver perguntas ou precisar de ajuda, entre em contato:
    
Email: vsandre40@gmail.com

GitHub: AndreVsc


## Como Usar

1. **Substitua os valores de exemplo** 

    como `yourpassword`, `yourjwtsecret`, e `your.email@example.com` com suas informações reais.

2. **Adapte conforme necessário** 
    
    para refletir a estrutura real e as necessidades do seu projeto.
