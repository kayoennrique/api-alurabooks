const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
let userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

function createToken(payload, expiresIn = '12h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

function userExists({ email, password }) {
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

function emailExists(email) {
  return userdb.users.findIndex(user => user.email === email) !== -1
}

server.post('/public/registrar', (req, res) => {
  const { email, password, name, address, complement, cep } = req.body;

  if (emailExists(email)) {
    const status = 401;
    const message = 'E-mail já foi utilizado!';
    res.status(status).json({ status, message });
    return
  }

  fs.readFile("./users.json", (err, date) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    const json = JSON.parse(date.toString());

    const last_item_id = json.users.length > 0 ? json.users[json.users.length - 1].id : 0;

    json.users.push({ id: last_item_id + 1, email, password, name, address, complement, cep });
    fs.writeFile("./users.json", JSON.stringify(json), (err) => {
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({ status, message })
        return
      }
    });
    userdb = json
  });

  const access_token = createToken({ email, password })
  res.status(200).json({ access_token })
})

server.post('/public/login', (req, res) => {
  const { email, password } = req.body;
  if (!userExists({ email, password })) {
    const status = 401
    const message = 'E-mail ou password incorretos!'
    res.status(status).json({ status, message })
    return
  }
  const access_token = createToken({ email, password })
  let user = { ...userdb.users.find(user => user.email === email && user.password === password) }
  delete user.password
  res.status(200).json({ access_token, user })
})

server.get('/public/lancamentos', (req, res) => {
  res.status(200).json([
    {
      "id": 4,
      "categorie": 3,
      "title": "Bootstrap 4",
      "slug": "bootstrap-4",
      "description": "Conheça a biblioteca front-end mais utilizada no mundo",
      "isbn": "978-85-94188-60-1",
      "numberPages": 172,
      "publication": "2018-05-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/bootstrap4.png",
      "author": 4,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "Fazer um site elegante nunca foi tão fácil, mesmo para quem não sabe escrever uma linha de CSS e, muito menos, entende como harmonizar cores, balancear elementos e tipografia. O Bootstrap é, resumidamente, um grande arquivo CSS com uma excelente documentação, que possui dezenas e dezenas de componentes prontos. No começo, foi criado pelo Twitter para servir como um guia de estilos em CSS da empresa; hoje, é a biblioteca mais famosa e utilizada no mundo."
    },
    {
      "id": 5,
      "categorie": 3,
      "title": "Cangaceiro JavaScript",
      "slug": "cangaceiro-javascript",
      "description": "Uma aventura no sertão da programação",
      "isbn": "978-85-94188-00-7",
      "numberPages": 502,
      "publication": "2017-08-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/cangaceirojavascript.png",
      "author": 5,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "Talvez nenhuma outra linguagem tenha conseguido invadir o coletivo imaginário dos desenvolvedores como JavaScript fez. Em sua história fabular em busca de identidade, foi a única que conseguiu se enraizar nos navegadores, tornando-se uma linguagem em que todo desenvolvedor precisa ter algum nível de conhecimento."
    },
    {
      "id": 6,
      "categorie": 3,
      "title": "CSS Eficiente  ",
      "slug": "css-eficiente",
      "description": "Técnicas e ferramentas que fazem a diferença nos seus estilos",
      "isbn": "978-85-5519-076-6",
      "numberPages": 144,
      "publication": "2015-06-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/css.png",
      "author": 6,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "Quando aprendemos a trabalhar com CSS, frequentemente nos pegamos perdidos em detalhes fundamentais que não nos são explicados. Por vezes, alguns desses detalhes passam despercebidos até pelo desenvolvedor front-end mais experiente. Mas como ir além do conhecimento básico do CSS e preparar o caminho para explorar tópicos mais avançados?"
    },
  ])
})

server.get('/public/mais-vendidos', (req, res) => {
  res.status(200).json([
    {
      "id": 1,
      "categorie": 3,
      "title": "Acessibilidade na Web",
      "slug": "acessibilidade-na-web",
      "description": "Boas práticas para construir sites e aplicações acessíveis",
      "isbn": "978-65-86110-10-4",
      "numberPages": 246,
      "publication": "2020-04-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/acessibilidade.png",
      "author": 1,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "Acessibilidade na Web consiste na eliminação de barreiras de acesso em páginas e aplicações digitais para que pessoas com deficiência tenham autonomia na rede. Na verdade, acessibilidade na web beneficia todas as pessoas. Em algum momento da vida todos podem precisar de acessibilidade, seja devido a uma limitação temporária ou permanente. Quando não levamos em consideração o acesso de pessoas com deficiência, estamos tirando o direito de uma pessoa de navegar, interagir ou consumir produtos e serviços na rede. Empatia é o fator principal para que as aplicações que desenvolvemos sejam inclusivas."
    },
    {
      "id": 2,
      "categorie": 3,
      "title": "Angular 11 e Firebase",
      "slug": "angular11-e-firebase",
      "description": "Construindo uma aplicação integrada com a plataforma do Google",
      "isbn": "978-85-7254-036-0",
      "numberPages": 163,
      "publication": "2019-11-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/angular.png",
      "author": 2,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "No desenvolvimento de aplicações web e mobile, há disponível uma quantidade expressiva de linguagens, frameworks e ferramentas. Nessa imensidão, é comum se questionar ou até ter inseguranças sobre qual o melhor caminho para a construção neste segmento. O Angular é uma plataforma que facilita a construção de aplicativos, combinando templates, injeção de dependências, tudo integrado às melhores práticas de desenvolvimento."
    },
    {
      "id": 3,
      "categorie": 1,
      "title": "Arquitetura de software distribuído",
      "slug": "arquitetura-de-software-distribuído",
      "description": "Boas práticas para um mundo de microsserviços",
      "isbn": "978-65-86110-86-9",
      "numberPages": 138,
      "publication": "2021-10-01",
      "imageCover": "https://raw.githubusercontent.com/kayoennrique/alurabooks/main/public/images/books/arquitetura.png",
      "author": 3,
      "optionsPurchase": [
        {
          "id": 1,
          "title": "E-book",
          "price": 29.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        },
        {
          "id": 2,
          "title": "Impresso",
          "price": 39.9
        },
        {
          "id": 3,
          "title": "E-book + Impresso",
          "price": 59.9,
          "formats": [
            ".pdf",
            ".pub",
            ".mob"
          ]
        }
      ],
      "about": "Com constantes evoluções, adições de novas funcionalidades e integrações com outros sistemas, os softwares têm se tornado cada vez mais complexos, mais difíceis de serem entendidos. Dessa forma, fazer com que os custos de manutenção desses softwares não ultrapassem o valor que eles entregam às companhias é um desafio para a arquiteta ou arquiteto de software."
    }
  ])
})

server.use(/^(?!\/(public|books|authors|categories)).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Token inválido'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Token de autenticação não encontrado'
      res.status(status).json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Token revogado'
    res.status(status).json({ status, message })
  }
})

server.use(router)

server.listen(8000, () => {
  console.log("API disponível em http://localhost:8000")
})
