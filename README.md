# 🃏 Memory Overflow

> Jogo da memória com tema de linguagens de programação, desenvolvido como projeto da disciplina Programação para Web — UNICAMP FT | 2024


## 📌 Sobre o projeto

Aplicação web fullstack de jogo da memória onde as cartas são ícones de linguagens e tecnologias de programação. O jogador pode escolher o tamanho do tabuleiro (2×2 até 8×8) e jogar no modo livre ou com cronômetro. As partidas são salvas e um ranking global é mantido entre os usuários cadastrados.

**Funcionalidades:**
- Cadastro e login de usuários com sessão PHP
- Seleção de dificuldade (tabuleiros 2×2, 4×4, 6×6 e 8×8)
- Dois modos de jogo: livre e com tempo limite
- Histórico de partidas por jogador
- Ranking global com placar de melhores jogadores
- Perfil editável com dados do usuário
- Modo trapaça (revela todas as cartas temporariamente)

## 🛠️ Tecnologias

**Front-end**
- HTML5, CSS3, JavaScript (ES6+ com módulos)
- Arquitetura MVC (Model / View / Controller)

**Back-end**
- PHP com PDO
- MySQL

## 🗂️ Arquitetura do front-end

O JavaScript foi organizado seguindo o padrão MVC:

```
front_end/src/
├── models/
│   ├── tabuleiro-model.js   # Estado e lógica do tabuleiro (embaralhamento Fisher-Yates)
│   ├── celula-model.js      # Modelo de cada carta
│   └── timer-model.js       # Controle do cronômetro
├── views/
│   └── jogo-interface.js    # Renderização e atualização da UI
├── controllers/
│   ├── jogo-logica.js       # Controller principal do jogo
│   └── ranking.js           # Controller do ranking
└── config/
    └── imagens-dict.js      # Dicionário de cartas (34 linguagens/tecnologias)
```

## ⚙️ Como rodar localmente

**Pré-requisitos:** PHP, MySQL e um servidor local (ex: XAMPP ou WAMP).

1. Clone o repositório e mova a pasta para o diretório do servidor (`htdocs` ou equivalente)
2. Importe o banco de dados com o script disponível em `back_end/script.php`
3. Configure as credenciais em `back_end/connect.php`:
```php
$db_server   = "localhost";
$db_name     = "memory_overflow";
$db_username = "root";
$db_password = "";
```
4. Acesse `front_end/index.html` pelo servidor local

## 📁 Estrutura do repositório

```
.
├── front_end/
│   ├── index.html
│   ├── pages/          # Telas (login, registro, jogo, ranking, perfil...)
│   ├── src/            # JavaScript (MVC)
│   └── style/          # CSS por página
├── back_end/
│   ├── connect.php     # Conexão com o banco (PDO)
│   ├── login/          # Autenticação e registro
│   ├── profile/        # Leitura e atualização de perfil
│   ├── score/          # Salvamento de partidas e ranking
│   └── utils/          # Funções auxiliares (sessão, logout)
└── img/
    └── game-board/     # SVGs das cartas (34 linguagens)
```

## 👥 Autores

| Nome | RA |
|---|---|
| Laura Rodrigues Russo
| Matheus
| Sean Torres dos Santos | 268122 |

---

*Disciplina de Desenvolvimento Web | UNICAMP – Faculdade de Tecnologia*
