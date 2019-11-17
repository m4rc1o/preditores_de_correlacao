class Contador{
    constructor(){
        this.valor = 2
    }

    incrementar(){
        if(this.valor < 3)
            this.valor++
    }

    decrementar(){
        if(this.valor > 0)
            this.valor--
    }
}

function historicoToIndice(strHist){
    /*Converte uma string na forma "[b1, b2, ..., bn]"(Histórico de desvios), 
    onde bi pertence a {0, 1} para um inteiro entre 0 e 2^n - 1*/
    var strHistBits = strHist.replace(/\[|\]|,/g, '')
    var numDecimal = parseInt(strHistBits, 2)
    return numDecimal
}

function hexToBin32(stringHex){
    // Esta função stringHex, uma string representando um número hexadecimal,
    // em binStr(uma string representando um número binário com 32 bits)
    var binStr = parseInt(stringHex, 16).toString(2)
    var numZerosAd = 32 - binStr.length
    for(let i = 0; i < numZerosAd; ++i)
        binStr = '0' + binStr
    return binStr
}

function carregarTabelaDesvios(desvios){
    tabelaDesvios = $('#tabela-desvios')
    for(i = 0; i < desvios.length; ++i){
        tabelaDesvios.children('tbody').append('<tr id="desv-'+i.toString()+'"\
            name="linha-desvios">\
                <td>'+desvios[i][0]+'</td>\
                <td id="prev-'+i.toString()+'"'+'></td>\
                <td id="realiz-'+ i.toString()+'"'+'></td>\
            </tr>')
    }
}

function atualizarTabDesvios(previsao, dirRealizada, i){
    // Colore a tabela de desvios de acordo com a corretude da previsão
    tdPrevisao = $('#prev-'+i)
    tdPrevisao.text(previsao)
    $('#realiz-'+i.toString()).text(dirRealizada)
    if(previsao.toLowerCase() == dirRealizada.toLowerCase())
        tdPrevisao.css({'background-color': 'green'})
    else
        tdPrevisao.css({'background-color': 'red'})
}

function atualizarPainelResults(previsao, dirRealizada, i){
    $('#result-qtd-desvs').text(i + 1)
    divQtdMissPred = $('#result-num-misspred')
    qtdMissPred = parseInt(divQtdMissPred.text())
    if(previsao.toLowerCase() != dirRealizada.toLowerCase())
        qtdMissPred++
    divQtdMissPred.text(qtdMissPred)
    $('#result-taxa-misspred').text((qtdMissPred*100/(i + 1)).toFixed(2) + '%')
}

function desativarEntradas(){
    $('#m').prop('disabled', true)
    $('#n').prop('disabled', true)
    $('#arqTrace').prop('disabled', true)
    $('#btn-iniSim').prop('disabled', true)
}


function showOrHideHelp() {
    let helpSection = document.getElementById("help-div");
    if (helpSection.style.display === "none") {
        helpSection.style.display = "block";
    } else {
        helpSection.style.display = "none";
    }
}