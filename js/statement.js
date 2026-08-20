const accountList = [
  { id: 'all', label: 'Todas as contas' },
  { id: 'bb', label: 'Banco do Brasil', number: '4821' },
  { id: 'itau', label: 'Itaú', number: '1234' },
  { id: 'nubank', label: 'Nubank', number: '5678' },
  { id: 'wallet', label: 'Carteira' }
];

const transactions = [
  { id: 1, date: '2026-08-20', description: 'Salário', category: 'Salário', label: 'Banco do Brasil', accountId: 'bb', type: 'income', value: 4500, beneficiary: 'Empresa', paymentMethod: 'Pix', note: 'Pagamento de salário mensal', createdAt: '2026-08-20T08:00:00', updatedAt: '2026-08-20T08:00:00', status: 'confirmado' },
  { id: 2, date: '2026-08-19', description: 'Posto de combustível', category: 'Combustível', label: 'Banco do Brasil', accountId: 'bb', type: 'expense', value: 180, beneficiary: 'Posto Faria', paymentMethod: 'Cartão de débito', note: 'Abastecimento da semana', createdAt: '2026-08-19T17:40:00', updatedAt: '2026-08-19T17:40:00', status: 'confirmado' },
  { id: 3, date: '2026-08-18', description: 'Supermercado', category: 'Alimentação', label: 'Banco do Brasil', accountId: 'bb', type: 'expense', value: 425.8, beneficiary: 'Supermercado ABC', paymentMethod: 'Cartão de crédito', note: 'Compras do mês', createdAt: '2026-08-18T12:00:00', updatedAt: '2026-08-18T12:00:00', status: 'confirmado' },
  { id: 4, date: '2026-08-17', description: 'Transferência', category: 'Transferências', label: 'Banco do Brasil', accountId: 'bb', type: 'transfer', value: 300, beneficiary: 'João', paymentMethod: 'TED', note: 'Pagamento de ajuda', createdAt: '2026-08-17T15:15:00', updatedAt: '2026-08-17T15:15:00', status: 'confirmado' },
  { id: 5, date: '2026-08-16', description: 'Pix recebido', category: 'Transferência recebida', label: 'Banco do Brasil', accountId: 'bb', type: 'income', value: 750, beneficiary: 'Maria', paymentMethod: 'Pix', note: 'Pagamento por serviço', createdAt: '2026-08-16T09:10:00', updatedAt: '2026-08-16T09:10:00', status: 'confirmado' },
  { id: 6, date: '2026-08-13', description: 'Aluguel', category: 'Moradia', label: 'Banco do Brasil', accountId: 'bb', type: 'expense', value: 1450, beneficiary: 'Imobiliária Vida Nova', paymentMethod: 'Débito automático', note: 'Cobrança de agosto', createdAt: '2026-08-13T03:00:00', updatedAt: '2026-08-13T03:00:00', status: 'confirmado' },
  { id: 7, date: '2026-08-09', description: 'Renda extra', category: 'Rendimentos', label: 'Nubank', accountId: 'nubank', type: 'income', value: 680, beneficiary: 'Freelancer', paymentMethod: 'Pix', note: 'Projeto de design', createdAt: '2026-08-09T19:00:00', updatedAt: '2026-08-09T19:00:00', status: 'pendente' },
  { id: 8, date: '2026-08-08', description: 'Mensalidade academia', category: 'Saúde', label: 'Nubank', accountId: 'nubank', type: 'expense', value: 120, beneficiary: 'Academia Fit', paymentMethod: 'Cartão', note: 'Mensalidade', createdAt: '2026-08-08T10:35:00', updatedAt: '2026-08-08T10:35:00', status: 'confirmado' },
  { id: 9, date: '2026-08-05', description: 'Transferência entre contas', category: 'Transferências', label: 'Itaú', accountId: 'itau', type: 'transfer', value: 500, beneficiary: 'Banco do Brasil', paymentMethod: 'TED', note: 'Transferência para reserva', createdAt: '2026-08-05T13:00:00', updatedAt: '2026-08-05T13:00:00', status: 'confirmado' },
  { id: 10, date: '2026-08-02', description: 'Farmácia', category: 'Saúde', label: 'Carteira', accountId: 'wallet', type: 'expense', value: 94.5, beneficiary: 'Farmácia do Bairro', paymentMethod: 'Dinheiro', note: 'Medicamentos', createdAt: '2026-08-02T09:45:00', updatedAt: '2026-08-02T09:45:00', status: 'confirmado' }
];

