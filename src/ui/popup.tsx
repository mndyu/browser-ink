import * as React from "react";
import * as ReactDOM from "react-dom";

// @ts-ignore
import unified from "unified";
// @ts-ignore
import markdown from "remark-parse";

import "../styles/popup.css";

// @ts-ignore
// import browser = require("webextension-polyfill");

function linkToTab(link) {
  const text = link.children[0];
  return {
    title: link.title || (text && text.value),
    url: link.url,
  };
}

const enum Tab {
  Export,
  Import,
}

const useExportTab = (): [string, number] => {
  const [code, setCode] = React.useState("");
  const [winCount, setWinCount] = React.useState(0);

  React.useEffect(() => {
    chrome.windows.getAll({ populate: true }, (windows) => {
      const windowsCode = windows
        .map((window) => {
          const windowCode = `## Window ${window.id}`;
          const tabCode = window.tabs
            .map((tab) => {
              return `- [${tab.title}](${tab.url})`;
            })
            .join("\n");
          return `${windowCode}\n${tabCode}`;
        })
        .join("\n\n");
      setCode(windowsCode);
      setWinCount(windows.length);
    });
  }, []);

  return [code, winCount];
};

const ExportTab = () => {
  const [code, winCount] = useExportTab();
  return (
    <div>
      {winCount} windows
      <textarea
        value={code}
        // onChange={(e) => setCode(e.target.value)}
        rows={15}
        cols={50}
      />
    </div>
  );
};

const ImportTab: React.FC = () => {
  const [code, setCode] = React.useState("");
  const importWindows = React.useCallback(() => {
    const tree = unified().use(markdown).parse(code);
    const lists = tree.children.filter((v) => v.type == "list");
    const tabsInWindows = lists.map((list) =>
      list.children
        .map((listItem) => listItem.children[0].children[0])
        .map((link) => link.url)
    );
    tabsInWindows.forEach((tabs) => {
      chrome.windows.create({ url: tabs });
    });
  }, [code]);

  return (
    <div>
      <button
        onClick={() => {
          importWindows();
        }}
      >
        open
      </button>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={15}
        cols={50}
      />
    </div>
  );
};

const tabs = {
  [Tab.Export]: <ExportTab />,
  [Tab.Import]: <ImportTab />,
};

const Popup: React.FC = () => {
  const [tab, setTab] = React.useState(Tab.Export);

  return (
    <div className="popup-padded">
      <a onClick={() => setTab(Tab.Export)}>export</a>
      <a onClick={() => setTab(Tab.Import)}>import</a>

      {tabs[tab]}
    </div>
  );
};

// --------------

ReactDOM.render(<Popup />, document.getElementById("root"));
