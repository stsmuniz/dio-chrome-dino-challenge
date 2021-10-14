const dino = document.querySelector('.dino')
const background = document.querySelector('.background')
const startButton = document.querySelector('#start-game')
const scoreText = document.getElementById('score')
const hiScoreText = document.getElementById('hi-score')
const jumpSound = new Audio('assets/sounds/assets_jump.m4a')
const hitSound = new Audio('assets/sounds/assets_hit.m4a')
const reachSound = new Audio('assets/sounds/assets_reach.m4a')
let isJumping = false
let posY = 0
let score = 0
let hiScore = 0
let state = 'game-init'

function handleKeyUp(event) {
    if ((event.keyCode === 32 || event.keyCode == 38) && !isJumping && state === 'game-started') {
        jump()
    } else {
        gameStart()
    }
}

function jump() {
    isJumping = true
    jumpSound.play()
    const jumpSpeed = 12
    let upInterval = setInterval(() => {
        if (posY >= 150) {
            clearInterval(upInterval)
            let downInterval = setInterval(() => {
                if (posY <= 0) {
                    clearInterval(downInterval)
                    isJumping = false
                } else {
                    posY -= jumpSpeed
                    if (state === 'game-started')
                        dino.style.bottom = posY + 'px'
                }
            }, 20)
        } else {
            posY += jumpSpeed
            if (state === 'game-started')
                dino.style.bottom = posY + 'px'
        }
    }, 20)
}

function createCactus() {
    if (state === 'game-started') {
        const cactus = document.createElement('div')
        let cactusPosX = 1000
        let randomTime = (Math.random() * 3000) + 500
        let currentCacutPosX = 1000

        cactus.classList.add('cactus')
        cactus.style.left = cactusPosX + 'px'
        background.appendChild(cactus)

        let leftInterval = setInterval(() => {
            
            if (state === 'game-started') {
                cactusPosX -= 10 + score/100
                cactus.style.left = cactusPosX + 'px'
                currentCactusPosX = cactus.style.left.replace('px', '')
            }

            if (cactusPosX <= -60) {
                clearInterval(leftInterval)
                background.removeChild(cactus)
            } 
            
            if (cactus && (currentCactusPosX > 0 && currentCactusPosX < 54) && posY < 60) {
                gameOver()
                clearInterval(leftInterval)
            }
        }, 20)

        if (state === 'game-started')
            setTimeout(createCactus, randomTime)
    }
}

function gameOver() {
    if (state == 'game-started') {
        state = 'game-over'
        hitSound.play()
        const gameOverMessage = document.createElement('h1')
        gameOverMessage.classList.add('game-over-message')
        gameOverMessage.innerText = "Game Over"
        startButton.classList.remove('hidden')
        background.classList.remove('game-started')
        dino.classList.remove('run')
        dino.classList.add('hurt')
        background.appendChild(gameOverMessage)
        hiScore = score > hiScore ? score : hiScore
        hiScoreText.innerText = hiScore
        if (hiScore > 0) {
            hiScoreText.parentElement.classList.remove('hidden')
        }
    }
}

function updateScore() {
    if (state == 'game-started') {
        score += 1
        scoreText.innerText = score
        if (score % 100 === 0) {
            reachSound.play()
        }
        setTimeout(updateScore, 75)
    }
}

function resetGame() {
    score = 0
    posY = 0
    dino.style.bottom = posY
    dino.classList.remove('hurt')
    startButton.classList.add('hidden')
}


function gameStart() {
    if (state != 'game-started') {
        const cactuses = document.querySelectorAll('.cactus')
        const gameOverMessage = document.querySelector('.game-over-message')

        resetGame()
        
        state = 'game-started'
        background.classList.add('game-started')
        dino.classList.add('run')

        if (cactuses.length > 0)
            cactuses.forEach(e => e.remove());
        
        if (gameOverMessage)
            gameOverMessage.remove();

        document.addEventListener("keydown", handleKeyUp)
        document.addEventListener("touchstart", handleKeyUp)
        createCactus()
        updateScore()
    }
}

startButton.addEventListener("click", gameStart)
document.addEventListener("keydown", handleKeyUp)