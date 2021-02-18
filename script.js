const allEpisodes = getAllEpisodes(); // get episodes data from episodes.js
makePageForEpisodes(allEpisodes);
let search = document.getElementById('search');



// Leading zeros function for Season number and Episode number
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

// level 100 (displaying data)
function setup() {
  allEpisodes.forEach(elem => {
    let list = document.createElement('li');
    let img = document.createElement('img'); // create display image tag

    img.id = 'img';
    img.src = `${elem.image.medium}`;
    list.innerHTML = elem.summary;

    list.insertBefore((titleAndSeason(elem)), list.childNodes[0]);
    list.insertBefore(img, list.childNodes[1]);
    mainContainer.appendChild(list);
  })
}

// get title and season; level 100 & 300
function titleAndSeason(elem) {
  let title = document.createElement('h4'); // create display title tag
  title.id = `S${pad(elem.season, 2)}E${pad(elem.number,2)}`;
  title.innerText = `${elem.name} - S${pad(elem.season, 2)}E${pad(elem.number,2)}`;
  return title;
}

// level 200 (live search and result counter)
function mySearchFunction() {
  // Declare variables
  let input, filter, ul, li, title, summaryNoP, i;
  // User Input
  input = document.getElementById("myInput");
  // Filter, makes search not case sensitive
  filter = input.value.toUpperCase();
  // Grabs the parent element by id
  ul = document.getElementById("mainContainer");
  // Individual item on list
  li = ul.getElementsByTagName("li");

  // Treats lists items like an array, where each item can be accessed through      it's index
  for (i = 0; i < allEpisodes.length; i++) {
    title = allEpisodes[i].name;
    summaryNoP = allEpisodes[i].summary;
    summaryNoP = summaryNoP.replace(/(<p>|<\/p>)/g, ""); // regex to remove <p> tag from data

    // Iterate over each list item to see if the value of the input, ignoring         case, matches the inner text or inner html of the item.
    if (summaryNoP.toUpperCase().indexOf(filter) > -1 || title.toUpperCase().indexOf(filter) > -1) {
      // Displays list items that are a match, and nothing if no match
      li[i].classList.remove('hidden');
    } else {
      li[i].classList.add('hidden');
    }
  }
  // display search's result number
  document.getElementById('result').textContent = `Displaying ${document.querySelectorAll('#mainContainer li:not(.hidden)').length}/${allEpisodes.length} episodes`;
}

// level 300
// display drop menu
function displaySelection() {
  let select = document.getElementById('selectOption');

  allEpisodes.forEach(elem => {
    let menuTitle = document.createElement('option'); // create display title tag
    menuTitle.innerText = `S${pad(elem.season, 2)}E${pad(elem.number,2)} - ${elem.name}`;

    select.appendChild(menuTitle);
  })
}
displaySelection();

function selectResult() {
  document.getElementById('selectOption').addEventListener('change', function (elem) {
    let selectedEpisode = elem.currentTarget.value;
    let seasonNumber = selectedEpisode.split(" ").shift();

    let ul, li, title, i;

    // Grabs the parent element by id
    ul = document.getElementById("mainContainer");
    // Individual item on list
    li = ul.getElementsByTagName("li");
    
    // Treats lists items like an array, where each item can be accessed through      it's index
    for (i = 0; i < allEpisodes.length; i++) {
      title = `S${pad(allEpisodes[i].season, 2)}E${pad(allEpisodes[i].number,2)}`;

      // Iterate over each list item to see if the value of the input, ignoring         case, matches the inner text or inner html of the item.
      if (seasonNumber === title && seasonNumber !== 'All episodes') {
        // Displays list items that are a match, and nothing if no match
        li[i].classList.remove('hidden');
      } else {
        li[i].classList.add('hidden');
      }
    }
  });
}

function makePageForEpisodes(episodeList) {
  let rootElem = document.getElementById("root");
  let mainContainer = document.createElement('ul');
  mainContainer.id = 'mainContainer';
  rootElem.appendChild(mainContainer);
}

window.onload = setup;