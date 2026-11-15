import { GameId } from '../types';

export interface FunFactItem {
  term: string;
  simpleExplanation: string;
}

export interface GameFunFacts {
  title: string;
  overview: string;
  coreFacts: FunFactItem[];
}

export const FUN_FACTS_DATA: Record<GameId, GameFunFacts> = {
  'crystal-growing': {
    title: 'Crystal Lab Fun Facts',
    overview: 'Crystals are nature’s geometric treasures that grow into beautiful shapes atom by atom!',
    coreFacts: [
      {
        term: 'What is a crystal?',
        simpleExplanation: 'A crystal is a solid object where tiny building blocks called atoms line up in neat, repeating 3D patterns like microscopic stacks of blocks.'
      },
      {
        term: 'How do crystals start growing?',
        simpleExplanation: 'Crystals begin at a tiny starting point called a nucleation site, where the first few atoms snap together. More atoms join in to make it bigger!'
      },
      {
        term: 'Why does table salt form cubes?',
        simpleExplanation: 'Salt atoms naturally connect in square shapes! Because of this neat atomic grid, table salt always grows into perfect little cubes.'
      },
      {
        term: 'Why are crystals different colors?',
        simpleExplanation: 'Tiny amounts of natural elements change the color. For example, a pinch of iron turns quartz into purple amethyst, and chromium makes emeralds bright green!'
      },
      {
        term: 'How does cooling speed change crystal size?',
        simpleExplanation: 'When hot liquids cool slowly, atoms have plenty of time to find their places and build huge, beautiful crystals. Quick cooling makes tiny crystals instead.'
      },
      {
        term: 'What is the hardest crystal on Earth?',
        simpleExplanation: 'Diamond is the hardest natural mineral known! Its carbon atoms are bonded together so strongly that only another diamond can scratch it.'
      }
    ]
  },

  'dna-creatures': {
    title: 'DNA Lab Fun Facts',
    overview: 'DNA is the amazing secret code inside every living creature that decides how it looks and grows!',
    coreFacts: [
      {
        term: 'What is DNA?',
        simpleExplanation: 'DNA is a special recipe book inside your cells. It looks like a twisted ladder called a double helix and holds instructions for building your body.'
      },
      {
        term: 'What are genes?',
        simpleExplanation: 'Genes are short chapters or paragraphs in your DNA recipe book. Each gene tells your body how to make a feature, like eye color or curly fur.'
      },
      {
        term: 'How do babies inherit traits?',
        simpleExplanation: 'Every baby creature gets half its genes from its mother and half from its father. Mixing them creates a unique new creature with traits from both!'
      },
      {
        term: 'Dominant vs Recessive traits',
        simpleExplanation: 'Some genes are stronger and louder (dominant), so they show up easily. Other genes are quieter (recessive) and only show up when both parents pass them down.'
      },
      {
        term: 'What is a mutation?',
        simpleExplanation: 'A mutation is a tiny surprise change in the DNA code. Most mutations are harmless, and some can even give animals helpful new superpowers!'
      },
      {
        term: 'The 4 letters of life',
        simpleExplanation: 'The rungs of the DNA ladder are made of four chemical letters: A, T, C, and G. In every creature, A always pairs with T, and C always pairs with G.'
      }
    ]
  },

  'circuit-testing': {
    title: 'Circuit Testing Fun Facts',
    overview: 'Electricity is the friendly flow of tiny moving energy particles called electrons!',
    coreFacts: [
      {
        term: 'What is an electric circuit?',
        simpleExplanation: 'A circuit is a complete loop that lets electricity flow from a power source, through devices like bulbs or fans, and back again.'
      },
      {
        term: 'What does voltage mean?',
        simpleExplanation: 'Voltage is the pushing force that drives electric energy through wires. Higher voltage pushes more energy, making light bulbs shine brighter!'
      },
      {
        term: 'What is a series circuit?',
        simpleExplanation: 'In a series circuit, electricity flows through components one after another in a single loop. If one light goes out, the whole path breaks and everything turns off.'
      },
      {
        term: 'What is a parallel circuit?',
        simpleExplanation: 'In a parallel circuit, each bulb or fan has its own separate branch connected to the two main wires. Each branch works completely on its own!'
      },
      {
        term: 'How does a generator work?',
        simpleExplanation: 'A generator spins magnets near copper wire coils. The moving magnetic field pushes electrons along the wires to produce fresh electricity.'
      },
      {
        term: 'Conductors vs Insulators',
        simpleExplanation: 'Metals like copper are great conductors because electricity flows through them easily. Rubber and plastic are insulators that protect us by blocking electricity.'
      }
    ]
  },

  'catastrophe-simulations': {
    title: 'Catastrophe Simulations Fun Facts',
    overview: 'Earth is an exciting, active planet with powerful forces beneath our feet and in the oceans!',
    coreFacts: [
      {
        term: 'What is the difference between magma and lava?',
        simpleExplanation: 'Molten liquid rock is called magma while it stays trapped deep underground. As soon as it erupts out into the open air, scientists call it lava!'
      },
      {
        term: 'Gentle vs Explosive eruptions',
        simpleExplanation: 'Runny magma lets gas bubbles escape easily, creating gentle effusive lava rivers. Sticky magma traps gas under high pressure until it bursts violently in explosive blasts!'
      },
      {
        term: 'Inside a volcano',
        simpleExplanation: 'Deep beneath a volcano lies the magma chamber (a hot molten pool). A central pipe called a conduit carries magma up to the crater opening at the top.'
      },
      {
        term: 'How do earthquakes happen?',
        simpleExplanation: 'Earth’s outer crust is made of gigantic puzzle pieces called tectonic plates. When they grind against each other and suddenly slip, energy shakes the ground!'
      },
      {
        term: 'What is an earthquake epicenter?',
        simpleExplanation: 'The exact spot underground where a rock fault slips is the focus. The epicenter is the point on Earth’s surface directly above the focus, where shaking is felt first.'
      },
      {
        term: 'How do tsunamis form?',
        simpleExplanation: 'When an earthquake suddenly lifts the ocean floor, it pushes a massive wall of water upward. As the wave nears shallow shores, the water first pulls back from the beach before rushing in!'
      }
    ]
  },

  'rocket-launching': {
    title: 'Rocket Launching Fun Facts',
    overview: 'Rockets use Newton’s laws of physics to push against gravity and explore the stars!',
    coreFacts: [
      {
        term: 'What is propulsion and thrust?',
        simpleExplanation: 'Propulsion is the forward push that moves a rocket. Engines burn fuel to create hot gas that blasts downward out the nozzle, pushing the rocket skyward!'
      },
      {
        term: 'Action and Reaction (Newton’s 3rd Law)',
        simpleExplanation: 'For every action, there is an equal and opposite reaction! Shooting gas down pushes the rocket up with the exact same amount of force.'
      },
      {
        term: 'What does apogee mean?',
        simpleExplanation: 'Apogee is the very highest point a rocket reaches during its flight before coasting in space or falling back toward Earth.'
      },
      {
        term: 'How does fuel level change flight duration?',
        simpleExplanation: 'More fuel means the rocket engines can fire for a longer time! A full fuel tank provides a long, steady burn to climb high into the upper atmosphere.'
      },
      {
        term: 'What are rocket contrails?',
        simpleExplanation: 'Contrails are visible trails left behind high-flying rockets. Hot water vapor from the engine instantly freezes into tiny clouds of ice crystals in the cold sky!'
      },
      {
        term: 'Why do rockets carry oxygen into space?',
        simpleExplanation: 'Fire cannot burn without oxygen! Because there is no air in the vacuum of space, rockets must carry their own oxygen tank called an oxidizer.'
      }
    ]
  },

  'defying-gravity': {
    title: 'Defying Gravity Fun Facts',
    overview: 'Gravity is the invisible cosmic pull that keeps planets orbiting and our feet on the ground!',
    coreFacts: [
      {
        term: 'What is gravity?',
        simpleExplanation: 'Gravity is an invisible pulling force between all things that have mass. The bigger and heavier an object is, the harder it pulls other things toward it.'
      },
      {
        term: 'Galileo’s famous drop discovery',
        simpleExplanation: 'Famous scientist Galileo showed that all objects fall with the exact same gravitational pull, regardless of whether they are heavy or light, when air drag is removed!'
      },
      {
        term: 'Why do some objects fall slower on Earth?',
        simpleExplanation: 'Air resistance acts like an upward parachute! A flat feather catches a lot of air and floats down gently, while a round bowling ball cuts right through the air.'
      },
      {
        term: 'Gravity on different planets',
        simpleExplanation: 'Giant planets like Jupiter have huge mass and pull with strong gravity. Smaller bodies like the Moon have weak gravity, so you can jump six times higher there!'
      },
      {
        term: 'What is Zero Gravity?',
        simpleExplanation: 'In deep space far away from big planets, there is virtually no gravitational pull, meaning objects float weightlessly in any direction.'
      },
      {
        term: 'Measuring height from the ground',
        simpleExplanation: 'Height is measured upwards from the ground at 0 meters up to the drop platform. The higher you drop an object from, the more speed it gains as it falls!'
      }
    ]
  }
};
