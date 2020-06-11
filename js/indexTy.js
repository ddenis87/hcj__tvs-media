"use strict";

let jsonRequest = new XMLHttpRequest();
let generalJsonURL = "https://belogorsk.tu.market/data/nameSection_belog.json";

jsonRequest.open("GET", generalJsonURL);
jsonRequest.responseType = "json";
jsonRequest.send();
jsonRequest.onload = function() {
  loadPage();
}
let selectedTab = '';

function loadPage() {
  
  let generalObgect = jsonRequest.response;
  //console.log(generalObgect);
  let textHTML;
  // баннер
  let urlTopBanner = Object.values(generalObgect.BannerTop_src[0]);
  let topBanner = document.getElementById("topBanner");
  topBanner.src = urlTopBanner;  
  
  let buttonForOrg = document.getElementById("buttonForOrg");
  buttonForOrg.addEventListener("click", () => {window.open(generalObgect.Button[0].href)});
  

  // блок поиска
  //console.log(generalObgect);
  let objSearch = generalObgect.SearchLink;
  let exampleLink = document.getElementById("exampleLink");
  textHTML = "";
  for (let i = 0; i < objSearch.length; i++) {
    textHTML += `${(i == 0) ? "например: " : ", или "}<a href="${objSearch[i].href}" class="searchA">${objSearch[i].nmInTop}</a>`;
  }
  exampleLink.innerHTML = textHTML;

  let stringSearch =  objSearch[0].nmInTop.replace(/ /g, "+");
  let buttonSearch = document.getElementById("buttonSearch");
  let inputSearch = document.getElementById("inputSearch");

  inputSearch.addEventListener("keyup", () => {
    if (event.key == "Enter") {
      if (inputSearch.value) stringSearch = inputSearch.value.replace(/ /g, "+");
      window.open("https://belogorsk.tu.market/search-offer/query?query=" + stringSearch)
    }
  });

  buttonSearch.addEventListener("click", () => {
    if (inputSearch.value) stringSearch = inputSearch.value.replace(/ /g, "+");
    window.open("https://belogorsk.tu.market/search-offer/query?query=" + stringSearch)
  });
  // верхнее меню
  let topMenu = document.getElementById("ulTopMenu");
  let objTopMenu = generalObgect.Section;

  // вкладка каталога по дефолту
  let nameTab = objTopMenu[0].nmInSection.replace(/ /g, "&");
  selectTab(objTopMenu[0].idCode,nameTab,objTopMenu[0].json);
  selectedTab = objTopMenu[0].idCode;

  // меню вкладок
  textHTML = "";
  let mJson = "";
  let mOnClick = "";
  for (let i = 0; i < objTopMenu.length; i++) {
    if (objTopMenu[i].idCode == "review") continue;
    let nameTab = objTopMenu[i].nmInSection.replace(/ /g, "&");
    textHTML += `<a href="#"><li id="tab_${objTopMenu[i].idCode}" class="liUnselected" onclick=clickTab('${objTopMenu[i].idCode}','${nameTab}','${objTopMenu[i].json}')>${objTopMenu[i].nmInTop.toUpperCase() }</li></a>`;
  }
  topMenu.innerHTML = textHTML;
  for (let i = 0; i < objTopMenu.length; i++) {
    let nameTab = objTopMenu[i].nmInSection.replace(/ /g, "&");
    if (objTopMenu[i].json !== "undefined") {mJson += objTopMenu[i].json + "$"; mOnClick += `'${objTopMenu[i].idCode}','${nameTab}','${objTopMenu[i].json}'$`;};
  }
  let tabSelect = document.getElementById("tab_" + selectedTab);
  tabSelect.className = "liSelected";
  
  // сайдбар  
  loadSideBar(mJson, mOnClick);
 }

function loadSideBar(_mJson, _mOnClick) {
  let mJson = _mJson.split("$");
  let mOnClick = _mOnClick.split("$");
  let mTabName = ["Партнеры", "Новинки", "Рекомендации", "Скидки"];
  setTimeout(sidebarParent, 100, mJson[3], mTabName[0], mOnClick[3]);
  setTimeout(sidebarOther, 500, mJson[1], mTabName[1], mOnClick[1]);
  setTimeout(sidebarOther, 1000, mJson[4], mTabName[2], mOnClick[4]);
  setTimeout(sidebarOther, 1500, mJson[5], mTabName[3], mOnClick[5]); 
}

