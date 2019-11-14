$(document).ready(function () {
    
    n = 0
    $('#btn-iniSim').click(function () { 
        // Obtendo o valor de n informado pelo usuário
        n = $('#n').val()
        // Criando o "registrador de histórico global" e inicializando-o com zeros
        rhg = new Array(parseInt(n)).fill(0)
        console.log(rhg)
    })
    

})