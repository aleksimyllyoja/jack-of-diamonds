function ca() {
  S = {
    iterations: 1,
    amplitude: 0.3,
    phase: 0,
    phasex: 0,
    phasey: 0,
    radius: 55,
    sp: 3,
    cp: 10,
    bezier_precision: 2,
    rotation: Math.PI/2,
  }

  var g = gui.addFolder("Variables");
  g.add(S, 'iterations', 0, 10, 1).onChange(draw);
  g.add(S, 'amplitude', -5, 5).onChange(draw);
  g.add(S, 'radius', 1, 100).onChange(draw);
  g.add(S, 'bezier_precision', 1, 5, 1).onChange(draw);
  g.add(S, 'sp', 2, 20, 1).onChange(draw);
  g.add(S, 'cp', 1, 200).onChange(draw);
  g.add(S, 'rotation', -Math.PI, Math.PI).onChange(draw);

  g.add(S, 'phasex', -Math.PI*2, Math.PI*2).onChange(draw);
  g.add(S, 'phasey', -Math.PI*2, Math.PI*2).onChange(draw);
  g.add(S, 'phase', -Math.PI*2, Math.PI*2).onChange(draw);

  g.open();

  function ln(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
  }

  function l(x1, y1, x2, y2, d) {
    d = d ? d : 1;
    var mx = (x1+x2)*0.5;
    var my = (y1+y2)*0.5;
    var a = Math.atan2(y2-y1, x2-x1);
    var m = S.amplitude*ln(x1, y1, x2, y2);

    var vx = mx-m*Math.cos(a+S.rotation);
    var vy = my-m*Math.sin(a+S.rotation);
    //mark(vx, vy);

    var l1 = bezier([
      [x1, y1],
      [vx, vy],
      [x2, y2]
    ], S.bezier_precision)
    return l1;
  }

  function _draw(j, max) {
    var ps = circle(W/2, H/2, S.radius, S.sp, S.phase+S.cp, S.phasex+j, S.phasey);

    for(var i=0;i<S.iterations; i++) {
      ps = iter(i);
    }
    function iter(i) {
      var nps = [];
      for(var i=0; i<ps.length-1; i++) {
        var l2 = l(ps[i][0], ps[i][1], ps[i+1][0], ps[i+1][1], (-1)**i);
        nps.push.apply(nps, l2)
      }
      return nps;
    }

    return [ps];
  }

  return function(j, max) {
    return _draw(j, max)
  }
}
register("ca", ca);