function sidebarParent(_mJson, _mTabName, _mOnClick) {
  let textHTML = ``;
  let jsonRequest = new XMLHttpRequest();
  jsonRequest.open("GET", _mJson);
  jsonRequest.responseType = "json";
  jsonRequest.send();
  jsonRequest.onload = function() {
    let catObject = jsonRequest.response;
    let randomNum = Math.floor(Math.random() * ((catObject.length - 1) + 1 ));
    let sideBar = document.getElementById("gSideBar");
    let sidebarTab = document.createElement("div");
    //console.log(catObject[randomNum]);
    textHTML += `<h2 class="sidebarH2">${_mTabName}</h2>`;
    textHTML += `<div class="sidebarPartner">`;
    textHTML += `<a href="${catObject[randomNum].linkKAcontacts}"><img src="${catObject[randomNum].linkLogoFirmMidl}" class="sidebarLogo" id="sidebarLogo"></a>`;
    textHTML += `<hr>`;
    textHTML += `<a href="${catObject[randomNum].linkTU}"><img src="${catObject[randomNum].linkPhotoMidl}" class="sidebarImg" id="sidebarImg"></a>`;
    textHTML += `<a href="${catObject[randomNum].linkKA}"><span class="sidebarPrice">${catObject[randomNum].price} руб.</span></a>`;
    textHTML += `<a href="${catObject[randomNum].linkKA}"><span class="sidebarNote">${catObject[randomNum].nameTU.toUpperCase()}</span></a>`;
    textHTML += `</div>`;
    sidebarTab.innerHTML = textHTML;
    sideBar.appendChild(sidebarTab);
    return true;
  }
}

function sidebarOther(_mJson, _mTabName, _mOnClick) {
  let textHTML = ``;
  let jsonRequest = new XMLHttpRequest();
  jsonRequest.open("GET", _mJson);
  jsonRequest.responseType = "json";
  jsonRequest.send();
  jsonRequest.onload = function() {
    let catObject = jsonRequest.response;
    let randomNum = Math.floor(Math.random() * ((catObject.length - 1) + 1 ));
    let sideBar = document.getElementById("gSideBar");
    let sidebarTab = document.createElement("div");
    textHTML += `<h2 class="sidebarH2">${_mTabName}</h2>`;
    textHTML += `<div class="sidebarOther">`;
    textHTML += `<a href="#" onclick=clickTab(${_mOnClick})><img src="${catObject[randomNum].linkPhotoMidl}" class="sidebarImg" id="sidebarImg">`
    textHTML += `<span class="sidebarPrice">${catObject[randomNum].price} руб.</span>`;
    textHTML += `<span class="sidebarNote">${catObject[randomNum].nameTU.toUpperCase()}</span></a>`;
    textHTML += `</div>`;
    sidebarTab.innerHTML = textHTML;
    sideBar.appendChild(sidebarTab);
  }
}

function clickTab(_tabId, _tabName, _urlJSON) {
  let deleteTab = document.getElementById(selectedTab);
  let tabSelect = document.getElementById("tab_" + selectedTab);
  tabSelect.className = "liUnselected";
  tabSelect = document.getElementById("tab_" + _tabId);
  tabSelect.className = "liSelected";
  deleteTab.remove();
  selectTab(_tabId, _tabName, _urlJSON);
}

function selectTab(_tabId, _tabName, _urlJSON) {
  selectedTab = _tabId;
  let generalTy = document.getElementById("generalTy");
  let generalTitle = document.getElementById("gTitle");
  generalTitle.innerHTML = `<h1 class="uh1">${_tabName.replace(/&/g, " ")}</h1>`;
  let selectTab = document.createElement("div");
  selectTab.className = "selectTab";
  selectTab.id = _tabId;
  let textHTML = ``;

  if(_urlJSON == "undefined") {
    selectTab.innerHTML = textHTML;
    generalTy.appendChild(selectTab); return;
  }
  let catJsonURL = _urlJSON;
  let jsonRequest = new XMLHttpRequest();
  jsonRequest.open("GET", catJsonURL);
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

function clickNote (_clickUrl) {
  window.open(_clickUrl);
}
