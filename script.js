//RETRIEVE HTML ELEMENTS AND SET GLOBAL VAR
const CAUTION = document.getElementById('caution');
const AGGRESSIVE = document.getElementById('aggressive');
const CLUELESS = document.getElementById('clueless');
const PLAYER = document.getElementById('you');

const PLAYERLIVES = document.getElementById('yourLives');
const AGGRELIVES = document.getElementById('aggressiveLives');
const CAUTLIVES = document.getElementById('cautiousLives');
const CLUELIVES = document.getElementById('cluelessLives');

const DISCARD = document.getElementById('discard');
const DECK = document.getElementById('deck');

const POPUPCONTAINER = document.getElementById('container');
const RESULT = document.getElementById('result');

const SCORE = document.getElementById('score');
const LOG = document.getElementById('log-container');

yourLife = aggressiveLife = cautiousLife = cluelessLife = 3;

cardArray = [];
deckArray = [];
cardsChosen = [];

//LOCK SWITCHES FOR MOVES
firstTurn = strat30 = strat31 = true;
turn = 0;
turnsRemaining = 3
knocked = false;
allTie = false;
losers = [];

//GLOBAL ARRAYS FOR EASY ACCESS    
names = ['You', 'Ms.Aggressive', 'Mr.Caution', 'Mr.Clueless'];
lives = [yourLife, aggressiveLife, cautiousLife, cluelessLife];

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
    //RESET VARIABLE FOR NEW ROUND
    firstTurn = strat30 = strat31 = true;
    turn = 0;
    knocked = false;
    allTie = false;
    turnsRemaining = 3;

    deckArray.sort(() => 0.5 - Math.random());

    mrCaution = [];
    msAggressive = [];
    mrClueless = [];
    player = [];
    deck = [];

    people = [msAggressive, mrCaution, mrClueless];

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

function display(reveal = false)
{
    //REMOVES ALL CHILD IMG NODES
    CAUTION.querySelectorAll('img').forEach(n => n.remove());
    AGGRESSIVE.querySelectorAll('img').forEach(n => n.remove());
    CLUELESS.querySelectorAll('img').forEach(n => n.remove());
    PLAYER.querySelectorAll('img').forEach(n => n.remove());
    DISCARD.querySelectorAll('img').forEach(n => n.remove());
    DECK.querySelectorAll('img').forEach(n => n.remove());
    PLAYERLIVES.querySelectorAll('img').forEach(n => n.remove());
    AGGRELIVES.querySelectorAll('img').forEach(n => n.remove());
    CAUTLIVES.querySelectorAll('img').forEach(n => n.remove());
    CLUELIVES.querySelectorAll('img').forEach(n => n.remove());

    //APPEND NEW CARD NODES
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
    SCORE.innerHTML = calculateScore(player);

    //UPDATE LIFE
    var allLives = [PLAYERLIVES, AGGRELIVES, CAUTLIVES, CLUELIVES];
    for(var i = 0; i < lives.length; i++)
        for(var j = 0; j < lives[i]; j++)
        {
            var img = document.createElement('img');
            img['src'] = 'hearts.png';
            img['classList'] = 'hearts';
            allLives[i].appendChild(img);
        }
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
    if(knocked)
        if(turnsRemaining == 0)
        {
            showResult();
            return;
        }
        else
            turnsRemaining--;

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

        updateLog(' just swapped for ', getName(cardsChosen[0]));

        cardsChosen = [];
        yourTurn = false;
        display();
        startRound();
    }
}

function getName(card)
{
    var name = cardArray[card['data-id']].name;

    //REPLACE ALL NON LETTERS AND CONVERT TO ACTUAL CARD NAME
    name = name.replaceAll('_', ' ');
    name = name.replaceAll('.png', '');
    name = name.replaceAll('11 ', 'Jack ');
    name = name.replaceAll('12 ', 'Queen ');
    name = name.replaceAll('13 ', 'King ');
    name = name.replaceAll('1 ', 'Ace ');

    return name;
}

