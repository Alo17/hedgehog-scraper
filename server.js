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
app.get('/hedgie/:keyword',(req,res) => {
  var keyword = req.params.keyword;

  function findHedgieImage(keyword) {
    var nightmare = Nightmare({show: true}); //makes bot
    return nightmare

    .goto('https://www.google.com') //bot goes to google
    .insert('input[title="Search"]', `hedgehog ${keyword}`)//the thing you want to search the hedge with
    .click('input[value="Google Search"]')//this clicks the search button in order to find the image
    .wait('a.q.qs')//This is telling it to wait until the web is found
    .click('a.q.qs')//
    .wait('div#res.med')
    .evaluate(function() {
      var photoDivs = document.querySelectorAll('img.rg_ic');
      var list = [].slice.call(photoDivs);

        return list.map(function(div) {
          return div.src;
        });
      })
      .end()
      .then(function(result) {
        return result.slice(1,5);
      })
      .then(function (images) {
        res.json(images);
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
