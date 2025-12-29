// === FASES ===
const phases = [
  { title: "Fase ÃO", words: ["FOGÃO","BALÃO","PIÃO","SABÃO","CORAÇÃO","ANÃO","LIMÃO","FEIJÃO"] },
  { title: "Fase B", words: ["BOLA","BOLO","BEBE","BICO","BOCA","BALDE","BOTA","BULE"] },
  { title: "Fase C", words: ["CASA","CAMA","CARRO","CAO","CAVALO","COPA","COROA","CIRCO"] },
  { title: "Fase D", words: ["DADO","DENTE","DEDO","DOCE","DAMA","DINHO","DISCO","DINO"] }
];

let currentPhase = 0;
let myWords = phases[currentPhase].words;
let tempWords = [];
let selectedWord = "";

$(document).ready(function(){
  loadPhase(currentPhase);
});

function loadPhase(phaseIndex) {
  currentPhase = phaseIndex;
  myWords = phases[currentPhase].words;
  tempWords = [];
  selectedWord = "";

  $("#phaseTitle").text(phases[currentPhase].title);
  $("#wordsList").empty();
  myWords.forEach(word => $("#wordsList").append("<p>" + word + "</p>"));

  arrangeGame();
  setupTouch();
}

function setupTouch() {
  $(".individual").off();

  $(".individual").on("touchstart mousedown", function(e){
    e.preventDefault();
    selectedWord = "";
    $(".individual").removeClass("colorPurple");
    selectLetter($(this));
  });

  $(".individual").on("touchmove mousemove", function(e){
    e.preventDefault();
    let touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
    let elem = document.elementFromPoint(touch.clientX, touch.clientY);
    let $letter = $(elem).closest(".individual");
    if ($letter.length > 0 && $letter.text().trim() !== "" && !$letter.hasClass("colorPurple")) {
      selectLetter($letter);
    }
  });

  $(document).on("touchend mouseup", function(){
    checkSelectedWord();
  });
}

function selectLetter($letter) {
  $letter.addClass("colorPurple");
  selectedWord += $letter.text();
}

function checkSelectedWord() {
  if (myWords.includes(selectedWord)) {
    $(".colorPurple").addClass("correctlySelected");
    $("#wordsList p").each(function(){
      if ($(this).text() === selectedWord) {
        $(this).addClass("done");
      }
    });

    if ($(".done").length === myWords.length) {
      $("#phaseComplete").show();
    }
  }

  selectedWord = "";
  setTimeout(() => $(".individual").removeClass("colorPurple"), 800);
}

function nextPhase() {
  $("#phaseComplete").hide();
  if (currentPhase < phases.length - 1) {
    loadPhase(currentPhase + 1);
  } else {
    alert("🎉 Você completou TODAS as fases!!! 🎉");
  }
}

function arrangeGame() {
  $("#letters").empty();
  for(let i = 1; i <= 12; i++) {
    for(let j = 1; j <= 12; j++) {
      $("#letters").append(`<div class="individual" data-row="${i}" data-column="${j}"></div>`);
    }
  }

  placeCorrectLetters(myWords);
  placeCorrectLetters(tempWords);

  $(".individual").each(function(){
    if (!$(this).attr("data-word") || $(this).text() === "") {
      $(this).text(randomLetter());
    }
  });
}

function randomLetter() {
  const easy = "AAAAAAAAAAEEEEEEIIIIIIOOOOOOOUUUUÃÕÇBCDFGHJLMNPRSTV";
  return easy.charAt(Math.floor(Math.random() * easy.length));
}

// === FUNÇÕES ORIGINAIS (colocação das palavras) ===
function checkOccupied(word, starting, orientation) {
  var status = ""; var incrementBy = 0;
  if(orientation == "row") incrementBy = 1;
  else if(orientation == "column") incrementBy = 12;
  else if(orientation == "diagonal") incrementBy = 13;
  for(var p=starting,q=0;q<word.length;q++) {
    if($(".individual:eq(" + p + ")").attr("data-word") == undefined)
      status = "empty";
    else {
      status = "occupied";
      break;
    }
    p += incrementBy;
  }
  return status;
}

function placeCorrectLetters(myArr) {
  var positions = ["row","column","diagonal"];
  var nextLetter = 0; var newStart = 0;
  for(var i=0;i<myArr.length;i++) {
    var orientation = positions[Math.floor(Math.random()*positions.length)];
    var start = Math.floor(Math.random()*$(".individual").length);
    var myRow = $(".individual:eq(" + start + ")").data("row");
    var myColumn = $(".individual:eq(" + start + ")").data("column");

    if(orientation == "row") {
      nextLetter = 1;
      if((myColumn*1) + myArr[i].length <=12) newStart = start;
      else {
        var newColumn = 12 - myArr[i].length;
        newStart = $(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
      }
    } else if(orientation == "column") {
      nextLetter = 12;
      if((myRow*1) + myArr[i].length <= 12) newStart = start;
      else {
        var newRow = 12 - myArr[i].length;
        newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
      }
    } else if(orientation == "diagonal") {
      nextLetter = 13;
      if((myColumn*1) + myArr[i].length <= 12 && (myRow*1) + myArr[i].length <= 12) newStart = start;
      // Adicione aqui o resto do seu código diagonal se quiser
    }

    var characters = myArr[i].split("");
    var nextPosition = 0;
    var occupied = checkOccupied(myArr[i], newStart, orientation);
    if(occupied == "empty") {
      $.each(characters, function(key, item){
        $(".individual:eq(" + (newStart+nextPosition) + ")").html(item);
        $(".individual:eq(" + (newStart+nextPosition) + ")").attr("data-word", myArr[i]);
        nextPosition += nextLetter;
      });
    } else {
      tempWords.push(myArr[i]);
    }
  }
}
