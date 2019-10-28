
def ler_arquivo_trace(arq, m):
    # Um dicionario de desvios onde as chaves são os endereços 
    # dos desvios e os valores são uma lista das 
    # direções(simula o registrador de histórico local) tomadas
    # por esse desvio nas n execuções mais recentes
    desvios = {}

    # Lê o arquivo traces e preenche desvios
    with open(arq) as file_trace1:
        linha = file_trace1.readline()
        while linha:       
            temp = linha.split()
            endereco_desvio_hex = temp[0]
            direcao_desvio = temp[1]
            
            # Converte o endereço para binário e mantém apenas os m lsb com exeção dos dois primeiros bits
            endereco_desvio_bin = bin(int(endereco_desvio_hex, 16))
            endereco_desvio_bin = endereco_desvio_bin[2:33].zfill(32)
            endereco_desvio_bin = endereco_desvio_bin[32 - m - 2: 32 - 2]
            
            if endereco_desvio_bin not in desvios:
                desvios[endereco_desvio_bin] = [] 

            desvios[endereco_desvio_bin].insert(0, direcao_desvio)

            linha = file_trace1.readline()
    
    return desvios
    

