class CGroup {
  constructor(classname) {
    this.list = [];
    this.centerPoint = [];
    this.className = classname;
  }

  setList(n) {
    this.list.push(n);
  }

  setCenterPoint(x, y) {
    this.centerPoint.push(x, y);
  }

  getClassName() {
    return this.className;
  }

  rotate(data,id) {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].setTransformList("rotate", data);
      this.list[i].draw(id);
    }
  }

  translate(data,id) {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].setTransformList("translate", data);
      this.list[i].draw(id);
    }
  }
}

class CShape {
  constructor(classname, centerpoint, penColor, penWidth, brush) {
    this.penColor = penColor;
    this.brush = brush;
    this.penWidth = penWidth;
    this.transformList = [];
    this.transform = "";
    this.classname = classname;
    this.centerpoint = centerpoint;
  }

  // updateRoateAngle(angle) {
  //     this.roateAngle += angle;
  // }

  // updateTranslateDistance(x, y) {
  //     this.dx += x;
  //     this.dy += y;
  // }

  getTransformList(type, data) {
    let transformlistData = [type, data];
    this.transformList.unshift(transformlistData);
  }

  setTransformList(type, data) {
    this.getTransformList(type, data);
    this.transform = "";
    let transformListTemp = [];

    for (let k = 0; k < this.transformList.length; k++) {
      if (
        k != 0 &&
        this.transformList[k][1][1] == this.transformList[k - 1][1][1] &&
        this.transformList[k][1][2] == this.transformList[k - 1][1][2] &&
        this.transformList[k][0] != "translate"
      ) {
        var newangle =
          (this.transformList[k][1][0] +
            transformListTemp[transformListTemp.length - 1][1][0]) %
          360;
        transformListTemp.pop();
        transformListTemp.push([
          this.transformList[k][0],
          [newangle, this.transformList[k][1][1], this.transformList[k][1][2]],
        ]);
      } else {
        transformListTemp.push(this.transformList[k]);
      }
    }

    for (let i = 0; i < transformListTemp.length; i++) {
      for (let j = 1; j < transformListTemp[i].length; j++) {
        this.transform +=
          transformListTemp[i][0] +
          "(" +
          transformListTemp[i][j].join(" ") +
          ")" +
          " ";
      }
    }

    this.transformList = transformListTemp;
  }
}

class CLine extends CShape {
  constructor(
    startPostion,
    endPostion,
    classname,
    centerpoint,
    penWidth,
    penColor
  ) {
    super(classname, centerpoint, penColor, penWidth);
    this.startPostion = startPostion;
    this.endPostion = endPostion;
  }

  draw(id) {
    let s0 = this.startPostion[0] + this.centerpoint[0];
    let s1 = this.startPostion[1] + this.centerpoint[1];
    let e0 = this.endPostion[0] + this.centerpoint[0];
    let e1 = this.endPostion[1] + this.centerpoint[1];
    document.getElementById(id).innerHTML +=
      '<line class="' +
      this.classname +
      '" transform="' +
      this.transform +
      '" x1="' +
      s0 +
      '" y1="' +
      s1 +
      '" x2="' +
      e0 +
      '" y2="' +
      e1 +
      '" style="stroke: ' +
      this.penColor +
      "; stroke-width:" +
      this.penWidth +
      '" />';
  }
}

class CRectangle extends CShape {
  constructor(
    rectangleCenterpoint,
    width,
    height,
    classname,
    centerpoint,
    penWidth,
    brush,
    penColor
  ) {
    super(classname, centerpoint, penColor, penWidth, brush);
    this.rectangleCenterpoint = rectangleCenterpoint;
    this.width = width;
    this.height = height;
  }

  draw(id) {
    let fill = this.brush ? this.penColor : "none";
    let s0 =
      this.rectangleCenterpoint[0] - this.width / 2 + this.centerpoint[0];
    let s1 =
      this.rectangleCenterpoint[1] - this.height / 2 + this.centerpoint[1];
    document.getElementById(id).innerHTML +=
      '<rect class="' +
      this.classname +
      '" transform="' +
      this.transform +
      '" width="' +
      this.width +
      '" height="' +
      this.height +
      '" x="' +
      s0 +
      '" y="' +
      s1 +
      '" style="fill:' +
      fill +
      ";stroke:" +
      this.penColor +
      ";stroke-width:" +
      this.penWidth +
      ';" />';
  }
}

