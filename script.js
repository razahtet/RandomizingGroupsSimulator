var nameInput = document.getElementById("nameInput");
var groupInput = document.getElementById("groupInput");
var outputDiv = document.getElementById("outputDiv");
var nameDiv = document.getElementById("nameDiv");
var submitB = document.getElementById("submitB");
var gSubmit = document.getElementById("gSubmit");
var addPutButton = document.getElementById("addPutButton");
var clearB = document.getElementById("clearB");
var nh = document.getElementById("nh");
var aNA = [];
var numGr = 0;
var groupObject = {};
var dropFirst = document.getElementById("dropFirst");
var dropSecond = document.getElementById("dropSecond");
var pSubmit = document.getElementById("pSubmit");
var gh = document.getElementById("gh");
var dropE = document.querySelectorAll(".dropE");
var selectS = document.querySelectorAll(".selectS");
var checkS = document.querySelectorAll(".checkS");
var nameC = document.querySelectorAll(".nameC");
var puttingDiv = document.getElementById("puttingDiv");
var checkAllInputs = document.getElementById("checkAllInputs");
var allChecked = false;
document.addEventListener("keydown", keyPressed);
submitB.addEventListener("click", putDownName);
clearB.addEventListener("click", clearE);
gSubmit.addEventListener("click", makeGroups);
addPutButton.addEventListener("click", addSeperation);
checkAllInputs.addEventListener("click", doTheCheck);
pSubmit.classList.add("checkS");
pSubmit.selectUno = dropFirst;
pSubmit.selectDos = dropSecond;
nameInput.focus();
dropFirst.disabled = false;
dropSecond.disabled = false;

function keyPressed(event) {
  if (event.keyCode == 13) {
    putDownName();
  }
}

function putDownName() {
  let name = nameInput.value.trim();
  if (name != "") {
    //put down on list
    var newN = document.createElement("h2");
    newN.innerHTML = name;
    aNA.push(name);
    newN.classList.add("nameC");
    newN.numB = aNA.length;
    newN.addEventListener("click", deleteName);
    nameDiv.appendChild(newN);
    nameInput.value = "";
    updateNamesNum();
    // put down in select options - "don't put..."
    updateSelects();
    for (var i = 0; i < selectS.length; i++) {
      var optionE = document.createElement("option");
      optionE.innerHTML = name;
      selectS[i].appendChild(optionE);
    }
  }
}

function addSeperation() {
  var outsideDiv = document.createElement("div");
  outsideDiv.classList.add("dropE");

  var deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.marginLeft = "100px";
  deleteButton.addEventListener("click", deleteSeparation);

  var inputDiv = document.createElement("div");
  var sepCheck = document.createElement("input");
  sepCheck.type = "checkbox";
  sepCheck.classList.add("checkS");
  inputDiv.innerHTML = "Seperate! ";
  inputDiv.classList.add("inputDV");

  var selectDiv1 = document.createElement("select");
  var selectDiv2 = document.createElement("select");
  selectDiv1.classList.add("selectS");
  selectDiv2.classList.add("selectS");
  selectS = document.querySelectorAll(".selectS");
  sepCheck.selectUno = selectDiv1;
  sepCheck.selectDos = selectDiv2;

  for (var i = 0; i < aNA.length; i++) {
    var optionN = document.createElement("option");
    var optionN2 = document.createElement("option");
    optionN.innerHTML = aNA[i];
    optionN2.innerHTML = aNA[i];
    selectDiv1.appendChild(optionN);
    selectDiv2.appendChild(optionN2);
  }

  sepCheck.selectUno = selectDiv1;
  sepCheck.selectDos = selectDiv2;
  inputDiv.appendChild(sepCheck);
  outsideDiv.innerHTML = "Don't Put ";
  outsideDiv.appendChild(selectDiv1);
  outsideDiv.innerHTML = outsideDiv.innerHTML + " with ";
  outsideDiv.appendChild(selectDiv2);
  outsideDiv.innerHTML = outsideDiv.innerHTML + " Please.";
  outsideDiv.appendChild(inputDiv);
  outsideDiv.appendChild(deleteButton);
  puttingDiv.appendChild(outsideDiv);
}

function deleteSeparation() {
  this.parentElement.innerHTML = "";
  updateChecks();
  updateSelects();
}

function clearE() {
  //clear list
  nameDiv.innerHTML = "";
  aNA = [];
  groupObject = {};
  nameInput.value = "";
  groupInput.value = "";
  outputDiv.innerHTML = "";
  //clear select
  updateSelects();
  updateChecks();
  for (var i = 0; i < selectS.length; i++) {
    selectS[i].innerHTML = "";
  }
  for (var i = 0; i < checkS.length; i++) {
    checkS[i].checked = false;
  }
  updateNamesNum();
  updateGroupsNum();
}

function makeGroups() {
  shuffle();
  groupObject = {};
  var cN = 0;
  var rG = parseInt(groupInput.value, 10);
  numGr = 0;
  if (rG > 0) {
    if (rG == 1) {
      groupObject["Group 1"] = {};
      for (var i = 0; i < aNA.length; i++) {
        groupObject["Group 1"]["person " + (i + 1)] = aNA[i];
      }
    } else {
      for (var i = 0; i < rG; i++) {
        groupObject["Group " + (numGr + 1)] = {};
        numGr += 1;
      }
      let nameDown = 0;
      for (var i = 0; i < aNA.length / rG; i++) {
        for (var gro in groupObject) {
          if (aNA[nameDown] != undefined) {
            groupObject[gro]["person " + (i + 1)] = aNA[nameDown];
            nameDown += 1;
          }
        }
      }
      separateOthers(rG);
    }
    printGroupsOut();
  }
}

