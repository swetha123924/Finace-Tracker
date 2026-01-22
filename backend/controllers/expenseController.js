import pool from '../db/client.js';

// Get all expenses for a user
export const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, m.name as payer_name, m.avatar as payer_avatar,
              array_agg(es.member_id) as split_between
       FROM expenses e
       LEFT JOIN members m ON e.paid_by = m.id
       LEFT JOIN expense_splits es ON e.id = es.expense_id
       WHERE e.user_id = $1
       GROUP BY e.id, m.name, m.avatar
       ORDER BY e.created_at DESC`,
      [req.user.id]
    );
    
    // Transform the data
    const expenses = result.rows.map(row => ({
      id: row.id,
      description: row.description,
      amount: parseFloat(row.amount),
      paidBy: row.paid_by,
      payerName: row.payer_name,
      payerAvatar: row.payer_avatar,
      category: row.category,
      splitBetween: row.split_between.filter(id => id !== null),
      createdAt: row.created_at
    }));

    res.json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single expense
export const getExpense = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT e.*, m.name as payer_name,
              array_agg(es.member_id) as split_between
       FROM expenses e
       LEFT JOIN members m ON e.paid_by = m.id
       LEFT JOIN expense_splits es ON e.id = es.expense_id
       WHERE e.id = $1 AND e.user_id = $2
       GROUP BY e.id, m.name`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      description: row.description,
      amount: parseFloat(row.amount),
      paidBy: row.paid_by,
      payerName: row.payer_name,
      category: row.category,
      splitBetween: row.split_between.filter(id => id !== null),
      createdAt: row.created_at
    });
  } catch (err) {
    console.error('Get expense error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new expense
export const addExpense = async (req, res) => {
  const { description, amount, paidBy, category, splitBetween } = req.body;
  
  if (!description || !amount || !paidBy) {
    return res.status(400).json({ error: 'Description, amount, and paidBy are required' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert expense
    const expenseResult = await client.query(
      `INSERT INTO expenses (user_id, description, amount, paid_by, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, description, amount, paidBy, category || 'Other']
    );
    
    const expense = expenseResult.rows[0];
    
    // Insert expense splits
    if (splitBetween && splitBetween.length > 0) {
      const splitValues = splitBetween.map((memberId, idx) => 
        `($1, $${idx + 2})`
      ).join(', ');
      
      await client.query(
        `INSERT INTO expense_splits (expense_id, member_id) VALUES ${splitValues}`,
        [expense.id, ...splitBetween]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Expense added successfully',
      expense: {
        ...expense,
        amount: parseFloat(expense.amount),
        splitBetween: splitBetween || []
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Add expense error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { description, amount, paidBy, category, splitBetween } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update expense
    const expenseResult = await client.query(
      `UPDATE expenses 
       SET description = $1, amount = $2, paid_by = $3, category = $4
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [description, amount, paidBy, category || 'Other', id, req.user.id]
    );
    
    if (expenseResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    // Delete old splits and insert new ones
    await client.query('DELETE FROM expense_splits WHERE expense_id = $1', [id]);
    
    if (splitBetween && splitBetween.length > 0) {
      const splitValues = splitBetween.map((memberId, idx) => 
        `($1, $${idx + 2})`
      ).join(', ');
      
      await client.query(
        `INSERT INTO expense_splits (expense_id, member_id) VALUES ${splitValues}`,
        [id, ...splitBetween]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      message: 'Expense updated successfully',
      expense: {
        ...expenseResult.rows[0],
        amount: parseFloat(expenseResult.rows[0].amount),
        splitBetween: splitBetween || []
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update expense error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get expense statistics
export const getExpenseStats = async (req, res) => {
  try {
    // Total expenses
    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM expenses WHERE user_id = $1',
      [req.user.id]
    );
    
    // By category
    const categoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total
       FROM expenses WHERE user_id = $1
       GROUP BY category ORDER BY total DESC`,
      [req.user.id]
    );
    
    // By member
    const memberResult = await pool.query(
      `SELECT m.id, m.name, COALESCE(SUM(e.amount), 0) as total_paid
       FROM members m
       LEFT JOIN expenses e ON m.id = e.paid_by
       WHERE m.user_id = $1
       GROUP BY m.id, m.name`,
      [req.user.id]
    );

    // Daily trend (last 7 days)
    const trendResult = await pool.query(
      `SELECT DATE(created_at) as date, COALESCE(SUM(amount), 0) as total
       FROM expenses
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [req.user.id]
    );

    res.json({
      total: parseFloat(totalResult.rows[0].total),
      count: parseInt(totalResult.rows[0].count),
      byCategory: categoryResult.rows.map(r => ({
        category: r.category,
        total: parseFloat(r.total)
      })),
      byMember: memberResult.rows.map(r => ({
        id: r.id,
        name: r.name,
        totalPaid: parseFloat(r.total_paid)
      })),
      dailyTrend: trendResult.rows.map(r => ({
        date: r.date,
        total: parseFloat(r.total)
      }))
    });
  } catch (err) {
    console.error('Get expense stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Calculate balances
export const getBalances = async (req, res) => {
  try {
    // Get all members
    const membersResult = await pool.query(
      'SELECT * FROM members WHERE user_id = $1',
      [req.user.id]
    );
    
    // Get all expenses with their splits
    const expensesResult = await pool.query(
      `SELECT e.id, e.amount, e.paid_by,
              array_agg(es.member_id) as split_between
       FROM expenses e
       LEFT JOIN expense_splits es ON e.id = es.expense_id
       WHERE e.user_id = $1
       GROUP BY e.id`,
      [req.user.id]
    );
    
    const members = membersResult.rows;
    const expenses = expensesResult.rows;
    
    // Calculate balances
    const balances = {};
    members.forEach(member => {
      balances[member.id] = {
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        paid: 0,
        owes: 0,
        balance: 0
      };
    });

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      const paidBy = expense.paid_by;
      const splitBetween = expense.split_between.filter(id => id !== null);
      
      if (splitBetween.length === 0) return;
      
      const perPerson = amount / splitBetween.length;

      // Add to paid
      if (balances[paidBy]) {
        balances[paidBy].paid += amount;
      }

      // Add to owes
      splitBetween.forEach(memberId => {
        if (balances[memberId]) {
          balances[memberId].owes += perPerson;
        }
      });
    });

    // Calculate final balance
    Object.keys(balances).forEach(memberId => {
      balances[memberId].balance = balances[memberId].paid - balances[memberId].owes;
    });

    // Calculate settlements
    const settlements = calculateSettlements(balances);

    res.json({ balances, settlements });
  } catch (err) {
    console.error('Get balances error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to calculate settlements
function calculateSettlements(balances) {
  const settlements = [];
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([id, data]) => {
    if (data.balance < -0.01) {
      debtors.push({ id: parseInt(id), name: data.name, amount: Math.abs(data.balance) });
    } else if (data.balance > 0.01) {
      creditors.push({ id: parseInt(id), name: data.name, amount: data.balance });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    if (amount > 0.01) {
      settlements.push({
        fromId: debtors[i].id,
        from: debtors[i].name,
        toId: creditors[j].id,
        to: creditors[j].name,
        amount: parseFloat(amount.toFixed(2))
      });
    }
    debtors[i].amount -= amount;
    creditors[j].amount -= amount;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}
