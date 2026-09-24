"use strict";

(function (exports) {
  const COLUMN_ID = "materialPinCol";
  const TAG_KEY = "materialpinned";
  const { ThreadPaneColumns } = ChromeUtils.importESModule(
    "chrome://messenger/content/ThreadPaneColumns.mjs"
  );

  function isPinned(header) {
    return header.getStringProperty("keywords").split(/\s+/).includes(TAG_KEY);
  }

  function sortKey(header) {
    // Lexicographic descending order: pinned first, newest first in each group.
    return `${isPinned(header) ? "1" : "0"}${String(Math.trunc(header.date)).padStart(17, "0")}`;
  }

  function sortOpenMailTabs() {
    let sorted = 0;
    for (const window of Services.wm.getEnumerator("mail:3pane")) {
      for (const tabInfo of window.gTabmail?.tabInfo ?? []) {
        const pane = tabInfo.chromeBrowser?.contentWindow;
        if (!pane?.location?.href?.startsWith("about:3pane") || !pane.gViewWrapper?.dbView) {
          continue;
        }
        try {
          pane.gViewWrapper.sort(COLUMN_ID, Ci.nsMsgViewSortOrder.descending);
          pane.threadPane?.restoreSortIndicator();
          sorted += 1;
        } catch (error) {
          console.error("Material Pin could not sort a mail tab", error);
        }
      }
    }
    return sorted;
  }

  class MaterialPin extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        MaterialPin: {
          start: async () => {
            if (!ThreadPaneColumns.getCustomColumns().some(column => column.id === COLUMN_ID)) {
              ThreadPaneColumns.addCustomColumn(COLUMN_ID, {
                name: "Pinned",
                hidden: true,
                sortable: true,
                textCallback: sortKey
              });
            }
            return true;
          },
          sortAll: async () => sortOpenMailTabs(),
          refreshAndSort: async () => {
            ThreadPaneColumns.refreshCustomColumn(COLUMN_ID);
            return sortOpenMailTabs();
          }
        }
      };
    }

    onShutdown(isAppShutdown) {
      if (isAppShutdown) {
        return;
      }
      ThreadPaneColumns.removeCustomColumn(COLUMN_ID);
    }
  }

  exports.MaterialPin = MaterialPin;
})(this);
