function example1() {
  var c1s = {
    radius: 71,
    precision: 70,
    xphase: 0,
    yphase: 0,
    phase: 0,
  }

  var c1sf = gui.addFolder("Circle 1");
  c1sf.add(c1s, 'radius', 3, 100).onChange(draw);
  c1sf.add(c1s, 'precision', 3, 100, 1).onChange(draw);
  c1sf.add(c1s, 'phase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'xphase', -7, 7).onChange(draw);
  c1sf.add(c1s, 'yphase', -7, 7).onChange(draw);
  c1sf.open();


  var c2s = {
    radius: 40,
    precision: 5,
    xphase: 0,
    yphase: 0,
    phase: 0,
  }

  var c2sf = gui.addFolder("Circle 2");
  c2sf.add(c2s, 'radius', 3, 100).onChange(draw);
  c2sf.add(c2s, 'precision', 3, 100, 1).onChange(draw);
  c2sf.add(c2s, 'phase', -7, 7).onChange(draw);
  c2sf.add(c2s, 'xphase', -7, 7).onChange(draw);
  c2sf.add(c2s, 'yphase', -7, 7).onChange(draw);
  c2sf.open();

  var cts = {
    padding: 86,
    radius: 21,
    precision: 10,
    xphase: 0,
    yphase: 0,
    phase: 0,
  }

  var ctf = gui.addFolder("Circle texture");
  ctf.add(cts, 'padding', 3, 100).onChange(draw);
  ctf.add(cts, 'radius', 3, 100).onChange(draw);
  ctf.add(cts, 'precision', 2, 100, 1).onChange(draw);
  ctf.add(cts, 'phase', -7, 7).onChange(draw);
  ctf.add(cts, 'xphase', -7, 7).onChange(draw);
  ctf.add(cts, 'yphase', -7, 7).onChange(draw);
  ctf.open();

  var lts = {
    padding: 10,
    slope: 0,
  }

  var ltsf = gui.addFolder("Line texture");
  ltsf.add(lts, 'padding', 0.2, 100).onChange(draw);
  ltsf.add(lts, 'slope', 0, 200).onChange(draw);
  ltsf.open();

  return function() {
    var c1 = circle(
      80, 140,
      c1s.radius, c1s.precision,
      c1s.phase, c1s.xphase, c1s.yphase
    );
    var c2 = circle(220, 70,
      c2s.radius, c2s.precision,
      c2s.phase, c2s.xphase, c2s.yphase
    );

    var lt = cut_texture(line_texture(
      lts.padding, lts.slope
    ), c2);

    var ls = cut_texture(
      circle_texture(
        cts.padding,
        cts.radius,
        cts.precision,
        cts.phase,
        cts.xphase,
        cts.yphase,
      ),
      c1
    );

    return ls.concat(lt).concat([c1, c2]);
  }
}
register("Example1", example1);
