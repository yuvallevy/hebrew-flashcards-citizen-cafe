Flashcard app for Hebrew vocabulary.

## Data model

Cards are organized by a tier structure, where each tier consists of a number of _levels_ that represent increasing fluency. Some advanced levels are further divided into _types_: separate packs at the same level so learners don't have to repeat the same words.

For flexibility, I decided not to encode which levels have types in the data model, instead keeping the structure flat and allowing the type field to be null (as in the assignment specification). The more correct way would have been a nested structure enforcing the conditional split, but that felt overengineered for the use case at hand.
