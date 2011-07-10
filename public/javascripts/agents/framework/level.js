/*!
 * Fierce Planet - Level
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Level class definition
 *
 * @constructor
 * @param id
 */
function Level(id) {
    this._id = id;
    this._isPresetLevel = false;
    this._name = id;
    this._entryPoints = [];
    this._exitPoints = [];

    // Dimensions
    this._worldWidth = 11;
    this._worldHeight = 11;

    // Parameters
    this._initialAgentNumber = 1;
    this._waveNumber = 10;
    this._expiryLimit = 20;
    this._initialResourceStore = 100;
    this._allowOffscreenCycling = false;
    this._allowResouresOnPath = false;
    this._customLevel = false;
    this._noWander = false;
    this._noSpeedChange = false;

    // Google map options
    this._mapOptions = null;
    this._mapURL = null;
    this._image = null;
    this._imageAttribution = null;


    // Current level state
    this._tiles = [];
    this._tileMap = [];
    this._levelAgents = [];
    this._waveAgents = [];
    this._currentAgents = [];
    this._currentAgentsMap = [];
    this._cells = [];
    this._resources = [];
    this._resourceCategoryCounts = this.resetResourceCategoryCounts();
    this._catastrophe = null;

    // User interface elements
    this._tip = null;
    this._introduction = "Welcome to level " + this._id + ".";
    this._conclusion = "Congratulations! You have completed level " + this._id + ".";
    this._image = null;
    this._soundSrc = null;

}
Level.prototype.getId = function() { return this._id; };
Level.prototype.setId = function(id) { this._id = id; };
Level.prototype.isPresetLevel = function() { return this._isPresetLevel; };
Level.prototype.setPresetLevel = function(isPresetLevel) { this._isPresetLevel = isPresetLevel; };
Level.prototype.getName = function() { return this._name; };
Level.prototype.setName = function(name) { this._name = name; };
Level.prototype.getInitialAgentNumber = function() { return this._initialAgentNumber; };
Level.prototype.setInitialAgentNumber = function(initialAgentNumber) { this._initialAgentNumber = initialAgentNumber; };
Level.prototype.getEntryPoints = function() { return this._entryPoints; };
Level.prototype.setEntryPoints = function(entryPoints) { this._entryPoints = entryPoints; };
Level.prototype.addEntryPoint = function(x, y) {
    var found = false;
    for (var i = 0; i < this._entryPoints.length; i++) {
        var point = this._entryPoints[i];
        if (point[0] == x && point[1]== y) {
            found = true;
            break;
        }
    }
    if (!found)
        this._entryPoints.push([x, y]);
};
Level.prototype.resetEntryPoints = function() {
    this._entryPoints = [];
    this.addEntryPoint(0, 0);
};
Level.prototype.removeEntryPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this._entryPoints.length; i++) {
        var point = this._entryPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this._entryPoints.splice(position, 1);
    }
};
Level.prototype.getFirstEntryPoint = function() { return this._entryPoints[0]; };
Level.prototype.getExitPoints = function() { return this._exitPoints; };
Level.prototype.setExitPoints = function(exitPoints) { this._exitPoints = exitPoints; };
Level.prototype.isExitPoint = function(x, y) {
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1]== y) {
            return true;
        }
    }
    return false;
};
Level.prototype.addExitPoint = function(x, y) {
    var found = false;
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1]== y) {
            found = true;
            break;
        }
    }
    if (!found)
        this._exitPoints.push([x, y]);
};
Level.prototype.resetExitPoints = function() {
    this._exitPoints = [];
};
Level.prototype.removeExitPoint = function(x, y) {
    var position = -1;
    for (var i = 0; i < this._exitPoints.length; i++) {
        var point = this._exitPoints[i];
        if (point[0] == x && point[1] == y)
            position = i;
    }
    if (position > -1) {
        this._exitPoints.splice(position, 1);
    }
};
Level.prototype.getInitialResourceStore = function() { return this._initialResourceStore; };
Level.prototype.setInitialResourceStore = function(initialResourceStore) { this._initialResourceStore = initialResourceStore; };
Level.prototype.getWorldWidth = function() { return this._worldWidth; };
Level.prototype.setWorldWidth = function(worldWidth) { this._worldWidth = worldWidth; };
Level.prototype.getWorldHeight = function() { return this._worldHeight; };
Level.prototype.setWorldHeight = function(worldHeight) { this._worldHeight = worldHeight; };
Level.prototype.getWaveNumber = function() { return this._waveNumber; };
Level.prototype.setWaveNumber = function(waveNumber) { this._waveNumber = waveNumber; };
Level.prototype.getExpiryLimit = function() { return this._expiryLimit; };
Level.prototype.setExpiryLimit = function(expiryLimit) { this._expiryLimit = expiryLimit; };
Level.prototype.getAllowOffscreenCycling = function() { return this._allowOffscreenCycling; };
Level.prototype.setAllowOffscreenCycling = function(allowOffscreenCycling) { this._allowOffscreenCycling = allowOffscreenCycling; };
Level.prototype.getAllowResourcesOnPath = function() { return this._allowResouresOnPath; };
Level.prototype.setAllowResourcesOnPath = function(allowResourcesOnPath) { this._allowResouresOnPath = allowResourcesOnPath; };
Level.prototype.getNoWander = function() { return this._noWander; };
Level.prototype.setNoWander = function(noWander) { this._noWander = noWander; };
Level.prototype.getNoSpeedChange = function() { return this._noSpeedChange; };
Level.prototype.setNoSpeedChange = function(noSpeedChange) { this._noSpeedChange = noSpeedChange; };
Level.prototype.getIntroduction = function() { return this._introduction; };
Level.prototype.setIntroduction = function(introduction) { this._introduction = introduction; };
Level.prototype.getConclusion = function() { return this._conclusion; };
Level.prototype.setConclusion = function(conclusion) { this._conclusion = conclusion; };
Level.prototype.getTip = function() { return this._tip; };
Level.prototype.setTip = function(tip) { this._tip = tip; };
Level.prototype.getImage = function() { return this._image; };
Level.prototype.setImage = function(image) { this._image = image; };
Level.prototype.getImageAttribution = function() { return this._imageAttribution; };
Level.prototype.setImageAttribution = function(imageAttribution) { this._imageAttribution = imageAttribution; };
Level.prototype.getSoundSrc = function() { return this._soundSrc; };
Level.prototype.setSoundSrc = function(soundSrc) { this._soundSrc = soundSrc; };
Level.prototype.getTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    return this._tiles[tilePosition];
};
Level.prototype.getSurroundingTiles = function(x, y) {
    var surroundingTiles = [];

    if (x > 0)
        surroundingTiles.add(this.getTile(x - 1, y));
    if (x < this._worldWidth - 1)
        surroundingTiles.add(this.getTile(x + 1, y));
    if (y > 0)
        surroundingTiles.add(this.getTile(x, y - 1));
    if (y < this._worldHeight - 1)
        surroundingTiles.add(this.getTile(x, y + 1));

    return surroundingTiles;
};
Level.prototype.getTiles = function() { return this._tiles; };
Level.prototype.setTiles = function(tiles) {
    this._tiles = tiles;
    this.assignCells();
};
Level.prototype.addTile = function(tile) {
    this._tiles[tile._y * this._worldWidth + tile._x] = tile;
    this.removeEntryPoint(tile._x, tile._y);
    this.removeExitPoint(tile._x, tile._y);
    this.addCell(tile._x, tile._y, tile);
};
Level.prototype.removeTile = function(x, y) {
    var tilePosition = y * this.getWorldWidth() + x;
    this._tiles[tilePosition] = undefined;
    this.annulCell(x, y);
};
Level.prototype.removeAllTiles = function() {
    for (var i = 0; i < this.getWorldWidth(); i++) {
        for (var j = 0; j < this.getWorldHeight(); j++) {
            var tilePosition = j * this.getWorldWidth() + i;
            this._tiles[tilePosition] = undefined;
            this._cells[[i, j]] = undefined;
        }

    }
};
Level.prototype.getMapOptions = function() { return this._mapOptions; };
Level.prototype.setMapOptions = function(mapOptions) { this._mapOptions = mapOptions; };
Level.prototype.getMapURL = function() { return this._mapURL; };
Level.prototype.setMapURL = function(mapURL) { this._mapURL = mapURL; };
Level.prototype.getBackgroundImage = function() { return this._backgroundImage; };
Level.prototype.setBackgroundImage = function(backgroundImage) { this._backgroundImage = backgroundImage; };
Level.prototype.isCustomLevel = function() { return this._customLevel; };
Level.prototype.setCustomLevel = function(customLevel) { this._customLevel = customLevel; };
Level.prototype.getLevelAgents = function() { return this._levelAgents; };
Level.prototype.setLevelAgents = function(levelAgents) { this._levelAgents = levelAgents; };
Level.prototype.addLevelAgent = function(agent) { this._levelAgents.push(agent); };
Level.prototype.getWaveAgents = function() { return this._waveAgents; };
Level.prototype.setWaveAgents = function(waveAgents) { this._waveAgents = waveAgents; };
Level.prototype.addWaveAgent = function(agent) { this._waveAgents.push(agent); };
Level.prototype.getCurrentAgents = function() { return this._currentAgents; };
Level.prototype.setCurrentAgents = function(currentAgents) {
    this._currentAgents = currentAgents;
    for (var agent in this._currentAgents) {
        this._currentAgentsMap[agent._id] = agent;
    }
};
Level.prototype.getAgentByID = function(agentID) { return this._currentAgentsMap[agentID]; };
Level.prototype.getResources = function() { return this._resources; };
Level.prototype.setResources = function(resources) {
    this._resources = resources;
    this._resourceCategoryCounts = this.resetResourceCategoryCounts();
};
Level.prototype.addResource = function(resource) {
    this._resources.push(resource);
    this.incrementResourceCategoryCount(resource);
};
Level.prototype.removeResource = function(resource) {
    var index = this.getCurrentResourceIndex(resource);
    if (index > -1)
        this._resources.splice(index, 1);
    this.decrementResourceCategoryCount(resource);
};
Level.prototype.resetResourceCategoryCounts = function() {
    var rcc = {};
    World.resourceCategories.forEach(function(resourceCategory) {
        rcc[resourceCategory.getCode()] = 0;
    });
    this._resources.forEach(function(resource) {
        rcc[resource.getCategory().getCode()] += 1;
    });
    return rcc;
};
Level.prototype.incrementResourceCategoryCount = function(resource) {
    this._resourceCategoryCounts[resource.getCategory().getCode()] += 1;
};
Level.prototype.decrementResourceCategoryCount = function(resource) {
    this._resourceCategoryCounts[resource.getCategory().getCode()] -= 1;
};
Level.prototype.getResourceCategoryCounts = function() {
    return this._resourceCategoryCounts;
};
Level.prototype.getResourceCategoryCount = function(code) {
    return this._resourceCategoryCounts[code];
};
Level.prototype.getResourceCategoryProportion = function(code) {
    return this.getResourceCategoryCount(code) / this._resources.length;
};

/**
 * Find the current resource index
 */
Level.prototype.getCurrentResourceIndex = function (resource) {
    for (var i = 0; i < this._resources.length; i++) {
        var tmp = this._resources[i];
        if (tmp == resource) {
            return i;
        }
    }
    return -1;
};
/**
 * Find the current resource index
 */
Level.prototype.isPositionOccupiedByResource = function (x, y) {
    for (var i = 0; i < this._resources.length; i++) {
        var resource = this._resources[i];
        if (resource.getX() == x && resource.getY() == y)
            return true;
    }
    return false;
};

Level.prototype.getCatastrophe = function() { return this._catastrophe; };
Level.prototype.setCatastrophe = function(catastrophe) { this._catastrophe = catastrophe; };
Level.prototype.getCells = function() { return this._cells; };
Level.prototype.getCell = function(x, y) { return this._cells[[x, y]]; };
Level.prototype.setCells = function(cells) { this._cells = cells; };
Level.prototype.addCell = function(x, y, value) { this._cells[[x, y]] = value; };
Level.prototype.annulCell = function(x, y) { this._cells[[x, y]] = undefined; };
Level.prototype.assignCells = function() {
    for (var i = 0; i < this._tiles.length; i++) {
        var tile = this._tiles[i];
        if (tile != undefined)
            this.addCell(tile._x, tile._y, tile);
    }
};
Level.prototype.generateWaveAgents = function(numAgents) {
    var newAgents = [];
    for (var j = 0; j < numAgents; j++) {
        for (var i = 0; i < this._waveAgents.length; i++) {
            var waveAgent = this._waveAgents[i];
            newAgents.push(new Agent(waveAgent.getType(), waveAgent.getX(), waveAgent.getY()));
        }
    }
    return newAgents;
};
Level.prototype.getPath = function() {
    var pathCells = [];
    for (var i = 0; i < this._worldHeight; i++) {
        for (var j = 0; j < this._worldWidth; j++) {
            var tilePosition = i * this._worldWidth + j;
            if (this._tiles[tilePosition] == undefined)
                pathCells.push([j, i]);
        }

    }
    return pathCells;
};
Level.prototype.fillWithTiles = function() {
    this._tiles = [];
    for (var i = 0; i < this._worldHeight; i++) {
        for (var j = 0; j < this._worldWidth; j++) {
            var tile = new Tile(DEFAULT_TILE_COLOR, j, i);
            this._tiles.push(tile);
            this.addCell(tile._x, tile._y, tile);
        }
    }
};
Level.prototype.clearTiles = function(start, number) {
    for (var i = start; i < start + number; i++) {
        if (i >= 0 && i < this._tiles.length) {
            var tile = this._tiles[i];
            this._tiles[i] = undefined;
            this.annulCell(tile._x, tile._y);
        }
    }
};
Level.prototype.presetAgents = function(agentType, number, canCommunicateWithOtherAgents) {
    var agents = [];
    for (var j = 0; j < this._entryPoints.length; j++) {
        var point = this._entryPoints[j];
        var x = point[0];
        var y = point[1];
        for (var i = 0; i < number; i ++) {
            var agent = new Agent(agentType, x, y);
            var colorSeed = j % 3;
            var colorScheme = (colorSeed == 0 ? "000" : (colorSeed == 1 ? "0f0" : "00f"));
            // TODO: Make this option configurable
//            agent.setColor(colorScheme);
            var delay = parseInt(Math.random() * MOVE_INCREMENTS * 5);
            agent.setDelay(delay);
            agent.setCanCommunicateWithOtherAgents(canCommunicateWithOtherAgents);
            agents.push(agent);
        }
    }
    $.merge(agents, this.generateWaveAgents());
    $.merge(agents, this.getLevelAgents());

    this.setCurrentAgents(agents);
};

/**
 * Indicates total number of agents saveable on this level
 */
Level.prototype.getTotalSaveable = function () {
    var firstWave = this._initialAgentNumber;
    var lastWave = this._waveNumber + this._initialAgentNumber -1;
    var minor = (firstWave * (firstWave - 1)) / 2;
    var major = (lastWave * (lastWave + 1)) / 2;
    var saveablePerEntryPoint = major - minor;
    var totalSaveable = saveablePerEntryPoint * this._entryPoints.length;
    return totalSaveable;
};




/**
 * Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
 * If the global variable FiercePlanet.ignoreResourceBalance is true, this calculation is ignored.
 * If the global variable FiercePlanet.resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
 *
 * @param   The resource to calculate the effect for
 * @param   Whether the resource mix should be ignored (TODO: should be moved to the World object)
 * @param   Whether tensions between resource categories should be factored in (TODO: should be moved to the World object)
 */
Level.prototype.calculateResourceEffect = function (resource, ignoreResourceMix, resourcesInTension) {
        // Allow this calculation to be ignored
        if (ignoreResourceMix || this._resources.length <= 1)
            return 1;

        var code = resource.getCategory().getCode();
        var totalResources = this._resources.length;
        var resourceCategoryCount = this.getResourceCategoryCount(code);
        var resourceTypeProportion = (resourceCategoryCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;

        // Further adjustment based on surrounding resources
        if (resourcesInTension) {
            effect *= this.calculateSurroundingResourcesEffects(resource);
        }
        return effect;
    };

/**
 * Calculates the effect of surrounding resources
 *
 * @param   A resource to calculate the effect for
 * @returns   The effect to apply
 */
Level.prototype.calculateSurroundingResourcesEffects = function (resource) {
        var x = resource.getX();
        var y = resource.getY();
        var resourceCategory = resource.getCategory();
        var baseEffect = 1;
        for (var i in this._resources) {
            var neighbour = this._resources[i];
            var nx = neighbour.getX();
            var ny = neighbour.getY();
            if (nx == x && ny == y)
                continue;
            if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
                var neighbourCategory = neighbour.getCategory();
                baseEffect *= resourceCategory.doEvaluateOtherCategoryImpact(neighbourCategory);
            }
        }
        return baseEffect;
    };

/**
 * Resets all resource yields to their original values
 */
Level.prototype.resetResourceYields = function () {
    this._resources.forEach(function(resource) {
        resource.setTotalYield(resource.getInitialTotalYield());
    });
};


/**
 * Recover resources to a maximum of their initial state
 *
 * @returns An array of recovered resources
 */
Level.prototype.recoverResources = function () {
    var recoveredResources = [];
    this._resources.forEach(function(resource) {
        if (resource.getTotalYield() < resource.getInitialTotalYield()) {
            /* Overly generous... */
//          resource.setTotalYield(p.getTotalYield() + p.getPerAgentYield());
            resource.incrementTotalYield();
            recoveredResources.push(resource);
        }
    });
    return recoveredResources;
};
