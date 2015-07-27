var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),

    opts = {

      lineCount: 20,
      lineBaseLength: 100,
      lineAddedLength: 100,
      lineRelativeBaseEndWidth: .02, // relative to length
      lineRelativeAddedEndWidth: .02,
      lineBaseTime: 10,
      lineAddedTime: 20,

      particleSpawnProb: .5,
      particleRelativeBaseSize: .8, // relative to width
      particleRelativeAddedSize: .4,
      particleRelativeSpan: 3,

      repaintAlpha: .04,
    },

    lines = [],
    tick = 0;

ctx.fillStyle = '#222';
ctx.fillRect( 0, 0, w, h );

function loop() {

  window.requestAnimationFrame( loop );

  step();
  draw();
}
function step() {

  ++tick;

  if( lines.length < opts.lineCount && Math.random() < .1 )
    lines.push( new Line );

  lines.map( function( line ) { line.step(); } );
}
function draw() {

  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,alp)'.replace( 'alp', opts.repaintAlpha );
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';

  var rand = Math.random() * 1 * ( Math.random() < .5 ? 1 : -1 );

  ctx.translate( rand, rand );
  lines.map( function( line ) { line.draw(); } );
  ctx.translate( -rand, -rand );
}

function Line() {

  this.reset();
}
Line.prototype.reset = function() {

  this.sx = this.px = this.x = Math.random() * w;
  this.sy = this.py = this.y = Math.random() * h;

  var len = opts.lineBaseLength + Math.random() * opts.lineAddedLength,
      rad = Math.random() * Math.PI * 2;

  this.dx = Math.cos( rad ) * len;
  this.dy = Math.sin( rad ) * len;

  this.width = 0;
  this.targetWidth = ( opts.lineRelativeBaseEndWidth + Math.random() * opts.lineRelativeAddedEndWidth ) * len;

  this.time = 0;
  this.targetTime = ( opts.lineBaseTime + Math.random() * opts.lineAddedTime ) |0;
}
Line.prototype.step = function() {

  ++this.time;
  var proportion = this.time / this.targetTime;

  this.x = this.sx + this.dx * proportion;
  this.y = this.sy + this.dy * proportion;

  this.width = Math.sin( proportion * Math.PI ) * this.targetWidth;

  if( this.time > this.targetTime )
    this.reset();
}
Line.prototype.draw = function() {

  ctx.lineWidth = this.width;
  ctx.strokeStyle = 'hsl(hue,80%,50%)'.replace( 'hue', this.x / w * 360 + tick );
  ctx.beginPath();
  ctx.moveTo( this.px, this.py );
  ctx.lineTo( this.x, this.y );
  ctx.stroke();

  if( Math.random() < opts.particleSpawnProb ) {

    var size = ( opts.particleRelativeBaseSize + Math.random() * opts.particleRelativeAddedSize ) * this.width,
        span = opts.particleRelativeSpan * this.width;

    ctx.fillStyle = ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = this.width;

    ctx.fillRect(
      this.x + Math.random() * span * ( Math.random() < .5 ? 1 : -1 ),
      this.y + Math.random() * span * ( Math.random() < .5 ? 1 : -1 ),
      size, size );

    ctx.shadowBlur = 0;
  }

  this.px = this.x;
  this.py = this.y;
}
loop();

window.addEventListener( 'resize', function(){

  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;

  ctx.fillStyle = '#222';
  ctx.fillRect( 0, 0, w, h );
} );
