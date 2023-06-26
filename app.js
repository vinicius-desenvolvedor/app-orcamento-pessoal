class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}
class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros(){

        // array de despesas

        let despesas = Array()
        let id = localStorage.getItem('id')
        // recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++){
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            // existe a possibilidade de haver índices que foram pulados/removidos
            // nesses casos nós vamos pular esses índices
            if(despesa === null){
                continue
            }
            despesa.id = i // recupera o valor da key do localStorage
            despesas.push(despesa)

            
        }
        return despesas
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()


        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)


        // FILTROS
        // ano
        if(despesa.ano != ''){
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        // mes
        if(despesa.mes != ''){
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        // dia
        if(despesa.dia != ''){
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        // tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        // descricao
        if(despesa.descricao != ''){
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        // valor
        if(despesa.valor != ''){
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas

    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if (despesa.validarDados()) {
        bd.gravar(despesa)
        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
        
        document.getElementById('tituloModal').innerText = 'Sucesso'
        document.getElementById('modalTituloDiv').className = 'modal-header text-success'

        document.getElementById('conteudoModal').innerHTML = '<p>A despesa foi gravada com sucesso.</p>'
        document.getElementById('btnModal').className = 'btn btn-success'
        document.getElementById('btnModal').innerHTML = 'Continuar'

       ano.value = ''
       mes.value = ''
       dia.value = ''
       tipo.value = ''
       descricao.value = ''
       valor.value = ''


        console.log('Dados válidos')
    } else {
        //dialog de erro
        $('#modalRegistraDespesa').modal('show')
        document.getElementById('tituloModal').innerHTML = 'Falha'
        document.getElementById('modalTituloDiv').className = 'modal-header text-danger'

        document.getElementById('conteudoModal').innerHTML = '<p>Todos os campos devem ser preenchidos.</p>'
        document.getElementById('btnModal').className = 'btn btn-danger'
        document.getElementById('btnModal').innerHTML = 'Voltar e corrigir'
        


        console.log('Dados inválidos')
    }
}



function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        // alert('Nenhuma despesa cadastrada com esse filtro.')
        despesas = bd.recuperarTodosRegistros()
    }
    
    
    // selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('lista-despesas')
    listaDespesas.innerHTML = ''
    // precorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        // criar a linha (tr)
        let linha = listaDespesas.insertRow()

        // criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
        // ajustar o tipo
        switch (parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'            
                break;
            case 2: d.tipo = 'Educação'
                break;
            case 3: d.tipo = 'Lazer'
                break;
            case 4: d.tipo = 'Saúde'
                break;
            case 5: d.tipo = 'Transporte'
                break;
            default: d.tipo = 'Outros'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // criar o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class ="fas fa-times"></i>'
        btn.id = `id-despesa-${d.id}`
        btn.onclick = function () {
            // remover despesa
            let nomeDespesa = d.descricao
            let id = this.id.replace('id-despesa-', '')
            // alert(`Despesa '${nomeDespesa}' removida com sucesso.`)
            if (confirm('O registro será excluído permanentemente.')) {
                    bd.remover(id);
                    pesquisarDespesa();
            }
         }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa) 
    
    this.carregaListaDespesas(despesas, true)
}
