# Sistema de Eventos - Frontend

Frontend em React para sistema de gerenciamento de eventos, desenvolvido com Context API, Tailwind CSS e integração com backend Laravel/Sanctum.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces
- **Context API** - Gerenciamento de estado global
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento
- **Vite** - Build tool e dev server

## 📋 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Logout
- ✅ Proteção de rotas
- ✅ Persistência de sessão

### Eventos
- ✅ Listagem de todos os eventos
- ✅ Visualização de detalhes do evento
- ✅ Criação de novos eventos
- ✅ Edição de eventos (apenas organizador)
- ✅ Exclusão de eventos (apenas organizador)
- ✅ Inscrição em eventos
- ✅ Cancelamento de inscrição
- ✅ Listagem de "Meus Eventos"
- ✅ Busca e filtros

### Interface
- ✅ Design responsivo
- ✅ Componentes reutilizáveis
- ✅ Feedback visual (loading, erros, sucesso)
- ✅ Navegação intuitiva
- ✅ Animações e transições suaves

## 🛠️ Configuração

### Pré-requisitos
- Node.js 18+
- pnpm (ou npm/yarn)
- Backend Laravel rodando em `http://localhost:8000`

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd events-frontend
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure a URL da API**
Edite o arquivo `src/lib/api.js` e ajuste a `API_BASE_URL` se necessário:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

4. **Inicie o servidor de desenvolvimento**
```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── EventCard.jsx   # Card de evento
│   ├── Loading.jsx     # Componente de loading
│   ├── Navbar.jsx      # Barra de navegação
│   └── ProtectedRoute.jsx # Proteção de rotas
├── contexts/           # Contextos React
│   ├── AuthContext.jsx # Contexto de autenticação
│   └── EventContext.jsx # Contexto de eventos
├── lib/               # Utilitários
│   └── api.js         # Configuração da API
├── pages/             # Páginas da aplicação
│   ├── Dashboard.jsx  # Página inicial
│   ├── Events.jsx     # Lista de eventos
│   ├── EventDetail.jsx # Detalhes do evento
│   ├── CreateEvent.jsx # Criar/editar evento
│   ├── MyEvents.jsx   # Meus eventos
│   ├── Login.jsx      # Login
│   └── Register.jsx   # Registro
├── App.jsx            # Componente principal
└── main.jsx           # Ponto de entrada
```

## 🔗 Integração com Backend

### Rotas da API Consumidas

**Autenticação:**
- `POST /api/register` - Registro de usuário
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Dados do usuário autenticado

**Eventos:**
- `GET /api/events` - Listar eventos
- `GET /api/events/{id}` - Detalhes do evento
- `POST /api/events` - Criar evento
- `PUT /api/events/{id}` - Atualizar evento
- `DELETE /api/events/{id}` - Deletar evento
- `POST /api/events/{id}/subscribe` - Inscrever-se
- `DELETE /api/events/{id}/unsubscribe` - Cancelar inscrição
- `GET /api/my-events` - Meus eventos

### Autenticação Sanctum

O frontend utiliza tokens Bearer para autenticação:
- Token armazenado no localStorage
- Interceptor Axios adiciona automaticamente o token
- Redirecionamento automático para login em caso de token inválido

## 🎨 Componentes Principais

### AuthContext
Gerencia o estado de autenticação global:
- Login/logout
- Dados do usuário
- Estado de carregamento
- Verificação automática de autenticação

### EventContext
Gerencia o estado dos eventos:
- Lista de eventos
- Meus eventos
- Operações CRUD
- Inscrições/cancelamentos

### EventCard
Componente reutilizável para exibir eventos:
- Informações do evento
- Ações (inscrever/cancelar)
- Estados de loading
- Design responsivo

## 🚀 Deploy

### Build de Produção
```bash
pnpm run build
```

### Preview Local
```bash
pnpm run preview
```

### Variáveis de Ambiente
Crie um arquivo `.env` para configurações específicas:
```env
VITE_API_BASE_URL=https://sua-api.com/api
```

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Personalização

### Temas
O projeto usa CSS custom properties para temas. Edite `src/App.css` para personalizar cores.

### Componentes
Todos os componentes shadcn/ui podem ser customizados editando os arquivos em `src/components/ui/`.

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verifique se o backend está configurado para aceitar requisições do frontend
   - Configure `withCredentials: true` se usando cookies

2. **Token expirado**
   - O sistema redireciona automaticamente para login
   - Verifique a configuração do Sanctum no backend

3. **Componentes não carregam**
   - Verifique se todos os imports estão corretos
   - Confirme se as dependências foram instaladas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato.
