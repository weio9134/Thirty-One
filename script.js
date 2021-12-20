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
}

function initialize()
{
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
    displayAllHand();
    displayPile();

    //startRound();
}

function displayAllHand()
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

function displayPile()
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
