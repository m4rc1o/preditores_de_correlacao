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
for endereco, direcao in desvios.items():
    if endereco not in BHT:
        BHT[endereco] = [0]*N # iniciando o registrador indexado por "endereço" com 0
        #print(endereco, BHT[endereco])

# Cria e inicializa os contadores
num_desvios = len(BHT)
contadores = {}
for endereco in BHT.keys():
    contadores[endereco] = [Contador()]*(2**N) # Cada desvio terá 2^N contadores

# Executa a simulação