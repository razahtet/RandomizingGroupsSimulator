const nameInput = document.getElementById("nameInput");
const groupInput = document.getElementById("groupInput");
const outputDiv = document.getElementById("outputDiv");
const nameDiv = document.getElementById("nameDiv");
const submitB = document.getElementById("submitB");
const gSubmit = document.getElementById("gSubmit");
const addPutButton = document.getElementById("addPutButton");
const clearB = document.getElementById("clearB");
const nh = document.getElementById("nh");
const uploadButton = document.getElementById("uploadButton");
const exportButton = document.getElementById("exportButton");
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
const viewInstructionsBtn = document.getElementById("viewInstructionsBtn");
const instructionsOverlay = document.getElementById("instructionsOverlay");
const closeInstructionsBtn = document.getElementById("closeInstructionsBtn");

document.addEventListener("keydown", keyPressed);
submitB.addEventListener("click", putDownName);
clearB.addEventListener("click", clearE);
gSubmit.addEventListener("click", makeGroups);
addPutButton.addEventListener("click", addSeparation);
checkAllInputs.addEventListener("click", doTheCheck);
uploadButton.addEventListener("click", handleFileUpload);
viewInstructionsBtn.addEventListener("click", showInstructions);
closeInstructionsBtn.addEventListener("click", hideInstructions);
instructionsOverlay.addEventListener("click", handleOverlayClick);
pSubmit.classList.add("checkS");
pSubmit.selectUno = dropFirst;
pSubmit.selectDos = dropSecond;
nameInput.focus();
getReadyToExport("");

function keyPressed(event) {
  if (event.keyCode == 13) {
    putDownName();
  } else if (event.keyCode == 46) {
    clearE();
  } else if (event.key === 'Escape' && instructionsOverlay.classList.contains('show')) {
    hideInstructions();
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

    // Update constraint selections
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
  deleteButton.classList.add("actionBtn");
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
  if (confirm("Are you sure you want to clear everything?")) {
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
    // Clear file name display
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (fileNameDisplay) {
      fileNameDisplay.textContent = 'No File Uploaded';
    }
    updateNamesNum();
    updateGroupsNum();
  }
}

function makeGroups() {
  getReadyToExport("");
  shuffle();
  groupObject = {};
  const rG = parseInt(groupInput.value, 10);
  numGr = 0;
  errorMessage.innerHTML = "";
  
  if (rG > 0) {
    // Check if separations are possible before creating groups
    const separationCheck = checkSeparationsPossible(rG);
    if (!separationCheck.possible) {
      errorMessage.innerHTML = separationCheck.message;
      return;
    }
    
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
      const separationResult = separateOthersEfficient(rG);
      if (!separationResult.success) {
        errorMessage.innerHTML = separationResult.message;
        return;
      }
    }
    printGroupsOut();
  }
}

