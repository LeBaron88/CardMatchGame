/*
 Le Baron88 - june 2019
                        */

var cards_array, guess_count, pair_count, score, game_playing, played, wrong_guess, played_back, ft, bk, card_spinning, matched_card;

cards_array = ["A", "K", "Q", "J", "10", "A", "K", "Q", "J", "10"];
ft = "perspective(600px) rotateY(0deg)";
bk = "perspective(600px) rotateY(-180deg)";
matched_card = "images/matched.png";

// Attach event listner for onclick event to the new game button initially hidden
let new_game = document.querySelector(".btn-new");
new_game.addEventListener('click', init_game);

init_game();

// Game initialization function
function init_game(){
    // reset all variables 
    guess_count = 0;
    wrong_guess = 0;
    pair_count = 0;
    score = 0;
    played = [0, 0];
    played_back = [0, 0];
    game_playing = true;

    // make sure the cards are showing their backs
    let fronts = document.querySelectorAll(".front");
    let backs = document.querySelectorAll(".back");
    for(let i = 0; i < fronts.length; i++){
        fronts[i].style.transform = bk;
        fronts[i].style.zIndez = 2;
        backs[i].style.transform = ft;  
        backs[i].style.zIndez = 1;
    }

    // shuffle and allocate cards 
    shuffle_cards();

    // Delay to allow cards to turn without showing next play
    setTimeout(function (){
        for (let i = 0; i < cards_array.length; i++){
            document.querySelector(`#front_card_${(i+1)}`).src = `images/${cards_array[i]}H.png`;
        }
    }, 700);
    // reset scores and number of guesses 
    update_game_details(0,0);
    // hide result board
    document.querySelector(".game_over").style.zIndex = 1;
    document.querySelector(".game_over").style.opacity = 0;
    card_spinning = false;
}

// Function to shuffle the cards array to have random display of cards on the deck
function shuffle_cards() {
    console.log(cards_array);
    for (let i = cards_array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards_array[i], cards_array[j]] = [cards_array[j], cards_array[i]];
    }
    console.log(cards_array);
}

// Set-up game and attach on click event to all cards, also define all game rules
var card = document.querySelectorAll(".card_container");
for (let i = 0; i < card.length ; i++){
    card[i].addEventListener('click', function() {
        let curr_card_ft = this.getElementsByClassName("front")[0];
        let curr_card_bk = this.getElementsByClassName("back")[0];
        // Check if the game is still on and the card is not selected yet, also that there are no card being turned
        if(game_playing && curr_card_ft.style.transform !== ft && !card_spinning){
            if(guess_count < 2){
                curr_card_ft.style.transform = ft;
                curr_card_ft.style.zIndez = 2;
                curr_card_bk.style.transform = bk;
                curr_card_ft.style.zIndez = 1;
                // Check if the card has already been matched
                if(!curr_card_ft.src.includes(matched_card)){
                    played[guess_count] = curr_card_ft;
                    played_back[guess_count] = curr_card_bk;
                    guess_count += 1;
                }
            }
            // check if two cards have been returned and check their value for match
            if(guess_count == 2) {
                guess_count = 0; // restart the guessing

                //if the two cards selected match
                if(played[0].src === played[1].src){
                    score += 100; // increase score
                    card_spinning = true; // don't allow 3 cards to be turned at the same time
                    setTimeout(function(){  // time-out required to give time to player to see the cards
                        // show matched card label
                        played[0].src = matched_card;
                        played[1].src = matched_card; 
                        card_spinning = false;
                    }, 700); // timeout of 0.7s
                    // if game score reaches 500 then the player wins, uncovered all 5 matches
                    if (score == 500){
                        score += (5 - wrong_guess) * 100;
                        game_playing = false;
                        game_over(1);  // 1 meaning the player has won
                    }                       
                }
                else {
                    wrong_guess += 1; // increment the number of wrong guesses
                    card_spinning = true; // don't allow 3 cards to be turned at the same time
                    setTimeout(function(){  // Time out required to show both cards to player
                        // turn back the both cards
                        played[0].style.transform = bk;
                        played_back[0].style.transform = ft;
                        played[1].style.transform = bk;
                        played_back[1].style.transform = ft;
                        card_spinning = false;
                    }, 700); 
                    // if the player guesses wrongly 5 times then game is over
                    if(wrong_guess === 5){
                        game_playing = false;
                        game_over(0); // zero meaning the player has lost
                    }
                }
                // Update score details
                update_game_details(score, wrong_guess);
            }
        }
    });
}

// Function to update score on the board
function update_game_details(sc, wg) {
    document.querySelector(".score").textContent = `Score: ${sc}`;
    document.querySelector(".wrong_guesses").textContent = `Wrong guesses: ${wg}`;
}

// Display end of game summary and new game button
function game_over(status) {
    // Make sure no forrmatting is done on our result label
    document.querySelector(".result").classList.remove("won");
    document.querySelector(".result").classList.remove("lost");
    // Format and display won message
    if(status === 1) {
        document.querySelector(".result").textContent = "You won!";
        document.querySelector(".result").classList.add("won");
    }
    // Format and display lost message
    else {
        document.querySelector(".result").textContent = "You lost!";
        document.querySelector(".result").classList.add("lost");
    }
    // display final score and make result board visible
    document.querySelector(".final_score").textContent = `final score: ${score}`;
    document.querySelector(".game_over").style.zIndex = 3;
    document.querySelector(".game_over").style.opacity = 1;

}
