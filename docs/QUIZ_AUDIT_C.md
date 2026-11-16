# Quiz audit C: physics, chemistry, biology, quantum, environment

Scope: the 83 flagged questions in `lowcov.json` whose subject is physics, chemistry, biology, quantum or environment. Each was checked against the lesson's card text (HTML and SVG stripped).

## Counts
- SUPPORTED: 79
- UNSUPPORTED: 4 (all rewritten)
- WRONG: 0

## Changed questions
- biology / 0-0-0 / Q4: Redi's q: option 'Maggots come from flies' eggs' is not in the cards; rewritten to the gauze/no-maggots result. (old question: "Redi's gauze-covered jars showed that:")
- environment / 3-2-2 / Q3: PAT expansion ('Perform, Achieve and Trade') is not in the cards; rewritten to the replacement fact. (old question: "PAT stands for:")
- environment / 2-0-2 / Q5: Colour list (yellow, red, white, blue) is not in the cards; rewritten to the colour-coded bags fact. (old question: "Which colour-coded system applies to the Bio-Medical Waste Rules?")
- quantum / 1-1-1 / Q2: Helium-4 'even number of fermions' rule is not in the cards; rewritten to the boson/fermion sharing rule. (old question: "Helium-4 is a boson because it has:")

Each rewrite keeps the same index, four options, and a new correct index (varied). The `w` explanation cites the card fact.

## Judgement notes (kept as SUPPORTED)
These pass on direct inference, not a verbatim statement in the cards. Worth a look if strictness is raised later:
- physics / 0-0-5 Q9 (seesaw balance): the cards give torque and the rotational law but not the balance condition in words.
- physics / 0-0-2 Q3 (reaction to book's weight): follows from the third-law card, not stated for this case.
- biology / 0-0-5 Q6 (CO2 from pyruvate oxidation and Krebs cycle): cards place CO2 release in the Krebs cycle; pyruvate-to-acetyl-CoA is implied, not named.
- chemistry / 3-0-2 Q8 (microplastics): the correct option is supported, but the `w` text says "Under 5 mm", which is not in the cards. Left unchanged because the item is SUPPORTED.
- quantum / 3-0-1 Q8 (cricket bat is not a first-generation device): inferred from the card's list of devices.
- quantum / 1-0-0 Q7 (pilot wave = Bohmian mechanics): cards say "guided path (Bohm)".
