class Project {
  constructor(
    name,
    img,
    objectives,
    numberOfDaysLeft,
    peoplesInvolved,
    tasks = [],
    done = [],
    undone = [],
    state = RUNNING
  ) {
    this._name = name;
    this._objectives = objectives;
    this._numberOfDaysLeft = numberOfDaysLeft;
    this._peoplesInvolved = peoplesInvolved;
    this._img = img;
    this._tasks = tasks;
    this._done = done;
    done.length == 0 ? (this._undone = [...tasks]) : (this._undone = undone);
    this._completePercentage = (this.done.length / this.tasks.length) * 100;
    this._projectVarCount = projectVarCounter++;
    this._progressBar = document
      .querySelector("#progress-bar")
      .content.cloneNode(true);
    this._uiElement = this.render();
    this._viewComponent = null;
    this._state = state;
  }

  // functions

  // this is the main render function which render the project card in the dashboard
  render() {
    let wrapper = elementFactory(
      "div",
      `project project-${this.projectVarCount} flex column ai-flex-start jc-center`,
      [],
      ""
    );
    wrapper.addEventListener("click", this.projectClickHandler, false);

    let clone = document
      .querySelector("#project-template")
      .content.cloneNode(true);
    clone
      .querySelector(".header-container")
      .children[0].children[0].setAttribute("src", this.img);
    clone.querySelector(".project-name").textContent = this.name;

    for (let i = 0; i < this.objectives.length; i++) {
      let objective = elementFactory("li", "", [], this.objectives[i].value);
      clone
        .querySelector(".objectives-container")
        .children[0].appendChild(objective);
    }

    clone
      .querySelector(".header-container")
      .children[1].addEventListener(
        "click",
        this.projectMenuClickHandler,
        false
      );

    this.progressBar.querySelector(".bar").style.width =
      this.completePercentage.toFixed(0) + "%";
    this.progressBar.querySelector(
      ".percentage-indicator"
    ).children[0].textContent = this.completePercentage.toFixed(0) + "%";

    clone
      .querySelector(".progress-bar-container")
      .appendChild(this.progressBar);
    clone.querySelector(
      ".project-button"
    ).textContent = `${this.numberOfDaysLeft} Days Left`;

    clone
      .querySelector(".project-menu")
      .children[0].children[1].addEventListener("click", () => {
        G.onHold = this;
        this.state = ONHOLD;
        G.render(false);
        localStorageSetter();
      });

    clone
      .querySelector(".project-menu")
      .children[0].children[0].addEventListener("click", () => {
        if (G.state == RUNNING) {
          G.running.forEach((e, index) => {
            e == this ? G.running.splice(index, 1) : "";
          });

          G.render(false);
        }
        if (G.state == FINISHED) {
          G.finished.forEach((e, index) => {
            e == this ? G.finished.splice(index, 1) : "";
          });
          G.render(false);
        }
        if (G.state == ONHOLD) {
          G.onHold.forEach((e, index) => {
            e == this ? G.onHold.splice(index, 1) : "";
          });
          G.render(false);
        }

        localStorageSetter();
      });

    wrapper.appendChild(clone);
    return wrapper;
  }

  // this is the function responsible for updating the values in the project card
  re_render() {
    this.uiElement
      .querySelector(".img-container")
      .children[0].setAttribute("src", this.img);
    this.uiElement.querySelector(".project-name").innerText = this.name;
    this.uiElement
      .querySelector(".objectives-container")
      .removeChild(
        this.uiElement.querySelector(".objectives-container").children[0]
      );

    let listContainer = elementFactory("ul", "flex column", [], "");
    for (let i = 0; i < this.objectives.length; i++) {
      let objective = elementFactory("li", "", [], this.objectives[i].value);

      listContainer.appendChild(objective);
    }

    this.uiElement
      .querySelector(".objectives-container")
      .appendChild(listContainer);
  }

