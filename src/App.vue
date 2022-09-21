<template>
  <v-app>
    <div style="width:auto;padding: 20px 30px 0px">
      <div style="display:flex">
        <div>
          <v-alert
            dense
            icon="mdi-school"
            prominent
            style="font-size:20px;font-weight: bold;padding:0px 0px 0px 0px;"
          >歡迎來到運算思維期末任務</v-alert>
        </div>
        <div style="position:absolute;right: 25px;">
          <v-btn color="primary" class="ma-2" dark @click="answerrecorddialog = true">作答紀錄</v-btn>
          <v-btn color="teal" class="ma-2" dark outlined @click="logOut">登出</v-btn>
        </div>

        <answerRecord :answerrecorddialog="answerrecorddialog" @update="updateself" />
      </div>

      <v-alert dense text :type="TestTimeState">
        自
        <span id="testStartTime"></span>起至
        <span id="testEndTime"></span>止
      </v-alert>

      <v-stepper :value="missonStep">
        <v-stepper-header>
          <v-stepper-step step="1" :complete="missonState[0]">題目一</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="2" :complete="missonState[1]">題目二</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :complete="missonState[2]">題目三</v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </div>

    <div v-if="TestState == 0">
      <span>任務還沒開始</span>
    </div>
    <div v-else-if="TestState == 2">
      <span>任務已經結束</span>
    </div>
    <div v-else-if="TestState == 1">
      <div v-if="missonAllCompelte == true">任務已全部完成</div>
      <div v-else>
        <div class="font" style="padding: 20px 30px 0px 30px">
          <h2>名稱</h2>
          <h3 id="Mission"></h3>
        </div>

        <div class="font" style="padding: 20px 30px 20px 30px">
          <h2>指引</h2>
          <h3 id="Instruction"></h3>
        </div>

        <div
          style="
        display: flex;
        justify-content: space-between;
        padding: 0px 30px 0px 30px;
      "
        >
          <div>
            <v-btn v-on:click="coordinateSystemSwitch()" class="btnStyle" rounded>座標</v-btn>
            <v-btn v-on:click="resetCanvas()" class="btnStyle" rounded>清空畫布</v-btn>
          </div>
          <div style="display: flex; align-items: center">
            <v-btn v-on:click="asyncDownload()" class="btnStyle" rounded>下載圖片</v-btn>
            <v-btn v-on:click="runCode()" class="btnStyle" rounded>繪畫</v-btn>
            <v-btn v-on:click="stepbystep()" class="btnStyle" rounded>一步一步繪畫</v-btn>
            <v-btn v-on:click="checkAnswer()" class="btnStyle" rounded>預覽</v-btn>

            <!-- <v-btn
              type="button"
              id="download"
              class="btn btn-outline-primary"
              v-on:click="asyncDownload()"
            >下載圖片</v-btn>-->

            <v-dialog v-model="sendscoredialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="red lighten-2"
                  rounded
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="btnStylefinal"
                >送出</v-btn>
              </template>

              <v-card>
                <v-toolbar color="primary" dark>交卷</v-toolbar>
                <v-card-text>
                  <div class="pa-3" style="font-size:20px">送出(繳卷)之後，就無法再修改。你確定繼續嗎?</div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="primary" text @click="sendscoredialog = false;sendDataMain()">確定</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <div v-if="errorSendDatadialog == true">
              <v-dialog v-model="errorSendDatadialog" width="500">
                <v-card>
                  <v-toolbar color="primary" dark>錯誤</v-toolbar>
                  <v-card-text>
                    <div class="pa-3" style="font-size:20px">儲存失敗,請聯絡電算中心人員1665</div>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" text @click="errorSendDatadialog = false;">確定</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </div>
        <div id="workspace" style="display: flex; flex-direction: row; padding: 0px 30px 30px 30px">
          <div style="display: flex">
            <div style="position: relative; margin-right: 10px;z-index:0">
              <div style="border: 1px solid #d3d3d3;height:500px">
                <svg
                  id="svg"
                  width="500"
                  height="500"
                  viewBox="-250 -250 500 500"
                  @mousemove="getMousePos"
                />
                <div id="gridSystem">
                  <svg
                    id="coordinateSystem"
                    width="500"
                    height="500"
                    viewBox="-250 -250 500 500"
                    style="vertical-align: middle;"
                  />
                </div>
                <div id="compass">
                  <svg id="compassSystem" width="500" height="500" viewBox="-250 -250 500 500" />
                </div>
                <span id="showMousePostion"></span>
              </div>
            </div>
          </div>
          <div id="blockly-div" style="height: 500px; width: 100%"></div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import answerRecord from "./components/answerRecord.vue";

