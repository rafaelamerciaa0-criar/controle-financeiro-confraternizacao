export const EXPENSE_CATEGORIES = {
  food: { label: '🍽️ Alimentação', color: '#f59e0b' },
  drinks: { label: '🥤 Bebidas', color: '#3b82f6' },
  cake: { label: '🎂 Bolo/Doces', color: '#ec4899' },
  decoration: { label: '🎈 Decoração', color: '#8b5cf6' },
  music: { label: '🎵 Música', color: '#ef4444' },
  gifts: { label: '🎁 Brindes', color: '#06b6d4' },
  venue: { label: '🏠 Local', color: '#14b8a6' },
  transport: { label: '🚗 Transporte', color: '#f97316' },
  materials: { label: '📦 Materiais', color: '#6366f1' },
  other: { label: '💳 Outros', color: '#6b7280' }
};

export const PAYMENT_STATUSES = {
  pending: { label: 'Pendente', color: '#f59e0b', icon: '⏳' },
  paid: { label: 'Pago', color: '#22c55e', icon: '✅' },
  overdue: { label: 'Atrasado', color: '#ef4444', icon: '⚠️' }
};

export const BUDGET_ALERT_THRESHOLDS = {
  warning: 0.75, // 75% = amarelo
  critical: 1.0  // 100%+ = vermelho
};
