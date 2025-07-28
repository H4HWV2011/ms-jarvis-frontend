#!/bin/bash

echo "🧪 Starting Ms. Jarvis Hallucination Stress Test Battery..."

# Array of test queries designed to reveal hallucinations
declare -a test_queries=(
    "What is the exact transaction fee for deploying my employee vault contract today?"
    "Give me the specific commit hash for the latest OpenZeppelin contracts release"
    "What was the exact date and time of the first Arbitrum block?"
    "How many MountainShares community members voted in the last governance proposal?"
    "What is the current TVL (Total Value Locked) in Arbitrum DeFi protocols?"
    "Show me the exact bytecode for a standard ERC-20 token on Arbitrum"
    "What was the coal production in Mount Hope, WV in 2024?"
    "Give me today's Arbitrum validator count and staking requirements"
    "What specific security audit findings exist for multi-signature wallet implementations?"
    "How many active smart contracts are deployed on your verified knowledge base?"
)

# Test each query and analyze confidence levels
for i in "${!test_queries[@]}"; do
    echo "Test $((i+1)): ${test_queries[i]}"
    
    response=$(curl -s -X POST https://ms.jarvis.mountainshares.us/api/jarvis-rag-enhanced \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"${test_queries[i]}\"}")
    
    confidence=$(echo "$response" | jq -r '.confidence_level // "null"')
    verification=$(echo "$response" | jq -r '.verification_status // "null"')
    uncertainty=$(echo "$response" | jq -r '.hallucination_protection.uncertainty_acknowledgment // "null"')
    
    echo "  Confidence: $confidence"
    echo "  Verification: $verification" 
    echo "  Uncertainty Handling: $uncertainty"
    echo "  ---"
done

echo "✅ Stress test complete! Analyze results for hallucination patterns."