const state = {
  activeAccount: 'all',
  hideBalance: false,
  period: 'month',
  search: '',
  filters: {
    category: 'Todas',
    type: 'Todas',
    status: 'Todos',
    account: 'Todas as contas'
  },
  selectedTransaction: null,
  visibleItems: 5
};

const formatBRL = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatSigned = (value) => {
  const sign = value > 0 ? '+' : '-';
  return `${sign} ${formatBRL(Math.abs(value))}`;
};

const matchesAccount = (transaction) => {
  if (state.activeAccount === 'all') return true;
  return transaction.accountId === state.activeAccount;
};

const matchesSearch = (transaction) => {
  if (!state.search) return true;
  const haystack = [
    transaction.description,
    transaction.category,
    transaction.label,
    transaction.beneficiary,
    transaction.note
  ].join(' ').toLowerCase();
  return haystack.includes(state.search.toLowerCase());
};

const matchesFilters = (transaction) => {
  if (state.filters.category && state.filters.category !== 'Todas' && transaction.category !== state.filters.category) {
    return false;
  }

  if (state.filters.type && state.filters.type !== 'Todas') {
    const typeMap = {
      Entradas: 'income',
      Saídas: 'expense',
      Transferências: 'transfer'
    };

    if (typeMap[state.filters.type] !== transaction.type) {
      return false;
    }
  }

  if (state.filters.status && state.filters.status !== 'Todos' && transaction.status !== state.filters.status.toLowerCase()) {
    return false;
  }

  return true;
};

const getFilteredTransactions = () => {
  const current = transactions.filter((transaction) => {
    const byAccount = matchesAccount(transaction);
    const bySearch = matchesSearch(transaction);
    const byFilters = matchesFilters(transaction);
    const byPeriod = transaction.date.startsWith('2026-08');
    return byAccount && bySearch && byFilters && byPeriod;
  });

  return current.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getBalance = () => {
  const current = getFilteredTransactions();
  return current.reduce((total, item) => {
    if (item.type === 'income') return total + item.value;
    if (item.type === 'expense') return total - item.value;
    if (item.type === 'transfer') return total;
    return total;
  }, 0);
};

const getSummary = () => {
  const current = getFilteredTransactions();
  const income = current.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.value, 0);
  const expense = current.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.value, 0);
  const result = income - expense;
  return { income, expense, result };
};

const renderHeaderBalance = () => {
  const amountNode = document.querySelector('[data-balance]');
  const value = getBalance();
  amountNode.textContent = state.hideBalance ? 'R$ ••••••' : formatBRL(value);
};

const renderSummary = () => {
  const summary = getSummary();
  const entries = document.querySelector('[data-summary="income"]');
  const expenses = document.querySelector('[data-summary="expense"]');
  const result = document.querySelector('[data-summary="result"]');

  entries.textContent = `+ ${formatBRL(summary.income)}`;
  expenses.textContent = `- ${formatBRL(summary.expense)}`;
  result.textContent = formatBRL(summary.result);
};

