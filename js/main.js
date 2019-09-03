var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

var general = {
  scale: 3.4,
  repeatx: 1,
  repeaty: 1,
  frepeatx: 1,
  frepeaty: 1,
  file: "",
  toggle_fullscreen: function(){
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  },
  download_json: function() {
    download();
  }
};

function load_graphics(name) {
  if(gui) gui.destroy();


  window.location.hash = name;
  gui = new dat.GUI();
  var gf = gui.addFolder('General');

  general.file = name;
  gf.add(general, 'file', Files).onChange(function(v) {
    load_graphics(v)
  });

  gf.add(general, 'toggle_fullscreen');
  gf.add(general, 'download_json');
  gf.add(general, 'scale', 1, 8).onChange(draw);

  var rf = gui.addFolder('Repeater');

  rf.add(general, 'repeatx', 1, 30, 1).onChange(draw);
  rf.add(general, 'repeaty', 1, 30, 1).onChange(draw);

  rf.add(general, 'frepeatx', 1, 30, 1).onChange(draw);
  rf.add(general, 'frepeaty', 1, 30, 1).onChange(draw);

  //rf.open();

  //gf.open();

  drawf = FS[name]();

  draw();
}

function download() {
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PATH));
    var a = document.createElement('a');
    a.setAttribute("href", data);
    a.setAttribute("download", general.file + ".json");

    document.body.appendChild(a);

    a.click();
    a.remove();
}

if(window.location.hash) {
  load_graphics(window.location.hash.replace('#', ''));
} else {
  load_graphics("Example1");
}
