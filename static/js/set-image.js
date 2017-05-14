var recognizing = true;
var ignore_onend;
var start_timestamp;
var counter = 0;

var WIDTH = 5;
var HEIGTH = 5;

var sceneEl = document.querySelector('a-scene');
for (var i = 0; i < HEIGTH; i++) {
    for (var j = 0; j < WIDTH; j++) {
        var aBox = document.createElement('a-box');;
        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('color', 'white');
        aBox.setAttribute('material', 'opacity: 0');
        aBox.setAttribute('position', (-10+j*5).toString()+' '+(10-i*6).toString()+' 0');
        aBox.setAttribute('cursor-listener');

        sceneEl.appendChild(aBox);
    }
}

var activeBox = document.getElementById('myimg_1');

var recognition = new webkitSpeechRecognition();
setTimeout(function () {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();
}, 1000);

recognition.onstart = function() {
    recognizing = true;
};

recognition.onerror = function(event) {
if (event.error == 'no-speech') {
  console.log('no-speech');
//   showInfo('info_no_speech');
  ignore_onend = true;
}
if (event.error == 'audio-capture') {
 console.log('audio-capture');
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
};

recognition.onresult = function(event) {
    recognition.stop()
    setTimeout(function () {
        recognition.start()
    }, 1000);
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
            interim_transcript = event.results[i][0].transcript;
    }
    interim_transcript = capitalize(interim_transcript);
    // final_span.innerHTML = linebreak(final_transcript);

    console.log("SUCCESS RECOGNITION");
    var mykeyword = linebreak(interim_transcript);
    // console.log(mykeyword);
    if (mykeyword.search("right") > -1) {
        var sceneEl = document.querySelector('a-scene');
        var aBox = document.createElement('a-box');
        // document.querySelector('a-scene').outerHTML += '<a-box id="myimg_1" src="" depth="4" height="4" width="4" position="'+(counter*4).toString()+' 5 0" rotation="0 0 0"></a-box>';
        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('position', '5 '-(counter*6).toString()+' 0');

        sceneEl.appendChild(aBox);
        activeBox = aBox;
        counter += 1;

    }
    else if (mykeyword.search("left") > -1) {
        var sceneEl = document.querySelector('a-scene');
        var aBox = document.createElement('a-box');

        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('position', '5 '+(counter*6).toString()+' 0');

        sceneEl.appendChild(aBox);
        activeBox = aBox;
        counter += 1;
    }
    else if (mykeyword.search("up") > -1) {
        var sceneEl = document.querySelector('a-scene');
        var aBox = document.createElement('a-box');

        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('position', (counter*6).toString()+' 5 0');

        sceneEl.appendChild(aBox);
        activeBox = aBox;
        counter += 1;
    }

    else if (mykeyword.search("down") > -1 || mykeyword.search("Down") > -1) {
        var sceneEl = document.querySelector('a-scene');
        var aBox = document.createElement('a-box');

        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('position', (-counter*6).toString()+' 5 0');

        sceneEl.appendChild(aBox);
        activeBox = aBox;
        counter += 1;
    }


    else if (mykeyword.search("stop") > 1 || mykeyword.search("Stop") > 1) {
        recognition.stop();
        console.log("STOPPED");
    }

    else if (mykeyword.search("") > 1 || mykeyword.search("Stop") > 1) {
        recognition.stop();
        console.log("STOPPED");
    }

    else if (interim_transcript != "") {
        // console.log(interim_transcript);
        if (interim_transcript =="stop" || interim_transcript=="Stop" || interim_transcript ==" stop" ||interim_transcript ==" Stop") {
            recognition.stop();
            console.log("STOPPED");
        }
        voiceToImg(interim_transcript);
        interim_transcript = "";

    }

};

function voiceToImg(keyword) {
    if (keyword !="" && keyword !=" " && keyword !="  ") {
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
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","275d3e8ccd774773845fe08d8616030c ");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {

            activeBox.setAttribute('src', data.value[1].thumbnailUrl);
            activeBox.setAttribute('material', 'opacity: 1');

        })
        .fail(function() {
        });
    }
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


AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
    //   var randomIndex = Math.floor(Math.random() * COLORS.length);
    //   this.setAttribute('material', 'color', COLORS[randomIndex]);
      if (!activeBox.getAttribute('src')) {
          activeBox.setAttribute('material', 'opacity: 0');
      }
      activeBox = this;
      activeBox.setAttribute('material', 'opacity: 0.5');

      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});
