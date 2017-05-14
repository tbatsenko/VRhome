var final_transcript = '';
var recognizing = true;
var ignore_onend;
var start_timestamp;

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.start();

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
        if (event.results[i].isFinal) {
            final_transcript = event.results[i][0].transcript;
        } else {
            interim_transcript = event.results[i][0].transcript;
        }
    }
    final_transcript = capitalize(final_transcript);
    // final_span.innerHTML = linebreak(final_transcript);

    console.log("SUCCESS RECOGNITION");
    var mykeyword = linebreak(final_transcript);
    console.log(mykeyword);
    if (mykeyword =="start" || mykeyword=="Start") {
        recognition.start();
        console.log("STARTED");
    }
    if (mykeyword =="stop" || mykeyword=="Stop") {
        recognition.stop();
        console.log("STOPPED");
    }
// voiceToImg(mykeyword);
    // interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
//   showButtons('inline-block');
        console.log(final_transcript);
        console.log(interim_transcript);
        voiceToImg(final_transcript);
    //"<a-text id="mytext" value="Say: Hello World! to start" position="" rotation="" scale="" visible="" text=""></a-text>"
    //id="mytext" class="mytext" value="Say: Hello World! to start"  position="3 -1 -4"
        document.querySelector('a-text').outerHTML='<a-text id="mytext" class="mytext" color="black" value="'+interim_transcript+'" position="" rotation="" scale="" visible="" text=""></a-text>'
        if (interim_transcript =="stop" || interim_transcript=="Stop" || interim_transcript ==" stop" ||interim_transcript ==" Stop") {
            recognition.stop();
            // var sceneEl = document.querySelector('a-scene');
        // sceneEl.querySelector('#mytext').outerHTML='<a-text id="mytext" value="{{interim_transcript}}" position="" rotation="" scale="" visible="" text=""></a-text>';
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
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","d6a5a84f44df4a2895c50d0dd5f1464e");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            // alert("success");
            console.log(data.value[1].contentUrl);
            var img = document.getElementById('myimg_1');
            img.setAttribute('src', data.value[1].contentUrl);

            img = document.getElementById('myimg_2');
            img.setAttribute('src', data.value[2].contentUrl);

            var img = document.getElementById('myimg_3');
            img.setAttribute('src', data.value[3].contentUrl);
            // document.getElementById("myimg_1").src = data.value[1].contentUrl;
            // document.getElementById("myimg_1").src.replace(/s([01]?[0-5]?[0-9]?[0-9]|1600)[^0-9]/, "s726");
            //
            // document.getElementById("myimg_2").src = data.value[2].contentUrl;
            // document.getElementById("myimg_3").src = data.value[3].contentUrl;
        })
        .fail(function() {
            // alert("error");
        });
    }
}
// }
// document.querySelector('#cube').addEventListener('click', function () {
// this.setAttribute('material', 'color', 'red');
// console.log('I was clicked!');
// });
// function voiceToImg(keyword) {
//     var params = {
//         // Request parameters
//         "q": keyword,
//     };
//     console.log(keyword);
//
//     $.ajax({
//         url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
//         beforeSend: function(xhrObj){
//             // Request headers
//             xhrObj.setRequestHeader("Content-Type","multipart/form-data");
//             xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","d6a5a84f44df4a2895c50d0dd5f1464e");
//         },
//         type: "POST",
//         // Request body
//         data: "{body}",
//     })
//     .done(function(data) {
//         // alert("success");
//         console.log(data.value[1].contentUrl);
//         document.getElementById("myimg_1").src = data.value[1].contentUrl;
//         document.getElementById("myimg_2").src = data.value[2].contentUrl;
//         document.getElementById("myimg_3").src = data.value[3].contentUrl;
//     })
//     .fail(function() {
//         // alert("error");
//     });
// }

// function upgrade() {
  // start_button.style.visibility = 'hidden';
  // showInfo('info_upgrade');
// }

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
  // final_span.innerHTML = '';
  // interim_span.innerHTML = '';
  // start_img.src = 'mic-slash.gif';
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
//
// myimg_1.onclick = function() {
//     var imgsrc = document.getElementById("myimg_1").src;
//     document.getElementById("final_img").src = imgsrc;
//     document.getElementById("img_results").style.display = "none";
//
//     // alert( 'Спасибо 1' );
//   };
// myimg_2.onclick = function() {
//     var imgsrc = document.getElementById("myimg_2").src;
//     document.getElementById("final_img").src = imgsrc;
//     document.getElementById("img_results").style.display = "none";
//
//   // alert( 'Спасибо 2' );
// };
// myimg_3.onclick = function() {
//     var imgsrc = document.getElementById("myimg_3").src;
//     document.getElementById("final_img").src = imgsrc;
//     document.getElementById("img_results").style.display = "none";
//
//   // alert( 'Спасибо 3' );
// };
