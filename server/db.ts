import fs from 'fs';
import path from 'path';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Fraud Analyst' | 'Investigator' | 'Viewer';
  title?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  organization: string;
  createdAt: string;
  lastActive: string;
  status: 'Active' | 'Suspended';
}

export interface DbRiskSignal {
  id: string;
  signalName: string;
  category: 'behavioral' | 'transaction' | 'device' | 'location' | 'velocity' | 'rehearsal';
  severity: 'low' | 'elevated' | 'critical';
  contribution: number;
  details: string;
  microEvidence: string;
}

export interface DbTransaction {
  id: string;
  transactionRef: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Wire Transfer' | 'Net Banking' | 'Crypto Gateway';
  country: string;
  city: string;
  deviceId: string;
  deviceType: 'Mobile (Android)' | 'Mobile (iOS)' | 'Desktop (Mac)' | 'Desktop (Windows)' | 'Headless Browser';
  ipAddress: string;
  timestamp: string;
  createdAt: number; // unix ms
  riskScore: number; // 0 - 100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  decision: 'APPROVE' | 'REVIEW' | 'STEP_UP_CHALLENGED' | 'BLOCKED';
  status: 'PENDING_REVIEW' | 'RESOLVED_CLEAN' | 'STEP_UP_CHALLENGED' | 'AUTO_BLOCKED' | 'BLOCKED';
  primaryDriver: string;
  signals: DbRiskSignal[];
  beneficiaryName: string;
  beneficiaryAccount: string;
  isNewBeneficiary: boolean;
  mlAnomalyScore: number; // 0.0 - 1.0
  mlExplanation: string;
  behavioralCadenceMs: number;
  clipboardPasteLatencySec: number;
  failedLoginAttemptsRecent: number;
  velocityLastHour: number;
}

export interface DbCustomer {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  accountAgeDays: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  transactionCount: number;
  totalAmount: number;
  avgTransactionAmount: number;
  usualDevices: string[];
  usualCountries: string[];
  lastActivity: string;
  status: 'Verified' | 'Under Review' | 'Restricted' | 'Flagged';
  biometricBaselineCadenceMs: number;
  behaviorSummary: string;
  notesCount: number;
}

export interface DbAlert {
  id: string;
  alertRef: string;
  type: 'TRANSACTION_ANOMALY' | 'BOT_REHEARSAL' | 'ACCOUNT_TAKEOVER' | 'ZERO_DAY_CLUSTER' | 'VELOCITY_SPIKE';
  title: string;
  description: string;
  transactionId?: string;
  customerId: string;
  customerName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  timestampMs: number;
  assignedTo?: string;
  actionTaken?: string;
}

export interface DbCaseNote {
  id: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
}

