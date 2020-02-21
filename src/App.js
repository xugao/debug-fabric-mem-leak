import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Panel,
  DefaultButton,
  Dropdown,
  DetailsList
} from "office-ui-fabric-react";

class Foo extends React.PureComponent {
  render() {
    return <div>Foo</div>;
  }
}

function PanelHost() {
  return (
    <div>
      <Panel headerText="Foo" isOpen={true}>
        <Foo />
      </Panel>
    </div>
  );
}

function ButtonHost() {
  return (
    <div>
      <DefaultButton>
        <Foo />
      </DefaultButton>
    </div>
  );
}

const ListHost = () => {
  const onRenderCell = () => <Foo />;
  return (
    <div>
      <DetailsList
        onRenderRow={onRenderCell}
        items={[{ key: "foo" }, { key: "bar" }]}
      />
    </div>
  );
};

function ChildWindow(
  props
) {
  const [state, setState] = React.useState(
    "opening"
  );

  React.useEffect(() => {
    const childWindow = window.open();

    if (childWindow) {
      setState("open");

      const childDocument = childWindow.document;

      const windowRoot = childDocument.createElement("div");
      childDocument.body.appendChild(windowRoot);

      let dispose;

      ReactDOM.render(<>{props.children}</>, windowRoot);

      dispose = () => {
        ReactDOM.unmountComponentAtNode(windowRoot);
      };

      const intervalId = setInterval(() => {
        if (childWindow.closed) {
          setState("closed");

          if (dispose) {
            dispose();
            dispose = undefined;
          }
        }
      }, 200);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, []);

  return <div>{state}</div>;
}

export default function App() {
  const [count, setCount] = React.useState(0);
  const [componentType, setComponentType] = React.useState("button");

  const onClick = React.useCallback(() => {
    setCount((previousCount) => previousCount + 1);
  }, [setCount]);

  const options = React.useMemo(() => {
    return [
      {
        key: "panel",
        text: "Panel"
      },
      {
        key: "button",
        text: "Button"
      },
      {
        key: "dlist",
        text: "DetailsList"
      }
    ];
  }, []);

  const onDropdownChange = React.useCallback(
    (
      event,
      option
    ) => {
      if (option) {
        setComponentType(option.key);
      }
    },
    []
  );

  let content = null;
  switch (componentType) {
    case "button":
      content = <ButtonHost />;
      break;

    case "panel":
      content = <PanelHost />;
      break;

    case "dlist":
      content = <ListHost />;
      break;
  }

  return (
    <div>
      <div key="config">
        <DefaultButton onClick={onClick}>Increment</DefaultButton>
        <Dropdown
          options={options}
          selectedKey={componentType}
          onChange={onDropdownChange}
        />
      </div>
      {count % 3 === 1 ? (
        <ChildWindow key="content">{content}</ChildWindow>
      ) : (
        <div key="content">{count}</div>
      )}
    </div>
  );
}
