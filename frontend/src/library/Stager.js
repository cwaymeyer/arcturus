export class Stager {
  static getAccessLevelOfAction = (actionsData, actionName) => {
    let accessLevel;
    for (const key in actionsData.actions) {
      for (let actionDetails of actionsData.actions[key]) {
        if (actionDetails.name === actionName) {
          accessLevel = key;
        }
      }
    }
    return accessLevel;
  };

  static updateKeyInState = (setState, key, newData) => {
    setState((existingValues) => ({
      ...existingValues,
      [key]: newData,
    }));
  };

  static disableActionInList = (
    actionsData,
    setActionsData,
    actionName,
    whichList,
    access
  ) => {
    switch (typeof actionName) {
      case "string":
        let poppedAction;
        const updatedArraySingle = actionsData[whichList][access].map((val) => {
          if (val.name === actionName) {
            val.disabled = true;
            poppedAction = val;
          }
          return val;
        });
        this.updateKeyInState(setActionsData, access, updatedArraySingle);

        return poppedAction;
      case "object": // array is an object in JS
        let poppedActions = [];
        const updatedArrayMultiple = actionsData[whichList][access].map(
          (val) => {
            if (actionName.includes(val.name)) {
              val.disabled = true;
              poppedActions.push(val);
            }
            return val;
          }
        );
        this.updateKeyInState(setActionsData, access, updatedArrayMultiple);

        return poppedActions;
      default:
        throw new Error(
          `Action must be of type string or array ('object'). Received ${typeof actionName}.`
        );
    }
  };

  static addActionToStage = (
    stagedStatement,
    setStagedStatement,
    action,
    whichList,
    accessLevel
  ) => {
    // update stagedStatement
    let stagedActions = stagedStatement[whichList];
    if (!stagedActions[accessLevel]) {
      stagedActions[accessLevel] = [];
    }
    stagedActions[accessLevel].push(action);

    this.updateKeyInState(setStagedStatement, whichList, stagedActions);
  };
}
