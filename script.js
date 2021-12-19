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

const BOARD = document.getElementById('board');

function initialize()
{
    // INITIALIZE A DECK OF 52 CARDS
    deck = [];
    for(var i = 1; i < 5; i++)
        for(var j = 1; j < 14; j++)
            deck.push(new Card(i, j));
    deck.sort(() => 0.5-Math.random());
    startGame();
}

function startGame()
{
<<<<<<< Updated upstream
    // GIVES EVERYONE THEIR HAND
    mrCaution = [];
    msAggressive = [];
    mrClueless= [];
    player = [];
=======
    // INITIALIZE PLAYER OBJECT
    mrCaution = new Player('caution');
    msAggressive = new Player('aggressive');
    mrClueless= new Player('clueless');
    you = new Player('you');
>>>>>>> Stashed changes
    discard = [deck[0]];
    deck.shift();

    // HAND OUT CARDS TO PLAYER
    for(var i = 0; i < 3; i++)
    {
        mrCaution.push(deck[0]);
        deck.shift();
        msAggressive.push(deck[0]);
        deck.shift();
        mrClueless.push(deck[0]);
        deck.shift();
        player.push(deck[0]);
        deck.shift();
    }
    addCardToHand('player', player);
    addCardToHand('caution', mrCaution);
    addCardToHand('aggresive', msAggressive);
    addCardToHand('clueless', mrClueless);

    startRound();
}

function addCardToHand(person, arr)
{
<<<<<<< Updated upstream
    player = BOARD.getElementsByTagName('div')[person];
    arr.forEach(card => {
=======
    var player = BOARD.querySelector('#'+person.id);
    console.log(person.id)
    person.hand.forEach(card => {
>>>>>>> Stashed changes
        var elem = document.createElement('img');
        if(person == 'player')
            elem.src = 'cards/' + card.name;
        else
            elem.src = 'card_back.png'
        player.appendChild(elem);
    });
}

function startRound()
{
}
