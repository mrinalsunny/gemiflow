# GemiFlow V3 Statusline Hook
# Add to your shell RC file (.bashrc, .zshrc, etc.)

# Function to get statusline
gemiflow_statusline() {
  local statusline_script="${GEMIFLOW_DIR:-.claude}/helpers/statusline.cjs"
  if [ -f "$statusline_script" ]; then
    node "$statusline_script" 2>/dev/null || echo ""
  fi
}

# For bash PS1
# export PS1='$(gemiflow_statusline) \n\$ '

# For zsh RPROMPT
# export RPROMPT='$(gemiflow_statusline)'

# For starship (add to starship.toml)
# [custom.gemiflow]
# command = "node .gemiflow/helpers/statusline.cjs 2>/dev/null"
# when = "test -f .gemiflow/helpers/statusline.cjs"
