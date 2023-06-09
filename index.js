let gameTimer = undefined; // variable to hold the game timer interval
let seconds = 0; // variable to hold the number of seconds elapsed
let images = []; // array to store the retrieved Pokémon images
let firstCard = undefined;
let secondCard = undefined;
// let rows = 0; // default number of rows
// let cols = 0; // default number of columns
// let totalPairs = Math.ceil(rows * cols / 2);
let matchedPairs = 0;
// let pairsLeft = totalPairs;
let clicksCount = 0;

const startTimer = () => {
  gameTimer = setInterval(() => {
    seconds++;
    $('#timer').text(`${seconds} `);
  }, 1000);
};

const resetTimer = () => {
  clearInterval(gameTimer);
  seconds = 0;
  $('#timer').text('0');
};
const powerUp = () => {
  $('.card').addClass('flip');
  setTimeout(() => {
    $('.card').removeClass('flip');
  }, 1000);
  seconds += 12.5;
  $('#timer').text(`${seconds} `);
};
const retrievePokemonImages = () => {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (response) {
      try {
        const pokemonList = response.results;
        const shuffledPokemonList = shuffleArray(pokemonList);
        const selectedPokemon = shuffledPokemonList.slice(0, Math.ceil(rows * cols / 2));
        const duplicatedPokemon = [...selectedPokemon, ...selectedPokemon];

        // Add Pokemon images to images array
        images = duplicatedPokemon.map((pokemon) => {
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;
          return $('<img>').attr('src', imageUrl).attr('data-pokemon', pokemon.name);
        });

        createGameGrid();
      } catch (error) {
        console.error('Error retrieving Pokemon images:', error);
      }
    },
    error: function (xhr, status, error) {
      console.error('Error retrieving Pokemon list:', error);
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  });
};

const shuffleArray = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const createGameGrid = () => {
  const gameGrid = $('#game_grid');

  gameGrid.empty();

  const cardWidth = (() => {
    switch (`${rows}x${cols}`) {
      case '2x3':
        return '33%';
      case '3x4':
        return '25%';
      case '4x6':
        return '16%';
      default:
        return '25%';
    }
  })();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const card = $('<div>').addClass('card').css('width', cardWidth);
      const frontFace = $('<img>').addClass('front_face');
      const backFace = $('<img>').addClass('back_face').attr('src', 'back.webp');

      card.append(frontFace).append(backFace);
      gameGrid.append(card);
    }
  }

  images = shuffleArray(images);

  const cards = gameGrid.find('.card');

  cards.each(function (index) {
    $(this).find('.front_face').replaceWith(images[index]);
  });

  setup();
};

const updateStats = () => {
  $('#totalPairs').text(totalPairs);
  $('#matchedPairs').text(matchedPairs);
  $('#pairsLeft').text(pairsLeft);
  $('#clicksCount').text(clicksCount);
};

const setup = () => {
  $(".card").on("click", function () {
    clicksCount++;
    updateStats();
    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = this;
    } else if (!secondCard) {
      secondCard = this;

      if ($(firstCard).find("img").attr("data-pokemon") === $(secondCard).find("img").attr("data-pokemon")) {
        console.log("match");
        firstCard = undefined;
        secondCard = undefined;

        matchedPairs++;
        pairsLeft--;
        updateStats();

        if (matchedPairs === totalPairs) {
          clearInterval(gameTimer);
          alert("Congratulations! You've won the game!");
        }
        if (seconds === 100) {
          clearInterval(gameTimer);
          alert("Time's up! You've lost the game!");
        }
      } else {
        console.log("no match");
        setTimeout(() => {
          $(firstCard).toggleClass("flip");
          $(secondCard).toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
        }, 1000);
        updateStats();
      }
    } else {
      $(firstCard).toggleClass("flip");
      $(secondCard).toggleClass("flip");
      firstCard = this;
      secondCard = undefined;
      updateStats();
    }
  });

  $('#start-btn').on('click', () => {
    $('#game_stats').show();
    $('#game_grid').show();
    $('#start-btn').hide();
    resetTimer();
    startTimer();
    retrievePokemonImages();
    $("#dark-mode-btn").show();
    updateStats();
    $("#power-up-btn").show();
  });

  $('#reset-btn').on('click', () => {
    resetTimer();
    matchedPairs = 0;
    pairsLeft = totalPairs;
    clicksCount = 0;
    $('#start-btn').show();
    updateStats();
  });

  $('#easy-btn').on('click', () => {
    rows = 2;
    cols = 3;
    totalPairs = Math.ceil(rows * cols / 2);
    pairsLeft = totalPairs;
    $('#easy-btn').addClass('selected');
    $('#medium-btn').removeClass('selected');
    $('#hard-btn').removeClass('selected');
    $('#game_stats').hide();
    $('#game_grid').hide();
    $('#timelevel').text("100");
    $('#start-btn').show();
    resetTimer();
    createGameGrid();
  });

  $('#medium-btn').on('click', () => {
    rows = 3;
    cols = 4;
    totalPairs = Math.ceil(rows * cols / 2);
    pairsLeft = totalPairs;
    $('#medium-btn').addClass('selected');
    $('#easy-btn').removeClass('selected');
    $('#hard-btn').removeClass('selected');
    $('#game_stats').hide();
    $('#game_grid').hide();
    $('#timelevel').text("200");
    $('#start-btn').show();
    resetTimer();
    createGameGrid();
  });

  $('#hard-btn').on('click', () => {
    rows = 4;
    cols = 6;
    totalPairs = Math.ceil(rows * cols / 2);
    pairsLeft = totalPairs;
    $('#hard-btn').addClass('selected');
    $('#easy-btn').removeClass('selected');
    $('#medium-btn').removeClass('selected');
    $('#game_stats').hide();
    $('#game_grid').hide();
    $('#timelevel').text("300");
    $('#start-btn').show();
    resetTimer();
    createGameGrid();
  });
  $("#dark-mode-btn").click(function () {
    $("#game_grid").addClass("dark-mode");
    $("#dark-mode-btn").hide();
    $("#light-mode-btn").show();
  });

  $("#light-mode-btn").click(function () {
    $("#game_grid").removeClass("dark-mode");
    $("#light-mode-btn").hide();
    $("#dark-mode-btn").show();
  });
  $('#power-up-btn').on('click', () => {
    powerUp();
  });
};

$(document).ready(() => {
  $('#game_stats').hide();
  $('#game_grid').hide();
  $("#light-mode-btn").hide();
  $("#dark-mode-btn").hide();
  $("#power-up-btn").hide();
  setup();
});
