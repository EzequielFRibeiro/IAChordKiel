# ChordLens - Análise de Áudio com IA

Aplicação web avançada para detecção de acordes, análise musical e exportação de cifras em PDF.

## 🎵 Funcionalidades

### Análise de Áudio
- ✅ Detecção automática de acordes (maiores, menores, 7ª, maj7, sus)
- ✅ Identificação de tom musical (Krumhansl-Schmuckler)
- ✅ Detecção de BPM e beats
- ✅ Análise de cromograma em tempo real

### Sincronização em Tempo Real
- ✅ **Display de acordes sincronizado** - Mostra o acorde atual enquanto a música toca
- ✅ **Indicador de próximo acorde** - Visualize qual acorde vem a seguir
- ✅ **Barra de progresso** - Acompanhe a transição entre acordes
- ✅ **Animações suaves** - Transições visuais ao mudar de acorde

### Exportação de Cifras (PDF)
- ✅ **Editor completo** - Edite título, artista e letra antes de exportar
- ✅ **Layout personalizável** - Escolha entre 1 ou 2 colunas
- ✅ **Tamanho de fonte ajustável** - De 8pt a 16pt
- ✅ **Preview em tempo real** - Veja como ficará antes de exportar
- ✅ **Informações automáticas** - Tom e BPM incluídos automaticamente
- ✅ **Acordes com timestamp** - Cada acorde mostra o tempo exato

### Outras Funcionalidades
- 📤 Upload de arquivos (MP3, WAV, OGG, M4A, FLAC)
- 🎤 Gravação via microfone
- 🔗 Suporte para URLs de áudio
- 🎹 Dicionário de acordes (violão, piano, ukulele)
- 🎼 Exportação MIDI
- 📊 Visualização de forma de onda
- 🎚️ Separação de stems (em desenvolvimento)

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Web Audio API** - Processamento de áudio
- **jsPDF** - Geração de PDFs
- **Chromagram Analysis** - Detecção de acordes

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 🎯 Como Usar

1. **Carregar Áudio**
   - Faça upload de um arquivo de áudio
   - Ou grave usando o microfone
   - Ou cole uma URL de áudio

2. **Análise Automática**
   - A aplicação detecta automaticamente acordes, tom e BPM
   - Visualize os resultados em tempo real

3. **Sincronização**
   - Clique em Play para tocar a música
   - Acompanhe os acordes sincronizados em tempo real
   - Veja o próximo acorde e o progresso

4. **Exportar Cifra**
   - Clique em "Exportar Cifra (PDF)"
   - Edite o título, artista e letra
   - Escolha o layout (1 ou 2 colunas)
   - Ajuste o tamanho da fonte
   - Visualize o preview
   - Clique em "Exportar PDF"

## 🎨 Recursos Visuais

- Interface moderna com tema dark
- Animações suaves e responsivas
- Gradientes e efeitos de vidro (glassmorphism)
- Indicadores visuais de estado
- Preview em tempo real

## 📱 Responsivo

Totalmente otimizado para:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🔧 Configuração

### Variáveis de Ambiente (opcional)
Nenhuma variável de ambiente é necessária para funcionalidades básicas.

### Deploy no Vercel
```bash
# Via CLI
vercel

# Ou conecte seu repositório no dashboard do Vercel
```

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no GitHub.

---

**ChordLens** - Transformando áudio em música visual 🎵