function printGroupsOut() {
  outputDiv.innerHTML = "";
  for (var grouP in groupObject) {
    let outsideBox = document.createElement("div");
    outputDiv.append(outsideBox);
    let groupNameDiv = document.createElement("div");
    groupNameDiv.innerHTML = grouP + ":";
    groupNameDiv.nameG = grouP;
    groupNameDiv.classList.add("smallO");
    groupNameDiv.addEventListener("click", deleteGroup);
    outsideBox.append(groupNameDiv);
    let personDiv = document.createElement("div");
    if (Object.keys(groupObject[grouP]).length == 0) {
      personDiv.innerHTML = "No people in this group";
      personDiv.classList.add("noPeople");
    } else {
      for (var perS in groupObject[grouP]) {
        personDiv.innerHTML =
          personDiv.innerHTML + groupObject[grouP][perS] + ", ";
      }
      personDiv.classList.add("pepNames");
    }
    personDiv.innerHTML = personDiv.innerHTML.replace(/,\s*$/, "");
    outsideBox.append(personDiv);
  }
  updateGroupsNum();
}

function deleteGroup() {
  delete groupObject[this.nameG];
  outputDiv.removeChild(this.parentElement);
  nameDiv.innerHTML = "";
  for (var i = 0; i < aNA.length; i++) {
    var newN = document.createElement("h2");
    newN.innerHTML = aNA[i];
    newN.classList.add("nameC");
    newN.addEventListener("click", deleteName);
    nameDiv.appendChild(newN);
    nameInput.value = "";
    updateNamesNum();
    newN.numB = aNA.length;
  }
  updateGroupsNum();
}

function deleteName() {
  console.log(this.numB, this.numB-1);
  updateSelects();
  for (var i = 0; i < selectS.length; i++) {
    selectS[i].removeChild(selectS[i].children[this.numB-1]);
  }
  let chingK = this.numB-1;
  for (var i = 0; i <= aNA.length; i++) {
    if (i == this.numB-1) {
      aNA.splice(i, 1);
      break;
    }
  }
  updateNamec();
  for (var i = 0; i < nameC.length; i++) {
    if (i >= chingK) {
      nameC[i].numB = parseInt(nameC[i].numB, 10) - 1;
    }
  }
  if (groupObject["Group 1"] != undefined) {
    firstP: for (var grouS in groupObject) {
      secP: for (var perS in groupObject[grouS]) {
        if (groupObject[grouS][perS] == this.innerHTML) {
          if (Object.keys(groupObject[grouS]).length == 1) {
            delete groupObject[grouS];
          } else {
            delete groupObject[grouS][perS];
          }
        }
      }
    }
    printGroupsOut();
  }
  nameDiv.removeChild(this);
  updateNamesNum();
  updateGroupsNum();
  console.log(aNA);
}

function doTheCheck() {
  updateChecks();
  var recentA = allChecked;
  if (allChecked == false) {
    allChecked = true;
    this.innerHTML = "Uncheck All of Them";
  } else {
    allChecked = false;
    this.innerHTML = "Check All of Them";
  }
  for (var i = 0; i < checkS.length; i++) {
    checkS[i].checked = allChecked;
  }
}

function separateOthers(kNum) {
  updateChecks();
  updateSelects();
  var selectK = 0;
  for (var i = 0; i < checkS.length; i++) {
    if (checkS[i].checked == true) {
      let reqU = {
        first: "",
        second: ""
      };
      let couT = 0;
      pCheck: for (var gro in groupObject) {
        for (var person in groupObject[gro]) {
          if (
            groupObject[gro][person] ==
              selectS[selectK].options[selectS[selectK].selectedIndex].text ||
            groupObject[gro][person] ==
              selectS[selectK + 1].options[selectS[selectK + 1].selectedIndex]
                .text
          ) {
            couT += 1;
            if (couT == 1) {
              reqU["first"] = [gro, person];
            } else {
              reqU["second"] = [gro, person];
              break pCheck;
            }
          }
        }
      }
      if (reqU["first"][0] == reqU["second"][0]) {
        var numV = reqU["first"][0];
        var personV = reqU["first"][1];
        var randomOf = "Group " + Math.floor(Math.random() * kNum + 1);
        if (randomOf == numV) {
          while (randomOf == numV) {
            randomOf = "Group " + Math.floor(Math.random() * kNum + 1);
          }
        }
        var ranP = Math.floor(
          Math.random() * Object.keys(groupObject[randomOf]).length + 1
        );
        var randomPerson = groupObject[randomOf]["person " + ranP];
        var keepC = groupObject[numV][personV];
        groupObject[randomOf]["person " + ranP] = groupObject[numV][personV];
        groupObject[numV][personV] = randomPerson;
      }
      selectK += 2;
    }
  }
}

function shuffle() {
  for (var i = 0; i < 100; i++) {
    var random = Math.floor(Math.random() * aNA.length);
    var random2 = Math.floor(Math.random() * aNA.length);
    var extracup = aNA[random];
    aNA[random] = aNA[random2];
    aNA[random2] = extracup;
  }
}

function updateGroupsNum() {
  gh.innerHTML = "Groups: " + Object.keys(groupObject).length;
}

function updateNamesNum() {
  nh.innerHTML = "Names: " + aNA.length;
}

function updateChecks() {
  checkS = document.querySelectorAll(".checkS");
}

function updateSelects() {
  selectS = document.querySelectorAll(".selectS");
}

function updateNamec() {
  nameC = document.querySelectorAll(".nameC");
}
