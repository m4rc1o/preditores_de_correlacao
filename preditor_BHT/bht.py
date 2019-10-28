import sys
sys.path.append('../')
from utils import utils

m = 10

# Lendo o arquivo de trace e obtendo um dicionário da forma {endereço do desvio: histórico do desvio}
desvios = utils.ler_arquivo_trace('../traces/trace1.txt', m)

for endereco, dirs in desvios.items():
    print(endereco, dirs)