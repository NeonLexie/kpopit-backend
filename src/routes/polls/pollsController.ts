import { Request, Response } from 'express';
import pool from '../pool';
import {v4 as uuidv4} from 'uuid';

export async function getAllPolls(req: Request, res: Response) {
    try {
        const result = await pool.query('SELECT * FROM polls');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}