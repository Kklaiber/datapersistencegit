//module imports
const express = require('express');
const sqlite = require('sqlite3');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});

//view engine config
const app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
 

//db connection
const db = new sqlite.Database('/Users/kyleklaiber/Downloads/Chinook_Sqlite_AutoIncrementPKs (1).sqlite');

let query = 'SELECT Name, Title FROM Artist INNER JOIN Album on Artist.ArtistId = Album.ArtistId';
let queryResult= [];

db.each(query, (err,row) => {
    if(err)throw err;
      else{ 
       queryResult.push(row)
      }
});

app.use(express.static('main'));


app.get('/', (req,res) => {
    // console.log(query)
    res.render('home', {
       Artist: queryResult
    })
})

app.get('/albums',(req,res) => {
    res.render('albums')
});


app.post('/albums', (req,res) =>{
    db.run('INSERT into Artist(ArtistId, Name) VALUES(${req.body.artistId}, ${req.body.name})',
(err,row) => {
    if(err)throw err;
    res.redirect(303,'/success')
    })
})

db.close();



app.listen(3000, () => {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})



