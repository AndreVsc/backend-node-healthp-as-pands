**Database:**
~~~sql
    -- Creating the database
CREATE DATABASE pands_database;

-- Selecting the database for use
USE pands_database;

-- Creating the TipoDeUsuario table
CREATE TABLE TipoDeUsuario (
    idTipoDeUsuario INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

-- Creating the Usuario table with email and password
CREATE TABLE Usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    dataNasc DATE NOT NULL,
    email VARCHAR(255) UNIQUE NULL, 
    senha CHAR(60) NOT NULL,
    idTipoDeUsuario INT,
    FOREIGN KEY (idTipoDeUsuario) REFERENCES TipoDeUsuario(idTipoDeUsuario)
);
-- Creating the FAQ table
CREATE TABLE FAQ (
    idFAQ INT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(255) NOT NULL,
    resposta TEXT NOT NULL,
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Creating the TipoDeLembrete table
CREATE TABLE TipoDeLembrete (
    idTipoDeLembrete INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

-- Creating the Lembrete table
CREATE TABLE Lembrete (
    idLembrete INT AUTO_INCREMENT PRIMARY KEY,
    horarioFinal DATETIME NOT NULL,
    frequencia INT NOT NULL,
    idTipoDeLembrete INT,
    idUsuario INT,
    FOREIGN KEY (idTipoDeLembrete) REFERENCES TipoDeLembrete(idTipoDeLembrete),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Creating the Exercicio table
CREATE TABLE Exercicio (
    idExercicio INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    idUsuario INT
);

-- Creating the MensagemMotivacional table
CREATE TABLE MensagemMotivacional (
    idMensagemMotivacional INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE LogMudancaLembrete (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    idLembrete INT NOT NULL,
    horarioFinalAntigo DATETIME,
    horarioFinalNovo DATETIME,
    dataMudanca DATETIME,
    FOREIGN KEY (idLembrete) REFERENCES Lembrete(idLembrete)
);

~~~

**inserts:**

~~~sql
   
-- Inserindo tipos de usuários na tabela TipoDeUsuario
INSERT INTO TipoDeUsuario (idTipoDeUsuario, descricao) VALUES 
(1, 'Guest'),
(2, 'Usuário Padrão');

~~~