function startRound()
{
    for(var i = 0; i < 3; i++)  
    {
        turn++;
        switch(turn)
        {
            case(1): aggresiveMove(); break;
            case(2): cautiousMove(); break;
            case(3): cluelessMove(); break;
        }
    }
    turn = 0;
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
    var cards = msAggressive.map(x => cardArray[x['data-id']]);
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
    {
        knock();
        return;
    }
    else if(strat30 && hasPair(cards))
    {
        strat31 = false;
        goFor30(cards, 0);
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

function goFor30(hand, personIndex)
{
    var pairs = getPairs(hand);
    var replaceCard;
    if(hand.indexOf(pairs[0]) == 0)
        replaceCard = hand[2];
    else
        replaceCard = hand[0]
    bestSwap(people[personIndex], replaceCard, 'value', pairs[0].id%13);
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
    if(knocked)
        if(turnsRemaining == 0)
        {
            showResult();
            return;
        }
        else
            turnsRemaining--;

    var index = person.indexOf(card1);
    person[index] = card2;

    if(deck[0] == card2)
    {
        deck.shift();
        deck.push(card1);
    }
    else
        discard = card1;
    
    updateLog(' just swapped for ', getName(card2));
    display();
}

function cautiousMove()
{
    //IF HAVE GREATER THAN 27 VALUE KNOCK
    if(calculateScore(mrCaution) >= 27)
    {
        knock();
        return;
    }

    //TURNS TO CARD OBJECT THEN SORT BY FACE VALUE
    var cards = mrCaution.map(x => cardArray[x['data-id']]);
    cards = cards.sort((a, b) => (a.id%13 > b.id%13) ? 1 : -1);
    
    var hasPair = (cards) => ((cards[0].id%13 == cards[1].id%13 || cards[1].id%13 == cards[2].id%13) ? true : false);

    //IF HAVE PAIR GO FOR 30 ELSE BEST SWAP
    if(hasPair(cards))
        goFor30(cards, 1);
    else
        bestSwap(mrCaution);
    
}

function cluelessMove()
{
    //IF SCORE 30 OR 31 KNOCK
    if(calculateScore(mrClueless) >= 30)
    {
        knock();
        return;
    }

    //RANDOMLY PICK CARDS TO SWAP
    var pickedCard;

    if(Math.floor(Math.random()*2))
        pickedCard = deck[0];
    else
        pickedCard = discard;
    
    var cardToDiscard = mrClueless[Math.floor(Math.random()*3)];

    swapCards(mrClueless, cardToDiscard, pickedCard);
}

function knock()
{ 
    //ONLY ONE PERSON MAY KNOCK
    if(knocked)
        return;
    knocked = true;

    //UPDATES LOCKS AND CONTINUE LAST FEW TURNS
    alert(names[turn] + ' knocked')
    updateLog(' just knocked!');
    if(turn == 0)
    {
        startRound();
        showResult();
    }
}

function updateLog(str, cardName = '')
{
    LOG.innerHTML += names[turn] + str + cardName + '<br><br>';
}

function showResult()
{
    display(true);
    POPUPCONTAINER.style.display = 'grid';

    var scores = [];

    //APPEND HEADER
    RESULT.appendChild(createText('Players', 'header'));
    RESULT.appendChild(createText('Scores', 'header'));

    //APPEND PLAYER SCORES
    for(var i = 0; i < 4; i++)
    {
        RESULT.appendChild(createText(names[i]));

        if(i == 0)
            scores.push(calculateScore(player));
        else
            scores.push(calculateScore(people[i-1]));

        RESULT.appendChild(createText(scores[i]));
    }

    //APPEND LOSER
    var smallest = scores[0];
    losers[0] = 0;
    var index = 0;
    var tie = false;
    for(var i = 1; i < scores.length; i++)
    {
        if(smallest == scores[i])
        {
            tie = true;
            losers.push(i)
            continue;
        }
        if(smallest > scores[i])
        {
            smallest = scores[i];
            index = i;
            losers[0] = i;
        }
    }
    RESULT.appendChild(createText('Loser:', 'header'));
    if(tie)
        RESULT.appendChild(createText('TIE'));
    else
        RESULT.appendChild(createText(names[index]));
    
    //DISPLAY WHO LOST LIVES (IF EVERYONE TIED NO ONE LOSES)
    var str = '';
    if(losers.length == 4)
    {
        str = createText('No one lost a life!');
        allTie = true;
    }
    else
    {
        losers.forEach(n => (str += names[n] + ' and '));
        str = createText(str.substring(0, str.length - 4) + 'lost a life');
    }

    str.style.gridColumn = 'span 2';
    str.style.fontSize = '25 px';
    str.style.textAlign = 'center';
    RESULT.appendChild(str);
}

function createText(str, type = '')
{   
    var x = document.createElement('div');
    x.innerHTML = str;
    x.style.font = "lighter 20px 'Courier New'";
    
    if(type == 'header')
    {
        x.style.textDecoration = 'underline';
        x.style.fontWeight = 'bold';
    }
    return x;
}

function roundOver()
{
    POPUPCONTAINER.style.display = 'none';
    RESULT.innerHTML = '';
    LOG.innerHTML = 'NEW ROUND <br>';
    if(!allTie)
        losers.forEach(n => lives[n]--);

    setBoard();
}

function gameOver()
{
    return false;
}

function endScreen()
{
    console.log('ded')
}
