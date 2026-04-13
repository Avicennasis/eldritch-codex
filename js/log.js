// Roll log management
import { getState, addLogEntry, clearLog } from './state.js?v=17';

export function logRoll(type, text) {
  addLogEntry({ type, text });
}

export function renderLog(container) {
  const { rollLog } = getState();
  container.textContent = '';

  if (rollLog.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'log-entry';
    const span = document.createElement('span');
    span.className = 'log-entry-text';
    span.style.cssText = 'color:var(--text-muted);font-style:italic';
    span.textContent = 'No rolls yet...';
    empty.appendChild(span);
    container.appendChild(empty);
    return;
  }

  for (const entry of rollLog) {
    const el = document.createElement('div');
    el.className = `log-entry log-type-${entry.type}`;

    const time = new Date(entry.timestamp);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const textSpan = document.createElement('span');
    textSpan.className = 'log-entry-text';
    textSpan.textContent = entry.text;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-entry-time';
    timeSpan.textContent = timeStr;

    el.appendChild(textSpan);
    el.appendChild(timeSpan);
    container.appendChild(el);
  }
}

export function doClearLog() {
  clearLog();
}
