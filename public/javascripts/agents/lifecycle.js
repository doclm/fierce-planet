/*!
 * Fierce Planet - Lifecycle
 * Lifecycle related methods
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * Called when a game is loaded
 */
FiercePlanet.loadGame = function() {
    // Load relevant settings, if available
    FiercePlanet.loadSettingsFromStorage();

    // Set up dialogs
    FiercePlanet.setupDialogs();

    // Handle resource drag and drop and click interactions
    FiercePlanet.initialiseAndLoadResources();

    // Handle resource drag and drop and click interactions
    FiercePlanet.setupResourceInteraction();

    // Add UI event listeners
    FiercePlanet.hookUpUIEventListeners();

    // Add custom event listeners
    FiercePlanet.hookUpCustomEventListeners();

    // Draw the game
    FiercePlanet.newLevel();
};


/**
 * Called when a new game is commenced
 */
FiercePlanet.newGame = function() {
    if (FiercePlanet.currentLevelPreset)
        FiercePlanet.currentLevelNumber = 1;
    FiercePlanet.currentProfile.resetScores();
    FiercePlanet.gameCounter = 0;
    FiercePlanet.newLevel();
};


/**
 * Called when a new level is begun
 */
FiercePlanet.newLevel = function() {
    FiercePlanet.inDesignMode = false;
    FiercePlanet.levelDelayCounter = 0;
    FiercePlanet.levelCounter = 0;
    FiercePlanet.maxLevelMoves = 0;
    FiercePlanet.currentProfile.updateScore();
    if (FiercePlanet.currentLevel != undefined)
        FiercePlanet.currentLevel.setResources([]);
    FiercePlanet.currentNotice = null;
    if (FiercePlanet.audio != undefined) {
        FiercePlanet.audio.pause();
        FiercePlanet.audio = undefined;
    }
    FiercePlanet.recordedLevels = [];

    FiercePlanet._initialiseGame();

    FiercePlanet.levelInfo();
    FiercePlanet.currentNotice = FiercePlanet.currentLevel.getTip();
    FiercePlanet.notify("Starting level " + FiercePlanet.currentLevel.getId() + "...");

};


/**
 * Called when a game is restarted
 */
FiercePlanet.restartLevel = function() {
    // Reset the score
    FiercePlanet.currentProfile.revertScore();

    // Start a new level
    FiercePlanet.newLevel();
};


/**
 * Called when a new wave is ready
 */
FiercePlanet.newWave = function() {
    FiercePlanet.maxWaveMoves = 0;
    FiercePlanet.waveCounter = 0;
    FiercePlanet.waveDelayCounter = 0;
    FiercePlanet.currentProfile.current_level_saved_this_wave = 0;

    FiercePlanet.currentLevel.presetAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.numAgents, World.settings.agentsCanCommunicate);

    FiercePlanet.notify("New wave coming...");

    FiercePlanet.drawEntryPoints();
    FiercePlanet.drawExitPoints();
    FiercePlanet.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.currentLevel));

    FiercePlanet._startAgents();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeWave = function() {
    FiercePlanet.currentWave++;
    FiercePlanet.numAgents++;
    FiercePlanet._finaliseGame();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeLevel = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    if (FiercePlanet.currentLevel.isPresetLevel())
        FiercePlanet.currentLevelNumber++;
    FiercePlanet._finaliseGame();
    FiercePlanet.showCompleteLevelDialog();
};


/**
 * Called when a game is completed
 */
FiercePlanet.completeGame = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    FiercePlanet._finaliseGame();
    FiercePlanet.showCompleteGameDialog();
};


/**
 * Called when the game is over
 */
FiercePlanet.gameOver = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.revertScore();
    FiercePlanet._finaliseGame();
    FiercePlanet.showGameOverDialog();
};


/**
 * Plays the current game
 */
FiercePlanet.playGame = function() {
    if (FiercePlanet.inPlay) {
        FiercePlanet.pauseGame();
    }
    else {
        $('#playAgents').removeClass('pausing');
        $('#playAgents').addClass('playing');
        if (FiercePlanet.waveCounter == 0)
            FiercePlanet.newWave();
        else
            FiercePlanet._startAgents();
    }
};


/**
 * Pauses the current game
 */
FiercePlanet.pauseGame = function() {
    if (!FiercePlanet.inPlay)
        return;
    FiercePlanet._stopAgents();
};


/**
 * Slows down the rate of processing agents
 */
