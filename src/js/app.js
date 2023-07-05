const playersAmount = document.querySelector("#players-amount");
const mafiaAmount = document.querySelector("#mafia-amount");
const startGameBtn = document.querySelector(".modal-start-game .start");
const inputPlayersAmount = document.querySelector("input#players-amount");
const inputMafiaAmount = document.querySelector("input#mafia-amount");
const modalStartGame = document.querySelector(".modal-start-game");
const modalBorder = document.querySelector(".modal-border");
const boardGame = document.querySelector(".board-game");
const boardGameBorder = document.querySelector(".board-game-border");
const modalOptions = document.querySelector(".modal-border-option");
const arrowAdminPanel = document.querySelector(".arrow-admin");
const adminPanel = document.querySelector(".admin-panel");
const resetGameButton = document.querySelector("button.reset");
const showRolesButton = document.querySelector("button.show-all-roles");
const modalCheckingQuestion = document.querySelector(
  ".modal-border-checking-question"
);
const modalQuestionYesBtn = document.querySelector(
  ".modal-border-checking-question button.yes"
);
const modalQuestionNoBtn = document.querySelector(
  ".modal-border-checking-question button.no"
);
const playersLive = [];
let roleInGame = [];
const saveOptionsBtn = document.querySelector(".modal-player-option .save");
const cancelOptionsBtn = document.querySelector(".modal-player-option .cancel");
const inputRename = document.querySelector("input#rename");
const selectRole = document.querySelector("select#changeRole");
let optionID;
let killingID;
//role icon
const mafiaIcon = "fa-hand-fist";
const policeIcon = "fa-person-military-pointing";
const medicIcon = "fa-stethoscope";
const jesterIcon = "fa-dumpster";
const sheriffIcon = "fa-user-secret";
const role4Icon = "fa-4";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const countLenght = (deg) => {
  const lenght =
    (deg >= 0 && deg < 90) || (deg >= 180 && deg < 270)
      ? (deg % 90) / 9 + 35
      : 10 - (deg % 90) / 9 + 35;
  return lenght;
};

const createPlayer = (i, players) => {
  const newPlayer = document.createElement("div");
  const deg = (360 / players) * i;
  newPlayer.classList.add("player");
  newPlayer.setAttribute("id", i);
  newPlayer.style.transform = `translate(-50%, -50%) rotate(${deg}deg) translateY(-${countLenght(
    deg
  )}vh) rotate(-${deg}deg)`;
  newPlayer.innerHTML =
    '<div class="name"></div><div class="options"> <i class="fa-regular fa-address-book"></i></div> <div class="showClass"><i class="fa-solid fa-magnifying-glass"></i> </div> <div class="kill"> <i class="fa-solid fa-skull"></i> </div>';
  boardGame.appendChild(newPlayer);
  playersLive.push(newPlayer);
  playersButton();
};

const startGame = (players, mafia) => {
  for (let i = 0; i < mafia; i++) {
    roleInGame.push("mafia");
  }
  extraRoles();
  for (let i = roleInGame.length; i < players; i++) {
    roleInGame.push("police");
  }
  for (let i = 0; i < players; i++) {
    createPlayer(i, players);
  }
  giveRoles();
};

const extraRoles = () => {
  document.querySelector(`input#medic`).checked
    ? roleInGame.push("medic")
    : "none";
  document.querySelector(`input#jester`).checked
    ? roleInGame.push("jester")
    : "none";
  document.querySelector(`input#sheriff`).checked
    ? roleInGame.push("sheriff")
    : "none";
  document.querySelector(`input#role4`).checked
    ? roleInGame.push("role4")
    : "none";
};

const giveRoles = () => {
  const newRolesArray = [];

  for (let i = 0; i < playersLive.length; i++) {
    const randomNumber = getRandomInt(roleInGame.length);
    const selectedRole = roleInGame[randomNumber];
    playersLive[i].setAttribute("role", selectedRole);
    newRolesArray.push(roleInGame[randomNumber]);
    delete roleInGame[randomNumber];

    roleInGame = roleInGame.filter(function (el) {
      return el;
    });
  }

  roleInGame = newRolesArray;
};

const checkForm = () => {
  !(playersAmount.value > 0 && playersAmount.value < 21)
    ? inputPlayersAmount.classList.add("errorInput")
    : inputPlayersAmount.classList.remove("errorInput");
  !(mafiaAmount.value > 0)
    ? inputMafiaAmount.classList.add("errorInput")
    : inputMafiaAmount.classList.remove("errorInput");
  playersAmount.value > 20 ? alert("Maksymalna licba graczy 20!") : 0;

  if (
    playersAmount.value > 0 &&
    mafiaAmount.value > 0 &&
    playersAmount.value < 21
  ) {
    modalStartGame.classList.add("hide");
    modalBorder.classList.add("hide");
    boardGameBorder.classList.remove("hide");
    startGame(playersAmount.value, mafiaAmount.value);
    playersAmount.value = 0;
    mafiaAmount.value = 0;
  }
};

