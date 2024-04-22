const sendMessageCont = document.querySelector("#sendMessageCont");
const messageText = document.querySelector("#messageText");
const sendMessageBtn = document.querySelector("#sendMessageBtn");
const messagesCont = document.querySelector(".messagesCont");
const emailInput = document.querySelector("#emailInput");
const userName = document.querySelector("#userName");
const roomIdInput = document.querySelector("#roomIdInput");
const roomIdInputLabel = document.querySelector(".roomIdInput label");

const passInput = document.querySelector("#passInput");
const inputsCont = document.querySelector(".inputs");
const showPass = document.querySelector("#showPass");
const loginSubmitForm = document.querySelector("#loginSubmitForm");
const labelEmail = inputsCont.querySelector(".emailInput label");
const labelUserName = inputsCont.querySelector(".userName label");
const labelPass = inputsCont.querySelector(".passInput label");
const loginParent = document.querySelector(".loginParent");
const aboutAcountDiv = document.querySelector(".aboutAcountDiv button");
const submitBtn = document.querySelector("#submitBtn");
const onlineUsersCont = document.querySelector(".onlineUsersCont");
const replayCont = document.querySelector(".replayCont");

const accountSetting = document.querySelector("#accountSetting");
const uploadFileBtn = document.querySelector("#uploadFileBtn");
const upload_image = document.querySelector("#upload_image");
const inputFiles = document.querySelector("#inputFiles");

const imgOpenCont = document.querySelector(".imgOpenCont");
const btnCloseImgOpenCont = document.querySelector("#btnCloseImgOpenCont");

let userInfo = {
  userName: "",
  userId: "",
  userPass: "",
  userGlobalName: "",
  roomId: "",
};
localStorage.removeItem("oldMessages");
if (!localStorage.getItem("userInfo")) {
  loginParent.classList.remove("hide");
} else {
  for (const key in JSON.parse(localStorage.getItem("userInfo"))) {
    userInfo[key] = JSON.parse(localStorage.getItem("userInfo"))[key];
  }
}

