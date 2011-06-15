

/* NB: classes.js and relevant level sources must be pre-loaded */

/* Constants */
var FiercePlanet = {

};


/* Initialisation code: start game and dialog boxes */

$(document).ready(function() {
    loadGame();
});


/**
 * Starts the processing of agents
 */
function startAgents() {
    console.log("Starting agents...");

    clearInterval(agentTimerId);
    agentTimerId = setInterval("processAgents()", interval);
    inPlay = true;


    // Play sound, if any are set
    if (audio != undefined)
        audio.pause();
    if (currentLevel.getSoundSrc() != undefined) {
//        var audio = $("background-sound")[0];
//        audio.src = currentLevel.getSoundSrc();

        audio = new Audio(currentLevel.getSoundSrc());
        audio.loop = true;
        audio.addEventListener("ended", function(){audio.currentTime = 0; audio.play();}, false);
        audio.play();
    }
}

/**
 * Stops the processing of agents
 */
function stopAgents() {
    console.log("Pausing agents...");

    clearInterval(agentTimerId);
    inPlay = false;

    if (audio != undefined)
        audio.pause();
}


/**
 * Slows down the rate of processing agents
 */
function slowDown() {
    if (interval < 10)
        interval += 1;
    else if (interval < 100)
        interval += 10;
    if (inPlay)
        startAgents();
}


/**
 * Speeds up the rate of processing agents
 */
function speedUp() {
    if (interval > 10)
        interval -= 10;
    else if (interval > 1)
        interval -= 1;
    if (inPlay)
        startAgents();
}


/**
 * Core logic loop: processes agents
 */
function processAgents() {

    var recordableChangeMade = false;

    // Draw the scrolling layer
    drawScrollingLayer();


    // Delay, until we are ready for the first wave
    if (levelDelayCounter < NEW_LEVEL_DELAY / interval) {
        levelDelayCounter++;
        return;
    }

    // Delay, until we are ready for a new wave
    if (waveDelayCounter < NEW_WAVE_DELAY / interval) {
        waveDelayCounter++;
        return;
    }

    // Increment counter
    globalCounter++;


    clearAgents();

    var nullifiedAgents = new Array();
    var citizenCount = 0;
    var agents = currentLevel.getCurrentAgents();

    // Pre-movement processing - DO NOTHING FOR NOW
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];
        var speed = agent.getSpeed();
        if (globalCounter >= agent.getDelay() && (globalCounter - agent.getDelay()) % speed == 0) {
            agent.evaluatePosition(currentLevel);
        }
    }

    // Move agents
    var options = {"withNoRepeat": true, "withNoCollision": false};
    for (var i = 0; i < agents.length; i++) {
        var agent = agents[i];

        // Don't process agents we want to block
        if (! rivalsVisible && agent.getType() == AgentTypes.RIVAL_AGENT_TYPE)
            continue;
        if (! predatorsVisible && agent.getType() == AgentTypes.PREDATOR_AGENT_TYPE)
            continue;

        var speed = agent.getSpeed();
        if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE)
            citizenCount++;
        if (globalCounter >= agent.getDelay() && (globalCounter - agent.getDelay()) % speed == 0) {
            recordableChangeMade = true;
            // TODO: move this logic elsewhere
            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE) {
                if (currentLevel.isExitPoint(agent.getX(), agent.getY())) {
                    score += SURVIVAL_SCORE;
                    savedAgentCount++;
                    savedAgentThisWaveCount++;
                    nullifiedAgents.push(i);
                    var multiplier = (waves < 5 ? 4 : (waves < 10 ? 3 : (waves < 20 ? 2 : 1)));
                    resourcesInStore += multiplier; //WAVE_GOODNESS_BONUS;
                    drawScore();
                    drawResourcesInStore();
                    drawSaved();
                }
            }

            // Do for all agents
            agent.evaluateMove(currentLevel, options);

            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE) {
                agent.adjustSpeed();
                agent.adjustWander();
            }

            if (agent.getMoves() > maxWaveMoves)
                maxWaveMoves = agent.getMoves();
            if (agent.getMoves() > maxLevelMoves)
                maxLevelMoves = agent.getMoves();

            // TODO: should be in-lined?
            if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE || agent.getType() == AgentTypes.RIVAL_AGENT_TYPE) {
                if (!godMode)
                    agent.adjustHealth(MOVE_HEALTH_COST);
                if (agent.getHealth() <= 0) {
                    nullifiedAgents.push(i);
                    if (agent.getType() == AgentTypes.CITIZEN_AGENT_TYPE)
                        expiredAgentCount++;
                    drawExpired();
                }
                else {
                    // Hook for detecting 'active' resources
                    processNeighbouringResources(agent);

                    // Hook for detecting other agents
                    processNeighbouringAgents(agent);
                }
            }
        }
    }



    if (expiredAgentCount >= currentLevel.getExpiryLimit()) {
        return gameOver();
    }

    // Check whether we have too many
    for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
        currentLevel.getCurrentAgents().splice(nullifiedAgents[i], 1);
    }
    // No agents left? End of wave
    if (citizenCount == 0) {
        // Start a new wave
        if (waves < currentLevel.getWaveNumber()) {
//            alert(maxWaveMoves);
            newWave();
            drawScoreboard();
            waveDelayCounter = 0;
        }
        else if (currentLevelNumber < LEVELS) {
            completeLevel();
            levelDelayCounter = 0;
        }
        else {
            return completeGame();
        }
    }
    else {
        if (globalCounter % resourceRecoveryCycle == 0)
            ResourceUI.recoverResources();
        drawAgents();
    }

    // Post-move processing
    if (recording)
        Recording.recordWorld();

}


