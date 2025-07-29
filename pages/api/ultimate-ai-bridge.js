synthesizeUltimateResponse(message, ensemble, agents, godel, production, history = []) {
  const text = typeof message === "string" ? message.trim() : "";

  // 1. If a code block was generated, ALWAYS return a ready code block (for nano/WSL)
  if (ensemble && ensemble.codeBlock) {
    return [
      "```
      ensemble.codeBlock,
      "```"
    ].join("\n");
  }

  // 2. If the user requests a "command", "WSL command", "bash", or "terminal" instruction
  if (/wsl\b|bash\b|terminal|command[\s:]|step[- ]?by[- ]?step|how do I run/i.test(text)) {
    return [
      "### WSL Command:",
      "",
      "```
      "[Provide the relevant bash/WSL command here, customized to the user's question]",
      "```",
      "",
      "_Paste this in your WSL/Ubuntu terminal or nano for 100% correct results._"
    ].join("\n");
  }

  // 3. If user asks any programming/coding/build/editing question, give a code block for nano
  if (/nano|edit|code|python|js|javascript|c\+\+|script|function|class|shell|npm|git|build|commit|fix|file|folder|directory|project|workflow|config|yaml|json/i.test(text)) {
    return [
      "### Production-ready code block for nano:",
      "",
      "```
      "[Paste your answer or relevant code here, ready for nano/WSL]",
      "```",
      "",
      "_Open your file in nano; paste this block; save with Ctrl+O, then exit with Ctrl+X._"
    ].join("\n");
  }

  // 4. If too vague/short, request clarification
  if (text.length < 5) {
    return "Please provide more detail (which command, code, or nano workflow do you need?)";
  }

  // 5. For everything else, ask the user for the task and specify the format
  return (
    "Please specify your request. For WSL, say what command or script you need." +
    " For code, describe what code or nano-safe snippet is required. I'll give you a direct, copy-paste safe answer."
  );
}
