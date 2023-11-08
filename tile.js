class Tile {
  constructor(x, y, index, img) {
    this.cI = index;
    this.index = index;
    this.x = x;
    this.y = y;
    this.img = img;
    this.moving = false;
    this.easing = 0.25;
    this.targetX = x;
    this.targetY = y;
    this.targets = [];
    this.count = 0;
    this.gap = 1;
  }
  
  show() {
    if(!this.isBlank) {
      image(this.img, this.x+this.gap, this.y+this.gap, tileSize-this.gap, tileSize-this.gap);
    }
    if(debug) {
      textFont('Roboto');
      textAlign(CENTER, CENTER);
      fill(255,200,30);
      noStroke();
      text(`${this.index},${this.cI}`, this.x + tileSize / 2, this.y + tileSize / 1.5);
    }
  }

  move() {
    if (this.targets.length) {
      this.moving = true;
      let ct = this.targets[this.count];
      this.targetX = ct[0];
      this.targetY = ct[1];
      let dx = this.targetX - this.x;
      this.x += dx * this.easing;
      let dy = this.targetY - this.y;
      this.y += dy * this.easing;
      
      if (dist(this.x, this.y, this.targetX, this.targetY) < 1) {
        this.x = this.cI%cols*tileSize;
        this.y = floor(this.cI/cols)%cols*tileSize;
        this.moving = false;
        this.count++;
        if (this.count >= this.targets.length) {
          this.targets = [];
          this.count = 0;
        }
      }
    }
  }

  clicked(mx, my, isRecording = true) {
    gameStarted = true;
    if(mx > this.x && mx < this.x + tileSize && my > this.y && my < this.y + tileSize) {
      if(this.isBlank){
        return false;
      } else {
        if(isRecording) {
          recordingArr.push(this);
        }
        let pX = this.x;
        let pY = this.y;
        this.targets.push([blank.x, blank.y]);
        [blank.cI,this.cI] = [this.cI,blank.cI];
        blank.x = pX;
        blank.y = pY;
      }
    }
  }

}