export interface DbCase {
  id: string;
  caseRef: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'Open' | 'Investigating' | 'Escalated' | 'Resolved' | 'False Positive' | 'Confirmed Fraud';
  assignedTo: string;
  relatedTransactionIds: string[];
  relatedCustomerIds: string[];
  tags: string[];
  notes: DbCaseNote[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionSummary?: string;
}

export interface DbNotification {
  id: string;
  userId?: string;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  read: boolean;
  createdAt: string;
  linkView?: string;
  relatedId?: string;
}

export interface DbAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  customers: DbCustomer[];
  transactions: DbTransaction[];
  alerts: DbAlert[];
  cases: DbCase[];
  notifications: DbNotification[];
  auditLogs: DbAuditLog[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'fraudguard_db.json');

// Ensure data folder exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadFromDisk();
    if (this.db.customers.length === 0 || this.db.transactions.length < 50) {
      console.log('[DB] Seeding comprehensive synthetic database (100+ customers, 500+ transactions)...');
      this.seedData();
      this.saveToDisk();
    }
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[DB] Failed to read database from disk, creating fresh DB:', err);
    }

    return {
      users: [],
      customers: [],
      transactions: [],
      alerts: [],
      cases: [],
      notifications: [],
      auditLogs: [],
    };
  }

  public saveToDisk(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving to disk:', err);
    }
  }

  public getSnapshot(): DatabaseSchema {
    return this.db;
  }

  // Getters
  public getUsers(): DbUser[] {
    return this.db.users;
  }

  public getCustomers(): DbCustomer[] {
    return this.db.customers;
  }

  public getCustomerById(id: string): DbCustomer | undefined {
    return this.db.customers.find((c) => c.id === id);
  }

  public getTransactions(): DbTransaction[] {
    return this.db.transactions;
  }

  public getTransactionById(id: string): DbTransaction | undefined {
    return this.db.transactions.find((t) => t.id === id);
  }

  public getAlerts(): DbAlert[] {
    return this.db.alerts;
  }

  public getCases(): DbCase[] {
    return this.db.cases;
  }

  public getNotifications(): DbNotification[] {
    return this.db.notifications;
  }

  public getAuditLogs(): DbAuditLog[] {
    return this.db.auditLogs;
  }

  // Mutations
  public addTransaction(txn: DbTransaction): void {
    this.db.transactions.unshift(txn);
    // Update customer stats
    const cust = this.db.customers.find((c) => c.id === txn.customerId);
    if (cust) {
      cust.transactionCount += 1;
      cust.totalAmount += txn.amount;
      cust.lastActivity = 'Just now';
      if (txn.riskScore > cust.riskScore) {
        cust.riskScore = Math.max(cust.riskScore, txn.riskScore);
        cust.riskLevel = txn.riskLevel;
      }
    }
    this.saveToDisk();
  }

  public updateTransaction(id: string, updates: Partial<DbTransaction>): DbTransaction | null {
    const idx = this.db.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.db.transactions[idx] = { ...this.db.transactions[idx], ...updates };
    this.saveToDisk();
    return this.db.transactions[idx];
  }

  public addCustomer(customer: DbCustomer): void {
    this.db.customers.unshift(customer);
    this.saveToDisk();
  }

  public updateCustomer(id: string, updates: Partial<DbCustomer>): DbCustomer | null {
    const idx = this.db.customers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.customers[idx] = { ...this.db.customers[idx], ...updates };
    this.saveToDisk();
    return this.db.customers[idx];
  }

  public addAlert(alert: DbAlert): void {
    this.db.alerts.unshift(alert);
    // Add notification automatically
    this.addNotification({
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: alert.title,
      description: alert.description,
      type: alert.riskLevel === 'critical' || alert.riskLevel === 'high' ? 'danger' : 'warning',
      read: false,
      createdAt: 'Just now',
      linkView: 'alerts_investigations',
      relatedId: alert.id,
    });
    this.saveToDisk();
  }

  public updateAlert(id: string, updates: Partial<DbAlert>): DbAlert | null {
    const idx = this.db.alerts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.db.alerts[idx] = { ...this.db.alerts[idx], ...updates };
    this.saveToDisk();
    return this.db.alerts[idx];
  }

  public addCase(newCase: DbCase): void {
    this.db.cases.unshift(newCase);
    this.addNotification({
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `New Case Created: ${newCase.caseRef}`,
      description: newCase.title,
      type: 'info',
      read: false,
      createdAt: 'Just now',
      linkView: 'case_management',
      relatedId: newCase.id,
    });
    this.saveToDisk();
  }

  public updateCase(id: string, updates: Partial<DbCase>): DbCase | null {
    const idx = this.db.cases.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.cases[idx] = { ...this.db.cases[idx], ...updates, updatedAt: 'Just now' };
    this.saveToDisk();
    return this.db.cases[idx];
  }

  public addNotification(notif: DbNotification): void {
    this.db.notifications.unshift(notif);
    if (this.db.notifications.length > 100) {
      this.db.notifications = this.db.notifications.slice(0, 100);
    }
    this.saveToDisk();
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.db.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    this.saveToDisk();
  }

  public markAllNotificationsAsRead(): void {
    this.db.notifications.forEach((n) => (n.read = true));
    this.saveToDisk();
  }

  public logAudit(log: Omit<DbAuditLog, 'id' | 'timestamp'>): void {
    this.db.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...log,
      timestamp: new Date().toISOString(),
    });
    if (this.db.auditLogs.length > 500) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 500);
    }
    this.saveToDisk();
  }

  public resetToSeed(): void {
    this.seedData();
    this.saveToDisk();
  }

  // Comprehensive Realistic Dataset Generation
  private seedData(): void {
    // 1. Users
    const defaultUsers: DbUser[] = [
      {
        id: 'usr-admin-1',
        name: 'Naman Kumar',
        email: 'kumarnaman0907@gmail.com',
        role: 'Admin',
        title: 'Principal Fraud Operations Director',
        department: 'Financial Crimes & Biometric Intelligence Unit',
        phone: '+91 98765 43210',
        organization: 'FraudGuard Enterprise AI Network',
        createdAt: '2025-01-10T08:00:00Z',
        lastActive: 'Just now',
        status: 'Active',
      },
      {
        id: 'usr-analyst-2',
        name: 'Priya Sharma',
        email: 'priya.sharma@fraudguard.io',
        role: 'Fraud Analyst',
        title: 'Senior Risk Intelligence Analyst',
        department: 'Tier-2 Forensic Response',
        phone: '+91 98123 45678',
        organization: 'FraudGuard Enterprise AI Network',
        createdAt: '2025-02-14T09:30:00Z',
        lastActive: '5 mins ago',
        status: 'Active',
      },
      {
        id: 'usr-inv-3',
        name: 'Marcus Vance',
        email: 'marcus.v@fraudguard.io',
        role: 'Investigator',
        title: 'Lead Financial Crimes Special Agent',
        department: 'Organized Crime Syndicates',
        phone: '+1 415 555 0192',
        organization: 'FraudGuard Enterprise AI Network',
        createdAt: '2025-03-01T11:00:00Z',
        lastActive: '25 mins ago',
        status: 'Active',
      },
      {
        id: 'usr-view-4',
        name: 'Auditor Demo',
        email: 'auditor@compliance.org',
        role: 'Viewer',
        title: 'External Regulatory Compliance Officer',
        department: 'Risk Governance & Audit',
        phone: '+44 20 7946 0912',
        organization: 'Global FinTech Regulatory Board',
        createdAt: '2025-04-10T14:20:00Z',
        lastActive: '1 hour ago',
        status: 'Active',
      },
    ];

    // 2. Customers (100+ customers)
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Saanvi', 'Myra', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Sneha', 'Rahul', 'Rohan', 'Vikram', 'Pooja', 'Sunita', 'Amit', 'Neha', 'Deepak', 'Sanjay', 'Kavita', 'Mohan', 'Rajesh', 'Anil', 'Sunil', 'Suresh', 'Manish', 'Alok', 'Preeti', 'Swati', 'Meera'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Joshi', 'Kulkarni', 'Deshmukh', 'Singhania', 'Kapoor', 'Malhotra', 'Bhatia', 'Saxena', 'Chawla', 'Agarwal', 'Bansal', 'Chopra', 'Rao', 'Choudhury', 'Ghosh', 'Chatterjee', 'Mukherjee', 'Dutta', 'Das', 'Sen', 'Banerjee'];
    const cities = [
      { city: 'Mumbai', country: 'India' },
      { city: 'Bengaluru', country: 'India' },
      { city: 'New Delhi', country: 'India' },
      { city: 'Hyderabad', country: 'India' },
      { city: 'Pune', country: 'India' },
      { city: 'Chennai', country: 'India' },
      { city: 'Kolkata', country: 'India' },
      { city: 'Singapore', country: 'Singapore' },
      { city: 'Dubai', country: 'United Arab Emirates' },
      { city: 'London', country: 'United Kingdom' },
      { city: 'San Francisco', country: 'United States' },
    ];

    const customers: DbCustomer[] = [];
    for (let i = 1; i <= 110; i++) {
      const fn = firstNames[(i * 7) % firstNames.length];
      const ln = lastNames[(i * 11) % lastNames.length];
      const loc = cities[i % cities.length];
      const isSuspect = i % 8 === 0;
      const isCritical = i === 12 || i === 24 || i === 48 || i === 88;
      const accountAgeDays = Math.floor(Math.random() * 800) + 15;
      const txCount = Math.floor(Math.random() * 60) + 4;
      const avgAmt = Math.floor(Math.random() * 25000) + 3000;
      const totalAmt = txCount * avgAmt;

      const riskScore = isCritical ? Math.floor(Math.random() * 15) + 85 : isSuspect ? Math.floor(Math.random() * 25) + 50 : Math.floor(Math.random() * 25) + 5;
      const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

      customers.push({
        id: `CUST-${1000 + i}`,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@securemail.in`,
        country: loc.country,
        city: loc.city,
        accountAgeDays,
        riskScore,
        riskLevel,
        transactionCount: txCount,
        totalAmount: totalAmt,
        avgTransactionAmount: avgAmt,
        usualDevices: [`Device-${(i % 15) + 1} (Chrome)`, `Mobile-${(i % 20) + 1} (Android)`],
        usualCountries: [loc.country],
        lastActivity: `${Math.floor(Math.random() * 12) + 1} mins ago`,
        status: isCritical ? 'Restricted' : isSuspect ? 'Under Review' : 'Verified',
        biometricBaselineCadenceMs: Math.floor(Math.random() * 60) + 160,
        behaviorSummary: isCritical
          ? 'Elevated risk profile: sudden burst of high-value remittances to offshore payees, high clipboard paste velocity (0.3s), and device canvas collisions.'
          : isSuspect
          ? 'Moderate deviation: unusual late-night transaction attempts with slight latency shifts in typing cadence.'
          : 'Consistent standard behavioral biometrics and steady domestic transaction volume.',
        notesCount: isCritical ? 3 : isSuspect ? 1 : 0,
      });
    }

    // 3. Transactions (520+ transactions)
    const paymentMethods: DbTransaction['paymentMethod'][] = ['UPI', 'Net Banking', 'Credit Card', 'Wire Transfer', 'Crypto Gateway'];
    const deviceTypes: DbTransaction['deviceType'][] = ['Mobile (Android)', 'Mobile (iOS)', 'Desktop (Mac)', 'Desktop (Windows)', 'Headless Browser'];
    const transactions: DbTransaction[] = [];
    const now = Date.now();

    for (let t = 1; t <= 525; t++) {
      const cust = customers[t % customers.length];
      const isHighRisk = t % 14 === 0 || t <= 5;
      const isMediumRisk = !isHighRisk && t % 7 === 0;

      const baseAmount = cust.avgTransactionAmount;
      const amount = isHighRisk
        ? baseAmount * (Math.floor(Math.random() * 8) + 4) + 15000
        : Math.floor(baseAmount * (0.6 + Math.random() * 0.9));

      const riskScore = isHighRisk
        ? Math.floor(Math.random() * 18) + 82
        : isMediumRisk
        ? Math.floor(Math.random() * 28) + 38
        : Math.floor(Math.random() * 22) + 6;

      const riskLevel: DbTransaction['riskLevel'] =
        riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

      const decision: DbTransaction['decision'] =
        riskScore >= 80 ? 'BLOCKED' : riskScore >= 60 ? 'REVIEW' : riskScore >= 45 ? 'STEP_UP_CHALLENGED' : 'APPROVE';

      const status: DbTransaction['status'] =
        riskScore >= 80 ? 'AUTO_BLOCKED' : riskScore >= 60 ? 'PENDING_REVIEW' : riskScore >= 45 ? 'STEP_UP_CHALLENGED' : 'RESOLVED_CLEAN';

      const hoursAgo = Math.floor(Math.random() * 72);
      const minutesAgo = Math.floor(Math.random() * 59);
      const txnTime = new Date(now - (hoursAgo * 3600000 + minutesAgo * 60000));
      const formattedTime = hoursAgo === 0 ? `${minutesAgo} mins ago` : hoursAgo < 24 ? `${hoursAgo}h ${minutesAgo}m ago` : `${Math.floor(hoursAgo / 24)}d ago`;

      const primaryDriver = isHighRisk
        ? 'Rapid Rehearsal Transfer & 0.4s Clipboard Paste on Beneficiary IFSC'
        : isMediumRisk
        ? 'Unusual Transaction Amount (3.2x above 30-day baseline)'
        : 'Standard Normal Baseline Transaction Pattern';

      const signals: DbRiskSignal[] = [];
      if (isHighRisk) {
        signals.push(
          {
            id: `sig-${t}-1`,
            signalName: 'Transaction Amount Anomaly',
            category: 'transaction',
            severity: 'critical',
            contribution: 28,
            details: `Amount of ₹${amount.toLocaleString('en-IN')} is ${(amount / Math.max(1, cust.avgTransactionAmount)).toFixed(1)}x higher than customer baseline.`,
            microEvidence: `Baseline: ₹${cust.avgTransactionAmount.toLocaleString('en-IN')}`,
          },
          {
            id: `sig-${t}-2`,
            signalName: 'Clipboard Paste Velocity',
            category: 'behavioral',
            severity: 'critical',
            contribution: 24,
            details: 'Clipboard paste detected on recipient account input in 0.38s with zero keystroke hesitation.',
            microEvidence: 'Flight Latency: 38ms vs normal 180ms',
          },
          {
            id: `sig-${t}-3`,
            signalName: 'Precursor Intent Sequence',
            category: 'rehearsal',
            severity: 'elevated',
            contribution: 22,
            details: 'Customer completed 3 balance queries and aborted 2 checkout flows within 5 minutes prior to transfer.',
            microEvidence: '2 cancel flows in 5m',
          },
          {
            id: `sig-${t}-4`,
            signalName: 'New Device & Geolocation Anomaly',
            category: 'device',
            severity: 'elevated',
            contribution: 18,
            details: 'Transaction originated from an unrecognized browser canvas fingerprint in an offshore IP range.',
            microEvidence: 'Canvas Hash: #x88f219b',
          }
        );
      } else if (isMediumRisk) {
        signals.push(
          {
            id: `sig-${t}-1`,
            signalName: 'Elevated Transaction Sum',
            category: 'transaction',
            severity: 'elevated',
            contribution: 20,
            details: 'Transfer amount is 2.5x higher than typical monthly average.',
            microEvidence: 'Velocity index +14%',
          },
          {
            id: `sig-${t}-2`,
            signalName: 'Minor Typing Cadence Drift',
            category: 'behavioral',
            severity: 'low',
            contribution: 15,
            details: 'Keystroke flight times shifted slightly by 35ms during PIN entry.',
            microEvidence: 'Delta: +35ms variance',
          }
        );
      } else {
        signals.push({
          id: `sig-${t}-1`,
          signalName: 'Baseline Verification Match',
          category: 'behavioral',
          severity: 'low',
          contribution: 4,
          details: 'All biometric, temporal, and device parameters within normal 1-sigma distribution.',
          microEvidence: 'Normal profile match (98.4%)',
        });
      }

      transactions.push({
        id: `TXN-${9000 + t}`,
        transactionRef: `TXN-REF-${100000 + t}`,
        customerId: cust.id,
        customerName: cust.name,
        customerEmail: cust.email,
        amount,
        currency: 'INR',
        paymentMethod: paymentMethods[t % paymentMethods.length],
        country: isHighRisk && Math.random() > 0.5 ? 'Cyprus' : cust.country,
        city: isHighRisk && Math.random() > 0.5 ? 'Nicosia' : cust.city,
        deviceId: `DEV-${Math.floor(1000 + (t % 45))}`,
        deviceType: isHighRisk ? 'Headless Browser' : deviceTypes[t % deviceTypes.length],
        ipAddress: `194.${(t * 3) % 255}.${(t * 7) % 255}.${(t * 11) % 255}`,
        timestamp: formattedTime,
        createdAt: txnTime.getTime(),
        riskScore,
        riskLevel,
        decision,
        status,
        primaryDriver,
        signals,
        beneficiaryName: isHighRisk ? 'Apex Instant Offshore Remittance' : `Vendor Payee ${t % 25}`,
        beneficiaryAccount: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
        isNewBeneficiary: isHighRisk || isMediumRisk,
        mlAnomalyScore: isHighRisk ? 0.92 : isMediumRisk ? 0.58 : 0.08,
        mlExplanation: isHighRisk
          ? `Isolation Forest Anomaly Score: 0.92. Multi-dimensional feature vector in top 0.4% outlier bracket due to high amount anomaly (${(amount / Math.max(1, cust.avgTransactionAmount)).toFixed(1)}x) coupled with high paste velocity.`
          : isMediumRisk
          ? 'Isolation Forest Anomaly Score: 0.58. Moderate outlier along transaction amount and off-hours execution timing.'
          : 'Isolation Forest Anomaly Score: 0.08. Feature vector tightly clustered inside normal behavioral centroid.',
        behavioralCadenceMs: isHighRisk ? 38 : cust.biometricBaselineCadenceMs + (Math.floor(Math.random() * 20) - 10),
        clipboardPasteLatencySec: isHighRisk ? 0.38 : 3.4,
        failedLoginAttemptsRecent: isHighRisk ? 4 : 0,
        velocityLastHour: isHighRisk ? 6 : 1,
      });
    }

    // 4. Alerts (55+ alerts)
    const alerts: DbAlert[] = [];
    const highRiskTxns = transactions.filter((t) => t.riskScore >= 70);
    highRiskTxns.slice(0, 55).forEach((txn, i) => {
      alerts.push({
        id: `ALT-${1000 + i}`,
        alertRef: `ALERT-${202500 + i}`,
        type:
          i % 4 === 0
            ? 'BOT_REHEARSAL'
            : i % 4 === 1
            ? 'ACCOUNT_TAKEOVER'
            : i % 4 === 2
            ? 'ZERO_DAY_CLUSTER'
            : 'TRANSACTION_ANOMALY',
        title: `High-Risk Anomaly on ${txn.customerName} (${txn.id})`,
        description: `Automated detection triggered: ₹${txn.amount.toLocaleString('en-IN')} payment flagged with score ${txn.riskScore}/100. ${txn.primaryDriver}`,
        transactionId: txn.id,
        customerId: txn.customerId,
        customerName: txn.customerName,
        riskLevel: txn.riskLevel,
        riskScore: txn.riskScore,
        status: i % 5 === 0 ? 'INVESTIGATING' : i % 5 === 1 ? 'ACKNOWLEDGED' : i % 5 === 2 ? 'RESOLVED' : 'OPEN',
        createdAt: txn.timestamp,
        timestampMs: txn.createdAt,
        assignedTo: i % 3 === 0 ? 'Priya Sharma' : i % 3 === 1 ? 'Naman Kumar' : 'Marcus Vance',
      });
    });

    // 5. Cases (12 investigation cases)
    const cases: DbCase[] = [
      {
        id: 'CASE-101',
        caseRef: 'CASE-2025-0891',
        title: 'Mule Ring Sybil Cluster Investigation (#Alpha)',
        description: 'Multi-account syndicate utilizing headless Puppeteer instances across shared Subnet /24 to drain liquid balances right below mandatory OTP thresholds.',
        priority: 'critical',
        status: 'Investigating',
        assignedTo: 'Naman Kumar',
        relatedTransactionIds: ['TXN-9014', 'TXN-9028', 'TXN-9042'],
        relatedCustomerIds: ['CUST-1008', 'CUST-1016', 'CUST-1024'],
        tags: ['Mule Ring', 'Bot Cluster', 'Offshore Wire', 'Priority 1'],
        notes: [
          {
            id: 'n-1',
            authorName: 'Naman Kumar',
            authorRole: 'Admin',
            note: 'Initiated cross-customer behavioral echo correlation. Confirmed identical Bezier mouse curve trajectories across 4 accounts.',
            createdAt: '2 hours ago',
          },
          {
            id: 'n-2',
            authorName: 'Priya Sharma',
            authorRole: 'Fraud Analyst',
            note: 'Applied temporary outbound transaction freeze on beneficiary account Axis Express Net •••• 9821.',
            createdAt: '45 mins ago',
          },
        ],
        createdAt: '1 day ago',
        updatedAt: '45 mins ago',
      },
      {
        id: 'CASE-102',
        caseRef: 'CASE-2025-0892',
        title: 'Account Takeover via SIM-Swap & Zero-Dwell Paste',
        description: 'Account #CUST-1012 exhibited 0.3s clipboard paste on beneficiary PAN field following 5 consecutive failed credential attempts.',
        priority: 'high',
        status: 'Open',
        assignedTo: 'Priya Sharma',
        relatedTransactionIds: ['TXN-9001', 'TXN-9015'],
        relatedCustomerIds: ['CUST-1012'],
        tags: ['Account Takeover', 'Fast Paste', 'Credential Stuffing'],
        notes: [
          {
            id: 'n-102-1',
            authorName: 'Priya Sharma',
            authorRole: 'Fraud Analyst',
            note: 'Customer contacted via registered secondary phone for voice biometric verification step-up.',
            createdAt: '3 hours ago',
          },
        ],
        createdAt: '2 days ago',
        updatedAt: '3 hours ago',
      },
      {
        id: 'CASE-103',
        caseRef: 'CASE-2025-0893',
        title: 'Rehearsal Practice Loop Syndicate Probe',
        description: 'Precursor detector observed 4 simulated checkout aborts and balance queries to gauge AML trigger boundaries prior to a ₹2.8L remittance.',
        priority: 'high',
        status: 'Escalated',
        assignedTo: 'Marcus Vance',
        relatedTransactionIds: ['TXN-9005', 'TXN-9019'],
        relatedCustomerIds: ['CUST-1005'],
        tags: ['Rehearsal Detector', 'Velocity', 'High Amount'],
        notes: [
          {
            id: 'n-103-1',
            authorName: 'Marcus Vance',
            authorRole: 'Investigator',
            note: 'Escalated to Cybercrimes division for IP subnet blocklisting.',
            createdAt: '5 hours ago',
          },
        ],
        createdAt: '3 days ago',
        updatedAt: '5 hours ago',
      },
      {
        id: 'CASE-104',
        caseRef: 'CASE-2025-0894',
        title: 'Zero-Day Synthetic Identity Mutation Review',
        description: 'Novel biometric rhythm mutation detected with abnormal flight latency distribution during card CVV entry.',
        priority: 'medium',
        status: 'Resolved',
        assignedTo: 'Naman Kumar',
        relatedTransactionIds: ['TXN-9009'],
        relatedCustomerIds: ['CUST-1009'],
        tags: ['Zero-Day Radar', 'False Positive', 'Resolved'],
        notes: [
          {
            id: 'n-104-1',
            authorName: 'Naman Kumar',
            authorRole: 'Admin',
            note: 'Customer verified in branch with physical government photo ID. Device touch digitizer was defective causing latency spikes. Marked as False Positive.',
            createdAt: '1 day ago',
          },
        ],
        createdAt: '4 days ago',
        updatedAt: '1 day ago',
        resolvedAt: '1 day ago',
        resolutionSummary: 'Verified as legitimate customer with hardware touch digitizer issue. Added benign variance rule.',
      },
    ];

    // 6. Notifications
    const notifications: DbNotification[] = [
      {
        id: 'notif-1',
        title: 'Critical Risk Payment Flagged (#TXN-9014)',
        description: 'Sudden ₹3,45,000 transfer with rapid paste (0.38s) & Isolation Forest anomaly score 0.94.',
        type: 'danger',
        read: false,
        createdAt: '2 mins ago',
        linkView: 'live_transactions',
        relatedId: 'TXN-9014',
      },
      {
        id: 'notif-2',
        title: 'New Suspicious Accounts Connected (Cluster Alpha)',
        description: '3 accounts exhibit identical bot typing flight intervals (35ms ± 3ms).',
        type: 'warning',
        read: false,
        createdAt: '14 mins ago',
        linkView: 'doppelganger_cluster',
        relatedId: 'CASE-101',
      },
      {
        id: 'notif-3',
        title: 'Investigation Case #CASE-2025-0891 Assigned',
        description: 'You have been assigned to lead the Mule Ring Sybil Cluster Investigation.',
        type: 'info',
        read: false,
        createdAt: '1 hour ago',
        linkView: 'case_management',
        relatedId: 'CASE-101',
      },
      {
        id: 'notif-4',
        title: 'Zero-Day Attack Pattern Discovered',
        description: 'Pattern #ZD-73 synthesized into candidate quarantine rule.',
        type: 'info',
        read: true,
        createdAt: '3 hours ago',
        linkView: 'zero_day_radar',
        relatedId: 'ZD-73',
      },
    ];

    // 7. Audit Logs
    const auditLogs: DbAuditLog[] = [
      {
        id: 'aud-1',
        userId: 'usr-admin-1',
        userName: 'Naman Kumar',
        action: 'QUARANTINE_TRANSACTION',
        resource: 'Transaction',
        resourceId: 'TXN-9014',
        details: 'Blocked transaction due to 92/100 risk score and rehearsal detection trigger.',
        timestamp: new Date(now - 120000).toISOString(),
      },
      {
        id: 'aud-2',
        userId: 'usr-analyst-2',
        userName: 'Priya Sharma',
        action: 'CREATE_CASE',
        resource: 'Case',
        resourceId: 'CASE-102',
        details: 'Opened investigation for Account Takeover on CUST-1012.',
        timestamp: new Date(now - 3600000).toISOString(),
      },
      {
        id: 'aud-3',
        userId: 'usr-admin-1',
        userName: 'Naman Kumar',
        action: 'SYSTEM_SEED',
        resource: 'Database',
        resourceId: 'ALL',
        details: 'Initial database boot and biometric baseline generation completed.',
        timestamp: new Date(now - 86400000).toISOString(),
      },
    ];

    this.db = {
      users: defaultUsers,
      customers,
      transactions,
      alerts,
      cases,
      notifications,
      auditLogs,
    };
  }
}

export const dbManager = new DatabaseManager();
