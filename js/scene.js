function SceneManager() {
    this.scenes = {
        empty: function () {},
    };
    this.currentScene = 'empty';
}

SceneManager.prototype.registerScene = function (id, callback) {
    if (id in this.scenes) {
        throw('Scene already registered.');
    }

    this.scenes[id] = callback;
};

SceneManager.prototype.changeScene = function (id) {
    if (!id in this.scenes) {
        throw('Scene not found.');
    }

    this.currentScene = id;
};

SceneManager.prototype.play = function (game) {
    return this.scenes[this.currentScene](game);
};
