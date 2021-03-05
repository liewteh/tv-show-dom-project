let allEpisodes;

function setup() {
  selectShows();
}

// level 400
function selectShows() {
  let selectShow = document.getElementById('selectShow');
  let allShow = getAllShows();

  allShow.forEach(show => {
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

// Leading zeros function for Season number and Episode number
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

// level 100 make and display each episode
// function for Episode's Title and Season
function makeEpisodeTitleAndSeason(elem) {
  const episodeTitle = document.createElement("h4");

  episodeTitle.id = `S${pad(elem.season, 2)}E${pad(elem.number, 2)}`;
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
  // const allEpisodes = getAllEpisodes();
  // user input
  let keyInput = document.getElementById('keyInput');
  // filter, makes search not case sensitive
  let filter = keyInput.value.toUpperCase();
  // grabs the parent element by id
  let ul = document.getElementById('ul');
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
  // const allEpisodes = getAllEpisodes();
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