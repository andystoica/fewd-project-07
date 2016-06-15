/**
* Player elements
**/

var video = document.getElementById('video-screen');
var progressBar = document.getElementById('video-progress-bar');
var btnPlayPause = document.getElementById('btn-play-pause');
var btnMuteToggle = document.getElementById('btn-mute-toggle');
var btnFullScreen = document.getElementById('btn-full-screen');
var displayTime = document.getElementById('display-play-time');
var videoCaptions = document.getElementById('captions');




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

// Convert VTT time format string into number of seconds in float
function VttToSeconds(vttString) {
  var time   = vttString.split(":");
  var hours  = parseFloat(time[0]);
  var mins   = parseFloat(time[1]);
  var secs   = parseFloat(time[2].replace(",", "."));
  var output = hours * 3600 + mins * 60 + secs;

  return output;
}




/**
* Caption behavior
**/

// Renders the JSON data into appropriate HTML tags and
// populates the page
var renderCaptions = function(data) {
  var output = '<p>';

  for (var i = 0; i < data.length; i++) {
    if (data[i].hasOwnProperty('newParagraph')) {
      output += '</p><p>';
    }
    output += '<span id="caption' + data[i].index + '">';
    output += data[i].caption;
    output += '</span>';
  }

  output += '</p>';
  videoCaptions.innerHTML = output;
};


// Check if the caption is available for the specified time
var isCaptionTime = function(caption, timeStamp) {
  return VttToSeconds(caption.start) <= timeStamp && VttToSeconds(caption.end) >= timeStamp;
};


// Activates the correct caption for the specified time
// Iterates through all avaialable captions and activates the correct one if found
var activateCaption = function(data, time) {
  for (var i = 0; i < data.length; i++) {
    var span = document.getElementById('caption' + data[i].index);
    if (isCaptionTime(data[i], time)) {
      span.classList.add('active');
    } else {
      span.classList.remove('active');
    }
  }
};





/**
* Player behaviour
**/

// Initialise the video Player
var videoInit = function() {
  displayTime.innerHTML = formatTime(video.duration);
  renderCaptions(captions);
};

// Play / Pause behaviour
var videoPlaybackToggle = function() {
  if (video.paused) {
    video.play();
    btnPlayPause.classList.add('playing');
  } else {
    video.pause();
    btnPlayPause.classList.remove('playing');
  }

};


// Mute / Unmute behaviour
var videoMuteToggle = function() {
  if (!video.muted) {
    video.muted = true;
    btnMuteToggle.classList.add('muted');
  } else {
    video.muted = false;
    btnMuteToggle.classList.remove('muted');
  }

};


// Switched to full screen visualisation based on user agent
var videoFullScreen = function() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome & Safari
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  }
};


// Progress bar updates
var videoUpdateProgress = function() {
  progressBar.value = Math.round(video.currentTime / video.duration * 100);
  displayTime.innerHTML = formatTime(video.currentTime) + " / " + formatTime(video.duration);
  activateCaption(captions, video.currentTime);
};


// Video seek jumps to a percentage value passed as the argument
var videoSeek = function(clickValue) {
  video.currentTime = clickValue / 100 * video.duration;
  if (video.paused) {
    video.play();
    btnPlayPause.classList.add('playing');
  }
};




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
