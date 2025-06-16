# Food Log - Aplicação Local de Registro de Refeições

## 📱 Sobre o Projeto

O **Food Log** é uma aplicação web local para registro diário de refeições com análise automática de calorias baseada em fotos. A aplicação funciona completamente no navegador, salvando os dados localmente usando localStorage.

## ✨ Funcionalidades

### 🍽️ Registro de Refeições
- **Upload de fotos**: Arraste e solte ou clique para selecionar fotos das refeições
- **Análise automática**: Estimativa de calorias baseada na análise da imagem
- **Detalhes completos**: Tipo de refeição, horário e descrição
- **Tipos de refeição**: Café da manhã, almoço, jantar e lanche

### 📊 Acompanhamento
- **Resumo diário**: Total de calorias consumidas no dia
- **Histórico**: Lista das refeições registradas com fotos em miniatura
- **Contador**: Número de refeições registradas por dia
- **Exclusão**: Possibilidade de remover refeições registradas

### 💾 Armazenamento Local
- **Persistência**: Dados salvos no localStorage do navegador
- **Sem servidor**: Funciona completamente offline
- **Privacidade**: Dados ficam apenas no seu dispositivo
- **Limite**: Mantém até 100 refeições para evitar problemas de armazenamento

## 🚀 Como Usar

### Opção 1: Usar os Arquivos Fornecidos
1. Baixe todos os arquivos do projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Comece a registrar suas refeições!

### Opção 2: Executar Localmente (Desenvolvimento)
1. Certifique-se de ter Node.js instalado
2. Execute os comandos:
   ```bash
   cd food-log-local
   pnpm install
   pnpm run dev
   ```
3. Acesse `http://localhost:5173`

## 📋 Como Registrar uma Refeição

1. **Adicione uma foto**: Clique na área de upload ou arraste uma imagem
2. **Aguarde a análise**: O sistema estimará automaticamente as calorias
3. **Preencha os detalhes**:
   - Selecione o tipo de refeição
   - Defina o horário
   - Adicione uma descrição
4. **Salve**: Clique em "Adicionar Refeição"

## 🔧 Tecnologias Utilizadas

- **React**: Framework JavaScript para interface
- **Vite**: Bundler e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS para estilização
- **Shadcn/UI**: Componentes de interface
- **Lucide React**: Ícones
- **localStorage**: Armazenamento local no navegador

## 📱 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móveis (responsivo)

## 🔒 Privacidade e Segurança

- **Dados locais**: Todas as informações ficam no seu dispositivo
- **Sem envio**: Nenhum dado é enviado para servidores externos
- **Offline**: Funciona sem conexão com a internet
- **Controle total**: Você tem controle completo sobre seus dados

## 📊 Estimativa de Calorias

A estimativa de calorias é feita através de um algoritmo simulado que:
- Analisa características básicas da imagem
- Gera estimativas realistas (100-600 calorias)
- Fornece nível de confiança da análise
- Identifica componentes principais da refeição

**Nota**: Para análise mais precisa, seria necessário integrar com APIs de visão computacional especializadas em alimentos.

## 🛠️ Estrutura do Projeto

```
food-log-local/
├── public/
├── src/
│   ├── components/ui/     # Componentes de interface
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos
│   └── main.jsx          # Ponto de entrada
├── dist/                 # Versão construída
├── index.html            # HTML principal
└── package.json          # Dependências
```

## 🎯 Próximos Passos (Melhorias Futuras)

- Integração com APIs reais de análise de alimentos
- Sincronização entre dispositivos
- Exportação de dados
- Gráficos e estatísticas avançadas
- Metas calóricas personalizadas
- Banco de dados de alimentos

## 📞 Suporte

Esta é uma aplicação local e autônoma. Para dúvidas ou problemas:
1. Verifique se o navegador suporta localStorage
2. Certifique-se de que JavaScript está habilitado
3. Teste em um navegador diferente se houver problemas

---

**Desenvolvido com ❤️ para ajudar no acompanhamento da sua alimentação diária!**

