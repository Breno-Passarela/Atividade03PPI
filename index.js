import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let fornecedores = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/fornecedores/cadastrar", (req, res) => {
  const form = `
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Cadastrar Fornecedor</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">Fornecedores</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Fornecedores</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/fornecedores/cadastrar">Cadastrar</a></li>
                  <li><a class="dropdown-item" href="/fornecedores/listar">Listar</a></li>
                </ul>
              </li>
            </ul>

            <a href="/login" class="btn btn-outline-light me-2">Login</a>
            <a href="/logout" class="btn btn-danger">Sair</a>
          </div>
        </div>
      </nav>

      <div class="container mt-4">
        <h2>Cadastrar Fornecedor</h2>

        <form action="/fornecedores/cadastrar" method="POST" class="mt-2">

          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label">CNPJ</label>
              <input type="text" name="cnpj" class="form-control" >
            </div>

            <div class="col-md-4">
              <label class="form-label">Razão Social</label>
              <input type="text" name="razaoSocial" class="form-control" >
            </div>

            <div class="col-md-4">
              <label class="form-label">Nome Fantasia</label>
              <input type="text" name="nomeFantasia" class="form-control" >
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-control" >
            </div>

            <div class="col-md-6">
              <label class="form-label">Telefone</label>
              <input type="text" name="telefone" class="form-control" >
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-2">
              <label class="form-label">UF</label>
              <select id="uf" name="uf" class="form-control">
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
                <option value="EX">Estrangeiro</option>
              </select>
            </div>

            <div class="col-md-8">
              <label class="form-label">Cidade</label>
              <input type="text" name="cidade" class="form-control" >
            </div>

            <div class="col-md-2">
              <label class="form-label">CEP</label>
              <input type="text" name="cep" class="form-control" >
            </div>
          </div>

          <div class="col-12 mt-3 d-flex justify-content-center">
            <button class="btn btn-success px-4">Cadastrar</button>
          </div>

        </form>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

      <script>
        (function () {
          function aplicarMascaraCNPJ(value) {
            return value
              .replace(/\\D/g, "")
              .replace(/^(\\d{2})(\\d)/, "$1.$2")
              .replace(/^(\\d{2})\\.(\\d{3})(\\d)/, "$1.$2.$3")
              .replace(/\\.(\\d{3})(\\d)/, ".$1/$2")
              .replace(/(\\d{4})(\\d)/, "$1-$2")
              .slice(0, 18);
          }
          function aplicarMascaraTelefone(value) {
            return value
              .replace(/\\D/g, "")
              .replace(/^(\\d{2})(\\d)/, "($1) $2")
              .replace(/(\\d{5})(\\d)/, "$1-$2")
              .slice(0, 15);
          }
          function aplicarMascaraCEP(value) {
            return value
              .replace(/\\D/g, "")
              .replace(/^(\\d{5})(\\d)/, "$1-$2")
              .slice(0, 9);
          }

          const cnpjInput = document.querySelector("input[name='cnpj']");
          const telInput = document.querySelector("input[name='telefone']");
          const cepInput = document.querySelector("input[name='cep']");
          const form = document.querySelector("form");

          if (!cnpjInput || !telInput || !cepInput || !form) {
            console.warn("Inputs esperados não encontrados no DOM. Verifique os names: cnpj, telefone, cep.");
            return;
          }

          cnpjInput.addEventListener("input", function (e) {
            e.target.value = aplicarMascaraCNPJ(e.target.value);
          });

          telInput.addEventListener("input", function (e) {
            e.target.value = aplicarMascaraTelefone(e.target.value);
          });

          cepInput.addEventListener("input", function (e) {
            e.target.value = aplicarMascaraCEP(e.target.value);
          });

          form.addEventListener("submit", function () {
            cnpjInput.value = cnpjInput.value.replace(/\\D/g, "");
            telInput.value = telInput.value.replace(/\\D/g, "");
            cepInput.value = cepInput.value.replace(/\\D/g, "");
          });
        })();
      </script>
    </body>
    </html>
  `;

  res.send(form);
});

