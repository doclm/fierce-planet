
/* NB: Level is defined in classes.js */

var MAX_DEFAULT_LEVELS = 11;


/* Level setup methods - this should be moved to the Level class when refactored. */
function assignCells() {
    for (var i = 0; i < currentLevel.getTiles().length; i++) {
        var p = currentLevel.getTiles()[i];
//        cells.set([p.getX(), p.getY()], p);
        cells[[p._x, p._y]] = p;
    }
};
function fillWithTiles() {
    var tiles = new Array();
    for (var i = 0; i < currentLevel.getWorldWidth(); i++) {
        for (var j = 0; j < currentLevel.getWorldHeight(); j++) {
            tiles.push(new Tile(TILE_COLOR, j, i));
        }
    }
    return tiles;
};
function randomAgents(number, limit) {
    var agents = new Array();
    for (var i = 0; i < number; i ++) {
        var x = Math.floor(Math.random() * limit);
        var y = Math.floor(Math.random() * limit);
        var agent = new Agent("Citizen", "888", x, y);
        agents.push(agent);
    }
    return agents;
};
function presetAgents(number, points) {
    agents = new Array();
    for (var j = 0; j < points.length; j++) {
        var point = points[j];
        var x = point[0];
        var y = point[1];
        for (var i = 0; i < number; i ++) {
            var agent = new Agent(CITIZEN_AGENT_TYPE, x, y);
            var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
            agent.setDelay(delay);
            agents.push(agent);
        }
    }
};

function preSetupLevel(level) {
    if (level.getTiles() == undefined) 
        level.setTiles(fillWithTiles());

    presetAgents(level.getInitialAgentNumber(), level.getInitialPoints());

    // Add generated agents
    $.merge(agents, level.generateWaveAgents());
    $.merge(agents, level.getLevelAgents());
};
function postSetupLevel(level) {
    assignCells();
};
/*
Level.prototype.preSetupLevel = new function() {
    fillWithTiles();
    presetAgents(this.getInitialAgentNumber(), level.getInitialPoints());
};
Level.prototype.postSetupLevel = new function() {
    assignCells();
};
*/

/*
Agent Type setup
 */