/**
 * Processes neighbouring resources
 */
function processNeighbouringResources(agent) {
    var x = agent.getX();
    var y = agent.getY();
    for (var j = 0; j < currentLevel.getResources().length; j++) {
        var resource = currentLevel.getResources()[j];
        var rx = resource.getX();
        var ry = resource.getY();
        if (Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1) {
            var resourceEffect = ResourceUI.calculateResourceEffect(resource);
            resource.provideYield(agent, resourceEffect, applyGeneralHealth);
            drawResource(resource);
        }
    }
}


/**
 * Processes neighbouring agents
 */
function processNeighbouringAgents(agent) {
    var x = agent.getX();
    var y = agent.getY();
    agent.setIsHit(false);
    var agents = currentLevel.getCurrentAgents();
    for (var j = 0; j < agents.length; j++) {
        var a = agents[j];
        var ax = a.getX();
        var ay = a.getY();
        if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
            if (!godMode && predatorsVisible && agent.getType() == CITIZEN_AGENT_TYPE && a.getType() == PREDATOR_AGENT_TYPE) {
                agent.setIsHit(true);
            }
        }
    }
    if (agent.getIsHit())
        agent.adjustHealth(-10);
}







function refreshSwatch() {
    for (var i = 0; i < capabilities.length; i++) {
        var capability = $.trim(capabilities[i]);
        try {
            $('#' + capability)[0].style.display = 'block';
        }
        catch (err) {
        }
    }
}

function saveCapabilities() {
    if (PROFILE_ID != undefined) {
        updateStats(function(data) {});
    }
}

function saveSettings() {
    setAndStoreProperty('godMode');
    setAndStoreProperty('invisiblePath');
    setAndStoreProperty('agentsCanCommunicate');
    setAndStoreProperty('agentTracing');
    setAndStoreProperty('recording');
    setAndStoreProperty('rivalsVisible');
    setAndStoreProperty('predatorsVisible');
    setAndStoreProperty('tilesMutable');
    setAndStoreProperty('soundsPlayable');
    setAndStoreProperty('backgroundIconsVisible');
    setAndStoreProperty('resourcesInTension');
    setAndStoreProperty('resourceBonus');
    setAndStoreProperty('applyGeneralHealth');
    setAndStoreProperty('ignoreResourceBalance');

    restartLevel();
}


