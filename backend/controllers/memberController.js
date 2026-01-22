import pool from '../db/client.js';

// Get all members for a user
export const getMembers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new member
export const addMember = async (req, res) => {
  const { name } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Member name is required' });
  }

  try {
    const avatar = name.charAt(0).toUpperCase();
    const result = await pool.query(
      'INSERT INTO members (user_id, name, avatar) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, name.trim(), avatar]
    );
    
    res.status(201).json({
      message: 'Member added successfully',
      member: result.rows[0]
    });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a member
export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  try {
    const avatar = name.charAt(0).toUpperCase();
    const result = await pool.query(
      'UPDATE members SET name = $1, avatar = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name.trim(), avatar, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({
      message: 'Member updated successfully',
      member: result.rows[0]
    });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a member
export const deleteMember = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM members WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get member stats
export const getMemberStats = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get total paid by member
    const paidResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_paid, COUNT(*) as expense_count
       FROM expenses WHERE paid_by = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    
    // Get total owed by member (from splits)
    const owedResult = await pool.query(
      `SELECT COALESCE(SUM(e.amount / (
          SELECT COUNT(*) FROM expense_splits WHERE expense_id = e.id
        )), 0) as total_owed
       FROM expenses e
       INNER JOIN expense_splits es ON e.id = es.expense_id
       WHERE es.member_id = $1 AND e.user_id = $2`,
      [id, req.user.id]
    );

    res.json({
      totalPaid: parseFloat(paidResult.rows[0].total_paid),
      expenseCount: parseInt(paidResult.rows[0].expense_count),
      totalOwed: parseFloat(owedResult.rows[0].total_owed)
    });
  } catch (err) {
    console.error('Get member stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
