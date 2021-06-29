const grid = document.querySelector('.grid') //creating divs inside the grid class
const resultsDisplay=document.querySelector('.results')
let direction = 1
let ID
let aliensRemoved = []
let score=0

for (let i = 0; i < 225; i++) { //to create 225 (15^2) divs inside the grid
    const sq = document.createElement('div') //creates a div HTML element
    grid.appendChild(sq)
}

const squares = Array.from(document.querySelectorAll('.grid div')) //grid is parent, div is child, selects all divs in grid parent, make it array and store in squares
// console.log(grid.length)

const aliens = [ //positions of the aliens
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30,31,32,33,34,35,36,37,38,39
]
function draw() {
    for (let i = 0; i < aliens.length; i++){
        if (!aliensRemoved.includes(i)) //if aliensRemoved doesNOT include i, then only draw it
        {
            squares[aliens[i]].classList.add('invader') //adds a class 'invader' defined in css into divs created inside grid
        }
    }
}
function remove() {
    for (let i = 0; i < aliens.length; i++){
        squares[aliens[i]].classList.remove('invader') //remove the invaders
    }
}
draw()

//Drawing our shooter
let currentShooterIndex = 202;
squares[currentShooterIndex].classList.add('shooter') //adds class 'shooter'(defined in css) to one of the divs (in grid class) indexed at 202
let width = 15

function moveShooter(e) { //e is an event of using keys using keyboard

    squares[currentShooterIndex].classList.remove('shooter') //remover class 'shooter' before it was before
    switch (e.key) {  //key pressed in the event
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) { //width=15, if it leaves a remainder, then we can move left
                currentShooterIndex-=1
            }
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) { //width-1=14, then we can move to right
                currentShooterIndex+=1
            }
            break
    }
    // console.log(currentShooterIndex)
    squares[currentShooterIndex].classList.add('shooter') //redraw shooter at it's new place
}
document.addEventListener('keydown', moveShooter)

//Now move the invaders
function moveInvaders(e) {
    const leftEdge = aliens[0] % width === 0 //we are on left edge
    const rightEdge = aliens[aliens.length - 1] % width === width - 1 //we are on right edge
    remove() //remove invaders
    if (rightEdge && direction===1) { //move all the aliens down as one block
        for (let i = 0; i < aliens.length; i++){
            aliens[i] += width +1
            direction = -1 //it'll now move towards left
       }
    }
     if (leftEdge && direction === -1) { //move all the aliens down as one block
        for (let i = 0; i < aliens.length; i++){
            aliens[i] += width - 1
            direction = 1
       }
    }
    
    for (let i = 0; i < aliens.length; i++){
        aliens[i] += direction
    }
        
    draw()

    //GAME IS OVER IF THE ALIENS HIT THE SHOOTER OR THE LOWER BOUNDARY OF THE GRID

    //if the square(div inside grid) of shooter current_index contains the aliens (invader class)
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) { 
        // console.log('game over')
        resultsDisplay.innerHTML='GAME OVER'
        clearInterval(ID)
        
    }
    //if the square(div inside grid) of shooter current_index DOESNOT contain the aliens (invader class), but the aliens hit the border (lower boundary of grid)
    // console.log(aliens[i])
    for (let i = 0; i < aliens.length; i++) {
        if (aliens[i] > (squares.length )) { //squares.length is the number of divs inside the grid class
            console.log(aliens[i])
            resultsDisplay.innerHTML='GAME OVER'
            clearInterval(ID)
        }
    }
    //CHECK FOR A WIN
    if (aliensRemoved.length === aliens.length) //all aliens removed
    {
        resultsDisplay.innerHTML='YOU WON!!'
        clearInterval(ID)
    }
  
}

ID=setInterval(moveInvaders, 500) //putting a function on an interval of 100 ms

//THIS PART IS FOR SHOOTING THE ALIENS
function shoot(e) { //Event listener callback function
    let currentLaserIndex = currentShooterIndex
    let laserID
    function moveLaser() {
        // if (squares[currentLaserIndex].classList.contains('laser')) {
            squares[currentLaserIndex].classList.remove('laser') //remove laser class from current index
        // }
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser') //add laser class to updated laser index
        //Collision of laser and alien (if laser and alien are in same square)
        if (squares[currentLaserIndex].classList.contains('invader')) //COLLISION
        {
            squares[currentLaserIndex].classList.remove('laser') //remove laser class from current index
            squares[currentLaserIndex].classList.remove('invader') //remove the invader from current index
            squares[currentLaserIndex].classList.add('boom') //add a boom

            //Remove the boom after some time
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300) //remove the boom class after 300 ms
            clearInterval(laserID) //laser collides with the alien then disappear

            //Now get rid of the shot aliens,which need not to be drawn again
            const alienHit=aliens.indexOf(currentLaserIndex) //gives the index of the alien which is hit
            aliensRemoved.push(alienHit) //push that index (i) in the aliensRemoved array
            console.log(aliensRemoved)
            score++
            resultsDisplay.innerHTML = score
        }
    }
    
    switch (e.key) {
        case 'ArrowUp':
            laserID=setInterval(moveLaser, 200) //set the func in the interval of 200 ms
        break
    }
}

document.addEventListener('keydown', shoot)

