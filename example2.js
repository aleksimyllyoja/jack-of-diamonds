function example2() {
  var c1s = {
    radius: 71,
    rx: 0,
    ry: 0,
    precision: 70,
    xphase: 0,
    yphase: 0,
    phase: 0,
    random: 100
  }

  var c1sf = gui.addFolder("Circle 1");
  c1sf.add(c1s, 'radius', 2, 100).onChange(draw);
  c1sf.add(c1s, 'rx', 0, 100).onChange(draw);
  c1sf.add(c1s, 'ry', 0, 100).onChange(draw);
  c1sf.add(c1s, 'precision', 2, 100, 1).onChange(draw);
  c1sf.add(c1s, 'phase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'xphase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'yphase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'random', 0, 1000).onChange(draw);
  c1sf.open();

  function random_bezier() {

  }

  return function() {
    var c1 = circle(
      W/2, H/2,
      c1s.radius+Math.random()*c1s.random, c1s.precision,
      c1s.phase, c1s.xphase, c1s.yphase, c1s.rx, c1s.ry
    );
    return [c1];
  }
}
register("Example2", example2);
