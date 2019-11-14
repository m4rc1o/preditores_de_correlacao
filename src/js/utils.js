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