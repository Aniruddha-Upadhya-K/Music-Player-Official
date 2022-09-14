var lastPlayed, count = 0, audio, audioCopy, loopCondition = 0, clickCount = 0, audioOnClick, audioChangeDetector

const play = document.querySelector(".play")
const pause = document.querySelector(".pause")
const stop = document.querySelector(".stop")
const loop = document.querySelector(".loopIcon")
const replay = document.querySelector(".replay")

const song = document.querySelectorAll(".song")
const key = document.querySelectorAll(".key")
const detail = document.querySelectorAll(".detail")

const controller = document.querySelector(".controller")
const backgroundBar = document.querySelector(".backgroundBar")
const playBar = document.querySelector(".playBar")
const playTime = document.querySelector(".playTime")
const endTime = document.querySelector(".endTime")


var animationId

window.addEventListener("keydown", function (e) {
    count++
    if(count == 1)
        firstTime(e)
    else
        laterOn(e)
})

function firstTime(e) {
    audioCopy = document.querySelector(`audio[data-key="${e.key}"]`)
    if(!audioCopy) 
    {
        count = 0
        return;
    }
    audio = audioCopy

    for(let i=0; i<song.length; i++)
    {
        song[i].classList.add("songOnStart")
    }

    audio.currentTime = "0"
    audio.play()
    playBarAnimation()

    play.style.display = "none"
    replay.style.display = "none"
    pause.style.display = "block"
    lastPlayed = e.key
    audioChangeDetector = lastPlayed
    controller.classList.add("controllerOnStart")
}

function laterOn(e) {
    audioCopy = document.querySelector(`audio[data-key="${e.key}"]`)
    if(!audioCopy) 
        return;

    audio = audioCopy

    if (e.key == lastPlayed)
    {
        if(audio.paused)
            {
                audio.play()

                play.style.display = "none"
                replay.style.display = "none"
                pause.style.display = "block"
            }
        else
            {
                audio.pause()
                pause.style.display = "none"
                replay.style.display = "none"
                play.style.display = "block"
            }
    }
    else
    {
        document.querySelector(`audio[data-key="${lastPlayed}"]`).pause()
        audio.currentTime = "0"
        audio.play()
        
        pause.style.display = "block"
        replay.style.display = "none"
        play.style.display = "none"
    }
    audioChangeDetector = lastPlayed
    lastPlayed = e.key
}

function playBtn() {
    audio.play()
    play.style.display = "none"
    pause.style.display = "block"
}

function pauseBtn() {
    audio.pause()
    pause.style.display = "none"
    play.style.display = "block"
}

function switchToReplay() {
    play.style.display = "none"
    pause.style.display = "none"
    replay.style.display = "block"
}

function replayBtn() {
    audio.currentTime = "0"
    pause.style.display = "block"
    play.style.display = "none"
    replay.style.display = "none"
    audio.play()
}
 
function loopBtn() {
    if (!loopCondition)
    {
        loopCondition = 1
        loop.style.color = "rgb(84, 60, 219)"
    }   
    else
    {
        loopCondition = 0
        loop.style.color = "rgb(156, 166, 221)"
    }
}

function stopBtn() {
    audio.pause()

    clearInterval(animationId)

    song[audio.dataset.key - 1].classList.remove("playingSong")
    detail[audio.dataset.key - 1].classList.remove("playingSongDetail")
    key[audio.dataset.key - 1].classList.remove("playingSongKey")
    
    audio = null

    count = 0

    controller.classList.add("controllerOnEnd")

    setTimeout(function() {
        controller.classList.remove("controllerOnStart")
        controller.classList.remove("controllerOnEnd")
    }, 1000)
}