var CITIZEN_AGENT_TYPE = new AgentType("Citizen", "000");
CITIZEN_AGENT_TYPE.setDrawFunction(function(ctx, agent, x, y, pieceWidth, newColor, counter, direction) {
    var radius = (pieceWidth / 4);
    var bodyLength = (pieceWidth / 2);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.fillStyle = "#" + newColor;
    ctx.fill();

    /*
    ctx.beginPath();
    ctx.moveTo(x - radius + 2, y - radius);
    ctx.lineTo(x + radius - 2, y - radius);
    ctx.lineTo(x + radius - 2, y - radius + 2);
    ctx.lineTo(x + radius, y - radius + 2);
    ctx.lineTo(x + radius, y - radius + 6);
    ctx.lineTo(x + radius - 2, y - radius + 6);
    ctx.lineTo(x + radius - 2, y - radius + 8);
    ctx.lineTo(x - radius + 2, y - radius + 8);
    ctx.lineTo(x - radius + 2, y - radius + 6);
    ctx.lineTo(x - radius, y - radius + 6);
    ctx.lineTo(x - radius, y - radius + 2);
    ctx.lineTo(x - radius + 2, y - radius + 2);
    ctx.lineTo(x - radius + 2, y - radius);
    ctx.closePath();
    */
    ctx.beginPath();
    ctx.moveTo(x, y - radius + 8);
    ctx.lineTo(x - 1, y - radius + 8 + bodyLength);

    if (counter % 2 == 0) {
        var start = (direction == 0 ? -1 : 1);
        var end = (direction == 0 ? -6 : 6);

        // Arms
        ctx.moveTo(x + 4, y + 8 + 2 * start);
        ctx.lineTo(x - 4, y + 8 - 2 * start);

        // 1st leg
        ctx.moveTo(x + start, y - radius + 8 + bodyLength);
        ctx.lineTo(x + start + end, y - radius + 8 + bodyLength + Math.abs(end));

        // 2nd leg
        ctx.moveTo(x - start, y - radius + 8 + bodyLength);
        ctx.lineTo(x - start - end / 2, y - radius + 8 + bodyLength);
        ctx.moveTo(x - start - end / 2, y - radius + 8 + bodyLength);
        ctx.lineTo(x - start - end / 2, y - radius + 8 + bodyLength + Math.abs(end) / 2);
    }
    else {
        var start = (direction == 0 ? 1 : -1);
        var end = (direction == 0 ? 6 : -6);

        // Arms
        ctx.moveTo(x + 4, y + 8 + 2 * start);
        ctx.lineTo(x - 4, y + 8 - 2 * start);

        // 1st leg
        ctx.moveTo(x, y - radius + 8 + bodyLength);
//        ctx.lineTo(x + end, y  - radius + 8 + bodyLength);
//        ctx.moveTo(x + end, y - radius + 8 + bodyLength);
        ctx.lineTo(x + end, y - radius + 8 + bodyLength + Math.abs(end));

        // 2nd leg
        ctx.moveTo(x, y - radius + 8 + bodyLength);
        ctx.lineTo(x - end / 2, y - radius + 8 + bodyLength + Math.abs(end) / 2);
        ctx.moveTo(x - end / 2, y - radius + 8 + bodyLength + Math.abs(end) / 2);
        ctx.lineTo(x - end, y - radius + 8 + bodyLength);
    }
    ctx.closePath();
    ctx.strokeStyle = "#" + newColor;
    ctx.stroke();
    ctx.fillStyle = "#" + newColor;
    ctx.fill();

    /*
    ctx.beginPath();
    ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.fillStyle = "#" + newColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(intX, intY + radius);
    ctx.lineTo(intX, intY + radius + bodyLength / 2);
    if (counter % 2 == 0) {
        // Legs
        var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
        var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
        // Arms - 90 degrees
        ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
        ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
    }
    else {
        // Legs - straight
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX, intY + radius + bodyLength);
        // Arms - 45 degrees
        var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
        var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
        ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
        ctx.lineTo(intX, intY + radius + bodyLength / 6);
        ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
        ctx.lineTo(intX, intY + radius + bodyLength / 6);

    }
    ctx.closePath();
    ctx.strokeStyle = "#" + newColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    */
});
var PREDATOR_AGENT_TYPE = new AgentType("Predator", "fbe53b");
PREDATOR_AGENT_TYPE.setDrawFunction(function(ctx, agent, intX, intY, pieceWidth, newColor, counter, direction) {
    var radius = (pieceWidth / 4);
    var bodyLength = (pieceWidth / 2);

    var img = new Image();
//    img.src = "/images/agents/fierce_planet_monster1.png";

    if (counter % 4 == 0) {
        img.src = "/images/agents/monster1.png";
    }
    else if (counter % 4 == 1) {
        img.src = "/images/agents/monster2.png";
    }
    else if (counter % 4 == 2) {
        img.src = "/images/agents/monster1.png";
    }
    else {
        img.src = "/images/agents/monster3.png";
    }
    ctx.drawImage(img, intX - pieceWidth / 2, intY - pieceWidth / 2, pieceWidth, pieceWidth);
});
var RIVAL_AGENT_TYPE = new AgentType("Rival", "3be5fb");
RIVAL_AGENT_TYPE.setDrawFunction(function(ctx, agent, intX, intY, pieceWidth, newColor, counter, direction) {
    var radius = (pieceWidth / 4);
    var bodyLength = (pieceWidth / 2);

    ctx.beginPath();
    ctx.arc(intX, intY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();
    ctx.fillStyle = "#" + newColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(intX, intY + radius);
    ctx.lineTo(intX, intY + radius + bodyLength / 2);
    if (counter % 2 == 0) {
        // Legs
        var xOffset = Math.sin(30 * Math.PI/180) * bodyLength / 2;
        var yOffset = Math.cos(30 * Math.PI/180) * bodyLength / 2;
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX - xOffset, intY + radius + bodyLength / 2 + yOffset);
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX + xOffset, intY + radius + bodyLength / 2 + yOffset);
        // Arms - 90 degrees
        ctx.moveTo(intX - bodyLength / 2, intY + radius + bodyLength / 6);
        ctx.lineTo(intX + bodyLength / 2, intY + radius + bodyLength / 6);
    }
    else {
        // Legs - straight
        ctx.moveTo(intX, intY + radius + bodyLength / 2);
        ctx.lineTo(intX, intY + radius + bodyLength);
        // Arms - 45 degrees
        var xOffset = Math.sin(45 * Math.PI/180) * bodyLength / 2;
        var yOffset = Math.cos(45 * Math.PI/180) * bodyLength / 2;
        ctx.moveTo(intX - xOffset, intY + radius + bodyLength / 6 + yOffset);
        ctx.lineTo(intX, intY + radius + bodyLength / 6);
        ctx.moveTo(intX + xOffset, intY + radius + bodyLength / 6 + yOffset);
        ctx.lineTo(intX, intY + radius + bodyLength / 6);

    }
    ctx.closePath();
    ctx.strokeStyle = "#" + newColor;
    ctx.lineWidth = 2;
    ctx.stroke();

});


/* Level 0 Definition */

