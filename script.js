function setup() {
  const allEpisodes = getAllEpisodes();


  makePageForEpisodes(allEpisodes);
  episodeSelection();
  episodeFilter(allEpisodes);
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
  episodeImg.src = elem.image.medium;

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
  let episodeContainer = document.createElement("ul");

  episodeContainer.id = "episodeContainer";
  episodeContainer.innerHTML = "";

  episodes.forEach((episode) => {
    episodeContainer.appendChild(makeOneEpisode(episode));
  });

  rootElem.appendChild(episodeContainer);
}

// level 200 (live search and result counter)
function liveSearch() {
  const allEpisodes = getAllEpisodes();
  // user input
  let keyInput = document.getElementById('keyInput');
  // filter, makes search not case sensitive
  let filter = keyInput.value.toUpperCase();
  // grabs the parent element by id
  let episodeContainer = document.getElementById('episodeContainer');
  // individual item on list
  let oneEpisode = episodeContainer.getElementsByTagName("li");

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
function episodeSelection() {
  const allEpisodes = getAllEpisodes();
  let select = document.getElementById('selectEpisode');
  let index = 0;

  allEpisodes.forEach(elem => {
    let menuTitle = document.createElement('option'); // create display title tag

    menuTitle.value = index;
    menuTitle.innerText = `S${pad(elem.season, 2)}E${pad(elem.number,2)} - ${elem.name}`;

    select.appendChild(menuTitle);
    index++;
  })
}

// selection filter
function episodeFilter(allEpisodes) {
  let selectEpisode = document.getElementById('selectEpisode');

  selectEpisode.addEventListener('change', elem => {
    let selectedEpisode = elem.target.value;

    // let title = allEpisodes[selectedEpisode].name;
    // Grabs the parent element by id
    ul = document.getElementById("episodeContainer");
    // Individual item on list
    li = ul.getElementsByTagName("li");

    for (let i = 0; i < allEpisodes.length; i++) {

      if (allEpisodes[selectedEpisode] === allEpisodes[i] || selectedEpisode === 'All episodes') {
        // Displays list items that are a match, and nothing if no match
        li[i].classList.remove('hidden');
      } else {
        li[i].classList.add('hidden');
      }
    }
  });
}

window.onload = setup;