/* @jsx jsx */
import React, { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { jsx, css } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import makeAtomicTheme from "./theme";

import "./styles.css";
import file from "./command.txt"

const theme = makeAtomicTheme();

const App = () => {
  // App States
  const [myDirectory, setDirectory] = useState();
  const [myFile, setFile] = useState();

    // instantiate a window listener on resize
  // to update the overall height and width of the app
  useEffect(() => {
    const readTextFile = file => {
      const myRequest = new XMLHttpRequest();
      myRequest.open("GET", file, false);
      myRequest.onreadystatechange = () => {
          if (myRequest.readyState === 4) {
              if (myRequest.status === 200 || myRequest.status == 0) {
                  const allText = myRequest.responseText;
                  printText(allText);
              }
          }
      };
      myRequest.send(null);
    }
    readTextFile(file);
  }, []);


  const printText = (str) => {
    const commandArray = str.replace(/\\/g, '').split("\n");
    setFile(commandArray);
    
    const COMMAND = {
      CREATE: true,
      MOVE: true,
      LIST: true,
      DELETE: true
    }

    let myJson = {};
    let lists = [];

    for (let i = 0 ; i < commandArray.length; i++) {
      let newLine = commandArray[i];
      let currentCommand = newLine.split(" ");
      switch(currentCommand[0]) {
        case "CREATE": {
          currentCommand.shift()
          let folders = currentCommand[0].split("/");

          // recurse over the array while saving the previous state of the currentJson
          folders.reduce((obj, s) => {
            if (!obj[s])
              return obj[s] = {};
            else
              return obj[s]
          }, myJson);
          lists.push(newLine)
          break;
        }
        case "DELETE": {
          currentCommand.shift()
          let folders = currentCommand[0].split("/");

          let toDelete = myJson;
          for(let i = 0; i < folders.length-1; i++) {
            toDelete = toDelete[folders[i]] || {}
          }
          if (Object.keys(toDelete).length == 0) {
            lists.push(`cannot Delete ${currentCommand.join(" ")}`)
          } else {
            toDelete[folders[folders.length - 1]] = undefined;
            lists.push(newLine)
          }
          break;
        }
        case "MOVE": {
          currentCommand.shift();
          let folders = currentCommand[0].split("/");
          let newFolder = currentCommand[1];
          let toDelete = myJson;
  
          for(let i = 0; i < folders.length - 1; i++) {
            toDelete = toDelete[folders[i]] || {}
          }

          let newSub = Object.assign({}, toDelete[folders[folders.length - 1]]);
          myJson[newFolder][folders[folders.length - 1]] = newSub;

          delete toDelete[folders[folders.length - 1]];
          lists.push(newLine)

          break;
        }
        case "LIST": {
          lists.push(Object.assign({}, myJson));
          break;
        }
      }
    }

    setDirectory(lists)

  }

  // Styles
  const app = css(
    (() => ({
      ...theme.mixins.flexDisplay(),
      ...theme.mixins.flexDirection("column"),
      ...theme.mixins.justifyContent("space-between"),
      backgroundColor: '#fbfbfb'
    }))()
  );
  

  return (
    <ThemeProvider theme={theme}>
      <div className="app" css={app}>
        {(myDirectory || []).map((cmd) => {
          let newLine = cmd;
          return <div>{JSON.stringify(newLine)}</div>
          
        })}
      </div>
    </ThemeProvider>
  );
};

export default App;
