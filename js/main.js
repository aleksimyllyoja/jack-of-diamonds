var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

var general = {
  scale: 3.4,
  repeatx: 1,
  repeaty: 1,
  frepeatx: 1,
  frepeaty: 1,
  file: Files[Object.keys(Files)[0]],
  toggle_fullscreen: function(){
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
};

function load_graphics(name) {
  if(gui) gui.destroy();

  gui = new dat.GUI();
  var gf = gui.addFolder('General');

  gf.add(general, 'file', Files).onChange(function(v) {
    load_graphics(v)
  });

  gf.add(general, 'toggle_fullscreen').onChange(draw);
  gf.add(general, 'scale', 1, 8).onChange(draw);

  var rf = gui.addFolder('Repeater');

  rf.add(general, 'repeatx', 1, 30, 1).onChange(draw);
  rf.add(general, 'repeaty', 1, 30, 1).onChange(draw);

  rf.add(general, 'frepeatx', 1, 30, 1).onChange(draw);
  rf.add(general, 'frepeaty', 1, 30, 1).onChange(draw);

  rf.open();

  gf.open();

  drawf = FS[name]();
  draw();
}

load_graphics("Example1");