function printGroupsOut() {
  outputDiv.innerHTML = "";
  let printedVersion = "";
  for (let grouP in groupObject) {
    const outsideBox = document.createElement("div");
    outputDiv.append(outsideBox);

    // Group Part (e.g. Group 1:)
    const groupNameDiv = document.createElement("div");
    groupNameDiv.innerHTML = grouP + ":";
    printedVersion = printedVersion + groupNameDiv.innerText + " ";
    groupNameDiv.nameG = grouP;
    groupNameDiv.classList.add("smallO");
    groupNameDiv.addEventListener("click", deleteGroup);
    outsideBox.append(groupNameDiv);

    // The people in the group
    const personDiv = document.createElement("div");
    if (Object.keys(groupObject[grouP]).length == 0) {
      personDiv.innerHTML = "No people in this group";
      personDiv.classList.add("noPeople");
    } else {
      for (let perS in groupObject[grouP]) {
        personDiv.innerHTML = personDiv.innerHTML + groupObject[grouP][perS] + ", ";
      }
      personDiv.classList.add("pepNames");
    }
    personDiv.innerHTML = personDiv.innerHTML.replace(/,\s*$/, "");
    printedVersion = printedVersion + personDiv.innerText + "\n";
    outsideBox.append(personDiv);
  }
  printedVersion = printedVersion.replace(/,\s*$/, "");
  getReadyToExport(printedVersion);
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
  
  // Find the correct index
  for (let i = 0; i < aNA.length; i++) {
    if (aNA[i] === nameToDelete) {
      indexToDelete = i;
      break;
    }
  }
  
  // Remove
  if (indexToDelete !== -1) {
    aNA.splice(indexToDelete, 1);
  }
  
  // Remove from all constraint select dropdown elements
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

function checkSeparationsPossible(numGroups) {
  updateChecks();
  updateSelects();
  
  // If only one group, separations are impossible
  if (numGroups <= 1) {
    let hasActiveSeparations = false;
    let selectK = 0;
    for (let i = 0; i < checkS.length; i++) {
      if (checkS[i].checked == true) {
        hasActiveSeparations = true;
        break;
      }
    }
    if (hasActiveSeparations) {
      return {
        possible: false,
        message: "Error: Cannot separate people when there is only 1 group. Please increase the number of groups or uncheck the separations."
      };
    }
  }
  
  // Get all active separation pairs
  let separationPairs = [];
  let selectK = 0;
  for (let i = 0; i < checkS.length; i++) {
    if (checkS[i].checked == true) {
      let person1Name = selectS[selectK].options[selectS[selectK].selectedIndex].text;
      let person2Name = selectS[selectK + 1].options[selectS[selectK + 1].selectedIndex].text;
      
      if (person1Name === person2Name) {
        return {
          possible: false,
          message: "Error: Cannot separate a person from themselves. Please select different people in the separation dropdowns."
        };
      }
      
      separationPairs.push([person1Name, person2Name]);
    }
    selectK += 2;
  }
  
  // If no separations requested, it's always possible
  if (separationPairs.length === 0) {
    return { possible: true, message: "" };
  }
  
  // TLet's try to solve the constraint satisfaction problem
  const result = tryAssignPeopleToGroups(aNA, numGroups, separationPairs);
  if (!result.success) {
    return {
      possible: false,
      message: result.message
    };
  }
  
  return { possible: true, message: "" };
}

function separateOthersEfficient(numGroups) {
  updateChecks();
  updateSelects();
  
  // Get all active separation pairs
  let separationPairs = [];
  let selectK = 0;
  for (let i = 0; i < checkS.length; i++) {
    if (checkS[i].checked == true) {
      let person1Name = selectS[selectK].options[selectS[selectK].selectedIndex].text;
      let person2Name = selectS[selectK + 1].options[selectS[selectK + 1].selectedIndex].text;
      separationPairs.push([person1Name, person2Name]);
    }
    selectK += 2;
  }
  
  // If no separations needed, use smart balanced assignment without constraints
  if (separationPairs.length === 0) {
    // Use the smart algorithm even without separations for better balance
    const result = tryAssignPeopleToGroups(aNA, numGroups, []);
    if (result.success) {
      // Reconstruct groupObject based on the optimal assignment
      // Clear current groups
      for (let gro in groupObject) {
        groupObject[gro] = {};
      }
      
      // Assign people to groups based on the smart assignment
      let personCounters = {};
      for (let i = 0; i < numGroups; i++) {
        personCounters["Group " + (i + 1)] = 1;
      }
      
      for (let person in result.assignment) {
        let groupIndex = result.assignment[person];
        let groupName = "Group " + (groupIndex + 1);
        let personKey = "person " + personCounters[groupName];
        groupObject[groupName][personKey] = person;
        personCounters[groupName]++;
      }
    }
    return { success: true, message: "" };
  }
  
  // Use the backtracking algorithm to find optimal assignment with separations
  const result = tryAssignPeopleToGroups(aNA, numGroups, separationPairs);
  if (!result.success) {
    return {
      success: false,
      message: result.message
    };
  }
  
  // Reconstruct groupObject based on the optimal assignment
  // Clear current groups
  for (let gro in groupObject) {
    groupObject[gro] = {};
  }
  
  // Assign people to groups based on the backtracking result
  let personCounters = {};
  for (let i = 0; i < numGroups; i++) {
    personCounters["Group " + (i + 1)] = 1;
  }
  
  for (let person in result.assignment) {
    let groupIndex = result.assignment[person];
    let groupName = "Group " + (groupIndex + 1);
    let personKey = "person " + personCounters[groupName];
    groupObject[groupName][personKey] = person;
    personCounters[groupName]++;
  }
  
  return { success: true, message: "" };
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

function tryAssignPeopleToGroups(people, numGroups, separationPairs) {
  // Create a conflict graph
  let conflicts = {};
  for (let person of people) {
    conflicts[person] = new Set();
  }
  
  for (let [person1, person2] of separationPairs) {
    conflicts[person1].add(person2);
    conflicts[person2].add(person1);
  }
  
  // Calculate ideal group sizes for balanced distribution
  const totalPeople = people.length;
  const baseSize = Math.floor(totalPeople / numGroups);
  const remainder = totalPeople % numGroups;
  
  // Create target sizes for each group (some groups get +1 person if there's remainder)
  let targetSizes = [];
  for (let i = 0; i < numGroups; i++) {
    targetSizes.push(baseSize + (i < remainder ? 1 : 0));
  }
  
  // Try multiple attempts with different strategies to find the best solution
  let bestSolution = null;
  let bestScore = -1;
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Shuffle people array to add randomness to the assignment process
    let shuffledPeople = [...people];
    for (let i = shuffledPeople.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPeople[i], shuffledPeople[j]] = [shuffledPeople[j], shuffledPeople[i]];
    }
    
    // Try to assign people to groups using smart backtracking
    let assignment = {};
    let groups = [];
    for (let i = 0; i < numGroups; i++) {
      groups.push([]);
    }
    
    function canAssignToGroup(person, groupIndex) {
      // Check if this person conflicts with anyone already in this group
      for (let otherPerson of groups[groupIndex]) {
        if (conflicts[person].has(otherPerson)) {
          return false;
        }
      }
      return true;
    }
    
    function getGroupPriority(groupIndex, currentPersonIndex, remainingPeople) {
      let priority = 0;
      
      // Determine if this is an extreme case scenario
      const peoplePerGroup = totalPeople / numGroups;
      const isExtremeCaseScenario = peoplePerGroup <= 1;
      
      const currentSize = groups[groupIndex].length;
      const targetSize = targetSizes[groupIndex];
      
      if (isExtremeCaseScenario) {
        // In extreme cases, prioritize empty groups first to spread people out
        if (currentSize === 0) {
          priority += 2000; // Very high priority for empty groups
        } else if (currentSize === 1) {
          priority -= 500; // Lower priority for groups that already have someone
        } else {
          priority -= 1000; // Even lower priority for groups with multiple people
        }
        
        // Still respect target sizes but with less weight
        if (currentSize < targetSize) {
          priority += 100;
        } else if (currentSize >= targetSize) {
          priority -= 200;
        }
      } else {
        // Normal case: prefer groups under target size
        if (currentSize < targetSize) {
          priority += 1000; // High priority for under-target groups
          priority += (targetSize - currentSize) * 100; // Higher priority for more under-target
        } else if (currentSize >= targetSize) {
          priority -= 1000; // Low priority for at-or-over-target groups
        }
        
        // Avoid creating groups that would be too large
        const maxAllowedSize = Math.ceil(totalPeople / numGroups) + 1;
        if (currentSize >= maxAllowedSize) {
          priority -= 10000; // Very low priority for oversized groups
        }
      }
      
      // Add some randomness to break ties
      priority += Math.random() * 10;
      
      return priority;
    }
    
    function backtrack(personIndex) {
      if (personIndex === shuffledPeople.length) {
        return true; // Successfully assigned all people
      }
      
      let person = shuffledPeople[personIndex];
      let remainingPeople = shuffledPeople.length - personIndex;
      
      // Create array of group indices with priorities
      let groupOptions = [];
      for (let i = 0; i < numGroups; i++) {
        if (canAssignToGroup(person, i)) {
          groupOptions.push({
            index: i,
            priority: getGroupPriority(i, personIndex, remainingPeople)
          });
        }
      }
      
      // Sort by priority (highest first)
      groupOptions.sort((a, b) => b.priority - a.priority);
      
      // Try assigning this person to each viable group in priority order
      for (let option of groupOptions) {
        let groupIndex = option.index;
        
        // Assign person to this group
        groups[groupIndex].push(person);
        assignment[person] = groupIndex;
        
        // Recursively try to assign the next person
        if (backtrack(personIndex + 1)) {
          return true;
        }
        
        // Backtrack: remove person from this group
        groups[groupIndex].pop();
        delete assignment[person];
      }
      
      return false; // Could not assign this person to any group
    }
    
    if (backtrack(0)) {
      // Calculate score for this solution
      let score = calculateSolutionScore(groups, targetSizes);
      if (score > bestScore) {
        bestScore = score;
        bestSolution = { success: true, assignment: assignment, groups: groups };
      }
      
      // Best solution
      if (score >= 1000) {
        break;
      }
    }
  }
  
  if (bestSolution) {
    return bestSolution;
  } else {
    return { 
      success: false, 
      message: "Error: The separation constraints cannot be satisfied with the given number of groups while maintaining balanced group sizes. Please increase the number of groups or reduce the separation requirements." 
    };
  }
}