function playBarAnimation() {
    var currentTime, totalTime, timeCount = 0, audioBackup = audio
    
    var audioDataset = audio.dataset.key - 1

    animationId = setInterval(animation, 10)

    function animation() {
        currentTime = audio.currentTime
        totalTime = audio.duration
        var playBarPos = (100 - (currentTime * 100 / totalTime)) + "%"
        playBar.style.transform = `translate(-${playBarPos})`

        
        if (audio == audioBackup)
        {
            if (timeCount % 100 == 0) 
            {
                playTime.innerHTML = minCalculator(currentTime)
            }

            timeCount += 1
        }
        else 
        {
            playTime.innerHTML = minCalculator(currentTime)
            timeCount = 0
            // song[audioDataset].classList.remove("playingSong")
        }

        endTime.innerHTML = minCalculator(totalTime)

        audioBackup = audio

        if(audio.paused)
        {
            pause.style.display = "none"
            play.style.display = "inline"
            replay.style.display = "none"
        }
        else
        {
            pause.style.display = "inline"
            play.style.display = "none"
            replay.style.display = "none"
        }

        if(loopCondition == 1)
        {
            if (audio.ended)
            {
                audio.currentTime = "0"
                audio.play()
            }
        }
        else
        {
            if (audio.ended)
            {
                switchToReplay() 
            }
        }

        

        if(audioDataset != (audioChangeDetector - 1))
        {
            song[audioChangeDetector - 1].classList.remove("playingSong")
            detail[audioChangeDetector - 1].classList.remove("playingSongDetail")
            key[audioChangeDetector - 1].classList.remove("playingSongKey")

            audioChangeDetector = audioDataset + 1
        }

        audioDataset = audio.dataset.key - 1
        song[audioDataset].classList.add("playingSong")
        detail[audioDataset].classList.add("playingSongDetail")
        key[audioDataset].classList.add("playingSongKey")

    }
}

function minCalculator(t) {
    var timeSec = Math.floor(t)
    var timeMin = Math.floor(timeSec / 60)
    timeSec = timeSec % 60
    timeSec = `${timeSec}`
    timeMin = `${timeMin}`
    timeSec = timeSec.padStart(2, "0")
    timeMin = timeMin.padStart(2, "0")
    return timeMin + " : " + timeSec
}

for(let i=0; i<song.length; i++)
{
    song[i].addEventListener("click", function (e) {clickDiv(e)})
    key[i].addEventListener("click", function (e) {clickChild(e)})
    detail[i].addEventListener("click",function (e) {clickChild(e)})
}

function clickDiv (e) {
    let songDataset = e.composedPath()[0].dataset.key
    if (songDataset)
    {
        audioOnClick = document.querySelector(`audio[data-key="${songDataset}"]`)

        if(!audio)
        {
            controller.classList.add("controllerOnStart")
            audio = audioOnClick
            audio.currentTime = "0"
            audio.play()
            count++
            for(let i=0; i<song.length; i++)
            {
                song[i].classList.add("songOnStart")
            }
            audioChangeDetector = songDataset

            lastPlayed = songDataset

            playBarAnimation()
        }
        else if(songDataset == lastPlayed)
        {
            if(audioOnClick.paused)
            {
                audioOnClick.play()
            }
            else
            {
                audioOnClick.pause()
            }
        }
        else
        {
            audio.pause()
            audio.currentTime = "0"
            audio = audioOnClick
            audio.currentTime = "0"
            audio.play()
        }
        audio = audioOnClick
        audioChangeDetector = lastPlayed
        lastPlayed = songDataset
    }
}
function clickChild (e) {
    let songDataset = e.composedPath()[1].dataset.key
    audioOnClick = document.querySelector(`audio[data-key="${songDataset}"]`)

    if(!audio)
        {
            controller.classList.add("controllerOnStart")
            audio = audioOnClick
            audio.currentTime = "0"
            audio.play()
            count++
            for(let i=0; i<song.length; i++)
            {
                song[i].classList.add("songOnStart")
            }
            audioChangeDetector = songDataset

            lastPlayed = songDataset

            playBarAnimation()
        }
        else if(songDataset == lastPlayed)
        {
            if(audioOnClick.paused)
            {
                audioOnClick.play()
            }
            else
            {
                audioOnClick.pause()
            }
        }
        else
        {
            audio.pause()
            audio.currentTime = "0"
            audio = audioOnClick
            audio.currentTime = "0"
            audio.play()
        }
        audio = audioOnClick
        audioChangeDetector = lastPlayed
        lastPlayed = songDataset
}