function RenderJarvis({ response }) {
  if (!response) return null;
  const lines = response.split("\n");
  let insideCode = false;
  let codeBuffer = [];
  let output = [];
  lines.forEach((line, idx) => {
    if (line.trim().startsWith("```")) {
      insideCode = !insideCode;
      if (!insideCode) {
        output.push(
          <pre key={"code" + idx}
            style={{
              background: "#29251f",
              color: "#e7dbc6",
              borderRadius: 9,
              padding: "10px 15px",
              margin: "14px 0",
              whiteSpace: "pre-wrap",
              fontSize: 15
            }}>
            {codeBuffer.join("\n")}
          </pre>
        );
        codeBuffer = [];
      }
      return;
    }
    if (insideCode) {
      codeBuffer.push(line);
    } else {
      output.push(
        <span key={idx} style={{ display: "block", marginBottom: 2 }}>
          {line}
        </span>
      );
    }
  });
  return output;
}

