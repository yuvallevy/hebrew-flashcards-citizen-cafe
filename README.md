Flashcard app for Hebrew vocabulary.

## Data model

Cards are organized by a tier structure, where each tier consists of a number of _levels_ that represent increasing fluency. Some advanced levels are further divided into _types_: separate packs at the same level so learners don't have to repeat the same words.

**Design choice: tiers in the database.** Initially, I was following the example spec where the only identifying fields for each pack were level and type. While hardcoding the tiers on the app side, I realized it would have been a better choice to store the tier alongside the level and type in the database; that way the frontend could stay unaware what the structure is, and the taxonomy would live primarily in the database. If I had more time, this would be the first change I'd make.

**Design choice: level/type constraint enforcement.** For flexibility, I decided not to encode which levels have types in the data model, instead keeping the structure flat and allowing the type field to be null (as in the assignment specification). The more correct way would have been a nested structure enforcing the conditional split, but that felt overengineered for the use case at hand.

## Seeding the database

Run `npx prisma db seed` from the project root to seed the database with the flashcard packs. This will delete all existing packs, if any exist, and replace them with the new data.

## Frontend

The frontend is a Next.js app that fetches information from the database using Prisma.

**Design choice: fetch all at once vs. fetch on demand.** Since the total size is small here, I decided to fetch all the flashcard packs at once, saving on back-and-forth overhead against the backend. This would not have scaled well to larger datasets; with a larger dataset, I would have fetched each pack of flashcards as needed and cached them in the frontend for subsequent use.

The decision above has one consequence that is not immediately obvious. To know how many types a level has (and therefore correctly conditionally display the type dropdown), the frontend needs to know all the packs for that level. If we were fetching on demand, we would have had to make a separate request to get the count of types for a given level.

**Design choice: tier/level dropdown behavior.** The spec describes the tier dropdown filtering the level dropdown, but doesn't state the pre-selection default. I gated level behind tier (level dropdown populates once a tier is chosen) rather than showing all twelve levels ungated - it's the clearer dependent-dropdown pattern from a UX standpoint, and gives each level its tier context. Trivial to switch to an always-populated list if that was the intent.

**Design choice: card corners.** The initial design had one corner on the card more rounded than the others. This could have been a cute indicator of which side of the card was the front, but I wanted to skip the animation when moving to the next card, so I made all corners equally rounded to avoid the visual jump. This was done at the very end of the project when I was running out of time.

**Animations:** The card flip animation is implemented, but no other animations exist. I would have liked to add a "swipe" animation when moving to the next card, and perhaps a satisfying "shuffle" animation showing the cards being moved around quickly as if being shuffled.