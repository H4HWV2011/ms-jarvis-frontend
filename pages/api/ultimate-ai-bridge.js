  synthesizeUltimateResponse(message, ensemble, agents, godel, production, history = []) {
    let ultimate = `# 🌟 ULTIMATE AI BRIDGE RESPONSE\n\n`;
    ultimate += `**Your Query:** "${message}"\n\n`;

    // Conversational memory & previous message
    let lastQ = Array.isArray(history) && history.length > 0 ? (history[history.length - 1].message || '') : '';
    let lastR = Array.isArray(history) && history.length > 0 ? (history[history.length - 1].response || '') : '';

    // --- Code explanation logic: reads BOTH the last question and last response for code block markers
    const explainStyle = /(explain|what does|how does|can you clarify|can you break.*down|please explain)/i;
    const lastCodeGiven = (lastQ && lastQ.match(/(python.*?)reverse.*list/i)) ||
                          (lastR && lastR.match(/``````/i));

    if (
      message && explainStyle.test(message) && lastCodeGiven
    ) {
      ultimate += `🟩 **Explanation of the previously provided Python code for reversing a linked list:**\n\n`;
      ultimate += `- \`ListNode\` defines each node with a value and pointer to the next node.\n`;
      ultimate += `- \`reverse_list(head)\` starts from the head, walking the list and rewiring each node so its 'next' arrow points backward instead of forward.\n`;
      ultimate += `- "prev," "current," and "nxt" variables track where we are and where we're going as we flip the arrows.\n`;
      ultimate += `- When there are no more nodes, it returns the new head (the old tail)—your original list is now reversed!\n\n`;
      if (lastR && lastR.match(/``````/)) {
        const code = lastR.match(/``````/)[1].trim();
        ultimate += `**The code:**\n\n\`\`\`python\n${code}\n\`\`\`\n\n`;
      }
    }

    // Clarify ambiguous "reverse" queries (no structure named)
    if (
      message &&
      /reverse/.test(message.toLowerCase()) &&
      !/linked list|array|listnode|python function/.test(message.toLowerCase())
    ) {
      ultimate += `🟣 *Ms.Jarvis:* Did you mean reversing an array, a linked list, a string, or something else? I can give detailed code examples if you specify!\n\n`;
    }

    // Friendly engagement/greeting logic
    if (
      message &&
      (
        message.toLowerCase().includes('how are you') ||
        message.toLowerCase().includes('how do you feel') ||
        message.toLowerCase().includes('are you online')
      )
    ) {
      ultimate += `Hi there! As Ms.Jarvis, I'm online and always evolving. What should we tackle next?\n\n`;
    }

    // Chat memory
    if (lastQ) {
      ultimate += `_Previous chat:_ "${lastQ}"\n\n`;
    }

    // Smart code and sentiment results
    if (ensemble.codeBlock) {
      ultimate += `## 🐍 Python Function Generated:\n\n\`\`\`python\n${ensemble.codeBlock}\n\`\`\`\n\n`;
    }
    if (ensemble.sentiment) {
      ultimate += `## Sentiment Analysis:\n\nThe sentiment is: **${ensemble.sentiment}**\n\n`;
    }

    // [Retain main summary/sections unchanged]
    ultimate += `**Processing Summary:** Complete integration ...`;
    // ... (rest of your big summary block as before)

    return ultimate;
  }
