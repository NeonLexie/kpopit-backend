import { Request, Response } from 'express';
import pool from "../pool";
import { v4 as uuidv4 } from 'uuid';

export async function getAlLPublicPlaylists(req:Request,res:Response){
    try {
        const result = await pool.query("SELECT * FROM playlists WHERE public = true;")
        if(result.rows.length == 0){
            res.status(404).json({error:"No public Playlists Found"})
        }
        res.status(200).json(result.rows)
    }catch (e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getAllPlaylistsByUserId(req:Request,res:Response){
    const {userId} = req.params

    if(!userId){
        res.status(400).json({error:"Missing Required Fields"})
    }

    try {
        //TODO Gonna need to put this call in utils as I am using it a lot 
        const checkUser = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
        if (checkUser.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        
        const results = await pool.query("SELECT * FROM playlists WHERE user_id = $1",[userId])
        if(results.rows.length == 0){
            res.status(404).json({error:"No playlists created by this user"})
        }
        res.status(200).json(results.rows)

    } catch (e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function  getAllPlaylistByUserName(req:Request, res:Response){
    const {username} = req.params

    if(!username){
        res.status(400).json({error:"Missing Required Fields"})
    }

    try {
        const checkUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (checkUser.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const userIdResult = checkUser.rows[0]?.id;
        if (!userIdResult){
            res.status(404).json({error:"user id not found"})
            console.log(userIdResult)
        }

        const results = await pool.query("SELECT * FROM playlists WHERE user_id = $1",[userIdResult])
        if(results.rows.length == 0){
            res.status(404).json({error:"No playlists created by this user"})
        }
        res.status(200).json(results.rows)

    } catch (error){
        console.error('❌ Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getPlaylistById(req:Request,res:Response){
    const {playlistId} = req.params

    if(!playlistId){
        res.status(400).json({error:"Missing Required Fields"})
    }

    try {
        //TODO come back to this later and do a check if the playlist is private 
        // and if it is make sure only that user can access it
        const result = await pool.query("SELECT * FROM playlists WHERE id = $1",[playlistId])
        if (result.rows.length == 0){
            res.status(404).json({error:"Playlist not found"})
        }
        res.status(200).json(result.rows[0])

    } catch (e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function postPlaylist(req:Request,res:Response){
    const {userId,name,platform,platformPayload,isAiGen} = req.body

    if(!userId || !name || !platform || !platformPayload || !isAiGen){
        res.status(400).json({error:"Missing Required Fields"})
    }

    try {
        const id = uuidv4()
        const parsedPlatformPayload = typeof platformPayload ==='string' ? JSON.parse(platformPayload) : platformPayload

        const result = await pool.query(
            `INSERT INTO playlists (
                id, user_id, name, platform, platform_payload, ai_generated
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING *`,
            [id, userId, name, platform, JSON.stringify(parsedPlatformPayload), isAiGen]
        )
        res.status(201).json(result.rows[0])
        
    } catch (e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function putEditPlaylist(req:Request,res:Response){
    const { playlistId } = req.params
    const {userId,name,platformPayload} = req.body

    if (!playlistId || !name || !platformPayload ) {
        res.status(400).json({error:"Missing Required Fields"})
    }
    try {
        const checkPlaylist = await pool.query("SELECT name FROM playlists WHERE id = $1",[playlistId])
        if (checkPlaylist.rows.length === 0){
            res.status(404).json({error: "This playlist does not exist"})
        }
        const checkCreator = await pool.query("SELECT * FROM playlists WHERE id = $1 AND user_id = $2",[playlistId,userId])
        if (checkCreator.rows.length === 0){
            res.status(401).json({error: "The user did not create this playlist"})
        }

        const result = await pool.query(`
                UPDATE playlists 
                SET name = $1,platform_payload = $2
                WHERE id = $3
                RETURNING *
            `,[name,platformPayload,playlistId])
        res.status(200).json(result.rows[0])

    } catch (e) {
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export async function putUpdateShares(req:Request,res:Response){
    const { playlistId } = req.params

    if (!playlistId){
        res.status(404).json({error: "Missing Required Fields"})
    }
    try {
        const checkPlaylist = await pool.query("SELECT * FROM playlists WHERE id = $1",[playlistId])
        if (checkPlaylist.rows.length === 0){
            res.status(404).json({error: "This playlist does not exist"})
        }
        const isPublic = checkPlaylist.rows[0].public
        if (isPublic === false){
            res.status(403).json({error: "Playlist is private"})
        }
        const result = await pool.query(`
                UPDATE playlists SET shares = shares + 1
                WHERE id = $1
                RETURNING *
            `,[playlistId])
        
        res.status(200).json(result.rows[0])


    } catch (e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//TODO: will need to match to make sure who created this matches up
export async function putPublicOrPrivatePlaylist(req:Request,res:Response){
    const { playlistId } = req.params

    if (!playlistId){
        res.status(404).json({error: "Missing Required Fields"})
    }
    
    try {
        const checkPlaylist = await pool.query("SELECT * FROM playlists WHERE id = $1",[playlistId])
        if (checkPlaylist.rows.length === 0){
            res.status(404).json({error: "This playlist does not exist"})
        }
        const isPublic = checkPlaylist.rows[0].public
        
        const result = await pool.query(`
                UPDATE playlists SET public = $1
                WHERE id = $2
                RETURNING *
            `,[!isPublic,playlistId])
        res.status(200).json(result.rows[0])
        
    } catch(e){
        console.error('❌ Error fetching post:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//TODO will need to verify the user that created this post
export async function deleteAPlaylist(req:Request,res:Response){
    const {playlistId} = req.params

    if (!playlistId){
        res.status(404).json({error: "Missing Required Fields"})
    }

    try {
        const checkPlaylist = await pool.query('SELECT * FROM playlists WHERE id = $1 ',[playlistId])
        if(checkPlaylist.rows.length == 0){
            res.status(404).json({error: "Playlist Not Found"})
        }

        await pool.query('DELETE FROM playlists WHERE id = $1',[playlistId])
        res.status(204).json({message:"Playlist Successfully Deleted"})

    } catch (e){
        console.error('❌ Error fetching Playlist:', e);
        res.status(500).json({ error: 'Internal server error' });    
    }
}