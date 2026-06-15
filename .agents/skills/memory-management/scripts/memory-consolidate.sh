#!/bin/bash
# Memory Management - Consolidate Script
# Optimize and consolidate memory

set -e

echo "Running memory consolidation..."
npx @gemiflow/cli hooks worker dispatch --trigger consolidate

echo "Memory consolidation complete"
npx @gemiflow/cli memory stats
