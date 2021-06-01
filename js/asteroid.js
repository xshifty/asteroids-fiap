const ASTEROID_UP = 0;
const ASTEROID_DOWN = 1;
const ASTEROID_LEFT = 2;
const ASTEROID_RIGHT = 3;

function Asteroid(x, y) {
    this.x = x;
    this.y = y;
    this.direction = ASTEROID_DOWN;
    this.enabled = false;
    this.speed = .15;
    this.sprite = 1;
    this.sizeFactor = 35;
    this.hitbox = {sx: this.x, sy: this.y, dx: 0, dy: 0};
}

Asteroid.prototype.move = function (game) {
    if (this.enabled == false) {
        this.enabled = true;
        this.sprite = parseInt(Math.random() * 8) + 1;
        this.direction = [ASTEROID_UP, ASTEROID_DOWN, ASTEROID_LEFT, ASTEROID_RIGHT][parseInt(Math.random() * 4)];
        this.speed = (Math.random() * 1) + (game.scope.stage / 15);
        this.sizeFactor = parseInt(Math.random() *  25) + 10;
        
        this.x = parseInt(Math.random() * game.width);
        this.y = parseInt(Math.random() * game.height);

        if (this.direction == ASTEROID_UP) {
            this.y = game.height + (parseInt(Math.random() * 200) + 50);
        } else if (this.direction == ASTEROID_DOWN) {
            this.y = -(parseInt(Math.random() * 200) + 50);
        } else if (this.direction == ASTEROID_LEFT) {
            this.x = game.width + (parseInt(Math.random() * 200) + 50);
        } else if (this.direction == ASTEROID_RIGHT) {
            this.x = -(parseInt(Math.random() * 200) + 50);
        }
    }

    if (this.direction == ASTEROID_UP) {
        this.y = this.y - this.speed;

        if (this.y < -50) {
            this.enabled = false;
        }

        return this;
    }

    if (this.direction == ASTEROID_DOWN) {
        this.y = this.y + this.speed;

        if (this.y > game.height+50) {
            this.enabled = false;
        }

        return this;
    }

    if (this.direction == ASTEROID_LEFT) {
        this.x = this.x - this.speed;

        if (this.x < -50) {
            this.enabled = false;
        }

        return this;
    }

    if (this.direction == ASTEROID_RIGHT) {
        this.x = this.x + this.speed;

        if (this.x > game.width+50) {
            this.enabled = false;
        }

        return this;
    }
};

Asteroid.prototype.draw = function (game) {
    let sourceImage = game.getImage('ast' + this.sprite),
        renderWidth = parseInt(sourceImage.width/this.sizeFactor),
        renderHeight = parseInt(sourceImage.height/this.sizeFactor),
        hitToleranceX = renderWidth/7,
        hitToleranceY = renderHeight/7;

    this.hitbox = {
        sx: this.x + hitToleranceX,
        sy: this.y + hitToleranceY,
        dx: (renderWidth + this.x) - hitToleranceX,
        dy: (renderHeight + this.y) - hitToleranceY
    };
    
    game.context.drawImage(sourceImage, this.x, this.y, renderWidth, renderHeight);

    if (game.debug) {
        game.context.strokeStyle = 'green';
        game.context.strokeRect(this.hitbox.sx, this.hitbox.sy, this.hitbox.dx - this.hitbox.sx, this.hitbox.dy - this.hitbox.sy)
    }
}

Asteroid.prototype.loadImages = function (game) {
    for (let i = 1; i < 10; i++) {
        game.addImage('ast' + i, './assets/img/asteroid/ast' + i + '.png');
    }
};