app.post("/fornecedores/cadastrar", (req, res) => {
  const { cnpj, razaoSocial, nomeFantasia, email, telefone, uf, cidade, cep } = req.body;

  let erroCnpj = !cnpj ? "O campo CNPJ é obrigatório." : "";
  let erroRazao = !razaoSocial ? "O campo Razão Social é obrigatório." : "";
  let erroFantasia = !nomeFantasia ? "O campo Nome Fantasia é obrigatório." : "";
  let erroEmail = !email ? "O campo Email é obrigatório." : "";
  let erroTelefone = !telefone ? "O campo Telefone é obrigatório." : "";
  let erroUf = !uf ? "O campo UF é obrigatório." : "";
  let erroCidade = !cidade ? "O campo Cidade é obrigatório." : "";
  let erroCep = !cep ? "O campo CEP é obrigatório." : "";

  if (
    erroCnpj || erroRazao || erroFantasia ||
    erroEmail || erroTelefone || erroUf ||
    erroCidade || erroCep
  ) {
    return res.send(`
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Cadastrar Fornecedor</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">

    <div class="container mt-4">
      <h2>Cadastrar Fornecedor</h2>

      <form action="/fornecedores/cadastrar" method="POST" class="mt-2">

        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">CNPJ</label>
            <input type="text" name="cnpj" class="form-control" value="${cnpj || ""}">
            ${erroCnpj ? `<p class="text-danger">${erroCnpj}</p>` : ""}
          </div>

          <div class="col-md-4">
            <label class="form-label">Razão Social</label>
            <input type="text" name="razaoSocial" class="form-control" value="${razaoSocial || ""}">
            ${erroRazao ? `<p class="text-danger">${erroRazao}</p>` : ""}
          </div>

          <div class="col-md-4">
            <label class="form-label">Nome Fantasia</label>
            <input type="text" name="nomeFantasia" class="form-control" value="${nomeFantasia || ""}">
            ${erroFantasia ? `<p class="text-danger">${erroFantasia}</p>` : ""}
          </div>
        </div>

        <div class="row g-3 mt-1">
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" value="${email || ""}">
            ${erroEmail ? `<p class="text-danger">${erroEmail}</p>` : ""}
          </div>

          <div class="col-md-6">
            <label class="form-label">Telefone</label>
            <input type="text" name="telefone" class="form-control" value="${telefone || ""}">
            ${erroTelefone ? `<p class="text-danger">${erroTelefone}</p>` : ""}
          </div>
        </div>

        <div class="row g-3 mt-1">
          <div class="col-md-2">
            <label class="form-label">UF</label>
            <select name="uf" class="form-control">
              <option value="">Selecione...</option>
              ${["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO","EX"]
                .map(sigla => `<option value="${sigla}" ${uf === sigla ? "selected" : ""}>${sigla}</option>`)
                .join("")}
            </select>
            ${erroUf ? `<p class="text-danger">${erroUf}</p>` : ""}
          </div>

          <div class="col-md-8">
            <label class="form-label">Cidade</label>
            <input type="text" name="cidade" class="form-control" value="${cidade || ""}">
            ${erroCidade ? `<p class="text-danger">${erroCidade}</p>` : ""}
          </div>

          <div class="col-md-2">
            <label class="form-label">CEP</label>
            <input type="text" name="cep" class="form-control" value="${cep || ""}">
            ${erroCep ? `<p class="text-danger">${erroCep}</p>` : ""}
          </div>
        </div>

        <div class="col-12 mt-3 d-flex justify-content-center">
          <button class="btn btn-success px-4">Cadastrar</button>
        </div>

      </form>
    </div>

    </body>
    </html>
    `);
  }

  fornecedores.push(req.body);
  res.redirect("/fornecedores/listar");
});

app.get("/fornecedores/listar", (req, res) => {
  let html = `
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Lista de Fornecedores</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Fornecedores</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Fornecedores</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/fornecedores/cadastrar">Cadastrar</a></li>
                <li><a class="dropdown-item" href="/fornecedores/listar">Listar</a></li>
              </ul>
            </li>
          </ul>

          <a href="/login" class="btn btn-outline-light me-2">Login</a>
          <a href="/logout" class="btn btn-danger">Sair</a>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <h2>Lista de Fornecedores</h2>

      <table class="table table-bordered table-striped mt-3">
        <thead class="table-dark">
          <tr>
            <th>CNPJ</th>
            <th>Razão Social</th>
            <th>Fantasia</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>UF</th>
            <th>CEP</th>
          </tr>
        </thead>
        <tbody>`;

  fornecedores.forEach(f => {
    html += `
      <tr>
        <td>${f.cnpj}</td>
        <td>${f.razaoSocial}</td>
        <td>${f.nomeFantasia}</td>
        <td>${f.email}</td>
        <td>${f.telefone}</td>
        <td>${f.cidade}</td>
        <td>${f.uf}</td>
        <td>${f.cep}</td>
      </tr>`;
  });

  html += `
        </tbody>
      </table>

      <a href="/fornecedores/cadastrar" class="btn btn-primary">Voltar</a>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `;

  res.send(html);
});

app.get("/login", (req, res) => {
  const html = `
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Login</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body class="bg-light">

    <div class="container mt-5" style="max-width: 450px;">
      <h2 class="mb-4 text-center">Login</h2>

      <form action="/login" method="POST">

        <label class="form-label">Usuário</label>
        <input type="text" name="usuario" class="form-control mb-3" required>

        <label class="form-label">Senha</label>
        <input type="password" name="senha" class="form-control mb-3" required>

        <button class="btn btn-primary w-100">Entrar</button>
      </form>
    </div>

    </body>
    </html>
  `;

  res.send(html);
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.send(`
      <p style="font-family:Arial; margin:20px;">Campo obrigatório faltando!</p>
      <a href="/login">Voltar</a>
    `);
  }

  if (usuario !== "admin" || senha !== "admin") {
    return res.send(`
      <p style="font-family:Arial; margin:20px;">Usuário ou senha incorretos!</p>
      <a href="/login">Voltar</a>
    `);
  }

  return res.send(`
    <div style="font-family:Arial; margin:40px;">
      <h2>Você fez o login com sucesso!</h2>
      <a href="/" class="btn btn-primary mt-3">Home</a>
    </div>
  `);
});

app.get("/logout", (req, res) => {
  res.send(`
    <div style="font-family:Arial; margin:40px;">
      <h2>Você fez o logout com sucesso!</h2>
      <a href="/" class="btn btn-secondary mt-3">Home</a>
    </div>
  `);
});

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));