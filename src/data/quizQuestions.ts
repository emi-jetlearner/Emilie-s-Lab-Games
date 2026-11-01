import { GameId, QuizQuestion } from '../types';

export const QUIZ_QUESTION_BANKS: Record<GameId, QuizQuestion[]> = {
  'crystal-growing': [
    {
      id: 'cg-1',
      question: 'What is required for crystals to begin forming from a liquid solution?',
      options: ['Superheated steam', 'A supersaturated solution', 'Complete darkness', 'Constant magnetic field'],
      correctIndex: 1,
      explanation: 'Crystals precipitate when a solution contains more dissolved solute than it can hold at equilibrium (supersaturation).'
    },
    {
      id: 'cg-2',
      question: 'What is the initial microscopic cluster of atoms that seeds crystal growth called?',
      options: ['A nucleation site', 'A catalyst pod', 'An isotope ring', 'A meniscus core'],
      correctIndex: 0,
      explanation: 'Nucleation is the initial stage where atoms or molecules cluster into a stable crystalline lattice that other molecules attach to.'
    },
    {
      id: 'cg-3',
      question: 'Why does table salt (sodium chloride) naturally grow into cubic crystals?',
      options: ['It is carved by water currents', 'Its atomic lattice arranges in a repeating cubic grid', 'Air pressure pushes equally from four sides', 'Salt contains tiny square molds'],
      correctIndex: 1,
      explanation: 'Alternating Na+ and Cl- ions arrange in a face-centered cubic lattice geometry at the atomic scale.'
    },
    {
      id: 'cg-4',
      question: 'How does cooling rate affect the final size of growing crystals in nature?',
      options: ['Slow cooling produces larger crystals', 'Fast cooling produces larger crystals', 'Cooling rate has zero effect on crystal size', 'Only freezing allows any crystals to form'],
      correctIndex: 0,
      explanation: 'Slow cooling gives atoms ample time to migrate and bond to existing lattice faces, resulting in fewer, larger crystals (like granite vs obsidian).'
    },
    {
      id: 'cg-5',
      question: 'What mineral makes the deep purple gemstone known as Amethyst?',
      options: ['Beryl with chromium', 'Quartz with iron impurities and radiation', 'Diamond with nitrogen', 'Corundum with titanium'],
      correctIndex: 1,
      explanation: 'Amethyst is quartz (SiO2) colored purple by trace iron ions irradiated by natural gamma rays in the surrounding rock.'
    },
    {
      id: 'cg-6',
      question: 'What property gives crystals their flat, sparkling planar faces?',
      options: ['Surface friction', 'Cleavage along crystal lattice planes', 'Evaporation residue', 'Electrostatic polarity'],
      correctIndex: 1,
      explanation: 'Crystal faces follow internal atomic lattice planes where atomic bonding symmetry produces smooth geometric surfaces.'
    },
    {
      id: 'cg-7',
      question: 'What is a "solute" in a crystal growing experiment?',
      options: ['The liquid that dissolves solids', 'The solid substance being dissolved', 'The container holding the liquid', 'The temperature gauge'],
      correctIndex: 1,
      explanation: 'The solute is the substance being dissolved (such as alum, salt, or copper sulfate) in the solvent (usually water).'
    },
    {
      id: 'cg-8',
      question: 'Which of the following is an example of an amorphous solid rather than a true crystal?',
      options: ['Quartz', 'Volcanic obsidian glass', 'Snowflake', 'Pyrite cube'],
      correctIndex: 1,
      explanation: 'Obsidian glass cools so rapidly that silica atoms freeze without forming an orderly crystalline lattice.'
    },
    {
      id: 'cg-9',
      question: 'What crystal system has three axes of equal length meeting at 90-degree angles?',
      options: ['Isometric (Cubic)', 'Hexagonal', 'Triclinic', 'Monoclinic'],
      correctIndex: 0,
      explanation: 'The isometric or cubic system has three perpendicular axes of identical length, as seen in halite and diamond.'
    },
    {
      id: 'cg-10',
      question: 'Why do snowflakes always have 6-fold radial symmetry?',
      options: ['Wind spins them as they fall', 'Water molecules bond at 104.5° and form hexagonal rings', 'Earth has 6 magnetic poles', 'Gravity pulls at 60-degree increments'],
      correctIndex: 1,
      explanation: 'Hydrogen bonds between polar H2O molecules form an open hexagonal lattice, producing six-sided symmetry.'
    },
    {
      id: 'cg-11',
      question: 'What happens to a crystal if placed into an unsaturated solution of the same substance?',
      options: ['It grows twice as fast', 'It will slowly dissolve back into liquid', 'It turns into gas instantly', 'It changes color to black'],
      correctIndex: 1,
      explanation: 'An unsaturated solution can hold more dissolved ions, so molecules detach from the crystal surface back into solution.'
    },
    {
      id: 'cg-12',
      question: 'What tool is used in laboratories to view the internal atomic arrangement of crystals?',
      options: ['Stethoscope', 'X-ray crystallography diffractometer', 'Geiger counter', 'Barometer'],
      correctIndex: 1,
      explanation: 'X-ray crystallography measures how X-rays diffract through crystal planes to map the 3D atomic arrangement.'
    },
    {
      id: 'cg-13',
      question: 'What is a "seed crystal"?',
      options: ['A biological plant seed', 'A pre-formed tiny crystal added to induce fast, orderly growth', 'A chemical fertilizer drop', 'A glass marble placed at the bottom'],
      correctIndex: 1,
      explanation: 'A seed crystal acts as a template for solute ions to crystallize onto, bypassing the random nucleation barrier.'
    },
    {
      id: 'cg-14',
      question: 'What gives emeralds their distinctive bright green coloration?',
      options: ['Trace amounts of chromium or vanadium', 'High concentrations of pure iron', 'Encapsulated sea algae', 'Trapped carbon dioxide bubbles'],
      correctIndex: 0,
      explanation: 'Emerald is a variety of the mineral beryl (Be3Al2Si6O18) with trace chromium or vanadium replacing aluminum ions.'
    },
    {
      id: 'cg-15',
      question: 'Which of the following crystals has the highest score (10) on the Mohs hardness scale?',
      options: ['Talc', 'Topaz', 'Diamond', 'Corundum'],
      correctIndex: 2,
      explanation: 'Diamond consists of tightly bonded carbon atoms in a tetrahedral lattice, making it the hardest natural mineral.'
    },
    {
      id: 'cg-16',
      question: 'What is "efflorescence" in mineral crystals?',
      options: ['The loss of water molecules from a hydrated crystal into dry air', 'Luminescence under blacklight', 'Rapid boiling of crystals', 'Instant magnetic attraction'],
      correctIndex: 0,
      explanation: 'Hydrated crystals can lose water of crystallization into dry air, forming a powdery coating on their surface.'
    }
  ],

  'dna-creatures': [
    {
      id: 'dna-1',
      question: 'What does the abbreviation "DNA" stand for?',
      options: ['Deoxyribonucleic Acid', 'Dual Nitrogen Array', 'Dynamic Nuclear Acid', 'Direct Nucleotide Antigen'],
      correctIndex: 0,
      explanation: 'DNA stands for Deoxyribonucleic Acid, the molecule carrying genetic instructions in all known living organisms.'
    },
    {
      id: 'dna-2',
      question: 'Which four chemical nitrogenous bases make up the rungs of the DNA ladder?',
      options: ['Adenine, Thymine, Cytosine, Guanine', 'Alanine, Tyrosine, Cysteine, Glycine', 'Alpha, Theta, Chi, Gamma', 'Sodium, Potassium, Calcium, Magnesium'],
      correctIndex: 0,
      explanation: 'The four bases are Adenine (A), Thymine (T), Cytosine (C), and Guanine (G), which pair as A-T and C-G.'
    },
    {
      id: 'dna-3',
      question: 'What is the term for different versions of the same gene, such as blue vs brown eyes?',
      options: ['Alleles', 'Gametes', 'Ribosomes', 'Enzymes'],
      correctIndex: 0,
      explanation: 'Alleles are variant forms of a gene located at the same genetic locus on homologous chromosomes.'
    },
    {
      id: 'dna-4',
      question: 'What grid diagram is commonly used in biology to calculate parental trait probability?',
      options: ['Venn diagram', 'Punnett square', 'Fibonacci spiral', 'Bohr diagram'],
      correctIndex: 1,
      explanation: 'A Punnett square predicts the potential genotypes and phenotypes of offspring from parental alleles.'
    },
    {
      id: 'dna-5',
      question: 'What is the difference between a creature’s genotype and its phenotype?',
      options: ['Genotype is genetic code; phenotype is physical appearance', 'Genotype is weight; phenotype is height', 'Genotype changes daily; phenotype never changes', 'There is no difference'],
      correctIndex: 0,
      explanation: 'Genotype refers to the specific alleles carried (e.g. Bb), while phenotype is the expressed observable trait (e.g. purple fur).'
    },
    {
      id: 'dna-6',
      question: 'If a dominant brown allele (B) pairs with a recessive blue allele (b), what eye color appears?',
      options: ['Blue eyes', 'Brown eyes', 'Green eyes', 'Striped eyes'],
      correctIndex: 1,
      explanation: 'Dominant alleles mask recessive ones in heterozygous individuals (Bb), expressing the dominant brown trait.'
    },
    {
      id: 'dna-7',
      question: 'What geometric shape describes the iconic 3D structure of DNA?',
      options: ['Triple spiral', 'Double helix', 'Planar hexagon', 'Conical ring'],
      correctIndex: 1,
      explanation: 'James Watson and Francis Crick (along with Rosalind Franklin’s X-ray photo 51) described DNA as a double helix.'
    },
    {
      id: 'dna-8',
      question: 'In genetics, what happens during "codominance"?',
      options: ['Both parental alleles are fully and simultaneously expressed', 'One allele destroys the other', 'Neither allele is inherited', 'All offspring are identical clones'],
      correctIndex: 0,
      explanation: 'In codominance, both alleles are expressed equally without blending (like a cat with both orange and black patches).'
    },
    {
      id: 'dna-9',
      question: 'How many chromosomes do human cells normally possess in their somatic nuclei?',
      options: ['12 pairs (24 total)', '23 pairs (46 total)', '46 pairs (92 total)', '100 pairs'],
      correctIndex: 1,
      explanation: 'Humans have 23 pairs of chromosomes (46 total), with 23 inherited from each biological parent.'
    },
    {
      id: 'dna-10',
      question: 'What cellular process halves chromosome number to produce reproductive gametes?',
      options: ['Mitosis', 'Meiosis', 'Fermentation', 'Glycolysis'],
      correctIndex: 1,
      explanation: 'Meiosis is a specialized cell division that reduces chromosome count by half, producing haploid sperm or egg cells.'
    },
    {
      id: 'dna-11',
      question: 'What is a sudden permanent change in an organism’s DNA sequence called?',
      options: ['Mitosis', 'Mutation', 'Metabolism', 'Metamorphosis'],
      correctIndex: 1,
      explanation: 'A mutation is an alteration in nucleotide sequence, which can introduce novel traits into a population.'
    },
    {
      id: 'dna-12',
      question: 'What does it mean if an organism is "homozygous" for a specific trait?',
      options: ['It carries two identical alleles for that gene', 'It has two completely different alleles', 'It has lost the gene entirely', 'It was grown in a petri dish'],
      correctIndex: 0,
      explanation: 'Homozygous means having two identical copies of an allele (such as BB or bb) at that genetic locus.'
    },
    {
      id: 'dna-13',
      question: 'Which cellular organelles read messenger RNA to assemble proteins according to DNA code?',
      options: ['Vacuoles', 'Ribosomes', 'Lysosomes', 'Chloroplasts'],
      correctIndex: 1,
      explanation: 'Ribosomes translate mRNA codon triplets into polypeptide amino acid chains to construct proteins.'
    },
    {
      id: 'dna-14',
      question: 'What is selective breeding (artificial selection)?',
      options: ['Random mating in the wild', 'Humans deliberately choosing parents with desired traits', 'Using lasers to change fur color', 'Animals choosing their own habitats'],
      correctIndex: 1,
      explanation: 'Selective breeding involves selecting parents with specific phenotypic traits to pass those qualities on to future generations.'
    },
    {
      id: 'dna-15',
      question: 'If two heterozygous parents (Bb x Bb) mate, what percentage of offspring is predicted to show the recessive trait (bb)?',
      options: ['0%', '25%', '50%', '75%'],
      correctIndex: 1,
      explanation: 'The Punnett square yields 1 BB, 2 Bb, and 1 bb, meaning 1 in 4 (25%) will be homozygous recessive (bb).'
    },
    {
      id: 'dna-16',
      question: 'What molecule serves as an intermediate messenger carrying genetic recipes from the nucleus?',
      options: ['Lipid', 'mRNA (Messenger RNA)', 'Glucose', 'Hemoglobin'],
      correctIndex: 1,
      explanation: 'mRNA transcribes code from nuclear DNA and transports it to ribosomes in the cytoplasm for translation.'
    }
  ],

  'circuit-testing': [
    {
      id: 'ct-1',
      question: 'What mathematical formula represents Ohm’s Law?',
      options: ['V = I × R', 'P = V / I', 'E = m × c²', 'F = m × a'],
      correctIndex: 0,
      explanation: 'Ohm’s law states that Voltage (V) equals Current (I) multiplied by Resistance (R).'
    },
    {
      id: 'ct-2',
      question: 'What happens to the remaining bulbs in a simple SERIES circuit if one bulb burns out or is removed?',
      options: ['They get twice as bright', 'All remaining bulbs go out immediately', 'They start flashing rapidly', 'Only the first bulb stays lit'],
      correctIndex: 1,
      explanation: 'A series circuit has only one continuous conductive loop; breaking any component opens the entire path.'
    },
    {
      id: 'ct-3',
      question: 'Why are household appliances and home lighting wired in PARALLEL circuits instead of series?',
      options: ['Parallel circuits use less copper', 'Each device receives full line voltage and can operate independently', 'Parallel circuits generate free electricity', 'Series circuits only work with DC batteries'],
      correctIndex: 1,
      explanation: 'Parallel wiring ensures that switching off one appliance does not interrupt power to other appliances.'
    },
    {
      id: 'ct-4',
      question: 'What unit is used to measure electrical current?',
      options: ['Volts', 'Amperes (Amps)', 'Ohms', 'Watts'],
      correctIndex: 1,
      explanation: 'Electrical current—the rate of charge flow through a conductor—is measured in Amperes (A).'
    },
    {
      id: 'ct-5',
      question: 'What is a "short circuit" and why is it dangerous in an electrical system?',
      options: ['A circuit that is too short in length', 'A low-resistance connection that causes dangerously high current flow and heat', 'A circuit with dead batteries', 'A wire with too much insulation'],
      correctIndex: 1,
      explanation: 'A short circuit bypasses the electrical load, causing extreme current surges that can melt wires and spark fires.'
    },
    {
      id: 'ct-6',
      question: 'Which of the following materials is an electrical INSULATOR?',
      options: ['Copper wire', 'Rubber casing', 'Aluminum foil', 'Silver bar'],
      correctIndex: 1,
      explanation: 'Rubber has tightly bound valence electrons that resist electric current, making it an excellent insulator.'
    },
    {
      id: 'ct-7',
      question: 'What is the function of a switch in an electrical circuit?',
      options: ['To create extra electric charge', 'To safely open (break) or close (complete) the conductive loop', 'To change DC into AC power', 'To increase battery chemical capacity'],
      correctIndex: 1,
      explanation: 'A switch bridges or disconnects contact points, letting current flow when closed and halting it when open.'
    },
    {
      id: 'ct-8',
      question: 'If two identical 6-Volt batteries are connected in SERIES (+ to -), what is the total voltage delivered?',
      options: ['0 Volts', '3 Volts', '6 Volts', '12 Volts'],
      correctIndex: 3,
      explanation: 'Series battery voltages add directly together: 6V + 6V = 12V.'
    },
    {
      id: 'ct-9',
      question: 'What device converts electrical energy into mechanical kinetic motion in a circuit?',
      options: ['An electric motor', 'A capacitor', 'A resistor', 'A voltmeter'],
      correctIndex: 0,
      explanation: 'Electric motors use magnetic fields generated by electric current to rotate a shaft and spin fan blades.'
    },
    {
      id: 'ct-10',
      question: 'What unit measures electrical resistance?',
      options: ['Ohm (Ω)', 'Tesla (T)', 'Joule (J)', 'Henry (H)'],
      correctIndex: 0,
      explanation: 'Resistance, which opposes current flow, is measured in Ohms (symbolized by the Greek letter Ω).'
    },
    {
      id: 'ct-11',
      question: 'What safety component contains a thin wire designed to melt and break the circuit during overcurrent?',
      options: ['A fuse', 'A transformer', 'A diode', 'An alternator'],
      correctIndex: 0,
      explanation: 'A fuse intentionally melts when current exceeds safe limits, protecting expensive equipment and preventing fires.'
    },
    {
      id: 'ct-12',
      question: 'What subatomic particles actually drift through a metal wire to produce electric current?',
      options: ['Protons', 'Neutrons', 'Electrons', 'Photons'],
      correctIndex: 2,
      explanation: 'Negatively charged free valence electrons drift through the metallic lattice under an applied electric potential.'
    },
    {
      id: 'ct-13',
      question: 'What happens to the total resistance of a circuit when you add more branches in PARALLEL?',
      options: ['Total resistance increases', 'Total resistance decreases', 'Total resistance stays exactly the same', 'Resistance drops to absolute zero'],
      correctIndex: 1,
      explanation: 'Adding parallel branches provides additional alternative pathways for current, lowering total equivalent resistance.'
    },
    {
      id: 'ct-14',
      question: 'What happens to an incandescent bulb’s brightness if circuit voltage increases while resistance stays constant?',
      options: ['It dims', 'It becomes brighter', 'Its color turns black', 'It stops drawing power'],
      correctIndex: 1,
      explanation: 'By Ohm’s Law and Joule heating ($P = V^2 / R$), higher voltage drives more current and produces more luminous power.'
    },
    {
      id: 'ct-15',
      question: 'What kind of electricity is produced by a hand-crank generator using coils and magnets?',
      options: ['Electromagnetic induction', 'Static combustion', 'Nuclear decay', 'Thermal sublimation'],
      correctIndex: 0,
      explanation: 'Faraday’s law of induction explains that moving a magnetic field through a wire coil induces electrical current.'
    },
    {
      id: 'ct-16',
      question: 'Which instrument is connected in series with a circuit to measure its electric current?',
      options: ['An ammeter', 'A barometer', 'A hydrometer', 'A seismograph'],
      correctIndex: 0,
      explanation: 'An ammeter has very low internal resistance and is wired in series so all current flows through it to be measured.'
    }
  ],

  'catastrophe-simulations': [
    {
      id: 'cs-1',
      question: 'What is the scientific difference between "magma" and "lava"?',
      options: ['Magma is molten rock underground; lava is molten rock on Earth’s surface', 'Magma is solid; lava is liquid', 'Magma only exists on Mars', 'Lava is colder than magma'],
      correctIndex: 0,
      explanation: 'Geologists call molten rock magma when beneath Earth’s crust, and lava once it erupts onto the surface.'
    },
    {
      id: 'cs-2',
      question: 'How does the silica content (SiO2) of magma affect its viscosity and eruption style?',
      options: ['High silica magma is runny and gentle', 'High silica magma is thick and sticky, causing explosive eruptions', 'Silica has no effect on volcanic eruptions', 'Silica makes lava freeze into ice'],
      correctIndex: 1,
      explanation: 'High-silica magmas (like rhyolite) are viscous and trap expanding volcanic gases, leading to violent explosive eruptions.'
    },
    {
      id: 'cs-3',
      question: 'What primary natural event triggers most devastating tsunamis?',
      options: ['Hurricanes and strong wind', 'Vertical displacement of the seafloor by an undersea earthquake', 'Tidal gravity from the moon', 'Ship propellers'],
      correctIndex: 1,
      explanation: 'Subduction zone earthquakes abruptly push seafloor plates up or down, displacing immense volumes of water.'
    },
    {
      id: 'cs-4',
      question: 'What is "wave shoaling" as a tsunami approaches shallow coastal waters?',
      options: ['Waves disappear completely', 'Wave speed decreases while wave height dramatically rises', 'Waves speed up to the speed of sound', 'Water turns into boiling vapor'],
      correctIndex: 1,
      explanation: 'In shallow water, friction compresses the wave energy, slowing the front of the wave and forcing water to build into a towering surge.'
    },
    {
      id: 'cs-5',
      question: 'What warning sign often precedes the arrival of a tsunami wave on a shoreline?',
      options: ['Sudden receding and drawback of coastal water exposing the seabed', 'Heavy snow falling on the ocean', 'The sun turning green', 'Instant silence of all birds globally'],
      correctIndex: 0,
      explanation: 'If the trough of the tsunami wave reaches shore first, water withdraws dramatically, exposing seafloor and reefs.'
    },
    {
      id: 'cs-6',
      question: 'What scale measures the total energy released by an earthquake?',
      options: ['Mohs scale', 'Moment Magnitude / Richter scale', 'Beaufort scale', 'Kelvin scale'],
      correctIndex: 1,
      explanation: 'Seismologists use the Richter and Moment Magnitude scales to quantify seismic energy released at the earthquake source.'
    },
    {
      id: 'cs-7',
      question: 'Each whole number increase on the Moment Magnitude scale represents roughly how much more energy released?',
      options: ['2 times more', '10 times more', 'Approximately 32 times more energy', '1000 times more'],
      correctIndex: 2,
      explanation: 'Because it is logarithmic, a magnitude 7.0 earthquake releases about 31.6 times more energy than a 6.0.'
    },
    {
      id: 'cs-8',
      question: 'Which seismic waves travel fastest through Earth’s interior and arrive first at seismographs?',
      options: ['P-waves (Primary compressional waves)', 'S-waves (Secondary shear waves)', 'Rayleigh surface waves', 'Love waves'],
      correctIndex: 0,
      explanation: 'P-waves are longitudinal compressional waves that travel fastest through rock and can pass through solids, liquids, and gases.'
    },
    {
      id: 'cs-9',
      question: 'What dangerous volcanic phenomenon consists of a superheated avalanche of gas, ash, and rock traveling over 100 km/h?',
      options: ['A pyroclastic flow', 'A geyser', 'A fumarole', 'A mud crater'],
      correctIndex: 0,
      explanation: 'Pyroclastic flows are lethal high-density avalanches of scorching gas and volcanic debris reaching over 700°C.'
    },
    {
      id: 'cs-10',
      question: 'What is the point on Earth’s surface directly above where an earthquake fault rupture originates?',
      options: ['The hypocenter', 'The epicenter', 'The caldera', 'The mantle plume'],
      correctIndex: 1,
      explanation: 'The focus or hypocenter is deep underground where slipping begins; the epicenter is the point directly above on the surface.'
    },
    {
      id: 'cs-11',
      question: 'Why do buildings constructed on soft sand or saturated soil suffer more earthquake damage than those on bedrock?',
      options: ['Soil liquefaction and seismic wave amplification occur', 'Soft sand absorbs all gravity', 'Bedrock vibrates much faster than sand', 'Sand attracts magnetic fields'],
      correctIndex: 0,
      explanation: 'Unconsolidated water-saturated soil loses strength and behaves like quicksand (liquefaction), causing foundations to sink and collapse.'
    },
    {
      id: 'cs-12',
      question: 'What is a "lahar" in volcanic science?',
      options: ['A destructive volcanic mudflow of water, volcanic ash, and debris', 'A volcanic lightning storm', 'A cooled obsidian blade', 'A volcanic cloud that smells like roses'],
      correctIndex: 0,
      explanation: 'Lahars occur when volcanic activity melts glaciers or heavy rain mobilizes thick ash into rushing concrete-like mudflows.'
    },
    {
      id: 'cs-13',
      question: 'What tectonic boundary feature forms when one tectonic plate dives beneath another into the hot mantle?',
      options: ['A subduction zone', 'A mid-ocean ridge rift', 'A strike-slip transform fault', 'A meteor crater'],
      correctIndex: 0,
      explanation: 'Subduction zones generate Earth’s most powerful earthquakes, deep ocean trenches, and volcanic island arcs.'
    },
    {
      id: 'cs-14',
      question: 'What is a volcanic "caldera"?',
      options: ['A large basin created when a volcano’s magma chamber empties and collapses inward', 'The tiny vent at the top of a sparkler', 'A frozen lava tube', 'A type of crystal found in pumice'],
      correctIndex: 0,
      explanation: 'A caldera forms when an enormous eruption drains the magma chamber underneath, causing the mountain summit to collapse.'
    },
    {
      id: 'cs-15',
      question: 'How fast can a tsunami wave travel in deep open ocean waters (4000 meters deep)?',
      options: ['10 km/h (running pace)', '50 km/h (car speed)', 'Over 700–800 km/h (jet airliner speed)', 'Speed of light'],
      correctIndex: 2,
      explanation: 'In deep water ($v = \\sqrt{gh}$), tsunamis travel at jetliner speeds (over 800 km/h) with barely noticeable wave heights until nearing shore.'
    },
    {
      id: 'cs-16',
      question: 'What engineering feature helps modern skyscrapers survive earthquake vibrations?',
      options: ['Rigid unbending steel pins', 'Base isolators and tuned mass dampers that absorb seismic motion', 'Removing all interior walls', 'Building only with hollow glass'],
      correctIndex: 1,
      explanation: 'Base isolators decouple the building from shaking ground, while heavy tuned mass dampers swing oppositely to stabilize swaying.'
    }
  ],

  'rocket-launching': [
    {
      id: 'rl-1',
      question: 'Which of Sir Isaac Newton’s laws of motion explains how rocket engines generate forward thrust?',
      options: ['Third Law: For every action, there is an equal and opposite reaction', 'First Law: An object at rest stays at rest', 'Second Law: F = m × a only', 'Law of Universal Gravitation only'],
      correctIndex: 0,
      explanation: 'Expelling hot exhaust gases backwards at high velocity exerts an equal and opposite reaction force that drives the rocket forward.'
    },
    {
      id: 'rl-2',
      question: 'What is a rocket’s "apogee"?',
      options: ['The highest altitude reached during its flight trajectory', 'The moment of engine ignition', 'The landing touchdown spot', 'The rocket’s maximum speed'],
      correctIndex: 0,
      explanation: 'Apogee is the highest point of an orbital or suborbital flight before gravity begins pulling the vehicle back down.'
    },
    {
      id: 'rl-3',
      question: 'Why do multi-stage rockets drop empty fuel tanks during flight into space?',
      options: ['To signal ground observers', 'To discard dead mass and allow remaining stages to accelerate much faster', 'To keep the rocket cool', 'Empty tanks attract space debris'],
      correctIndex: 1,
      explanation: 'Discarding empty tanks reduces vehicle mass, dramatically increasing acceleration and efficiency per the Tsiolkovsky rocket equation.'
    },
    {
      id: 'rl-4',
      question: 'What makes up the condensation trails (contrails) left behind high-altitude rocket launches and jet engines?',
      options: ['Solid iron dust', 'Condensed water vapor droplets and ice crystals', 'Radioactive emissions', 'Pure burning sulfur'],
      correctIndex: 1,
      explanation: 'Rocket propellant combustion produces hot water vapor and CO2; in cold upper atmosphere air, water vapor condenses into clouds of ice crystals.'
    },
    {
      id: 'rl-5',
      question: 'What velocity is required for a rocket to escape Earth’s gravitational pull without further propulsion?',
      options: ['About 11.2 km/s (Escape Velocity)', '100 km/h', '1.0 km/s', 'Speed of sound (Mach 1)'],
      correctIndex: 0,
      explanation: 'Earth’s escape velocity is approximately 11.2 kilometers per second (about 40,320 km/h or 25,000 mph).'
    },
    {
      id: 'rl-6',
      question: 'Why must liquid rocket engines carry both fuel AND an oxidizer (like liquid oxygen) in space?',
      options: ['Space has no atmospheric oxygen to sustain fuel combustion', 'Oxidizers make the rocket look colorful', 'To balance the weight of the wings', 'To prevent fuel from evaporating in the sun'],
      correctIndex: 0,
      explanation: 'Because the vacuum of space contains no oxygen, rockets must carry their own oxidizer to chemically react and burn fuel.'
    },
    {
      id: 'rl-7',
      question: 'What is the aerodynamic purpose of fins on the base of a suborbital rocket?',
      options: ['To provide lift like an airplane', 'To keep the Center of Pressure behind the Center of Mass for aerodynamic stability', 'To house landing wheels', 'To push contrails sideways'],
      correctIndex: 1,
      explanation: 'Fins shift the center of aerodynamic pressure behind the rocket’s center of mass, preventing it from tumbling out of control.'
    },
    {
      id: 'rl-8',
      question: 'What is "Max Q" during a rocket launch ascent?',
      options: ['The point of maximum aerodynamic dynamic pressure on the rocket structure', 'The maximum quantity of fuel remaining', 'The moment of quiet communication', 'The maximum engine temperature'],
      correctIndex: 0,
      explanation: 'Max Q is when mechanical aerodynamic stress peaks due to high vehicle velocity colliding with dense atmospheric air.'
    },
    {
      id: 'rl-9',
      question: 'What is the lowest layer of Earth’s atmosphere where weather happens and launches begin?',
      options: ['Troposphere', 'Stratosphere', 'Thermosphere', 'Exosphere'],
      correctIndex: 0,
      explanation: 'The troposphere extends from ground level up to roughly 12 km (7 miles) and contains ~75% of atmospheric air mass.'
    },
    {
      id: 'rl-10',
      question: 'Why do most orbital space launches head EASTWARD from the launchpad?',
      options: ['To fly towards the rising sun', 'To take advantage of Earth’s rotational speed boost', 'Because winds always blow eastward', 'Space stations only orbit east-to-west'],
      correctIndex: 1,
      explanation: 'Earth rotates from west to east; launching east adds Earth’s rotational surface speed (up to 1,670 km/h at equator) to the rocket.'
    },
    {
      id: 'rl-11',
      question: 'What famous rocket equation relates vehicle mass ratio, exhaust velocity, and delta-v?',
      options: ['The Tsiolkovsky Rocket Equation', 'The Kepler Equation', 'The Bernoulli Principle', 'The Hubble Law'],
      correctIndex: 0,
      explanation: 'Konstantin Tsiolkovsky formulated $\\Delta v = v_e \\ln(m_0 / m_f)$, the fundamental governing formula of astronautics.'
    },
    {
      id: 'rl-12',
      question: 'What boundary line, located 100 kilometers (62 miles) above sea level, is commonly defined as the edge of space?',
      options: ['The Kármán Line', 'The Armstrong Limit', 'The Van Allen Belt', 'The Kuiper Boundary'],
      correctIndex: 0,
      explanation: 'The Kármán line at 100 km altitude marks where the atmosphere becomes too thin to support aerodynamic flight without orbital speed.'
    },
    {
      id: 'rl-13',
      question: 'What shaped nozzle is used on rocket engines to expand supersonic exhaust gas efficiently?',
      options: ['De Laval convergent-divergent nozzle', 'Cylindrical pipe', 'Square funnel', 'Perforated sprinkler'],
      correctIndex: 0,
      explanation: 'A de Laval nozzle narrows to a throat and then flares outward, accelerating hot gas from subsonic to supersonic speeds.'
    },
    {
      id: 'rl-14',
      question: 'What is the "payload" of a rocket launch mission?',
      options: ['The cargo or passengers being transported (e.g. satellite, probe, astronaut crew)', 'The rocket fuel in the lower tank', 'The steel launchpad tower', 'The spent rocket boosters in the ocean'],
      correctIndex: 0,
      explanation: 'The payload is the active mission cargo carried into space, distinct from the vehicle structure and propellant.'
    },
    {
      id: 'rl-15',
      question: 'What happens to the acceleration of a rocket as its engines fire continuously at constant thrust?',
      options: ['Acceleration increases because the rocket’s total mass decreases as fuel burns', 'Acceleration decreases to zero', 'Acceleration stays perfectly constant', 'Acceleration oscillates like a pendulum'],
      correctIndex: 0,
      explanation: 'According to $a = F / m$, as propellant mass ($m$) is rapidly consumed while thrust ($F$) remains steady, acceleration ($a$) rises.'
    },
    {
      id: 'rl-16',
      question: 'What causes the colorful "jellyfish effect" often seen during twilight rocket launches?',
      options: ['High-altitude rocket exhaust catching sunlight against a dark twilight sky', 'Bioluminescent jellyfish in the clouds', 'Engine coolant spraying randomly', 'Atmospheric neon sign reflections'],
      correctIndex: 0,
      explanation: 'At dawn or dusk, sunlight illuminates expanding high-altitude exhaust contrails while ground observers are still in darkness.'
    }
  ],

  'defying-gravity': [
    {
      id: 'dg-1',
      question: 'What did Galileo Galilei famously demonstrate about falling objects in the absence of air resistance?',
      options: ['Heavy objects fall much faster than light ones', 'All objects fall with the exact same gravitational acceleration regardless of mass', 'Light objects fall faster because they are nimble', 'Objects only fall if they are metallic'],
      correctIndex: 1,
      explanation: 'Galileo proved that gravity accelerates all objects at the same rate regardless of their mass when air drag is removed.'
    },
    {
      id: 'dg-2',
      question: 'What is the approximate acceleration due to gravity ($g$) at Earth’s surface?',
      options: ['9.81 m/s²', '1.62 m/s²', '24.79 m/s²', '100 m/s²'],
      correctIndex: 0,
      explanation: 'Earth’s surface gravity accelerates free-falling objects downward at approximately 9.81 meters per second squared.'
    },
    {
      id: 'dg-3',
      question: 'What is "terminal velocity" when an object drops through an atmosphere?',
      options: ['The speed of light', 'The speed where downward gravity matches upward aerodynamic drag, resulting in constant velocity', 'The moment the object explodes on impact', 'Zero speed when resting on a shelf'],
      correctIndex: 1,
      explanation: 'Terminal velocity occurs when the upward drag force ($F_d$) equals the downward gravitational force ($mg$), so net acceleration becomes zero.'
    },
    {
      id: 'dg-4',
      question: 'During Apollo 15 on the Moon, astronaut David Scott dropped a hammer and a falcon feather. What happened?',
      options: ['The feather floated away into deep space', 'Both hit the lunar surface at the exact same instant', 'The hammer hit first because it was heavier', 'The feather burned up in lunar air'],
      correctIndex: 1,
      explanation: 'Because the Moon has no atmosphere (vacuum), the feather and hammer fell side-by-side and hit the lunar dust simultaneously.'
    },
    {
      id: 'dg-5',
      question: 'How does the surface gravity on the Moon compare to Earth’s surface gravity?',
      options: ['It is about 1/6th of Earth’s gravity (~1.62 m/s²)', 'It is exactly double Earth’s gravity', 'It has identical gravity to Earth', 'Moon has zero gravity everywhere'],
      correctIndex: 0,
      explanation: 'Due to the Moon’s smaller mass and radius, lunar surface gravity is roughly 16.5% (about one-sixth) of Earth’s.'
    },
    {
      id: 'dg-6',
      question: 'Which planet in our solar system has the strongest surface gravity?',
      options: ['Mars', 'Jupiter (~24.79 m/s²)', 'Venus', 'Mercury'],
      correctIndex: 1,
      explanation: 'Jupiter’s massive planetary bulk generates surface gravity approximately 2.5 times greater than Earth’s.'
    },
    {
      id: 'dg-7',
      question: 'What is the scientific difference between an object’s mass and its weight?',
      options: ['Mass is the quantity of matter; weight is the gravitational force acting on that mass', 'Mass is measured in pounds; weight is in kilograms', 'Mass changes on every planet; weight stays identical', 'There is no scientific difference'],
      correctIndex: 0,
      explanation: 'Mass is an intrinsic measure of matter (in kg) that never changes, whereas weight is the force ($W = mg$) exerted by gravity.'
    },
    {
      id: 'dg-8',
      question: 'If you drop an apple in a vacuum on Earth from rest, how fast is it falling after exactly 2 seconds?',
      options: ['9.81 m/s', '19.62 m/s', '39.24 m/s', '4.90 m/s'],
      correctIndex: 1,
      explanation: 'Using $v = gt$: velocity = $9.81 \\text{ m/s}^2 \\times 2 \\text{ s} = 19.62 \\text{ m/s}$.'
    },
    {
      id: 'dg-9',
      question: 'Why does a crumpled ball of paper fall much faster through air than an unfolded flat sheet of identical paper?',
      options: ['The crumpled ball has more mass', 'The flat sheet has a larger surface area creating much greater air drag', 'Crumpled paper has higher gravitational pull', 'Flat paper generates magnetic levitation'],
      correctIndex: 1,
      explanation: 'Both have identical mass and gravity, but the flat sheet’s large cross-sectional area produces far higher aerodynamic drag resistance.'
    },
    {
      id: 'dg-10',
      question: 'Why do astronauts feel "weightless" inside the International Space Station (ISS)?',
      options: ['There is zero gravity in low Earth orbit', 'The station and astronauts are in continuous free-fall around Earth', 'The space station has anti-gravity shielding', 'Their spacesuits contain helium'],
      correctIndex: 1,
      explanation: 'Gravity at ISS altitude is still ~90% of Earth’s surface gravity; astronauts feel weightless because they are in perpetual orbital free fall.'
    },
    {
      id: 'dg-11',
      question: 'What mathematical formula calculates the vertical distance ($d$) fallen by an object from rest under gravity in time ($t$)?',
      options: ['d = ½ × g × t²', 'd = m × g × h', 'd = v / t', 'd = g × t'],
      correctIndex: 0,
      explanation: 'The kinematic equation for distance from rest under uniform acceleration is $d = \\frac{1}{2}gt^2$.'
    },
    {
      id: 'dg-12',
      question: 'What would happen to the gravitational force between two planets if the distance between them is doubled?',
      options: ['The force doubles', 'The force is cut in half', 'The force decreases to 1/4th of its original value', 'The force becomes negative'],
      correctIndex: 2,
      explanation: 'Newton’s Inverse-Square Law states gravitational attraction is proportional to $1/r^2$; doubling distance reduces force by $2^2 = 4$.'
    },
    {
      id: 'dg-13',
      question: 'How does surface gravity on Mars compare to Earth?',
      options: ['About 38% of Earth’s gravity (~3.72 m/s²)', 'Equal to Earth', 'Three times stronger than Earth', 'Absolute zero'],
      correctIndex: 0,
      explanation: 'Mars is smaller and less dense than Earth, providing a surface gravity of roughly 3.72 m/s² (0.38 g).'
    },
    {
      id: 'dg-14',
      question: 'What instrument in science laboratories is used to measure weight by stretching a calibrated coil spring?',
      options: ['A spring scale (dynamometer)', 'A graduated cylinder', 'A Bunsen burner', 'A cathode ray tube'],
      correctIndex: 0,
      explanation: 'A spring scale uses Hooke’s Law ($F = -kx$) to measure gravitational force in Newtons.'
    },
    {
      id: 'dg-15',
      question: 'Why does a skydiver spread their arms and legs into a "belly-to-earth" position?',
      options: ['To look like an eagle', 'To maximize surface area and increase air resistance to control terminal velocity', 'To catch updrafts and fly upwards', 'To reduce gravitational pull'],
      correctIndex: 1,
      explanation: 'Spreading out maximizes drag area ($A$), stabilizing the skydiver and lowering terminal velocity to roughly 200 km/h (120 mph).'
    },
    {
      id: 'dg-16',
      question: 'What type of hypothetical particle has been theorized in quantum physics as the mediator of gravitational interaction?',
      options: ['The Graviton', 'The Photon', 'The Gluon', 'The Positron'],
      correctIndex: 0,
      explanation: 'In quantum field theory, the graviton is the hypothetical massless spin-2 boson proposed to mediate gravitational interactions.'
    }
  ]
};
