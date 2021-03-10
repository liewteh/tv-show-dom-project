let allShows = getAllShows();
let episodesPage = false;

function setup() {
  homeButton();
  displayShows(allShows);
  selectShows();
}

// Leading zeros function for Season number and Episode number
function pad(num, size) {
  let number = num.toString();
  while (number.length < size) number = "0" + num;
  // Patryk: Nice solution. I used built in method check this: .padStart()
  return number;
}

// level 500
function homeButton() {
  let homeBtn = document.getElementById("home");

  homeBtn.addEventListener("click", (elem) => {
    // reset live search
    reset();

    // change live search to search shows
    episodesPage = false;

    setup(); // display shows
    const selectShow = document.getElementById("selectShow");
    const selectEpisode = document.getElementById("selectEpisode");

    // reset select Show drop-down
    selectShow.value = "";
    selectEpisode.options.length = 1;
  });
}

// function to create a show
function makeOneShow(elem) {
  const oneShow = document.createElement("li");
  const showTitle = document.createElement("h4");
  const showImg = document.createElement("img");
  const genre = document.createElement("p");
  const status = document.createElement("p");
  const rating = document.createElement("p");
  const runtime = document.createElement("p");

  oneShow.value = elem.id;
  showTitle.value = elem.id;
  showTitle.innerText = elem.name;
  showImg.id = "ShowImg";

  // Patryk: check out this solution: item.image?.medium ? item.image.medium : "https://static.tvmaze.com/images/no-img/no-img-landscape-text.png"
  // it is ternary operator what is very popular, base on this example You can easily implement it

  if (elem.image) {
    showImg.src = elem.image?.medium;
  } else {
    showImg.src =
      "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
  }
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

  showTitle.addEventListener("click", (elem) => {
    let showId = elem.target.value;

    // change live search to search episode
    episodesPage = true;

    //Patryk: Functions most of the time should be response for one action. Consider to separate these two parts of functionality
    // https://en.wikipedia.org/wiki/Single-responsibility_principle
    //ps it is principle not a rule, so You should implement it where it is possible and it making code easier to maintanance and debug
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        episodeSelection(allEpisodes);
        episodeFilter(allEpisodes);
      })
      .catch(function (error) {
        console.log(error);
      });
    document.getElementById("selectShow").value = showId;
  });
  return oneShow;
}

// function to create all episodes
function displayShows(shows) {
  const rootElem = document.getElementById("root");
  let ul = document.createElement("ul");

  ul.id = "ulShows";

  // reset page
  rootElem.innerHTML = "";

  shows.forEach((episode) => {
    ul.appendChild(makeOneShow(episode));
  });
  rootElem.appendChild(ul);

  // change live search to search shows
  episodesPage = false;
}