var level0 = new Level(1);
level0.addInitialPoint(0, 0);
level0.setGoalX(4);
level0.setGoalY(4);
level0.setWorldSize(5);
level0.setInitialAgentNumber(1);
level0.setWaveNumber(3);
//level1.setWaveNumber(1);
level0.setExpiryLimit(20);
//level0.setImage("/images/Background_Level1.png");
level0.setNotice("<h2>Tutorial</h2> " +
        "<p>The aim of Fierce Planet is to help citizens survive as they move towards their goal (the yellow disc in the bottom right corner).</p> " +
        "<p>You can do this by placing <em>resources</em> on the grey squares. Your resources are the blue, green and red rectangles below. You can click or drag resources onto any grey square on the game map.</p> " +
        "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these, so you will need to supply a mix of resources along their path.</p> " +
        "<p>Notice that if you don't provide enough resources of a particular kind, your citizens will start to turn into that colour. That's a dangerous sign, which indicates you need to place some resources quickly.</p> " +
        "<p>During game play, you spend resources from your store, indicated in the top left corner of the scoreboard. Saving citizens will increase your store.</p> " +
        "<p>Start by placing some resources on the map. When you are ready, click the 'Start' button in the Control Panel on the left. A small number of citizens will make their way along the path.</p> "
        );

level0.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(20, 5);
    tiles.splice(15, 1);
    tiles.splice(10, 5);
    tiles.splice(9, 1);
    tiles.splice(0, 5);
    this.setTiles(tiles);
};


/* Level 1 Definition */

var level1 = new Level(1);
level1.addInitialPoint(0, 9);
level1.setGoalX(10);
level1.setGoalY(1);
level1.setWorldSize(11);
level1.setInitialAgentNumber(1);
level1.setWaveNumber(20);
//level1.setWaveNumber(1);
level1.setExpiryLimit(20);
//level1.setSoundSrc("http://forestmist.org/wp-content/uploads/2010/04/html5-audio-loop.mp3");
//level1.setSoundSrc("/creepy1.wav");
//level1.setImage("/images/Background_Level1.png");
level1.setNotice("<h2>Level 1: Welcome to Fierce Planet!</h2> " +
        "<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
        "<p>Help them by placing 'Economic', 'Environmental' and 'Social' resources beside their path before they expire! Drag or click the blue, green and red swatches onto the grey patches of the maze.</p> " +
        "<p><em>Tip: Keep watch on your resource and expired levels - once the maximum number of citizens have expired, it's Game Over!</em></p> ");
//level1.setMapOptions({ lat: 30.9376, long: 79.4292, zoom: 10});

level1.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(99, 10);
    tiles.splice(97, 1);
    tiles.splice(78, 9);
    tiles.splice(67, 1);
    tiles.splice(56, 9);
    tiles.splice(53, 1);
    tiles.splice(34, 9);
    tiles.splice(23, 1);
    tiles.splice(12, 10);
    this.setTiles(tiles);

    // Add predators and rivals
    this.setLevelAgents([new Agent(PREDATOR_AGENT_TYPE, 0, 9)]);
    this.setWaveAgents([new Agent(RIVAL_AGENT_TYPE, 10, 1)]);
};


/* Level 2 Definition */

var level2 = new Level(2);
level2.addInitialPoint(0, 0);
level2.setGoalX(11);
level2.setGoalY(1);
level2.setWorldSize(12);
level2.setInitialAgentNumber(1);
level2.setWaveNumber(20);
level2.setExpiryLimit(20);
level2.setInitialResourceStore(120);
//level2.setImage("/images/Background_Level2.png");
level2.setNotice("<h2>Level 2: Twists and Turns</h2>" +
        "<p>Congratulations! You successfully navigated Level 1!</p>" +
        "<p>The citizens of Fierce Planet now face a greater challenge... Can you supply them with resources to reach their goal?</p>" +
        "<p><em>Tip: you can pause at any time to add resources. Your resource store increases as you save more citizens.</em></p>"
        );

level2.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(121, 10);
    tiles.splice(118, 1);
    tiles.splice(109, 1);
    tiles.splice(102, 5);
    tiles.splice(97, 4);
    tiles.splice(90, 1);
    tiles.splice(88, 1);
    tiles.splice(78, 5);
    tiles.splice(73, 4);
    tiles.splice(70, 1);
    tiles.splice(61, 1);
    tiles.splice(54, 5);
    tiles.splice(49, 4);
    tiles.splice(42, 1);
    tiles.splice(40, 1);
    tiles.splice(32, 3);
    tiles.splice(30, 1);
    tiles.splice(25, 4);
    tiles.splice(22, 2);
    tiles.splice(18, 3);
    tiles.splice(13, 1);
    tiles.splice(0, 2);
    this.setTiles(tiles);
};


/* Level 3 Definition */

var level3 = new Level(3);
level3.addInitialPoint(5, 12);
level3.setGoalX(3);
level3.setGoalY(3);
level3.setWorldSize(13);
level3.setInitialAgentNumber(1);
level3.setWaveNumber(20);
level3.setExpiryLimit(20);
level3.setInitialResourceStore(130);
//level3.setImage("/images/Background_Level3.png");
level3.setNotice("<h2>Level 3: Around and About</h2>" +
        "<p>After some further twists, the citizens of Fierce Planet are about to embark on some long roads ahead....</p>" +
        "<p><em>Tip: Levels get progressively larger, requiring more planning about where you allocate resources. Aim to place resources at regular intervals.</em></p>"
        );

