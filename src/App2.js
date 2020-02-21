import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { DetailsList } from "office-ui-fabric-react";

const items1 = [
  { key: "1", name: "test1", value: "TestVal 1" },
  { key: "2", name: "test2", value: "TestVal 2" }
];

class Foo extends React.PureComponent {
  render() {
    return <div>Foo</div>;
  }
}

const DetailsListFabric = () => {
  const [state, setState] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setState(state => state + 1);
      setState(state => state + 1);
    }, 5000);
  }, []);

  return (
    <>
      {state % 8 === 0 ? (
        <DetailsList items={items1} onRenderRow={() => <Foo />}/>
      ) : (
        <span> {state} </span>
      )}
    </>
  );
};


export default function App() {
  const [state, setState] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setState(state => state + 1);
      setTimeout(() => {
        setState(state => state + 1);
        setTimeout(() => {
          setState(state => state + 1);
          setTimeout(() => {
            setState(state => state + 1);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 7000);
  }, []);
  console.log("App Rendered");
  return (
    <span className="App">
      {state % 8 === 0 ? (
        <ChildWindow setState={setState} />
      ) : (
        <span> {state} </span>
      )}
    </span>
  );
}

function ChildWindow() {
  console.log("ChildWindow rendered");

  React.useEffect(() => {
    const childWindow = window.open();

    const divElem = childWindow && childWindow.document.createElement("div");

    let dispose;
    let intervalId;

    if (childWindow && divElem) {
      let rootElement = childWindow.document.body.appendChild(divElem);

      // Comment to remove project-styles
      // projectStyles(childWindow);

      render(<DetailsListFabric />, rootElement);

      // Render Stardust Leaks to confirm that there are no leaks
      // render(<StardustList />, rootElement);

      // Render Fabric Details List to confirm that there are leaks in DetailsList
      // render(<DetailsListFabric />, rootElement);

      dispose = () => {
        unmountComponentAtNode(rootElement);
      };

      if (childWindow) {
        intervalId = setInterval(() => {
          if (childWindow.closed) {
            if (dispose) {
              dispose();
            }
            dispose = undefined;
          }
        }, 200);
      }
    }

    return () => {
      console.log("Unmounted child component");
      if (dispose) {
        dispose();
      }
      if (childWindow) {
        childWindow.close();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return null;
}
