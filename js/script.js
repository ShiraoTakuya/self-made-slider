class ImgSlider {
  constructor(claasName) {
    this.element = document.querySelector(claasName);
    this.eImgs = this.element.querySelectorAll("img");
    var arrayClass = [];
    this.eImgs.forEach((eImg) => {
      eImg.style.WebkitUserDrag = "none";
      arrayClass.push(Array.from(eImg.classList));
    });
    this.arrayClass = arrayClass;

    this.leftSwipeBind = this.leftSwipe.bind(this);
    this.leftArrowButton = document.querySelector(".left-arrow-button");
    this.leftArrowButton.addEventListener("click", this.leftSwipeBind);

    this.rightSwipeBind = this.rightSwipe.bind(this);
    this.rightArrowButton = document.querySelector(".right-arrow-button");
    this.rightArrowButton.addEventListener("click", this.rightSwipeBind);

    this.mdownBind = this.mdown.bind(this);
    this.element.addEventListener("mousedown", this.mdownBind, false);
    this.element.addEventListener("touchstart", this.mdownBind, false);

    this.activeFlag = false;
  }

  async leftSwipe() {
    this.leftArrowButton.removeEventListener("click", this.leftSwipeBind);
    var lastClass = this.arrayClass.pop();
    this.arrayClass.unshift(lastClass);
    this.eImgs.forEach((eImg, index) => {
      eImg.classList = [];
      eImg.classList.add(...this.arrayClass[index]);
    });

    await this.sleep(500);
    this.leftArrowButton.addEventListener("click", this.leftSwipeBind);
  }

  async rightSwipe() {
    this.rightArrowButton.removeEventListener("click", this.rightSwipeBind);
    var firstClass = this.arrayClass.shift();
    this.arrayClass.push(firstClass);
    this.eImgs.forEach((eImg, index) => {
      eImg.classList = [];
      eImg.classList.add(...this.arrayClass[index]);
    });
    await this.sleep(500);
    this.rightArrowButton.addEventListener("click", this.rightSwipeBind);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  mdown(e) {
    if (this.activeFlag === true) {
      return;
    }
    this.activeFlag = true;

    this.element.removeEventListener("mousedown", this.mdownBind, false);
    this.element.removeEventListener("touchstart", this.mdownBind, false);
    var event = e;
    if (e.type === "touchstart") {
      var event = e.changedTouches[0];
    }

    this.x0 = event.pageX;

    this.eImgs.forEach((eImg) => {
      eImg.style.transitionDuration = "0s";
    });

    this.xs = [];
    this.eImgs.forEach((eImg) => {
      this.xs.push(-event.pageX + eImg.offsetLeft);
    });

    this.mmoveBind = this.mmove.bind(this);
    document.body.addEventListener("mousemove", this.mmoveBind, false);
    document.body.addEventListener("touchmove", this.mmoveBind, false);

    this.x0 = event.pageX;
    this.mupBind = this.mup.bind(this);
    document.body.addEventListener("mouseup", this.mupBind, false);
    document.body.addEventListener("touchend", this.mupBind, false);
  }
  async mmove(e) {
    var event = e;
    if (e.type === "touchmove") {
      var event = e.changedTouches[0];
    }

    this.eImgs.forEach((eImg, index) => {
      this.xs.push(-event.pageX + eImg.offsetLeft);
      eImg.style.left = event.pageX + this.xs[index] + "px";
    });
  }

  async mup(e) {
    this.eImgs.forEach((eImg) => {
      eImg.style.transitionDuration = "1s";
    });

    document.body.removeEventListener("mouseup", this.mupBind, false);
    document.body.removeEventListener("touchend", this.mupBind, false);
    document.body.removeEventListener("mousemove", this.mmoveBind, false);
    document.body.removeEventListener("touchmove", this.mmoveBind, false);
    var event = e;
    if (e.type === "touchend") {
      var event = e.changedTouches[0];
    }

    this.x1 = event.pageX;
    this.selectNearestImg();

    this.element.addEventListener("mousedown", this.mdownBind, false);
    this.element.addEventListener("touchstart", this.mdownBind, false);

    this.eImgs.forEach((eImg) => {
      eImg.style.removeProperty("left");
      eImg.style.transitionDuration = null;
    });
    this.activeFlag = false;
  }

  async selectNearestImg() {
    this.mouseOffset = this.x1 - this.x0;
    this.offsetPerscent = this.mouseOffset / this.element.offsetWidth;

    var th1 = 1 / 3 / 2;
    var th2 = 1 / 3 / 2 + 1 / 3;
    var th3 = 1 / 3 / 2 + 1 / 3 + 1 / 3;

    if (this.offsetPerscent > th3) {
      this.rightSwipe();
      this.rightSwipe();
      this.rightSwipe();
    } else if (this.offsetPerscent > th2) {
      this.rightSwipe();
      this.rightSwipe();
    } else if (this.offsetPerscent > th1) {
      this.rightSwipe();
    }

    if (this.offsetPerscent < -th3) {
      this.leftSwipe();
      this.leftSwipe();
      this.leftSwipe();
    } else if (this.offsetPerscent < -th2) {
      this.leftSwipe();
      this.leftSwipe();
    } else if (this.offsetPerscent < -th1) {
      this.leftSwipe();
    }
  }
}

var newClass = new ImgSlider(".view-window");
