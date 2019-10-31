
def ler_arquivo_trace(arq, m):
    # Uma lista de tuplas na forma (endereço do desvio, t/n)
    desvios = []

    # Lê o arquivo traces e preenche "desvios"
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
            
            desvios.append((endereco_desvio_bin, direcao_desvio))
            linha = file_trace1.readline()  
    return desvios


class Contador:
    def __init__ (self):
        self.valor = 2
    
    def incrementar(self):
        if self.valor < 3:
            self.valor += 1
    
    def decrementar(self):
        if self.valor > 0:
            self.valor -= 1

