class Global {
  constructor(projects, finished, onHold) {
    this._projects = projects;
    this._running = [...projects];
    this._finished = finished;
    this._onHold = onHold;
    this._uiElement = document.querySelector(".main-content-area");
    this._projectsCounter = 1;
    this._state = RUNNING;
  }

  get projects() {
    return this._projects;
  }

  get running() {
    return this._running;
  }

  get finished() {
    return this._finished;
  }

  get onHold() {
    return this._onHold;
  }

  get uiElement() {
    return this._uiElement;
  }
  get state() {
    return this._state;
  }

  //setter

  set running(newValue) {
    this._running.push(newValue);
    this.projects = newValue;
  }
  set projects(newValue) {
    this._projects.push(newValue);
  }

  set finished(newValue) {
    if (newValue.state == RUNNING) {
      this.running.forEach((run, index) => {
        if (run.projectVarCount == newValue.projectVarCount) {
          this._finished.push(this.running.splice(index, 1)[0]);
        }
      });
    }

    if (newValue.state == ONHOLD) {
      this.onHold.forEach((hold, index) => {
        if (hold.projectVarCount == newValue.projectVarCount) {
          this._finished.push(this.onHold.splice(index, 1)[0]);
        }
      });
    }

    this.render(false);
  }

  set onHold(newValue) {
    if (newValue.state == RUNNING) {
      this.running.forEach((run, index) => {
        if (run.projectVarCount == newValue.projectVarCount) {
          this._onHold.push(this.running.splice(index, 1)[0]);
        }
      });
    }

    this.render(false);
  }

  set projectsCounter(newValue) {
    this._projectsCounter++;
    return this._projectsCounter;
  }

  set state(newValue) {
    this._state = newValue;
  }

  // methods
  render = (firstTime, secondaryArray = []) => {

    if (secondaryArray.length == 0) {
      if (firstTime) {
        this.running.forEach((project) => {
          this._uiElement
            .querySelector(".projects-container")
            .appendChild(project.uiElement);
        });
      } else {
        this.uiElement.removeChild(
          this.uiElement.querySelector(".projects-container")
        );
        let container = elementFactory(
          "div",
          "projects-container flex",
          [],
          ""
        );
        this.uiElement.appendChild(container);

        if (this.state == RUNNING) {
          if (this.running.length == 0) {
            this._uiElement
              .querySelector(".projects-container")
              .appendChild(emptyElement);
            return 0;
          } else {
            this.running.forEach((project) => {
              this._uiElement
                .querySelector(".projects-container")
                .appendChild(project.uiElement);
            });
          }
        }

        if (this.state == ONHOLD) {
          if (this.onHold.length == 0) {
            this._uiElement
              .querySelector(".projects-container")
              .appendChild(emptyElement);
            return 0;
          } else {
            this.onHold.forEach((project) => {
              this._uiElement
                .querySelector(".projects-container")
                .appendChild(project.uiElement);
            });
          }
        }

        if (this.state == FINISHED) {
          if (this.finished.length == 0) {
            this._uiElement
              .querySelector(".projects-container")
              .appendChild(emptyElement);
            return 0;
          } else {
            this.finished.forEach((project) => {
              this._uiElement
                .querySelector(".projects-container")
                .appendChild(project.uiElement);
            });
          }
        }
      }
    } else {
      console.log("this isthe secondary array now",secondaryArray);
      this.uiElement.removeChild(
        this.uiElement.querySelector(".projects-container")
      );
      let container = elementFactory(
        "div",
        "projects-container flex",
        [],
        ""
      );
      this.uiElement.appendChild(container);
      console.log(secondaryArray);
      secondaryArray.forEach((e) => {
        this._uiElement
          .querySelector(".projects-container")
          .appendChild(e);
      });
    }
  };

  addForm = (e) => {
    this.running = new Project(
      "",
      "assets/icons/placeholder.png",
      [],
      10,
      0,
      []
    );
    this.running[this.running.length - 1].uiElement.click();
    this.render(false);
  };
}
