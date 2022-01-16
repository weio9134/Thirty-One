//RETRIEVE HTML ELEMENTS AND SET GLOBAL VAR
const YOU = document.getElementById('you');
const AGGRESSIVE = document.getElementById('aggressive');
const CAUTIOUS = document.getElementById('cautious');
const CLUELESS = document.getElementById('clueless');

const YOURLIVES = document.getElementById('yourLives');
const AGGRESSIVELIVES = document.getElementById('aggressiveLives');
const CAUTIOUSLIVES = document.getElementById('cautiousLives');
const CLUELESSLIVES = document.getElementById('cluelessLives');

const DISCARD = document.getElementById('discard');
const DECK = document.getElementById('deck');

const POPUPCONTAINER = document.getElementById('container1');
const LOSESCREEN = document.getElementById('container2');
const WINSCREEN = document.getElementById('container3');
const RESULT = document.getElementById('result');

const SCORE = document.getElementById('score');
const LOG = document.getElementById('log-container');

players = [];
cardArray = [];
imgArray = [];
cardsChosen = [];
scores = [];

//LOCK SWITCHES FOR MOVES
firstTurn = strat30 = strat31 = true;
turn = 0;
turnsRemaining = 3;
knocked = false;
losers = [];

class Card 
{
    constructor(s, v, i) 
    {
      //ASSIGNS SUITS
        switch (s) 
        {
            case (1): this.suit = 'clubs'; break;
            case (2): this.suit = 'diamonds'; break;
            case (3): this.suit = 'hearts'; break;
            case (4): this.suit = 'spades'; break;
        }
        
        //ASSIGNS THEIR NAMING ATTRIBUTES
        this.cardType = v;
        this.src = 'cards/' + v + '_of_' + this.suit + '.png';
        switch(v)
        {
          case(1): this.name = 'Ace of ' + this.suit; break;
          case(11): this.name = 'Jack of ' + this.suit; break;
          case(12): this.name = 'Queen of ' + this.suit; break;
          case(13): this.name = 'King of ' + this.suit; break;
          default: this.name = v + ' of ' + this.suit; break;
        }

        //ASSIGNS VALUE (K, Q, J, 10 --> 10; OTHERS CONSTANT)
        this.value = v;
        if (v == 1)
            this.value = 11;
        else if (v >= 10)
            this.value = 10;
        this.id = i;
    }
}

class Player
{
  constructor(n, i)
  {
    //EMPTY HAND ARRAY + IDENTITY
    this.hand = [];
    this.name = n;
    this.id = i;
    this.life = 3;
  }

  getIndex(card)
  {
    return this.hand.indexOf(card);
  }

  replaceCard(newCard, index)
  {
    this.hand[index] = newCard;
  }

  getScore()
  {
    if(this.life == 0)
      return undefined;
    
    //CREATES HAND CLONE
    var hand = this.hand.map(n => n);

    //ALL SAME SUIT RETURN SUM;
    if(hand.every(n => n.suit == hand[0].suit))
      return hand[0].value + hand[1].value + hand[2].value;
    
    //ALL SAME VALUE RETURN 30
    if(hand.every(n => n.cardType == hand[0].cardType))
      return 30;
    
    //SORT BY SUIT THEN RETURN GREATER SUM
    hand.sort((a, b) => (a.suit > b.suit) ? 1 : -1);
    var compare = (a,b) => (a.suit == b.suit) ? a.value + b.value : Math.max(a.value, b.value);
    return Math.max(compare(hand[0], hand[1]), compare(hand[1], hand[2]));
  }

  changeHand()
  {
    //CHANGES HAND FROM CARD OBJ TO HTML ELEMENT
    var cards = [];
    this.hand.forEach(n => cards.push(invert(n)));
    return cards;
  }

  sortHand()
  {
    var hand = this.hand.map(n => n);
    hand.sort((a,b) => a.cardType - b.cardType);
    return hand;
  }
}

function invert(obj)
{
  //IF OBJ IS HTML RETURN CARD OBJ
  if(obj instanceof HTMLElement)
    return cardArray.find(n => n.id == obj['data-id'])

  //IF OBJ IS CARD RETURN HTML ELEMENT
  return imgArray.find(n => n['data-id'] == obj.id);
}

