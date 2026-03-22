---
title: "Social Distribution Drafts"
status: draft
date: "2026-03-21"
parents: []
tags: [growth, distribution]
input: "writing articles"
output: "ready-to-post social content"
position: "distribution prep for knot0 content"
---

# Social Distribution Drafts

## 1. Hacker News — "REPL Is All Agents Need"

**Title:** REPL Is All Agents Need – From ephemeral code to persistent scratchpad

**URL:** https://www.knot0.com/writing/repl-is-all-agents-need

**Why this article:** It traces CodeAct → Claude Code → REPL scratchpad with arxiv citations and real benchmarks. HN loves well-sourced technical narratives with a clear thesis.

---

## 2. Hacker News — "Dagain"

**Title:** Dagain – DAG-based orchestration for coding agents

**URL:** https://www.knot0.com/writing/dagain

**Why this article:** Solves a known pain point (agents forget on long tasks), open source, technical deep-dive. Show HN format works here.

---

## 3. Reddit — r/MachineLearning

**Sub:** r/MachineLearning (flair: [Project])

**Title:** [P] REPL Is All Agents Need — how persistent scratchpads beat ephemeral code execution for coding agents

**Body:**
We traced three generations of agent code execution:

1. CodeAct (ICML 2024) — let agents write Python instead of calling tools. 20% higher success rates.
2. Shell agents (Claude Code, Codex) — wire agents to a real terminal. SWE-Bench went from 49% to 80.9%.
3. Persistent REPL — variables survive across turns, only print() enters context. Agents stop forgetting.

The writeup covers the research lineage and why we think a persistent scratchpad is the missing primitive.

Full article: https://www.knot0.com/writing/repl-is-all-agents-need
Open source tool: https://github.com/knot0-com/repl-scratchpad

---

## 4. Reddit — r/LocalLLaMA

**Title:** Open source REPL scratchpad for coding agents — variables persist across turns, only print() enters context

**Body:**
Built a persistent REPL skill for coding agents. The problem: every file read, API response, and query result lands in the context window and stays forever. By turn 30, the model has forgotten why it started.

The fix: a Python REPL where variables persist but raw output doesn't enter context. You process data inside the REPL, summarize on the way out via print().

Works with Claude Code, Codex, Gemini CLI, and 14+ coding agents. MIT licensed.

GitHub: https://github.com/knot0-com/repl-scratchpad
Deep dive: https://www.knot0.com/writing/repl-is-all-agents-need

---

## 5. Twitter/X Thread — "REPL Is All Agents Need"

**Thread:**

1/ Coding agents have a memory problem.

Not hallucination. Not capability. Memory.

By turn 30, the context window is full of raw file contents, API responses, and grep results. The original goal is buried.

2/ CodeAct (ICML 2024) proved agents should write code, not call tools. 20% higher success rates across 17 LLMs.

Claude Code took this further — 14 tools, no vector DBs, just ripgrep and a shell. SWE-Bench: 49% → 80.9%.

3/ But all that code was ephemeral. Write, execute, discard. Next turn starts fresh.

The execution was powerful. The memory was gone.

4/ The fix is a persistent REPL.

Variables survive across turns. Only print() enters the conversation. You process inside the scratchpad, summarize on the way out.

Three sequential Bash calls = a sign the REPL should be running.

5/ We open sourced it. Works with Claude Code, Codex, Gemini CLI, and 14+ agents.

GitHub: https://github.com/knot0-com/repl-scratchpad
Full writeup: https://knot0.com/writing/repl-is-all-agents-need

---

## 6. Twitter/X Thread — Dagain

**Thread:**

1/ AI coding agents can write entire features.

Give them a task that takes 20+ minutes, and they fall apart. Not because they're stupid — because they forget.

Every turn of conversation dilutes the original goal.

2/ This isn't a model limitation. It's an architecture problem.

We've been running agents in chat threads when we should be running them on work graphs.

3/ Dagain models work as a DAG. Each node is:
- Inputs (context needed)
- Outputs (what it produces)
- An agent that runs in isolation

Nodes run concurrently. Failed nodes retry. Each agent gets only the context it needs.

4/ The result: agents that don't forget, because each node has a scoped context. No accumulated drift.

Open source, MIT licensed.

GitHub: https://github.com/knot0-com/dagain
Deep dive: https://knot0.com/writing/dagain

---

## 7. LinkedIn Post

AI agents have a forgetting problem.

Not hallucination. Not capability. Architecture.

We traced three generations of how agents execute code — from CodeAct (ICML 2024) to Claude Code to persistent REPLs — and found that the missing primitive isn't a better model. It's a better scratchpad.

Variables that persist across turns. Output that stays out of context. Agents that stop drowning in their own data.

We open sourced the tool (works with 14+ coding agents) and wrote up the full research lineage:

https://knot0.com/writing/repl-is-all-agents-need

Built by the team at Knot0 — we're building a runtime for self-assembling software.
