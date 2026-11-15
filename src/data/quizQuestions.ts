import { GameId, QuizQuestion } from '../types';

export const QUIZ_QUESTION_BANKS: Record<GameId, QuizQuestion[]> = {
  'crystal-growing': [
    {
      id: 'cg-1',
      question: 'What is a crystal made of?',
      options: ['Stacked layers of paper', 'Atoms lined up in neat patterns', 'Hardened drops of paint', 'Frozen bubbles of air'],
      correctIndex: 1,
      explanation: 'Crystals are solids where atoms connect in neat, repeating 3D patterns!'
    },
    {
      id: 'cg-2',
      question: 'Where do crystals begin growing?',
      options: ['At a tiny nucleation site', 'Inside a storm cloud', 'At the bottom of the ocean only', 'Inside a magnet'],
      correctIndex: 0,
      explanation: 'Nucleation is the tiny starting point where the first atoms lock together.'
    },
    {
      id: 'cg-3',
      question: 'What shape does table salt naturally grow into?',
      options: ['Round balls', 'Triangles', 'Little cubes', 'Flat circles'],
      correctIndex: 2,
      explanation: 'Salt atoms lock together in a square grid, making neat cubic crystals.'
    },
    {
      id: 'cg-4',
      question: 'What happens to crystals when liquid cools very slowly?',
      options: ['They turn to dust', 'They grow into larger crystals', 'They melt into gas', 'They lose their color'],
      correctIndex: 1,
      explanation: 'Slow cooling gives atoms time to find their places and build bigger crystals!'
    },
    {
      id: 'cg-5',
      question: 'What makes quartz crystals turn purple to become amethyst?',
      options: ['A pinch of iron', 'Purple food dye', 'Lots of water', 'Sunlight'],
      correctIndex: 0,
      explanation: 'Tiny amounts of natural iron in the rock give amethyst its purple glow.'
    },
    {
      id: 'cg-6',
      question: 'What makes emerald crystals bright green?',
      options: ['Seaweed', 'Chromium', 'Ice crystals', 'Tree sap'],
      correctIndex: 1,
      explanation: 'Trace amounts of the mineral element chromium create the green color.'
    },
    {
      id: 'cg-7',
      question: 'Which of these is the hardest crystal on Earth?',
      options: ['Diamond', 'Talc', 'Ice', 'Glass'],
      correctIndex: 0,
      explanation: 'Diamond is rated 10 on the hardness scale because its carbon atoms hold on super tightly!'
    },
    {
      id: 'cg-8',
      question: 'How many sides does a snowflake crystal always have?',
      options: ['4 sides', '6 sides', '8 sides', '10 sides'],
      correctIndex: 1,
      explanation: 'Water molecules bond in hexagonal rings, giving snowflakes 6 beautiful points.'
    },
    {
      id: 'cg-9',
      question: 'Why do crystals have shiny, flat sides?',
      options: ['People polish them with wax', 'Their atoms line up along straight planes', 'Water washes them flat', 'Wind cuts them smooth'],
      correctIndex: 1,
      explanation: 'The straight rows of atoms create smooth, shiny geometric faces.'
    },
    {
      id: 'cg-10',
      question: 'What is a "seed crystal"?',
      options: ['A plant seed that grows flowers', 'A small crystal that helps a bigger one grow', 'A drop of fertilizer', 'A glass marble'],
      correctIndex: 1,
      explanation: 'A seed crystal gives new atoms a handy template to attach to.'
    },
    {
      id: 'cg-11',
      question: 'What is volcanic obsidian glass?',
      options: ['A normal crystal', 'A rock that cooled so fast atoms had no time to form patterns', 'A soft sponge', 'A diamond'],
      correctIndex: 1,
      explanation: 'Obsidian cooled so quickly that atoms froze in place without making a crystal grid.'
    },
    {
      id: 'cg-12',
      question: 'What happens if you drop a crystal in water that can dissolve more mineral?',
      options: ['It dissolves back into the water', 'It explodes', 'It doubles in size instantly', 'It turns into gold'],
      correctIndex: 0,
      explanation: 'If the water isn’t full of minerals yet, atoms will slowly detach from the crystal.'
    },
    {
      id: 'cg-13',
      question: 'What gives crystals their different shapes, like columns or needles?',
      options: ['How the atoms fit together', 'The temperature of the air outside', 'The shape of the bucket', 'The color of the stone'],
      correctIndex: 0,
      explanation: 'Different minerals connect their atoms in different geometric angles.'
    },
    {
      id: 'cg-14',
      question: 'Can you grow crystals at home with sugar or salt?',
      options: ['No, only in space', 'Yes, by dissolving it in warm water and letting it cool', 'Only with a laser', 'Only under soil'],
      correctIndex: 1,
      explanation: 'You can easily grow sugar rock candy or salt crystals by letting water evaporate!'
    },
    {
      id: 'cg-15',
      question: 'Are all solid rocks made of crystals?',
      options: ['Almost all rocks are made of mineral crystals', 'No, only ice is crystalline', 'Rocks are made of rubber', 'Rocks have zero crystals'],
      correctIndex: 0,
      explanation: 'Granite and most rocks are mixtures of tiny interlocking mineral crystals.'
    }
  ],

  'dna-creatures': [
    {
      id: 'dna-1',
      question: 'What is DNA compared to inside our bodies?',
      options: ['A recipe book for building a living thing', 'A battery that never runs out', 'A shield against gravity', 'A pair of shoes'],
      correctIndex: 0,
      explanation: 'DNA holds the master instructions and recipes for building your body!'
    },
    {
      id: 'dna-2',
      question: 'What shape does a DNA molecule look like?',
      options: ['A flat circle', 'A twisted ladder or double helix', 'A straight square bar', 'A triangle pyramid'],
      correctIndex: 1,
      explanation: 'DNA looks like a spiral staircase or twisted ladder called a double helix.'
    },
    {
      id: 'dna-3',
      question: 'What are genes?',
      options: ['Clothes you wear', 'Small sections of DNA that decide specific traits', 'Cells in your stomach only', 'Types of bones'],
      correctIndex: 1,
      explanation: 'Genes are instructions that decide things like eye color, fur color, and height.'
    },
    {
      id: 'dna-4',
      question: 'How much of its DNA does a baby creature get from each parent?',
      options: ['100% from dad', 'Half from mom and half from dad', 'All from mom', 'It invents completely new DNA'],
      correctIndex: 1,
      explanation: 'Every baby inherits 50% of its genetic recipes from mom and 50% from dad.'
    },
    {
      id: 'dna-5',
      question: 'What is a dominant trait?',
      options: ['A trait that hides forever', 'A stronger trait that shows up easily', 'A trait that only birds have', 'A broken gene'],
      correctIndex: 1,
      explanation: 'Dominant traits show up even if a baby only inherits one copy of the gene.'
    },
    {
      id: 'dna-6',
      question: 'What are the four chemical letters of DNA?',
      options: ['A, B, C, D', 'A, T, C, G', 'W, X, Y, Z', 'H, E, L, P'],
      correctIndex: 1,
      explanation: 'Adenine (A), Thymine (T), Cytosine (C), and Guanine (G) make the rungs of DNA.'
    },
    {
      id: 'dna-7',
      question: 'What letter does A always connect with in DNA?',
      options: ['T', 'C', 'G', 'Z'],
      correctIndex: 0,
      explanation: 'In the DNA ladder, A always pairs with T, and C always pairs with G.'
    },
    {
      id: 'dna-8',
      question: 'What is a mutation?',
      options: ['A sudden, natural change in the DNA code', 'A clean bath', 'A type of animal food', 'A loud sound'],
      correctIndex: 0,
      explanation: 'Mutations are natural changes in DNA that can introduce fun new traits.'
    },
    {
      id: 'dna-9',
      question: 'If two black cats carry a hidden recessive white fur gene, can they have a white kitten?',
      options: ['No, never', 'Yes, if the kitten gets the white gene from both parents', 'Only in winter', 'Only if the kitten is a bird'],
      correctIndex: 1,
      explanation: 'When both parents pass down the recessive white gene, the baby can have white fur!'
    },
    {
      id: 'dna-10',
      question: 'Where is DNA kept inside an animal’s cells?',
      options: ['In the nucleus control center', 'In the hair only', 'Outside the cell', 'In the fingernails only'],
      correctIndex: 0,
      explanation: 'The nucleus acts as the cell’s library to keep DNA recipes safe.'
    },
    {
      id: 'dna-11',
      question: 'Why don’t brothers and sisters look completely identical?',
      options: ['They get different random mixes of genes from their parents', 'They eat different food', 'Genes change every day', 'They have different DNA parents'],
      correctIndex: 0,
      explanation: 'Each child gets a unique mix of parental genes, making everyone special!'
    },
    {
      id: 'dna-12',
      question: 'What grid tool do scientists use to predict baby traits?',
      options: ['A Punnett square', 'A ruler', 'A clock', 'A calculator'],
      correctIndex: 0,
      explanation: 'A Punnett square helps show which traits offspring might inherit.'
    },
    {
      id: 'dna-13',
      question: 'Do plants have DNA too?',
      options: ['Yes, all living things have DNA', 'No, only animals', 'Only trees have DNA', 'Only mushrooms have DNA'],
      correctIndex: 0,
      explanation: 'Plants, animals, and mushrooms all rely on DNA to grow and live!'
    },
    {
      id: 'dna-14',
      question: 'What do we call the physical look of an animal (like brown eyes or striped fur)?',
      options: ['Phenotype', 'Microscope', 'Telescope', 'Thermometer'],
      correctIndex: 0,
      explanation: 'Phenotype is the word for the physical traits you can actually see on the outside.'
    },
    {
      id: 'dna-15',
      question: 'What do cells make using the instructions on DNA?',
      options: ['Proteins', 'Plastic', 'Glass', 'Rock'],
      correctIndex: 0,
      explanation: 'Cells read DNA recipes to build proteins that make up muscles, fur, and skin.'
    }
  ],

  'circuit-testing': [
    {
      id: 'ct-1',
      question: 'What is an electric circuit?',
      options: ['A circle of stones', 'A closed loop that lets electricity flow', 'A broken wire', 'A wooden box'],
      correctIndex: 1,
      explanation: 'A circuit is a continuous path that lets electric energy travel from a power source and back.'
    },
    {
      id: 'ct-2',
      question: 'What happens to other bulbs in a SERIES circuit if one bulb is removed?',
      options: ['They all go out', 'They get brighter', 'They turn green', 'Nothing happens'],
      correctIndex: 0,
      explanation: 'In series, there is only one path. If one part breaks, the whole circuit stops!'
    },
    {
      id: 'ct-3',
      question: 'Why are lights in our homes wired in PARALLEL circuits?',
      options: ['So turning off one lamp doesn’t turn off every light in the house', 'Because parallel wire is made of gold', 'So they only work during daytime', 'Parallel circuits don’t need electricity'],
      correctIndex: 0,
      explanation: 'Parallel branches are independent, so each room can turn lights on or off separately!'
    },
    {
      id: 'ct-4',
      question: 'What does voltage mean?',
      options: ['The pushing force that moves electricity', 'The weight of the battery', 'The color of the wire', 'The length of the cord'],
      correctIndex: 0,
      explanation: 'Voltage is the electrical pressure pushing energy through the circuit.'
    },
    {
      id: 'ct-5',
      question: 'What happens to a light bulb when you increase the voltage?',
      options: ['It glows brighter', 'It gets colder and freezes', 'It immediately turns off', 'It turns into a fan'],
      correctIndex: 0,
      explanation: 'Higher voltage pushes more energy through the bulb filament, making it shine brighter!'
    },
    {
      id: 'ct-6',
      question: 'How does a generator create electricity?',
      options: ['By spinning magnets near copper wire coils', 'By burning wood inside', 'By cooling water into ice', 'By blowing air on light bulbs'],
      correctIndex: 0,
      explanation: 'Moving magnetic fields push electrons through wire coils to generate power.'
    },
    {
      id: 'ct-7',
      question: 'What is the job of a switch in a circuit?',
      options: ['To safely open or close the circuit loop', 'To change the color of the bulb', 'To make the wire longer', 'To make noise'],
      correctIndex: 0,
      explanation: 'A switch bridges the gap when ON to let electricity flow, and breaks it when OFF.'
    },
    {
      id: 'ct-8',
      question: 'Which of these materials is a good conductor of electricity?',
      options: ['Copper metal', 'Rubber', 'Dry wood', 'Plastic'],
      correctIndex: 0,
      explanation: 'Copper and other metals let electrons flow freely, making them great conductors.'
    },
    {
      id: 'ct-9',
      question: 'Why are electric wires covered in rubber or plastic?',
      options: ['To keep the wire warm', 'To insulate the wire so we don’t get shocked', 'To make wires bouncy', 'To make wires heavier'],
      correctIndex: 1,
      explanation: 'Rubber and plastic are insulators that block electricity and keep us safe.'
    },
    {
      id: 'ct-10',
      question: 'What unit do we use to measure electric current?',
      options: ['Amps (Amperes)', 'Meters', 'Grams', 'Liters'],
      correctIndex: 0,
      explanation: 'Amps measure how much electrical charge is flowing through a wire each second.'
    },
    {
      id: 'ct-11',
      question: 'What tiny particles actually move through a wire to make electricity?',
      options: ['Electrons', 'Molecules of dust', 'Drops of water', 'Atoms of sand'],
      correctIndex: 0,
      explanation: 'Electrons are tiny particles with negative charge that drift through metal conductors.'
    },
    {
      id: 'ct-12',
      question: 'What does a motor do in a circuit?',
      options: ['Turns electrical energy into spinning motion (like a fan)', 'Stores water', 'Creates cold ice', 'Paints the wire'],
      correctIndex: 0,
      explanation: 'Motors use electromagnets to spin shafts and rotate fan blades!'
    },
    {
      id: 'ct-13',
      question: 'What is a "short circuit"?',
      options: ['A low-resistance path where electricity bypasses the bulb and gets too hot', 'A wire that is very short in length', 'A tiny toy light', 'A battery with no power'],
      correctIndex: 0,
      explanation: 'A short circuit bypasses the load, causing dangerous surges of current.'
    },
    {
      id: 'ct-14',
      question: 'If you connect two 6-Volt batteries in series, what is the total voltage?',
      options: ['12 Volts', '0 Volts', '6 Volts', '3 Volts'],
      correctIndex: 0,
      explanation: 'In series, battery voltages add together: 6V + 6V = 12 Volts!'
    },
    {
      id: 'ct-15',
      question: 'What makes the wire inside an incandescent bulb glow?',
      options: ['Electric resistance heats the thin filament until it shines', 'Chemical liquid inside', 'Tiny mirrors reflecting sunlight', 'Radio waves'],
      correctIndex: 0,
      explanation: 'Electricity squeezing through the thin tungsten wire heats it up until it glows white-hot.'
    }
  ],

  'catastrophe-simulations': [
    {
      id: 'cs-1',
      question: 'What is molten rock called while it is still trapped underground?',
      options: ['Magma', 'Lava', 'Basalt', 'Obsidian'],
      correctIndex: 0,
      explanation: 'Geologists call underground molten rock magma, and surface molten rock lava.'
    },
    {
      id: 'cs-2',
      question: 'What is molten rock called once it erupts onto Earth’s surface?',
      options: ['Lava', 'Magma', 'Ice', 'Clay'],
      correctIndex: 0,
      explanation: 'Once it flows out into the open air, it is called lava.'
    },
    {
      id: 'cs-3',
      question: 'What causes explosive volcanic eruptions instead of gentle lava flows?',
      options: ['Thick, sticky magma trapping gas bubbles under high pressure', 'Cold weather', 'Ocean waves splashing inside', 'Loud thunder'],
      correctIndex: 0,
      explanation: 'Sticky magma traps expanding gas until pressure bursts violently like a shaken soda bottle!'
    },
    {
      id: 'cs-4',
      question: 'What is a gentle, slow-flowing volcanic eruption called?',
      options: ['An effusive eruption', 'A tornado', 'A blizzard', 'A sonic boom'],
      correctIndex: 0,
      explanation: 'Effusive eruptions happen when runny magma lets gas escape calmly, creating flowing lava rivers.'
    },
    {
      id: 'cs-5',
      question: 'What is the large underground pool of molten rock beneath a volcano called?',
      options: ['The magma chamber', 'A water well', 'The epicenter', 'A tectonic crack'],
      correctIndex: 0,
      explanation: 'The magma chamber is the hot underground reservoir feeding the volcano.'
    },
    {
      id: 'cs-6',
      question: 'What is the central pipe that carries magma from underground up to the crater called?',
      options: ['The conduit or vent', 'The chimney pipe', 'A water canal', 'A subway tunnel'],
      correctIndex: 0,
      explanation: 'The conduit is the main volcanic pipe connecting the magma chamber to the surface.'
    },
    {
      id: 'cs-7',
      question: 'What warning sign often happens at the beach right before a tsunami arrives?',
      options: ['The sea water pulls back, exposing the sandy ocean floor', 'Heavy snowfall', 'The sky turns completely purple', 'Fish fly into trees'],
      correctIndex: 0,
      explanation: 'The trough of the tsunami wave reaches the shore first, temporarily sucking water away from the beach!'
    },
    {
      id: 'cs-8',
      question: 'What natural event triggers most giant tsunamis?',
      options: ['An undersea earthquake that lifts or drops the ocean floor', 'Strong wind from a storm', 'Ships speeding in the water', 'Tides from the moon'],
      correctIndex: 0,
      explanation: 'Undersea tectonic fault slips suddenly displace huge amounts of ocean water.'
    },
    {
      id: 'cs-9',
      question: 'What causes earthquakes to happen?',
      options: ['Tectonic plates grinding together and suddenly slipping', 'Animals stomping', 'Heavy rain soaking the ground', 'Cars driving on roads'],
      correctIndex: 0,
      explanation: 'Earth’s crust pieces (tectonic plates) get stuck, build up pressure, and suddenly slip!'
    },
    {
      id: 'cs-10',
      question: 'What is an earthquake epicenter?',
      options: ['The point on the surface directly above where the quake started underground', 'The center of the Earth', 'A cloud in the sky', 'A weather station'],
      correctIndex: 0,
      explanation: 'The focus is underground, and the epicenter is the surface point directly above it.'
    },
    {
      id: 'cs-11',
      question: 'What scale do scientists use to measure the size and energy of earthquakes?',
      options: ['The Richter or Moment Magnitude scale', 'A thermometer', 'A wind gauge', 'The Mohs scale'],
      correctIndex: 0,
      explanation: 'The Richter and Moment Magnitude scales measure seismic energy released.'
    },
    {
      id: 'cs-12',
      question: 'What fast seismic waves travel first from an earthquake?',
      options: ['P-waves (Primary waves)', 'Sound waves', 'Ocean waves', 'Light waves'],
      correctIndex: 0,
      explanation: 'Primary compressional waves travel fastest through solid rock and reach seismographs first.'
    },
    {
      id: 'cs-13',
      question: 'What is a hot, rushing cloud of volcanic ash and gas called?',
      options: ['A pyroclastic flow', 'A friendly breeze', 'A fog bank', 'A dust devil'],
      correctIndex: 0,
      explanation: 'Pyroclastic flows are superheated avalanches of gas and ash racing down volcanoes.'
    },
    {
      id: 'cs-14',
      question: 'What happens before a volcano erupts that warns scientists?',
      options: ['Small earthquakes and gentle rumbling shake the mountain', 'The mountain turns green', 'Birds start singing louder', 'The wind stops completely'],
      correctIndex: 0,
      explanation: 'Rising magma cracks rock and causes small tremors and rumbling before an eruption!'
    },
    {
      id: 'cs-15',
      question: 'What should you do if you are at the coast and feel an earthquake or see the sea pull back?',
      options: ['Move to high ground immediately away from the beach', 'Run out to look at the exposed shells', 'Go swimming in the ocean', 'Hide under a beach umbrella'],
      correctIndex: 0,
      explanation: 'A receding ocean is nature’s tsunami warning: always move quickly to high ground!'
    }
  ],

  'rocket-launching': [
    {
      id: 'rl-1',
      question: 'What is rocket propulsion?',
      options: ['The forward pushing force that launches a rocket', 'The paint on the outside', 'The radio inside the cabin', 'The wheels on the launchpad'],
      correctIndex: 0,
      explanation: 'Propulsion is the thrust force created by engines to drive a rocket into the sky.'
    },
    {
      id: 'rl-2',
      question: 'Which of Newton’s laws explains rocket thrust (Action and Reaction)?',
      options: ['Third Law', 'First Law', 'Rule of Gravity only', 'Law of Magnetism'],
      correctIndex: 0,
      explanation: 'Newton’s Third Law states that every action has an equal and opposite reaction!'
    },
    {
      id: 'rl-3',
      question: 'What is a rocket’s apogee?',
      options: ['The highest point it reaches in flight', 'The launchpad button', 'The rocket’s name', 'The landing spot'],
      correctIndex: 0,
      explanation: 'Apogee is the highest altitude reached before the rocket begins to coast or fall.'
    },
    {
      id: 'rl-4',
      question: 'What happens when a rocket has a bigger fuel tank?',
      options: ['Its engines can fire for a longer duration', 'It can never lift off', 'It changes color to pink', 'It flies backwards'],
      correctIndex: 0,
      explanation: 'More fuel lets engines burn longer, allowing the rocket to fly higher and reach space!'
    },
    {
      id: 'rl-5',
      question: 'What are the white contrails left behind high rockets made of?',
      options: ['Frozen water vapor and ice crystals', 'White smoke bombs', 'Flour dust', 'Cotton wool'],
      correctIndex: 0,
      explanation: 'Hot exhaust water vapor freezes instantly in the freezing upper air into ice crystal trails.'
    },
    {
      id: 'rl-6',
      question: 'Why must space rockets carry their own oxygen tank?',
      options: ['There is no air or oxygen in space to burn fuel', 'To keep the rocket floating', 'To blow bubbles', 'To cool the wings'],
      correctIndex: 0,
      explanation: 'Space is a vacuum without air, so rockets must bring liquid oxygen (oxidizer) to burn their fuel.'
    },
    {
      id: 'rl-7',
      question: 'What do the fins at the bottom of a rocket do?',
      options: ['Keep the rocket flying straight and stable', 'Act as landing wheels', 'Make the rocket go backwards', 'Store extra water'],
      correctIndex: 0,
      explanation: 'Fins act like arrows to keep the rocket pointing forward through the air.'
    },
    {
      id: 'rl-8',
      question: 'Why do multi-stage rockets drop empty fuel tanks as they fly?',
      options: ['To get lighter so they can accelerate faster', 'To send souvenirs back to Earth', 'Because the tanks melt', 'To make room for astronauts'],
      correctIndex: 0,
      explanation: 'Dropping dead metal weight makes the remaining rocket lighter and much faster!'
    },
    {
      id: 'rl-9',
      question: 'What is the speed needed to break free from Earth’s gravity called?',
      options: ['Escape velocity', 'Speed of sound', 'Wind speed', 'Walking pace'],
      correctIndex: 0,
      explanation: 'Escape velocity (about 11 kilometers per second) is needed to leave Earth for deep space.'
    },
    {
      id: 'rl-10',
      question: 'What is the imaginary boundary 100 km high where space begins called?',
      options: ['The Kármán line', 'The finish line', 'The equator', 'The solar ring'],
      correctIndex: 0,
      explanation: 'The Kármán line at 100 km altitude marks the official boundary of outer space.'
    },
    {
      id: 'rl-11',
      question: 'What is the cargo carried by a rocket called (like a satellite or space probe)?',
      options: ['The payload', 'The launchpad', 'The contrail', 'The engine bell'],
      correctIndex: 0,
      explanation: 'Payload is the cargo, spacecraft, or astronauts carried on the mission.'
    },
    {
      id: 'rl-12',
      question: 'What shape is a rocket’s nosecone to cut smoothly through air?',
      options: ['Pointed and aerodynamic', 'Completely flat like a wall', 'Shaped like a doughnut', 'Square like a box'],
      correctIndex: 0,
      explanation: 'A sleek, pointy nosecone reduces air resistance so the rocket slices easily through the air.'
    },
    {
      id: 'rl-13',
      question: 'What happens to a rocket’s acceleration as its fuel burns and gets used up?',
      options: ['Acceleration increases because the rocket gets much lighter', 'Acceleration drops to zero immediately', 'The rocket stops moving', 'The rocket turns upside down'],
      correctIndex: 0,
      explanation: 'With steady thrust pushing a lighter and lighter rocket, acceleration gets faster and faster!'
    },
    {
      id: 'rl-14',
      question: 'Which atmospheric layer do rockets launch through first from the ground?',
      options: ['The troposphere', 'The ionosphere', 'The magnetosphere', 'The exosphere'],
      correctIndex: 0,
      explanation: 'The troposphere is the lowest atmospheric layer where weather happens and we live.'
    },
    {
      id: 'rl-15',
      question: 'What direction do most rockets launch towards to get a speed boost from Earth’s spin?',
      options: ['East', 'West', 'North', 'South'],
      correctIndex: 0,
      explanation: 'Earth rotates from west to east, so launching east adds Earth’s rotational speed!'
    }
  ],

  'defying-gravity': [
    {
      id: 'dg-1',
      question: 'What is gravity?',
      options: ['An invisible pulling force between objects with mass', 'A kind of electricity', 'A cold wind', 'A type of gas'],
      correctIndex: 0,
      explanation: 'Gravity is the natural pull that attracts objects with mass toward each other.'
    },
    {
      id: 'dg-2',
      question: 'What did Galileo discover about falling objects without air resistance?',
      options: ['All objects fall with the exact same gravity acceleration', 'Heavy objects always fall 10 times faster', 'Feathers float upwards forever', 'Apples only fall at night'],
      correctIndex: 0,
      explanation: 'Galileo proved that gravity accelerates all objects at the same rate regardless of their weight!'
    },
    {
      id: 'dg-3',
      question: 'Why does a feather fall slower than a bowling ball on Earth?',
      options: ['Air resistance pushes up against the wide, light feather', 'The feather has reverse gravity', 'The bowling ball has a motor', 'The feather is scared of falling'],
      correctIndex: 0,
      explanation: 'Air pushes against the surface of the feather like a parachute, slowing it down.'
    },
    {
      id: 'dg-4',
      question: 'What happened when astronauts dropped a hammer and a feather on the Moon?',
      options: ['They both hit the ground at the exact same instant', 'The hammer hit first and the feather floated away', 'The hammer floated into space', 'Both melted'],
      correctIndex: 0,
      explanation: 'Because there is no air on the Moon, the hammer and feather fell side-by-side and landed together!'
    },
    {
      id: 'dg-5',
      question: 'How does the Moon’s gravity compare to Earth’s gravity?',
      options: ['It is about 6 times weaker', 'It is 10 times stronger', 'It is exactly the same', 'The Moon has no gravity at all'],
      correctIndex: 0,
      explanation: 'The Moon is smaller and has less mass, so its gravity is about one-sixth of Earth’s.'
    },
    {
      id: 'dg-6',
      question: 'Which planet in our solar system has the strongest gravity?',
      options: ['Jupiter', 'Mars', 'Mercury', 'Venus'],
      correctIndex: 0,
      explanation: 'Jupiter is the most massive planet, so it pulls with the strongest gravitational force.'
    },
    {
      id: 'dg-7',
      question: 'What is your weight?',
      options: ['The measure of gravity pulling down on your mass', 'The number of hairs on your head', 'How tall you are in centimeters', 'The speed you run'],
      correctIndex: 0,
      explanation: 'Mass is the stuff you are made of; weight is how hard gravity pulls on that mass.'
    },
    {
      id: 'dg-8',
      question: 'Where on the measuring scale is 0 meters?',
      options: ['At the bottom (the ground)', 'At the top of the tower', 'In the middle', 'Outside the screen'],
      correctIndex: 0,
      explanation: 'We measure height starting at 0 meters on the ground up to the top of the drop tower.'
    },
    {
      id: 'dg-9',
      question: 'What happens to the speed of an apple as it falls toward the ground?',
      options: ['It speeds up more and more until impact', 'It stays at 0 speed the whole time', 'It slows down as it gets closer', 'It stops in mid-air'],
      correctIndex: 0,
      explanation: 'Gravity pulls continuously, making the object accelerate and gain speed every second it falls.'
    },
    {
      id: 'dg-10',
      question: 'What is Zero-G (Zero Gravity)?',
      options: ['When objects float freely without feeling weight', 'When gravity is 100 times stronger', 'A planet made of ice', 'A heavy bowling ball'],
      correctIndex: 0,
      explanation: 'In deep space, there is no strong planet pull nearby, so objects float weightlessly.'
    },
    {
      id: 'dg-11',
      question: 'Why do planets orbit the Sun instead of flying off into space?',
      options: ['The Sun’s huge gravity pulls them into orbital paths', 'Space has giant ropes', 'Planets are pushed by wind', 'Magnets in the planets'],
      correctIndex: 0,
      explanation: 'The Sun has massive gravity that keeps all the planets orbiting neatly around it.'
    },
    {
      id: 'dg-12',
      question: 'If you drop an object from 50 meters instead of 20 meters, what will happen?',
      options: ['It will take longer to hit and reach a faster speed', 'It will take less time', 'It will never land', 'It will change into water'],
      correctIndex: 0,
      explanation: 'A higher drop gives gravity more distance and time to accelerate the object to higher speeds.'
    },
    {
      id: 'dg-13',
      question: 'What is "terminal velocity"?',
      options: ['The steady speed reached when air push balances gravity pull', 'The speed of light', 'When an object hits the floor', 'Zero speed at rest'],
      correctIndex: 0,
      explanation: 'Once upward air drag matches downward gravity, a falling object stops speeding up.'
    },
    {
      id: 'dg-14',
      question: 'Why does an anvil fall with great force on the ground?',
      options: ['It has heavy mass and gravity pulls hard on it', 'It has wings', 'It is made of wood', 'It is filled with helium'],
      correctIndex: 0,
      explanation: 'The anvil’s high mass gives it significant momentum when pulled downward by gravity.'
    },
    {
      id: 'dg-15',
      question: 'Would a bathroom scale show a smaller number if you weighed yourself on Mars?',
      options: ['Yes, because Mars gravity is weaker than Earth', 'No, exactly the same', 'It would show infinity', 'It would show zero'],
      correctIndex: 0,
      explanation: 'Because Mars gravity is only about 38% of Earth’s, you would weigh much less on Mars!'
    }
  ]
};
