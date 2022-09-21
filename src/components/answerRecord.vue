<template>
  <v-dialog
    v-model="answerrecorddialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card tile>
      <v-toolbar flat dark color="primary" style="flex:none">
        <v-btn icon dark @click="closedialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>作答紀錄</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="pa-10">
          <div class="pb-5">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">{{answerrecordSelectText}}</v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in answerrecorditems"
                  :key="index"
                  link
                  @click="selectAnswerRecord(item.n)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div v-if="answerRecord==0"></div>
          <div v-else-if="answerRecord==1">尚未作答</div>
          <div v-else-if="answerRecord == 2">
            <div>
              <h2>名稱</h2>
              <div id="MissionAnswerRecord"></div>
            </div>
            <div>
              <h2>指引</h2>
              <div id="InstructionAnswerRecord"></div>
            </div>
            <div>
              <h2>成績</h2>
              <div id="ScoreAnswerRecord"></div>
            </div>
            <div style="display:flex">
              <div style="border: 1px solid #d3d3d3;height:500px;width:500px">
                <svg id="svg1" width="500" height="500" viewBox="-250 -250 500 500" />
              </div>

              <div id="blockly-AnswerRecord" style="height: 500px; width: 100%"></div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "answerRecord",
  props: ["answerrecorddialog"],
  data: () => ({
    answerrecorddialog1: false,
    answerrecordworkspace: null,
    answerrecorditems: [
      { title: "題目一", n: 1 },
      { title: "題目二", n: 2 },
      { title: "題目三", n: 3 }
    ],
    answerrecordSelectText: "請選擇題目",

    answerRecord: 0,
    // 計算Group順序
    classCounter: 0,
    // 尋找Group index
    // -1 代表沒有
    findsamegroup: -1,
    // 所有形狀物件陣列
    Canvas: [],
    // 畫筆顏色
    penColor: "black",
    // 目前繪畫中心點
    centerpoint: []
  }),
  methods: {
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

    selectAnswerRecord: async function(n) {
      const self = this;

      let answerRecordData = await self.getAnswerRecord();
      self.answerrecordSelectText = self.answerrecorditems[n - 1].title;

      if (answerRecordData.state[n][0] == 1) {
        self.answerRecord = 2;

        let answerRecordTopic = await self.getAnswerRecordTopic(
          answerRecordData,
          n
        );
        self.setAnswerRecordTopic(answerRecordTopic);
        let toolboxData = await self.getBlockToolBox();
        self.answerrecordworkspace = Blockly.inject("blockly-AnswerRecord", {
          toolbox: toolboxData.getElementById("toolbox")
        });
        document.getElementById("ScoreAnswerRecord").innerHTML =
          answerRecordData.state[n][1];

        //xml code塞進Workspace
        var xml = Blockly.Xml.textToDom(answerRecordData.state[n][2]);
        Blockly.Xml.domToWorkspace(xml, self.answerrecordworkspace);

        let codewithhighlightBlock = Blockly.JavaScript.workspaceToCode(
          self.answerrecordworkspace
        );
        codewithhighlightBlock = codewithhighlightBlock.split("\n");
        var code = "";

        //delete highlightBlock
        for (var i = 0; i < codewithhighlightBlock.length; i++) {
          if (codewithhighlightBlock[i].indexOf("highlightBlock") == -1)
            code += codewithhighlightBlock[i] + "\n";
        }
              self.resetCanvas();
        eval(code);
      } else {
        self.answerRecord = 1;
      }
    },

    getAnswerRecord: function() {
      const self = this;
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost/ct_api/readAnswerRecord.php")
          .then(response => {
            resolve(response.data);
          })
          .catch(e => {
            reject(console.log(e));
          });
      });
    },

    getAnswerRecordTopic: function(res, n) {
      const self = this;
      let path = res.topic[n - 1];
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

    setAnswerRecordTopic: function(res) {
      const self = this;
      document.getElementById("InstructionAnswerRecord").innerHTML = "";
      document.getElementById("MissionAnswerRecord").innerHTML =
        res.topic.Mission;
      for (let i = 0; i < res.topic.Instruction.length; i++) {
        document.getElementById("InstructionAnswerRecord").innerHTML +=
          res.topic.Instruction[i];
      }
    },

    closedialog: function() {
      const self = this;
      self.answerrecorddialog1 = false;
      this.$emit("update", false);
    },

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

    drawLine: function(startX, startY, endX, endY, penWidth) {
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
      oline.draw("svg1");
      n.setList(oline);
    },

    drawCurve: function(startX, startY, endX, endY, crlX, ctlY, penWidth) {
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
      ocurve.draw("svg1");
      n.setList(ocurve);
    },

    drawrectangle: function(startX, startY, width, height, penWidth, brush) {
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
      orectangle.draw("svg1");
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
      endAngle
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
      Cellipse.draw("svg1");
      n.setList(Cellipse);
    },

    rotate: function(angle) {
      const self = this;
      self.clearCanvas();
      for (let i = 0; i < self.Canvas.length; i++) {
        self.Canvas[i].rotate(
          [angle, self.centerpoint[0], self.centerpoint[1]],
          "svg1"
        );
      }
    },

    translate: function(dx, dy) {
      const self = this;
      self.clearCanvas();
      for (let i = 0; i < self.Canvas.length; i++) {
        self.Canvas[i].translate([dx, dy], "svg1");
      }
    },

    clearCanvas: function() {
      document.getElementById("svg1").innerHTML = "";
    },

    resetCanvas: function() {
      const self = this;
      self.clearCanvas();
      self.Canvas.length = 0;
      self.classCounter = 0;
      self.findsamegroup = -1;
      self.penColor = "#000000";
      self.centerpoint = [];
    },

    setPenColor: function(color) {
      const self = this;
      self.penColor = color;
    }
  }
};
</script>