function calculateSolutionScore(groups, targetSizes) {
  let score = 0;
  let emptyGroups = 0;
  let singlePersonGroups = 0;
  let totalPeople = 0;
  let totalGroups = groups.length;
  
  // Count total people and group types
  for (let i = 0; i < groups.length; i++) {
    const groupSize = groups[i].length;
    totalPeople += groupSize;
    
    if (groupSize === 0) {
      emptyGroups++;
    } else if (groupSize === 1) {
      singlePersonGroups++;
    }
  }
  
  // Calculate the ideal scenario based on people-to-groups ratio
  const peoplePerGroup = totalPeople / totalGroups;
  const isExtremeCaseScenario = peoplePerGroup <= 1; // More groups than people or equal
  
  for (let i = 0; i < groups.length; i++) {
    const groupSize = groups[i].length;
    const targetSize = targetSizes[i];
    
    if (groupSize === 0) {
      if (isExtremeCaseScenario) {
        // In extreme cases, empty groups are expected and acceptable
        score -= 10; // Very light penalty for empty groups
      } else {
        // In normal cases, avoid empty groups
        score -= 200; // Moderate penalty for empty groups
      }
    } else if (groupSize === 1) {
      if (isExtremeCaseScenario) {
        // In extreme cases, single-person groups are preferred
        score += 100; // Bonus for single-person groups
      } else {
        // In normal cases, single-person groups are less desirable
        score -= 50; // Light penalty for single-person groups
      }
    } else {
      // Multiple people in a group
      if (isExtremeCaseScenario) {
        // In extreme cases, this might not be ideal but still acceptable
        score += 50; // Moderate bonus
      } else {
        // In normal cases, this is preferred so that no one is left alone (as long as there are no constraint conflicts)
        score += 100; // High bonus for groups with multiple people
      }
    }
    
    // Bonus for being close to target size (always important)
    const sizeDifference = Math.abs(groupSize - targetSize);
    if (sizeDifference === 0) {
      score += 150; // Perfect size match bonus
    } else {
      score -= sizeDifference * 15; // Penalty for size deviation
    }
  }
  
  // Adaptive bonuses based on scenario
  if (isExtremeCaseScenario) {
    // In extreme cases, having all people assigned is most important
    if (totalPeople > 0 && singlePersonGroups === totalPeople) {
      score += 500; // Big bonus for optimal extreme case solution
    }
  } else {
    // In normal cases, balanced groups are preferred
    if (emptyGroups === 0) {
      score += 300; // Bonus for no empty groups
    }
    if (singlePersonGroups === 0 && totalPeople > totalGroups) {
      score += 200; // Bonus for no single-person groups when we have enough people
    }
  }
  
  return score;
}