class CEllipse extends CShape {
  constructor(
    ellipseCenterpoint,
    width,
    height,
    classname,
    centerpoint,
    penWidth,
    brush,
    startAngle,
    endAngle,
    penColor
  ) {
    super(classname, centerpoint, penColor, penWidth, brush);
    this.width = width;
    this.height = height;
    this.ellipseCenterpoint = ellipseCenterpoint;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  draw(id) {
    let fill = this.brush ? this.penColor : "none";
    let s0 = this.ellipseCenterpoint[0] + this.centerpoint[0];
    let s1 = this.ellipseCenterpoint[1] + this.centerpoint[1];
    let polarToCartesian = (
      centerX,
      centerY,
      radiusX,
      radiusY,
      angleInDegrees
    ) => {
      let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radiusX * Math.cos(angleInRadians),
        y: centerY + radiusY * Math.sin(angleInRadians),
      };
    };

    let start = polarToCartesian(
      s0,
      s1,
      this.width,
      this.height,
      this.endAngle
    );
    let end = polarToCartesian(
      s0,
      s1,
      this.width,
      this.height,
      this.startAngle
    );

    let arcSweep = this.endAngle - this.startAngle <= 180 ? "0" : "1";

    if (this.startAngle == 0 && this.endAngle == 0) {
      let M = "M " + (s0 - this.width) + " " + s1 + "";
      let a0 =
        "a " +
        this.width +
        " " +
        this.height +
        " 0 1 0 " +
        this.width * 2 +
        " 0 ";
      let a1 =
        "a " +
        this.width +
        " " +
        this.height +
        " 0 1 0 " +
        -this.width * 2 +
        " 0 ";
      document.getElementById(id).innerHTML +=
        '<path class="' +
        this.classname +
        '" transform="' +
        this.transform +
        '" d="' +
        M +
        a0 +
        a1 +
        '" style="fill:' +
        fill +
        ";stroke:" +
        this.penColor +
        "; stroke-width:" +
        this.penWidth +
        '" stroke-linecap="round"/>';
    } else {
      let M = "M " + start.x + " " + start.y + "";
      let A =
        "A " +
        this.width +
        " " +
        this.height +
        " 0 " +
        arcSweep +
        " 0 " +
        end.x +
        " " +
        end.y +
        " ";
      let L0 = "L " + s0 + " " + s1 + " ";
      let L1 = "L " + start.x + " " + start.y + " ";
      document.getElementById(id).innerHTML +=
        '<path class="' +
        this.classname +
        '" transform="' +
        this.transform +
        '" d="' +
        M +
        A +
        L0 +
        L1 +
        '" style="fill:' +
        fill +
        ";stroke:" +
        this.penColor +
        "; stroke-width:" +
        this.penWidth +
        '" stroke-linecap="round"/>';
    }
  }
}

class CCurve extends CShape {
  constructor(
    startPostion,
    endPostion,
    controlPostion,
    classname,
    centerpoint,
    penWidth,
    penColor
  ) {
    super(classname, centerpoint, penColor, penWidth);
    this.startPostion = startPostion;
    this.endPostion = endPostion;
    this.controlPostion = controlPostion;
  }

  draw(id) {
    let s0 = this.startPostion[0] + this.centerpoint[0];
    let s1 = this.startPostion[1] + this.centerpoint[1];
    let e0 = this.endPostion[0] + this.centerpoint[0];
    let e1 = this.endPostion[1] + this.centerpoint[1];
    let c0 = this.controlPostion[0] + this.centerpoint[0];
    let c1 = this.controlPostion[1] + this.centerpoint[1];
    document.getElementById(id).innerHTML +=
      '<path class="' +
      this.classname +
      '" transform="' +
      this.transform +
      '" d="M' +
      s0 +
      " " +
      s1 +
      " Q" +
      c0 +
      " " +
      c1 +
      ", " +
      e0 +
      " " +
      e1 +
      '" style="fill:none;stroke: ' +
      this.penColor +
      "; stroke-width:" +
      this.penWidth +
      '" />';
  }
}
