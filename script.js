const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const body = document.getElementById("body");
const formCard = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2305-FTB-PT-WEB-PT-GL';
// Use the APIURL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
const PLAYERS_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

// Aquire Puppies from API
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(PLAYERS_URL);
        const players = await response.json();
        console.table(players);
        return(players.data);
    } catch (error) {
        console.error('Uh oh, trouble fetching players!', error);
    }
};

//Aquire single Puppy by Id from API
const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(PLAYERS_URL);
      const players = await response.json();
  
      if (players.success && players.data && players.data.players) {

        // Sort through players array and match corresponding Id
        const player = players.data.players.find((player) => player.id === playerId);
        if (player) {
          return player;
        } else {
          throw new Error(`Player with ID ${playerId} not found.`);
        }
      } else {
        throw new Error('No players found in the API response.');
      }
    } catch (error) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, error);
      throw error;
    }
  };

// POST New Player/Puppy to API
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(PLAYERS_URL,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
                body: JSON.stringify(playerObj),
              }
          );
          const players = await response.json();
          return (players.data);

    } catch (error) {
        console.error('Oops, something went wrong with adding that player!', error);
    }
};

// DELETE selected Puppy by Id from API
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${PLAYERS_URL}/${playerId}`, 
            {
                method: 'DELETE',
            })
            const deletedPuppy = await response.json();
            console.log(`Deleted puppy #${playerId}`, deletedPuppy);
            const data = await fetchAllPlayers();
            renderAllPlayers(data.players);

    } catch (error) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`, error);
    }
};

// Render the "Add New Player/Puppy" Form
const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
        <h2 id="form-title">Submit a new Player!</h2>
        <form action="" id="ze-form">
        
        <label class="label" for="name">Name of the Puppy?* :</label>
        <input type="text" id="player-name" class="input-field" required/>
        
        <label class="label" for="breed">What Kind of Dog?* :</label>
        <input type="text" id="player-breed" class="input-field" required/>
        
        <label class="label" for="Status">Field or Bench?*  :</label>
        <input type="text" id="player-status" class="input-field" required/>
        
        <label class="label" for="imageUrl">URL Link To A Picture? :</label>
        <input type="url" id="player-image" class="input-field" />

        <p class="required">"*" = Required Input</p>
        
        <button class="sub-button">SEND IT!</button>
        </form>
        `;
        
        // Event listener
        const submitButton = document.querySelector('.sub-button');
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            
            // Convert Form inputs to variables for use in playerObj
            const name = document.getElementById('player-name').value;
            // const id = document.getElementById('player-id').value;
            const breed = document.getElementById('player-breed').value;
            const status = document.getElementById('player-status').value.toLowerCase();
            const imageUrl = document.getElementById('player-image').value;
            // const team = document.getElementById("player-team").value;

            let playerObj = {
                name: name,
                // id: id,
                breed: breed,
                status: status,
                imageUrl: imageUrl,
                // team: team
            };
            
            // Create a new party
            try {
                await addNewPlayer(playerObj);
                
                // Clear the form after successful submission
                document.getElementById("ze-form").reset();
                
                // Fetch and render all parties again to include the newly created party
                const data = await fetchAllPlayers();
                renderAllPlayers(data.players);
            } 
            catch (error) {
                console.error("Failed to submit a new party", error);
            }
        });
    } catch (error) {
        console.error('Uh oh, trouble rendering the new player form!', error);
    }
};

// Render the container displaying selected Puppy by Id
const renderSinglePlayerById = async (id) => {
    try {
        const player = await fetchSinglePlayer(id);
        const playerDetailsElement = document.createElement("div");
        playerDetailsElement.classList.add("player-details");
        playerDetailsElement.innerHTML = `
        <h2>${player.name}</h2>
        <p>#${player.id}</p>
        <p>Breed: ${player.breed}</p>
        <p>Status: ${player.status}</p>
        <div class="image-container">
            <img src="${player.imageUrl}" alt="${player.name}'s picture is missing!"/>
        </div>
        <button class="close-button">Close</button>
        `;
        
        // Hide Form and Puppy Cards and Show only selected Card
        formCard.style.display = "none";
        playerContainer.style.display = "none"; 
        playerDetailsElement.style = "";
        document.body.appendChild(playerDetailsElement);
        
        // Close the selected Puppy Card
        const closeButton = playerDetailsElement.querySelector(".close-button");
        closeButton.addEventListener("click", async () => {
            playerDetailsElement.remove();
            formCard.style.display = "";
            playerContainer.style = "";
            const data = await fetchAllPlayers();
            renderAllPlayers(data.players);  
        });
    } catch (error) {
        console.error(`Uh oh, trouble player (id=${id})!`, error);
    }
};

// Render all Puppies in their respective containers
const renderAllPlayers = (players) => {
    try {
        // playerContainer.innerHTML = "";
        playerContainer.innerHTML = "";
        players.forEach((player) => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player-card");
            playerElement.innerHTML = `
            <p class="id-tag">#${player.id}</p>
            <h2 class="name-tag">${player.name}</h2>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <div class="image-container">
            <img src="${player.imageUrl}" alt="${player.name}'s picture is missing!"/>
            </div>
            <button class="details-button" data-id="${player.id}">See Details</button>
            <button class="delete-button" data-id="${player.id}">Delete Player</button>
            `;
            playerContainer.appendChild(playerElement);
            
            // See Details
            const detailsButton = playerElement.querySelector(".details-button");
            detailsButton.addEventListener("click", async (event) => {
                event.preventDefault();
                renderSinglePlayerById(player.id);
            });
            
            // Delete Puppy
            const deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                const confirmed = window.confirm("Are you sure you want to delete this player?");
  
                if (confirmed) {
                  removePlayer(player.id);
                }
            });
        
        });
    } catch (error) {
        console.error('Uh oh, trouble rendering players!', error);
    }
};


// Media query function
function mediaQueryCheck(x) {
    if (x.matches) {
        newPlayerFormContainer.style.width = "90%";

    //   document.body.style.backgroundColor = "red";
    //   formCard.style.margin = "20px 32%";
    }
  };
  var x = window.matchMedia("(max-width: 490px)");

// Initialise the page
const init = async () => {
    mediaQueryCheck(x);
    renderNewPlayerForm();
    const data = await fetchAllPlayers();
    renderAllPlayers(data.players);
    
};

init();




/** Prompts
 * 
 * It fetches all players from the API and returns them
 * @returns An array of objects.

 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.

 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */