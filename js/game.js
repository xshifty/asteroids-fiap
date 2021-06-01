function Game (canvasId, width, height) {
    let canvas = document.getElementById(canvasId);

    this.debug = false;
    this.width = width;
    this.height = height;
    this.context = canvas.getContext('2d')

    this.scope = {};
    this.images = {};
};

Game.prototype.setup = function (userSetup) {
    userSetup(this);

    return this;
};

Game.prototype.run = function (userLoop) {
    let g = this;

    function gameLoop() {
        g.context.fillStyle = '#000020';
        g.context.fillRect(0, 0, g.width, g.height);

        userLoop(g);
        
        return requestAnimationFrame(gameLoop);
    }

    loadResourcesAndRun(this.images, gameLoop);

    return this;
};

Game.prototype.addImage = function (id, path) {
    if (id in this.images) {
        throw('Image ID already taken.');
    }

    this.images[id] = path;

    return this;
};

Game.prototype.getImage = function (id) {
    if (!id in this.images) {
        throw('Image not found.');
    }

    if (!this.images[id] instanceof Image || !this.images[id].complete) {
        throw('Image not loaded yet.');
    }

    return this.images[id];
};

function loadResourcesAndRun(images, callback) {
    function checkLoaded () {
        let loaded = true;

        for (id in images) {
            loaded = loaded && images[id].complete;
        }

        if (loaded) {
            requestAnimationFrame(callback);
        }
    }

    for (id in images) {
        let src = images[id];
        
        images[id] = new Image();
        images[id].addEventListener('load', checkLoaded);
        images[id].src = src;
    }
}
