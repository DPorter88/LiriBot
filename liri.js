require("dotenv").config();

//vars
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
//var Spotify = require('spotify-web-api-node');
var Spotify = require('node-spotify-api');
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, exam.; song
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words (2nd user argument)
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

// Fetch Spotify Keys
var spotify = new Spotify(keys.spotify);

// Writes to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "Into the night";
    }

    spotify.search(
        {
            type: "track",
            query: userCommand
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

    //Twitter - command: my-tweets
    function getTweets() {
        //Fetch Twitter Keys
        var client = new Twitter(keys.twitter);
        //Set my account to pull Tweets from
        var screenName = { screen_name: 'captnwalker' };
        //GET tweets
        client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
            //throw error
            if (error) throw error;

            //Loop and Log first 20 tweets
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                logOutput("@captnwalker: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                //seperator
                logOutput("-----------------------");
            }
        });
    }

    //OMDB Movie - command: movie-this
    function getMovie() {
        // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                logOutput('================ Movie Info ================');
                logOutput("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB Rating: " + body.imdbRating);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                logOutput("Rotten Tomatoes URL: " + body.tomatoURL);
                logOutput('==================THE END=================');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }



}   //Closes mySwitch func - Everything except the call must be within this scope

//Call mySwitch function
mySwitch(userCommand);
© 2019 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