function initialize()
{
    //CREATES AN ARRAY OF ALL CARD OBJECTS
    for(var i = 1; i <= 4; i++)
        for(var j = 1; j <= 13; j++)
            cardArray.push(new Card(i, j, 13 * (i-1) + (j-1)));
        
    //TURNS ALL IMAGE OBJECTS INTO NODES FOR LATER REFERENCE
    for(var i = 0; i < cardArray.length; i++)
    {
        var card = document.createElement('img');
        card['src'] = cardArray[i].src;
        card['data-id'] = cardArray[i].id;
        card.addEventListener('click', switchYourCard);
        imgArray.push(card);
    }

    //CREATES PLAYERS
    you = new Player('You', 0);
    msAggressive = new Player('Ms.Aggressive', 1);
    mrCautious = new Player('Mr.Cautious', 2);
    mrClueless = new Player('Mr.Clueless', 3);
    players = [you, msAggressive, mrCautious, mrClueless];

    setBoard()
}

function setBoard()
{
    //IF YOU LOSE DISPLAY LOSING SCREEN
    if(you.life == 0)
        LOSESCREEN.style.display = 'grid';
    
    //SET NEW MAX TURNS LEFT AFTER SOMEONE LOSES
    turnsRemaining = 3;
    players.forEach(n => {if(n.life == 0) turnsRemaining--;});

    //RESET VARIABLE FOR NEW ROUND
    firstTurn = strat30 = strat31 = true;
    turn = 0;
    knocked = false;
    resultShown = false;
    scores = [];
    losers = [];
    deck = [];
    players.forEach(n => n.hand = []);

    //HAND OUT CARD OBJS FROM CARD ARRAY
    cardArray.sort(() => 0.5 - Math.random());
    discard = cardArray[0];
    for(var i = 0; i < 3; i++)
      players.forEach(p => {
        if(p.life > 0)
          p.hand.push(cardArray[i*4 + 1 + players.indexOf(p)]);
      });

    deck = cardArray.slice(13, cardArray.length);
    display();
}

function display(reveal = false)
{
    //REMOVES ALL CHILD IMG NODES
    YOU.querySelectorAll('img').forEach(n => n.remove());
    AGGRESSIVE.querySelectorAll('img').forEach(n => n.remove());
    CAUTIOUS.querySelectorAll('img').forEach(n => n.remove());
    CLUELESS.querySelectorAll('img').forEach(n => n.remove());
    DISCARD.querySelectorAll('img').forEach(n => n.remove());
    DECK.querySelectorAll('img').forEach(n => n.remove());
    YOURLIVES.querySelectorAll('img').forEach(n => n.remove());
    AGGRESSIVELIVES.querySelectorAll('img').forEach(n => n.remove());
    CAUTIOUSLIVES.querySelectorAll('img').forEach(n => n.remove());
    CLUELESSLIVES.querySelectorAll('img').forEach(n => n.remove());

    //APPEND NEW CARD NODES
    you.hand.forEach(card => YOU.appendChild(invert(card)));
    DISCARD.appendChild(invert(discard));
    DECK.appendChild(invert(deck[0]));

    if(reveal)
    {
      msAggressive.hand.forEach(card => AGGRESSIVE.appendChild(invert(card)));
      mrCautious.hand.forEach(card => CAUTIOUS.appendChild(invert(card)));
      mrClueless.hand.forEach(card => CLUELESS.appendChild(invert(card)));
    }
    else
      for(var i = 0; i < 3; i++)
      {
        var back = document.createElement('img');
        back.src = 'card_back.png';
        var back2 = back.cloneNode();
        var back3 = back.cloneNode();

        AGGRESSIVE.appendChild(back);
        CAUTIOUS.appendChild(back2);
        CLUELESS.appendChild(back3);
      }
    //UPDATE YOUR SCORE
    SCORE.innerHTML = you.getScore();

    //UPDATE LIFE COUNTER
    var allLives = [YOURLIVES, AGGRESSIVELIVES, CAUTIOUSLIVES, CLUELESSLIVES];
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < players[i].life; j++)
        {
            var img = document.createElement('img');
            img['src'] = 'hearts.png';
            img['classList'] = 'hearts';
            allLives[i].appendChild(img);
        }
}

