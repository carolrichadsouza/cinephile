# Gamification Development

This document contains representative prompts from the development of Cinephile's gamification system.

Unlike a standalone feature, gamification was designed to integrate naturally into existing user actions. Rather than rewarding arbitrary behaviour, users earn progression by interacting with the application in meaningful ways such as watching movies, writing reviews, and rating films.

Throughout development, AI was used to validate design decisions, review implementation approaches, and refine the overall progression system.

---

## Prompt 1 : Designing the Gamification System

### Prompt

> I want gamification to be the main theme of my application rather than something that feels added on afterwards. What would be a good progression system for a movie tracking application?

### Why I asked

Since gamification is the central theme of Cinephile, I wanted the progression system to encourage users to interact with the application's existing features instead of introducing unrelated game mechanics.

### Summary of AI Response

The discussion focused on rewarding actions users would already perform.

Ideas included:

- Experience Points (XP)
- User Levels
- Achievement Badges
- Viewing Streaks
- Rewards for reviews and ratings

These became the foundation of the final gamification system.

---

## Prompt 2 : Awarding Experience Points

### Prompt

> Which user actions should award experience points, and how can I stop users from earning unlimited XP by repeatedly performing the same action?

### Why I asked

I wanted XP progression to feel rewarding without making it easy to abuse.

### Summary of AI Response

Suggestions included awarding XP for meaningful actions such as:

- Watching a movie
- Rating a movie
- Writing a review
- Unlocking achievements

The discussion also covered preventing duplicate rewards for repeated actions where appropriate.

---

## Prompt 3 : Levels

### Prompt

> What's a good way to design a level system that can easily be expanded later without changing lots of code?

### Why I asked

I wanted the level system to remain flexible if additional levels were introduced in the future.

### Summary of AI Response

Rather than hardcoding level thresholds, the recommendation was to store levels in the database.

This approach allows:

- Adding new levels
- Changing XP thresholds
- Updating level names

without modifying application logic.

This became the final implementation.

---

## Prompt 4 : Achievements

### Prompt

> I'm planning to add achievements. Should each achievement be checked inside my controllers, or is there a better approach?

### Why I asked

As more achievements were added, I wanted to avoid duplicating logic throughout the backend.

### Summary of AI Response

The recommendation was to centralise achievement logic inside a dedicated service.

Each user action could trigger the service, which would determine:

- Whether an achievement was unlocked.
- Which achievements had already been earned.
- Whether XP should also be awarded.

This approach kept controllers simple while making the achievement system easier to extend.

---

## Prompt 5 : Viewing Streaks

### Prompt

> How should I calculate a user's viewing streak? I want it to be accurate but also efficient.

### Why I asked

Viewing streaks required comparing watch dates across multiple movie logs while handling gaps correctly.

### Summary of AI Response

The discussion covered different approaches for calculating consecutive viewing days.

The final implementation focused on maintaining streak accuracy while avoiding unnecessary complexity.

---

## Prompt 6 : Backend Architecture

### Prompt

> My gamification logic is starting to grow. Would it be better to create a dedicated service rather than keeping everything inside my controllers?

### Why I asked

As XP, achievements, levels, and streaks were added, controller methods became increasingly complex.

### Summary of AI Response

The recommendation was to create a dedicated `GamificationService`.

The service became responsible for:

- Awarding XP
- Checking achievements
- Updating levels
- Calculating streaks

Controllers simply notified the service when a relevant user action occurred.

---

## Prompt 7 : User Feedback

### Prompt

> When a user earns XP or unlocks an achievement, what's the best way to provide feedback without interrupting the experience?

### Why I asked

I wanted users to immediately recognise their progress while keeping the interface unobtrusive.

### Summary of AI Response

Suggestions included:

- Small XP notifications
- Achievement toasts
- Level-up notifications
- Brief animations

These ideas influenced the final notification system shown after user actions.

---

## Prompt 8 : Balancing Rewards

### Prompt

> Some actions feel much more valuable than others. How should I balance XP so progression feels rewarding but not too fast?

### Why I asked

Poorly balanced rewards could make levelling feel either too slow or too easy.

### Summary of AI Response

Rather than assigning arbitrary values, the recommendation was to reward actions according to the effort involved.

For example:

- Watching a movie should award more XP than simply adding it to a watchlist.
- Writing a review should provide an additional reward because it requires greater user engagement.

---

## Prompt 9 : Testing the Gamification System

### Prompt

> How should I test my gamification logic to make sure XP, achievements, levels, and streaks continue working as I add new features?

### Why I asked

The gamification system is used by multiple controllers, so changes could easily introduce regressions.

### Summary of AI Response

The recommendation was to create dedicated backend unit tests for the `GamificationService`.

Testing should verify:

- XP calculations
- Achievement unlock conditions
- Level progression
- Streak updates

This became part of the backend test suite.

