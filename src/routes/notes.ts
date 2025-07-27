import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';

const router = Router();

// Listar notas del usuario
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).user.id;
    try {
      const result = await pool.query(
        'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener notas' });
    }
  }
);

// Crear nota
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, content, grade } = req.body;
    const gradeValue = grade === undefined || grade === '' ? null : grade;
    const userId = (req as any).user.id;
    try {
      const result = await pool.query(
        'INSERT INTO notes (title, content, grade, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, gradeValue, userId]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear la nota' });
    }
  }
);

// Actualizar nota
router.put(
  '/:id',
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const { title, content, grade } = req.body;
    const gradeValue = grade === undefined || grade === '' ? null : grade;
    const userId = (req as any).user.id;
    try {
      const result = await pool.query(
        `UPDATE notes
         SET title = $1, content = $2, grade = $3
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [title, content, gradeValue, id, userId]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Nota no encontrada' });
        return;
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la nota' });
    }
  }
);

// Eliminar nota
router.delete(
  '/:id',
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    try {
      const result = await pool.query(
        'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Nota no encontrada' });
        return;
      }
      res.json({ message: 'Nota eliminada' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar la nota' });
    }
  }
);

export default router;