const playersButton = () => {
  playersLive.forEach((player, index) => {
    player
      .querySelector(".kill")
      .setAttribute("onclick", `checkingQuestionKill(${index})`);
    player
      .querySelector(".options")
      .setAttribute("onclick", `showOptions(${index})`);
    player
      .querySelector(".showClass")
      .setAttribute("onclick", `showRole(${index})`);
  });
};

const answerKillingYes = () => {
  playersLive[killingID].classList.add("hide");
  modalCheckingQuestion.classList.add("hide");
};

const answerKillingNo = () => {
  modalCheckingQuestion.classList.add("hide");
};

const checkingQuestionKill = (id) => {
  modalCheckingQuestion.classList.remove("hide");
  killingID = id;
};

const showOptions = (id) => {
  optionID = id;
  modalOptions.classList.remove(`hide`);
  inputRename.value = playersLive[id].querySelector(".name").textContent;
};

const closeOptions = () => {
  modalOptions.classList.add("hide");
  inputRename.value = "";
  selectRole.value = "";
};

const saveOptions = () => {
  const id = optionID;
  playersLive[id].querySelector(".name").textContent = inputRename.value;
  if (selectRole.value !== "") {
    playersLive[id].role = selectRole.value;
  }
  if (
    !playersLive[id]
      .querySelector(".showClass i")
      .classList.contains("fa-magnifying-glass")
  ) {
    let roleParameters = roleInfo(id);
    playersLive[id].querySelector(".showClass i").className = "fa-solid";
    playersLive[id]
      .querySelector(".showClass i")
      .classList.toggle(roleParameters[0]);
    playersLive[id].style.backgroundColor = roleParameters[1];
  }
  closeOptions();
};
const rename = (id, newName) => {
  playersLive[id].querySelector(".name").textContent = newName;
};

const showRole = (id) => {
  let roleParameters = roleInfo(id);
  playersLive[id]
    .querySelector(".showClass i")
    .classList.toggle("fa-magnifying-glass");
  playersLive[id]
    .querySelector(".showClass i")
    .classList.toggle(roleParameters[0]);
  playersLive[id].style.backgroundColor === ""
    ? (playersLive[id].style.backgroundColor = roleParameters[1])
    : (playersLive[id].style.backgroundColor = "");
};

const roleInfo = (id) => {
  let roleIcon;
  let bgRoleColor;
  switch (playersLive[id].role) {
    case "mafia":
      roleIcon = mafiaIcon;
      bgRoleColor = "#6e2626";
      break;
    case "police":
      roleIcon = policeIcon;
      bgRoleColor = "#23438b";
      break;
    case "medic":
      roleIcon = medicIcon;
      bgRoleColor = "#78700c";
      break;
    case "jester":
      roleIcon = jesterIcon;
      bgRoleColor = "#78700c";
      break;
    case "sheriff":
      roleIcon = sheriffIcon;
      bgRoleColor = "#78700c";
      break;
    case "role4":
      roleIcon = role4Icon;
      bgRoleColor = "#78700c";
      break;
  }
  return [roleIcon, bgRoleColor];
};

const hideAllRole = () => {
  playersLive.forEach((player) => {
    player.querySelector(".showClass i").className =
      "fa-solid fa-magnifying-glass";
    player.style.backgroundColor = "";
  });
};

const resetGame = () => {
  console.log("Reset game!");
  playersLive.forEach((player) => {
    player.classList.remove("hide");
  });
  hideAllRole();
  giveRoles();
};

const showAllRoles = () => {
  let showedRole = playersLive.length;
  playersLive.forEach((player) => {
    if (
      player
        .querySelector(".showClass i")
        .classList.contains("fa-magnifying-glass")
    ) {
      showedRole--;
    }
  });
  if (showedRole == 0) {
    hideAllRole();
    for (let i = 0; i < playersLive.length; i++) {
      showRole(i);
    }
  } else {
    hideAllRole();
  }
};

startGameBtn.addEventListener("click", checkForm);
cancelOptionsBtn.addEventListener("click", closeOptions);
saveOptionsBtn.addEventListener("click", saveOptions);
inputRename.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveOptions();
});
modalQuestionYesBtn.addEventListener("click", answerKillingYes);
modalQuestionNoBtn.addEventListener("click", answerKillingNo);
arrowAdminPanel.addEventListener("click", () => {
  adminPanel.classList.toggle("open");
});
resetGameButton.addEventListener("click", resetGame);
showRolesButton.addEventListener("click", showAllRoles);

//startGame(15, 2);