// level 400
function selectShows() {
  let selectShow = document.getElementById("selectShow");

  allShows.forEach((show) => {
    let menuTitle = document.createElement("option"); // create display title tag

    menuTitle.value = show.id;
    menuTitle.innerText = show.name;

    selectShow.appendChild(menuTitle);
  });

  selectShow.addEventListener("change", function (event) {
    let showId = event.target.value;

    if (showId === "") {
      setup(); // when select show click, display all shows
    } else {
      // change live search to search episode
      episodesPage = true;

      // reset live search
      reset();

      fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          allEpisodes = data;
          makePageForEpisodes(allEpisodes);
          episodeSelection(allEpisodes);
          episodeFilter(allEpisodes);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
}

// level 100 make and display each episode
// function for Episode's Title and Season
function makeEpisodeTitleAndSeason(elem) {
  const episodeTitle = document.createElement("h4");

  episodeTitle.innerText = `${elem.name} - S${pad(elem.season, 2)}E${pad(
    elem.number,
    2
  )}`;

  return episodeTitle;
}

// function for Episode's Image
function makeEpisodeImg(elem) {
  const episodeImg = document.createElement("img");

  episodeImg.id = "episodeImg";
  if (elem.image) {
    episodeImg.src = elem.image?.medium;
  } else {
    episodeImg.src =
      "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
  }

  return episodeImg;
}

// function to create an episode with title & season, and image
function makeOneEpisode(elem) {
  const oneEpisode = document.createElement("li");

  oneEpisode.value = elem.id;
  oneEpisode.innerHTML = elem.summary;

  oneEpisode.insertBefore(
    makeEpisodeTitleAndSeason(elem),
    oneEpisode.childNodes[0]
  );
  oneEpisode.insertBefore(makeEpisodeImg(elem), oneEpisode.childNodes[1]);

  return oneEpisode;
}

// function to create all episodes
function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  let ul = document.createElement("ul");

  ul.id = "ulEpisodes";
  rootElem.innerHTML = "";

  episodes.forEach((episode) => {
    ul.appendChild(makeOneEpisode(episode));
  });

  rootElem.appendChild(ul);

  // reset live search
  reset();
}

// level 200 (live search and result counter)

//Patryk This function is two big and double their duties. YOu are searching though the shows and episodes, It would be good practise if you woulld try to divide it for two separate function and a
// after it YOu can try to make the function which is going to take change searching element dependent from the state. But without if else in that form. I mean to try run out from the doubled code.
// for example You can think over how to change the source though each you iterate
function liveSearch() {
  document.getElementById("selectEpisode").value = "";

  if (episodesPage === true) {
    // user input
    let keyInput = document.getElementById("keyInput");
    // filter, makes search not case sensitive
    let filter = keyInput.value.toUpperCase();
    // individual item on list
    let oneEpisode = ulEpisodes.getElementsByTagName("li");
    let counter = 0;

    for (let i = 0; i < allEpisodes.length; i++) {
      let title = allEpisodes[i].name;
      let summaryNoPTag = allEpisodes[i].summary;

      // Patryk Nice idea to kick it out, what is proper approach in my opinion or at least better than my :> I just reuse the <p> coming from API :D
      summaryNoPTag = summaryNoPTag.replace(/(<p>|<\/p>)/g, ""); // regex to remove <p> tag from data

      // Patryk I like that you implemented the separation of concerns, taking care for elements by CSS
      if (
        summaryNoPTag.toUpperCase().indexOf(filter) > -1 ||
        title.toUpperCase().indexOf(filter) > -1
      ) {
        oneEpisode[i].classList.remove("hidden");
        counter += 1;
      } else {
        oneEpisode[i].classList.add("hidden");
      }
    }
    document.getElementById(
      "liveSearchResult"
    ).textContent = `Displaying ${counter}/${allEpisodes.length} episodes`;
  } else {
    // user input
    let keyInput = document.getElementById("keyInput");
    // filter, makes search not case sensitive
    let filter = keyInput.value.toUpperCase();
    // individual item on list
    let oneEpisode = ulShows.getElementsByTagName("li");
    let counter = 0;

    for (let i = 0; i < allShows.length; i++) {
      let title = allShows[i].name;
      let summaryNoPTag = allShows[i].summary;
      summaryNoPTag = summaryNoPTag.replace(/(<p>|<\/p>)/g, ""); // regex to remove <p> tag from data
      let showGenre = allShows[i].genres.join(" "); // array of genres into string

      if (
        summaryNoPTag.toUpperCase().indexOf(filter) > -1 ||
        title.toUpperCase().indexOf(filter) > -1 ||
        showGenre.toUpperCase().indexOf(filter) > -1
      ) {
        oneEpisode[i].classList.remove("hidden");
        counter += 1;
      } else {
        oneEpisode[i].classList.add("hidden");
      }
    }
    document.getElementById(
      "liveSearchResult"
    ).textContent = `Displaying ${counter}/${allShows.length} shows`;
  }
}

// level 300
// create episode selection
function episodeSelection(allEpisodes) {
  let select = document.getElementById("selectEpisode");

  // reset select episode drop-down but keep All episode (option)
  while (select.lastChild.id !== "default") {
    select.removeChild(select.lastChild);
  }

  allEpisodes.forEach((elem) => {
    let menuTitle = document.createElement("option"); // create display title tag

    menuTitle.value = elem.id;
    menuTitle.innerText = `S${pad(elem.season, 2)}E${pad(elem.number, 2)} - ${
      elem.name
    }`;

    select.appendChild(menuTitle);
  });
}

// selection filter
function episodeFilter(allEpisodes) {
  let selectEpisode = document.getElementById("selectEpisode");

  selectEpisode.addEventListener("change", (elem) => {
    let selectedEpisode = elem.target.value;
    // Grabs the parent element by id
    let ul = document.getElementById("ulEpisodes");
    // Individual item on list
    let oneEpisode = ul.getElementsByTagName("li");
    for (let i = 0; i < allEpisodes.length; i++) {
      if (
        selectedEpisode === allEpisodes[i].id.toString() ||
        selectedEpisode === ""
      ) {
        // Displays list items that are a match, and nothing if no match
        oneEpisode[i].classList.remove("hidden");

        // reset live search
        reset();
      } else {
        oneEpisode[i].classList.add("hidden");
      }
    }
  });
}

function reset() {
  document.getElementById("keyInput").value = "";
  document.getElementById("liveSearchResult").innerHTML = "";
}
window.onload = setup;

// I like it! I read Your code and I do not feel exhaust!
