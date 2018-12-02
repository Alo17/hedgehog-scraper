const express = require('express');
const app = express();
const cors = require('cors');
const Nightmare = require('nightmare');

const port = 3000;

app.use(cors());

// first endpoint - already built
// this says that when the app is at "/" - so "home", it will send a response of "Hedgehog Time". That is why we see those words on the screen when we go to localhost:3000/.
app.get('/', (req, res) => {
  res.send("Hedgehog Time");
});

// your endpoint
app.get('/pets', (req, res) => {
  res.send("I like horses");
});

// scraper endpoint
app.get('/:name', (req, res) => {
  var name = req.params.name;

  res.send(`Hi, ${name}`);
});
//This is how to find the hedgie images and then the following word is what you want to find the hedge with
app.get('/Ocean/:keyword',(req,res) => {
  var keyword = req.params.keyword;

  function findHedgieImage(keyword) {
    var nightmare = Nightmare({show: true}); //creates bot
    return nightmare

    .goto('https://www.google.com') //bot goes to google.com
    .insert('input[title="Search"]', `Ocean ${keyword}`)//bot searches Ocean + whatever keyword is
    .click('input[value="Google Search"]')//this clicks the search button
    .wait('a.q.qs')//wait for the link to show up
    .click('a.q.qs')// click the link when it shows up
    .wait('div#res.med')//wait for div to appear
    .evaluate(function() {
      var photoDivs = document.querySelectorAll('img.rg_ic');
      var list = [].slice.call(photoDivs); //bot collects all photo containors into one selection

        return list.map(function(div) {
          return div.src;//bot gives us collection of image links
        });
      })
      .end()
      .then(function(result) {
        return result.slice(1,5);//bot takes first 4 pictures
      })
      .then(function (images) {
        res.json(images);//bot gives back images to the user
      })
      .catch(function (error) {
        console.error('Search failed',error);
      })
  }

  findHedgieImage(keyword);

})


app.listen(port, () => {
  console.log(`app running on ${port}`);
});
//scraper endpoint
