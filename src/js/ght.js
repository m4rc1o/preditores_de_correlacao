$(document).ready(function () {
    /* "desvios" armazenará os dados do arquivo de trace em um array de arrays onde cada 
    array elemento é da forma [endereço do desvio, direção do desvio] */
    var desvios = []

    // Lê o arquivo trace selecionado pelo usuário e preenche o Array "desvios"
    $('#arqTrace').change(function(e){
            arquivo = e.target.files[0]
            fr = new FileReader()
            fr.onload = function(){
                linhas = fr.result.split('\n')

                // Remove a última linha, se ela for vazia
                if(linhas[linhas.length - 1] == '')
                    linhas.pop()

                for(i = 0; i < linhas.length; ++i){
                    var [enderDesvio, direcao] = linhas[i].split(' ')
                    desvios.push([enderDesvio, direcao])
                }
            }
            fr.readAsText(arquivo)
        })


    n = 0
    $('#btn-iniSim').click(function () {
        // Desativa alterações em m e n e a entrada de arquivo
        desativarEntradas()
        // Obtendo o valor de n informado pelo usuário
        n = $('#n').val()
        // Criando o "registrador de histórico global" e inicializando-o com zeros
        rhg = new Array(parseInt(n)).fill(0)
        // Criando o array de contadores que serão indexados por "rhg"
        contadores = new Array(Math.pow(2, n)).fill(new Contador())
        // Exibe as tabelas de desvios, RHG e Contadores no browser
        carregarTabelaDesvios(desvios)
        montarTabRHG()
        montarTabContadores()
        // Exexuta a simulação passo a passo
        simular()
    })
    

    function  simular(){
        i = 0, linhaContadoresAnterior = null, tdRHGanterior = null
        function loop(){
            setTimeout(function(){
                previsao = preverDesvio()
                dirRealizada = desvios[i][1]
                atualizarTabDesvios(previsao, dirRealizada, i)
                // atualiza contadores e a sua tabela
                linhaContadoresAnterior = atualizarContadores(dirRealizada, linhaContadoresAnterior)
                // atualiza o rhg e a sua tabela
                tdRHGanterior = atualizarRHG(dirRealizada, tdRHGanterior)
                // atualiza o painel de resultados
                atualizarPainelResults(previsao, dirRealizada, i)
                ++i
                if(i < desvios.length)
                loop()
            }, 500)
        }
        
        loop()
    }

    function montarTabRHG(){
        $('#tbody-rhg').append('<tr><td id="td-rhg" ></td></tr>')
        $('#td-rhg').text(rhg)
    }

    function montarTabContadores(){
        for(let i = 0; i < Math.pow(2, rhg.length); ++i){
            enderecoBin = intoToBin(i, rhg.length)
            $('#tbody-conts').append('<tr id="conts-'+enderecoBin+'">\
            <td id="conts-ender-'+enderecoBin+'" >'+intoToBin(i, rhg.length)
            +'<td id="conts-val-'+enderecoBin+'" >2</td></tr>')
        }
    }

    function preverDesvio(){
        enderecoBin = binArrayToBinStr(rhg)
        contador = contadores[rhgToIntIndice()]
        if(contador.valor >= 2)
            return 'T'
        else
            return 'N'
    }

    function atualizarContadores(dirRealizada, linhaContadoresAnterior){
        if(linhaContadoresAnterior)
            linhaContadoresAnterior.css({'background-color':'transparent'})
        linhaContadoresAtual = $('#conts-'+binArrayToBinStr(rhg))
        linhaContadoresAtual.css({'background-color':'red'})
        contador = contadores[rhgToIntIndice()]
        if(dirRealizada.toLowerCase() == 't')
            contador.incrementar()
        else
            contador.decrementar()
        $('#conts-val-'+binArrayToBinStr(rhg)).text(contador.valor)
        return linhaContadoresAtual
    }

    function atualizarRHG(dirRealizada, tdRHGanterior){
        if(tdRHGanterior)
            tdRHGanterior.css({'background-color':'transparent'})
        if(dirRealizada.toLowerCase() == 't')
            rhg.unshift(1)
        else
            rhg.unshift(0)
        rhg.pop()
        tdRHG = $('#td-rhg')
        tdRHG.text(rhg)
        tdRHG.css({'background-color':'red'})
        return tdRHG
    }

    function intoToBin(numInt, numDeBits){
        strBin = numInt.toString(2)
        diff = numDeBits - strBin.length
        for(let i = 0; i < diff; ++i)
            strBin = '0' + strBin
        return strBin
    }

    function binArrayToBinStr(binArray){
        return binArray.join('')
    }

    function rhgToIntIndice(){
        strRHG = binArrayToBinStr(rhg)
        return parseInt(strRHG, 2)
    }
})