function switchYourCard()
{
    var card = invert(this);
    if(knocked && turnsRemaining != 0)
        turnsRemaining--;

    //APPENDS CARDS FOR SWAP
    if(discard == card || deck[0] == card)
        cardsChosen[0] = card;
    if(you.hand.indexOf(card) > -1)
        cardsChosen[1] = card;

    //ONLY SWAP IF BOTH SLOTS ARE FILLED
    if(cardsChosen[0] != undefined && cardsChosen[1] != undefined)
    {
        you.replaceCard(cardsChosen[0], you.getIndex(cardsChosen[1]));
        if(deck[0] == cardsChosen[0])
        {
          deck.shift();
          deck.push(cardsChosen[1]);
        }
        else
          discard = cardsChosen[1];
        
        //RESET CARDSCHOSEN AND CONTINUE GAME
        display();
        updateLog(' just swapped for ' + cardsChosen[0].name);
        cardsChosen = [];
        startRound();
    }
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
    if(msAggressive.life == 0)
        return;

    //IF START WITH 16, KNOCK
    firstTurn = false;
    if(firstTurn && msAggressive.getScore >= 16)
    {
        knock();
        return;
    }

    //CHECK IF HAND CONTAINS ACE OR PAIRS
    var hand = msAggressive.sortHand();
    var hasAce = hand[0].cardType == 1;
    var hasPair = (hand[0].cardType == hand[1].cardType || hand[1].cardType == hand[2].cardType) ? true : false;

    //(ACE --> TRIPLES --> BEST) SWAPS
    if(strat31 && hasAce)
    {
        strat30 = false;
        goFor31();
    }
    else if(msAggressive.getScore >= 20 && !knocked)
        knock();
    else if(strat30 && hasPair)
    {
        strat31 = false;
        goFor30(msAggressive);
    }
    else
        bestSwap(msAggressive);
}

function goFor31()
{
    if(msAggressive.getScore == 31)
    {
        knock();
        return;
    }

    //GET INDEX OF POS CARD TO SWAP
    var hand = msAggressive.sortHand();
    var card = [];
    if(hand[0].suit != hand[1].suit)
        card.push(hand[1]);
    if(hand[0].suit != hand[2].suit)
        card.push(hand[2]);
    
    //IF ALL CARDS ARE SAME SUIT, SWAP LOWEST VALUE CARD
    if(card.length == 0)
        if(hand[1].value < hand[2].value)
            card.push(hand[1]);
        else
            card.push(hand[2]);

    bestSwap(msAggressive, card[Math.floor(Math.random()*card.length)], 'suit', hand[0].id%4);
}

function getPairs(hand)
{
    if(hand[0].cardType == hand[1].cardType)
        return [hand[0], hand[1]];
    else if(hand[1].cardType == hand[2].cardType)
        return [hand[1], hand[2]];
}

function goFor30(person)
{
    var hand = person.sortHand();
    var pairs = getPairs(hand);
    var replaceCard;
    person.hand.forEach(n => {if(pairs.indexOf(n) == -1) replaceCard = n;});
    bestSwap(person, replaceCard, 'value', pairs[0].cardType);
}

function bestSwap(person, card = undefined, targetType = undefined, targetValue = undefined)
{
    var posOptions = [];
    
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
        if(deck[0].id%divisor == targetValue)
            posOptions.push(deck[0]);
        if(discard.id%divisor == targetValue)
            posOptions.push(discard);
        
        //IF NO GOOD OPTIONS SWAP WITH DECK
        if(posOptions.length == 0)
            swapCards(person, card, deck[0]);
        else
            swapCards(person, card, posOptions[Math.floor(Math.random()*posOptions.length)]);
    }
    else
    {
        var currentScore = person.getScore();

        //SWAP ARRAY: NEW POTENTIAL BEST ARRAY
        var swap = [];
        for(var i = 0; i < 3; i++)
        {
            var testing = new Player('testing', -1);
            testing.hand = person.hand.slice(0);
            testing.replaceCard(deck[0], i);

            var newScore1 = testing.getScore();

            testing.replaceCard(discard, i);
            var newScore2 = testing.getScore();
            
            //IF EITHER NEW SCORE IS GREATER THAN CURRENT SET SWAP TO NEW DECK
            var bestScore = Math.max(currentScore, Math.max(newScore1, newScore2));
            swap = testing.hand;
            if(bestScore == newScore1)
                swap[i] = deck[0];
        }
        
        //IDENTIFY WHICH CARD TO SWITCH
        var index = 0;
        for(var i = 0; i < 3; i++)
          if(swap[i] != person.hand[i])
              index = i;

        swapCards(person, person.hand[index], swap[index]);
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

    person.replaceCard(card2, person.getIndex(card1));

    if(deck[0] == card2)
    {
        deck.shift();
        deck.push(card1);
    }
    else
        discard = card1;
    
    updateLog(' just swapped for ' + card2.name);
    display();
}

