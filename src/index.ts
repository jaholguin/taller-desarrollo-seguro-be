import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from './db';
import { authenticateToken } from './middleware/auth';
import notesRouter from './routes/notes';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Registro
app.post(
  '/api/register',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    try {
      const exists = await pool.query(
        'SELECT 1 FROM users WHERE username = $1',
        [username]
      );
      if (exists.rows.length) {
        res.status(409).json({ error: 'Usuario ya existe' });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id, username, role',
        [username, passwordHash]
      );
      const newUser = result.rows[0];
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
);

// Login
app.post(
  '/api/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Usuario incorrecto' });
        return;
      }
      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// logout
app.post(
  '/api/logout',
  authenticateToken,
  (_req: Request, res: Response) => {
    res.json({ message: 'Logout exitoso' });
  }
);

// Rutas protegidas
app.use('/api/notes', authenticateToken, notesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend en puerto ${PORT}`));
