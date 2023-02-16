console.clear();


import { Vec2, Vec3, Vec4, Mat2, Mat3, Mat4, Quat } from 'https://cdn.skypack.dev/wtc-math';
import {
Camera,
Renderer,
Mesh,
Program,
Geometry,
Triangle,
FragmentShader,
RenderTarget,
Framebuffer,
Uniform,
Texture,
ParticleSimulation } from 'https://cdn.skypack.dev/wtc-gl@1.0.0-beta.40';




var fxrand = Math.random;
const hashrand = fxrand;




















































const pal = function (t, a, b, c, d) {
  const mp = c.scaleNew(t).add(d).scale(6.28318);
  mp.x = Math.cos(mp.x);
  mp.y = Math.cos(mp.y);
  mp.z = Math.cos(mp.z);
  return a.addNew(b.multiplyNew(mp));
};
const floatToHex = d => {
  d = Math.floor(d * 255).toString(16);
  return `00${d}`.substr(-2, 2);
};

const getColoursForId = function (id, a, b, c, d, bg) {
  if (id == 1) {
    a.reset(0.9, 0.5, 0.5);
    b.reset(0.5, 0.5, 0.5);
    c.reset(1, 0.5, 1.0);
    d.reset(0.2, 0.2, 0.67);
    bg.resetToVector(pal(hashrand() * 2, a.scaleNew(.6), b, c, d));
  } else if (id == 2) {
    a.reset(0.4, 0.5, 0.6);
    b.reset(0.7, 0.5, 0.3);
    c.reset(0.5, 0.52, 0.53);
    d.reset(0.7, 0.65, 0.68);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 3) {
    a.reset(1.2, 1.2, 0.2);
    b.reset(0.7, 0.2, 0.2);
    c.reset(0.5, 0.5, 1.3);
    d.reset(0.3, 0.3, 0.1);
    bg.resetToVector(pal(hashrand() * 2, new Vec3(.7, .7, 0.2), b, c, d));
  } else if (id == 4) {
    a.reset(0.5, 0.5, 0.5);
    b.reset(0.5, 0.5, 0.5);
    c.reset(1, 1, 1);
    d.reset(0, 0.33, 0.67);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 5) {
    a.reset(0.5, 0.48, 1.2);
    b.reset(0.52, 0.5, 0.5);
    c.reset(1., 1, .8);
    d.reset(0.4, 0.4, 0.6);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 6) {
    a.reset(0.5, 0.5, 0.5);
    b.reset(0.1, 0.5, 0.2);
    c.reset(0.5, 0, 0.7);
    d.reset(0.48, 0.5, 0.3);
    bg.resetToVector(pal(hashrand() * 2, a.scaleNew(1. + hashrand()), b, c, d));
  } else if (id == 7) {
    a.reset(0.85, 0.54, 0.41);
    b.reset(0.2, 0.4, 0.2);
    c.reset(2, 1, 1.1);
    d.reset(0.02, 0.25, 0.25);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 8) {
    a.reset(0.5, 0.9, 0.5).scale(1. + hashrand() * .4);
    b.reset(0.5, 0.5, 0.5);
    c.reset(0.5, 0.52, 0.53);
    d.reset(0.7, 0.65, 0.68);
    bg.resetToVector(pal(hashrand() * 2, a.scaleNew(1. - hashrand()), b, c, d));
  } else if (id == 9) {
    a.reset(1, 1, 1);
    b.reset(1.3, 1.3, 1.3);
    c.reset(1, 1, 1);
    d.reset(0.1, 0.1, 0.1);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 10) {
    a.reset(.5, .5, .5);
    b.reset(1, 1, 1);
    c.reset(1.01, 1.01, 1);
    d.reset(0.1, 0.1, 0.1);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 11) {
    a.reset(2.9, 0.5, 0.5);
    b.reset(0.5, 0.5, 0.5);
    c.reset(1, 1., 1.0);
    d.reset(0.2, 0.2, 0.67);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 12) {
    a.reset(.5, 0.5, 0.9);
    b.reset(0.2, 0.6, 0.5);
    c.reset(1 * .1, 1.2 * .1, 1.0 * .1);
    d.reset(0.5, 0.9, 0.1);
    bg.resetToVector(pal(hashrand() * 2, a, b, c, d));
  } else if (id == 13) {
    a.reset(.9, 0.9, 0.9);
    b.reset(0.5, 0.5, 0.5);
    c.reset(.5, .5, .5);
    d.reset(0.5, 0.9, 0.1);
    const factor = hashrand();
    bg.resetToVector(pal(hashrand() * 2, a.scaleNew(hashrand()), b.scaleNew(hashrand()), c.scaleNew(hashrand()), d.scaleNew(hashrand())));
  }






};


