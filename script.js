const CAUTION = document.getElementById('caution');
const AGGRESSIVE = document.getElementById('aggressive');
const CLUELESS = document.getElementById('clueless');
const PLAYER = document.getElementById('player');

const DISCARD = document.getElementById('discard');
const DECK = document.getElementById('deck');

score = document.getElementById('score');
cardArray = [];
deckArray = [];
cardsChosen = [];
yourTurn = true;

knockCalled = false;

class Card 
{
    constructor(s, v, i) 
    {
        switch (s) 
        {
            case (1): this.suit = 'clubs'; break;
            case (2): this.suit = 'diamonds'; break;
            case (3): this.suit = 'hearts'; break;
            case (4): this.suit = 'spades'; break;
        }
        this.name = v + '_of_' + this.suit + '.png';
        this.value = v;
        if (v == 1)
            this.value = 11;
        else if (v >= 10)
            this.value = 10;
        this.id = i;
    }
}

function initialize()
{
    //CREATES AN ARRAY OF ALL IMG OBJECTS
    var id = 0;
    for(var i = 1; i <= 4; i++)
        for(var j = 1; j <= 13; j++)
        {
            cardArray.push(new Card(i, j, id));
            id++;
        }
        
    //TURNS ALL IMAGE OBJECTS INTO NODES
    for(var i = 0; i < cardArray.length; i++)
    {
        var card = document.createElement('img');
        card['src'] = 'cards/' + cardArray[i].name;
        card['data-id'] = i;
        card.addEventListener('click', switchYourCard);
        deckArray.push(card);
    }

    setBoard()
}

function setBoard()
{
    deckArray.sort(() => 0.5 - Math.random());

    mrCaution = [];
    msAggressive = [];
    mrClueless = [];
    player = [];

    //HAND OUT CARDS FROM DECK
    discard = deckArray[0];
    deck = deckArray[1];
    deckArray.splice(0,2);
    for(var i = 0; i < 3; i++)
    {
        mrCaution.push(deckArray[i]);
        deckArray.shift();
        msAggressive.push(deckArray[i]);
        deckArray.shift();
        mrClueless.push(deckArray[i]);
        deckArray.shift();
        player.push(deckArray[i]);
        deckArray.shift();
    }
    
    display();
}

function display()
{
    //REMOVES ALL CHILD NODES
    CAUTION.querySelectorAll('*').forEach(n => n.remove());
    AGGRESSIVE.querySelectorAll('*').forEach(n => n.remove());
    CLUELESS.querySelectorAll('*').forEach(n => n.remove());
    PLAYER.querySelectorAll('*').forEach(n => n.remove());

    //APPEND NEW NODES
    player.forEach(card => PLAYER.appendChild(card));
    for(var i = 0; i < 3; i++)
    {
        var back = document.createElement('img');
        back['src'] = 'card_back.png';
        CAUTION.appendChild(back);
        back1 = back.cloneNode();
        AGGRESSIVE.appendChild(back1);
        back2 = back.cloneNode();
        CLUELESS.appendChild(back2);
    }
    DISCARD.appendChild(discard)
    DECK.appendChild(deck)

    //UPDATE SCORES
    score.innerHTML = calculateScore(player);
}

function calculateScore(hand)
{
    var cards = hand.map(x => cardArray[x['data-id']])

    if(cards[0].suit == cards[1].suit && cards[0].suit == cards[2].suit)
        return cards[0].value + cards[1].value + cards[2].value;

    if(cards[0].id%13 == cards[1].id%13 && cards[0].id%13 == cards[2].id%13)
        return 30;

    cards.sort((a, b) => (a.suit > b.suit) ? 1 : -1);
    var compare = (a,b) => (a.suit == b.suit) ? a.value + b.value : Math.max(a.value, b.value);
    return Math.max(compare(cards[0], cards[1]), compare(cards[1], cards[2]));
}

function switchYourCard()
{
    //APPENDS CARDS FOR SWAP
    if(discard == this || deck == this)
        cardsChosen[0] = this;
    else
        cardsChosen[1] = this;

    //ONLY SWAP IF BOTH SLOTS ARE FILLED
    if(!(cardsChosen[0] == undefined || cardsChosen[1] == undefined))
    {
        var tempCard = cardsChosen[0];
        var index = player.indexOf(cardsChosen[1])
        if(discard == cardsChosen[0])
        {
            discard = player[index];
            player[index] = tempCard;
        }
        else
        {
            deck = player[index];
            player[index] = tempCard;
        }
        cardsChosen = [];
        display();

        //AFTER YOU SWAP ITS THE AIS TURN
        yourTurn = false;
        if(!yourTurn)
            startRound();
    }
}

function startRound()
{
    for(var i = 0; i < 3; i++)
    {
        switch(i)
        {
            case(0): aggresiveMove(); break;
            case(1): cautiousMove(); break;
            case(2): cluelessMove(); break;
        }
    }
    yourTurn = true;
    updateLife();

    if(gameOver())
        endScreen();
}

function aggresiveMove()
{
    console.log('angy')
}

function cautiousMove()
{
    console.log('scared')
}

function cluelessMove()
{
    console.log('idk')
}

function knock()
{
    //KNOCK MAY ONLY BE CALLED ONCE
    if(knockCalled)
        return;

    knockCalled = true;
    console.log('knock knock')
}

function updateLife()
{
    console.log('vibe check')
}

function roundOver()
{
    return false;
}

function gameOver()
{
    return false;
}

function endScreen()
{
    console.log('ded')
}