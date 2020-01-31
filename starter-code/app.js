require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artist-search', (req, res) => {
  // console.log(req.query.artist);

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      res.render('artist-search-results.hbs', { data: data.body });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      // res.send(data);
      // console.log('The received data from the API: ', data.body);
      res.render('albums.hbs', { data: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId);
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks.hbs', { data: data.body });
    })
    .catch(err => console.log('The error while searching tracks: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
