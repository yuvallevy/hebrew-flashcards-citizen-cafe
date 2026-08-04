Flashcard app for Hebrew vocabulary.

## Data model

Cards are organized by a tier structure, where each tier consists of a number of _levels_ that represent increasing fluency. Some advanced levels are further divided into _types_: separate packs at the same level so learners don't have to repeat the same words.

For flexibility, I decided not to encode which levels have types in the data model, instead keeping the structure flat and allowing the type field to be null (as in the assignment specification). The more correct way would have been a nested structure enforcing the conditional split, but that felt overengineered for the use case at hand.

## Seeding the database

Run `npx prisma db seed` from the project root to seed the database with the flashcard packs. This will delete all existing packs, if any exist, and replace them with the new data.

## Frontend

The frontend is a Next.js app that fetches directly from the backend using Prisma.

**Design choice: fetch all at once vs. fetch on demand.** Since the total size is small here, I decided to fetch all the flashcard packs at once, saving on back-and-forth overhead against the backend. This would not have scaled well to larger datasets; with a larger dataset, I would have fetched each pack of flashcards as needed and cached them in the frontend for subsequent use.

The spec describes the tier dropdown filtering the level dropdown, but doesn't state the pre-selection default. I gated level behind tier (level dropdown populates once a tier is chosen) rather than showing all twelve levels ungated - it's the clearer dependent-dropdown pattern from a UX standpoint, and gives each level its tier context. Trivial to switch to an always-populated list if that was the intent.