// randomizing the names in the groups
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

function handleFileUpload() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt';
  fileInput.style.display = 'none'; // hidden file input
  
  // Add event listener for file selection
  fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    
    if (!file) {
      errorMessage.innerHTML = "No file selected. Please choose a text file to upload.";
      return;
    }
    
    if (file.type !== "text/plain") {
      errorMessage.innerHTML = "Only text files (.txt) are allowed. Please select a valid text file.";
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const content = e.target.result;
      processFileContent(content, file.name);
    };
    
    reader.onerror = function(e) {
      errorMessage.innerHTML = "Error reading the file. Please try again or select a different file.";
    };
    
    reader.readAsText(file);
  });
  
  document.body.appendChild(fileInput);
  fileInput.click();
  
  // Clean up: remove the hidden input after use
  fileInput.remove();
}

function processFileContent(content, fileName) {
  try {
    // Clear existing names
    aNA = [];
    nameDiv.innerHTML = "";
    
    // Process the file content
    const lines = content.split(/\r?\n/);
    const names = [];
    
    for (let line of lines) {
      const name = line.trim();
      if (name && !names.includes(name)) {
        names.push(name);
      }
    }
    
    // Clear all separation dropdowns first
    updateSelects();
    for (let i = 0; i < selectS.length; i++) {
      while (selectS[i].firstChild) {
        selectS[i].removeChild(selectS[i].firstChild);
      }
    }
    
    // Add names to the simulator
    for (let name of names) {
      const newN = document.createElement("h2");
      newN.innerHTML = name;
      aNA.push(name);
      newN.classList.add("nameC");
      newN.numB = aNA.length;
      newN.addEventListener("click", deleteName);
      nameDiv.appendChild(newN);
      
      // Add to select options
      updateSelects();
      for (let i = 0; i < selectS.length; i++) {
        const optionE = document.createElement("option");
        optionE.innerHTML = name;
        selectS[i].appendChild(optionE);
      }
    }
    
    // Display the file name
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (fileNameDisplay) {
      fileNameDisplay.textContent = fileName;
    }
    
    errorMessage.innerHTML = "";
    updateNamesNum();
    
  } catch (error) {
    errorMessage.innerHTML = "Error processing the file: " + error.message;
  }
}

// Initialize the file name display when the page loads
function initializeFileNameDisplay() {
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  if (fileNameDisplay) {
    fileNameDisplay.textContent = 'No File Uploaded';
  }
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', initializeFileNameDisplay);

// Instructions Panel Functions
function showInstructions() {
  instructionsOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hideInstructions() {
  instructionsOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

function handleOverlayClick(event) {
  // Close the panel if user clicks on the overlay (not the panel itself)
  if (event.target === instructionsOverlay) {
    hideInstructions();
  }
}

// Exporting List of Groups Functions

function getReadyToExport(endResult) {
  errorMessage.innerHTML = "";
  exportButton.removeEventListener("click", exportGroups);
  exportButton.addEventListener("click", exportGroups);

  function exportGroups() {
    errorMessage.innerHTML = "";
    if (endResult == "" || groupObject == {}) {
      exportError();
    } else {
      const groups = new Blob([endResult], { type: "text/plain" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(groups);
      link.download = "groups.txt";
      link.click();

      URL.revokeObjectURL(link.href);
    }
  }

  function exportError() {
    errorMessage.innerHTML = "Nothing to export yet. Please generate random groups first.";
  }
}
