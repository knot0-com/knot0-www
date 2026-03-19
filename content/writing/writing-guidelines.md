# Writing guidelines

These are the patterns behind the articles in this folder. Read three or four of them before writing a new one — the tone comes from the examples, not from rules.

## What these articles are

Technical essays for practitioners. The reader builds software. They don't need to be convinced that AI is important. They want to understand how something works and decide whether it's useful.

## Structure

Open with a concrete problem or a specific example. Not "AI code review is hard" — a specific bug, a specific paper, a specific failure. The reader should be learning something in the first paragraph.

Each section advances the argument. If a section only catalogs features or lists capabilities, it doesn't belong. The question for every section: what does the reader understand after this that they didn't before?

End forward-looking or with a plain statement of the result. Not a summary. Not a restatement of the thesis.

Close with a references section linking to papers and repos.

## Tone

Explain things. The goal is to teach, not to impress. Write like you're explaining the idea to a colleague over coffee — someone technical who hasn't read the paper.

Specific over general. "accuracy went from 78% to 93%" not "accuracy improved significantly." "Boris Cherny described it as 'not a product as much as a Unix utility'" not "the team took a minimalist approach." Name the paper, the authors, the benchmark, the number.

Flat affect. State facts plainly. Let the results carry the weight. If a finding is surprising, the surprise should come from the content, not from the prose telling the reader to be surprised.

Use "we" casually when describing what we built or shipped. Use it sparingly — once or twice per essay, for moments where the experience matters ("We read the paper in January. By February, we had shipped it.").

## What to avoid

**Dramatic one-liners on their own paragraph.** "They weren't." "It just worked." "Nobody noticed." These are theatrical pauses. They signal that the prose is performing instead of explaining.

**Parallel fragment patterns.** "Not a better model. Not more context. A template." Once in an essay, maybe. Three times is a tic. The reader notices the structure, not the content.

**Three-beat escalations.** "A human would call this X. A researcher would call it Y. We called it Z." This is rhetoric, not explanation.

**Italics for emphasis.** Rarely. If the sentence needs italics to land, the sentence isn't doing its job. One or two per essay at most, for genuine contrast ("the model *can* trace imports").

**Metaphors that are too neat.** "The model is a student who knows the material but doesn't show their work. The template is the exam." This is AI-style packaging — it wraps the insight in a bow instead of letting the reader reach it. If you use a metaphor, make it quick and mid-paragraph, not a set piece.

**Repeating the thesis.** State it once, clearly, and trust the reader. Don't restate it in different words at the end of each section.

**Grandiose closing sentences.** "And that changed everything." "That's all it took." These work exactly once per essay, if at all. The REPL article earned it because the entire essay built the evidence. If your essay doesn't have the same buildup, end plainly.

**Addressing the reader as a lecturer.** "Consider what this means." "Here's where it gets interesting." Just explain the thing.

## Mechanics

Section headers are lowercase and conversational. "Free-form reasoning skips steps" not "The Problem With Free-Form Reasoning."

Paragraphs are 2-5 sentences. Longer paragraphs for explanation. Shorter ones for transitions or key points.

Code blocks are short and illustrative. Use them to show a concrete example, not to teach syntax. If a code block needs more than 10 lines, it's probably doing too much.

Tables are rare. Prefer prose. If you need a table, use minimal separators.

Articles run 800-1500 words. The REPL article at ~2200 is the upper bound — it earns the length with three distinct research threads. Most topics don't need that much space.

Frontmatter: title, subtitle, order. Title is the concept name. Subtitle is one sentence explaining what the essay is about.

## Process

Read the existing articles first. Write a draft. Read it out loud. Every sentence that sounds like it's trying to be clever — cut it or flatten it. The best sentences in these essays are the ones that just say what happened.
