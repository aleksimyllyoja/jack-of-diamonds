function example3() {
  var c1s = {
    radius: 71,
    rx: 0,
    ry: 0,
    precision: 70,
    xphase: 0,
    yphase: 0,
    phase: 0,
    random: 100,
    n: 3,
    bp: 10
  }

  var c1sf = gui.addFolder("Circle 1");
  c1sf.add(c1s, 'radius', 2, 100).onChange(draw);
  c1sf.add(c1s, 'rx', 0, 100).onChange(draw);
  c1sf.add(c1s, 'ry', 0, 100).onChange(draw);
  c1sf.add(c1s, 'precision', 3, 100, 1).onChange(draw);
  c1sf.add(c1s, 'phase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'xphase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'yphase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'random', 0, 1000).onChange(draw);
  c1sf.add(c1s, 'n', 3, 10).onChange(draw);
  c1sf.add(c1s, 'bp', 3, 100).onChange(draw);
  c1sf.open();

  function random_bezier() {

  }

  return function() {
    var c = circle(
      W/2, H/2,
      c1s.radius, c1s.precision,
      c1s.phase, c1s.xphase, c1s.yphase, c1s.rx, c1s.ry
    );

    b = bezier(_.sample(c, c1s.n), c1s.bp);
    return [b];
  }
}
register("Example3", example3);
