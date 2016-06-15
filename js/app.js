/**
* Player elements
**/

var video = document.getElementById('video-screen');
var progressBar = document.getElementById('video-progress-bar');
var btnPlayPause = document.getElementById('btn-play-pause');
var btnMuteToggle = document.getElementById('btn-mute-toggle');
var btnFullScreen = document.getElementById('btn-full-screen');
var displayTime = document.getElementById('display-play-time');



/**
* Helper functions
**/

// Format a number of seconds into a mm:ss string
function formatTime(totalSeconds) {
  var mins = Math.floor((totalSeconds / 60) % 60);
  var secs = Math.floor(totalSeconds % 60);
  var output = (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);

  return output;
}



/**
* Player behaviour
**/

// Initialise the video Player
var videoInit = function() {
  displayTime.innerHTML = formatTime(video.duration);
}

// Play / Pause behaviour
var videoPlaybackToggle = function() {
  if (video.paused) {
    video.play();
    btnPlayPause.classList.add('playing');
  } else {
    video.pause();
    btnPlayPause.classList.remove('playing');
  }

}


// Mute / Unmute behaviour
var videoMuteToggle = function() {
  if (!video.muted) {
    video.muted = true;
    btnMuteToggle.classList.add('muted');
  } else {
    video.muted = false;
    btnMuteToggle.classList.remove('muted');
  }

}


// Switched to full screen visualisation based on user agent
var videoFullScreen = function() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome & Safari
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  }
}


// Progress bar updates
var videoUpdateProgress = function() {
  progressBar.value = Math.round(video.currentTime / video.duration * 100);
  displayTime.innerHTML = formatTime(video.currentTime) + " / " + formatTime(video.duration);
}


// Video seek jumps to a percentage value passed as the argument
var videoSeek = function(clickValue) {
  console.log(clickValue);
  video.currentTime = clickValue / 100 * video.duration;
  if (video.paused) {
    video.play();
    btnPlayPause.classList.add('playing');
  }
}



/**
* Event binding
**/

// Control buttons
btnPlayPause.addEventListener('click', videoPlaybackToggle);
btnMuteToggle.addEventListener('click', videoMuteToggle);
btnFullScreen.addEventListener('click', videoFullScreen);


// Progress bar
progressBar.addEventListener('click', function(e) {
  var clickValue = Math.round(e.offsetX / this.offsetWidth * 100);
  videoSeek(clickValue);
});


// Video playback
video.addEventListener('timeupdate', videoUpdateProgress);


// Application start
var initTimer = setInterval(function(){
  if (video.readyState > 0) {
    videoInit();
    clearInterval(initTimer);
  }
}, 100);
