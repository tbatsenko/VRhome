var recognizing = true;
var ignore_onend;
var start_timestamp;
var counter = 0;

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
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
            interim_transcript = event.results[i][0].transcript;
    }
    interim_transcript = capitalize(interim_transcript);
    // final_span.innerHTML = linebreak(final_transcript);

    console.log("SUCCESS RECOGNITION");
    var mykeyword = linebreak(interim_transcript);
    // console.log(mykeyword);
    if (mykeyword.search("left") > -1 || mykeyword.search("left") > -1 || mykeyword.search(" add left ") > -1) {
        var groupObject3Dl = document.querySelector('a-scene').object3D;
        console.log(groupObject3D.children);
        groupObject3Dl.children += '<a-box id="myimg_1" src="" depth="4" height="4" width="4" position="'+(counter*4).toString()+' -5 0" rotation="0 0 0"></a-box>';
        // document.querySelector('a-scene').outerHTML += '<a-box id="myimg_1" src="" depth="4" height="4" width="4" position="'+(counter*4).toString()+' 5 0" rotation="0 0 0"></a-box>';
        console.log("ADDED add OBJECTs LEFT");
        counter +=1;

    }
    else if (mykeyword.search("right") > -1 || mykeyword.search("right") > -1 || mykeyword.search("right ") > -1) {
        var sceneEl = document.querySelector('a-scene');
        var aBox = document.createElement('a-box');

        aBox.setAttribute('id', 'myimg_1');
        aBox.setAttribute('depth', '4');
        aBox.setAttribute('width', '4');
        aBox.setAttribute('height', '4');
        aBox.setAttribute('position', (counter*4).toString()+' 5 0');

        sceneEl.appendChild(aBox);


        //
        // var groupObject3D = document.querySelector('a-scene').object3D;
        // console.log(groupObject3D.children);
        // groupObject3D.children += '<a-box id="myimg_1" src="" depth="4" height="4" width="4" position="'+(counter*4).toString()+' -5 0" rotation="0 0 0"></a-box>';
        // // document.querySelector('a-scene').innerHTML += '<a-box id="myimg_1" src="" depth="4" height="4" width="4" position="'+(counter*4).toString()+' -5 0" rotation="0 0 0"></a-box>';
        // console.log("ADDED add OBJECTs");
        // counter +=1;
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
        voiceToImg(interim_transcript);
        document.querySelector('a-text').outerHTML='<a-text id="mytext" class="mytext" color="black" value="'+interim_transcript+'" position="" rotation="" scale="" visible="" text=""></a-text>';
        if (interim_transcript =="stop" || interim_transcript=="Stop" || interim_transcript ==" stop" ||interim_transcript ==" Stop") {
            recognition.stop();
            console.log("STOPPED");

        }
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
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","30694fad9f894cba94309183dbb62186");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {

            var img = document.getElementById('myimg_1');
            img.setAttribute('src', data.value[1].thumbnailUrl);

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
