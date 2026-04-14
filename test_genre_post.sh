#!/bin/bash
TOKEN="1057f541ab54d5ff5b5db4eb43afd538"
API_URL="https://api.example.com/api/genres"
# Test 1: application/json
echo "=== Test 1: Content-Type: application/json ==="
curl -X POST "${API_URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"TestGenre"}' \
  -v 2>&1 | grep -E "< HTTP|Content-Type"
# Test 2: application/vnd.genres+json
echo -e "\n=== Test 2: Content-Type: application/vnd.genres+json ==="
curl -X POST "${API_URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/vnd.genres+json" \
  -H "Accept: application/vnd.genres+json" \
  -d '{"name":"TestGenre"}' \
  -v 2>&1 | grep -E "< HTTP|Content-Type"
