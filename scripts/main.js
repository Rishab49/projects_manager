window.onload = function () {
  G = new Global([], [], []);

  if (localStorage.getItem("G_RUNNING")) {
    [...JSON.parse(localStorage.getItem("G_RUNNING"))].forEach((run) => {
      G.running = new Project(
        run._name,
        run._img,
        run._objectives,
        run._numberOfDaysLeft,
        run._peoplesInvolved,
        run._tasks,
        run._done,
        run._undone,
        RUNNING
      );
    });

    [...JSON.parse(localStorage.getItem("G_FINISHED"))].forEach((finsihed) => {
      let project = new Project(
        finsihed._name,
        finsihed._img,
        finsihed._objectives,
        finsihed._numberOfDaysLeft,
        finsihed._peoplesInvolved,
        finsihed._tasks,
        finsihed._done,
        finsihed._undone,
        RUNNING
      );

      // console.log("this is the new project",project);
      G.running = project;
      G.finished = project;
      project.state = FINISHED;
    });

    [...JSON.parse(localStorage.getItem("G_ONHOLD"))].forEach((onHold) => {
      let project = new Project(
        onHold._name,
        onHold._img,
        onHold._objectives,
        onHold._numberOfDaysLeft,
        onHold._peoplesInvolved,
        onHold._tasks,
        onHold._done,
        onHold._undone,
        RUNNING
      );
      G.running = project;
      G.onHold = project;
      project.state = ONHOLD;
    });
  } else {
    G = new Global(
      [
        new Project(
          "Dummy Project",
          "assets/images/IBM-Logo-Tagline.jpg",
          [
            { id: 5, value: "this is the first objective" },
            {
              id: 4,
              value:
                "this is the second objective , but this one is larger than others",
            },
            { id: 3, value: "this is the third objective" },
            { id: 2, value: "this is the fourth objective" },
            { id: 1, value: "this is the fifth objective" },
          ],
          3,
          0,
          [
            { id: 1, value: "this is the first task" },
            {
              id: 2,
              value:
                "this is the second task and it has a very long description. this is the end of very long description",
            },
            { id: 3, value: "this is the third task" },
            { id: 4, value: "this is the fourth task" },
          ]
        )
      ],
      [],
      []
    );
  }
  G.render(true);

  document.querySelector(".create-button").addEventListener("click", G.addForm);

  document
    .querySelector(".menu-area")
    .querySelector(".menu-container")
    .querySelector("ul")
    .children[1].addEventListener("click", (e) => {
      G.state = FINISHED;
      G.render(false);
      listItemStyleChanger(e);
      // e.preventDefault();
    });

  document
    .querySelector(".menu-area")
    .querySelector(".menu-container")
    .querySelector("ul")
    .children[0].addEventListener("click", (e) => {
      G.state = RUNNING;
      G.render(false);
      listItemStyleChanger(e);
      // e.preventDefault();
    });

  document
    .querySelector(".menu-area")
    .querySelector(".menu-container")
    .querySelector("ul")
    .children[2].addEventListener("click", (e) => {
      G.state = ONHOLD;
      G.render(false);
      listItemStyleChanger(e);
      // e.preventDefault();
    });

  document
    .querySelector(".search-container")
    .addEventListener("keyup", searchProject);



    // TODO elements 


    document.querySelector(".menu-area").querySelector(".menu-container").children[0].children[3].addEventListener("click",function(){
      popUpHandler("Coming Soon");
    })
};
