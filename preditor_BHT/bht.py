#Uma lista de desvios e as rescpectivas direções(T ou N)
desvios_dir = []

#Lê o arquivo traces e preenche desvios_dir
with open('../traces/trace1.txt') as file_trace1:
    linha = file_trace1.readline()
    while linha:       
        desvio_dir = linha.split()
        endereco_desvio_hex = desvio_dir[0]
        endereco_desvio_bin = bin(int(endereco_desvio_hex, 16)).zfill(32)
        endereco_desvio_bin = endereco_desvio_bin[2:33]
        direcao_desvio = desvio_dir[1]

        desvios_dir.append((endereco_desvio_bin, direcao_desvio))

        linha = file_trace1.readline()

for desvio_dir in desvios_dir:
    print(desvio_dir)