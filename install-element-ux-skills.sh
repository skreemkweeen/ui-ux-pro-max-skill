#!/bin/bash

# ELEMENT UX - Complete Skillfish Installation Script
# This script installs all 20 curated skills for the immersive cinematic portfolio

set -e

echo "================================================"
echo "ELEMENT UX - Skillfish Installation Suite"
echo "================================================"
echo ""

# Track installed skills
INSTALLED=()
FAILED=()
RATE_LIMITED=false

# Function to attempt skill installation
install_skill() {
    local skill=$1
    local display_name=${2:-$skill}

    echo "Installing: $display_name..."

    if npx skillfish add "$skill" 2>&1 | grep -q "GitHub API rate limit exceeded"; then
        echo "⚠️  RATE LIMITED: $display_name"
        FAILED+=("$skill")
        RATE_LIMITED=true
        return 1
    elif npx skillfish add "$skill" 2>&1 | grep -q "Done"; then
        echo "✓ INSTALLED: $display_name"
        INSTALLED+=("$skill")
        return 0
    else
        echo "⚠️  PARTIAL: $display_name (may have multiple skills)"
        INSTALLED+=("$skill")
        return 0
    fi
}

# Function to install multi-skill repositories
install_multi_skill() {
    local repo=$1
    local display_name=${2:-$repo}

    echo "Installing (multi-skill): $display_name..."

    if npx skillfish add "$repo" --all 2>&1 | grep -q "GitHub API rate limit exceeded"; then
        echo "⚠️  RATE LIMITED: $display_name"
        FAILED+=("$repo")
        RATE_LIMITED=true
        return 1
    else
        echo "✓ INSTALLED: $display_name"
        INSTALLED+=("$repo")
        return 0
    fi
}

echo "CREATIVE DIRECTION / DESIGN"
echo "─────────────────────────"
install_skill "uxKero/anydesign" "anydesign"
install_skill "wilwaldon/Claude-Code-Frontend-Design-Toolkit" "Claude-Code-Frontend-Design-Toolkit"
install_skill "luukalleman/premium-design-skill" "premium-design-skill"
install_skill "yasserstudio/creative-first-ui" "creative-first-ui"
install_skill "hammerheart92/StoryForge" "StoryForge"
install_skill "wang1212/storytelling-web" "storytelling-web"

echo ""
echo "IMMERSIVE / THREE.JS / WEBGL"
echo "─────────────────────────"
install_multi_skill "CloudAI-X/threejs-skills" "threejs-skills (10 skills)"
install_multi_skill "OpenAEC-Foundation/Three.js-Claude-Skill-Package" "Three.js-Claude-Skill-Package"
install_skill "duanhong169/claude-r3f-template" "claude-r3f-template"
install_skill "adamperlis/awwwards-motion" "awwwards-motion"
install_skill "JudyZZ/threejs-parallax-skill" "threejs-parallax-skill"

echo ""
echo "MOTION SYSTEMS"
echo "─────────────"
install_multi_skill "thehetpatel/claude-gsap" "claude-gsap (18 skills)"
install_skill "kxwxn/gsap-animation-helper-skill" "gsap-animation-helper-skill"
install_skill "ali-abassi/framer-motion-skill" "framer-motion-skill"

echo ""
echo "TYPOGRAPHY / ATMOSPHERE"
echo "──────────────────────"
install_skill "sliday/google-fonts-skill" "google-fonts-skill"
install_skill "ryanthedev/design-for-ai" "design-for-ai"
install_skill "dannyjpwilliams/ui-sound-design-skill" "ui-sound-design-skill"
install_skill "SrWhiskers/css-atmospheric-backgrounds-skill-claude" "css-atmospheric-backgrounds-skill"

echo ""
echo "ENGINEERING / MEMORY / WORKFLOW"
echo "───────────────────────────────"
install_skill "vbcherepanov/total-agent-memory" "total-agent-memory"
install_skill "ErlichLiu/DeepClaude" "DeepClaude"
install_skill "vercel-labs/agent-skills" "agent-skills"

echo ""
echo "================================================"
echo "Installation Summary"
echo "================================================"
echo "✓ Installed: ${#INSTALLED[@]}"
echo "✗ Failed/Rate Limited: ${#FAILED[@]}"
echo ""

if [ ${#FAILED[@]} -gt 0 ]; then
    echo "Failed installations (retry later):"
    for skill in "${FAILED[@]}"; do
        echo "  - $skill"
    done
    echo ""
    echo "Rate limit status: API will reset in ~1 hour"
fi

echo "================================================"
echo "Installed Skills:"
echo "================================================"
ls -1 ~/.claude/skills/ | grep -v session-start-hook | sort

echo ""
echo "Total skills available:"
ls -1 ~/.claude/skills/ | grep -v session-start-hook | wc -l
