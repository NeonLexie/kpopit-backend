import express from 'express';
import dotenv from 'dotenv';
import idolAndGroupRoutes from './routes/idolsAndGroups/idolAndGroupsRoutes';
import usersRoutes from './routes/users/usersRoutes';
import postRoutes from './routes/posts/postRoutes';
import playlistRoutes from "./routes/playlists/playlistRoutes"
import pollsRoutes from './routes/polls/pollsRoutes';




dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('API is working!');
});

// Mount router
app.use('/api/idols_and_groups', idolAndGroupRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/playlists',playlistRoutes)
app.use('/api/polls', pollsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
