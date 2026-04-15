let poneySelecionado = "";
let lugarAtual = null;

// --- NAVEGAÇÃO E UI ---

function mostrarLogin() {
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function mostrarCadastro() {
    document.getElementById('cadastro').style.display = 'block';
    document.getElementById('login').style.display = 'none';
}

function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.style.display = 'none');
    document.getElementById(abaId).style.display = 'block';
}

function formatarData(i) {
    let v = i.value.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1/$2");
    if (v.length > 5) v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    i.value = v;
}

function selecionarPoney(el, nome) {
    poneySelecionado = nome;
    document.querySelectorAll(".avatar").forEach(a => a.classList.remove("selected"));
    el.classList.add("selected");
}

// --- AUTENTICAÇÃO ---

function cadastrar() {
    const nome = document.getElementById('nome').value;
    const nascimento = document.getElementById('nascimento').value;
    const genero = document.getElementById('genero').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !senha || !poneySelecionado) {
        alert("Por favor, preencha todos os campos e escolha um pônei!");
        return;
    }

    const user = {
        nome,
        nascimento,
        genero,
        senha: btoa(senha), // Codificação simples para exemplo
        poney: poneySelecionado,
        cartas: [],
        ultimoDaily: null
    };

    localStorage.setItem("user_" + nome, JSON.stringify(user));
    alert("Cadastro realizado com sucesso! Agora faça login.");
    mostrarLogin();
}

function entrar() {
    const nome = document.getElementById('loginNome').value;
    const senha = btoa(document.getElementById('loginSenha').value);

    const userJson = localStorage.getItem("user_" + nome);
    if (!userJson) {
        alert("Usuário não encontrado!");
        return;
    }

    const user = JSON.parse(userJson);
    if (user.senha !== senha) {
        alert("Senha incorreta!");
        return;
    }

    sessionStorage.setItem("usuarioLogado", nome);
    iniciarApp(user);
}

function visitante() {
    const user = { nome: "Visitante", poney: "Twilight", visitante: true };
    iniciarApp(user);
}

function iniciarApp(user) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';

    document.getElementById('info-user').innerText = `Olá, ${user.nome}!`;
    
    // Busca a imagem do pônei baseado no nome
    const poneyImg = document.querySelector(`img[onclick*="${user.poney}"]`);
    if (poneyImg) {
        document.getElementById('foto-perfil').src = poneyImg.src;
    }

    if (user.visitante) {
        document.querySelectorAll('.actions button').forEach(b => b.disabled = true);
        document.getElementById('info-user').innerText += " (Modo Visitante)";
    }
}

function logout() {
    sessionStorage.removeItem("usuarioLogado");
    location.reload();
}

// --- JOGO E CARTAS ---

function daily() {
    const nome = sessionStorage.getItem("usuarioLogado");
    const user = JSON.parse(localStorage.getItem("user_" + nome));
    const hoje = new Date().toDateString();

    if (user.ultimoDaily === hoje) {
        alert("Você já resgatou sua recompensa hoje! Volte amanhã.");
        return;
    }

    user.ultimoDaily = hoje;
    const carta = ganharCarta(user);
    localStorage.setItem("user_" + nome, JSON.stringify(user));
    alert(`🎁 Você ganhou uma carta ${carta.toUpperCase()}!`);
}

function missao() {
    const nome = sessionStorage.getItem("usuarioLogado");
    const user = JSON.parse(localStorage.getItem("user_" + nome));

    if (confirm("Deseja ajudar a Twilight em uma missão na biblioteca?")) {
        const carta = ganharCarta(user);
        localStorage.setItem("user_" + nome, JSON.stringify(user));
        alert(`🎮 Missão concluída! Você recebeu uma carta ${carta.toUpperCase()}.`);
    }
}

function ganharCarta(user) {
    const r = Math.random();
    let tipo = "comum";
    if (r > 0.9) tipo = "lendaria";
    else if (r > 0.6) tipo = "rara";
    
    user.cartas.push(tipo);
    return tipo;
}

function toggleCartas() {
    const lista = document.getElementById('lista-cartas');
    if (lista.style.display === 'none') {
        atualizarCartasUI();
        lista.style.display = 'grid';
    } else {
        lista.style.display = 'none';
    }
}

function atualizarCartasUI() {
    const nome = sessionStorage.getItem("usuarioLogado");
    const user = JSON.parse(localStorage.getItem("user_" + nome));
    const container = document.getElementById('lista-cartas');
    
    container.innerHTML = "";
    if (user.cartas.length === 0) {
        container.innerHTML = "<p>Você ainda não tem cartas.</p>";
        return;
    }

    user.cartas.forEach(tipo => {
        const div = document.createElement('div');
        div.className = `card ${tipo}`;
        div.innerText = tipo;
        container.appendChild(div);
    });
}

// --- MAPA ---

function clicarPonto(el) {
    lugarAtual = el;
    document.getElementById('lugar-nome').innerText = el.dataset.nome;
    document.getElementById('lugar-desc').innerText = el.dataset.desc;
    
    const btn = document.getElementById('btn-entrar-lugar');
    btn.style.display = 'block';
    
    if (el.classList.contains('bloqueado')) {
        btn.innerText = "Bloqueado";
        btn.style.opacity = "0.5";
    } else {
        btn.innerText = "Entrar em " + el.dataset.nome;
        btn.style.opacity = "1";
    }
}

function entrarLugar() {
    if (!lugarAtual) return;
    if (lugarAtual.classList.contains('bloqueado')) {
        alert("Este local está bloqueado! Complete mais missões para liberar.");
        return;
    }
    alert("✨ Viajando para " + lugarAtual.dataset.nome + "...");
}

// Desbloqueio automático de exemplo
setTimeout(() => {
    const everfree = document.getElementById('ponto-everfree');
    if (everfree) {
        everfree.classList.remove('bloqueado');
        everfree.classList.add('desbloqueado');
        console.log("Everfree Forest desbloqueada!");
    }
}, 10000);