level3.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(161, 1);
    tiles.splice(150, 5);
    tiles.splice(148, 1);
    tiles.splice(144, 3);
    tiles.splice(141, 1);
    tiles.splice(137, 1);
    tiles.splice(135, 1);
    tiles.splice(133, 1);
    tiles.splice(131, 1);
    tiles.splice(126, 3);
    tiles.splice(124, 1);
    tiles.splice(122, 1);
    tiles.splice(120, 1);
    tiles.splice(118, 1);
    tiles.splice(113, 1);
    tiles.splice(111, 1);
    tiles.splice(109, 1);
    tiles.splice(107, 1);
    tiles.splice(105, 1);
    tiles.splice(100, 3);
    tiles.splice(96, 3);
    tiles.splice(94, 1);
    tiles.splice(92, 1);
    tiles.splice(89, 1);
    tiles.splice(81, 1);
    tiles.splice(79, 1);
    tiles.splice(68, 9);
    tiles.splice(66, 1);
    tiles.splice(53, 1);
    tiles.splice(42, 9);
    tiles.splice(40, 1);
    tiles.splice(37, 1);
    tiles.splice(27, 1);
    tiles.splice(14, 11);
    this.setTiles(tiles);
};


/* Level 4 Definition */

var level4 = new Level(1);
level4.addInitialPoint(6, 6);
level4.setGoalX(0);
level4.setGoalY(0);
level4.setWorldSize(14);
level4.setInitialAgentNumber(1);
level4.setWaveNumber(20);
level4.setExpiryLimit(20);
level4.setInitialResourceStore(150);
//level4.setImage("/images/Background_Level4.png");
level4.setNotice("<h2>Level 4: Spiral of uncertainty</h2>" +
        "<p>The only way out is via the long and winding road...</p>" +
        "<p><em>Tip: be sure to allocate plenty of resources to the outer reaches of the road. The citizens will start to sprint when there is less to go around.</em></p>"
        );

level4.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(168, 13);
    tiles.splice(166, 1);
    tiles.splice(154, 1);
    tiles.splice(152, 1);
    tiles.splice(142, 9);
    tiles.splice(140, 1);
    tiles.splice(138, 1);
    tiles.splice(136, 1);
    tiles.splice(128, 1);
    tiles.splice(126, 1);
    tiles.splice(124, 1);
    tiles.splice(122, 1);
    tiles.splice(116, 5);
    tiles.splice(114, 1);
    tiles.splice(112, 1);
    tiles.splice(110, 1);
    tiles.splice(108, 1);
    tiles.splice(106, 1);
    tiles.splice(102, 1);
    tiles.splice(100, 1);
    tiles.splice(98, 1);
    tiles.splice(96, 1);
    tiles.splice(94, 1);
    tiles.splice(92, 1);
    tiles.splice(90, 1);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(84, 1);
    tiles.splice(82, 1);
    tiles.splice(80, 1);
    tiles.splice(76, 3);
    tiles.splice(74, 1);
    tiles.splice(72, 1);
    tiles.splice(70, 1);
    tiles.splice(68, 1);
    tiles.splice(66, 1);
    tiles.splice(60, 1);
    tiles.splice(58, 1);
    tiles.splice(56, 1);
    tiles.splice(54, 1);
    tiles.splice(46, 7);
    tiles.splice(44, 1);
    tiles.splice(42, 1);
    tiles.splice(40, 1);
    tiles.splice(30, 1);
    tiles.splice(28, 1);
    tiles.splice(16, 11);
    tiles.splice(14, 1);
    tiles.splice(0, 1);
    this.setTiles(tiles);
};


/* Level 5 Definition */

var level5 = new Level(1);
level5.addInitialPoint(13, 0);
level5.setGoalX(0);
level5.setGoalY(1);
level5.setWorldSize(15);
level5.setInitialAgentNumber(1);
level5.setWaveNumber(20);
level5.setExpiryLimit(20);
level5.setInitialResourceStore(180);
//level5.setImage("/images/Background_Level5.png");
level5.setNotice("<h2>Level 5: A-mazing Grace</h2>" +
        "<p>The citizens are -mistakenly? - hopeful that the promised land lies not too far ahead. If only they can find their way through...</p>" +
        "<p><em>Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path.</em>.</p>"
        );

