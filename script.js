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

knockCalled = false;

//MS AGGRESSIVE LOCK SWITCHES
firstTurn = true;
strat30 = true;
strat31 = true;

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
    deck = [];

    //HAND OUT CARDS FROM DECK
    discard = deckArray[0];
    for(var i = 0; i < 3; i++)
    {
        mrCaution.push(deckArray[1 + i*4]);
        msAggressive.push(deckArray[2 + i*4]);
        mrClueless.push(deckArray[3 + i*4]);
        player.push(deckArray[4 + i*4]);
    }
    deck = deckArray.slice(13, deckArray.length);
    
    display();
}

function display(reveal = true)
{
    //REMOVES ALL CHILD IMG NODES
    CAUTION.querySelectorAll('img').forEach(n => n.remove());
    AGGRESSIVE.querySelectorAll('img').forEach(n => n.remove());
    CLUELESS.querySelectorAll('img').forEach(n => n.remove());
    PLAYER.querySelectorAll('img').forEach(n => n.remove());
    DISCARD.querySelectorAll('img').forEach(n => n.remove());
    DECK.querySelectorAll('img').forEach(n => n.remove());

    //APPEND NEW NODES
    player.forEach(card => PLAYER.appendChild(card));
    DISCARD.appendChild(discard);
    DECK.appendChild(deck[0]);
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
}

function calculateScore(hand)
{ 
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
}

function switchYourCard()
{
    //APPENDS CARDS FOR SWAP
    if(discard == this || deck[0] == this)
        cardsChosen[0] = this;
    if(player.indexOf(this) > -1)
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
            player[index] = tempCard;
            deck.shift();
            deck.push(player[index]);
        }

        cardsChosen = [];
        display();
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

    if(gameOver())
        endScreen();
}

function aggresiveMove()
{
    //IF START WITH 16, KNOCK
    firstTurn = false;
    if(firstTurn && calculateScore(msAggressive) >= 16)
    {
        knock();
        return;
    }

    //TURNS TO CARD OBJECT THEN SORT BY FACE VALUE
    var cards = msAggressive.map(x => cardArray[x['data-id']])
    cards = cards.sort((a, b) => (a.id%13 > b.id%13) ? 1 : -1);

    var hasAce = (cards) => ((cards[0].id%13 == 0) ? true : false);
    var hasPair = (cards) => ((cards[0].id%13 == cards[1].id%13 || cards[1].id%13 == cards[2].id%13) ? true : false);

    //IF HAVE ACE --> GO FOR 31
    //IF HAVE PAIR --> GO FOR 30 (OR KNOCK ON 20)
    //IF NO STRAT GO FOR BEST SWAP & KNOCK AT 20, GET STRAT LATER 
    if(strat31 && hasAce(cards))
    {
        strat30 = false;
        goFor31(cards);
    }
    else if(calculateScore(msAggressive) >= 20)
            knock();
    else if(strat30 && hasPair(cards))
    {
        strat31 = false;
        goFor30(cards);
    }
    else
        bestSwap(msAggressive);
}

function getPairs(hand)
{
    if(hand[0].id%13 == hand[1].id%13)
        return [hand[0], hand[1]];
    else if(hand[1].id%13 == hand[2].id%13)
        return [hand[1], hand[2]];
    return [];
}

function goFor30(hand)
{
    var pairs = getPairs(hand);
    var replaceCard;
    if(hand.indexOf(pairs[0]) == 0)
        replaceCard = hand[2];
    else
        replaceCard = hand[0]
    bestSwap(msAggressive, replaceCard, 'value', pairs[0].id%13);
}

function goFor31(hand)
{
    if(calculateScore(msAggressive) == 31)
    {
        knock();
        return;
    }

    //GET INDEX OF POS CARD TO SWAP
    var card = [];
    if(hand[1].suit != hand[0].suit)
        card.push(hand[1]);
    if(hand[2].suit != hand[0].suit)
        card.push(hand[2]);
    
    //IF ALL CARDS ARE SAME SUIT, SWAP LOWEST VALUE CARD
    if(card.length == 0)
        if(hand[1].value < hand[2].value)
            card.push(hand[1]);
        else
            card.push(hand[2]);

    bestSwap(msAggressive, card[Math.floor(Math.random()*card.length)], 'suit', hand[0].id%4)
}

function bestSwap(person, card = undefined, targetType = undefined, targetValue = undefined)
{
    var posOptions = [];

    //TURN CARD PARAMETER INTO NODE FOR COMPARISON
    if(card != undefined)
        for(var i = 0; i < deckArray.length; i++)
            if(deckArray[i]['data-id'] == card.id)
            {
                card = deckArray[i];
                break;
            }
    
    //PARAMETERS SPECIFIES GOING FOR STRAT; ELSE GO FOR HIGHEST COMBO
    if(targetType != undefined)
    {
        //IF WANT VALUE MOD BY 13; WANT SUIT MOD BY 4
        var divisor;
        if(targetType == 'value')
            divisor = 13;
        else
            divisor = 4;

        //CHECK IF PILES ARE ELIGIBLE FOR SWAP; ELSE SWITCH WITH DECK
        if(deck[0]['data-id']%divisor == targetValue)
            posOptions.push(deck[0]);
        if(discard['data-id']%divisor == targetValue)
            posOptions.push(discard);
        
        if(posOptions.length == 0)
            swapCards(person, card, deck[0]);
        else
        {
            var selectCard = posOptions[Math.floor(Math.random()*posOptions.length)];
            swapCards(person, card, selectCard);
        }
    }
    else
    {
        var currentScore = calculateScore(person);

        //SWAP ARRAY: NEW POTENTIAL BEST ARRAY
        var swap = [];
        for(var i = 0; i < 3; i++)
        {
            var testing = person.slice(0);
            testing[i] = deck[0];
            var newScore1 = calculateScore(testing);

            testing[i] = discard;
            var newScore2 = calculateScore(testing);
            
            //IF EITHER NEW SCORE IS GREATER THAN CURRENT SET SWAP TO NEW DECK
            var bestScore = Math.max(currentScore, Math.max(newScore1, newScore2));
            swap = testing;
            if(bestScore == newScore1)
                swap[i] = deck[0];
        }
        var index = 0;

        //IF THERE WAS A HIGHER DECK COMBO, SWITCH TO THAT
        if(swap.length > 0)
        {
            for(var i = 0; i < 3; i++)
                if(swap[i] != person[i])
                {
                    index = i;
                    break;
                }
        }
        swapCards(person, person[index], swap[index]);
    }
}

function swapCards(person, card1, card2)
{
    var index = person.indexOf(card1);
    person[index] = card2;

    if(deck[0] == card2)
    {
        deck.shift();
        deck.push(card1);
    }
    else
        discard = card1;
    display();
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
    alert('someone knocked')
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
