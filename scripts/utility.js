const RUNNING = Symbol("RUNNING");
const FINISHED = Symbol("FINISHED");
const ONHOLD = Symbol("ONHOLD");

const emptyElement = elementFactory(
  "div",
  "empty-element flex ai-center jc-center",
  [],
  `
<p> No Projects Found</p>
`
);

let peoples = [
  { id: 5, img: "assets/images/portrait-1.jpg", name: "Jim Gordan" },
  { id: 4, img: "assets/images/portrait-1.jpg", name: "Bruce Wayne" },
  { id: 3, img: "assets/images/portrait-2.jpg", name: "keen Barbra" },
  { id: 2, img: "assets/images/portrait-1.jpg", name: "Alfred" },
  { id: 1, img: "assets/images/portrait-2.jpg", name: "Thea Galvain" },
];
let view_component = document
  .querySelector("#project-view-form")
  .content.cloneNode(true);
let projectVarCounter = 0;
// var progressVarCounter = 0;
// var doneVarCounter = 0;
// var undoneVarCounter = 0;

let G;

function elementFactory(tagName, className, attributes, innerHTML) {
  let element = document.createElement(tagName);
  if (className.length > 0) {
    element.setAttribute("class", className);
  }

  if (attributes.length > 0) {
    attributes.forEach((e) => {
      element.setAttribute(e.name, e.value);
    });
  }
  if (innerHTML != "") {
    element.innerHTML = innerHTML;
  }

  return element;
}

let listItemStyleChanger = (e) => {
  [
    ...document.querySelector(".menu-area").querySelector(".menu-container").querySelector("ul")
      .children,
  ].forEach((listItem) => {
    e.path.includes(listItem)
      ? listItem.setAttribute("class", "flex ai-center jc-flex-start menu-item-active")
      : listItem.setAttribute("class", "flex ai-center jc-flex-start");
  });
};

function localStorageSetter() {
  window.localStorage.setItem("G_RUNNING", JSON.stringify(G.running));
  window.localStorage.setItem("G_FINISHED", JSON.stringify(G.finished));
  window.localStorage.setItem("G_ONHOLD", JSON.stringify(G.onHold));
}



function searchProject(e){


  if(e.srcElement.value != "" || e.srcElement.value != " "){

  
let tempArray = [];
let tempArray2 = [emptyElement];
let regex = new RegExp(e.srcElement.value,'gi');
console.log("running",regex);
if(G.state == RUNNING){
  console.log("first");
  G.running.forEach((run)=>{
    regex.test(run.name)
    ? tempArray.push(run.uiElement)
    :"";
  });

  tempArray.length == 0
  ? G.render(false,tempArray2)
  : G.render(false,tempArray)

  console.log(tempArray);
  console.log(tempArray2);
  tempArray=[];
} 

if(G.state == FINISHED){
  console.log("second");
  G.finished.forEach((finish)=>{
    regex.test(finish.name)
    ? tempArray.push(finish.uiElement)
    :"";
  });

  tempArray.length == 0
  ? G.render(false,tempArray2)
  : G.render(false,tempArray)
  tempArray=[];
} 

if(G.state == ONHOLD){
  console.log("third");
  G.onHold.forEach((hold)=>{
    regex.test(hold.name)
    ? tempArray.push(hold.uiElement)
    :"";
  });

  tempArray.length == 0
  ? G.render(false,tempArray2)
  : G.render(false,tempArray)
  tempArray=[];
} 

  }

}



function popUpHandler(string){
  document.querySelector(".popup").children[0].innerText = string;
  document.querySelector(".popup").classList.toggle("popup-animated");
  setTimeout(function () {
    document.querySelector(".popup").classList.toggle("popup-animated");
  }, 1500);
}