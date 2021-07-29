document.addEventListener('DOMContentLoaded', (e) => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');

    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimeId;
    let downTimeId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimeId;
    let rightTimeId;
    let score = 0;


    function createDoodler() {
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = `${doodlerLeftSpace}px`;
        doodler.style.bottom = `${doodlerBottomSpace}px`;
        grid.appendChild(doodler);
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = `${this.left}px`;
            visual.style.bottom = `${this.bottom}px`;
            grid.appendChild(visual);
        }
    }

    function createPlatform() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatform() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.remove();
                    platforms.shift(platforms);
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                    // console.log(platforms);

                }
            });
        }
    }

    function jump() {
        clearInterval(downTimeId);
        isJumping = true;
        upTimeId = setInterval(() => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
                isJumping = false;
            }
        }, 30);
    }

    function fall() {
        isJumping = false;
        clearInterval(upTimeId);
        downTimeId = setInterval(() => {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if ((doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    (doodlerLeftSpace + 60 >= platform.left) &&
                    (doodlerLeftSpace <= platform.left + 85) &&
                    (!isJumping)) {
                    console.log('tick');
                    startPoint = doodlerBottomSpace;
                    console.log('start', startPoint);
                    jump();
                    isJumping =true;
                }
            })
        }, 30);
    }

    function gameOver() {
        console.log('Game Over!');
        isGameOver = true;

        while (grid.firstChild){
            console.log('remove');
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = score;
        clearInterval(upTimeId);
        clearInterval(downTimeId);
        clearInterval(leftTimeId);
        clearInterval(rightTimeId);
    }

    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (e.key === 'ArrowLeft') {
            moveLeft();
        }
        else if (e.key === 'ArrowRight') {
            moveRight();
        }
        else if (e.key === 'ArrowUp') {
            moveStraight();
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimeId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimeId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveRight();
            }
        }, 30);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimeId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimeId = setInterval(() => {
            if (doodlerLeftSpace <= 313) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else {
                moveLeft();
            }
        }, 30)
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(rightTimeId);
        clearInterval(leftTimeId);
    }

    function start() {
        if (!isGameOver) {
            createPlatform();
            createDoodler();
            setInterval(movePlatform, 30);
            jump();
            document.addEventListener('keydown', (e)=>{
                control(e);
            })
        }
    }

    start();
});