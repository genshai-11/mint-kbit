export function installRuntimeErrorOverlay() {
  const render = (title: string, detail: string) => {
    ;(window as any).__KBIT_RUNTIME_ERROR = title
    ;(window as any).__KBIT_RUNTIME_ERROR_DETAIL = detail
    const root = document.getElementById('root')
    if (!root) return
    root.innerHTML = `
      <div style="min-height:100vh;padding:32px;background:#f7f4ee;color:#162040;font-family:system-ui,sans-serif">
        <div style="max-width:960px;margin:0 auto">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8c6d38;margin-bottom:16px">Runtime error</div>
          <h1 style="font-family:Georgia,serif;font-size:48px;font-weight:400;line-height:1.05;margin:0 0 16px">${escapeHtml(title)}</h1>
          <pre style="white-space:pre-wrap;font-size:14px;line-height:1.7;background:#fff;padding:16px;border:1px solid #e2dfd8;border-radius:8px;overflow:auto">${escapeHtml(detail)}</pre>
        </div>
      </div>
    `
  }

  const escapeHtml = (value: string) =>
    value
      .split('&').join('&amp;')
      .split('<').join('&lt;')
      .split('>').join('&gt;')
      .split('"').join('&quot;')
      .split("'").join('&#39;')

  window.addEventListener('error', event => {
    const error = event.error instanceof Error ? event.error : new Error(String(event.message || 'Unknown error'))
    render(error.name || 'Unhandled error', `${error.message}\n\n${error.stack || ''}`)
  })

  window.addEventListener('unhandledrejection', event => {
    const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason || 'Unknown rejection'))
    render(reason.name || 'Unhandled rejection', `${reason.message}\n\n${reason.stack || ''}`)
  })
}
