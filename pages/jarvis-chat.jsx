function RenderJarvis({ response }) {
  if (!response) return null;
  const lines = response.split("\n");
  let insideCode = false;
  let codeBuffer = [];
  return lines.map((line, idx) => {
    if (line.trim().startsWith("```")) {
      insideCode = !insideCode;
      if (!insideCode) {
        // Just finished code block: render the collected code.
        const code = codeBuffer.join("\n");
        codeBuffer = [];
        return (
          <pre key={idx}
            style={{
              background: "#29251f",
              color: "#e7dbc6",
              borderRadius: 9,
              padding: "10px 15px",
              margin: "14px 0",
              whiteSpace: "pre-wrap",
              fontSize: 15
            }}>
            {code}
          </pre>
        );
      }
      // Started code block: nothing to render here.
      return null;
    }
    if (insideCode) {
      codeBuffer.push(line);
      return null;
    }
    // Normal lines (not in code)
    return (
      <span key={idx} style={{ display: "block", marginBottom: 2 }}>
        {line}
      </span>
    );
  });
}
