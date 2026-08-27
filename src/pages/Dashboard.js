import React, { useState, useEffect } from 'react';
import { getExpenses, getPayments, getParticipants, calculateTotalExpenses, calculateTotalPaid, calculateTotalDue, calculatePending, calculateAvailableBalance, calculateForeseenBalance } from '../utils/storage';
import FinancialSummary from '../components/FinancialSummary';
import BudgetAlert from '../components/BudgetAlert';
import ExpenseChart from '../components/ExpenseChart';
import '../styles/pages/Dashboard.css';

function Dashboard({ userRole }) {
  const [totalDue, setTotalDue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [pending, setPending] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [foreseenBalance, setForeseenBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [budgetPercentage, setBudgetPercentage] = useState(0);

  useEffect(() => {
    updateDashboard();
    
    // Atualizar dashboard a cada 1 segundo
    const interval = setInterval(updateDashboard, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDashboard = () => {
    const due = calculateTotalDue();
    const paid = calculateTotalPaid();
    const expTotal = calculateTotalExpenses();
    const pend = calculatePending();
    const balance = calculateAvailableBalance();
    const fBalance = calculateForeseenBalance();
    const allExpenses = getExpenses();

    setTotalDue(due);
    setTotalPaid(paid);
    setTotalExpenses(expTotal);
    setPending(pend);
    setAvailableBalance(balance);
    setForeseenBalance(fBalance);
    setExpenses(allExpenses);

    // Calcular percentual de orçamento utilizado
    if (paid > 0) {
      setBudgetPercentage((expTotal / paid) * 100);
    }
  };

  const isBudgetCritical = budgetPercentage >= 100;
  const isBudgetWarning = budgetPercentage >= 75 && budgetPercentage < 100;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏡 Dashboard Financeiro</h1>
        <p>Acompanhamento em tempo real</p>
      </div>

      {/* Alertas */}
      {(isBudgetCritical || isBudgetWarning) && (
        <BudgetAlert
          isCritical={isBudgetCritical}
          percentage={budgetPercentage}
          deficit={isBudgetCritical ? Math.abs(availableBalance) : 0}
        />
      )}

      {/* Resumo Financeiro */}
      <FinancialSummary
        totalDue={totalDue}
        totalPaid={totalPaid}
        totalExpenses={totalExpenses}
        pending={pending}
        availableBalance={availableBalance}
        foreseenBalance={foreseenBalance}
        budgetPercentage={budgetPercentage}
      />

      {/* Gráficos */}
      <div className="dashboard-charts">
        <ExpenseChart expenses={expenses} />
      </div>

      {/* Últimas Despesas */}
      {userRole === 'admin' && (
        <div className="recent-expenses">
          <div className="recent-header">
            <h2>📄 Últimas Despesas</h2>
            <a href="/despesas" className="view-all">Ver Todas →</a>
          </div>
          <div className="expenses-list">
            {expenses.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>Nenhuma despesa cadastrada</p>
              </div>
            ) : (
              expenses.slice(-5).reverse().map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <div className="expense-category">
                      {expense.category}
                    </div>
                    <div className="expense-details">
                      <p className="expense-desc">{expense.description}</p>
                      <p className="expense-date">{new Date(expense.date).toLocaleDateString('pt-BR')} às {expense.time}</p>
                    </div>
                  </div>
                  <div className="expense-value">
                    <span>R$ {expense.value.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
