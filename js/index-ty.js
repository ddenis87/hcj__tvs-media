"use strict";

let activeTab="";
// document.addEventListener("scroll", pageScroll);

(function() {

let jsonUrl = "https://belogorsk.tu.market/data/nameSection_belog.json";
let jsonRequest = new XMLHttpRequest();

let tjq = $.getJSON(jsonUrl);
tjq.success = function() {
  console.log(tjq);
}


jsonRequest.open("GET", jsonUrl);
jsonRequest.responseType = "json";
jsonRequest.send();
jsonRequest.onload = function() {
  let gObject = jsonRequest.response;
  console.log("old: " + gObject);
  loadBanner(gObject.BannerTop_src);
  loadButtonOrg(gObject.Button);
  loadMenu(gObject.Section);
  selectTab(gObject.Section[0].idCode, gObject.Section[0].nmInSection.replace(/ /, "&"), gObject.Section[0].json); // 
}
})();

function loadBanner(_data) {
  $("#topBanner")[0].src = _data[0].nmInTop;
}

function loadButtonOrg(_data) {
  $("#buttonOrg").click(() => {window.open(_data[0].href)});
}

function loadMenu(_data) {
  for (let i = 0; i < _data.length; i++) {
    if (_data[i].idCode == "review") continue;
    let textHTML = "";
    textHTML += `<a href="#">`;
    textHTML += `<li id="tab_${_data[i].idCode}" `;
    (i == 0) ? textHTML +=         `class="liSelected" ` : textHTML +=         `class="liUnselected" `;
    textHTML +=         `onclick=clickTab('${_data[i].idCode}','${_data[i].nmInSection.replace(/ /g, "&") }','${_data[i].json}')>${_data[i].nmInTop.toUpperCase()}</li></a>`;
    $("#ulTopMenu").append(textHTML);
  }
}

function clickTab(_tabId, _tabName, _urlJSON) {
  $(`#tab_${activeTab}`).attr("class", "liUnselected");
  $(`#tab_${_tabId}`).attr("class", "liSelected");
  $("#" + activeTab).remove();
  selectTab(_tabId, _tabName, _urlJSON);
}

function selectTab(_tabId, _tabName, _urlJSON) {
  activeTab = _tabId;
  $("#gTitle").html(`<h1 class="uh1">${_tabName.replace(/&/g, " ") }</h1>`);

  let generalTy = document.getElementById("generalTy");
  let selectTab = document.createElement("div");
  selectTab.className = "selectTab";
  selectTab.id = _tabId;
  let textHTML = ``;

  let jsonRequest = new XMLHttpRequest();
  jsonRequest.open("GET", _urlJSON);
  jsonRequest.responseType = "json";
  jsonRequest.send();
  jsonRequest.onload = function() {
    let catObject = jsonRequest.response;
    //console.log(catObject);
    switch(_tabId) {
      case "catalog": {
        for (let i = 0; i < catObject.length; i++) {
          textHTML += `<a href="${catObject[i].href}" target="_blank"><figure class="plitka-cat"><img src="${catObject[i].logoPath}" id="plitkaimg"><figcaption class="figcaption">${catObject[i].visibleHref.toUpperCase()}</figcaption></figure></a>`;
        }
        break;
      }
      case "recommend":
      case "discont":
      case "new": {
        for (let i = 0; i < catObject.length; i++) {
          let nameTU = catObject[i].nameTU;
          //console.log(catObject[i].oldPrice);
          nameTU = (nameTU.length > 35) ? nameTU.slice(0,35) + '...' : nameTU;
          textHTML +=`<figure class="plitka">`;
          textHTML +=  `<a href="${catObject[i].linkTU}" target="_blank" class="linkPlitka">`;
          textHTML +=    `<div id="divimg"><img src="${catObject[i].linkPhotoMidl}" id="plitkaimg"/></div>`;
          textHTML +=    `<figcaption class="figcaption">${nameTU.toUpperCase()}</figcaption>`;
          textHTML +=  `</a>`;    
          textHTML +=  `<div class="note">`;
          textHTML +=    `<a href="${catObject[i].linkTU}" target="_blank" class="linkPlitka">`;
          textHTML +=      `<div class="noteNameKA"><b>Продавец:</b> "${catObject[i].nameKA}"</div>`;
          textHTML +=      `<div class="noteNameLong"><b>Наименование:</b> ${catObject[i].nameTU}</div>`;
          textHTML +=      `<div class="noteDiscription"><b>Описание:</b> ${(catObject[i].annotat) ? catObject[i].annotat : 'Отсутствует'}</div>`;
          if (catObject[i].oldPrice !== undefined) {textHTML +=`<div class="noteOldPrice">СТАРАЯ ЦЕНА: ${catObject[i].oldPrice} руб. ${catObject[i].siNameShort}</div>`;}
          textHTML +=      `<div class="notePrice">ЦЕНА: ${catObject[i].price} руб. ${catObject[i].siNameShort}</div>`;
          textHTML +=    `</a>`;   
          textHTML +=    `<div class="noteCat"><a href="${catObject[i].linkCTU}" >${catObject[i].nameCTU}</a></div>`;
          textHTML +=  `</div>`;
          textHTML +=`</figure>`;
        }
        break;
      }
      case "partners": {
        for (let i = 0; i < catObject.length; i++) {
          //console.log(encodeURI(catObject[0].linkLogoFirmMild) );
          textHTML += `<a href="${catObject[i].linkKAcontacts}" target="_blank" class="linkPlitka">`;
          textHTML +=   `<figure class="plitkaLogo">`;
          textHTML +=     `<img src="${catObject[i].linkLogoFirmMidl}" id="plitkaLogoimg">`;
          textHTML +=     `<figcaption class="figcaptionLogo">${catObject[i].nameKA}</figcaption>`;
          textHTML +=   `</figure>`;
          textHTML += `</a>`; 
        }
        break;
      }
    }
  selectTab.innerHTML = textHTML;
  generalTy.appendChild(selectTab);
  }
}

function strReplace(_strRepalce) {
 if (_strRepalce.indexOf("^") != -1) return _strRepalce.replace(/ /g, "&");
 if (_strRepalce.indexOf("^") == 1) return _strRepalce.replace(/^/g, " "); 
}
