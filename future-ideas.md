# Future Ideas

## 1. Weekly Learning Sprint Planner
Create a lightweight planner that turns a learner's goals into a 5-7 day "sprint" with small daily tasks.

Why it helps learning:
- Encourages consistency instead of cramming.
- Makes progress visible with simple completion tracking.
- Helps learners set realistic scope each week.

Possible implementation:
- Reuse existing learning paths and module progress data.
- Add a "Create Sprint" action that picks 3-5 items from a path.
- Show a weekly card in the dashboard with checkboxes and streak count.

## 2. Reflection-to-Next-Step Assistant
After finishing a module, prompt users to write a short reflection, then generate a personalized next step.

Why it helps learning:
- Reflection improves retention and understanding.
- Personalized recommendations reduce decision fatigue.
- Creates a stronger feedback loop after each lesson.

Possible implementation:
- Build on the existing reflections table and assistant stack.
- Ask 2-3 guided prompts ("What was hardest?", "What clicked?").
- Use the response to recommend one next module, one practice task, and one review task.

## 3. Skill Gaps Heatmap
Add a simple visual heatmap showing confidence/progress across key skill areas (e.g., fundamentals, projects, communication, problem solving).

Why it helps learning:
- Helps learners quickly identify weak spots.
- Supports balanced learning rather than over-focusing on one area.
- Makes long-term growth easier to track.

Possible implementation:
- Derive skill tags from modules or path items.
- Compute a score from completion + quiz/reflection signals.
- Render as a dashboard widget with "focus next" suggestions.