level5.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(208, 1);
    tiles.splice(204, 3);
    tiles.splice(196, 7);
    tiles.splice(193, 1);
    tiles.splice(191, 1);
    tiles.splice(189, 1);
    tiles.splice(187, 1);
    tiles.splice(183, 1);
    tiles.splice(178, 1);
    tiles.splice(176, 1);
    tiles.splice(174, 1);
    tiles.splice(172, 1);
    tiles.splice(170, 1);
    tiles.splice(166, 3);
    tiles.splice(163, 1);
    tiles.splice(161, 1);
    tiles.splice(159, 1);
    tiles.splice(157, 1);
    tiles.splice(155, 1);
    tiles.splice(151, 1);
    tiles.splice(148, 1);
    tiles.splice(146, 1);
    tiles.splice(144, 1);
    tiles.splice(142, 1);
    tiles.splice(140, 1);
    tiles.splice(138, 1);
    tiles.splice(136, 1);
    tiles.splice(131, 3);
    tiles.splice(129, 1);
    tiles.splice(127, 1);
    tiles.splice(125, 1);
    tiles.splice(123, 1);
    tiles.splice(121, 1);
    tiles.splice(118, 1);
    tiles.splice(114, 1);
    tiles.splice(112, 1);
    tiles.splice(110, 1);
    tiles.splice(108, 1);
    tiles.splice(106, 1);
    tiles.splice(103, 1);
    tiles.splice(99, 3);
    tiles.splice(95, 3);
    tiles.splice(91, 3);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(80, 1);
    tiles.splice(78, 1);
    tiles.splice(76, 1);
    tiles.splice(73, 1);
    tiles.splice(71, 1);
    tiles.splice(67, 3);
    tiles.splice(65, 1);
    tiles.splice(63, 1);
    tiles.splice(61, 1);
    tiles.splice(58, 1);
    tiles.splice(56, 1);
    tiles.splice(54, 1);
    tiles.splice(52, 1);
    tiles.splice(50, 1);
    tiles.splice(48, 1);
    tiles.splice(46, 1);
    tiles.splice(43, 1);
    tiles.splice(41, 1);
    tiles.splice(39, 1);
    tiles.splice(37, 1);
    tiles.splice(35, 1);
    tiles.splice(33, 1);
    tiles.splice(28, 1);
    tiles.splice(24, 3);
    tiles.splice(20, 3);
    tiles.splice(15, 4);
    tiles.splice(13, 1);
    this.setTiles(tiles);
};


/* Level 6 Definition */

var level6 = new Level(1);
level6.addInitialPoint(0, 1);
level6.setGoalX(2);
level6.setGoalY(14);
level6.setWorldSize(16);
level6.setInitialAgentNumber(1);
level6.setWaveNumber(20);
level6.setExpiryLimit(20);
level6.setAllowOffscreenCycling(true);
level6.setInitialResourceStore(250);
//level6.setImage("/images/Background_Level6.png");
level6.setNotice("<h2>Level 6: Dire Straits</h2>" +
        "<p>Not there yet... This level looks well resourced - but your citizens will need them. </p>"+
        "<p><em>Tip: Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by.</em></p>");

level6.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(226, 1);
    tiles.splice(212, 12);
    tiles.splice(208, 3);
    tiles.splice(196, 1);
    tiles.splice(182, 10);
    tiles.splice(176, 5);
    tiles.splice(166, 1);
    tiles.splice(152, 8);
    tiles.splice(144, 7);
    tiles.splice(136, 1);
    tiles.splice(122, 6);
    tiles.splice(112, 9);
    tiles.splice(106, 1);
    tiles.splice(92, 4);
    tiles.splice(80, 11);
    tiles.splice(76, 1);
    tiles.splice(62, 2);
    tiles.splice(48, 13);
    tiles.splice(46, 1);
    tiles.splice(16, 15);
    this.setTiles(tiles);
};


/* Level 7 Definition */

var level7 = new Level(7);
level7.setWorldSize(17);
level7.addInitialPoint(0, 8);
level7.setGoalX(16);
level7.setGoalY(8);
level7.setInitialAgentNumber(1);
level7.setWaveNumber(10);
level7.setExpiryLimit(10);
level7.setAllowResourcesOnPath(true);
level7.setInitialResourceStore(150);
//level7.setImage("/images/Background_Level7.png");
level7.setNotice("<h2>Level 7: Like, Totally Random...</h2>" +
        "<p>Ahead lies a vast and empty expanse. The citizens are understandably nervous. Left unaided, they will try not to backtrack, but could still find themselves hopelessly lost without your aid.</p>" +
        "<p><em>You can add resources to the paths (the white squares) on this level, to direct citizens to their goal.</em></p>");

