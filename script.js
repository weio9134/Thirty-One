<<<<<<< Updated upstream
=======
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

//MS AGGRESSIVE LOCK SWITCHES
firstTurn = true;

>>>>>>> Stashed changes
class Card 
{
    constructor(suit, value) 
    {
        switch(suit)
        {
            case 1: this.Suit = 'clubs'; break;
            case 2: this.Suit = 'diamonds'; break;
            case 3: this.Suit = 'hearts'; break;
            case 4: this.Suit = 'spades'; break;
        }

        this.Name = value + '_of_' + this.Suit + '.png';

        if(value === 1)
            this.Value = 11;
        else if(value >= 10)
            this.Value = 10;
        else
            this.Value = value;
    }
    get suit()
    {
        return this.Suit;
    }
    get value()
    {
        return this.Value;
    }
    get name()
    {
        return this.Name;
    }
}

<<<<<<< Updated upstream
class Player
{
    constructor(id)
    {
        this.ID = id;
        this.Hand = [];
    }
    /**
     * @param {Card} card
     */
    set addCard(card)
    {
        this.Hand.push(card);
    }
    /**
     * @param {int} index
     */
    set removeCard(index)
    {
        var temp = this.Hand[index];
        this.Hand.splice(index, 1);
        return temp;
    }
    get id()
    {
        return this.ID;
    }
    get hand()
    {
        return this.Hand;
    }
    get value()
    {
        var sum = 0;
        for(var i = 0; i < this.Hand.length; i++)
            sum += this.Hand[i].value;
        return sum;
    }
=======
function display(reveal = false)
{
    //REMOVES ALL CHILD IMG NODES
    CAUTION.querySelectorAll('img').forEach(n => n.remove());
    AGGRESSIVE.querySelectorAll('img').forEach(n => n.remove());
    CLUELESS.querySelectorAll('img').forEach(n => n.remove());

    //APPEND NEW NODES
    player.forEach(card => PLAYER.appendChild(card));
    DISCARD.appendChild(discard)
    DECK.appendChild(deck)
    if(reveal)
    {
        mrCaution.forEach(card => CAUTION.appendChild(card));
        msAggressive.forEach(card => AGGRESSIVE.appendChild(card));
        mrClueless.forEach(card => CLUELESS.appendChild(card));
    }
    else
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

    //UPDATE SCORES
    score.innerHTML = calculateScore(player);
>>>>>>> Stashed changes
}

function initialize()
{
<<<<<<< Updated upstream
    board = document.getElementById('board');
    // INITIALIZE PLAYER OBJECT
    mrCaution = new Player('caution');
    msAggressive = new Player('aggressive');
    mrClueless= new Player('clueless');
    you = new Player('you');

    // INITIALIZE A DECK OF 52 CARDS
    deck = [];
    for(var i = 1; i < 5; i++)
        for(var j = 1; j < 14; j++)
            deck.push(new Card(i, j));
    deck.sort(() => 0.5-Math.random());
    discard = [deck[0]];
    deck.shift();

    startGame();
=======
    var cards = hand.map(x => cardArray[x['data-id']])

    //SAME SUIT RETURN SUM
    if(cards[0].suit == cards[1].suit && cards[0].suit == cards[2].suit)
        return cards[0].value + cards[1].value + cards[2].value;

    //SAME CARD RETURN 30
    if(cards[0].id%13 == cards[1].id%13 && cards[0].id%13 == cards[2].id%13)
        return 30;

    //SORT BY SUIT THEN RETURN GREATER SUM
    cards.sort((a, b) => (a.suit > b.suit) ? 1 : -1);
    var compare = (a,b) => (a.suit == b.suit) ? a.value + b.value : Math.max(a.value, b.value);
    return Math.max(compare(cards[0], cards[1]), compare(cards[1], cards[2]));
>>>>>>> Stashed changes
}

function startGame()
{

    mrCaution = new Player('caution');
    msAggressive = new Player('aggressive');
    mrClueless= new Player('clueless');
    you = new Player('you');
    discard = [deck[0]];
    deck.shift();


    // HAND OUT CARDS TO PLAYER
    for(var i = 0; i < 3; i++)
    {
        mrCaution.addCard = deck[0];
        deck.shift();
        msAggressive.addCard = deck[0];
        deck.shift();
        mrClueless.addCard = deck[0];
        deck.shift();
        you.addCard = deck[0];
        deck.shift();
    }
<<<<<<< Updated upstream
    displayAllHand();
    displayPile();
=======
    yourTurn = true;
    updateLife();

    if(gameOver())
        endScreen();
}

function aggresiveMove()
{
    //IF START WITH 16, KNOCK
    if(firstTurn && calculateScore(msAggressive) >= 16)
        knock();
    firstTurn = false;

    //TURNS TO CARD OBJECT THEN SORT BY FACE VALUE
    var cards = msAggressive.map(x => cardArray[x['data-id']])
    cards = cards.sort((a, b) => (a.id%13 > b.id%13) ? 1 : -1);
    
    cards.forEach(n => console.log(n.name))

    var hasAce = (cards) => ((cards[0].id%13 == 0) ? true : false);
    // console.log(hasAce(cards))
    var hasPair = (cards) => ((cards[0].id%13 == cards[1].id%13 || cards[1].id%13 == cards[2].id%13) ? true : false);
    // console.log(hasPair(cards))

    //IF HAVE ACE --> GO FOR 31
    //IF HAVE PAIR --> GO FOR 30
    //IF NO STRAT GO FOR BEST SWAP & KNOCK AT 20, GET STRAT LATER 
    if(hasAce(cards))
        goFor31(cards);
    else if(hasPair(cards))
        goFor30(cards);
    else
        bestSwap(cards);
}

function getPairs(hand)
{
    var pairs = [];
    if(hand[0].id%13 == hand[1].id%13)
        pairs = [hand[0], hand[1]];
    else if(hand[1].id%4 == hand[2].id%4)
        pairs = [hand[1], hand[2]];
    return pairs;
}

function goFor30(hand)
{
    console.log('long live triples')
}

function goFor31(hand)
{
    console.log('long live aces')
}

function bestSwap(hand)
{
    console.log('looking looking...')
}

function cautiousMove()
{
    console.log('scared')
}
>>>>>>> Stashed changes

    //startRound();
}

<<<<<<< Updated upstream
function displayAllHand()
=======
function swapCard()
{
    console.log('swappy swappy')
}

function knock()
>>>>>>> Stashed changes
{

    var people = [mrCaution, msAggressive, mrClueless, you];
    people.forEach(person => {
        var player = board.querySelector('#'+person.id);
        person.hand.forEach(card => {
            var elem = document.createElement('img');
            if(person.id == 'you')
                elem.src = 'cards/' + card.name;
            else
                elem.src = 'card_back.png';
            player.appendChild(elem);
        });
    });
}

<<<<<<< Updated upstream
function displayPile()
=======
function stay()
{
    console.log('me stay');
}

function updateLife()
>>>>>>> Stashed changes
{
    var discP = board.querySelector('#discard');
    var deckP = board.querySelector('#deck');
    var image1 = document.createElement('img');
    var image2 = document.createElement('img');
    image1.src = 'cards/' + discard[0].name;
    discP.appendChild(image1);
    image2.src = 'cards/' + deck[0].name;
    deckP.appendChild(image2);

}

function startRound()
{
    // CALUCLATE HAND VALUE
}
