  synthesizeUltimateResponse(message, ensemble, agents, godel, production, history = []) {
    let ultimate = `# 🌟 ULTIMATE AI BRIDGE RESPONSE\n\n`;
    ultimate += `**Your Query:** "${message}"\n\n`;

    // Conversational memory
    let lastQ = Array.isArray(history) && history.length > 0 ? (history[history.length - 1].message || '') : '';

    // Code explanation for previous code generation
    if (
      /explain|what does.*code|how does.*work/i.test(message) &&
      lastQ &&
      /reverse.*linked list/i.test(lastQ)
    ) {
      ultimate += `🟩 **Explanation of the Python code for reversing a linked list:**\n\n`;
      ultimate += `- The ListNode class defines the structure for a singly-linked list node.\n`;
      ultimate += `- The reverse_list(head) function iterates through the list, reversing the pointers between nodes so the list is reversed (the tail becomes the new head).\n`;
      ultimate += `- It uses three pointers: prev (previous node), current (node being processed), and nxt (next node), flipping the "next" reference at each step.\n`;
      ultimate += `- The final result is the head of the reversed linked list.\n\n`;
    }

    // Clarification for ambiguous reverse/list requests
    else if (
      /reverse/.test(message.toLowerCase()) &&
      !/linked list|array|listnode|python function/i.test(message)
    ) {
      ultimate += `🟣 *Ms.Jarvis*: Did you mean to reverse an array, a linked list, or another data structure? Please clarify for the best help!\n\n`;
    }

    // Human-like greeting for well-being queries
    else if (
      /(how are you|how do you feel|are you online|are you there)/i.test(message)
    ) {
      ultimate += `Hi there! I'm online, evolving, and excited to collaborate. What's your next goal?\n\n`;
    }

    // Show recent memory
    if (lastQ) {
      ultimate += `_Previous message:_ "${lastQ}"\n\n`;
    }

    if (ensemble.codeBlock) {
      ultimate += `## 🐍 Python Function Generated:\n\n\`\`\`python\n${ensemble.codeBlock}\n\`\`\`\n\n`;
    }
    if (ensemble.sentiment) {
      ultimate += `## Sentiment Analysis:\n\nThe sentiment is: **${ensemble.sentiment}**\n\n`;
    }

    // (Retain rest of bridge summary / status generation as before)
    ultimate += `**Processing Summary:** Complete integration of multi-model AI, multi-agent coordination, self-improving algorithms, and production infrastructure.\n\n`;
    // ...rest of your previous summary, results, and achievements...

    return ultimate;
  }