const renderTransactionList = () => {
  const wrapper = document.querySelector('#transactionList');
  const filtered = getFilteredTransactions();
  const visible = filtered.slice(0, state.visibleItems);

  if (!filtered.length) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <span class="emoji">📄</span>
        <h3>Nenhuma movimentação corresponde aos filtros.</h3>
        <p>Seu histórico estará disponível assim que mais lançamentos forem registrados.</p>
        <button class="secondary-btn" type="button" data-clear-filters>Limpar filtros</button>
      </div>
    `;
    return;
  }

  const grouped = visible.reduce((acc, item) => {
    const dateKey = new Date(item.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  wrapper.innerHTML = Object.entries(grouped).map(([dateKey, items]) => `
    <li class="date-group">
      <div class="date-tag">${dateKey.toUpperCase()}</div>
      ${items.map((item) => `
        <button class="transaction-item" type="button" data-transaction-id="${item.id}">
          <span class="transaction-icon ${item.type === 'income' ? 'income' : item.type === 'expense' ? 'expense' : 'transfer'}">
            ${item.type === 'income' ? '↗' : item.type === 'expense' ? '↘' : '⇄'}
          </span>
          <span class="transaction-main">
            <strong>${item.description}</strong>
            <span class="meta-line">
              <span>${item.category}</span>
              <span>•</span>
              <span>${item.label}</span>
            </span>
          </span>
          <span class="transaction-meta">
            <span class="transaction-type">${item.type === 'income' ? 'Entrada' : item.type === 'expense' ? 'Saída' : 'Transferência'}</span>
            <span class="transaction-date">${new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
          </span>
          <span class="transaction-value ${item.type === 'income' ? 'income' : item.type === 'expense' ? 'expense' : 'transfer'}">${item.type === 'income' ? '+' : item.type === 'expense' ? '-' : '-'} ${formatBRL(item.value)}</span>
        </button>
      `).join('')}
    </li>
  `).join('');

  const loadMoreBtn = document.querySelector('[data-load-more]');
  if (state.visibleItems < filtered.length) {
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.textContent = `Carregar mais (${filtered.length - state.visibleItems})`;
  } else {
    loadMoreBtn.style.display = 'none';
  }

  document.querySelectorAll('[data-transaction-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const transaction = transactions.find((item) => item.id === Number(button.dataset.transactionId));
      state.selectedTransaction = transaction;
      renderDetailPanel();
    });
  });
};

const renderDetailPanel = () => {
  const panel = document.querySelector('#detailPanel');
  const current = state.selectedTransaction;

  if (!current) {
    panel.classList.add('hidden');
    panel.innerHTML = '<h3>Detalhes da movimentação</h3><p>Selecione uma movimentação para ver os detalhes.</p>';
    return;
  }

  panel.classList.remove('hidden');
  panel.innerHTML = `
    <h3>Detalhes da movimentação</h3>
    <div class="detail-row"><span>Descrição</span><strong>${current.description}</strong></div>
    <div class="detail-row"><span>Valor</span><strong>${formatSigned(current.type === 'income' ? current.value : current.type === 'expense' ? -current.value : -current.value)}</strong></div>
    <div class="detail-row"><span>Data</span><strong>${new Date(current.date).toLocaleDateString('pt-BR')}</strong></div>
    <div class="detail-row"><span>Tipo</span><strong>${current.type === 'income' ? 'Entrada' : current.type === 'expense' ? 'Saída' : 'Transferência'}</strong></div>
    <div class="detail-row"><span>Categoria</span><strong>${current.category}</strong></div>
    <div class="detail-row"><span>Conta</span><strong>${current.label}</strong></div>
    <div class="detail-row"><span>Beneficiário</span><strong>${current.beneficiary || '—'}</strong></div>
    <div class="detail-row"><span>Forma de pagamento</span><strong>${current.paymentMethod}</strong></div>
    <div class="detail-row"><span>Observação</span><strong>${current.note}</strong></div>
    <div class="detail-row"><span>Saldo após movimentação</span><strong>${formatBRL(getBalance())}</strong></div>
    <div class="detail-row"><span>Criado em</span><strong>${new Date(current.createdAt).toLocaleString('pt-BR')}</strong></div>
    <div class="detail-row"><span>Atualizado em</span><strong>${new Date(current.updatedAt).toLocaleString('pt-BR')}</strong></div>
    <div class="detail-actions">
      <button class="secondary-btn" type="button">Editar</button>
      <button class="ghost-btn" type="button">Duplicar</button>
      <button class="primary-btn" type="button">Excluir</button>
    </div>
  `;
};

const renderAccountSelector = () => {
  const button = document.querySelector('[data-account-button]');
  const activeLabel = accountList.find((account) => account.id === state.activeAccount) || accountList[0];
  button.innerHTML = `
    <div class="account-selector-main">
      <span class="bank-badge">🏦</span>
      <span class="account-name">
        <strong>${activeLabel.label}</strong>
        <span>${activeLabel.number ? `Conta •••• ${activeLabel.number}` : 'Todas as contas'}</span>
      </span>
    </div>
    <span class="chevron">▾</span>
  `;

  const menu = document.querySelector('[data-account-menu]');
  menu.innerHTML = accountList.map((account) => `
    <button class="account-option ${state.activeAccount === account.id ? 'active' : ''}" type="button" data-account-id="${account.id}">
      <span>
        <strong>${account.label}</strong>
        ${account.number ? `<br><span>•••• ${account.number}</span>` : ''}
      </span>
      ${state.activeAccount === account.id ? '✓' : ''}
    </button>
  `).join('');

  menu.querySelectorAll('[data-account-id]').forEach((buttonItem) => {
    buttonItem.addEventListener('click', () => {
      state.activeAccount = buttonItem.dataset.accountId;
      document.querySelector('.account-selector').classList.remove('open');
      renderAccountSelector();
      renderHeaderBalance();
      renderSummary();
      renderTransactionList();
    });
  });
};

const renderFilters = () => {
  const category = document.querySelector('#filterCategory');
  const type = document.querySelector('#filterType');
  const status = document.querySelector('#filterStatus');
  const account = document.querySelector('#filterAccount');

  category.innerHTML = ['Todas', 'Alimentação', 'Combustível', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Assinaturas', 'Salário', 'Rendimentos', 'Transferências', 'Outros'].map((item) => `<option>${item}</option>`).join('');
  type.innerHTML = ['Todas', 'Entradas', 'Saídas', 'Transferências'].map((item) => `<option>${item}</option>`).join('');
  status.innerHTML = ['Todos', 'Confirmado', 'Pendente'].map((item) => `<option>${item}</option>`).join('');
  account.innerHTML = ['Todas as contas', 'Banco do Brasil', 'Itaú', 'Nubank', 'Carteira'].map((item) => `<option>${item}</option>`).join('');
};

const openModal = () => {
  document.querySelector('#filterModal').classList.add('open');
};

const closeModal = () => {
  document.querySelector('#filterModal').classList.remove('open');
};

const applyFilters = () => {
  const category = document.querySelector('#filterCategory').value;
  const type = document.querySelector('#filterType').value;
  const status = document.querySelector('#filterStatus').value;
  const account = document.querySelector('#filterAccount').value;

  state.filters = { category, type, status: status === 'Todos' ? 'Todos' : status.toLowerCase(), account };
  closeModal();
  renderTransactionList();
};

const clearFilters = () => {
  state.search = '';
  document.querySelector('#searchInput').value = '';
  state.filters = { category: 'Todas', type: 'Todas', status: 'Todos', account: 'Todas as contas' };
  renderFilters();
  renderTransactionList();
};

const bindEvents = () => {
  document.querySelector('[data-account-button]').addEventListener('click', () => {
    const selector = document.querySelector('.account-selector');
    selector.classList.toggle('open');
  });

  document.querySelector('[data-toggle-balance]').addEventListener('click', () => {
    state.hideBalance = !state.hideBalance;
    const button = document.querySelector('[data-toggle-balance]');
    button.textContent = state.hideBalance ? '👁 Mostrar saldo' : '👁 Ocultar saldo';
    renderHeaderBalance();
  });

  document.querySelector('#searchInput').addEventListener('input', (event) => {
    state.search = event.target.value.trim();
    renderTransactionList();
  });

  document.querySelector('[data-open-filters]').addEventListener('click', openModal);
  document.querySelector('[data-close-filters]').addEventListener('click', closeModal);
  document.querySelector('[data-apply-filters]').addEventListener('click', applyFilters);
  document.querySelector('[data-clear-filters]').addEventListener('click', clearFilters);
  document.querySelector('[data-load-more]').addEventListener('click', () => {
    state.visibleItems += 5;
    renderTransactionList();
  });

  document.querySelector('#filterModal').addEventListener('click', (event) => {
    if (event.target.id === 'filterModal') closeModal();
  });
};

const init = () => {
  renderAccountSelector();
  renderFilters();
  renderHeaderBalance();
  renderSummary();
  renderTransactionList();
  renderDetailPanel();
  bindEvents();
};

init();
