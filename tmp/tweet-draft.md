# X Post Drafts — Karpathy style (long-form, X Premium)

## Option 1 (the one i'd post)

interesting finding: you can use LLMs to "unit test" specifications before writing any code

we test code obsessively. unit tests, integration tests, e2e tests, fuzzing, property-based testing, mutation testing. entire careers built around making sure code does what it's supposed to do. but specifications — the documents that define what the code *should* do — we "review" those in a meeting. maybe two people read them carefully. maybe.

so i tried something. we had ~15 spec docs for a system — auth, payments, inventory, orders, notifications, shipping. felt solid. reviewed them multiple times. then i wrote a simple scenario:

"sarah, first-time buyer, shopping on mobile during a commute. adds 3 items to cart, taps checkout. her first credit card is declined. she enters a different card. payment succeeds. she expects a confirmation email within a minute."

i gave this scenario + all 15 spec docs to an LLM and asked it to trace through step by step. for each step, identify which spec governs the behavior and answer specific questions by citing the spec.

it immediately found:

(1) the payment spec says "retry up to 3 times with exponential backoff" but sarah isn't retrying the same card — she's entering a new one. is that a "retry" or a new payment attempt? does the idempotency key reset? the spec doesn't say.

(2) the inventory spec holds stock for 5 minutes. if the decline + entering a new card number + second payment attempt takes 6 minutes, the stock is released. another customer can buy the same items while sarah is mid-checkout. the payment and inventory specs have contradictory timing assumptions and neither references the other.

(3) the auth spec defines JWT tokens with 15-minute TTL. the checkout flow on a slow 3G connection could take longer than 15 minutes. what happens when the token expires mid-checkout? the auth spec doesn't define a refresh flow for checkout, and the checkout spec assumes a valid session throughout.

(4) the payment succeeds but what if the order confirmation service is briefly unavailable? the customer is charged but has no order record. there's no saga pattern, no compensation mechanism, nothing in either spec about this failure mode.

(5) the notification spec says "send confirmation email on order.confirmed event" but says nothing about what happens if the email service is down. no retry policy, no dead-letter queue, no fallback.

every single one of these would have been a rewrite-level discovery weeks into implementation. the kind where someone says "wait... what happens if—" and the room goes quiet.

basically what's happening is the LLM doesn't fill in the gaps the way humans do. when you read a spec you unconsciously go "oh obviously we handle that" and move on. your brain pattern-matches against every system you've ever built and assumes the gaps are covered. the LLM just goes "the spec does not define this" lol. it holds all 15 documents in working memory simultaneously and refuses to assume anything. humans are terrible at this.

the process is dead simple:
1. write a concrete scenario — a named persona, a specific goal, step-by-step interactions
2. give the LLM all your spec docs + the scenario
3. it traces each step against the specs and classifies every question as COVERED (spec answers it clearly), GAP (spec is silent), CONFLICT (two specs disagree), or AMBIGUITY (spec addresses it but the answer is unclear)
4. you get a structured gap report with severity ratings

no code. no test harness. just reasoning.

i ran 4 scenarios varying across user type, device, network conditions, and failure modes. the coverage was surprisingly thorough — most spec docs got exercised by at least one scenario, and the ones that didn't were themselves interesting (why does no realistic scenario touch the admin spec?).

i think this might be genuinely more useful than spec review meetings. a meeting has 5-6 people, each reads maybe 3 of the 15 docs carefully, nobody holds all the cross-document dependencies in their head simultaneously, and "looks good to me" is the default. this finds the things that look good until you actually trace through the data flow.

calling it "vibe testing" — like vibe coding but for the planning phase. you vibe-test specs before you vibe-code the implementation.

wrote it up and open sourced it as an agent skill (works with claude code, codex, gemini cli, cursor, copilot): github.com/knot0-com/vibe-testing

## Option 2 (slightly shorter)

we test code obsessively but review specs in a meeting. i think this is backwards.

