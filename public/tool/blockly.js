Blockly.JavaScript['line'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endpostionx = Blockly.JavaScript.valueToCode(block, 'endPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endpostiony = Blockly.JavaScript.valueToCode(block, 'endPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawLine(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_endpostionx + ' , ' + value_endpostiony + ' , ' + value_penwidth + ');\n';
  return code;
};

Blockly.JavaScript['curve'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endpostionx = Blockly.JavaScript.valueToCode(block, 'endPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endpostiony = Blockly.JavaScript.valueToCode(block, 'endPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_controlpostionx = Blockly.JavaScript.valueToCode(block, 'controlPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_controlpostiony = Blockly.JavaScript.valueToCode(block, 'controlPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawCurve(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_endpostionx + ' , ' + value_endpostiony + ' , ' + value_controlpostionx + ' , ' + value_controlpostiony + ' , ' + value_penwidth + ');\n';
  return code;
};

Blockly.JavaScript['square'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_length = Blockly.JavaScript.valueToCode(block, 'length', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_brush = block.getFieldValue('brush') === 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawrectangle(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_length + ' , ' + value_length + ' , ' + value_penwidth + ' , ' + checkbox_brush + ');\n';
  return code;
};

Blockly.JavaScript['rectangle'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_brush = block.getFieldValue('brush') === 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawrectangle(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_height + ' , ' + value_width + ' , ' + value_penwidth + ' , ' + checkbox_brush + ');\n';
  return code;
};

Blockly.JavaScript['circle'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radius = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_brush = block.getFieldValue('brush') === 'TRUE';
  var value_cusdata = Blockly.JavaScript.valueToCode(block, 'cusData', Blockly.JavaScript.ORDER_NONE);
  var angle = value_cusdata.split(',').map(Number);
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawEllipse(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_radius + ' , ' + value_radius + ' , ' + value_penwidth + ' , ' + checkbox_brush + ',' + angle[0] + ',' + angle[1] + ');\n';
  return code;
};

Blockly.JavaScript['circlefull'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '0,0';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['circlecustom'] = function(block) {
  var angle_startangle = block.getFieldValue('startAngle');
  var angle_endangle = block.getFieldValue('endAngle');
  // TODO: Assemble JavaScript into code variable.
  var code = '' + angle_startangle + ',' + angle_endangle + '';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['ellipse'] = function(block) {
  var value_startpostionx = Blockly.JavaScript.valueToCode(block, 'startPostionX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startpostiony = Blockly.JavaScript.valueToCode(block, 'startPostionY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radiusx = Blockly.JavaScript.valueToCode(block, 'radiusX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radiusy = Blockly.JavaScript.valueToCode(block, 'radiusY', Blockly.JavaScript.ORDER_ATOMIC);
  var value_penwidth = Blockly.JavaScript.valueToCode(block, 'penWidth', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_brush = block.getFieldValue('brush') === 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.drawEllipse(' + value_startpostionx + ' , ' + value_startpostiony + ' , ' + value_radiusx + ' , ' + value_radiusy + ' , ' + value_penwidth + ' , ' + checkbox_brush + ',"0","0");\n';
  return code;
};

Blockly.JavaScript['pencolor'] = function(block) {
  var dropdown_color = block.getFieldValue('color');
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.setPenColor(' + '"' + dropdown_color + '"' + ');\n';
  return code;
};

Blockly.JavaScript['grouprotate'] = function(block) {
  var angle_rotateangle = block.getFieldValue('rotateAngle');
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.rotate(' + angle_rotateangle + ');\n';
  return code;
};

Blockly.JavaScript['translateblock'] = function(block) {
  var value_dx = Blockly.JavaScript.valueToCode(block, 'dx', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dy = Blockly.JavaScript.valueToCode(block, 'dy', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.translate(' + value_dx + ',' + value_dy + ');\n';
  return code;
};

Blockly.JavaScript['centerpointblock'] = function(block) {
  var value_centerpointx = Blockly.JavaScript.valueToCode(block, 'centerpointX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_centerpointy = Blockly.JavaScript.valueToCode(block, 'centerpointY', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'self.setCenterPoint(' + value_centerpointx + ' , ' + value_centerpointy + ');\n';
  return code;
};


Blockly.Blocks['line'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("??????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("endPostionX")
        .setCheck("Number")
        .appendField(")  ???  (");
    this.appendValueInput("endPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(") ,  ????????????");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['curve'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("??????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("endPostionX")
        .setCheck("Number")
        .appendField(")  ???  (");
    this.appendValueInput("endPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("controlPostionX")
        .setCheck("Number")
        .appendField(") ,  ????????? (");
    this.appendValueInput("controlPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(") ,  ????????????");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['square'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("?????????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("length")
        .setCheck("Number")
        .appendField(") ,  ??????");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(",  ????????????");
    this.appendDummyInput()
        .appendField(",  ??????")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "brush");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rectangle'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("??????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField(") ,  ?????? ( ???");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField(", ???");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(") ,  ????????????");
    this.appendDummyInput()
        .appendField(",  ??????")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "brush");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['circle'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("??????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("radius")
        .setCheck("Number")
        .appendField(") ,  ??????");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(",  ????????????");
    this.appendDummyInput()
        .appendField(",  ??????")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "brush");
    this.appendValueInput("cusData")
        .setCheck(null)
        .appendField(",  ????????????");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['circlefull'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("????????????"), "0");
    this.setOutput(true, "Number");
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['circlecustom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("???")
        .appendField(new Blockly.FieldAngle(0), "startAngle")
        .appendField("???")
        .appendField(new Blockly.FieldAngle(90), "endAngle")
        .appendField("?????????");
    this.setOutput(true, "Number");
    this.setColour(30);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ellipse'] = {
  init: function() {
    this.appendValueInput("startPostionX")
        .setCheck("Number")
        .appendField("??????     ?????? (");
    this.appendValueInput("startPostionY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("radiusX")
        .setCheck("Number")
        .appendField(") ,  ??????(");
    this.appendValueInput("radiusY")
        .setCheck("Number")
        .appendField(",");
    this.appendValueInput("penWidth")
        .setCheck("Number")
        .appendField(") ,  ????????????");
    this.appendDummyInput()
        .appendField(",  ??????")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "brush");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pencolor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("????????????")
        .appendField(new Blockly.FieldDropdown([["??????","red"], ["??????","orange"], ["??????","yellow"], ["??????","green"], ["??????","blue"], ["??????","purple"], ["??????","white"], ["??????","black"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['grouprotate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("????????????")
        .appendField(new Blockly.FieldAngle(90), "rotateAngle");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['translateblock'] = {
  init: function() {
    this.appendValueInput("dx")
        .setCheck("Number")
        .appendField("???????????? x ??????");
    this.appendValueInput("dy")
        .setCheck("Number")
        .appendField("?????? ,  ????????? y ??????");
    this.appendDummyInput()
        .appendField("??????");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['centerpointblock'] = {
  init: function() {
    this.appendValueInput("centerpointX")
        .setCheck(null)
        .appendField("??? (");
    this.appendValueInput("centerpointY")
        .setCheck(null)
        .appendField(",");
    this.appendDummyInput()
        .appendField(") ????????????");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

