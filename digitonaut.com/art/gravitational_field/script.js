(function() {
  var COLORS, FRICTION, GRAVITY, MAX_FORCE, NUM_PARTICLES, Particle, TAIL_LENGTH;

  NUM_PARTICLES = 250;

  TAIL_LENGTH = 12;

  MAX_FORCE = 8;

  FRICTION = 0.75;

  GRAVITY = 9.81;

  COLORS = ['#FF4746', '#E8DA5E', '#92B55F', '#487D76'];

  Particle = class Particle {
    constructor(x1 = 0.0, y1 = 0.0, mass = 1.0) {
      this.x = x1;
      this.y = y1;
      this.mass = mass;
      this.tail = [];
      this.radius = this.mass * 0.15;
      this.charge = random([-1, 1]);
      this.color = random(COLORS);
      this.fx = this.fy = 0.0;
      this.vx = this.vy = 0.0;
    }

  };

  Sketch.create({
    retina: 'auto',
    particles: [],
    setup: function() {
      var i, k, m, ref, results, x, y;
      results = [];
      for (i = k = 0, ref = NUM_PARTICLES; k <= ref; i = k += 1) {
        x = random(this.width);
        y = random(this.height);
        m = random(0.5, 8.0);
        results.push(this.particles.push(new Particle(x, y, m)));
      }
      return results;
    },
    draw: function() {
      var a, b, dSq, dst, dx, dy, f, fx, fy, i, j, k, l, len, len1, n, p, rad, ref, ref1, ref2, ref3, results;
      this.lineCap = this.lineJoin = 'round';
      results = [];
      for (i = k = 0, ref = NUM_PARTICLES; k <= ref; i = k += 1) {
        a = this.particles[i];
        // invert charge
        if (random() < 0.08) {
          a.charge = -a.charge;
        }
        for (j = l = ref1 = i + 1, ref2 = NUM_PARTICLES; l <= ref2; j = l += 1) {
          b = this.particles[j];
          
          // delta vector
          dx = b.x - a.x;
          dy = b.y - a.y;
          
          // distance
          dst = sqrt(dSq = (dx * dx + dy * dy) + 0.1);
          rad = a.radius + b.radius;
          if (dst >= rad) {
            
            // derivative of unit length for normalisation
            len = 1.0 / dst;
            fx = dx * len;
            fy = dy * len;
            
            // gravitational force
            f = min(MAX_FORCE, (GRAVITY * a.mass * b.mass) / dSq);
            a.fx += f * fx * b.charge;
            a.fy += f * fy * b.charge;
            b.fx += -f * fx * a.charge;
            b.fy += -f * fy * a.charge;
          }
        }
        
        // integrate
        a.vx += a.fx;
        a.vy += a.fy;
        a.vx *= FRICTION;
        a.vy *= FRICTION;
        a.tail.unshift({
          x: a.x,
          y: a.y
        });
        if (a.tail.length > TAIL_LENGTH) {
          a.tail.pop();
        }
        a.x += a.vx;
        a.y += a.vy;
        
        // reset force
        a.fx = a.fy = 0.0;
        
        // wrap
        if (a.x > this.width + a.radius) {
          a.x = -a.radius;
          a.tail = [];
        } else if (a.x < -a.radius) {
          a.x = this.width + a.radius;
          a.tail = [];
        }
        if (a.y > this.height + a.radius) {
          a.y = -a.radius;
          a.tail = [];
        } else if (a.y < -a.radius) {
          a.y = this.height + a.radius;
          a.tail = [];
        }
        
        // draw
        this.strokeStyle = a.color;
        this.lineWidth = a.radius * 2.0;
        this.beginPath();
        this.moveTo(a.x, a.y);
        ref3 = a.tail;
        for (n = 0, len1 = ref3.length; n < len1; n++) {
          p = ref3[n];
          this.lineTo(p.x, p.y);
        }
        results.push(this.stroke());
      }
      return results;
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLEVBQUEsUUFBQSxFQUFBOztFQUFBLGFBQUEsR0FBZ0I7O0VBQ2hCLFdBQUEsR0FBYzs7RUFDZCxTQUFBLEdBQVk7O0VBQ1osUUFBQSxHQUFXOztFQUNYLE9BQUEsR0FBVTs7RUFFVixNQUFBLEdBQVMsQ0FDUCxTQURPLEVBRVAsU0FGTyxFQUdQLFNBSE8sRUFJUCxTQUpPOztFQU9ILFdBQU4sTUFBQSxTQUFBO0lBRUUsV0FBYSxNQUFPLEdBQVAsT0FBaUIsR0FBakIsU0FBOEIsR0FBOUIsQ0FBQTtNQUFFLElBQUMsQ0FBQTtNQUFTLElBQUMsQ0FBQTtNQUFTLElBQUMsQ0FBQTtNQUVsQyxJQUFDLENBQUEsSUFBRCxHQUFRO01BRVIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsSUFBRCxHQUFRO01BQ2xCLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBQSxDQUFPLENBQUUsQ0FBQyxDQUFILEVBQU0sQ0FBTixDQUFQO01BQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUFBLENBQU8sTUFBUDtNQUVULElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQUQsR0FBTTtNQUNaLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBQyxDQUFBLEVBQUQsR0FBTTtJQVREOztFQUZmOztFQWFBLE1BQU0sQ0FBQyxNQUFQLENBRUU7SUFBQSxNQUFBLEVBQVEsTUFBUjtJQUVBLFNBQUEsRUFBVyxFQUZYO0lBSUEsS0FBQSxFQUFPLFFBQUEsQ0FBQSxDQUFBO0FBRVQsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQTtBQUFJO01BQUEsS0FBUyxvREFBVDtRQUVFLENBQUEsR0FBSSxNQUFB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LElBQUMsQ0FBQSxNQUFELENBQUE7TUFqRkYsQ0FBQTs7SUFKSTtFQWROLENBRkY7QUExQkEiLCJzb3VyY2VzQ29udGVudCI6WyJcbk5VTV9QQVJUSUNMRVMgPSAyNTBcblRBSUxfTEVOR1RIID0gMTJcbk1BWF9GT1JDRSA9IDhcbkZSSUNUSU9OID0gMC43NVxuR1JBVklUWSA9IDkuODFcbiAgXG5DT0xPUlMgPSBbXG4gICcjRkY0NzQ2J1xuICAnI0U4REE1RSdcbiAgJyM5MkI1NUYnXG4gICcjNDg3RDc2J1xuICBdXG4gIFxuY2xhc3MgUGFydGljbGVcbiAgXG4gIGNvbnN0cnVjdG9yOiAoIEB4ID0gMC4wLCBAeSA9IDAuMCwgQG1hc3MgPSAxLjAgKSAtPlxuXG4gICAgQHRhaWwgPSBbXVxuICAgIFxuICAgIEByYWRpdXMgPSBAbWFzcyAqIDAuMTVcbiAgICBAY2hhcmdlID0gcmFuZG9tIFsgLTEsIDEgXVxuICAgIEBjb2xvciA9IHJhbmRvbSBDT0xPUlNcbiAgICBcbiAgICBAZnggPSBAZnkgPSAwLjBcbiAgICBAdnggPSBAdnkgPSAwLjBcbiAgICBcblNrZXRjaC5jcmVhdGVcblxuICByZXRpbmE6ICdhdXRvJ1xuICBcbiAgcGFydGljbGVzOiBbXVxuICAgIFxuICBzZXR1cDogLT5cbiAgICBcbiAgICBmb3IgaSBpbiBbMC4uTlVNX1BBUlRJQ0xFU10gYnkgMVxuICAgICAgXG4gICAgICB4ID0gcmFuZG9tIEB3aWR0aFxuICAgICAgeSA9IHJhbmRvbSBAaGVpZ2h0XG4gICAgICBtID0gcmFuZG9tIDAuNSwgOC4wXG4gICAgICAgIFxuICAgICAgQHBhcnRpY2xlcy5wdXNoIG5ldyBQYXJ0aWNsZSB4LCB5LCBtXG4gICAgXG4gIGRyYXc6IC0+XG5cbiAgICBAbGluZUNhcCA9IEBsaW5lSm9pbiA9ICdyb3VuZCdcblxuICAgIGZvciBpIGluIFswLi5OVU1fUEFSVElDTEVTXSBieSAxXG4gICAgICBcbiAgICAgIGEgPSBAcGFydGljbGVzW2ldXG5cbiAgICAgICMgaW52ZXJ0IGNoYXJnZVxuICAgICAgaWYgcmFuZG9tKCkgPCAwLjA4IHRoZW4gYS5jaGFyZ2UgPSAtYS5jaGFyZ2VcbiAgICAgIFxuICAgICAgZm9yIGogaW4gW2krMS4uTlVNX1BBUlRJQ0xFU10gYnkgMVxuICAgICAgICBcbiAgICAgICAgYiA9IEBwYXJ0aWNsZXNbal1cbiAgICAgICAgXG4gICAgICAgICMgZGVsdGEgdmVjdG9yXG4gICAgICAgIGR4ID0gYi54IC0gYS54XG4gICAgICAgIGR5ID0gYi55IC0gYS55XG4gICAgICAgIFxuICAgICAgICAjIGRpc3RhbmNlXG4gICAgICAgIGRzdCA9IHNxcnQgZFNxID0gKCBkeCAqIGR4ICsgZHkgKiBkeSApICsgMC4xXG4gICAgICAgIHJhZCA9IGEucmFkaXVzICsgYi5yYWRpdXNcbiAgICAgICAgXG4gICAgICAgIGlmIGRzdCA+PSByYWRcbiAgICAgIFxuICAgICAgICAgICMgZGVyaXZhdGl2ZSBvZiB1bml0IGxlbmd0aCBmb3Igbm9ybWFsaXNhdGlvblxuICAgICAgICAgIGxlbiA9IDEuMCAvIGRzdFxuICAgICAgICBcbiAgICAgICAgICBmeCA9IGR4ICogbGVuXG4gICAgICAgICAgZnkgPSBkeSAqIGxlblxuICAgICAgICBcbiAgICAgICAgICAjIGdyYXZpdGF0aW9uYWwgZm9yY2VcbiAgICAgICAgICBmID0gbWluIE1BWF9GT1JDRSwgKCBHUkFWSVRZICogYS5tYXNzICogYi5tYXNzICkgLyBkU3FcbiAgICAgICAgICAgIFxuICAgICAgICAgIGEuZnggKz0gZiAqIGZ4ICogYi5jaGFyZ2VcbiAgICAgICAgICBhLmZ5ICs9IGYgKiBmeSAqIGIuY2hhcmdlXG4gICAgICAgICAgXG4gICAgICAgICAgYi5meCArPSAtZiAqIGZ4ICogYS5jaGFyZ2VcbiAgICAgICAgICBiLmZ5ICs9IC1mICogZnkgKiBhLmNoYXJnZVxuICAgICAgICAgIFxuICAgICAgIyBpbnRlZ3JhdGVcbiAgICAgIGEudnggKz0gYS5meFxuICAgICAgYS52eSArPSBhLmZ5XG4gICAgICAgIFxuICAgICAgYS52eCAqPSBGUklDVElPTlxuICAgICAgYS52eSAqPSBGUklDVElPTlxuXG4gICAgICBhLnRhaWwudW5zaGlmdCB4OiBhLngsIHk6IGEueVxuICAgICAgYS50YWlsLnBvcCgpIGlmIGEudGFpbC5sZW5ndGggPiBUQUlMX0xFTkdUSFxuICAgICAgICBcbiAgICAgIGEueCArPSBhLnZ4XG4gICAgICBhLnkgKz0gYS52eVxuICAgICAgICBcbiAgICAgICMgcmVzZXQgZm9yY2VcbiAgICAgIGEuZnggPSBhLmZ5ID0gMC4wXG4gICAgICBcbiAgICAgICMgd3JhcFxuICAgICAgICBcbiAgICAgIGlmIGEueCA+IEB3aWR0aCArIGEucmFkaXVzXG5cbiAgICAgICAgYS54ID0gLWEucmFkaXVzXG4gICAgICAgIGEudGFpbCA9IFtdXG5cbiAgICAgIGVsc2UgaWYgYS54IDwgLWEucmFkaXVzXG5cbiAgICAgICAgYS54ID0gQHdpZHRoICsgYS5yYWRpdXNcbiAgICAgICAgYS50YWlsID0gW11cbiAgICAgIFxuICAgICAgaWYgYS55ID4gQGhlaWdodCArIGEucmFkaXVzXG5cbiAgICAgICAgYS55ID0gLWEucmFkaXVzXG4gICAgICAgIGEudGFpbCA9IFtdXG5cbiAgICAgIGVsc2UgaWYgYS55IDwgLWEucmFkaXVzXG5cbiAgICAgICAgYS55ID0gQGhlaWdodCArIGEucmFkaXVzXG4gICAgICAgIGEudGFpbCA9IFtdXG4gICAgICAgICAgXG4gICAgICAjIGRyYXdcbiAgICAgIEBzdHJva2VTdHlsZSA9IGEuY29sb3JcbiAgICAgIEBsaW5lV2lkdGggPSBhLnJhZGl1cyAqIDIuMFxuXG4gICAgICBAYmVnaW5QYXRoKClcbiAgICAgIEBtb3ZlVG8gYS54LCBhLnlcbiAgICAgIEBsaW5lVG8gcC54LCBwLnkgZm9yIHAgaW4gYS50YWlsXG4gICAgICBAc3Ryb2tlKClcbiJdfQ==
//# sourceURL=coffeescript