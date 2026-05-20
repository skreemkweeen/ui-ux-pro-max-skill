#!/bin/bash
# Continue ELEMENT UX skill installation with rate limit handling

echo "ELEMENT UX - Continuing Skill Installation"
echo "==========================================="
echo ""

REMAINING_SKILLS=(
    "OpenAEC-Foundation/Three.js-Claude-Skill-Package:multi"
    "duanhong169/claude-r3f-template:single"
    "adamperlis/awwwards-motion:single"
    "JudyZZ/threejs-parallax-skill:single"
    "wilwaldon/Claude-Code-Frontend-Design-Toolkit:single"
    "luukalleman/premium-design-skill:single"
    "yasserstudio/creative-first-ui:single"
    "hammerheart92/StoryForge:single"
    "wang1212/storytelling-web:single"
    "thehetpatel/claude-gsap:multi"
    "ali-abassi/framer-motion-skill:single"
    "sliday/google-fonts-skill:single"
    "ryanthedev/design-for-ai:single"
    "dannyjpwilliams/ui-sound-design-skill:single"
    "SrWhiskers/css-atmospheric-backgrounds-skill-claude:single"
    "vbcherepanov/total-agent-memory:single"
    "ErlichLiu/DeepClaude:single"
    "vercel-labs/agent-skills:single"
)

INSTALLED=0
FAILED=0

for skill_info in "${REMAINING_SKILLS[@]}"; do
    IFS=':' read -r skill type <<< "$skill_info"
    
    echo -n "Installing: $skill... "
    
    if [ "$type" = "multi" ]; then
        result=$(npx skillfish add "$skill" --all 2>&1)
    else
        result=$(npx skillfish add "$skill" 2>&1)
    fi
    
    if echo "$result" | grep -q "RATE LIMITED\|rate limit"; then
        echo "RATE LIMITED - waiting 120 seconds..."
        sleep 120
        # Retry after waiting
        if [ "$type" = "multi" ]; then
            result=$(npx skillfish add "$skill" --all 2>&1)
        else
            result=$(npx skillfish add "$skill" 2>&1)
        fi
    fi
    
    if echo "$result" | grep -q "Installed\|Done"; then
        echo "✓ SUCCESS"
        ((INSTALLED++))
    else
        echo "⚠ PARTIAL/RETRY"
        ((FAILED++))
    fi
    
    sleep 10  # Courtesy delay between installations
done

echo ""
echo "============================================"
echo "Installation Complete"
echo "Installed: $INSTALLED"
echo "Failed/Retry: $FAILED"
echo "Total Skills: $(ls -1 ~/.claude/skills/ | grep -v session-start-hook | wc -l)/20"
echo "============================================"
