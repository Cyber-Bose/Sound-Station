let currentsong = new Audio;
let currentSongIndex = -1; // Initialize to -1 to indicate no song is playing initially

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

const playMusic = (track, index) => {
    currentsong.src = "/Spotify%20Clone/songs/" + track;
    currentsong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00 ";
    currentSongIndex = index; // Update the current song index
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songsUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const [index, song] of songs.entries()) {
        songsUL.innerHTML += `<li>
                            <img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Artist </div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play-button-svgrepo-com.svg" alt="play">
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim(), index);
        });
    });

    // Play/Pause Button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";
        } else {
            currentsong.pause();
            play.src = "img/play_chatgpt.svg";
        }
    });

    // Previous Button
    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            playMusic(songs[currentSongIndex - 1], currentSongIndex - 1);
        }
    });

    // Next Button
    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            playMusic(songs[currentSongIndex + 1], currentSongIndex + 1);
        }
    });

    // Time Update Listener
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    });

    // Hamburger Menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Close Button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
}

main();
