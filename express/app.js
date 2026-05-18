const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const app = express();
const port = 3000;
require("dotenv").config()

app.use(express.static(__dirname + '/public'));
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);


app.get('/watchlist', async (req, res) => {
    console.log("Attempting to get every customer's watchlist");
    const anime = req.body;
    const { data, error } = await supabase.from('watchlist').select('*').eq('customer_id', anime.customer_id).order('date_added', { ascending: false });
    console.log("Data: ", data);
    });

app.get('/anime', async (req, res) => {
    console.log("Attempting to get anime information");
    const { data, error } = await supabase.from('Core_Table').select();
    res.json(data);
    });

app.get('/animeById', async (req, res) => {
    console.log("Attempting to get anime information");
    const { mal_id } = req.query;
    const { data, error } = await supabase.from('Core_Table').select().eq('mal_id', mal_id).single();
    res.json(data);
    });

app.post('/filteredAnime', async (req, res) => {
    console.log("Attempting to get filtered anime information");
    const { genres, themes, minScore, maxScore } = req.body;
    
    const {data : matches, error} = await supabase.rpc('get_random_anime', {
        input_genres: genres || [],
        input_themes: themes || [],
        min_s: minScore ? Number(minScore) : 0,
        max_s: maxScore ? Number(maxScore) : 10
    });

    res.json(matches);
    console.log("Filtered Anime Data: ", matches);
});



app.post('/add_to_watchlist', async (req, res) => {
    console.log("Attempting to add to watchlist");
    const anime  = req.body;

    const { data, error } = await supabase
    .from('watchlist')
    .upsert({ mal_id: anime.mal_id, customer_id: anime.customer_id, date_added: anime.date_added }).select();
    console.log("Customer: ", anime);
    });

app.get('/getWatchlist', async (req, res) => {
    const { customer_id } = req.query; 

    const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('customer_id', customer_id)
        .order('date_added', { ascending: false });

    return res.status(200).json(data);
});

app.get('/home', (req, res) => {
    res.sendFile('public/Home.html', {root: __dirname});
});

app.get('/about', (req, res) => {
    res.sendFile('public/About.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Express app is listening on port ${port}/`);
});