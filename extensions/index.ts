/**
 * pi-today — Date prepender extension for pi
 *
 * Prepends today's date at the beginning of the system prompt for new sessions.
 * This ensures the LLM always knows the current date without breaking prompt
 * cache for ongoing sessions.
 *
 * Only activates on:
 * - New sessions (launching pi)
 * - /new command
 *
 * Does NOT modify the system prompt for subsequent messages in the same session,
 * preserving prompt cache and reducing costs.
 *
 * Emits "today:date" via pi.events so other extensions (like pi-system-prompt)
 * can display the date in their output.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  // Track whether the next message should have the date prepended
  let shouldPrependDate = false;
  let datePrefix = "";

  // Set the flag when a new session starts and notify other extensions
  pi.on("session_start", async (event, _ctx) => {
    // "startup" = launching pi in terminal
    // "new" = /new command
    if (event.reason === "startup" || event.reason === "new") {
      shouldPrependDate = true;

      // Compute the date once and emit it for other extensions
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      datePrefix = `Current date: ${dateStr}`;
      pi.events.emit("today:date", datePrefix);
    }
  });

  // Prepend the date to the system prompt on the first message only
  pi.on("before_agent_start", async (event, _ctx) => {
    if (!shouldPrependDate) return;

    // Mark as done — subsequent messages in this session won't get the date
    shouldPrependDate = false;

    // Prepend the date to the system prompt for this turn
    return {
      systemPrompt: `${datePrefix}\n\n${event.systemPrompt}`,
    };
  });
}
