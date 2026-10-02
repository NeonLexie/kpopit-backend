import { Request, Response } from 'express';
import pool from '../pool'
export async function getAllIdols(_req: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM idols;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching idols:', error);
    res.status(500).json({ error: 'Database error' });
  }
}
export async function getAllGroups(_req: Request, res: Response) {
  console.log("get all groups called");
    try {
    const result = await pool.query('SELECT * FROM groups;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching groups:', error);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getGroupByID(req: Request, res: Response) {
  const {param} = req.params;
  const ID = parseInt(param);

  try {
    const result = await pool.query("SELECT * FROM groups WHERE debut_date = $1;", [ID]);
    res.status(200).json(result.rows);

  } catch(e){
    console.error('Error fetching group by ID:', e);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getGroupByName(req: Request, res: Response){
  const {param} = req.params;
  
  try{
    const result = await pool.query("SELECT * FROM groups WHERE group_name ILIKE $1;", [`%${param}%`]);
    res.status(200).json(result.rows);
  } catch (e){
    console.error('Error fetching group by name:', e);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getAllMembersGroupName(req:Request, res:Response){
  const {groupName} = req.params;

  try {
      const result= await pool.query('SELECT * FROM idols INNER JOIN groups ON idols.group_name = groups.group_name WHERE groups.group_name ILIKE $1;', [`%${groupName}%`]);
      res.status(200).json(result.rows);
  }  catch (error) {
      console.error('❌ Error fetching members by group name:', error);
      res.status(500).json({ error: 'Database error' });
    }
}

export async function getAllMembersGroupDebutDate(req: Request, res: Response) {
  const { date } = req.params;
  const numericDate = Number(date);
  
  try {
    const result = await pool.query(
      `SELECT * FROM idols 
       INNER JOIN groups ON idols.group_name = groups.group_name 
       WHERE groups.debut_date = $1;`,
      [numericDate]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching members by debut date:', error);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getIdolByName(req: Request, res: Response){
  const { name } = req.params;

  try {
    const results = await pool.query(
      `SELECT * FROM idols 
       INNER JOIN groups ON idols.group_name = groups.group_name
       WHERE idols.stage_name ILIKE $1 OR idols.legal_name ILIKE $1;`,
      [`%${name}%`]
    );
    
    res.status(200).json(results.rows);
  } catch (error) {
    console.error('❌ Error searching for idol by name:', error);
    res.status(500).json({ error: 'Database error' });
  }
}

