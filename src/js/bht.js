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
    
    // Seta o valor máximo de n para o valor de m, quando m for setado
    $('#m').change(function(){
        $('#n').attr('max', $('#m').val())
    })

    var m, n, BHT, PHT
    // Inicia a simulação quando o botão "Iniciar simulação" for pressionado
    $('#btn-iniSim').click(function(){
        // Desativa alterações em m e n e a entrada de arquivo
        desativarEntradas()
        
        // inicializa as variáveis m e n com os valores selecionados pelo usuário
        m = $('#m').val()
        n = $('#n').val()
        
        carregarTabelaDesvios(desvios) // Exibe os endereços na tabela de desvios 
        BHT = carregarBHT(desvios, m, n) // Exibe o estado inicial da BHT
        PHT = carregarPHT(BHT, n) // Exibe o estado inicial da PHT
        
        // executa a simulação passo a passo
        simular(desvios, BHT, PHT, m, n)

        $(this).prop('disabled', true) // Desativa o botão "Iniciar simulação"
    })

    function simular(desvios, BHT, PHT, m, n){
        var i = 0, linhaBHTanterior, linhaPHTanterior, tdContadAnterior
        function loop(){
            setTimeout(function(){
                // Executa a previsão do i-ésimo desvio
                enderecoDesv = desvios[i][0]
                previsao = preverDesvio(enderecoDesv, BHT, PHT, m, i)
                
                // Atualiza a direção realizada
                dirRealizada = desvios[i][1]

                // Atuliza o painel de resultados
                atualizarPainelResults(previsao, dirRealizada, i)
                
                // Colore a tabela de desvios de acordo com a corretude da previsão
                atualizarTabDesvios(previsao, dirRealizada, i)

                // Remove a coloração da linha anterior da da BHT  
                linhaBHTatual = $('#BHT-'+enderecoHexToMFormat(enderecoDesv, m))
                if(i > 0 && linhaBHTatual != linhaBHTanterior){
                    linhaBHTanterior.css({'background-color': 'transparent'})
                }
                // Atualiza o histórico de desvios indexado por "enderDesvio" na "BHT"
                // de acordo com "dirRealizada"
                linhaBHTatual.css({'background-color': 'red'})
                atualizarBHT(BHT, enderecoDesv, dirRealizada, m)
                linhaBHTanterior = linhaBHTatual

                // Atuliza o contador indexado pelo histórico do desvio atual de acordo com "dirRealizada"
                tdContadAtual = atualizarPHT(PHT, enderecoDesv, dirRealizada, m)
                if(tdContadAnterior && tdContadAnterior != tdContadAtual)
                    tdContadAnterior.css({'background-color': 'transparent'})
                tdContadAnterior = tdContadAtual
                linhaPHTatual = $('#PHT-'+enderecoHexToMFormat(enderecoDesv, m))
                linhaPHTatual.css({'background-color': 'gray'})
                if(linhaPHTanterior && linhaPHTatual != linhaPHTanterior)
                    linhaPHTanterior.css({'background-color': 'transparent'})
                linhaPHTanterior = linhaPHTatual

                ++i
                if(i < desvios.length){
                    loop()
                }
            }, 500)
        }
        loop()
    }

    function atualizarBHT(BHT, enderDesvio, dirRealizada, m){
        // Atualiza o histórico de desvios indexado por "enderDesvio" na "BHT"
        // de acordo com "dirRealizada"
        indiceBHT = enderecoHexToMFormat(enderecoDesv, m)
        if(dirRealizada.toLowerCase() == 't')
            BHT[indiceBHT].unshift(1)
        else
            BHT[indiceBHT].unshift(0)
        BHT[indiceBHT].pop()
        $('#hist-'+indiceBHT).text(BHT[indiceBHT])
    }

    function atualizarPHT(PHT, enderDesvio, dirRealizada, m){
        enderDesvMFormat = enderecoHexToMFormat(enderDesvio, m)
        contadores = PHT[enderDesvMFormat]
        strHistDesv = BHT[enderDesvMFormat].join('')
        indiceContador = historicoToIndice(strHistDesv)
        contador = contadores[indiceContador]
        tdContad = $('#conts-'+enderDesvMFormat+'-'+indiceContador)
        if(dirRealizada.toLowerCase() == 't')
            contador.incrementar()
        else
            contador.decrementar()
        tdContad.css({'background-color': 'red'})
        tdContad.text(contador.valor)
        return tdContad
    }
    
    function enderecoHexToMFormat(strEnderDesv, m){
        // Converte um endereço de desvio em hexadecimal para os m bits LSB 
        // excluindo-se os dois bits menos significativos
        enderBin32B = hexToBin32(strEnderDesv)
        return enderBin32B.substring(32 - m - 2, 32 - 2)
    }

    function preverDesvio(enderecoDesvio, BHT, PHT, m, i){
        enderInMFormat = enderecoHexToMFormat(enderecoDesvio, m)
        histDoDesvio = BHT[enderInMFormat]
        histDesvStr = histDoDesvio.join('')
        indiceContad = historicoToIndice(histDesvStr)
        contadores = PHT[enderInMFormat]
        contador = contadores[indiceContad]
        if(contador.valor >= 2)
            return 'T'
        
        else
            return 'N'
        
    }

    function carregarBHT(desvios, m, n){
        
        // Cria e inicializa um objeto BHT no formato {endereço desvio: histtórico}
        BHT = {}
        tbodyTabBHT = $('#tabela-bht').children('tbody')
        for(i = 0; i < desvios.length; ++i){
            enderDesvioHex = desvios[i][0]
            // converte para binário e mantém apenas o m LSB sem considerar os 2 bits menos significativos
            enderLinhaBHT = hexToBin32(enderDesvioHex).substring(32 - m - 2, 32 - 2)
            if(!(enderLinhaBHT in BHT)){
                historico = new Array(parseInt(n)).fill(0) // cria um objeto Array contendo n zeros
                BHT[enderLinhaBHT] = historico
                tbodyTabBHT.append('<tr id="BHT-'+enderLinhaBHT+'" name="linha-BHT">\
                    <td>'+enderLinhaBHT+'</td><td id="hist-'+enderLinhaBHT+'">'+historico+'</td></tr>')
            }
        }
        return BHT
    }

    function carregarPHT(BHT, n){
        enderecosBHT = Object.keys(BHT)
        PHT = {}
        for(i = 0; i < enderecosBHT.length; ++i){
            PHT[enderecosBHT[i]] = []
            for(j = 0; j < Math.pow(2, n); ++j){
                PHT[enderecosBHT[i]].push(new Contador())
            }
        }
        tbodyTabPHT = $("#tabela-pht").children('tbody')
        for(i = 0; i < enderecosBHT.length; ++i){
            tbodyTabPHT.append('<tr id="PHT-'+enderecosBHT[i]+'" name="linha-PHT">\
                <td>'+enderecosBHT[i]+'</td></tr>')
            linhaPHT = $('#PHT-'+enderecosBHT[i])
            contadores = PHT[enderecosBHT[i]]
            for(j = 0; j < contadores.length; ++j){
                linhaPHT.append('<td id="conts-'+enderecosBHT[i]+'-'+j.toString()+'"\
                    class="contadores">'+contadores[j].valor+'</td>')
            }
        }
        /* Seta o colspan do título "contadores"*/
        $("#th-contadores").attr('colspan', Math.pow(2, n).toString())
        return PHT
    }
 
})