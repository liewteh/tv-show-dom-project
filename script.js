let allEpisodes;
let allShows = getAllShows();

function setup() {
  displayShows(allShows);
  selectShows();
}

// Leading zeros function for Season number and Episode number
function pad(num, size) {
  let number = num.toString();
  while (number.length < size) number = "0" + num;
  return number;
}

// level 500
// function to create a show
function makeOneShow(elem) {
  const oneShow = document.createElement("li");
  const showTitle = document.createElement("h4");
  const showImg = document.createElement("img");
  const genre = document.createElement('p');
  const status = document.createElement('p');
  const rating = document.createElement('p');
  const runtime = document.createElement('p');

  oneShow.value = elem.id;
  showTitle.innerText = elem.name;
  showImg.id = "ShowImg";
  showImg.src = elem.image?.medium;
  oneShow.innerHTML = elem.summary;
  genre.innerText = `\nGenre: ${elem.genres}`;
  status.innerText = `Status: ${elem.status}`;
  rating.innerText = `Average: ${elem.rating.average}`;
  runtime.innerText = `Runtime: ${elem.runtime}`;

  oneShow.insertBefore(showTitle, oneShow.childNodes[0]);
  oneShow.insertBefore(showImg, oneShow.childNodes[1]);
  oneShow.appendChild(genre);
  oneShow.appendChild(status);
  oneShow.appendChild(rating);
  oneShow.appendChild(runtime);

  return oneShow;
}

// function to create all episodes
function displayShows(shows) {
  const rootElem = document.getElementById("root");
  let ul = document.createElement("ul");

  rootElem.innerHTML = "";

  shows.forEach((episode) => {
    ul.appendChild(makeOneShow(episode));
  });
  rootElem.appendChild(ul);
}

// level 400
function selectShows() {
  let selectShow = document.getElementById('selectShow');

  allShows.forEach(show => {
    let menuTitle = document.createElement('option'); // create display title tag

    menuTitle.value = show.id;
    menuTitle.innerText = show.name;

    selectShow.appendChild(menuTitle);
  });

  selectShow.addEventListener('change', function (event) {
    let showId = event.target.value;

    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        episodeSelection(allEpisodes);
        episodeFilter(allEpisodes);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

// level 100 make and display each episode
// function for Episode's Title and Season
function makeEpisodeTitleAndSeason(elem) {
  const episodeTitle = document.createElement("h4");

  episodeTitle.innerText = `${elem.name} - S${pad(elem.season, 2)}E${pad(elem.number, 2)}`;

  return episodeTitle;
}

// function for Episode's Image
function makeEpisodeImg(elem) {
  const episodeImg = document.createElement("img");

  episodeImg.id = "episodeImg";
  episodeImg.src = elem.image?.medium;

  return episodeImg;
}

// function to create an episode with title & season, and image 
function makeOneEpisode(elem) {
  const oneEpisode = document.createElement("li");

  oneEpisode.value = elem.id;
  oneEpisode.innerHTML = elem.summary;

  oneEpisode.insertBefore(makeEpisodeTitleAndSeason(elem), oneEpisode.childNodes[0]);
  oneEpisode.insertBefore(makeEpisodeImg(elem), oneEpisode.childNodes[1]);

  return oneEpisode;
}

// function to create all episodes
function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  let ul = document.createElement("ul");

  ul.id = 'ul';
  rootElem.innerHTML = "";

  episodes.forEach((episode) => {
    ul.appendChild(makeOneEpisode(episode));
  });

  rootElem.appendChild(ul);
}

// level 200 (live search and result counter)
function liveSearch() {
  // user input
  let keyInput = document.getElementById('keyInput');
  // filter, makes search not case sensitive
  let filter = keyInput.value.toUpperCase();
  // individual item on list
  let oneEpisode = ul.getElementsByTagName("li");
  let counter = 0;

  for (let i = 0; i < allEpisodes.length; i++) {
    let title = allEpisodes[i].name;
    let summaryNoPTag = allEpisodes[i].summary;
    summaryNoPTag = summaryNoPTag.replace(/(<p>|<\/p>)/g, ""); // regex to remove <p> tag from data

    if (summaryNoPTag.toUpperCase().indexOf(filter) > -1 || title.toUpperCase().indexOf(filter) > -1) {
      oneEpisode[i].classList.remove('hidden');
      counter += 1;
    } else {
      oneEpisode[i].classList.add('hidden');
    }
  }
  document.getElementById('liveSearchResult').textContent = `Displaying ${counter}/${allEpisodes.length} episodes`;
}

// level 300
// create episode selection
function episodeSelection(allEpisodes) {
  let select = document.getElementById('selectEpisode');

  allEpisodes.forEach(elem => {
    let menuTitle = document.createElement('option'); // create display title tag

    menuTitle.value = elem.id;
    menuTitle.innerText = `S${pad(elem.season, 2)}E${pad(elem.number,2)} - ${elem.name}`;

    select.appendChild(menuTitle);
  })
}

// selection filter
function episodeFilter(allEpisodes) {
  let selectEpisode = document.getElementById('selectEpisode');

  selectEpisode.addEventListener('change', elem => {
    let selectedEpisode = elem.target.value;
    // Grabs the parent element by id
    let ul = document.getElementById("ul");
    // Individual item on list
    let oneEpisode = ul.getElementsByTagName("li");
    for (let i = 0; i < allEpisodes.length; i++) {
      if (selectedEpisode === (allEpisodes[i].id).toString() || selectedEpisode === 'All episodes') {
        // Displays list items that are a match, and nothing if no match
        oneEpisode[i].classList.remove('hidden');
      } else {
        oneEpisode[i].classList.add('hidden');
      }
    }
  });
}

window.onload = setup;