  // this function is responsible for updating the image the view_component as well as card
  updateImage(newValue) {
    try {
      let img = new Image();
      img.src = newValue;
      img.onload = () => {
        this.img = newValue;
        this.viewComponent
          .querySelector(".basic-info-container")
          .children[0].children[0].setAttribute("src", this.img);
      };
    } catch (e) {}
  }
  // this is the factory function to create any html element

  objectiveClickListener = e => {
    if (e.path[0].getAttribute("class")?.includes("objective")) {
      var inputElement = elementFactory(
        "input",
        "text-field",
        [
          { name: "type", value: "text" },
          { name: "value", value: e.path[0].querySelector("p").innerHTML },
        ],
        ""
      );
      e.path[0].removeChild(e.path[0].querySelector("p"));

      inputElement.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
          if (event.srcElement.value == "" || event.srcElement.value == " ") {
            this.objectives.forEach((elem, index) => {
              elem.id == e.path[0].getAttribute("data-id")
                ? this.objectives.splice(index, 1)
                : "";
            });
            this.renderObjectives(false);
          } else {
            let paraElement = elementFactory(
              "p",
              "",
              [],
              event.srcElement.value
            );
            paraElement.addEventListener("click", this.objectiveClickListener);

            e.path[0].removeChild(e.path[0].children[0]);
            e.path[0].appendChild(paraElement);
            this.objectives.forEach((item) => {
              item.id == e.path[0].getAttribute("data-id")
                ? (item.value = inputElement.value)
                : "";
            });
            e.path[0].addEventListener("click", this.objectiveClickListener);
          }
        }
      });

      e.path[0].appendChild(inputElement);
      e.path[0].removeEventListener("click", this.objectiveClickListener);
      e.stopPropagation();
    } else {
      e.path[1].removeChild(e.path[1].querySelector("p"));
      let inputElement = elementFactory(
        "input",
        "text-field",
        [
          { name: "type", value: "text" },
          { name: "value", value: e.path[0].innerHTML },
        ],
        ""
      );
      inputElement.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
          if (event.srcElement.value == "" || event.srcElement.value == " ") {
            this.objectives.forEach((elem, index) => {
              elem.id == e.path[1].getAttribute("data-id")
                ? this.objectives.splice(index, 1)
                : "";
            });
            this.renderObjectives(false);
          } else {
            let paraElement = elementFactory(
              "p",
              "",
              [],
              event.srcElement.value
            );
            paraElement.addEventListener("click", this.objectiveClickListener);

            e.path[1].removeChild(e.path[1].children[0]);
            e.path[1].appendChild(paraElement);
            this.objectives.forEach((item) => {
              item.id == e.path[1].getAttribute("data-id")
                ? (item.value = inputElement.value)
                : "";
            });
            e.path[1].addEventListener("click", this.objectiveClickListener);
          }
        }
      });

      e.path[1].appendChild(inputElement);
      e.path[1].removeEventListener("click", this.objectiveClickListener);
      e.stopPropagation();
    }
  };

  // this is the function to render the objective in the view_component
  renderObjectives(firstTime) {
    if (firstTime) {
      for (var i = 0; i < this.objectives.length; i++) {
        var objective = elementFactory(
          "div",
          "objective flex ai-center jc-flex-start",
          [{ name: "data-id", value: this.objectives[i].id }],
          `<p> ${this.objectives[i].value}</p>`
        );

        objective.addEventListener("click", this.objectiveClickListener);

        objective
          .querySelector("p")
          .addEventListener("click", this.objectiveClickListener);

        view_component
          .querySelector(".objectives-container")
          .children[1].children[0].appendChild(objective);
      }
    } else {
      this.viewComponent
        .querySelector(".objectives-container")
        .children[1].removeChild(
          this.viewComponent.querySelector(".objectives-container").children[1]
            .children[0]
        );

      var container = elementFactory(
        "div",
        "container flex ai-center jc-center",
        [],
        ""
      );
      this.viewComponent
        .querySelector(".objectives-container")
        .children[1].appendChild(container);

      for (var i = 0; i < this.objectives.length; i++) {
        var objective = elementFactory(
          "div",
          "objective flex ai-center jc-flex-start",
          [{ name: "data-id", value: this.objectives[i].id }],
          `<p> ${this.objectives[i].value}</p>`
        );

        objective.addEventListener("click", this.objectiveClickListener);

        objective
          .querySelector("p")
          .addEventListener("click", this.objectiveClickListener);

        this.viewComponent
          .querySelector(".objectives-container")
          .children[1].children[0].appendChild(objective);
      }

      this.viewComponent
        .querySelector(".objectives-container")
        .children[1].children[0].children[0].click();
      this.viewComponent
        .querySelector(".objectives-container")
        .children[1].children[0].children[0].querySelector("input")
        .focus();
    }
  }

  // this is the function which is responsibe for rendering the peoples in the view_component
  renderPeoples(firstTime) {
    if (!firstTime) {
      this.viewComponent
        .querySelector(".peoples-working")
        .children[1].removeChild(
          this.viewComponent.querySelector(".peoples-working").children[1]
            .children[0]
        );

      let container = elementFactory(
        "div",
        "container flex ai-flex-start jc-center",
        [],
        ""
      );
      this.viewComponent
        .querySelector(".peoples-working")
        .children[1].appendChild(container);
    }

    for (var k = 0; k < peoples.length; k++) {
      var person = elementFactory(
        "div",
        "person flex ai-center jc-center",
        [{ name: "data-id", value: peoples[k].id }],
        ""
      );
      var personImg = elementFactory("img", "person-img", [
        { name: "src", value: peoples[k].img },
      ]);
      var personName = elementFactory(
        "p",
        "person-name flex ai-center jc-center",
        [],
        peoples[k].name
      );

      let inputContainer = elementFactory(
        "div",
        "input-container flex ai-center jc-center",
        [],
        ""
      );
      let inputElement = elementFactory("input", "text-field", [], "");

      inputElement.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          if (e.srcElement.value != "") {
            peoples.forEach((people) => {
              people.id ==
              e.srcElement.parentElement.parentElement.getAttribute("data-id")
                ? (people.name = e.srcElement.value)
                : "";
            });

            e.path[2].querySelector(".person-name").style.display = "flex";
            e.path[2].querySelector(".person-name").innerText =
              e.srcElement.value;
            e.path[2].querySelector(".remove-button-container").style.display =
              "flex";
            e.path[2].querySelector(".input-container").style.display = "none";
          } else {
            peoples.forEach((people, index) => {
              people.id ==
              e.srcElement.parentElement.parentElement.getAttribute("data-id")
                ? peoples.splice(index, 1)
                : "";
            });
            this.renderPeoples(false);
          }
        }
      });

      inputContainer.appendChild(inputElement);

      var removeButtonContainer = elementFactory(
        "div",
        "remove-button-container flex ai-center jc-flex-end",
        [],
        ""
      );
      var removeButton = elementFactory(
        "button",
        "remove-button",
        [{ name: "type", value: "button" }],
        "remove"
      );

      removeButton.addEventListener("click", (e) => {
        peoples.forEach((p, index) => {
          p.id == e.path[0].parentElement.parentElement.getAttribute("data-id")
            ? peoples.splice(index, 1)
            : "";
          this.viewComponent
            .querySelector(".peoples-working")
            .children[1].removeChild(
              this.viewComponent.querySelector(".peoples-working").children[1]
                .children[0]
            );

          var containerElement = elementFactory(
            "div",
            "container flex ai-center jc-center",
            [],
            ""
          );
          this.viewComponent
            .querySelector(".peoples-working")
            .children[1].appendChild(containerElement);

          this.renderPeoples(false);
        });
      });

      removeButtonContainer.appendChild(removeButton);
      person.appendChild(personImg);
      person.appendChild(personName);
      person.appendChild(inputContainer);
      person.appendChild(removeButtonContainer);

      person.addEventListener("click", function (e) {
        if (!e.srcElement.getAttribute("type")?.includes("button")) {
          this.querySelector(".input-container").children[0].value =
            this.querySelector("p").innerText;
          this.querySelector(".person-name").style.display = "none";
          this.querySelector(".remove-button-container").style.display = "none";
          this.querySelector(".input-container").style.display = "flex";
        }
      });
      firstTime
        ? view_component
            .querySelector(".peoples-working")
            .children[1].children[0].appendChild(person)
        : this.viewComponent
            .querySelector(".peoples-working")
            .children[1].children[0].appendChild(person);
    }

    if (!firstTime) {
      this.viewComponent
        .querySelector(".peoples-working")
        .children[1].children[0].children[0].click();
      this.viewComponent
        .querySelector(".peoples-working")
        .children[1].children[0].children[0].querySelector("input")
        .focus();
    }
  }

  //

  taskCreator = (str, i, firstTime) => {
    var doneTask =
      str == "undone"
        ? elementFactory(
            "div",
            `undone-task flex ai-center jc-space-between`,
            [{ name: "data-id", value: this.undone[i].id }],
            ""
          )
        : elementFactory(
            "div",
            `done-task flex ai-center jc-space-between`,
            [{ name: "data-id", value: this.done[i].id }],
            ""
          );
    var checkboxContainer = elementFactory(
      "div",
      "checkbox-container flex ai-center jc-center",
      [],
      ""
    );
    var checkbox =
      str == "undone"
        ? elementFactory("input", "", [{ name: "type", value: "checkbox" }], "")
        : elementFactory(
            "input",
            "",
            [
              { name: "type", value: "checkbox" },
              { name: "checked", value: "true" },
            ],
            ""
          );
    checkbox.addEventListener("change", (e) => {
      // console.log(e);
      str == "undone"
        ? (this.done = { id: Number(e.path[2].getAttribute("data-id")) })
        : (this.undone = { id: Number(e.path[2].getAttribute("data-id")) });

      this.taskAction();
    });

    checkboxContainer.appendChild(checkbox);

    var taskDescriptionContainer = elementFactory(
      "div",
      "task-description-container flex ai-center jc-flex-start",
      [],
      ""
    );
    // console.log("this is the value",this.undone[i].value);

    var task_description;
    str == "undone"
      ? (task_description = elementFactory("p", "", [], this.undone[i].value))
      : (task_description = elementFactory(
          "p",
          "checked-para",
          [],
          this.done[i].value
        ));

    taskDescriptionContainer.appendChild(task_description);

    let inputContainer;
    if (str == "undone") {
      inputContainer = elementFactory(
        "div",
        "input-container flex ai-center jc-center",
        [],
        ""
      );
      let inputElement = elementFactory("input", "text-field", [], "");

      inputElement.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          if (e.srcElement.value != "") {
            this.undone.forEach((undo) => {
              undo.id ==
              e.srcElement.parentElement.parentElement.getAttribute("data-id")
                ? (undo.value = e.srcElement.value)
                : "";
            });

            e.path[2].querySelector(
              ".task-description-container"
            ).children[0].innerText = e.srcElement.value;
            e.path[2].querySelector(
              ".task-description-container"
            ).style.display = "flex";
            e.path[2].querySelector(".checkbox-container").style.display =
              "flex";
            e.path[2].querySelector(".input-container").style.display = "none";
          } else {
            this.undone.forEach((undo, index) => {
              undo.id ==
              e.srcElement.parentElement.parentElement.getAttribute("data-id")
                ? undo.splice(index, 1)
                : "";
            });

            for (var i = 0; i < this.undone.length; i++) {
              this.taskCreator("undone", i, false);
            }
          }
        }
      });

      inputContainer.appendChild(inputElement);
    }

    doneTask.appendChild(checkboxContainer);
    doneTask.appendChild(taskDescriptionContainer);
    if (str == "undone") {
      doneTask.appendChild(inputContainer);

      doneTask.addEventListener("click", function (e) {
        if (!e.srcElement.getAttribute("type")?.includes("button")) {
          this.querySelector(".input-container").children[0].value =
            this.querySelector("p").innerText;
          this.querySelector(".task-description-container").style.display =
            "none";
          this.querySelector(".checkbox-container").style.display = "none";
          this.querySelector(".input-container").style.display = "flex";
        }
      });
    }
    firstTime
      ? view_component
          .querySelector(`.${str}-section`)
          .children[1].children[0].appendChild(doneTask)
      : this.viewComponent
          .querySelector(`.${str}-section`)
          .children[1].children[0].appendChild(doneTask);
  };
  // this is the function responsible for rendering the undone list in view_component

  renderUndone() {
    for (var i = 0; i < this.undone.length; i++) {
      this.taskCreator("undone", i, true);
    }
  }

  // this is the function responsible for rendering the done list in the view_component
  renderDone() {
    for (var i = 0; i < this.done.length; i++) {
      this.taskCreator("done", i, true);
    }
  }

  //  CLICK HANDLERS
  // this is the function which handles the click on the checkbox
  taskAction() {
    this.viewComponent
      .querySelector(".undone-section")
      .children[1].removeChild(
        this.viewComponent.querySelector(".undone-section").children[1]
          .children[0]
      );

    this.viewComponent
      .querySelector(".done-section")
      .children[1].removeChild(
        this.viewComponent.querySelector(".done-section").children[1]
          .children[0]
      );

    const container1 = elementFactory(
      "div",
      "container flex ai-flex-start jc-flex-start column",
      [],
      ""
    );
    this.viewComponent
      .querySelector(".undone-section")
      .children[1].appendChild(container1);

    const container2 = elementFactory(
      "div",
      "container flex ai-flex-start jc-flex-start column",
      [],
      ""
    );
    this.viewComponent
      .querySelector(".done-section")
      .children[1].appendChild(container2);

    for (var i = 0; i < this.undone.length; i++) {
      this.taskCreator("undone", i, false);
    }

    for (var j = 0; j < this.done.length; j++) {
      this.taskCreator("done", j, false);
    }
  }

  // this is the click handler of the project card
  projectClickHandler = (e) => {
    document.querySelector(".overlay-container").style.height = "100%";
    document.querySelector(".overlay-container").style.padding =
      "var(--secondary-gap)";

    view_component.querySelector(".image-field").value = this.img;
    view_component.querySelector(".image-field").oninput = (e) => {
      this.updateImage(e.srcElement.value);
    };

    view_component.querySelector(".text-field").value = this.name;
    view_component.querySelector(".text-field").oninput = (e) => {
      this.name = e.srcElement.value;
    };

    var projectImage = document.createElement("img");
    projectImage.setAttribute("src", this.img);

    view_component
      .querySelector(".basic-info-container")
      .children[0].appendChild(projectImage);

    view_component
      .querySelector(".button-container")
      .children[0].addEventListener("click", () => {
        document.querySelector(".overlay-container").style.height = "0%";
        document.querySelector(".overlay-container").style.padding = "0";
        document
          .querySelector(".overlay-container")
          .removeChild(document.querySelector(".view_component"));
        view_component = document
          .querySelector("#project-view-form")
          .content.cloneNode(true);
        this.re_render();
        localStorageSetter();
      });

    view_component
      .querySelector(".objectives-container")
      .querySelector(".add-button")
      .addEventListener("click", () => {
        this.objectives.unshift({
          id: this.objectives.length > 0 ? this.objectives[0].id + 1 : 1,
          value: new String(""),
        });

        this.renderObjectives(false);
      });

    view_component
      .querySelector(".undone-section")
      .querySelector(".add-button")
      .addEventListener("click", () => {
        this.undone = {
          id: this.tasks.length + 1,
          value: "",
        };

        this.viewComponent
          .querySelector(".undone-section")
          .children[1].removeChild(
            this.viewComponent.querySelector(".undone-section").children[1]
              .children[0]
          );

        let container = elementFactory(
          "div",
          "container flex ai-flex-start jc-center",
          [],
          ""
        );
        this.viewComponent
          .querySelector(".undone-section")
          .children[1].appendChild(container);

        for (var i = 0; i < this.undone.length; i++) {
          this.taskCreator("undone", i, false);
        }

        this.viewComponent
          .querySelector(".undone-section")
          .children[1].children[0].children[0].click();
        this.viewComponent
          .querySelector(".undone-section")
          .children[1].children[0].children[0].querySelector(".text-field")
          .focus();
      });

    view_component
      .querySelector(".peoples-working")
      .querySelector(".add-button")
      .addEventListener("click", () => {
        peoples.unshift({
          id: peoples[0].id + 1,
          img: "assets/images/portrait-1.jpg",
          name: "",
        });

        this.renderPeoples(false);
      });

    this.renderObjectives(true);

    this.renderPeoples(true);

    this.renderUndone();

    this.renderDone();

    document.querySelector(".overlay-container").appendChild(view_component);

    this.viewComponent = document.querySelector(".view_component");
  };

  // this is the click handler for the card menu
  projectMenuClickHandler = (e) => {
    window
      .getComputedStyle(this.uiElement.querySelector(".project-menu"))
      .getPropertyValue("display") == "none"
      ? (this.uiElement.querySelector(".project-menu").style.display = "block")
      : (this.uiElement.querySelector(".project-menu").style.display = "none");
    e.stopPropagation();
  };

  // getters
  get name() {
    return this._name;
  }
  get img() {
    return this._img;
  }
  get peoplesInvolved() {
    return this._peoplesInvolved;
  }
  get tasks() {
    return this._tasks;
  }
  get done() {
    return this._done;
  }
  get undone() {
    return this._undone;
  }

  get numberOfDaysLeft() {
    return this._numberOfDaysLeft;
  }

  get objectives() {
    return this._objectives;
  }
  get completePercentage() {
    return this._completePercentage;
  }
  get uiElement() {
    return this._uiElement;
  }
  get projectVarCount() {
    return this._projectVarCount;
  }
  get progressBar() {
    return this._progressBar;
  }
  get viewComponent() {
    return this._viewComponent;
  }
  get state() {
    return this._state;
  }
  //setter

  set state(newValue) {
    this._state = newValue;
  }
  set img(newValue) {
    this._img = newValue;
  }
  set name(newValue) {
    this._name = newValue;
  }
  set peoplesInvolved(newValue) {
    this._peoplesInvolved.push(newValue);
  }
  set tasks(newValue) {
    this._tasks.unshift(newValue);
  }
  set done(newValue) {
    this._undone.forEach((element, index) => {
      if (element.id == newValue.id) {
        this._done.unshift(this._undone.splice(index, 1)[0]);
        this.completePercentage = 0;
      }
    });
  }
  set undone(newValue) {
    let found = false;
    this._done.forEach((element, index) => {
      if (element.id == newValue.id) {
        this._undone.unshift(this._done.splice(index, 1)[0]);
        this.completePercentage = 0;
        found = true;
      }
    });

    if (found == false) {
      this._undone.unshift(newValue);

      this.tasks = newValue;
    }
  }

  set numberOfDaysLeft(newValue) {
    this._numberOfDaysLeft = newValue;
  }

  set objectives(newValue) {
    this._objectives.push(newValue);
  }

  set completePercentage(newValue) {
    this._completePercentage = (this.done.length / this.tasks.length) * 100;
    if (this.completePercentage == 100) {
      popUpHandler("Project Finsihed!");
      G.finished = this;
      this.state = FINISHED;
      G.render(false);
    }

    this.uiElement.querySelector(".bar").style.width =
      this.completePercentage.toFixed(0) + "%";
    this.uiElement.querySelector(
      ".percentage-indicator"
    ).children[0].textContent = this.completePercentage.toFixed(0) + "%";
  }

  set viewComponent(newValue) {
    this._viewComponent = newValue;
  }
}