level7.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(280, 1);
    tiles.splice(262, 3);
    tiles.splice(244, 5);
    tiles.splice(226, 7);
    tiles.splice(208, 9);
    tiles.splice(190, 11);
    tiles.splice(172, 13);
    tiles.splice(154, 15);
    tiles.splice(136, 17);
    tiles.splice(120, 15);
    tiles.splice(104, 13);
    tiles.splice(88, 11);
    tiles.splice(72, 9);
    tiles.splice(56, 7);
    tiles.splice(40, 5);
    tiles.splice(24, 3);
    tiles.splice(8, 1);
    this.setTiles(tiles);


    // Add predators and rivals
    this.addLevelAgent(new Agent(PREDATOR_AGENT_TYPE, 8, 4));
    this.addWaveAgent(new Agent(RIVAL_AGENT_TYPE, 9, 4));
};




/* Level 8 Definition */

var level8 = new Level(8);
level8.addInitialPoint(0, 0);
level8.setGoalX(17);
level8.setGoalY(17);
level8.setWorldSize(18);
level8.setInitialAgentNumber(1);
level8.setWaveNumber(10);
level8.setExpiryLimit(10);
level8.setInitialResourceStore(200);
//level8.setImage("/images/Background_Level8.png");
level8.setNotice("<h2>Level 8: A Fork (or Two) in the Road</h2>" +
        "<p>Life for the citizens of Fierce Planet is never easy. Having escaped the perils of random wandering, here they are faced with many decisions about which way to turn.</p>" + 
        "<p><em>Again, you'll need to direct citizen through numerous forks in the road, with strategic allocation of resources. Beware: leave no path under-resourced!</em></p>");

level8.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(322, 2);
    tiles.splice(289, 16);
    tiles.splice(286, 1);
    tiles.splice(271, 1);
    tiles.splice(255, 14);
    tiles.splice(253, 1);
    tiles.splice(250, 1);
    tiles.splice(248, 1);
    tiles.splice(246, 1);
    tiles.splice(237, 1);
    tiles.splice(235, 1);
    tiles.splice(232, 1);
    tiles.splice(230, 1);
    tiles.splice(221, 8);
    tiles.splice(219, 1);
    tiles.splice(217, 1);
    tiles.splice(214, 1);
    tiles.splice(212, 1);
    tiles.splice(210, 1);
    tiles.splice(203, 1);
    tiles.splice(201, 1);
    tiles.splice(199, 1);
    tiles.splice(196, 1);
    tiles.splice(194, 1);
    tiles.splice(187, 6);
    tiles.splice(185, 1);
    tiles.splice(183, 1);
    tiles.splice(181, 1);
    tiles.splice(178, 1);
    tiles.splice(176, 1);
    tiles.splice(174, 1);
    tiles.splice(172, 1);
    tiles.splice(169, 1);
    tiles.splice(167, 1);
    tiles.splice(165, 1);
    tiles.splice(163, 1);
    tiles.splice(160, 1);
    tiles.splice(158, 1);
    tiles.splice(156, 1);
    tiles.splice(154, 1);
    tiles.splice(151, 1);
    tiles.splice(149, 1);
    tiles.splice(147, 1);
    tiles.splice(145, 1);
    tiles.splice(142, 1);
    tiles.splice(140, 1);
    tiles.splice(138, 1);
    tiles.splice(131, 6);
    tiles.splice(129, 1);
    tiles.splice(127, 1);
    tiles.splice(124, 1);
    tiles.splice(122, 1);
    tiles.splice(120, 1);
    tiles.splice(113, 1);
    tiles.splice(111, 1);
    tiles.splice(109, 1);
    tiles.splice(106, 1);
    tiles.splice(104, 1);
    tiles.splice(95, 8);
    tiles.splice(93, 1);
    tiles.splice(91, 1);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(77, 1);
    tiles.splice(75, 1);
    tiles.splice(73, 1);
    tiles.splice(70, 1);
    tiles.splice(55, 14);
    tiles.splice(52, 1);
    tiles.splice(37, 1);
    tiles.splice(19, 16);
    tiles.splice(0, 2);
    this.setTiles(tiles);
};


/* Level 9 Definition */

var level9 = new Level(9);
level9.addInitialPoint(9, 0);
level9.setGoalX(9);
level9.setGoalY(18);
level9.setWorldSize(19);
level9.setInitialAgentNumber(1);
level9.setWaveNumber(10);
level9.setExpiryLimit(10);
//level9.setImage("/images/Background_Level9.png");
level9.setNotice("<h2>Level 9: Cascades</h2>" +
        "<p>With time running out, the citizens of Fierce Planet are in a rush to find safety. But they're in for a bumpy ride.</p>" +
        "<p><em>Tip: No tip! You've gotten this far...</em></p>");