FiercePlanet.slowDown = function() {
    if (FiercePlanet.interval < 10)
        FiercePlanet.interval += 1;
    else if (FiercePlanet.interval < 100)
        FiercePlanet.interval += 10;
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Speeds up the rate of processing agents
 */
FiercePlanet.speedUp = function() {
    if (FiercePlanet.interval > 10)
        FiercePlanet.interval -= 10;
    else if (FiercePlanet.interval > 1)
        FiercePlanet.interval -= 1;
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Initialises level data
 */
FiercePlanet._initialiseGame = function () {
    if (typeof console != "undefined")
        console.log("Initialising world...");

    // Stop any existing timers
    FiercePlanet._stopAgents();

    if (FiercePlanet.currentLevelNumber < 0 || FiercePlanet.currentLevelNumber > 11)
        FiercePlanet.currentLevelNumber = 1;
    if (FiercePlanet.currentLevelPreset) {
        try {
            FiercePlanet.currentLevel = eval("PresetLevels.level" + FiercePlanet.currentLevelNumber.toString());
        }
        catch(err) {
            FiercePlanet.currentLevel = eval("PresetLevels.level1");
        }
    }
    else if (FiercePlanet.currentLevel == undefined) {
        FiercePlanet.currentLevel = eval("PresetLevels.level1");
    }

    if (FiercePlanet.waveOverride > 0) {
        FiercePlanet.currentLevel.setWaveNumber(FiercePlanet.waveOverride);
        FiercePlanet.waveOverride = 0;
    }
    FiercePlanet.currentWave = 1;
    FiercePlanet.currentLevel.setCurrentAgents([]);
    FiercePlanet.currentLevel.setResources([]);
    if (FiercePlanet.currentLevel.getCatastrophe() != undefined)
        FiercePlanet.currentLevel.getCatastrophe()._struck = false;

//    score = 0;
    FiercePlanet.currentProfile.resetCurrentStats();


    FiercePlanet.resourceRecoveryCycle = Math.pow(FiercePlanet.DEFAULT_RESOURCE_RECOVERY, FiercePlanet.levelOfDifficulty - 1);

    FiercePlanet.numAgents = FiercePlanet.currentLevel.getInitialAgentNumber();
    FiercePlanet.worldWidth = FiercePlanet.currentLevel.getWorldWidth();
    FiercePlanet.worldHeight = FiercePlanet.currentLevel.getWorldHeight();
    FiercePlanet.cellWidth = FiercePlanet.WORLD_WIDTH / FiercePlanet.worldWidth;
    FiercePlanet.cellHeight = FiercePlanet.WORLD_HEIGHT / FiercePlanet.worldHeight;
    FiercePlanet.pieceWidth = FiercePlanet.cellWidth * 0.5;
    FiercePlanet.pieceHeight = FiercePlanet.cellHeight * 0.5;
    FiercePlanet.scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    if (FiercePlanet.currentLevel.setup)
        FiercePlanet.currentLevel.setup();

    // Draw the game
    FiercePlanet.drawGame();
};


/**
 * Finalises game
 */
FiercePlanet._finaliseGame = function() {
    FiercePlanet._stopAgents();
    FiercePlanet.storeData();
    FiercePlanet.drawScoreboard();
};


/**
 * Starts the processing of agents
 */
FiercePlanet._startAgents = function () {
    if (typeof console != "undefined")
        console.log("Starting agents...");

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.agentTimerId = setInterval("FiercePlanet.processAgents()", FiercePlanet.interval);
    FiercePlanet.inPlay = true;

    // Make sure button is on pause
    $('#playAgents').removeClass('pausing');
    $('#playAgents').addClass('playing');


    // Play sound, if any are set
    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined) {
            FiercePlanet.audio.play();
        }
        else if (FiercePlanet.currentLevel.getSoundSrc() != undefined) {
//        var audio = $("background-sound")[0];
//        audio.src = FiercePlanet.currentLevel.getSoundSrc();

            FiercePlanet.audio = new Audio(FiercePlanet.currentLevel.getSoundSrc());
            FiercePlanet.audio.loop = true;
            FiercePlanet.audio.addEventListener("ended", function(){FiercePlanet.audio.currentTime = 0; FiercePlanet.audio.play();}, false);
            FiercePlanet.audio.play();
        }
    }
};

/**
 * Stops the processing of agents
 */
FiercePlanet._stopAgents = function () {
    if (typeof console != "undefined")
        console.log("Pausing agents...");

    // Make sure button is on play
    $('#playAgents').removeClass('playing');
    $('#playAgents').addClass('pausing');

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.inPlay = false;

    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined)
            FiercePlanet.audio.pause();
    }
};