tried something: wrote a concrete user scenario — "sarah's payment is declined mid-checkout, she enters a new card, expects confirmation within a minute" — and gave it to an LLM along with all 15 spec docs. asked it to trace through step by step, citing which spec governs each behavior.

within minutes it found that:
- the payment retry window (exponential backoff) can exceed the inventory hold (5 min). stock gets released while sarah is entering her new card number. the two specs have contradictory timing and neither references the other
- auth tokens expire in 15 min. checkout on 3G can take longer. no refresh flow defined for mid-checkout expiry
- payment succeeds but if the order service is briefly down, sarah is charged with no order record. no saga pattern, no compensation
- notification spec says "send email on order.confirmed" but has no concept of delivery failure — no retry, no dead-letter queue

every one of these would have been discovered weeks into implementation. the kind of bug that requires rethinking the architecture, not just fixing a function.

the key insight is that LLMs don't fill in gaps the way humans do. you read "retry payments 3 times" and your brain unconsciously assumes the inventory hold stays valid during retries. you've built checkout systems before, you know how this works, so you don't even notice the spec is silent on the timing relationship. the LLM reads both specs, finds no cross-reference, and flags it as a conflict. it holds 15 documents in working memory simultaneously and refuses to assume anything. humans can't do this.

the technique is simple:
1. write a named persona with a concrete goal and constraints (mobile, slow connection, low patience)
2. write 5-8 steps the persona takes, each citing which spec docs should govern the behavior
3. ask 2-3 questions per step that the spec should be able to answer
4. the LLM classifies each as COVERED, GAP, CONFLICT, or AMBIGUITY
5. you get a gap report rated BLOCKING / DEGRADED / COSMETIC

4 scenarios, 15 docs, found 6 blocking gaps and 8 degraded ones. before writing a single line of code. the cost was a few hours of writing scenarios vs. weeks of painful rewrites later.

calling it vibe testing. packaged it as a cross-platform agent skill: github.com/knot0-com/vibe-testing

## Option 3 (most narrative)

ok so i've been doing this thing where instead of just reviewing spec docs in a meeting i write little stories

like: "sarah, first-time buyer on mobile. adds items to cart. first card declined. enters a different card. wants confirmation email within 60 seconds." concrete person, concrete constraints, concrete failure mode.

then i give the story + all the spec docs to an LLM and say: trace through this step by step. for each step, tell me which spec doc governs the behavior. for each question, either cite the spec or tell me it's not there.

and it just... works? like, embarrassingly well?

the payment spec says "retry 3 times with exponential backoff." but sarah isn't retrying — she's entering a whole new card. is that a retry? a new attempt? does the idempotency key reset? the spec genuinely doesn't say. nobody noticed in three rounds of review because we all assumed "oh that's obviously a new attempt" — but the spec doesn't define it.

the inventory spec holds stock for 5 minutes. the payment spec's retry policy can run for 6+ minutes. so there's a window where sarah's items get released back to the shelf while she's still entering her new card number. two specs, reviewed by the same team, with contradictory assumptions about timing. nobody caught it because nobody holds both documents in their head at the same time.

and that's the thing — i think what's happening is the LLM is doing something humans are genuinely bad at: holding 15 documents in working memory simultaneously and refusing to assume anything. when we read specs, we unconsciously fill in the gaps with our experience. "obviously we'd handle that." "obviously those timings would be aligned." the LLM doesn't have that instinct. it just reads what's there, checks what's not there, and reports it. sometimes the most valuable thing an AI can do is be worse at pattern-matching than you are.

four scenarios found blocking gaps that would have been rewrite-level discoveries weeks into building. payment-vs-inventory timing. auth token expiry mid-checkout. no saga pattern when payment succeeds but order confirmation fails. guest checkout access completely undefined.

calling it vibe testing. open sourced as an agent skill that works with claude code, codex, gemini cli, cursor, copilot: github.com/knot0-com/vibe-testing