export default {
  name: "App",
  components: {
    answerRecord
  },
  data: () => ({
    // Blockly
    workspace: null,
    // Blockly JS Interpreter
    myInterpreter: null,
    highlightPause: false,
    // 計算Group順序
    classCounter: 0,
    // 尋找Group index
    // -1 代表沒有
    findsamegroup: -1,
    // 所有形狀物件陣列
    Canvas: [],
    // 座標系統開關
    coordinateSystemState: false,
    // 畫筆顏色
    penColor: "black",
    // 目前繪畫中心點
    centerpoint: [],
    topic: null,
    expectedAnswer: null,
    compassAngle: 0,

    //目前任務作答狀態
    missonStep: 1,
    missonState: [false, false, false],
    missonAllCompelte: false,

    //作答時間
    TestState: 0,
    TestTimeState: null,

    //送出成績dialog
    sendscoredialog: false,
    errorSendDatadialog: false,

    //作答紀錄dialog
    answerrecorddialog: false,
    answerrecordworkspace: null,
    answerrecorditems: [
      { title: "任務一", n: 1 },
      { title: "任務二", n: 2 },
      { title: "任務三", n: 3 }
    ]
  }),
  created() {
    const self = this;
    self.init();
  },
  methods: {
    init: async function() {
      const self = this;
        //取的考試時間
        let TestTime = await self.getTestTime();
        self.setTestTime(TestTime[0], TestTime[1], TestTime[2]);
        //在考試時間內才繼續Loading資料
        if (self.TestState == 1) {
          //拿到考卷以及題目狀態
          let examData = await self.getExam();
          //設定題目狀態
          self.setMissionState(examData);
          self.setMissionStep();
          if (self.missonAllCompelte == false) {
            //取的Topic JSON
            let topicdata = await self.getTopic(examData);
            //設定題目
            self.setTopic(topicdata);
            // 取得Blockly ToolBox XML
            let toolboxData = await self.getBlockToolBox();
            // 將ToolBox XML放進blockly-div
            self.workspace = Blockly.inject("blockly-div", {
              toolbox: toolboxData.getElementById("toolbox")
            });
          }
        }
      
    },

    //Get 資料

    getBlockToolBox: function() {
      const self = this;
      let config = { headers: { Accept: "application/xml" } };
      return new Promise((resolve, reject) => {
        axios
          .get("./tool/blockly_toolbox.xml", config)
          .then(response => {
            //axios response資料轉換 XML
            let parser = new DOMParser();
            let toolboxDataxml = parser.parseFromString(
              response.data,
              "text/xml"
            );
            resolve(toolboxDataxml);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    getExam: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost/ct_api/testInit.php")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    getTopic: function(res) {
      const self = this;
      let path = res.topic[self.missonStep - 1];
      return new Promise((resolve, reject) => {
        axios
          .get("./tool/topic/" + path + ".json")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    setMissionState: function(res) {
      const self = this;
      for (let i = 1; i < 4; i++) {
        if (res.state[i] == 0) {
          self.missonState[i - 1] = false;
        } else {
          self.missonState[i - 1] = true;
        }
      }
    },

    setMissionStep: function() {
      const self = this;

      if (
        self.missonState[0] == true &&
        self.missonState[1] == false &&
        self.missonState[2] == false
      ) {
        self.missonStep = 2;
      } else if (
        self.missonState[1] == true &&
        self.missonState[1] == true &&
        self.missonState[2] == false
      ) {
        self.missonStep = 3;
      } else if (
        self.missonState[0] == true &&
        self.missonState[1] == true &&
        self.missonState[2] == true
      ) {
        self.missonAllCompelte = true;
      }
    },

    setTopic: function(res) {
      const self = this;

      document.getElementById("Mission").innerHTML = res.topic.Mission;
      for (let i = 0; i < res.topic.Instruction.length; i++) {
        document.getElementById("Instruction").innerHTML +=
          res.topic.Instruction[i];
      }

      self.expectedAnswer = res.topic.expectedAnswer;
    },

    getTestTime: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost/ct_api/testTime.php")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    setTestTime: function(state, start, end) {
      const self = this;
      self.TestState = state;
      document.getElementById("testStartTime").innerHTML = start;
      document.getElementById("testEndTime").innerHTML = end;
      if (self.TestState == 0 || self.TestState == 2) {
        self.TestTimeState = "error";
      } else {
        self.TestTimeState = "success";
      }
    },

    getStudentID: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost/ct_api/getStudentID.php")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    CheckSession: async function() {
      const self = this;
      let result;
      let StudentID = await self.getStudentID();
      if (StudentID == "didn't get SessionId") {
        result = 0;
      } else {
        result = 1;
      }

      return result;
    },

    sendData: async function(user, score, code) {
      const self = this;

      const options = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      return new Promise((resolve, reject) => {
        axios
          .post(
            "http://localhost/ct_api/testScore.php",
            {
              studnet: 'r0906003',
              step: self.missonStep,
              score: score[0],
              code: code
            },
            options
          )
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    sendDataMain: async function() {
      const self = this;
      let score = await self.calScore();
      let xmlCode = self.getBlocklyXML();
      let studnetID = await self.getStudentID();
      let msg = await self.sendData(studnetID, score, xmlCode);
      if (msg) {
        self.errorSendDatadialog = true;
      } else {
        location.reload();
      }
    },

    getBlocklyXML: function() {
      const self = this;
      var xml = Blockly.Xml.workspaceToDom(self.workspace);
      var xml_text = Blockly.Xml.domToText(xml);
      return xml_text;
    },

    clearSession: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost/ct_api/logout.php")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    logOut: async function() {
      const self = this;
      let sessionState = await self.clearSession();
      if (sessionState == 0) {
        location.href = "./index.html";
      }
    },

    //更新子
    updateself: function(val) {
      const self = this;
      self.answerrecorddialog = val;
    },

    //執行繪圖

    runCode: function() {
      const self = this;
      let code = Blockly.JavaScript.workspaceToCode(self.workspace);
      eval(code);
    },

    checkAnswer: async function() {
      const self = this;
      let result = await self.calScore();
      if (result[0] != 100) {
        Swal.fire({
          title: "評分結果",
          imageUrl: result[1],
          imageWidth: 500,
          imageHeight: 500,
          text: "相似度 : " + result[0] + "%"
        });
      } else {
        Swal.fire({
          title: "評分結果",
          text: "相似度 : " + result[0] + "%"
        });
      }
    },

    calScore: async function() {
      const self = this;
      let ImageOnload = (data, canvas) => {
        return new Promise((resolve, reject) => {
          let img = document.createElement("img");
          img.setAttribute("src", data);

          img.onload = function() {
            resolve(canvas.drawImage(img, 0, 0));
          };
        });
      };

      let userAnswer = await self.convertToBase64();

      let userCanvas = document.createElement("canvas");
      userCanvas.width = 500;
      userCanvas.height = 500;
      let userCanvasContext = userCanvas.getContext("2d");

      let expectedCanvas = document.createElement("canvas");
      expectedCanvas.width = 500;
      expectedCanvas.height = 500;
      let expectedCanvasContext = expectedCanvas.getContext("2d");

      await ImageOnload(userAnswer, userCanvasContext);
      await ImageOnload(self.expectedAnswer, expectedCanvasContext);

      var img1 = userCanvasContext.getImageData(0, 0, 500, 500);
      var img2 = expectedCanvasContext.getImageData(0, 0, 500, 500);

      var diffCanvas = document.createElement("canvas");
      diffCanvas.width = 500;
      diffCanvas.height = 500;
      var diffContext = diffCanvas.getContext("2d");
      var diff = diffContext.createImageData(500, 500);

      var numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        500,
        500,
        { threshold: 0.1 }
      );
      diffContext.putImageData(diff, 0, 0);
      var dataURL = diffCanvas.toDataURL();

      var samePixel = 0;
      var diffPixel = 0;

      for (let i = 0; i < img1.data.length; i += 4) {
        var ignoreColorImage1 =
          img1.data[i] == 255 &&
          img1.data[i + 1] == 255 &&
          img1.data[i + 2] == 255 &&
          img1.data[i + 3] == 255;
        var ignoreColorImage2 =
          img2.data[i] == 255 &&
          img2.data[i + 1] == 255 &&
          img2.data[i + 2] == 255 &&
          img2.data[i + 3] == 255;

        if (ignoreColorImage1 == false && ignoreColorImage2 == false) {
          var red = img1.data[i] == img2.data[i];
          var green = img1.data[i + 1] == img2.data[i + 1];
          var blue = img1.data[i + 2] == img2.data[i + 2];
          var alpha = img1.data[i + 3] == img2.data[i + 3];
          if (red && green && blue && alpha) {
            samePixel += 1;
          }
        } else if (ignoreColorImage1 && ignoreColorImage2) {
          diffPixel += 1;
        }
      }

      var totalScore = 500 * 500 - diffPixel;

      var score = parseInt((samePixel / totalScore) * 100);

      return [score, dataURL];
    },

    //Blockly JS Interpreter

    stepbystep: function() {
      const self = this;
      Blockly.JavaScript.STATEMENT_PREFIX = "self.highlightBlock(%1);\n";
      Blockly.JavaScript.addReservedWords("self.highlightBlock");
      var code = Blockly.JavaScript.workspaceToCode(self.workspace);
      self.myInterpreter = new Interpreter(code, self.initApi);
      self.nextStep();
    },

    nextStep: function() {
      const self = this;
      if (self.myInterpreter.step()) {
        setTimeout(self.nextStep, 1);
      }
    },

    initApi: function(interpreter, globalObject) {
      const self = this;
      // Add an API function for the alert() block.

      var wrapper = function(startX, startY, endX, endY, penWidth) {
        return self.drawLine(startX, startY, endX, endY, penWidth);
      };
      interpreter.setProperty(
        globalObject,
        "drawLine",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(startX, startY, endX, endY, crlX, ctlY, penWidth) {
        return self.drawCurve(startX, startY, endX, endY, crlX, ctlY, penWidth);
      };
      interpreter.setProperty(
        globalObject,
        "drawCurve",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(startX, startY, width, height, penWidth, brush) {
        return self.drawrectangle(
          startX,
          startY,
          width,
          height,
          penWidth,
          brush
        );
      };
      interpreter.setProperty(
        globalObject,
        "drawrectangle",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(
        startX,
        startY,
        w,
        l,
        penWidth,
        brush,
        startAngle,
        endAngle
      ) {
        return self.drawEllipse(
          startX,
          startY,
          w,
          l,
          penWidth,
          brush,
          startAngle,
          endAngle
        );
      };
      interpreter.setProperty(
        globalObject,
        "drawEllipse",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(angle) {
        return self.rotate(angle);
      };
      interpreter.setProperty(
        globalObject,
        "rotate",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(dx, dy) {
        return self.translate(dx, dy);
      };
      interpreter.setProperty(
        globalObject,
        "translate",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(x, y) {
        return self.setCenterPoint(x, y);
      };
      interpreter.setProperty(
        globalObject,
        "setCenterPoint",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(color) {
        return self.setPenColor(color);
      };
      interpreter.setProperty(
        globalObject,
        "setPenColor",
        interpreter.createNativeFunction(wrapper)
      );

      var wrapper = function(id) {
        id = id ? id.toString() : "";
        return self.highlightBlock(id);
      };
      interpreter.setProperty(
        globalObject,
        "highlightBlock",
        interpreter.createNativeFunction(wrapper)
      );
    },

    highlightBlock: function(id) {
      const self = this;
      self.workspace.highlightBlock(id);
      self.highlightPause = true;
    },

    //Draw Shape Function

    findGroup: function() {
      const self = this;
      if (self.findsamegroup == -1) {
        let n = self.Canvas.length - 1;
        return self.Canvas[n];
      } else {
        let n = self.findsamegroup;
        return self.Canvas[n];
      }
    },

    setCenterPoint: function(x, y) {
      const self = this;
      if (self.Canvas.length == 0) {
        let ogroup = new CGroup("group" + (self.classCounter += 1));
        ogroup.setCenterPoint(x, y);
        self.Canvas.push(ogroup);
      } else {
        for (let i = 0; i < self.Canvas.length; i++) {
          if (
            self.Canvas[i].centerPoint[0] == x &&
            self.Canvas[i].centerPoint[1] == y
          ) {
            self.findsamegroup = i;
            break;
          } else {
            let ogroup = new CGroup("group" + (self.classCounter += 1));
            ogroup.setCenterPoint(x, y);
            self.Canvas.push(ogroup);
            self.findsamegroup = -1;
          }
        }
      }
      self.centerpoint = [x, y];
    },

    drawLine: function(startX, startY, endX, endY, penWidth, id = "svg") {
      const self = this;
      let n = self.findGroup();
      let oline = new CLine(
        [startX, startY],
        [endX, endY],
        n.getClassName(),
        n.centerPoint,
        penWidth,
        self.penColor
      );
      oline.draw(id);
      n.setList(oline);
    },

    drawCurve: function(
      startX,
      startY,
      endX,
      endY,
      crlX,
      ctlY,
      penWidth,
      id = "svg"
    ) {
      const self = this;
      let n = self.findGroup();
      let ocurve = new CCurve(
        [startX, startY],
        [endX, endY],
        [crlX, ctlY],
        n.getClassName(),
        n.centerPoint,
        penWidth,
        self.penColor
      );
      ocurve.draw(id);
      n.setList(ocurve);
    },

    drawrectangle: function(
      startX,
      startY,
      width,
      height,
      penWidth,
      brush,
      id = "svg"
    ) {
      const self = this;
      let n = self.findGroup();
      let orectangle = new CRectangle(
        [startX, startY],
        width,
        height,
        n.getClassName(),
        n.centerPoint,
        penWidth,
        brush,
        self.penColor
      );
      orectangle.draw(id);
      n.setList(orectangle);
    },

    drawEllipse: function(
      startX,
      startY,
      w,
      l,
      penWidth,
      brush,
      startAngle,
      endAngle,
      id = "svg"
    ) {
      const self = this;
      let n = self.findGroup();
      let Cellipse = new CEllipse(
        [startX, startY],
        w,
        l,
        n.getClassName(),
        n.centerPoint,
        penWidth,
        brush,
        startAngle,
        endAngle,
        self.penColor
      );
      Cellipse.draw(id);
      n.setList(Cellipse);
    },

    rotate: function(angle) {
      const self = this;
      self.clearCanvas();
      self.compass(angle);
      for (let i = 0; i < self.Canvas.length; i++) {
        self.Canvas[i].rotate(
          [angle, self.centerpoint[0], self.centerpoint[1]],
          "svg"
        );
      }
    },

    translate: function(dx, dy) {
      const self = this;
      self.clearCanvas();
      for (let i = 0; i < self.Canvas.length; i++) {
        self.Canvas[i].translate([dx, dy], "svg");
      }
    },

    clearCanvas: function() {
      document.getElementById("svg").innerHTML = "";
    },

    resetCanvas: function() {
      const self = this;
      self.clearCanvas();
      self.Canvas.length = 0;
      self.classCounter = 0;
      self.compassAngle = 0;
      self.findsamegroup = -1;
      self.penColor = "#000000";
      self.centerpoint = [];
    },

    setPenColor: function(color) {
      const self = this;
      self.penColor = color;
    },

    // svg grid

    coordinateSystemSwitch: function() {
      const self = this;
      self.coordinateSystemState = !self.coordinateSystemState;
      self.coordinateSystem();
    },

    coordinateSystem: function() {
      const self = this;
      if (self.coordinateSystemState == true) {
        document.getElementById("coordinateSystem").innerHTML +=
          '<circle cx="0" cy="0" r="3" style="fill:rgb(192,192,192);;opacity: 0.9;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 0 0)">(0,0)</text>';
        // x軸
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-250" y1="0" x2="250" y2="0" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<circle cx="-247" cy="0" r="3" style="fill:rgb(192,192,192);;opacity: 0.9;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<polygon points="250,0 230,5 230,-5" style="fill:rgb(192,192,192);;opacity: 0.9;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="-195" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 -195 0)">(-200,0)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="-95" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 -95 0)">(-100,0)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="205" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 205 0)">(200,0)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="105" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 105 0)">(100,0)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-250" y1="100" x2="250" y2="100" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-250" y1="200" x2="250" y2="200" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-250" y1="-100" x2="250" y2="-100" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-250" y1="-200" x2="250" y2="-200" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="-245" y="-5" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 -245 0)">(-250,0)</text>';
        // y軸
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="0" y1="-250" x2="0" y2="250" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<circle cx="0" cy="-247" r="3" style="fill:rgb(192,192,192);;opacity: 0.9;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<polygon points="0,250 5,230 -5,230" style="fill:rgb(192,192,192);;opacity: 0.9;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="-205" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 0 -205)">(0,-200)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="-105" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 0 -105)">(0,-100)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="195" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 0 195)">(0,200)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="95" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;" transform="rotate(-20 0 95)">(0,100)</text>';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="100" y1="-250" x2="100" y2="250" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="200" y1="-250" x2="200" y2="250" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-100" y1="-250" x2="-100" y2="250" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<line x1="-200" y1="-250" x2="-200" y2="250" style="stroke:rgb(192,192,192);stroke-width:1.5;opacity: 0.6;" />';
        document.getElementById("coordinateSystem").innerHTML +=
          '<text x="5" y="-240" style="fill:rgb(192,192,192);font-size: 10px;;opacity: 0.6;">(0,-250)</text>';
      } else {
        document.getElementById("coordinateSystem").innerHTML = "";
      }
    },

    compass: function(angle) {
      const self = this;
      self.compassAngle += angle;
      document.getElementById("compassSystem").innerHTML =
        '<polygon points="0,-240 10,-220 0,-230 -10,-220" transform="rotate(' +
        self.compassAngle +
        ' 0 -230)" style="fill:blue;"/>';
    },

    // svg MousePostion

    getMousePos: function(evt) {
      const self = this;
      var rect = document.getElementById("svg").getBoundingClientRect();
      var x = evt.clientX - rect.left - rect.width / 2;
      var y = evt.clientY - rect.top - rect.height / 2;

      document.getElementById("showMousePostion").innerText =
        "" + parseInt(x) + "," + parseInt(y) + "";
    },

    // svg Convert

    convertToBase64: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        let svg = document.getElementById("svg");
        let canvas = document.createElement("canvas");
        let svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let svgtoBase64 = () => {
          let svgData = new XMLSerializer().serializeToString(svg);
          let svgBase64 = "data:image/svg+xml;base64," + btoa(svgData);
          return svgBase64;
        };

        let img = document.createElement("img");
        img.setAttribute("src", svgtoBase64());

        img.onload = function() {
          ctx.drawImage(img, 0, 0);
          let base64PNG = canvas.toDataURL("image/png");
          resolve(base64PNG);
        };
      });
    },

    downloadPNG: function(base64svg) {
      const self = this;
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.href = base64svg;
      link.download = "img.png";
      link.click();
    },

    asyncDownload: async function() {
      const self = this;
      let base64svg = await self.convertToBase64();
      self.downloadPNG(base64svg);
    }
  }
};
</script>

<style scoped>
#gridSystem {
  position: absolute;
  bottom: 0px;
  z-index: -1;
}

#compass {
  position: absolute;
  bottom: 0px;
  z-index: -1;
}

#showMousePostion {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: small;
}

.btnStyle {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-right: 10px;
}

.btnStylefinal {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
