import pool from '../db/client.js';

// Get all settlements for a user
export const getSettlements = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              fm.name as from_name, fm.avatar as from_avatar,
              tm.name as to_name, tm.avatar as to_avatar
       FROM settlements s
       LEFT JOIN members fm ON s.from_member_id = fm.id
       LEFT JOIN members tm ON s.to_member_id = tm.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows.map(row => ({
      id: row.id,
      fromId: row.from_member_id,
      fromName: row.from_name,
      fromAvatar: row.from_avatar,
      toId: row.to_member_id,
      toName: row.to_name,
      toAvatar: row.to_avatar,
      amount: parseFloat(row.amount),
      status: row.status,
      settledAt: row.settled_at,
      createdAt: row.created_at
    })));
  } catch (err) {
    console.error('Get settlements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a settlement record
export const createSettlement = async (req, res) => {
  const { fromMemberId, toMemberId, amount } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO settlements (user_id, from_member_id, to_member_id, amount, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [req.user.id, fromMemberId, toMemberId, amount]
    );
    
    res.status(201).json({
      message: 'Settlement created successfully',
      settlement: result.rows[0]
    });
  } catch (err) {
    console.error('Create settlement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark a settlement as completed
export const completeSettlement = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `UPDATE settlements 
       SET status = 'completed', settled_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settlement not found' });
    }

    res.json({
      message: 'Settlement marked as completed',
      settlement: result.rows[0]
    });
  } catch (err) {
    console.error('Complete settlement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a settlement
export const deleteSettlement = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM settlements WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settlement not found' });
    }

    res.json({ message: 'Settlement deleted successfully' });
  } catch (err) {
    console.error('Delete settlement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear all settlements (settle all at once)
export const settleAll = async (req, res) => {
  try {
    await pool.query(
      `UPDATE settlements 
       SET status = 'completed', settled_at = NOW()
       WHERE user_id = $1 AND status = 'pending'`,
      [req.user.id]
    );

    res.json({ message: 'All settlements completed' });
  } catch (err) {
    console.error('Settle all error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