sendMessageCont.onsubmit = (e) => {
  e.preventDefault();
  let api =
    "./allRequests.php?setMsg&msg=" +
    messageText.value +
    "&userId=" +
    userInfo.userId +
    "&userGlobalName=" +
    userInfo.userGlobalName +
    "&roomId=" +
    userInfo.roomId;
  if (replayCont.classList.contains("replay")) {
    if (
      document.querySelector(".messageReplayed img") != null &&
      document.querySelector(".messageReplayed img").src
    ) {
      api += "&isReplayedUrlImg=true";
      api +=
        "&repalyedMessage=" +
        replayCont.querySelector(".messageReplayed img").src;
    } else {
      api +=
        "&repalyedMessage=" +
        replayCont.querySelector(".messageReplayed").textContent;
    }
  }

  if (messageText.value) {
    fetch(api)
      .then((res) => res.text())
      .then((val) => {
        createMsg(
          "./allRequests.php?postAllMsg&roomId=" +
            roomIdInput.value.trim() +
            "&userId=" +
            userInfo.userId
        );
        messageText.value = "";
        messagesCont.scrollBy(0, 10000000);
        replayCont.classList.remove("replay");
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
async function createMsg(api) {
  let status = false;
  let msgs;
  fetch(api)
    .then(async (res) => res.json())
    .then((val) => {
      fetch("./allRequests.php?checkMemberInSystem&userId=" + userInfo.userId)
        .then((res) => res.text())
        .then((value) => {
          if (value == "failed") {
            location.reload();
          }
        });
      msgs = val;
      let items = "";
      let oldMessages;
      if (!localStorage.getItem("oldMessages")) {
        localStorage.setItem("oldMessages", JSON.stringify(msgs));
      } else {
        oldMessages = JSON.parse(localStorage.getItem("oldMessages"));
        if (msgs.length > oldMessages.length) {
          let newMassage = msgs.slice(oldMessages.length);
          oldMessages = JSON.parse(localStorage.getItem("oldMessages"));
          localStorage.setItem("oldMessages", JSON.stringify(msgs));
          newMassage.forEach((msgs) => {
            let clas;
            let friandName = "";
            let hasReplaye = "";

            if (msgs.repalyedMessage) {
              if (msgs.isReplayedUrlImg) {
                hasReplaye = `
                <div class="replayMessage">
                  <img src="${msgs.repalyedMessage}"/>
                </div>
                `;
              } else {
                hasReplaye = `
                <div class="replayMessage">
                ${msgs.repalyedMessage}
                </div>
                `;
              }
            }
            if (msgs.imgUrl) {
              if (msgs.userId == userInfo.userId) clas = "selfMsg";
              else {
                clas = "friandsMsg";
                friandName = `<span class="friandName">${msgs.userGlobalName}</span>`;
              }
              let item = `<div  onclick="replayHand('${msgs.imgUrl}',true)" ondblclick="openImgHand('${msgs.imgUrl}')"   class="item ${clas}">
                   <div>
               ${hasReplaye}
               <img src="${msgs.imgUrl}"/>
                ${friandName}
                </div>
              </div>`;
              messagesCont.innerHTML += item;
            } else {
              if (msgs.userId == userInfo.userId) clas = "selfMsg";
              else {
                clas = "friandsMsg";
                friandName = `<span class="friandName">${msgs.userGlobalName}</span>`;
              }

              let item = `<div onclick="replayHand('${msgs.msg}')"  class="item ${clas}">
                   <div>
               ${hasReplaye}
                <span>${msgs.msg}</span>
                ${friandName}
                </div>
              </div>`;
              messagesCont.innerHTML += item;
            }
          });
          status = true;
          messagesCont.scrollBy(0, 10000000);
          messagesCont.innerHTML += items;
          loginParent.classList.add("hideAll");
          accountSetting.textContent = userInfo.userName;
        }
      }
      msgs.forEach((msg, index) => {
        if (oldMessages) return;
        let clas;
        let friandName = "";
        let hasReplaye = "";

        if (msg.repalyedMessage) {
          if (msg.isReplayedUrlImg) {
            hasReplaye = `
            <div class="replayMessage">
              <img src="${msg.repalyedMessage}"/>
            </div>
            `;
            console.log(msg.repalyedMessage);
          } else {
            hasReplaye = `
            <div class="replayMessage">
           ${msg.repalyedMessage}
            </div>
            `;
            console.log(msg.isReplayedUrlImg);
          }
        }
        if (msg.imgUrl) {
          if (msg.userId == userInfo.userId) clas = "selfMsg";
          else {
            clas = "friandsMsg";
            friandName = `<span class="friandName">${msg.userGlobalName}</span>`;
          }
          let item = `
          <div  onclick="replayHand('${msg.imgUrl}',true)" ondblclick="openImgHand('${msg.imgUrl}')"  class="item ${clas}">
            <div>
              ${hasReplaye}
              <img src="${msg.imgUrl}"/>
              ${friandName}
            </div>
          </div>`;
          items += item;
        } else {
          if (msg.userId == userInfo.userId) clas = "selfMsg";
          else {
            clas = "friandsMsg";
            friandName = `<span class="friandName">${msg.userGlobalName}</span>`;
          }
          let item = `<div  onclick="replayHand('${msg.msg}')" class="item ${clas}">
         <div>
         ${hasReplaye}
         <span>${msg.msg}</span>
         ${friandName}
         </div>
      </div>`;
          items += item;
        }
      });
      if (oldMessages) return;
      status = true;
      if (messagesCont.scrollBy(0, 10000000));
      messagesCont.innerHTML = items;
      messagesCont.scrollBy(0, 10000000);
      loginParent.classList.add("hideAll");
      accountSetting.textContent = userInfo.userName;
    })
    .catch((e) => {
      console.log(e);
      backEndMessages.textContent = "اتاق وجود ندارد";
      return false;
    });
  return status;
}
function openImgHand(imgUrl) {
  replayCont.classList.remove("replay");
  imgOpenCont.classList.add("active");
  imgOpenCont.querySelector("img").src = imgUrl;
}
btnCloseImgOpenCont.onclick = () => {
  imgOpenCont.classList.remove("active");
};
imgOpenCont.onclick = function (e) {
  if (e.target === this) {
    imgOpenCont.classList.remove("active");
  }
};
accountSetting.addEventListener("click", () => {
  onlineUsersCont.classList.add("active");
});
roomIdInput.addEventListener("focus", () => {
  roomIdInputLabel.classList.add("active");
});
roomIdInput.addEventListener("blur", () => {
  if (roomIdInput.value.trim()) return;
  roomIdInputLabel.classList.remove("active");
});
userName.addEventListener("focus", () => {
  labelUserName.classList.add("active");
});
userName.addEventListener("blur", () => {
  if (userName.value.trim()) return;
  labelUserName.classList.remove("active");
});
emailInput.addEventListener("focus", () => {
  labelEmail.classList.add("active");
});
passInput.addEventListener("focus", () => {
  labelPass.classList.add("active");
});
emailInput.addEventListener("blur", () => {
  if (emailInput.value.trim()) return;
  labelEmail.classList.remove("active");
});
passInput.addEventListener("blur", () => {
  if (passInput.value.trim()) return;
  labelPass.classList.remove("active");
});
showPass.addEventListener("click", () => {
  showPass.classList.toggle("fa-eye-slash");
  showPass.classList.toggle("fa-eye");
  if (showPass.classList.contains("fa-eye-slash")) {
    passInput.type = "text";
  } else {
    passInput.type = "password";
  }
});

loginSubmitForm.addEventListener("submit", (e) => {
  let backEndMessages = document.querySelector("#backEndMessages");
  backEndMessages.textContent = "";
  e.preventDefault();
  if (/ورود/.test(submitBtn.textContent)) {
    let api;
    if (!loginParent.classList.contains("hide"))
      api = `./allRequests.php?loginUser&userName=${emailInput.value.trim()}&userPass=${
        passInput.value
      }`;
    else
      api = `./allRequests.php?loginUser&userName=${
        JSON.parse(localStorage.getItem("userInfo")).userName
      }&userPass=${JSON.parse(localStorage.getItem("userInfo")).userPass}`;
    if (!emailInput.value.trim() && !loginParent.classList.contains("hide")) {
      backEndMessages.textContent = "نام را وارد کنید";
      return;
    } else if (
      !passInput.value.trim() &&
      !loginParent.classList.contains("hide")
    ) {
      backEndMessages.textContent = "نام کاربری را وارد کنید";
      return;
    }
    fetch(api)
      .then((res) => res.json())
      .then(async (val) => {
        userInfo.userId = val.userId;
        userInfo.userGlobalName = val.userGlobalName;
        userInfo.userPass = val.userPass;
        userInfo.userName = val.userName;
        userInfo.roomId = roomIdInput.value.trim();
        console.log(localStorage.getItem("userInfo"));
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        createMsg(
          "./allRequests.php?postAllMsg&roomId=" +
            roomIdInput.value.trim() +
            "&userId=" +
            userInfo.userId
        );

        setInterval(() => {
          createMsg(
            "./allRequests.php?postAllMsg&roomId=" +
              roomIdInput.value.trim() +
              "&userId=" +
              userInfo.userId
          );
        }, 1000);
      })
      .catch((e) => {
        if (/failed/gi.test(e))
          backEndMessages.textContent = "نام کاربری در سیستم وجود ندارد";
        else if (/inputs/gi.test(e))
          backEndMessages.textContent =
            "اطلاعات باید فقط حروف انگلیسی و  اعداد باشند و فاصله نداشته باشند";
        else if (/password/gi.test(e))
          backEndMessages.textContent = "پسورد اشتباه است";
        else if (!navigator.onLine) {
          backEndMessages.textContent = "افلاین هستید";
        } else {
          backEndMessages.textContent = "نام کاربری در سیستم وجود ندارد";
        }
        return;
      });
    userInfo.roomId = roomIdInput.value.trim();
  } else if (/ثبت نام/.test(submitBtn.textContent)) {
    if (!userName.value.trim()) {
      backEndMessages.textContent = "نام را وارد کنید";
      return;
    } else if (!emailInput.value.trim()) {
      backEndMessages.textContent = "نام کاربری را وارد کنید";
      return;
    } else if (!passInput.value.trim()) {
      backEndMessages.textContent = "پسورد را وارد کنید";
      return;
    }
    if (roomIdInput.value.trim()) {
      fetch(
        "./allRequests.php?postAllMsg&roomId=" +
          roomIdInput.value.trim() +
          "&userId=" +
          userInfo.userId
      )
        .then()
        .then(() => {
          fetch(
            `./allRequests.php?newUser&userName=${emailInput.value.trim()}&userPass=${passInput.value.trim()}&userGlobalName=${userName.value.trim()}`
          )
            .then((val) => val.json())
            .then((val) => {
              userInfo.userId = val.userId;
              userInfo.userGlobalName = val.userGlobalName;
              userInfo.userPass = val.userPass;
              userInfo.userName = val.userName;
              userInfo.roomId = roomIdInput.value.trim();
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            })
            .catch((e) => {
              console.log(e);
              if (/name/gi.test(e))
                backEndMessages.textContent = "نام خود را چک کنید";
              else if (/failed/gi.test(e))
                backEndMessages.textContent =
                  "اطلاعات باید فقط حروف انگلیسی و  اعداد باشند و فاصله نداشته باشند";
              else if (!navigator.onLine) {
                backEndMessages.textContent = "افلاین هستید";
              }
              return;
            });
          createMsg(
            "./allRequests.php?postAllMsg&roomId=" +
              roomIdInput.value.trim() +
              "&userId=" +
              userInfo.userId
          );

          setInterval(() => {
            createMsg(
              "./allRequests.php?postAllMsg&roomId=" +
                roomIdInput.value.trim() +
                "&userId=" +
                userInfo.userId
            );
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
          if (/failed/gi.test(e))
            backEndMessages.textContent =
              "اطلاعات باید فقط حروف انگلیسی و  اعداد باشند و فاصله نداشته باشند";
          else if (!navigator.onLine) {
            backEndMessages.textContent = "افلاین هستید";
          }
          return;
        });
    } else {
      fetch(
        `./allRequests.php?newUser&userName=${emailInput.value.trim()}&userPass=${passInput.value.trim()}&userGlobalName=${userName.value.trim()}`
      )
        .then((val) => val.json())
        .then((val) => {
          userInfo.userId = val.userId;
          userInfo.userGlobalName = val.userGlobalName;
          userInfo.userPass = val.userPass;
          userInfo.userName = val.userName;
          userInfo.roomId = roomIdInput.value.trim();
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          createMsg(
            "./allRequests.php?postAllMsg&roomId=" +
              roomIdInput.value.trim() +
              "&userId=" +
              userInfo.userId
          );

          setInterval(() => {
            createMsg(
              "./allRequests.php?postAllMsg&roomId=" +
                roomIdInput.value.trim() +
                "&userId=" +
                userInfo.userId
            );
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
          if (/name/gi.test(e))
            backEndMessages.textContent = "نام کاربری از قبل استفاده شده";
          else if (/failed/gi.test(e))
            backEndMessages.textContent =
              "اطلاعات باید فقط حروف انگلیسی و  اعداد باشند و فاصله نداشته باشند";
          else if (!navigator.onLine) {
            backEndMessages.textContent = "افلاین هستید";
          } else {
            backEndMessages.textContent =
              "اطلاعات باید فقط حروف انگلیسی و  اعداد باشند و فاصله نداشته باشند";
          }
          return;
        });
    }
  }
});
aboutAcountDiv.onclick = () => {
  backEndMessages.textContent = "";
  userName.parentElement.parentElement.classList.toggle("active");
  if (aboutAcountDiv.textContent === "ساخت حساب جدید؟") {
    aboutAcountDiv.textContent = "حساب داری؟";
    submitBtn.textContent = "ثبت نام";
    loginParent.classList.remove("hide");
  } else {
    aboutAcountDiv.textContent = "ساخت حساب جدید؟";
    submitBtn.textContent = "ورود";
    loginParent.classList.remove("hide");
  }
};
if (!localStorage.getItem("userInfo")) {
  aboutAcountDiv.click();
}

onlineUsersCont.addEventListener("click", (e) => {
  if (e.target === onlineUsersCont) onlineUsersCont.classList.remove("active");
});
function replayHand(user, isImg = false) {
  if (isImg) {
    let img = document.createElement("img");
    img.src = user;
    replayCont.querySelector(".messageReplayed").textContent = "";
    replayCont.querySelector(".messageReplayed").appendChild(img);
  } else if (!isImg)
    replayCont.querySelector(".messageReplayed").textContent = user;
  replayCont.classList.add("replay");
}
replayCont.onclick = () => {
  replayCont.classList.remove("replay");
};
uploadFileBtn.onclick = () => {
  inputFiles.click();
};
inputFiles.onclick = () => {
  inputFiles.form.reset();
};
inputFiles.onchange = () => {
  inputFiles.nextElementSibling.click();
};
$("#upload_image").on("submit", function (e) {
  console.log(1);
  e.preventDefault();
  $.ajax({
    url: "./allRequests.php?uploadPhoto",
    method: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (res) {
      console.log(res);
      if (!/typeError/g.test(res)) {
        let api =
          "./allRequests.php?setMsg&imgUrl=./photos/" +
          inputFiles.files[0].name +
          "&userId=" +
          userInfo.userId +
          "&userGlobalName=" +
          userInfo.userGlobalName +
          "&roomId=" +
          userInfo.roomId;
        console.log(document.querySelector(".messageReplayed img"));
        if (
          document.querySelector(".messageReplayed img") != null &&
          document.querySelector(".messageReplayed img").src
        ) {
          api += "&isReplayedUrlImg=true";
          api +=
            "&repalyedMessage=" +
            replayCont.querySelector(".messageReplayed img").src;
        }
        fetch(api);
      }
    },
    error: function (req, err) {
      console.log(err);
    },
  });
});
