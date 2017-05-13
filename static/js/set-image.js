/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    src: {type: 'string'},
    dur: {type: 'number', default: 300}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    this.setupFadeAnimation();

    el.addEventListener(data.on, function () {
      // Fade out image.
      data.target.emit('set-image-fade');
      // Wait for fade to complete.
      setTimeout(function () {
        // Set image.
        data.target.setAttribute('material', 'src', data.src);
      }, data.dur);
    });
  },

  /**
   * Setup fade-in + fade-out.
   */
  setupFadeAnimation: function () {
    var data = this.data;
    var targetEl = this.data.target;

    // Only set up once.
    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    // Create animation.
    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur,
      from: '#FFF',
      to: '#000'
    });
  }
});


// showInfo('info_start');

var final_transcript = '';
var recognizing = true;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  // start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    // showInfo('info_speak_now');
    start_img.src = '../static/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = '../static/mic.gif';
    //   showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = '../static/mic.gif';
    //   showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        // showInfo('info_blocked');
      } else {
        // showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = '../static/mic.gif';
    if (!final_transcript) {
    //   showInfo('info_start');
      return;
    }
    // showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    console.log("SUCCESS RECOGNITION");
    var mykeyword = linebreak(final_transcript);
    if (mykeyword =="start" || mykeyword=="Start") {
        var sceneEl = document.querySelector('a-scene');
        console.log(sceneEl.querySelector('#mytext'));

    }
    voiceToImg(mykeyword);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };
}

function voiceToImg(keyword) {
    var params = {
        // Request parameters
        "q": keyword,
    };
    console.log(keyword);

    $.ajax({
        url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","multipart/form-data");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","d6a5a84f44df4a2895c50d0dd5f1464e");
        },
        type: "POST",
        // Request body
        data: "{body}",
    })
    .done(function(data) {
        // alert("success");
        console.log(data.value[1].contentUrl);
        document.getElementById("myimg_1").src = data.value[1].contentUrl;
        document.getElementById("myimg_2").src = data.value[2].contentUrl;
        document.getElementById("myimg_3").src = data.value[3].contentUrl;
    })
    .fail(function() {
        // alert("error");
    });
}

function upgrade() {
  // start_button.style.visibility = 'hidden';
  // showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-US';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  // showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

// function showInfo(s) {
//   if (s) {
//     for (var child = info.firstChild; child; child = child.nextSibling) {
//       if (child.style) {
//         child.style.display = child.id == s ? 'inline' : 'none';
//       }
//     }
//     info.style.visibility = 'visible';
//   } else {
//     info.style.visibility = 'hidden';
//   }
// }

myimg_1.onclick = function() {
    var imgsrc = document.getElementById("myimg_1").src;
    document.getElementById("final_img").src = imgsrc;
    document.getElementById("img_results").style.display = "none";

    // alert( 'Спасибо 1' );
  };
myimg_2.onclick = function() {
    var imgsrc = document.getElementById("myimg_2").src;
    document.getElementById("final_img").src = imgsrc;
    document.getElementById("img_results").style.display = "none";

  // alert( 'Спасибо 2' );
};
myimg_3.onclick = function() {
    var imgsrc = document.getElementById("myimg_3").src;
    document.getElementById("final_img").src = imgsrc;
    document.getElementById("img_results").style.display = "none";

  // alert( 'Спасибо 3' );
};