level9.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(351, 1);
    tiles.splice(330, 5);
    tiles.splice(315, 1);
    tiles.splice(311, 1);
    tiles.splice(296, 3);
    tiles.splice(290, 3);
    tiles.splice(279, 1);
    tiles.splice(271, 1);
    tiles.splice(260, 3);
    tiles.splice(250, 3);
    tiles.splice(243, 1);
    tiles.splice(231, 1);
    tiles.splice(224, 3);
    tiles.splice(210, 3);
    tiles.splice(207, 1);
    tiles.splice(191, 1);
    tiles.splice(182, 7);
    tiles.splice(172, 7);
    tiles.splice(163, 1);
    tiles.splice(159, 1);
    tiles.splice(144, 3);
    tiles.splice(138, 3);
    tiles.splice(127, 1);
    tiles.splice(119, 1);
    tiles.splice(108, 3);
    tiles.splice(98, 3);
    tiles.splice(91, 1);
    tiles.splice(79, 1);
    tiles.splice(72, 3);
    tiles.splice(58, 3);
    tiles.splice(55, 1);
    tiles.splice(39, 1);
    tiles.splice(20, 17);
    tiles.splice(9, 1);
    this.setTiles(tiles);
};



/* Level 10 Definition */

var level10 = new Level(10);
level10.addInitialPoint(18, 19);
level10.setGoalX(16);
level10.setGoalY(19);
level10.setWorldSize(20);
level10.setInitialAgentNumber(1);
level10.setWaveNumber(5);
level10.setExpiryLimit(1);
level10.setInitialResourceStore(250);
//level10.setImage("/images/Background_Level10.png");
level10.setNotice("<h2>Level 10: Fields of Ma(i)ze</h2>" +
        "<p>Nearly there! Pastures of plenty, and a new future, lie in store for the citizens of Fierce Planet. " +
        "However the way ahead is full of false dawns. Can they navigate the treacherous maze?</p>" +
        "<p><em>Tip: Remember to resource dead end paths, or citizens will expire, dazed and confused.</em></p>");

level10.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(398, 1);
    tiles.splice(396, 1);
    tiles.splice(378, 1);
    tiles.splice(361, 16);
    tiles.splice(358, 1);
    tiles.splice(356, 1);
    tiles.splice(345, 1);
    tiles.splice(341, 1);
    tiles.splice(338, 1);
    tiles.splice(334, 3);
    tiles.splice(325, 8);
    tiles.splice(323, 1);
    tiles.splice(321, 1);
    tiles.splice(318, 1);
    tiles.splice(312, 1);
    tiles.splice(305, 1);
    tiles.splice(303, 1);
    tiles.splice(301, 1);
    tiles.splice(298, 1);
    tiles.splice(292, 5);
    tiles.splice(287, 4);
    tiles.splice(285, 1);
    tiles.splice(281, 3);
    tiles.splice(278, 1);
    tiles.splice(267, 1);
    tiles.splice(265, 1);
    tiles.splice(247, 12);
    tiles.splice(241, 5);
    tiles.splice(238, 1);
    tiles.splice(221, 1);
    tiles.splice(218, 1);
    tiles.splice(215, 1);
    tiles.splice(211, 3);
    tiles.splice(207, 3);
    tiles.splice(205, 1);
    tiles.splice(203, 1);
    tiles.splice(201, 1);
    tiles.splice(195, 4);
    tiles.splice(193, 1);
    tiles.splice(189, 3);
    tiles.splice(183, 5);
    tiles.splice(181, 1);
    tiles.splice(178, 1);
    tiles.splice(173, 1);
    tiles.splice(164, 1);
    tiles.splice(161, 1);
    tiles.splice(158, 1);
    tiles.splice(153, 4);
    tiles.splice(146, 6);
    tiles.splice(141, 4);
    tiles.splice(138, 1);
    tiles.splice(136, 1);
    tiles.splice(131, 1);
    tiles.splice(126, 1);
    tiles.splice(118, 1);
    tiles.splice(114, 3);
    tiles.splice(108, 5);
    tiles.splice(106, 1);
    tiles.splice(101, 4);
    tiles.splice(98, 1);
    tiles.splice(94, 1);
    tiles.splice(91, 1);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(84, 1);
    tiles.splice(81, 1);
    tiles.splice(78, 1);
    tiles.splice(76, 1);
    tiles.splice(71, 4);
    tiles.splice(68, 2);
    tiles.splice(63, 4);
    tiles.splice(61, 1);
    tiles.splice(58, 1);
    tiles.splice(56, 1);
    tiles.splice(41, 1);
    tiles.splice(21, 18);
    this.setTiles(tiles);
};



/* Level 10 Definition */

var level11 = new Level(10);
level11.addInitialPoint(18, 19);
level11.addInitialPoint(1, 1);
level11.setGoalX(16);
level11.setGoalY(19);
level11.setWorldSize(20);
level11.setInitialAgentNumber(10);
level11.setWaveNumber(5);
level11.setExpiryLimit(100);
level11.setInitialResourceStore(250);
level11.setNotice("<h2>Level 11: A Very Testing Level</h2>" +
        "<p>Experimental features are added here. Play at your own risk!</p>");

