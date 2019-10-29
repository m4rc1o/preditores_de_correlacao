import time
import sys
sys.path.append('../')
from utils import utils
from utils.utils import Contador

M = 10 # Número de bits do PC usados para indexar a BHT
N = 4  # Número de bits em cada registrador da BHT

# Lendo o arquivo de trace e obtendo um dicionário na forma {endereço do desvio: histórico completo do desvio}
desvios = utils.ler_arquivo_trace('../traces/trace1.txt', M)

# Cria e inicializa a BHT
BHT = {}
for endereco, direcao in desvios:
    if endereco not in BHT:
        BHT[endereco] = [0]*N # iniciando o registrador indexado por "endereço" com 0
        #print(endereco, BHT[endereco])

# Cria e inicializa os contadores
num_desvios = len(BHT)
contadores = {}
for endereco in BHT.keys():
    contadores[endereco] = [Contador()]*(2**N) # Cada desvio terá 2^N contadores


def list_hist_desvios_to_int(list_hist_desvios):
    str_hist_desvios = "".join(map(str, list_hist_desvios))
    valor_int = int(str_hist_desvios, 2)
    return valor_int

def prever_direcao(endereco_desvio, BHT, contadores):
    list_hist_desvios = BHT[endereco_desvio]
    contador = contadores[endereco_desvio][list_hist_desvios_to_int(list_hist_desvios)]
    if contador.valor >= 2:
        return 't'
    return 'n'

def atualizar_tabelas(endereco_desvio, BHT, contadores, dir_realizada):
    BHT[endereco_desvio].insert(0, 1 if dir_realizada == 't' else 0)
    BHT[endereco_desvio].pop(-1)
    contador = contadores[endereco_desvio][list_hist_desvios_to_int(BHT[endereco_desvio])]
    if dir_realizada == 't':
        contador.incrementar()
    else:
        contador.decrementar()

# Executa a simulação
for endereco, direcao in desvios:
    time.sleep(.7)
    print("Desvio:", endereco)
    print("Histórico:", BHT[endereco])
    print("Previsão:", prever_direcao(endereco, BHT, contadores))
    time.sleep(.5)
    print("Direção realizada:", direcao, "\n")
    atualizar_tabelas(endereco, BHT, contadores, direcao)
