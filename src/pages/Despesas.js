import React, { useState, useEffect } from 'react';
import { getExpenses, saveExpenses } from '../utils/storage';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import ExpenseModal from '../components/ExpenseModal';
import '../styles/pages/Despesas.css';

function Despesas({ userRole }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, selectedCategory, dateRange, searchTerm]);

  const loadExpenses = () => {
    const data = getExpenses();
    setExpenses(data);
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Filtrar por período
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(exp => new Date(exp.date) >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(exp => new Date(exp.date) <= endDate);
    }

    // Pesquisar
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
    setTotalExpenses(filtered.reduce((sum, exp) => sum + exp.value, 0));
  };

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData
    };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    saveExpenses(updated);
    setShowModal(false);
  };

  const handleEditExpense = (expenseData) => {
    const updated = expenses.map(exp =>
      exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp
    );
    setExpenses(updated);
    saveExpenses(updated);
    setEditingExpense(null);
    setShowModal(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta despesa?')) {
      const updated = expenses.filter(exp => exp.id !== id);
      setExpenses(updated);
      saveExpenses(updated);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  if (userRole !== 'admin') {
    return (
      <div className="unauthorized">
        <i className="fas fa-lock"></i>
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem acessar esta seção</p>
      </div>
    );
  }

  return (
    <div className="despesas-container">
      <div className="despesas-header">
        <div>
          <h1>🧾 Controle de Despesas</h1>
          <p>Cadastre e acompanhe todas as despesas da confraternização</p>
        </div>
        <button className="btn-add-expense" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i>
          Nova Despesa
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Pesquisar</label>
          <input
            type="text"
            placeholder="Nome da despesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">Todas as categorias</option>
            {Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Data Inicial</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Data Final</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>

        <button
          className="btn-clear-filters"
          onClick={() => {
            setSelectedCategory('all');
            setDateRange({ start: '', end: '' });
            setSearchTerm('');
          }}
        >
          <i className="fas fa-redo"></i>
          Limpar Filtros
        </button>
      </div>

      {/* Total */}
      <div className="total-expenses-card">
        <div className="total-info">
          <h3>Total de Despesas</h3>
          <p className="total-value">R$ {totalExpenses.toFixed(2)}</p>
          <p className="total-count">{filteredExpenses.length} despesa{filteredExpenses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Lista de Despesas */}
      <div className="expenses-table-container">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Nenhuma despesa encontrada</p>
          </div>
        ) : (
          <div className="expenses-grid">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="expense-card">
                <div className="expense-card-header">
                  <div className="expense-category-badge">
                    {EXPENSE_CATEGORIES[expense.category]?.label}
                  </div>
                  <div className="expense-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenModal(expense)}
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteExpense(expense.id)}
                      title="Deletar"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="expense-card-body">
                  <p className="expense-description">{expense.description}</p>
                  <div className="expense-meta">
                    <span className="expense-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="expense-time">
                      <i className="fas fa-clock"></i>
                      {expense.time}
                    </span>
                  </div>
                  {expense.observation && (
                    <p className="expense-observation">📝 {expense.observation}</p>
                  )}
                </div>
                <div className="expense-card-footer">
                  <span className="expense-card-value">R$ {expense.value.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ExpenseModal
          onClose={handleCloseModal}
          onSave={editingExpense ? handleEditExpense : handleAddExpense}
          initialData={editingExpense}
        />
      )}
    </div>
  );
}

export default Despesas;
