
var file_pattern = "sharkle_XX_1_0000";
var idle_frames = [
    "resources/black/" + file_pattern.replace("XX","idle") +  "0.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "1.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "2.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "3.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "4.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "5.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "6.png",
    "resources/black/" + file_pattern.replace("XX","idle") +  "7.png",
  ];

var hello_frames = [
      "resources/black/" + file_pattern.replace("XX","hello") +  "0.png",
      "resources/black/" + file_pattern.replace("XX","hello") +  "1.png",
      "resources/black/" + file_pattern.replace("XX","hello") +  "2.png",
      "resources/black/" + file_pattern.replace("XX","hello") +  "3.png",
    ];

var greetings = [
  "resources/greeting-00.wav",
  "resources/greeting-01.wav",
  "resources/greeting-02.wav",
  "resources/greeting-03.wav",
  "resources/greeting-04.wav",
  "resources/greeting-05.wav",
  "resources/greeting-06.wav",
  "resources/greeting-07.wav",
];

var speech = [
  "resources/black/sharkle_talk_sharkle1_00000.png",
  "resources/black/sharkle_talk_sharkle1_00001.png",
]

var main_loop = null;
var talking = null;
var sayHello = false;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var getNextIdleFrame = (function(){
  var next = 0;
  return function() {
    var rv = idle_frames[next];
    next = (next + 1) % idle_frames.length;
    return rv;
  }
})();

var getNextGreeting = (function(){
  var next = 0;
  return function() {
    var rv = greetings[next];
    next = (next + 1) % greetings.length;
    return rv;
  }
})();

var getNextHelloFrame = (function(){
  var next = 0;
  return function() {
    var rv = hello_frames[next];
    next = (next + 1) % hello_frames.length;
    return rv;
  }
})();

var getNextBubble = (function(){
  var next = 0;
  return function() {
    var rv = speech[next];
    next = (next + 1) % speech.length;
    return rv;
  }
})();


function animateIdle(){
  document.getElementById('sharkle').src = getNextIdleFrame();
}

function greetingFinished(){
  next = getNextGreeting();
  //console.log(next);
  document.getElementById('greeter').src = next
  stopSpeaking();
}

function speak(){
  document.getElementById('bubble').style.display = 'block';
  talking = setInterval(function(){
    document.getElementById('bubble').src = getNextBubble();
  },200);
}

function stopSpeaking(){
  clearInterval(talking);
  document.getElementById('bubble').style.display = 'none';

}

function animateHello(event){
  clearInterval(main_loop);
  if (!sayHello) {
    //console.log("Saying Hello");
    document.getElementById('greeter').play();
    sayHello = true;
    hello_clock = setInterval(function(){
        event.srcElement.src = getNextHelloFrame();
    },100);
    setTimeout(function(){
        clearInterval(hello_clock);
        sayHello = false;
        main_loop = setInterval(animateIdle,100);
      }, hello_frames.length * 2 * 100);
  }

}

function startSharkle(){

  // Load up frames in to array

  // Draw First Frame
  first_frame = idle_frames[0]
  first_greeting = greetings[0]
  first_talk = speech[0]

  document.write("<img id=\"bubble\" src=\"" + first_talk + "\" style=\"display:none;\"><img id=\"sharkle\" src=\"" + first_frame + "\"><audio id=\"greeter\" src=\"" + first_greeting + "\" preload=\"auto\">")

  sharkle = document.getElementById('sharkle');
  greeter = document.getElementById('greeter');

  // Bind Events
  sharkle.addEventListener("click",animateHello);
  greeter.onended = greetingFinished;
  greeter.onplay = speak;

  // Start Idle Loop
  main_loop = setInterval(animateIdle,100);

}
