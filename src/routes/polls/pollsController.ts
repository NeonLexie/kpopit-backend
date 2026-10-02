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

export async function getPollByUser(req:Request, res:Response){
    const {userId} = req.params

    try {

        if (!userId){
            res.status(400).json({error:"Missing required fields"})
            return
        }
    
        const checkUser = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
            if (checkUser.rows.length === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
        
        const results = await pool.query("SELECT * FROM polls WHERE user_id = $1 ",[userId])
        if (results.rows.length === 0) {
            res.status(200).json({message: "No polls created by this user" });
            return
        }
        res.status(200).json(results.rows)
    
    } catch(e){
        console.log("Error Fetching Polls: ", e )
        res.status(500).json({error:"Internal Service Error"})
    }

}