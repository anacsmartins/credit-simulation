FROM node:16

# Define o diretório de trabalho
WORKDIR /credit-simulation

# Copia os arquivos de configuração
COPY package*.json tsconfig.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . ./

# Compila o TypeScript para JavaScript
RUN npm run build

# Define o ponto de entrada
CMD ["node", "dist/index.js"]