const setup = function () {
  // Simulation dimensions
  const px = Math.min(window.devicePixelRatio, 2);
  const dimensions = [window.innerWidth, window.innerHeight];

  const palettes = [
  1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4,
  5, 5, 5, 5,
  6, 6, 6,
  7, 7,
  8, 8,
  9,
  10,
  11, 11,
  12, 12,
  13, 13];

  const palettenames = [
  'Sunset',
  'Kinda blue',
  'Green and gold deux',
  'Taste the rainbow',
  'Blueprint',
  'Purple haze',
  '60s lounge',
  'Green dream',
  'Lightness',
  'Deco mood',
  'Neon punk',
  'Sleep to dream',
  'Pez dispencer'];

  const baseSizes = [
  50, 60, 70,
  90,
  150];



  let noiseSize = .1 + hashrand() * .5;
  let startspeed = .1 + hashrand();
  let texSize = 128;
  const isLinear = hashrand() > .95;
  const isRandom = hashrand() > 0.9;
  const isWeightTiedToSize = hashrand() > 0.2;
  const massMultiplier = [1, 1];









  function getParticleSize() {
    let n = baseSizes[Math.floor(hashrand() * baseSizes.length)];
    if (!n || texSize == 512 && n > 60) {
      n = getParticleSize();
    }
    return n;
  }
  const particleSize = getParticleSize();

  const palette = palettes[Math.floor(hashrand() * palettes.length)];
  // const palette = 9;
  const baseParticleSize = baseSizes[Math.floor(hashrand() * baseSizes.length)];

  const colourTiedToSize = hashrand() > .1;
  const colourRamp = 1.;
  const colourOffset = -2 + hashrand() * 4;
  const time = hashrand() * -100;
  let weightMultipliter = 1.;
  // weightMultipliter = 0.4 + hashrand() * .4;
  // massMultiplier[0] = 2.;
  // massMultiplier[1] = 3.;

  const col_a = new Vec3(0.9, 0.5, 0.5);
  const col_b = new Vec3(0.5, 0.5, 0.5);
  const col_c = new Vec3(1, 0.5, 1.0);
  const col_d = new Vec3(0.2, 0.2, 0.67);
  const bg = new Vec3(0);

  getColoursForId(palette, col_a, col_b, col_c, col_d, bg);

  window.$fxhashFeatures = {};
  window.$fxhashFeatures["Start speed"] = startspeed < .5 ? "Slow" : startspeed < 1.2 ? "Normal" : "Quick AF";
  window.$fxhashFeatures["Field size"] = noiseSize < .5 ? "Huge AF" : noiseSize < 1.5 ? "Normal" : "Itty bitty";
  window.$fxhashFeatures["Particles"] = texSize ** 2;
  window.$fxhashFeatures["Colour palette"] = palettenames[palette - 1];
  if (isLinear) window.$fxhashFeatures["Linear sizing"] = true;else
  if (isRandom) window.$fxhashFeatures["Random sizing"] = true;
  if (!isWeightTiedToSize) window.$fxhashFeatures["Random mass"] = true;
  if (!colourTiedToSize) window.$fxhashFeatures["Random colouring"] = true;
  if (colourRamp < .3) window.$fxhashFeatures["Colour ramp"] = "Sloow";else
  if (colourRamp < .9) window.$fxhashFeatures["Colour ramp"] = "Whaaat?";else
  if (colourRamp < 2.) window.$fxhashFeatures["Colour ramp"] = "Normal";else
  if (colourRamp > 2.) window.$fxhashFeatures["Colour ramp"] = "Steep AF";


  for (const V in window.$fxhashFeatures) {
    console.log(`${V} :     ${window.$fxhashFeatures[V]}`);
  }

  const t = new ParticleSimulation({
    rendererProps: {},
    textureSize: texSize,
    simDimensions: 2,
    vertex: document.querySelector("#vertexShader_particle").innerText,
    fragment: document.querySelector("#fragmentShader_particle").innerText,
    uniforms: {
      b_position: new Uniform({
        name: "position",
        value: null,
        kind: "texture" }),

      b_velocity: new Uniform({
        name: "velocity",
        value: null,
        kind: "texture" }) },


    onBeforeRender: function (t, system) {
      this.uniforms["b_position"].value = positionBuffer.read.texture;

      // this.uniforms['s_data'] = new Uniform({ name: 'data', value: particleTexture, type: 'texture' });

      this.uniforms["u_resolution"].value = [
      positionBuffer.width,
      positionBuffer.height];

      // positionBuffer.read;
      positionBuffer.render(this.renderer, { scene: positionMesh });

      this.uniforms["u_resolution"].value = this.dimensions.array;
    } });



  t.program.depthTest = false;
  t.transparent = true;
  t.program.setBlendFunc(t.gl.SRC_ALPHA, t.gl.ONE_MINUS_SRC_ALPHA);

  window.addEventListener("keyup", e => {
    if (e.key === " ") {
      t.playing = !t.playing;
    }
  });

  const { gl, textureSize, particles, uniforms, renderer } = t;

  const dpr = renderer.dpr;

  // gl.clearColor(0.08, 0.1, 0.15, 1);
  gl.clearColor(...bg.array, 1.);

  const positionData = new Float32Array(particles * 4).fill(0);
  const particleData = new Float32Array(particles * 4).fill(0);
  for (let i = 0; i < positionData.length; i += 4) {

    const it = i / 4;

    // Random
    positionData[i] = hashrand() * window.innerWidth * dpr;
    positionData[i + 1.] = hashrand() * window.innerHeight * dpr;
    positionData[i + 2] = hashrand() - 0.5;
    positionData[i + 3] = hashrand() - 0.5;

    if (isLinear) {
      particleData[i] = Math.max(i / 4 / particles, 0.1);
    } else if (isRandom) {
      particleData[i] = hashrand();
    } else {
      particleData[i] = hashrand();
      if (i / 4 < particles * 0.2) {
        if (hashrand() < 0.9) {
          particleData[i] = hashrand() * 0.5;
        }
      }
    }

    // particleData[i + 1] = hashrand() * weightMultipliter;
    if (isWeightTiedToSize) {
      particleData[i + 1] = particleData[i] * Math.min(weightMultipliter - .5, 1.);
    } else {
      particleData[i + 1] =
      weightMultipliter * 0.5 - hashrand() * weightMultipliter;
    }
    if (colourTiedToSize) {
      particleData[i + 2] = colourOffset + particleData[i + 1] * colourRamp;
    } else {
      particleData[i + 2] = colourOffset + hashrand() * colourRamp;
    }
    particleData[i + 3] = 1.;
    if (it > 10000) particleData[i + 3] = 0.;

    // particleData[i] = Math.min(
    //   Math.max(i / 4. / (particles*.2), .2),
    //   5.5);
  }

  const particleTexture = new Texture(gl, {
    data: particleData,
    width: textureSize,
    height: textureSize,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
    generateMipmaps: false,
    type: gl.FLOAT,
    internalFormat: gl.RGBA16F });

  uniforms.s_data = new Uniform({
    name: "data",
    value: particleTexture,
    kind: "texture" });

  const positionBuffer = new Framebuffer(gl, {
    name: "position",
    width: textureSize,
    height: textureSize,
    dpr: 1,
    data: positionData,
    texdepth: Framebuffer.TEXTYPE_FLOAT,
    minFilter: gl.NEAREST });

  const defaultShaderV = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 v_uv;
  void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
  }`;
  const geometry = new Triangle(gl);
  const positionProgram = new Program(gl, {
    vertex: defaultShaderV,
    fragment: document.getElementById("fragmentShader_position").innerText,
    uniforms: uniforms });

  const bufferResolution = new Uniform({
    name: "resolution",
    value: [textureSize, textureSize],
    kind: "vec2" });

  positionProgram.uniforms.u_resolution = bufferResolution;

  // const processProgram = new Program(gl, {
  //   vertex: `attribute vec3 position;attribute vec2 uv;varying vec2 v_uv;void main() {gl_Position = vec4(position, 1.0);v_uv = uv;}`,
  //   fragment: document.querySelector('#processShader').innerText,
  //   uniforms: uniforms
  // })
  // const processShader = new Mesh(gl, { geometry, program: ditherProgram });
  // processFBO = new Framebuffer(gl, { dpr: px, name: 'process', width: dimensions.width, height: dimensions.height, texdepth: Framebuffer.TEXTYPE_FLOAT });

  uniforms.u_screen = new Uniform({
    name: "screen",
    value: [window.innerWidth, window.innerHeight],
    kind: "vec2" });

  uniforms.u_dpr = new Uniform({
    name: "dpr",
    value: dpr,
    kind: "float" });


  uniforms.u_properties = new Uniform({
    name: "properties",
    value: [palette, hashrand(), hashrand(), hashrand()],
    kind: "vec4" });

  uniforms.u_col_a = new Uniform({
    name: "col_a",
    value: col_a.array,
    kind: "vec3" });

  uniforms.u_col_b = new Uniform({
    name: "col_b",
    value: col_b.array,
    kind: "vec3" });

  uniforms.u_col_c = new Uniform({
    name: "col_c",
    value: col_c.array,
    kind: "vec3" });

  uniforms.u_col_d = new Uniform({
    name: "col_d",
    value: col_d.array,
    kind: "vec3" });

  uniforms.u_psize = new Uniform({
    name: "psize",
    value: particleSize,
    kind: "float" });

  uniforms.u_multiplier = new Uniform({
    name: "multiplier",
    value: massMultiplier,
    kind: "vec2" });

  uniforms.u_speed = new Uniform({
    name: "speed",
    value: startspeed,
    kind: "float" });

  uniforms.u_noisesize = new Uniform({
    name: "noisesize",
    value: noiseSize,
    kind: "float" });

  // Load the image into the uniform
  const texture1 = new Texture(gl, {
    image: img,
    generateMipmaps: false });

  uniforms.s_sdfs = new Uniform({
    name: "sdfs",
    value: texture1,
    kind: "texture" });



  uniforms.u_time.value = time;

  window.addEventListener("resize", e => {
    uniforms.u_screen.value = [window.innerWidth, window.innerHeight];
  });

  const positionMesh = new Mesh(gl, { geometry, program: positionProgram });

  // Set up mouse uniforms
  (function () {
    const tarmouse = new Vec4(0, 0, 0, 0);
    const curmouse = tarmouse.clone();
    let pointerdown = false;

    uniforms.u_mouse = new Uniform({
      name: "mouse",
      value: tarmouse.array,
      kind: "vec4" });

    let pos = ["+", "=", "w", "ArrowUp"];
    let neg = ["-", "_", "s", "ArrowDown"];
    const keymap = {
      up: false,
      down: false };

    let speed = startspeed;
    window.addEventListener('keydown', e => {
      if (pos.indexOf(e.key) != -1) {
        keymap.up = true;
        speed += 0.01;
        e.preventDefault();
      } else if (neg.indexOf(e.key) != -1) {
        keymap.down = true;
        speed -= 0.01;
        e.preventDefault();
      }
      speed = Math.max(Math.min(speed, 5), 0.);
      uniforms.u_speed.value = speed;
    });
    window.addEventListener('keyup', e => {
      if (pos.indexOf(e.key) != -1) {
        keymap.up = false;
      } else if (neg.indexOf(e.key) != -1) {
        keymap.down = false;
      }
    });
    document.body.addEventListener('pointermove', e => {
      tarmouse.x = e.x;
      tarmouse.y = window.innerHeight - e.y;
      if (pointerdown) {
      }
    });
    document.body.addEventListener('pointerdown', e => {
      pointerdown = true;
      if (e.button == 0) {
        curmouse.z = 1.;
      }
    });
    document.body.addEventListener('pointerup', e => {
      pointerdown = false;
      if (e.button == 0) {
        curmouse.z = 0.;
      }
    });
    let oldTime;
    const animouse = d => {

      const factor = d - oldTime;
      oldTime = d;

      const diff = tarmouse.xy.subtractNew(curmouse.xy);
      curmouse.xy = curmouse.xy.add(diff.scale(1 / factor * 2));
      uniforms.u_mouse.value = curmouse.array;
      requestAnimationFrame(animouse);
    };
    requestAnimationFrame(animouse);
  })();
};

const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://assets.codepen.io/982762/Group+2.png";
img.onload = () => setup();

// setup();