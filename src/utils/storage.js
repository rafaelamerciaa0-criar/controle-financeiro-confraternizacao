// Utility functions for localStorage management

export const getExpenses = () => {
  const data = localStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
};

export const saveExpenses = (expenses) => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

export const getPayments = () => {
  const data = localStorage.getItem('payments');
  return data ? JSON.parse(data) : [];
};

export const savePayments = (payments) => {
  localStorage.setItem('payments', JSON.stringify(payments));
};

export const getParticipants = () => {
  const data = localStorage.getItem('participants');
  return data ? JSON.parse(data) : [];
};

export const saveParticipants = (participants) => {
  localStorage.setItem('participants', JSON.stringify(participants));
};

export const calculateTotalExpenses = () => {
  const expenses = getExpenses();
  return expenses.reduce((sum, expense) => sum + expense.value, 0);
};

export const calculateTotalPaid = () => {
  const payments = getPayments();
  return payments.reduce((sum, payment) => sum + (payment.paid ? payment.amount : 0), 0);
};

export const calculateTotalDue = () => {
  const participants = getParticipants();
  return participants.reduce((sum, participant) => sum + (participant.amount || 0), 0);
};

export const calculatePending = () => {
  return calculateTotalDue() - calculateTotalPaid();
};

export const calculateAvailableBalance = () => {
  return calculateTotalPaid() - calculateTotalExpenses();
};

export const calculateForeseenBalance = () => {
  return calculateTotalDue() - calculateTotalExpenses();
};
