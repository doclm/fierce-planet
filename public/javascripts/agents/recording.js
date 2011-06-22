/*
 * Handles recording-related functions
 */

var FiercePlanet = FiercePlanet || {};


/**
 * Record the current state of the game
 */
FiercePlanet.recordWorld = function() {
        if (FiercePlanet.currentLevel != undefined) {
            if (typeof console != "undefined")
                console.log("Recording at: " + FiercePlanet.globalRecordingCounter);
            try {
                var level = new Level(FiercePlanet.currentLevel._id);
                var agents = [];
                for (var i = 0, len = FiercePlanet.currentLevel.getCurrentAgents().length; i < len; i++) {
                    var actualAgent = FiercePlanet.currentLevel.getCurrentAgents()[i];
                    var proxyAgent = new Agent(actualAgent.getType(), actualAgent.getX(), actualAgent.getY());
                    proxyAgent.setLastMemory(actualAgent.getLastMemory());
                    proxyAgent.setDelay(actualAgent.getDelay());
                    proxyAgent.setSpeed(actualAgent.getSpeed());
                    agents.push(proxyAgent);
                }
                level.setCurrentAgents(agents);
                level.setResources(FiercePlanet.currentLevel.getResources());
                // Serialised option, for remote persistence
                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = $.toJSON(level);
                // Local option
//                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = level;
                FiercePlanet.globalRecordingCounter++;
            }
            catch (err) {
//                console.log(err);
            }
        }
    };

/**
 * Replay the game
 */
FiercePlanet.replayWorld = function() {
        FiercePlanet._stopAgents();
        FiercePlanet.existingCurrentLevel = FiercePlanet.currentLevel;
        clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.waveCounter = 0;
        FiercePlanet.drawGame();
        FiercePlanet.inPlay = true;

        setTimeout("FiercePlanet.replayStart()", 100);
    };


/**
 * Begin the replay of the game, by adding a new interval
 */
FiercePlanet.replayStart = function() {
        FiercePlanet.agentTimerId = setInterval("FiercePlanet.replayStep()", FiercePlanet.interval * 2);
};

/**
 * Replay a single step in a recorded game
 */
FiercePlanet.replayStep = function () {
        var level = FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter];
        if (typeof console != "undefined")
            console.log("Replaying at: " + FiercePlanet.globalRecordingCounter);
        if (level == undefined) {
            FiercePlanet.replayStop();
        }
        else {
            try {
                FiercePlanet.clearAgents();
                // Serialised option, for remote persistence
                FiercePlanet.currentLevel = $.evalJSON(level);
                // Local option
//                FiercePlanet.currentLevel = level;
                FiercePlanet.globalRecordingCounter++;
                FiercePlanet.waveCounter++;
                FiercePlanet.clearCanvas('resourceCanvas');
                FiercePlanet.clearCanvas('scrollingCanvas');
                FiercePlanet.clearCanvas('noticeCanvas');
                FiercePlanet.clearCanvas('agentCanvas');

                FiercePlanet.drawEntryPoints();
                FiercePlanet.drawExitPoints();
                FiercePlanet.drawResources();
                FiercePlanet.drawScrollingLayer();
    //            FiercePlanet.drawScoreboard();
                FiercePlanet.drawAgents();
            }
            catch(err) {
//                console.log(err);
            }
        }
    };


/**
 * Stop the replay of a recorded game
 */
FiercePlanet.replayStop = function () {
        FiercePlanet.agentTimerId = clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.globalRecordingCounter = 0;
        FiercePlanet.currentLevel = FiercePlanet.existingCurrentLevel;
        FiercePlanet.inPlay = false;
    };
