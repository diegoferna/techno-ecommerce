const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        menssagemAlerta: "item adicionado",
        alertaAtivo: false,
        carrinhoAtivo: false
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString('pt-br', { style: "currency", currency: "BRL" })
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco
                })
            }

            return total
        }
    },
    methods: {
        fetchProdutos() {
            fetch('./api/produtos.json')
                .then(r => r.json())
                .then(r => this.produtos = r)
        },
        fetchProduto(id) {
            console.log(id)
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => this.produto = r)
        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = false
        },
        fecharCarrinho({ target, currentTarget }) {
            if (target === currentTarget) this.carrinhoAtivo = false
        },
        abrirModal(id) {
            this.fetchProduto(id)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        adicionarItem(event) {
            this.produto.estoque--;
            const { id, nome, preco } = this.produto
            this.carrinho.push({ id, nome, preco })
            this.alerta(`${nome} adicionado ao carrinho`)
        },
        removerItem(index) {
            this.carrinho.splice(index)
        },
        checarLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        comprarEstoque() {
            const item = this.carrinho.filter(({ id }) => id === this.produto.id)
            this.produto.estoque -= item.length
        },
        alerta(mesagem) {
            this.menssagemAlerta = mesagem
            this.alertaAtivo = true
            setTimeout(() => {
                this.alertaAtivo = false
            }, 1500);
        },
        router() {
            const hash = document.location.hash;
            if (hash) this.fetchProduto(hash.replace("#", ""))
        }
    },
    watch: {
        produto() {
            document.title = this.produto.nome || "Techno"
            const hash = this.produto.id || ""
            history.pushState(null, null, `${hash}`)
            if (this.produto) this.comprarEstoque()
        },
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        }
    },
    created() {
        this.fetchProdutos()
        this.router()
        this.checarLocalStorage()
    }
})
