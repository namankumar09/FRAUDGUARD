/**
 * FraudGuard API Service Client
 * Connects frontend views directly to real server endpoints and persistent database
 */

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Auth
  async login(email?: string, password?: string, role?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return res.json();
  },

  async register(name: string, email: string, role?: string, organization?: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, organization }),
    });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  async updateProfile(updates: any) {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Transactions
  async getTransactions(params?: {
    search?: string;
    riskLevel?: string;
    decision?: string;
    status?: string;
    country?: string;
    paymentMethod?: string;
    dateRange?: string;
    minAmount?: number;
    maxAmount?: number;
    limit?: number;
    page?: number;
    sort?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.set(k, String(v));
        }
      });
    }
    const res = await fetch(`/api/transactions?${query.toString()}`);
    return res.json();
  },

  async getTransactionById(id: string) {
    const res = await fetch(`/api/transactions/${id}`);
    return res.json();
  },

  async createTransaction(input: any) {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return res.json();
  },

  async updateTransactionDecision(id: string, decision: string, reason?: string, reviewerName?: string) {
    const res = await fetch(`/api/transactions/${id}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, reason, reviewerName }),
    });
    return res.json();
  },

  async resetSeedDatabase() {
    const res = await fetch('/api/transactions/seed-reset', {
      method: 'POST',
    });
    return res.json();
  },

  // Customers
  async getCustomers(params?: { search?: string; riskLevel?: string; status?: string; sort?: string }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, String(v));
      });
    }
    const res = await fetch(`/api/customers?${query.toString()}`);
    return res.json();
  },

  async getCustomerById(id: string) {
    const res = await fetch(`/api/customers/${id}`);
    return res.json();
  },

  async updateCustomerStatus(id: string, status: string, reviewer?: string) {
    const res = await fetch(`/api/customers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewer }),
    });
    return res.json();
  },

  // Alerts
  async getAlerts(params?: { riskLevel?: string; status?: string; type?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, String(v));
      });
    }
    const res = await fetch(`/api/alerts?${query.toString()}`);
    return res.json();
  },

  async updateAlert(id: string, updates: any) {
    const res = await fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Cases
  async getCases(params?: { status?: string; priority?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, String(v));
      });
    }
    const res = await fetch(`/api/cases?${query.toString()}`);
    return res.json();
  },

  async getCaseById(id: string) {
    const res = await fetch(`/api/cases/${id}`);
    return res.json();
  },

  async createCase(caseData: {
    title: string;
    description?: string;
    priority?: string;
    assignedTo?: string;
    relatedTransactionIds?: string[];
    relatedCustomerIds?: string[];
    tags?: string[];
  }) {
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    return res.json();
  },

  async updateCase(id: string, updates: any) {
    const res = await fetch(`/api/cases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async addCaseNote(caseId: string, note: string, authorName?: string, authorRole?: string) {
    const res = await fetch(`/api/cases/${caseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, authorName, authorRole }),
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch('/api/notifications/read-all', {
      method: 'POST',
    });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch('/api/analytics');
    return res.json();
  },

  // AI Actions
  async askAssistant(message: string, history: any[] = [], context: any = {}) {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history, context }),
    });
    return res.json();
  },

  async explainTransactionWithAi(transactionId: string) {
    const res = await fetch('/api/ai/explain-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    return res.json();
  },

  async summarizeCustomerWithAi(customerId: string) {
    const res = await fetch('/api/ai/summarize-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });
    return res.json();
  },

  async summarizeCaseWithAi(caseId: string) {
    const res = await fetch('/api/ai/summarize-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId }),
    });
    return res.json();
  },

  // Simulator
  async evaluateSimulation(payload: any) {
    const res = await fetch('/api/simulator/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Audit Logs
  async getAuditLogs() {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },
};
