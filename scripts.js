document.addEventListener("DOMContentLoaded", function () {
    var postForm = document.getElementById("postForm");
    var postsContainer = document.getElementById("postsContainer");
    var filterCategory = document.getElementById("filterCategory");

    var posts = [];

    postForm.addEventListener("submit", function (event) {
        event.preventDefault();
        criarPost();
    });

    filterCategory.addEventListener("change", function () {
        mostrarPosts();
    });

    function criarPost() {
        var texto = document.getElementById("postText").value;
        var imagem1 = document.getElementById("postImage1").value;
        var imagem2 = document.getElementById("postImage2").value;
        var imagem3 = document.getElementById("postImage3").value;
        var categoria = document.getElementById("postCategory").value;

        var post = {
            id: Date.now(),
            texto: texto,
            imagens: [imagem1, imagem2, imagem3].filter(function (url) { return url; }),
            categoria: categoria,
            indiceImagemAtual: 0
        };

        posts.push(post);
        mostrarPosts();
        postForm.reset();
    }

    function mostrarPosts() {
        var categoriaSelecionada = filterCategory.value;
        postsContainer.innerHTML = "";

        var postsFiltrados = categoriaSelecionada === "todas" ? posts : posts.filter(function (post) {
            return post.categoria === categoriaSelecionada;
        });

        postsFiltrados.forEach(function (post) {
            var postElement = document.createElement("div");
            postElement.className = "post";

            var imagensHTML = "";
            post.imagens.forEach(function (url, index) {
                imagensHTML += '<img src="' + url + '" class="' + (index === post.indiceImagemAtual ? "" : "hidden") + '">';
            });

            postElement.innerHTML = `
                <p>${post.texto}</p>
                <div class="carousel">
                    ${imagensHTML}
                    <div class="carousel-buttons">
                        <button class="prev-btn">Anterior</button>
                        <button class="next-btn">Próxima</button>
                    </div>
                </div>
                <p>Categoria: ${post.categoria}</p>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Apagar</button>
            `;

            postElement.querySelector(".edit-btn").addEventListener("click", function () {
                editarPost(post.id);
            });

            postElement.querySelector(".delete-btn").addEventListener("click", function () {
                apagarPost(post.id);
            });

            postElement.querySelector(".prev-btn").addEventListener("click", function () {
                imagemAnterior(post.id);
            });

            postElement.querySelector(".next-btn").addEventListener("click", function () {
                proximaImagem(post.id);
            });

            postsContainer.appendChild(postElement);
        });
    }

    function editarPost(id) {
        var post = posts.find(function (post) { return post.id === id; });
        var novoTexto = prompt("Edite seu post:", post.texto);

        if (novoTexto) {
            post.texto = novoTexto;
            mostrarPosts();
        }
    }

    function apagarPost(id) {
        if (confirm("Tem certeza que deseja apagar este post?")) {
            posts = posts.filter(function (post) { return post.id !== id; });
            mostrarPosts();
        }
    }

    function imagemAnterior(postId) {
        var post = posts.find(function (post) { return post.id === postId; });
        if (post.imagens.length > 1) {
            post.indiceImagemAtual = (post.indiceImagemAtual - 1 + post.imagens.length) % post.imagens.length;
            mostrarPosts();
        }
    }

    function proximaImagem(postId) {
        var post = posts.find(function (post) { return post.id === postId; });
        if (post.imagens.length > 1) {
            post.indiceImagemAtual = (post.indiceImagemAtual + 1) % post.imagens.length;
            mostrarPosts();
        }
    }
});
