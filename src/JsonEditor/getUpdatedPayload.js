const getUpdatedPayload = (type, activeEditor, values) => {
  let updatedPayload;
  if (type === "ss") {
    updatedPayload = {
      messageDataJson: {},
      themeDataJson: {},
      modulesDataJson: {},
      configDataJson: {},
    };
    console.log("values ", values);
    if (activeEditor === "messages") {
      updatedPayload.messageDataJson = values;
    } else if (activeEditor === "theme") {
      updatedPayload.themeDataJson = values;
    } else if (activeEditor === "modules") {
      updatedPayload.modulesDataJson = values;
    } else if (activeEditor === "config") {
      updatedPayload.configDataJson = values;
    }
  } else if (type === "cs") {
    updatedPayload = {
      csMessageDataJson: {},
      csThemeDataJson: {},
      csModulesDataJson: {},
      csConfigDataJson: {},
    };
    //alert(activeEditor);
    if (activeEditor === "messages") {
      updatedPayload.csMessageDataJson = values;
    } else if (activeEditor === "theme") {
      updatedPayload.csThemeDataJson = values;
    } else if (activeEditor === "modules") {
      updatedPayload.csModulesDataJson = values;
    } else if (activeEditor === "config") {
      updatedPayload.csConfigDataJson = values;
    }
  } else if (type === "admin") {
    updatedPayload = {
      adminMessageDataJson: {},
      adminThemeDataJson: {},
      adminModulesDataJson: {},
      adminConfigDataJson: {},
    };
    //alert(activeEditor);
    if (activeEditor === "messages") {
      updatedPayload.adminMessageDataJson = values;
    } else if (activeEditor === "theme") {
      updatedPayload.adminThemeDataJson = values;
    } else if (activeEditor === "modules") {
      updatedPayload.adminModulesDataJson = values;
    } else if (activeEditor === "config") {
      updatedPayload.adminConfigDataJson = values;
    }
  }
  return updatedPayload;
};

export default getUpdatedPayload;
