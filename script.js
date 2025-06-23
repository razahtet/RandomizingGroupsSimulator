const nameInput = document.getElementById("nameInput");
const groupInput = document.getElementById("groupInput");
const outputDiv = document.getElementById("outputDiv");
const nameDiv = document.getElementById("nameDiv");
const submitB = document.getElementById("submitB");
const gSubmit = document.getElementById("gSubmit");
const addPutButton = document.getElementById("addPutButton");
const clearB = document.getElementById("clearB");
const nh = document.getElementById("nh");
let aNA = [];
let numGr = 0;
let groupObject = {};
const dropFirst = document.getElementById("dropFirst");
const dropSecond = document.getElementById("dropSecond");
const pSubmit = document.getElementById("pSubmit");
const gh = document.getElementById("gh");
let selectS = document.querySelectorAll(".selectS");
let checkS = document.querySelectorAll(".checkS");
let nameC = document.querySelectorAll(".nameC");
const puttingDiv = document.getElementById("puttingDiv");
const checkAllInputs = document.getElementById("checkAllInputs");
let allChecked = false;
const errorMessage = document.getElementById("errorMessage");
document.addEventListener("keydown", keyPressed);
submitB.addEventListener("click", putDownName);
clearB.addEventListener("click", clearE);
gSubmit.addEventListener("click", makeGroups);
addPutButton.addEventListener("click", addSeparation);
checkAllInputs.addEventListener("click", doTheCheck);
pSubmit.classList.add("checkS");
pSubmit.selectUno = dropFirst;
pSubmit.selectDos = dropSecond;
nameInput.focus();

function keyPressed(event) {
  if (event.keyCode == 13) {
    putDownName();
  }
}

function putDownName() {
  const name = nameInput.value.trim();
  errorMessage.innerHTML = "";
  if (name == "") {
    errorMessage.innerHTML = "Names in the list cannot be blank. Please type in a name.";
  } else if (aNA.includes(name)) {
    errorMessage.innerHTML = "The name is already in the list. Please type in another name.";
  } else {
    //put down on list
    errorMessage.innerHTML = "";
    const newN = document.createElement("h2");
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
    for (let i = 0; i < selectS.length; i++) {
      const optionE = document.createElement("option");
      optionE.innerHTML = name;
      selectS[i].appendChild(optionE);
    }
  }
}

function addSeparation() {
  const outsideDiv = document.createElement("div");
  outsideDiv.classList.add("dropE");

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.marginLeft = "100px";
  deleteButton.addEventListener("click", deleteSeparation);

  const inputDiv = document.createElement("div");
  const sepCheck = document.createElement("input");
  sepCheck.type = "checkbox";
  sepCheck.classList.add("checkS");
  inputDiv.innerHTML = "Separate!";
  inputDiv.classList.add("inputDV");

  const selectDiv1 = document.createElement("select");
  const selectDiv2 = document.createElement("select");
  selectDiv1.classList.add("selectS");
  selectDiv2.classList.add("selectS");
  selectS = document.querySelectorAll(".selectS");
  sepCheck.selectUno = selectDiv1;
  sepCheck.selectDos = selectDiv2;

  for (let i = 0; i < aNA.length; i++) {
    const optionN = document.createElement("option");
    const optionN2 = document.createElement("option");
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
  for (let i = 0; i < selectS.length; i++) {
    selectS[i].innerHTML = "";
  }
  for (let i = 0; i < checkS.length; i++) {
    checkS[i].checked = false;
  }
  updateNamesNum();
  updateGroupsNum();
}

function makeGroups() {
  shuffle();
  groupObject = {};
  const rG = parseInt(groupInput.value, 10);
  numGr = 0;
  if (rG > 0) {
    if (rG == 1) {
      groupObject["Group 1"] = {};
      for (let i = 0; i < aNA.length; i++) {
        groupObject["Group 1"]["person " + (i + 1)] = aNA[i];
      }
    } else {
      for (let i = 0; i < rG; i++) {
        groupObject["Group " + (numGr + 1)] = {};
        numGr += 1;
      }
      let nameDown = 0;
      for (let i = 0; i < aNA.length / rG; i++) {
        for (let gro in groupObject) {
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
  for (let grouP in groupObject) {
    const outsideBox = document.createElement("div");
    outputDiv.append(outsideBox);
    const groupNameDiv = document.createElement("div");
    groupNameDiv.innerHTML = grouP + ":";
    groupNameDiv.nameG = grouP;
    groupNameDiv.classList.add("smallO");
    groupNameDiv.addEventListener("click", deleteGroup);
    outsideBox.append(groupNameDiv);
    const personDiv = document.createElement("div");
    if (Object.keys(groupObject[grouP]).length == 0) {
      personDiv.innerHTML = "No people in this group";
      personDiv.classList.add("noPeople");
    } else {
      for (let perS in groupObject[grouP]) {
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
  updateGroupsNum();
}

function deleteName() {
  const nameToDelete = this.innerHTML;
  let indexToDelete = -1;
  
  // Find the correct index in the aNA array
  for (let i = 0; i < aNA.length; i++) {
    if (aNA[i] === nameToDelete) {
      indexToDelete = i;
      break;
    }
  }
  
  // Remove from aNA array
  if (indexToDelete !== -1) {
    aNA.splice(indexToDelete, 1);
  }
  
  // Remove from all select elements
  updateSelects();
  for (let i = 0; i < selectS.length; i++) {
    // Find and remove the option with matching text
    inner: for (let j = selectS[i].options.length - 1; j >= 0; j--) {
      if (selectS[i].options[j].text === nameToDelete) {
        selectS[i].removeChild(selectS[i].options[j]);
        break inner;
      }
    }
  }
  
  // Remove from DOM
  nameDiv.removeChild(this);
  
  // Update the numB property for remaining name elements
  updateNamec();
  for (let i = 0; i < nameC.length; i++) {
    nameC[i].numB = i + 1;
  }
  
  // Check if groups exist and handle group deletion properly
  if (Object.keys(groupObject).length > 0) {
    let groupsToDelete = [];
    
    // Find all groups that contain this person and remove them
    for (let grouS in groupObject) {
      for (let perS in groupObject[grouS]) {
        if (groupObject[grouS][perS] == nameToDelete) {
          // Remove the person from the group
          delete groupObject[grouS][perS];
          
          // If the group is now empty, mark it for deletion
          if (Object.keys(groupObject[grouS]).length == 0) {
            groupsToDelete.push(grouS);
          }
          break; // Person can only be in one group, so break after finding them
        }
      }
    }
    
    // Delete empty groups
    for (let groupToDelete of groupsToDelete) {
      delete groupObject[groupToDelete];
    }
    
    // Update the display
    printGroupsOut();
  }
  
  updateNamesNum();
  updateGroupsNum();
}

function doTheCheck() {
  updateChecks();
  if (allChecked == false) {
    allChecked = true;
    this.innerHTML = "Uncheck All of Them";
  } else {
    allChecked = false;
    this.innerHTML = "Check All of Them";
  }
  for (let i = 0; i < checkS.length; i++) {
    checkS[i].checked = allChecked;
  }
}

function separateOthers(kNum) {
  updateChecks();
  updateSelects();
  let selectK = 0;
  let maxAttempts = 100; // Prevent infinite loops
  
  for (let i = 0; i < checkS.length; i++) {
    if (checkS[i].checked == true) {
      let person1Name = selectS[selectK].options[selectS[selectK].selectedIndex].text;
      let person2Name = selectS[selectK + 1].options[selectS[selectK + 1].selectedIndex].text;
      
      // Find which groups these people are in
      let person1Group = null;
      let person2Group = null;
      let person1Key = null;
      let person2Key = null;
      
      for (let gro in groupObject) {
        for (let person in groupObject[gro]) {
          if (groupObject[gro][person] == person1Name) {
            person1Group = gro;
            person1Key = person;
          }
          if (groupObject[gro][person] == person2Name) {
            person2Group = gro;
            person2Key = person;
          }
        }
      }
      
      // If both people are in the same group, separate them
      if (person1Group && person2Group && person1Group == person2Group) {
        let attempts = 0;
        let separated = false;
        
        while (!separated && attempts < maxAttempts) {
          // Find a different group to move person1 to
          let availableGroups = Object.keys(groupObject).filter(g => g !== person1Group);
          
          if (availableGroups.length > 0) {
            // Try to find a group where person2 is not present
            let targetGroup = null;
            for (let ag of availableGroups) {
              let hasConflict = false;
              for (let p in groupObject[ag]) {
                if (groupObject[ag][p] == person2Name) {
                  hasConflict = true;
                  break;
                }
              }
              if (!hasConflict) {
                targetGroup = ag;
                break;
              }
            }
            
            // If no conflict-free group found, use any available group
            if (!targetGroup) {
              targetGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
            }
            
            // Find someone in the target group to swap with
            let targetGroupKeys = Object.keys(groupObject[targetGroup]);
            if (targetGroupKeys.length > 0) {
              let randomPersonKey = targetGroupKeys[Math.floor(Math.random() * targetGroupKeys.length)];
              let personToSwap = groupObject[targetGroup][randomPersonKey];
              
              // Perform the swap
              groupObject[targetGroup][randomPersonKey] = person1Name;
              groupObject[person1Group][person1Key] = personToSwap;
              separated = true;
            }
          }
          attempts++;
        }
      }
      selectK += 2;
    }
  }
}

function shuffle() {
  if (aNA.length >= 1) {
    for (let i = 0; i < 100; i++) {
      let random = Math.floor(Math.random() * aNA.length);
      let random2 = Math.floor(Math.random() * aNA.length);
      let extracup = aNA[random];
      aNA[random] = aNA[random2];
      aNA[random2] = extracup;
    }
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