function cautiousMove()
{
    if(mrCautious.life == 0)
        return;

    //IF HAVE GREATER THAN 27 VALUE KNOCK
    if(mrCautious.getScore() >= 27)
        if(!knocked)
        {
            knock();
            return;
        }

    var hand = mrCautious.sortHand();
    
    var hasPair = (hand[0].cardType == hand[1].cardType || hand[1].cardType == hand[2].cardType) ? true : false;

    //IF HAVE PAIR GO FOR 30 ELSE BEST SWAP
    if(hasPair)
        goFor30(mrCautious);
    else
        bestSwap(mrCautious);
    
}

function cluelessMove()
{
    if(mrClueless.life == 0)
        return;

    //IF SCORE 30 OR 31 KNOCK
    if(mrClueless.getScore() >= 30)
        if(!knocked)
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
    
    var cardToDiscard = mrClueless.hand[Math.floor(Math.random()*3)];

    swapCards(mrClueless, cardToDiscard, pickedCard);
}

function knock()
{ 
    //ONLY ONE PERSON MAY KNOCK
    if(knocked)
        return;
    knocked = true;

    //UPDATES LOCKS AND CONTINUE LAST FEW TURNS
    alert(players[turn].name + ' knocked')
    updateLog(' just knocked!');
    if(turn == 0)
    {
        startRound();
        showResult();
    }
}

function updateLog(str)
{
    LOG.innerHTML += players[turn].name + str + '<br><br>';
}

function showResult()
{
    if(resultShown)
      return;
      
    resultShown = true;
    display(true);
    POPUPCONTAINER.style.display = 'grid';

    //APPEND HEADER
    RESULT.appendChild(createText('Players', 'header'));
    RESULT.appendChild(createText('Scores', 'header'));

    //GET PLAYER SCORES
    for(var i = 0; i < 4; i++)
    {
        RESULT.appendChild(createText(players[i].name));
        scores.push(players[i].getScore());

        if(scores[i] == undefined)
            scores[i] = 'out of game';

        RESULT.appendChild(createText(scores[i]));
    }

    //APPEND LOSER (IF SOMEONE HAS 31 EVERYONE ELSE LOSES)
    if(scores.indexOf(31) > -1)
    {
      for(var i = 0; i < scores.length; i++)
        if(typeof scores[i] == 'number' && scores[i] != 31)
          losers.push(players[i]);
    }
    else
    {
      //MAP SCORES ONTO OBJECT TO CHECK IF TIE
      var counts = {};
      scores.forEach(x => counts[x] = (counts[x] || 0) + 1);

      if(counts[Object.keys(counts)[0]] > 1)
      {
        for(var i = 0; i < scores.length; i++)
          if(scores[i] == Object.keys(counts)[0])
            losers.push(players[i]);
      }
      else
        losers.push(players[scores.indexOf(parseInt(Object.keys(counts)[0]))]);
    }

    //APPPEND LOSERS
    RESULT.appendChild(createText('Loser:', 'header'));
    if(losers.length > 1)
        RESULT.appendChild(createText('TIE'));
    else
        RESULT.appendChild(createText(losers[0].name));
    
    //DISPLAY WHO LOST LIVES
    var str = '';
    losers.forEach(n => str += n.name + ' and ');
    str = createText(str.substring(0, str.length - 4) + 'lost a life');
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

function nextRound()
{
    POPUPCONTAINER.style.display = 'none';
    RESULT.innerHTML = '';
    LOG.innerHTML = 'NEW ROUND <br><br>';

    var counts = {};
    scores.forEach(x => counts[x] = (counts[x] || 0) + 1);

    //UPDATE LIFE COUNTER
    //IF TWO PLAYERS REMAIN & TIE, ALL PLAYERS GET ONE LIFE BACK
    if(counts['out of game'] == 2 && Object.keys(counts).length == 2)
        for(var i = 0; i < players.length; i++)
            players[i].life++;
    else
        losers.forEach(n => n.life--);

    //MAP ALL LIVES TO SEE IF YOU WIN
    counts = {};
    players.forEach(x => counts[x.life] = (counts[x.life] || 0) + 1);
    if(you.life > 0 && counts[0] == 3)
        WINSCREEN.style.display = 'grid';

    setBoard();
}