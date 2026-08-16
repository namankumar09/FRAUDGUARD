import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dbManager, DbTransaction, DbAlert, DbCase, DbCustomer } from './server/db';
import { evaluateFraudRisk, FraudEngineInput } from './server/fraudEngine';
import {
  generateAssistantReply,
  explainTransactionRisk,
  summarizeCustomerProfile,
  summarizeInvestigationCase,
  isAiReady,
} from './server/geminiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // HEALTH CHECK
  // ----------------------------------------------------
  app.get('/api/health', (_req, res) => {
    const stats = {
      transactions: dbManager.getTransactions().length,
      customers: dbManager.getCustomers().length,
      alerts: dbManager.getAlerts().length,
      cases: dbManager.getCases().length,
    };
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      aiReady: isAiReady(),
      databaseStats: stats,
    });
  });

  // ----------------------------------------------------
  // AUTHENTICATION & USERS
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    const users = dbManager.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      // Allow flexible demo logins
      user = {
        id: `usr-${Date.now()}`,
        name: email ? email.split('@')[0].replace('.', ' ') : 'Fraud Analyst',
        email: email || 'analyst@fraudguard.io',
        role: (role as any) || 'Fraud Analyst',
        title: 'Risk Intelligence Specialist',
        department: 'Forensic Operations',
        organization: 'FraudGuard Enterprise AI Network',
        createdAt: new Date().toISOString(),
        lastActive: 'Just now',
        status: 'Active',
      };
      dbManager.getSnapshot().users.push(user);
      dbManager.saveToDisk();
    }

    dbManager.logAudit({
      userId: user.id,
      userName: user.name,
      action: 'USER_LOGIN',
      resource: 'Auth',
      resourceId: user.id,
      details: `User logged in with role: ${user.role}`,
    });

    res.json({
      success: true,
      token: `fg-token-${user.id}-${Date.now()}`,
      user,
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, organization } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || 'Fraud Analyst',
      title: 'Fraud Risk Analyst',
      department: 'Fraud Operations',
      organization: organization || 'FraudGuard Enterprise AI Network',
      createdAt: new Date().toISOString(),
      lastActive: 'Just now',
      status: 'Active' as const,
    };

    dbManager.getSnapshot().users.push(newUser);
    dbManager.saveToDisk();

    dbManager.logAudit({
      userId: newUser.id,
      userName: newUser.name,
      action: 'USER_REGISTER',
      resource: 'Auth',
      resourceId: newUser.id,
      details: `New account created: ${newUser.name} (${newUser.role})`,
    });

    res.json({
      success: true,
      token: `fg-token-${newUser.id}-${Date.now()}`,
      user: newUser,
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const users = dbManager.getUsers();
    // Return primary admin / analyst
    res.json({ success: true, user: users[0] || null });
  });

  app.post('/api/auth/update-profile', (req, res) => {
    const { id, name, title, department, phone, organization } = req.body;
    const users = dbManager.getUsers();
    const user = users.find((u) => u.id === id) || users[0];
    if (user) {
      if (name) user.name = name;
      if (title) user.title = title;
      if (department) user.department = department;
      if (phone) user.phone = phone;
      if (organization) user.organization = organization;
      user.lastActive = 'Just now';
      dbManager.saveToDisk();

      dbManager.logAudit({
        userId: user.id,
        userName: user.name,
        action: 'UPDATE_PROFILE',
        resource: 'User',
        resourceId: user.id,
        details: 'User updated profile details',
      });

      return res.json({ success: true, user });
    }
    res.status(404).json({ success: false, error: 'User not found' });
  });

  app.get('/api/users', (_req, res) => {
    res.json({ success: true, users: dbManager.getUsers() });
  });

  // ----------------------------------------------------
  // TRANSACTIONS
  // ----------------------------------------------------
  // TRANSACTIONS API
  // ----------------------------------------------------
  app.get('/api/transactions', (req, res) => {
    const {
      search,
      riskLevel,
      decision,
      status,
      country,
      paymentMethod,
      dateRange,
      minAmount,
      maxAmount,
      limit = '50',
      page = '1',
      sort = 'newest',
    } = req.query;

    let txns = [...dbManager.getTransactions()];

    // Search filter (Transaction ID, Ref, Customer ID, Customer Name, Email, Payee, etc.)
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      txns = txns.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          (t.transactionRef && t.transactionRef.toLowerCase().includes(q)) ||
          (t.customerId && t.customerId.toLowerCase().includes(q)) ||
          (t.customerName && t.customerName.toLowerCase().includes(q)) ||
          (t.customerEmail && t.customerEmail.toLowerCase().includes(q)) ||
          (t.beneficiaryName && t.beneficiaryName.toLowerCase().includes(q)) ||
          (t.beneficiaryAccount && t.beneficiaryAccount.toLowerCase().includes(q)) ||
          (t.primaryDriver && t.primaryDriver.toLowerCase().includes(q)) ||
          (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q)) ||
          (t.country && t.country.toLowerCase().includes(q)) ||
          (t.city && t.city.toLowerCase().includes(q)) ||
          (t.ipAddress && t.ipAddress.includes(q))
      );
    }

    // Risk level filter
    if (riskLevel && riskLevel !== 'all') {
      const rl = String(riskLevel).toLowerCase();
      if (rl === 'high') {
        txns = txns.filter((t) => t.riskLevel === 'high' || t.riskLevel === 'critical' || t.riskScore >= 60);
      } else if (rl === 'suspicious' || rl === 'medium') {
        txns = txns.filter((t) => (t.riskLevel === 'medium' || (t.riskScore >= 30 && t.riskScore < 60)) && t.riskLevel !== 'high' && t.riskLevel !== 'critical');
      } else if (rl === 'low') {
        txns = txns.filter((t) => t.riskLevel === 'low' || t.riskScore < 30);
      } else {
        txns = txns.filter((t) => String(t.riskLevel) === rl);
      }
    }

    // Decision filter
    if (decision && decision !== 'all') {
      txns = txns.filter((t) => t.decision === decision);
    }

    // Status filter
    if (status && status !== 'all') {
      txns = txns.filter((t) => t.status === status);
    }

    // Country filter
    if (country && country !== 'all') {
      txns = txns.filter((t) => t.country?.toLowerCase() === String(country).toLowerCase());
    }

    // Payment Method filter
    if (paymentMethod && paymentMethod !== 'all') {
      txns = txns.filter((t) => t.paymentMethod?.toLowerCase() === String(paymentMethod).toLowerCase());
    }

    // Date Range filter
    if (dateRange && dateRange !== 'all') {
      const now = Date.now();
      if (dateRange === 'today' || dateRange === '24h') {
        txns = txns.filter((t) => t.createdAt >= now - 24 * 60 * 60 * 1000);
      } else if (dateRange === '7d') {
        txns = txns.filter((t) => t.createdAt >= now - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30d') {
        txns = txns.filter((t) => t.createdAt >= now - 30 * 24 * 60 * 60 * 1000);
      }
    }

    // Amount range
    if (minAmount && !isNaN(Number(minAmount))) {
      txns = txns.filter((t) => t.amount >= Number(minAmount));
    }
    if (maxAmount && !isNaN(Number(maxAmount))) {
      txns = txns.filter((t) => t.amount <= Number(maxAmount));
    }

    // Sorting
    if (sort === 'highest_risk') {
      txns.sort((a, b) => b.riskScore - a.riskScore);
    } else if (sort === 'highest_amount') {
      txns.sort((a, b) => b.amount - a.amount);
    } else if (sort === 'lowest_risk') {
      txns.sort((a, b) => a.riskScore - b.riskScore);
    } else {
      // newest
      txns.sort((a, b) => b.createdAt - a.createdAt);
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const total = txns.length;
    const paginated = txns.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      transactions: paginated,
    });
  });

  app.get('/api/transactions/:id', (req, res) => {
    const txn = dbManager.getTransactionById(req.params.id);
    if (!txn) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    const customer = dbManager.getCustomerById(txn.customerId);
    const relatedTxns = dbManager
      .getTransactions()
      .filter((t) => t.customerId === txn.customerId && t.id !== txn.id)
      .slice(0, 5);

    res.json({
      success: true,
      transaction: txn,
      customer,
      relatedTransactions: relatedTxns,
    });
  });

  // POST Create & Evaluate Real Transaction
  app.post('/api/transactions', (req, res) => {
    try {
      const body = req.body || {};
      
      // Extract amount
      const amount = Number(body.amount) || 25000;
      const currency = body.currency || 'INR';

      // Extract customer info
      let customerId = body.customerId;
      let customerName = body.customerName;
      let customerEmail = body.customerEmail;
      let customerCountry = body.country;

      if (body.customer) {
        if (body.customer.id) customerId = body.customer.id;
        if (body.customer.name) customerName = body.customer.name;
        if (body.customer.email) customerEmail = body.customer.email;
        if (body.customer.country) customerCountry = body.customer.country;
      }

      let customer: DbCustomer | undefined;
      if (customerId) {
        customer = dbManager.getCustomerById(customerId);
      }
      if (!customer && customerEmail) {
        customer = dbManager.getCustomers().find((c) => c.email.toLowerCase() === customerEmail.toLowerCase());
      }
      if (!customer && customerName) {
        customer = dbManager.getCustomers().find((c) => c.name.toLowerCase() === customerName.toLowerCase());
      }

      // If customer still doesn't exist, create a new record in dbManager
      if (!customer) {
        const newCustId = customerId || `CUST-${Date.now().toString().slice(-5)}`;
        customer = {
          id: newCustId,
          name: customerName || 'Rahul Verma',
          email: customerEmail || 'rahul.verma@example.com',
          country: customerCountry || 'India',
          city: body.city || 'Mumbai',
          accountAgeDays: 140,
          riskScore: 24,
          riskLevel: 'low',
          transactionCount: 1,
          totalAmount: amount,
          avgTransactionAmount: amount > 50000 ? 18000 : amount,
          usualDevices: [body.deviceId || 'DEV-SAM-S23'],
          usualCountries: [customerCountry || 'India'],
          lastActivity: 'Just now',
          status: 'Verified',
          biometricBaselineCadenceMs: 180,
          behaviorSummary: 'Standard retail banking profile.',
          notesCount: 0,
        };
        dbManager.addCustomer(customer);
      }

      // Extract beneficiary info
      let beneficiaryName = body.beneficiaryName || 'Beneficiary Payee';
      let beneficiaryAccount = body.beneficiaryAccount || '•••• •••• 5521';
      let isNewBeneficiary = !!body.isNewBeneficiary;

      if (body.beneficiary) {
        if (body.beneficiary.name) beneficiaryName = body.beneficiary.name;
        if (body.beneficiary.accountNumber) beneficiaryAccount = body.beneficiary.accountNumber;
        if (body.beneficiary.isNew !== undefined) isNewBeneficiary = !!body.beneficiary.isNew;
      }

      // Extract biometrics & device
      let pasteLatencySec = body.clipboardPasteLatencySec;
      if (pasteLatencySec === undefined && body.behavioralBiometrics?.pasteLatencyMs !== undefined) {
        pasteLatencySec = body.behavioralBiometrics.pasteLatencyMs / 1000;
      }
      if (pasteLatencySec === undefined) pasteLatencySec = 2.4;

      let cadenceMs = body.behavioralCadenceMs;
      if (cadenceMs === undefined && body.behavioralBiometrics?.meanHesitationSec !== undefined) {
        cadenceMs = body.behavioralBiometrics.meanHesitationSec > 2 ? 35 : customer.biometricBaselineCadenceMs;
      }
      if (cadenceMs === undefined) cadenceMs = customer.biometricBaselineCadenceMs;

      let failedLogins = body.failedLoginAttemptsRecent ?? 0;
      let velocity = body.velocityLastHour ?? 1;
      let deviceId = body.deviceId || body.behavioralBiometrics?.deviceFingerprint?.canvasHash || `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
      let deviceType = body.deviceType || (body.behavioralBiometrics?.deviceFingerprint?.browser?.includes('Headless') ? 'Headless Browser' : 'Mobile (Android)');
      let ipCountry = body.behavioralBiometrics?.deviceFingerprint?.ipCountry || body.country || customer.country;

      const engineInput: FraudEngineInput = {
        customerId: customer.id,
        amount,
        currency,
        paymentMethod: body.paymentMethod || 'UPI',
        country: ipCountry,
        city: body.city || customer.city,
        deviceId,
        deviceType: deviceType as any,
        ipAddress: body.ipAddress || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        beneficiaryName,
        beneficiaryAccount,
        isNewBeneficiary,
        behavioralCadenceMs: cadenceMs,
        clipboardPasteLatencySec: pasteLatencySec,
        failedLoginAttemptsRecent: failedLogins,
        velocityLastHour: velocity,
        rehearsalDetected: body.rehearsalDetected || (body.behavioralBiometrics?.formSequenceDeviationScore > 60),
      };

      const engineResult = evaluateFraudRisk(engineInput, customer);

      const now = Date.now();
      const newTxnId = `TXN-${Date.now().toString().slice(-6)}`;
      const newTxn: DbTransaction = {
        id: newTxnId,
        transactionRef: `TXN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        amount,
        currency,
        paymentMethod: engineInput.paymentMethod || 'UPI',
        country: engineInput.country || customer.country,
        city: engineInput.city || customer.city,
        deviceId: engineInput.deviceId || 'DEV-PRIMARY',
        deviceType: engineInput.deviceType || 'Mobile (Android)',
        ipAddress: engineInput.ipAddress || '192.168.1.1',
        timestamp: 'Just now',
        createdAt: now,
        riskScore: engineResult.riskScore,
        riskLevel: engineResult.riskLevel,
        decision: engineResult.decision,
        status: engineResult.status,
        primaryDriver: engineResult.primaryDriver,
        signals: engineResult.signals,
        beneficiaryName,
        beneficiaryAccount,
        isNewBeneficiary,
        mlAnomalyScore: engineResult.mlAnomalyScore,
        mlExplanation: engineResult.mlExplanation,
        behavioralCadenceMs: cadenceMs,
        clipboardPasteLatencySec: pasteLatencySec,
        failedLoginAttemptsRecent: failedLogins,
        velocityLastHour: velocity,
      };

      dbManager.addTransaction(newTxn);

      // Auto-generate Alert if High or Critical Risk
      if (newTxn.riskScore >= 60) {
        const alertId = `ALT-${Date.now().toString().slice(-5)}`;
        const newAlert: DbAlert = {
          id: alertId,
          alertRef: `ALERT-${Date.now().toString().slice(-6)}`,
          type:
            newTxn.riskScore >= 80
              ? 'ACCOUNT_TAKEOVER'
              : newTxn.primaryDriver.includes('Rehearsal')
              ? 'BOT_REHEARSAL'
              : 'TRANSACTION_ANOMALY',
          title: `High Risk Payment Flagged (${newTxn.id}) - ₹${newTxn.amount.toLocaleString('en-IN')}`,
          description: `Risk score ${newTxn.riskScore}/100. ${newTxn.primaryDriver}`,
          transactionId: newTxn.id,
          customerId: customer.id,
          customerName: customer.name,
          riskLevel: newTxn.riskLevel,
          riskScore: newTxn.riskScore,
          status: 'OPEN',
          createdAt: 'Just now',
          timestampMs: now,
          assignedTo: 'Naman Kumar',
        };
        dbManager.addAlert(newAlert);
      }

      dbManager.logAudit({
        userId: 'usr-analyst-1',
        userName: 'Fraud Engine',
        action: 'TRANSACTION_EVALUATED',
        resource: 'Transaction',
        resourceId: newTxn.id,
        details: `Evaluated ₹${newTxn.amount.toLocaleString('en-IN')} with risk score ${newTxn.riskScore}/100 [${newTxn.decision}]`,
      });

      res.json({
        success: true,
        transaction: newTxn,
        engineResult,
      });
    } catch (err: any) {
      console.error('Failed to create and evaluate transaction:', err);
      res.status(500).json({ success: false, error: err.message || 'Internal evaluation error' });
    }
  });

  // PATCH Transaction Decision
  app.patch('/api/transactions/:id/decision', (req, res) => {
    const { decision, reason, reviewerName } = req.body;
    const txn = dbManager.getTransactionById(req.params.id);
    if (!txn) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    let status: DbTransaction['status'] = 'RESOLVED_CLEAN';
    if (decision === 'BLOCKED') status = 'BLOCKED';
    else if (decision === 'STEP_UP_CHALLENGED') status = 'STEP_UP_CHALLENGED';
    else if (decision === 'REVIEW') status = 'PENDING_REVIEW';
    else if (decision === 'APPROVE') status = 'RESOLVED_CLEAN';

    const updated = dbManager.updateTransaction(txn.id, {
      decision,
      status,
    });

    dbManager.logAudit({
      userId: 'current-user',
      userName: reviewerName || 'Fraud Analyst',
      action: `TRANSACTION_${decision}`,
      resource: 'Transaction',
      resourceId: txn.id,
      details: `Analyst changed decision to ${decision}. Reason: ${reason || 'Manual analyst override'}`,
    });

    res.json({ success: true, transaction: updated });
  });

  // POST Reset/Re-seed Database
  app.post('/api/transactions/seed-reset', (_req, res) => {
    dbManager.resetToSeed();
    res.json({
      success: true,
      message: 'Database successfully re-seeded with 100+ customers, 500+ transactions, 50+ alerts.',
      stats: {
        customers: dbManager.getCustomers().length,
        transactions: dbManager.getTransactions().length,
        alerts: dbManager.getAlerts().length,
        cases: dbManager.getCases().length,
      },
    });
  });

  // ----------------------------------------------------
  // CUSTOMERS
  // ----------------------------------------------------
  app.get('/api/customers', (req, res) => {
    const { search, riskLevel, status, sort = 'risk' } = req.query;
    let customers = [...dbManager.getCustomers()];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }

    if (riskLevel && riskLevel !== 'all') {
      customers = customers.filter((c) => c.riskLevel === riskLevel);
    }

    if (status && status !== 'all') {
      customers = customers.filter((c) => c.status === status);
    }

    if (sort === 'risk') {
      customers.sort((a, b) => b.riskScore - a.riskScore);
    } else if (sort === 'transactions') {
      customers.sort((a, b) => b.transactionCount - a.transactionCount);
    } else if (sort === 'amount') {
      customers.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sort === 'name') {
      customers.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({ success: true, total: customers.length, customers });
  });

  app.get('/api/customers/:id', (req, res) => {
    const customer = dbManager.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const txns = dbManager
      .getTransactions()
      .filter((t) => t.customerId === customer.id)
      .sort((a, b) => b.createdAt - a.createdAt);

    const alerts = dbManager.getAlerts().filter((a) => a.customerId === customer.id);
    const cases = dbManager
      .getCases()
      .filter((c) => c.relatedCustomerIds.includes(customer.id));

    res.json({
      success: true,
      customer,
      transactions: txns,
      alerts,
      cases,
    });
  });

  app.patch('/api/customers/:id/status', (req, res) => {
    const { status, reviewer } = req.body;
    const cust = dbManager.updateCustomer(req.params.id, { status });
    if (!cust) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    dbManager.logAudit({
      userId: 'current-user',
      userName: reviewer || 'Fraud Analyst',
      action: 'CUSTOMER_STATUS_UPDATE',
      resource: 'Customer',
      resourceId: cust.id,
      details: `Customer status changed to ${status}`,
    });

    res.json({ success: true, customer: cust });
  });

  // ----------------------------------------------------
  // ALERTS & INVESTIGATIONS
  // ----------------------------------------------------
  app.get('/api/alerts', (req, res) => {
    const { riskLevel, status, type, search } = req.query;
    let alerts = [...dbManager.getAlerts()];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      alerts = alerts.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.customerName.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    if (riskLevel && riskLevel !== 'all') {
      alerts = alerts.filter((a) => a.riskLevel === riskLevel);
    }

    if (status && status !== 'all') {
      alerts = alerts.filter((a) => a.status === status);
    }

    if (type && type !== 'all') {
      alerts = alerts.filter((a) => a.type === type);
    }

    res.json({ success: true, total: alerts.length, alerts });
  });

  app.patch('/api/alerts/:id', (req, res) => {
    const updates = req.body;
    const alert = dbManager.updateAlert(req.params.id, updates);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    dbManager.logAudit({
      userId: 'current-user',
      userName: updates.assignedTo || 'Fraud Analyst',
      action: 'ALERT_UPDATED',
      resource: 'Alert',
      resourceId: alert.id,
      details: `Alert status: ${alert.status}, Assigned to: ${alert.assignedTo || 'Unassigned'}`,
    });

    res.json({ success: true, alert });
  });

  // ----------------------------------------------------
  // CASES & CASE MANAGEMENT
  // ----------------------------------------------------
  app.get('/api/cases', (req, res) => {
    const { status, priority, search } = req.query;
    let cases = [...dbManager.getCases()];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.caseRef.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      cases = cases.filter((c) => c.status === status);
    }

    if (priority && priority !== 'all') {
      cases = cases.filter((c) => c.priority === priority);
    }

    res.json({ success: true, total: cases.length, cases });
  });

  app.post('/api/cases', (req, res) => {
    const { title, description, priority, assignedTo, relatedTransactionIds, relatedCustomerIds, tags } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Case title is required' });
    }

    const caseCount = dbManager.getCases().length + 1;
    const newCase: DbCase = {
      id: `CASE-${Date.now().toString().slice(-4)}`,
      caseRef: `CASE-2025-${(900 + caseCount).toString()}`,
      title,
      description: description || 'Investigation opened for flagged behavioral anomaly patterns.',
      priority: priority || 'medium',
      status: 'Open',
      assignedTo: assignedTo || 'Naman Kumar',
      relatedTransactionIds: relatedTransactionIds || [],
      relatedCustomerIds: relatedCustomerIds || [],
      tags: tags || ['Investigation', 'Active'],
      notes: [
        {
          id: `note-${Date.now()}`,
          authorName: assignedTo || 'Naman Kumar',
          authorRole: 'Lead Investigator',
          note: 'Case initiated for forensic behavioral analysis and containment review.',
          createdAt: 'Just now',
        },
      ],
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    dbManager.addCase(newCase);

    dbManager.logAudit({
      userId: 'current-user',
      userName: assignedTo || 'Lead Investigator',
      action: 'CASE_CREATED',
      resource: 'Case',
      resourceId: newCase.id,
      details: `New case opened: ${newCase.caseRef} - "${newCase.title}"`,
    });

    res.json({ success: true, case: newCase });
  });

  app.get('/api/cases/:id', (req, res) => {
    const cases = dbManager.getCases();
    const caseItem = cases.find((c) => c.id === req.params.id);
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const txns = dbManager
      .getTransactions()
      .filter((t) => caseItem.relatedTransactionIds.includes(t.id));
    const custs = dbManager
      .getCustomers()
      .filter((c) => caseItem.relatedCustomerIds.includes(c.id));

    res.json({ success: true, case: caseItem, transactions: txns, customers: custs });
  });

  app.patch('/api/cases/:id', (req, res) => {
    const updates = req.body;
    const updated = dbManager.updateCase(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    dbManager.logAudit({
      userId: 'current-user',
      userName: 'Fraud Analyst',
      action: 'CASE_UPDATED',
      resource: 'Case',
      resourceId: updated.id,
      details: `Case updated: status=${updated.status}, priority=${updated.priority}`,
    });

    res.json({ success: true, case: updated });
  });

  app.post('/api/cases/:id/notes', (req, res) => {
    const { note, authorName, authorRole } = req.body;
    if (!note) {
      return res.status(400).json({ success: false, error: 'Note text is required' });
    }

    const caseItem = dbManager.getCases().find((c) => c.id === req.params.id);
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const newNote = {
      id: `note-${Date.now()}`,
      authorName: authorName || 'Naman Kumar',
      authorRole: authorRole || 'Fraud Analyst',
      note,
      createdAt: 'Just now',
    };

    caseItem.notes.push(newNote);
    caseItem.updatedAt = 'Just now';
    dbManager.saveToDisk();

    dbManager.logAudit({
      userId: 'current-user',
      userName: newNote.authorName,
      action: 'ADD_CASE_NOTE',
      resource: 'Case',
      resourceId: caseItem.id,
      details: `Added note: "${note.slice(0, 50)}..."`,
    });

    res.json({ success: true, note: newNote, case: caseItem });
  });

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  app.get('/api/notifications', (_req, res) => {
    const notifs = dbManager.getNotifications();
    const unread = notifs.filter((n) => !n.read).length;
    res.json({ success: true, unreadCount: unread, notifications: notifs });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    dbManager.markNotificationAsRead(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/notifications/read-all', (_req, res) => {
    dbManager.markAllNotificationsAsRead();
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // REAL-TIME ANALYTICS FROM DATABASE
  // ----------------------------------------------------
  app.get('/api/analytics', (_req, res) => {
    const txns = dbManager.getTransactions();
    const customers = dbManager.getCustomers();
    const alerts = dbManager.getAlerts();
    const cases = dbManager.getCases();

    const totalTxnCount = txns.length;
    const totalVolume = txns.reduce((acc, t) => acc + t.amount, 0);
    const highRiskTxns = txns.filter((t) => t.riskScore >= 70);
    const suspiciousTxns = txns.filter((t) => t.riskScore >= 40 && t.riskScore < 70);
    const lowRiskTxns = txns.filter((t) => t.riskScore < 40);

    const fraudRate = totalTxnCount > 0 ? ((highRiskTxns.length / totalTxnCount) * 100).toFixed(1) : '0';
    const avgRiskScore = totalTxnCount > 0 ? Math.round(txns.reduce((a, b) => a + b.riskScore, 0) / totalTxnCount) : 0;
    const totalPreventedFraud = highRiskTxns.reduce((acc, t) => acc + t.amount, 0);

    // Distribution
    const riskDistribution = [
      { name: 'Low Risk (0-39)', count: lowRiskTxns.length, fill: '#10b981' },
      { name: 'Suspicious (40-69)', count: suspiciousTxns.length, fill: '#f59e0b' },
      { name: 'High Risk (70-89)', count: txns.filter((t) => t.riskScore >= 70 && t.riskScore < 90).length, fill: '#ef4444' },
      { name: 'Critical (90-100)', count: txns.filter((t) => t.riskScore >= 90).length, fill: '#dc2626' },
    ];

    // Volume by Country
    const countryMap: Record<string, { count: number; volume: number; highRiskCount: number }> = {};
    txns.forEach((t) => {
      const c = t.country || 'Other';
      if (!countryMap[c]) countryMap[c] = { count: 0, volume: 0, highRiskCount: 0 };
      countryMap[c].count += 1;
      countryMap[c].volume += t.amount;
      if (t.riskScore >= 60) countryMap[c].highRiskCount += 1;
    });

    const countryBreakdown = Object.entries(countryMap)
      .map(([country, val]) => ({
        country,
        count: val.count,
        volume: val.volume,
        highRiskCount: val.highRiskCount,
        fraudRate: val.count > 0 ? Math.round((val.highRiskCount / val.count) * 100) : 0,
      }))
      .sort((a, b) => b.volume - a.volume);

    // Top Signal Frequency
    const signalCounts: Record<string, number> = {};
    txns.forEach((t) => {
      t.signals.forEach((s) => {
        signalCounts[s.signalName] = (signalCounts[s.signalName] || 0) + 1;
      });
    });

    const topSignals = Object.entries(signalCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Timeline Trends (Last 7 intervals)
    const timelineData = [
      { time: '06:00', total: 42, suspicious: 3, blocked: 2, preventedAmount: 145000 },
      { time: '09:00', total: 88, suspicious: 8, blocked: 5, preventedAmount: 390000 },
      { time: '12:00', total: 125, suspicious: 14, blocked: 9, preventedAmount: 820000 },
      { time: '15:00', total: 110, suspicious: 11, blocked: 7, preventedAmount: 510000 },
      { time: '18:00', total: 95, suspicious: 7, blocked: 4, preventedAmount: 295000 },
      { time: '21:00', total: 64, suspicious: 9, blocked: 6, preventedAmount: 640000 },
      { time: '00:00 (Live)', total: txns.slice(0, 30).length, suspicious: suspiciousTxns.slice(0, 8).length, blocked: highRiskTxns.slice(0, 5).length, preventedAmount: 430000 },
    ];

    res.json({
      success: true,
      metrics: {
        totalAnalyzed: totalTxnCount,
        totalVolume,
        suspiciousCount: suspiciousTxns.length,
        highRiskCount: highRiskTxns.length,
        fraudRate: `${fraudRate}%`,
        avgRiskScore,
        totalPreventedFraud,
        activeCustomersCount: customers.length,
        openAlertsCount: alerts.filter((a) => a.status === 'OPEN').length,
        activeCasesCount: cases.filter((c) => c.status === 'Open' || c.status === 'Investigating').length,
      },
      riskDistribution,
      countryBreakdown,
      topSignals,
      timelineData,
    });
  });

  // ----------------------------------------------------
  // EXPORTABLE REPORTS
  // ----------------------------------------------------
  app.get('/api/reports/generate', (req, res) => {
    const { type = 'fraud_summary', format = 'json' } = req.query;
    const txns = dbManager.getTransactions();
    const alerts = dbManager.getAlerts();
    const cases = dbManager.getCases();
    const highRisk = txns.filter((t) => t.riskScore >= 70);

    if (type === 'fraud_summary') {
      const data = {
        title: 'FraudGuard Executive Fraud Intelligence Summary',
        generatedAt: new Date().toISOString(),
        totalTransactionsScanned: txns.length,
        highRiskDetections: highRisk.length,
        estimatedLossPrevented: `₹${highRisk.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}`,
        activeCases: cases.length,
        recentCriticalIncidents: highRisk.slice(0, 10).map((t) => ({
          txnId: t.id,
          customer: t.customerName,
          amount: t.amount,
          riskScore: t.riskScore,
          primaryDriver: t.primaryDriver,
          decision: t.decision,
        })),
      };

      if (format === 'csv') {
        const csvRows = [
          'Transaction ID,Customer Name,Amount (INR),Risk Score,Decision,Primary Driver,Timestamp',
          ...highRisk.map(
            (t) => `"${t.id}","${t.customerName}",${t.amount},${t.riskScore},"${t.decision}","${t.primaryDriver}","${t.timestamp}"`
          ),
        ];
        res.header('Content-Type', 'text/csv');
        res.attachment('fraudguard_fraud_summary.csv');
        return res.send(csvRows.join('\n'));
      }

      return res.json({ success: true, report: data });
    }

    if (type === 'alerts_report') {
      if (format === 'csv') {
        const csvRows = [
          'Alert ID,Type,Title,Customer,Risk Score,Status,Created At,Assigned To',
          ...alerts.map(
            (a) => `"${a.id}","${a.type}","${a.title}","${a.customerName}",${a.riskScore},"${a.status}","${a.createdAt}","${a.assignedTo || 'Unassigned'}"`
          ),
        ];
        res.header('Content-Type', 'text/csv');
        res.attachment('fraudguard_alerts_report.csv');
        return res.send(csvRows.join('\n'));
      }
      return res.json({ success: true, alerts });
    }

    res.json({ success: true, message: 'Report generated', count: txns.length });
  });

  // ----------------------------------------------------
  // GEMINI AI ENDPOINTS (ASSISTANT & DEEP FORENSICS)
  // ----------------------------------------------------
  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { message, conversationHistory, context } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
      }

      const reply = await generateAssistantReply(message, conversationHistory || [], context);
      res.json({ success: true, reply, aiReady: isAiReady() });
    } catch (err: any) {
      console.error('[API] /api/ai/assistant error:', err);
      res.json({
        success: true,
        reply: 'FraudGuard Assistant is monitoring all transactions. You can click on Check Transactions to inspect live risk signals or view the How to Use Guide.',
        aiReady: false,
      });
    }
  });

  app.post('/api/ai/explain-transaction', async (req, res) => {
    try {
      const { transactionId } = req.body;
      const txn = dbManager.getTransactionById(transactionId) || dbManager.getTransactions()[0];
      const customer = dbManager.getCustomerById(txn.customerId);

      const explanation = await explainTransactionRisk(txn, customer);
      res.json({ success: true, explanation, transaction: txn });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/ai/summarize-customer', async (req, res) => {
    try {
      const { customerId } = req.body;
      const customer = dbManager.getCustomerById(customerId) || dbManager.getCustomers()[0];
      const txns = dbManager.getTransactions().filter((t) => t.customerId === customer.id);

      const summary = await summarizeCustomerProfile(customer, txns);
      res.json({ success: true, summary, customer });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/ai/summarize-case', async (req, res) => {
    try {
      const { caseId } = req.body;
      const cases = dbManager.getCases();
      const caseItem = cases.find((c) => c.id === caseId) || cases[0];
      const txns = dbManager.getTransactions().filter((t) => caseItem.relatedTransactionIds.includes(t.id));
      const custs = dbManager.getCustomers().filter((c) => caseItem.relatedCustomerIds.includes(c.id));

      const briefing = await summarizeInvestigationCase(caseItem, txns, custs);
      res.json({ success: true, briefing, case: caseItem });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Simulator / What-If Counterfactual Evaluation
  app.post('/api/simulator/evaluate', (req, res) => {
    const {
      customerId,
      amount,
      isNewDevice,
      isOffshoreLocation,
      failedLogins,
      velocity,
      isPasteSpeedZero,
      hasRehearsalAborts,
    } = req.body;

    const customer = dbManager.getCustomerById(customerId) || dbManager.getCustomers()[0];

    // Evaluate baseline
    const baselineInput: FraudEngineInput = {
      customerId: customer.id,
      amount: customer.avgTransactionAmount,
      beneficiaryName: 'Regular Vendor Payee',
      behavioralCadenceMs: customer.biometricBaselineCadenceMs,
      clipboardPasteLatencySec: 2.8,
      failedLoginAttemptsRecent: 0,
      velocityLastHour: 1,
    };
    const baselineResult = evaluateFraudRisk(baselineInput, customer);

    // Evaluate simulated scenario
    const simInput: FraudEngineInput = {
      customerId: customer.id,
      amount: Number(amount) || customer.avgTransactionAmount,
      beneficiaryName: 'Offshore Simulated Payee',
      deviceId: isNewDevice ? 'DEV-SIM-NEW-88' : customer.usualDevices[0],
      country: isOffshoreLocation ? 'Cyprus' : customer.country,
      deviceType: isNewDevice ? 'Headless Browser' : 'Mobile (Android)',
      behavioralCadenceMs: isPasteSpeedZero ? 35 : customer.biometricBaselineCadenceMs,
      clipboardPasteLatencySec: isPasteSpeedZero ? 0.35 : 2.5,
      failedLoginAttemptsRecent: Number(failedLogins) || 0,
      velocityLastHour: Number(velocity) || 1,
      rehearsalDetected: !!hasRehearsalAborts,
      isNewBeneficiary: true,
    };
    const simulatedResult = evaluateFraudRisk(simInput, customer);

    const delta = simulatedResult.riskScore - baselineResult.riskScore;

    res.json({
      success: true,
      customer,
      baseline: {
        amount: customer.avgTransactionAmount,
        riskScore: baselineResult.riskScore,
        riskLevel: baselineResult.riskLevel,
        decision: baselineResult.decision,
      },
      simulated: {
        amount: simInput.amount,
        riskScore: simulatedResult.riskScore,
        riskLevel: simulatedResult.riskLevel,
        decision: simulatedResult.decision,
        signals: simulatedResult.signals,
        mlAnomalyScore: simulatedResult.mlAnomalyScore,
        mlExplanation: simulatedResult.mlExplanation,
      },
      delta,
      explanation: `Risk score changed by ${delta >= 0 ? '+' : ''}${delta} points (from ${baselineResult.riskScore} to ${simulatedResult.riskScore}). Triggered by: ${simulatedResult.signals.map((s) => s.signalName).join(', ')}.`,
    });
  });

  // Audit Logs
  app.get('/api/audit-logs', (_req, res) => {
    res.json({ success: true, logs: dbManager.getAuditLogs() });
  });

  // ----------------------------------------------------
  // VITE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FraudGuard Full-Stack Platform Server running on http://localhost:${PORT}`);
  });
}

startServer();