level11.setupLevel = function() {
    var tiles = fillWithTiles();
    tiles.splice(398, 1);
    tiles.splice(396, 1);
    tiles.splice(378, 1);
    tiles.splice(361, 16);
    tiles.splice(358, 1);
    tiles.splice(356, 1);
    tiles.splice(345, 1);
    tiles.splice(341, 1);
    tiles.splice(338, 1);
    tiles.splice(334, 3);
    tiles.splice(325, 8);
    tiles.splice(323, 1);
    tiles.splice(321, 1);
    tiles.splice(318, 1);
    tiles.splice(312, 1);
    tiles.splice(305, 1);
    tiles.splice(303, 1);
    tiles.splice(301, 1);
    tiles.splice(298, 1);
    tiles.splice(292, 5);
    tiles.splice(287, 4);
    tiles.splice(285, 1);
    tiles.splice(281, 3);
    tiles.splice(278, 1);
    tiles.splice(267, 1);
    tiles.splice(265, 1);
    tiles.splice(247, 12);
    tiles.splice(241, 5);
    tiles.splice(238, 1);
    tiles.splice(221, 1);
    tiles.splice(218, 1);
    tiles.splice(211, 5);
//    tiles.splice(215, 1);
//    tiles.splice(211, 3);
    tiles.splice(207, 3);
    tiles.splice(205, 1);
    tiles.splice(203, 1);
    tiles.splice(201, 1);
    tiles.splice(195, 4);
    tiles.splice(193, 1);
    tiles.splice(189, 3);
    tiles.splice(183, 5);
    tiles.splice(181, 1);
    tiles.splice(178, 1);
    tiles.splice(173, 1);
    tiles.splice(164, 1);
    tiles.splice(161, 1);
    tiles.splice(158, 1);
    tiles.splice(153, 4);
    tiles.splice(146, 6);
    tiles.splice(141, 4);
    tiles.splice(138, 1);
    tiles.splice(136, 1);
    tiles.splice(131, 1);
    tiles.splice(126, 1);
    tiles.splice(118, 1);
    tiles.splice(114, 3);
    tiles.splice(108, 5);
    tiles.splice(106, 1);
    tiles.splice(101, 4);
    tiles.splice(98, 1);
    tiles.splice(94, 1);
    tiles.splice(91, 1);
    tiles.splice(88, 1);
    tiles.splice(86, 1);
    tiles.splice(84, 1);
    tiles.splice(81, 1);
    tiles.splice(78, 1);
    tiles.splice(76, 1);
    tiles.splice(71, 4);
    tiles.splice(68, 2);
    tiles.splice(63, 4);
    tiles.splice(61, 1);
    tiles.splice(58, 1);
    tiles.splice(56, 1);
    tiles.splice(41, 1);
    tiles.splice(21, 18);
    this.setTiles(tiles);

//    this.setWaveAgents([new Agent(RIVAL_AGENT_TYPE, 16, 19)]);
    this.setWaveAgents([new Agent(RIVAL_AGENT_TYPE, 9, 3)]);
    this.setLevelAgents([new Agent(PREDATOR_AGENT_TYPE, 3, 16)]);
};


/* Google Map links */
var GOOGLE_MAPS = [
    "http://maps.google.com/maps/api/staticmap?center=30.9376,79.4292&zoom=10&size=501x501&maptype=satellite&sensor=false",
    "http://maps.google.com/maps/api/staticmap?center=32.3939,78.2345&zoom=13&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-63.1748,-56.6296&zoom=13&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-25.34340,131.03644&zoom=14&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=25.088,12.201&zoom=10&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-9.8691,-37.2139&zoom=10&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-13.182,167.705&zoom=10&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=41.890260,12.492220&zoom=20&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=43.07646,-79.07158&zoom=18&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=-41.81182,146.98923&zoom=14&size=501x501&maptype=satellite&sensor=false",
        "http://maps.google.com/maps/api/staticmap?center=40.75259,-73.98030&zoom=15&size=501x501&maptype=satellite&sensor=false"
];

var tempImg = new Array();

for(var i = 0; i < GOOGLE_MAPS.length; i++) {
    tempImg[i] = new Image();
    tempImg[i].src = GOOGLE_MAPS[i];
}
//level1.setMapURL("/images/bg_level1a.png");
level1.setMapURL(GOOGLE_MAPS[0]);
level2.setMapURL(GOOGLE_MAPS[1]);
level3.setMapURL(GOOGLE_MAPS[2]);
level4.setMapURL(GOOGLE_MAPS[3]);
level5.setMapURL(GOOGLE_MAPS[4]);
level6.setMapURL(GOOGLE_MAPS[5]);
level7.setMapURL(GOOGLE_MAPS[6]);
level8.setMapURL(GOOGLE_MAPS[7]);
level9.setMapURL(GOOGLE_MAPS[8]);
level10.setMapURL(GOOGLE_MAPS[9]);
level11.setMapURL(GOOGLE_MAPS[10]);
