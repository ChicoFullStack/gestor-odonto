# Sistema de Gestão de Clínica - Requisitos Funcionais e Não-Funcionais

## 1. Visão Geral
Sistema web para gestão completa de clínicas médicas e estéticas, com foco em agendamentos e controle operacional.

## 2. Módulos do Sistema

### 2.1 Gestão de Agendamentos
- Interface principal de agendamento com:
  - Número de identificação único do agendamento
  - Abas organizadas para:
    - Dados principais
    - Arquivos anexados 
    - Históricos
    - Ações

- Informações Principais do Agendamento:
  - Seleção da unidade (ex: Clínica São Paulo)
  - Dados do cliente:
    - Campo de busca rápida
    - Botão de seleção de cliente
    - Visualização do cliente selecionado
  - Dados do agendamento:
    - Data com calendário interativo
    - Hora início (formato hh:mm)
    - Hora fim (formato hh:mm)
    - Campo para observações
  - Seleções específicas:
    - Procedimento (ex: Limpeza de Pele 50 minutos)
    - Profissional responsável
    - Status do agendamento
    - Sala de atendimento

- Funcionalidades adicionais:
  - Visualização de agendamentos futuros do cliente
  - Histórico de procedimentos
  - Sistema de notificações
  - Controle de conflitos de horário

- Ações principais:
  - Salvar Alterações
  - Excluir agendamento
  - Cancelar operação

### 2.2 Agenda da Unidade
- Visualização em formato de grade (timeline):
  - Cabeçalho com:
    - Nome da unidade
    - Data atual
    - Filtros:
      - Seleção de unidade
      - Seleção de data com calendário
      - Filtro por procedimento
      - Filtro por categoria de usuário
      - Botão de exibir

  - Grade de horários:
    - Colunas para cada profissional
    - Linhas com intervalos de hora (06:00 às 16:00)
    - Indicação de hora início e fim nas laterais
    - Células interativas para agendamento rápido

  - Visualização de agendamentos:
    - Bloco colorido indicando compromisso
    - Informações do agendamento:
      - Unidade
      - Procedimento
      - Nome do cliente
      - Horário início e fim
      - Status do agendamento

  - Funcionalidades da grade:
    - Botões de adicionar/remover em cada célula
    - Navegação entre datas
    - Visualização por profissional
    - Identificação visual de conflitos
    - Diferenciação por cores de status

### 2.3 Gestão de Clientes
- Interface de cadastro com abas:
  - Dados principais
  - Relacionamentos
  - Fotos anexadas
  - Arquivos anexados
  - Oportunidades
  - Histórico
  - Ações

- Dados Cadastrais:
  - Informações básicas:
    - Código do cliente
    - Nome completo/Razão social
    - Unidade vinculada
    - Categoria do cliente
    - Status (ex: Ag. Visita)
    - Origem do cliente (ex: Facebook)
    - Campo para vincular a outros clientes
    - Contato
    - E-mail (com validação de duplicidade)
    - Senha de acesso remoto
    - Data de nascimento

  - Recursos visuais:
    - Foto do cliente
    - QR Code individual
    - Botão para incluir imagem
    - Indicadores de data de inclusão/alteração

- Aba de Relacionamentos:
  - Seções expansíveis:
    - Serviços
    - Avaliações
    - Questionários preenchidos
    - Questionários respondidos relativos às vendas
    - Agendamentos

  - Grid de Agendamentos com:
    - Colunas:
      - Data
      - Horário início
      - Horário término
      - Profissional
      - Status
      - Procedimento
      - Unidade
      - Observações
    - Funcionalidades:
      - Ordenação por colunas
      - Filtro por unidade
      - Contagem total de itens
      - Histórico completo de atendimentos

### 2.4 Gestão Financeira
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Gestão de Vendas:
  - Interface de venda com itens comprados
  - Cadastro de produtos/serviços com:
    - Imagem do produto/serviço
    - Descrição detalhada
    - Código de referência
    - Valor unitário
    - Unidade de medida
  - Controle de quantidade por item
  - Resumo da venda com:
    - Subtotal
    - Campo para frete
    - Campo para referência do transportador
    - Acréscimos
    - Descontos
    - Total da venda
  - Funcionalidades adicionais:
    - Importação de comanda
    - Inclusão rápida de itens
    - Múltiplas formas de pagamento
    - Tabelas de preço diferenciadas

### 2.5 Controles Adicionais
- Videoconferências
- Checklists
- Consultoria de campo
- Gestão de fornecedores
- Gestão de franqueados

### 2.6 Relatórios
- Relatórios gerenciais
- Agenda por especialidades
- Agenda por unidade

## 3. Requisitos Não-Funcionais
- Interface web responsiva
- Sistema multiusuário
- Controle de acesso por perfis
- Backup automático
- Suporte a múltiplas unidades
- Integração com outros sistemas
- Segurança:
  - Autenticação de usuários
  - Registro de logs de ações
  - Backup dos dados
  - Criptografia de dados sensíveis

## 4. Interface
- Menu lateral para navegação principal
- Barra superior com ações rápidas
- Área de busca ampla
- Interface intuitiva e moderna
- Botões de ação claros e bem posicionados
