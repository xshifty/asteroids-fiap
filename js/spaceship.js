const SPACESHIP_UP = 0;
const SPACESHIP_DOWN = 1;
const SPACESHIP_LEFT = 2;
const SPACESHIP_RIGHT = 3;

function Spaceship(x, y) {
    this.id = 'spaceship';
    this.x = x;
    this.y = y;
    this.direction = SPACESHIP_UP;
    this.hitbox = {sx: 0, sy: 0, dx: 0, dy: 0};
}

Spaceship.prototype.moveUp = function () {
    this.direction = SPACESHIP_UP;
    this.y -= 15;
};

Spaceship.prototype.moveDown = function () {
    this.direction = SPACESHIP_DOWN;
    this.y += 15;
};

Spaceship.prototype.moveLeft = function () {
    this.direction = SPACESHIP_LEFT;
    this.x -= 15;
};

Spaceship.prototype.moveRight = function () {
    this.direction = SPACESHIP_RIGHT;
    this.x += 15;
};

Spaceship.prototype.loadImages = function (game) {
    game.addImage(this.id + SPACESHIP_UP, './assets/img/spaceship/up.png');
    game.addImage(this.id + SPACESHIP_DOWN, './assets/img/spaceship/down.png');
    game.addImage(this.id + SPACESHIP_LEFT, './assets/img/spaceship/left.png');
    game.addImage(this.id + SPACESHIP_RIGHT, './assets/img/spaceship/right.png');
};

Spaceship.prototype.draw = function (game) {
    let sourceImage = game.getImage(this.id + this.direction),
        renderWidth = parseInt(sourceImage.width/4),
        renderHeight = parseInt(sourceImage.height/4);

        this.hitbox = {sx: this.x, sy: this.y, dx: this.x + renderWidth, dy: this.y + renderHeight};

    if (this.x > game.width) {
        this.x = 0;
    }

    if (this.y > game.height) {
        this.y = 0;
    }

    if (this.x+renderWidth < 0) {
        this.x = game.width - renderWidth;
    }

    if (this.y+renderHeight < 0) {
        this.y = game.height - renderHeight;
    }

    game.context.drawImage(sourceImage, this.x, this.y, renderWidth, renderHeight);
    
    this.hitbox = {sx: this.x, sy: this.y, dx: this.x+renderWidth, dy: this.y+renderHeight};

    if (game.debug) {
        game.context.strokeStyle = 'red';
        game.context.strokeRect(this.hitbox.sx, this.hitbox.sy, this.hitbox.dx - this.hitbox.sx, this.hitbox.dy - this.hitbox.sy)
    }
    
    if (this.x+renderWidth > game.width) {
        game.context.drawImage(sourceImage, this.x - game.width, this.y, renderWidth, renderHeight);
    }

    if (this.y+renderHeight > game.height) {
        game.context.drawImage(sourceImage, this.x, this.y - game.height, renderWidth, renderHeight);
    }

    if (this.x < 0) {
        game.context.drawImage(sourceImage, game.width + this.x, this.y, renderWidth, renderHeight);
    }

    if (this.y < 0) {
        game.context.drawImage(sourceImage, this.x, game.height + this.y, renderWidth, renderHeight);
    }
};
