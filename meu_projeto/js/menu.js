// Função para fechar a navbar ao clicar fora dela
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.custom-navbar');
    const toggleBtn = document.querySelector('.navbar-toggler');

    if (!navbar.contains(event.target) && !toggleBtn.contains(event.target)) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show'); // Fecha a navbar se clicar fora
        }
    }
});

// Função para confirmar a saída
document.getElementById('logoutBtnMobile').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o redirecionamento imediato
    const confirmLogout = confirm("Você realmente deseja sair?");
    if (confirmLogout) {
        window.location.href = 'login.html'; // Redireciona para a tela de login se o usuário confirmar
    }
});

// Função para ir para a página inicial (home)
function goToHome() {
    hideAllIcons(); // Oculta todos os grupos de ícones
    loadHomeContent(); // Carrega o conteúdo da home
}

function loadHomeContent() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h1>Bem-vindo ao Menu</h1>
        <p>Aqui você encontrará todas as opções disponíveis.</p>
    `;
}

// Função para ocultar todos os grupos de ícones
function hideAllIcons() {
    const iconContainers = ['iconContainerCursos', 'iconContainerRH', 'iconContainerUtilitarios'];
    iconContainers.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none'; // Verifica se o elemento existe antes de tentar modificar
        }
    });
}

// Função para mostrar os ícones correspondentes
function showIcons(menuId) {
    hideAllIcons(); // Oculta todos os grupos de ícones

    const iconContainer = document.getElementById(menuId);
    if (iconContainer) {
        iconContainer.style.display = 'flex'; // Exibe o conjunto de ícones correspondente ao menu clicado
    }

    // Carrega o conteúdo relacionado ao menu
    loadMenuContent(menuId);
}

// Função para carregar conteúdo relacionado ao menu
function loadMenuContent(menuId) {
    const contentArea = document.getElementById('contentArea');

    if (menuId === 'iconContainerCursos') {
        contentArea.innerHTML = `
            <h1>Cursos</h1>
            <div class="row mt-4" id="iconContainerCursos">
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('curso/curso1.html')">
                        <i class="fas fa-book"></i>
                        <p>Curso 1</p>
                    </a>
                </div>
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('curso/curso2.html')">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <p>Curso 2</p>
                    </a>
                </div>
            </div>
        `;
    } else if (menuId === 'iconContainerRH') {
        contentArea.innerHTML = `
            <h1>Recursos Humanos</h1>
            <div class="row mt-4" id="iconContainerRH">
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('rh/recrutamento.html')">
                        <i class="fas fa-user-plus"></i>
                        <p>Recrutamento</p>
                    </a>
                </div>
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('rh/beneficios.html')">
                        <i class="fas fa-hand-holding-heart"></i>
                        <p>Benefícios</p>
                    </a>
                </div>
            </div>
        `;
    } else if (menuId === 'iconContainerUtilitarios') {
        contentArea.innerHTML = `
            <h1>Utilitários</h1>
            <div class="row mt-4" id="iconContainerUtilitarios">
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('utilitarios/confped/confped.html')">
                        <i class="fas fa-tools"></i>
                        <p>Conferência de Pedidos</p>
                    </a>
                </div>
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('utilitarios/envioped/envioped.html')">
                        <i class="fas fa-paper-plane"></i>
                        <p>Envio de Pedidos</p>
                    </a>
                </div>
                <div class="col-6 col-md-3 text-center icon-container">
                    <a href="#" onclick="loadContent('utilitarios/entregaped/entregaped.html')">
                        <i class="fas fa-truck"></i>
                        <p>Entrega de Pedidos</p>
                    </a>
                </div>
            </div>
        `;
    }
}

// Função para carregar conteúdo
function loadContent(page) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<p>Carregando...</p>';
    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o conteúdo');
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html; // Atualiza o conteúdo com o HTML carregado
        })
        .catch(error => {
            contentArea.innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
            console.error(error);
        });
}

// Chamada inicial para carregar a home
goToHome(); // Ou chame goToHome em um evento de carregamento de página se preferir
