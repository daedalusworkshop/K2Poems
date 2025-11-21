export interface Poem {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
}

export const poems: Poem[] = [
  {
    id: "1",
    title: "We Paint the Roses",
    date: "November 20, 2024",
    content: `This Garden is so beautiful!
Look at that flower, so delicate
such a delectable blue!
The grass is this pristine green,
barefoot & soft,
The blades are standing up in the most prefect 90°
"It's because they've been knolling,"
the beekeeper says, walking in.
She looks over her garden
perfectly trimmed—kept clean
except that one.
It's bushy and stout.
And it's terribly dull.
It's wavering in the wind
        Like it's losing control of its limbs
"I'm sorry" it's shaking before she even began
She's darkening, with piercing eyes
"This is sad," she says, and like that,
his worth was defined.
In this garden we paint the roses red
with the blood of our own labor,
coats and coats of blood,
until it covers up our pain`
  },
  {
    id: "2",
    title: "Coffee at Midnight",
    date: "September 28, 2024",
    content: `
      Black liquid mirror,
      trembling with the vibration of the fridge.
      The kitchen light hums a fluorescent tune,
      a lullaby for the sleepless.
      
      There is a certain clarity at 3 AM,
      when the world has turned its back
      and the stars are indifferent observers.
      
      I drink the darkness,
      bitter and hot.
      Thinking of trains leaving stations,
      of letters never sent,
      of the way rain sounds on a tin roof
      three thousand miles away.
      
      We are all just travelers
      waiting for a connection
      that may never come.
    `
  },
  {
    id: "3",
    title: "Paper Birds",
    date: "August 15, 2024",
    content: `
      Fold the corner, crease the edge.
      Transform the flat white plane
      into wings, a beak, a tail.
      
      My hands remember what my mind forgets:
      the geometry of flight.
      
      I threw a hundred prayers from the balcony,
      watched them spiral down
      to the wet pavement below.
      None of them flew.
      None of them sang.
      
      But for a moment,
      suspended in the air between
      my hand and the ground,
      they were alive.
      
      And that was enough.
      To be weightless.
      To be falling.
      To be briefly, beautifully, free.
    `
  },
  {
    id: "4",
    title: "Echoes of a Conversation",
    date: "July 03, 2024",
    content: `
      Your voice is a ghost in this room.
      It lingers in the curtains,
      hides beneath the rug.
      
      "Tomorrow," you said.
      A word that holds the promise of the sun
      and the threat of the storm.
      
      I am collecting echoes,
      placing them in jars like fireflies.
      Trying to illuminate the dark corners
      of this memory.
      
      But sound fades.
      The jars go dark.
      And I am left with the silence,
      loud and demanding,
      filling the space where you used to be.
    `
  }
];
