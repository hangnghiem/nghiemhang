// Engoo "Daily News"-style lessons, all focused on the latest AI news.
// Each lesson follows the classic format: article -> vocabulary -> discussion.

export const CATEGORIES = [
  "Technology",
  "Business",
  "Science",
  "Education",
  "Society",
  "Health",
];

// Engoo-style 1-10 level scale grouped into bands.
export function levelBand(level) {
  if (level <= 3) return { label: "Beginner", tone: "emerald" };
  if (level <= 6) return { label: "Intermediate", tone: "amber" };
  if (level <= 8) return { label: "Advanced", tone: "rose" };
  return { label: "Proficient", tone: "violet" };
}

export const lessons = [
  {
    id: 1,
    slug: "ai-chatbots-change-how-students-learn",
    title: "AI Chatbots Are Changing How Students Learn",
    category: "Education",
    level: 4,
    minutes: 5,
    date: "2026-06-15",
    summary:
      "More students are using AI chatbots to study. Teachers are excited but also worried.",
    hero: { from: "#14a589", to: "#0d6a5a", emoji: "🎓" },
    paragraphs: [
      "Around the world, students are using artificial intelligence (AI) chatbots to help with their homework. These tools can explain difficult ideas, check grammar, and even create practice quizzes in seconds.",
      "Many learners say chatbots feel like a personal tutor that is available at any time. A student can ask the same question again and again without feeling embarrassed.",
      "However, teachers have mixed feelings. Some worry that students will simply copy answers instead of thinking for themselves. Others believe AI can make learning more fair, because not every family can pay for a private tutor.",
      "Schools are now trying to find a balance. Some teachers ask students to use chatbots only to check their work, not to write it. Others design lessons where students must explain how they reached an answer.",
      "Experts say the most important skill is learning how to ask good questions. As one researcher put it, \u201cAI will not replace students, but students who use AI well may have an advantage.\u201d",
    ],
    vocabulary: [
      { word: "tutor", pos: "noun", phonetic: "/\u02c8tu\u02d0.t\u025a/", definition: "a person who teaches one student or a small group", example: "She hired a math tutor before the big exam." },
      { word: "embarrassed", pos: "adjective", phonetic: "/\u026am\u02c8b\u00e6r.\u0259st/", definition: "feeling ashamed or shy", example: "He was embarrassed to ask the same question twice." },
      { word: "mixed feelings", pos: "phrase", phonetic: "/m\u026akst \u02c8fi\u02d0.l\u026a\u014bz/", definition: "having both positive and negative thoughts about something", example: "I have mixed feelings about working from home." },
      { word: "fair", pos: "adjective", phonetic: "/fe\u0259r/", definition: "treating everyone equally", example: "The teacher tried to be fair to every student." },
      { word: "balance", pos: "noun", phonetic: "/\u02c8b\u00e6l.\u0259ns/", definition: "a situation where different things have the right amount of importance", example: "It is hard to find a balance between work and rest." },
      { word: "advantage", pos: "noun", phonetic: "/\u0259d\u02c8v\u0251\u02d0n.t\u026ad\u0292/", definition: "something that helps you do better than others", example: "Speaking two languages is a big advantage." },
    ],
    discussion: [
      "Have you ever used an AI chatbot to study? How was it?",
      "Do you think chatbots help students or make them lazy?",
      "Should schools allow students to use AI for homework? Why or why not?",
      "What subjects do you think AI is best at helping with?",
      "If you had a personal tutor available all day, what would you learn?",
    ],
    further: [
      "Some people say \u201casking good questions\u201d is now the most important skill. Do you agree?",
      "How might classrooms look different in 20 years because of AI?",
      "Is it fair that some students have access to better technology than others?",
    ],
    quiz: [
      {
        question: "Why do many students like using AI chatbots?",
        options: [
          "They are always cheaper than school",
          "They can answer questions any time, without judgment",
          "They give students the test answers in advance",
          "They replace the need to attend class",
        ],
        answer: 1,
      },
      {
        question: "What is one worry that teachers have?",
        options: [
          "Chatbots are too slow to be useful",
          "Students may copy answers instead of thinking",
          "Chatbots only work in one language",
          "Schools cannot afford the technology",
        ],
        answer: 1,
      },
      {
        question: "How are some schools trying to find a balance?",
        options: [
          "By banning all computers",
          "By asking students to use chatbots only to check their work",
          "By giving every student the same AI",
          "By removing homework completely",
        ],
        answer: 1,
      },
      {
        question: "In the article, what does \u201ctutor\u201d mean?",
        options: [
          "a type of test",
          "a person who teaches one student or a small group",
          "a computer program",
          "a classroom",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    slug: "self-driving-taxis-reach-more-cities",
    title: "Self-Driving Taxis Reach More Cities",
    category: "Technology",
    level: 6,
    minutes: 6,
    date: "2026-06-14",
    summary:
      "Robotaxis are no longer science fiction. They are picking up passengers in a growing number of cities.",
    hero: { from: "#2563eb", to: "#0d6a5a", emoji: "\ud83d\ude95" },
    paragraphs: [
      "Imagine opening an app, tapping your screen, and watching a car with no driver pull up to take you home. For a growing number of city residents, this is now an ordinary part of daily life.",
      "Self-driving taxis, often called \u201crobotaxis,\u201d use cameras, sensors, and artificial intelligence to understand the road. The AI must recognize traffic lights, pedestrians, cyclists, and thousands of other details \u2014 all in real time.",
      "Supporters argue that the technology could make roads safer, since most accidents are caused by human error such as tiredness or distraction. They also point out that robotaxis never ask for a break and can operate at night.",
      "Critics are not convinced. They worry about software failures and unusual situations that a computer has never seen before. There are also concerns about jobs, because millions of people around the world earn a living by driving.",
      "Regulators are watching closely. In some cities, robotaxis can only drive on certain streets or during certain hours. The companies say these limits will slowly disappear as the AI proves it can be trusted.",
      "Whether or not you feel comfortable riding in one, experts agree the technology is improving quickly \u2014 and it is unlikely to slow down.",
    ],
    vocabulary: [
      { word: "ordinary", pos: "adjective", phonetic: "/\u02c8\u0254\u02d0.d\u00b3n.\u0259r.i/", definition: "normal and not special", example: "It was just an ordinary Tuesday." },
      { word: "sensor", pos: "noun", phonetic: "/\u02c8sen.s\u0259r/", definition: "a device that detects light, sound, or movement", example: "The lights turn on automatically thanks to a sensor." },
      { word: "pedestrian", pos: "noun", phonetic: "/p\u0259\u02c8des.tri.\u0259n/", definition: "a person who is walking", example: "Drivers must stop for pedestrians at the crossing." },
      { word: "human error", pos: "phrase", phonetic: "/\u02c8hju\u02d0.m\u0259n \u02c8er.\u0259r/", definition: "a mistake made by a person, not a machine", example: "The crash was caused by human error." },
      { word: "regulator", pos: "noun", phonetic: "/\u02c8re\u0261.j\u0259.le\u026a.t\u0259r/", definition: "an official group that controls an activity", example: "Regulators approved the new medicine." },
      { word: "convinced", pos: "adjective", phonetic: "/k\u0259n\u02c8v\u026anst/", definition: "completely sure about something", example: "I'm not convinced this plan will work." },
    ],
    discussion: [
      "Would you feel safe riding in a car with no driver? Why or why not?",
      "Do you think robotaxis will be common in your city soon?",
      "What are the biggest risks of self-driving cars?",
      "Should taxi and truck drivers be worried about their jobs?",
      "Who should be responsible if a self-driving car has an accident?",
    ],
    further: [
      "Is it better for governments to allow new technology quickly or slowly?",
      "How might cities change if most cars drive themselves?",
      "Would you trust a machine more than a human in an emergency?",
    ],
    quiz: [
      {
        question: "What do robotaxis use to understand the road?",
        options: [
          "Only a paper map",
          "Cameras, sensors, and artificial intelligence",
          "A remote human driver at all times",
          "Special painted roads only",
        ],
        answer: 1,
      },
      {
        question: "Why do supporters think robotaxis could make roads safer?",
        options: [
          "Because they drive much faster",
          "Because most accidents are caused by human error",
          "Because they never carry passengers",
          "Because they only drive during the day",
        ],
        answer: 1,
      },
      {
        question: "What is one concern that critics raise?",
        options: [
          "The cars are too quiet",
          "Software failures and unusual situations, plus lost jobs",
          "They cannot be painted any color",
          "They use too little electricity",
        ],
        answer: 1,
      },
      {
        question: "How are regulators responding to robotaxis?",
        options: [
          "By banning them everywhere",
          "By allowing them only on certain streets or hours for now",
          "By ignoring them completely",
          "By requiring two drivers in each car",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 3,
    slug: "ai-helps-doctors-detect-disease-earlier",
    title: "AI Helps Doctors Detect Disease Earlier",
    category: "Health",
    level: 7,
    minutes: 6,
    date: "2026-06-13",
    summary:
      "Hospitals are using AI to spot signs of illness that the human eye can miss.",
    hero: { from: "#0ea5e9", to: "#14a589", emoji: "\ud83e\ude7a" },
    paragraphs: [
      "In hospitals around the world, artificial intelligence is quietly becoming a second pair of eyes for doctors. Trained on millions of medical images, AI systems can now flag tiny warning signs of disease that might otherwise be overlooked.",
      "One of the most promising areas is cancer screening. AI can scan an image in seconds and highlight regions that deserve a closer look. In several studies, this has helped radiologists detect tumors at an earlier, more treatable stage.",
      "The technology is not meant to replace doctors. Instead, it acts as an assistant, offering a second opinion. The final decision \u2014 and the conversation with the patient \u2014 still belongs to a human professional.",
      "There are challenges, of course. An AI system is only as good as the data it learned from. If that data does not represent all kinds of patients, the system may make mistakes for some groups of people.",
      "Privacy is another major concern. Medical records are deeply personal, and hospitals must be careful about how this sensitive information is stored and shared.",
      "Still, many doctors are optimistic. Catching a disease early can be the difference between a simple treatment and a life-threatening situation \u2014 and AI may help make early detection far more common.",
    ],
    vocabulary: [
      { word: "flag", pos: "verb", phonetic: "/fl\u00e6\u0261/", definition: "to mark something so people pay attention to it", example: "The system flagged the email as spam." },
      { word: "overlook", pos: "verb", phonetic: "/\u02cc\u0259\u028a.v\u0259\u02c8l\u028ak/", definition: "to fail to notice something", example: "It's easy to overlook a small mistake." },
      { word: "screening", pos: "noun", phonetic: "/\u02c8skri\u02d0.n\u026a\u014b/", definition: "a medical test to check for disease before symptoms appear", example: "Regular screening can save lives." },
      { word: "radiologist", pos: "noun", phonetic: "/\u02ccre\u026a.di\u02c8\u0252l.\u0259.d\u0292\u026ast/", definition: "a doctor who studies medical images like X-rays", example: "The radiologist reviewed the scan carefully." },
      { word: "sensitive", pos: "adjective", phonetic: "/\u02c8sen.s\u0259.t\u026av/", definition: "needing to be treated carefully, often private", example: "Salary is a sensitive topic for many people." },
      { word: "optimistic", pos: "adjective", phonetic: "/\u02cc\u0252p.t\u026a\u02c8m\u026as.t\u026ak/", definition: "hopeful about the future", example: "She stayed optimistic during the hard times." },
    ],
    discussion: [
      "Would you trust an AI to help diagnose your illness?",
      "What are the benefits of detecting a disease early?",
      "How important is privacy when it comes to medical records?",
      "Should AI tools be used in every hospital? Why or why not?",
      "Do you think people will see doctors less in the future?",
    ],
    further: [
      "If an AI and a doctor disagree, whom should the patient believe?",
      "How can we make sure AI works equally well for all kinds of patients?",
      "What other jobs could AI assist with in the medical field?",
    ],
    quiz: [
      {
        question: "How is AI described in the hospital setting?",
        options: [
          "As a replacement for all doctors",
          "As a second pair of eyes for doctors",
          "As a tool only for paperwork",
          "As a way to avoid seeing patients",
        ],
        answer: 1,
      },
      {
        question: "What is one promising use of AI mentioned in the article?",
        options: [
          "Cooking hospital meals",
          "Cancer screening and earlier detection",
          "Designing hospital buildings",
          "Scheduling staff holidays",
        ],
        answer: 1,
      },
      {
        question: "Why might an AI system make mistakes for some groups of people?",
        options: [
          "Because it gets tired",
          "Because the data it learned from may not represent everyone",
          "Because it works too slowly",
          "Because doctors turn it off",
        ],
        answer: 1,
      },
      {
        question: "What does \u201csensitive\u201d mean in this article?",
        options: [
          "easy to break",
          "needing to be treated carefully, often private",
          "very expensive",
          "extremely fast",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 4,
    slug: "can-ai-write-music",
    title: "Can AI Write Music? Artists Weigh In",
    category: "Society",
    level: 5,
    minutes: 5,
    date: "2026-06-12",
    summary:
      "AI can now create songs in any style. Musicians are excited, worried, and a little confused.",
    hero: { from: "#a855f7", to: "#ec4899", emoji: "\ud83c\udfb5" },
    paragraphs: [
      "Type a few words \u2014 \u201ca happy summer pop song with guitar\u201d \u2014 and modern AI tools can produce a complete track in under a minute. The melody, the rhythm, and even the singing voice are all created by a computer.",
      "For some musicians, this is an exciting new instrument. They use AI to test ideas quickly or to create background music for videos. It can be a fast and cheap way to get started.",
      "Others are worried. If anyone can make a song instantly, will human artists still be valued? Some musicians also feel uncomfortable that AI tools learned from real songs without asking permission.",
      "There are legal questions too. Who owns a song created by AI? The person who typed the words? The company that built the tool? Lawyers and governments are still trying to find clear answers.",
      "Most artists agree on one thing: music made by AI may sound polished, but it does not carry the personal story and emotion behind a human song. For now, that human touch is hard to copy.",
    ],
    vocabulary: [
      { word: "melody", pos: "noun", phonetic: "/\u02c8mel.\u0259.di/", definition: "a series of musical notes that make a tune", example: "I can't stop humming that melody." },
      { word: "instrument", pos: "noun", phonetic: "/\u02c8\u026an.str\u0259.m\u0259nt/", definition: "an object used to make music, or a useful tool", example: "The piano is her favorite instrument." },
      { word: "permission", pos: "noun", phonetic: "/p\u0259\u02c8m\u026a\u0283.\u00b3n/", definition: "agreement that you are allowed to do something", example: "You need permission to use that photo." },
      { word: "polished", pos: "adjective", phonetic: "/\u02c8p\u0252l.\u026a\u0283t/", definition: "done very well and with high quality", example: "Her presentation was clear and polished." },
      { word: "emotion", pos: "noun", phonetic: "/\u026a\u02c8m\u0259\u028a.\u0283\u00b3n/", definition: "a strong feeling such as love or anger", example: "The song is full of emotion." },
    ],
    discussion: [
      "Have you ever listened to music made by AI? Could you tell?",
      "Do you think AI music is real art? Why or why not?",
      "Who do you think should own a song created by AI?",
      "Would you pay for music made by a computer?",
      "What kind of music would you ask an AI to create?",
    ],
    further: [
      "Is it fair for AI tools to learn from songs without permission?",
      "Can a machine ever express real human emotion?",
      "How might the music industry change in the next ten years?",
    ],
    quiz: [
      {
        question: "What can modern AI music tools do?",
        options: [
          "Only change the volume of a song",
          "Create a full track \u2014 melody, rhythm, and voice \u2014 from a few words",
          "Teach someone to play the guitar",
          "Sell concert tickets",
        ],
        answer: 1,
      },
      {
        question: "Why are some musicians worried about AI music?",
        options: [
          "It is too difficult to use",
          "Human artists may be less valued, and tools learned from real songs without permission",
          "It only makes classical music",
          "It cannot be played on phones",
        ],
        answer: 1,
      },
      {
        question: "What legal question does the article raise?",
        options: [
          "How loud a song can be",
          "Who owns a song created by AI",
          "Where concerts can be held",
          "How long a song must be",
        ],
        answer: 1,
      },
      {
        question: "What do most artists agree AI music lacks?",
        options: [
          "Good sound quality",
          "The personal story and emotion behind a human song",
          "A clear melody",
          "Enough instruments",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 5,
    slug: "companies-use-ai-to-cut-energy-costs",
    title: "Companies Use AI to Cut Energy Costs",
    category: "Business",
    level: 6,
    minutes: 5,
    date: "2026-06-11",
    summary:
      "Big companies are using AI to save money and reduce the energy their buildings use.",
    hero: { from: "#22c55e", to: "#0d6a5a", emoji: "\u26a1" },
    paragraphs: [
      "Running a large office building or factory uses a huge amount of energy. Heating, cooling, and lighting can cost millions of dollars every year. Now, companies are turning to artificial intelligence to bring those costs down.",
      "The idea is simple. AI studies data from sensors all over a building \u2014 temperature, humidity, and how many people are in each room. It then adjusts the heating and cooling automatically, minute by minute, to avoid waste.",
      "Some companies report saving up to 20 percent on their energy bills after introducing these systems. Because the AI learns from experience, it often gets better over time.",
      "There is an environmental benefit too. Using less energy usually means producing less pollution, which helps in the fight against climate change.",
      "Of course, the systems are not free. Installing sensors and software requires money upfront. But many businesses say the investment pays for itself within a few years.",
    ],
    vocabulary: [
      { word: "factory", pos: "noun", phonetic: "/\u02c8f\u00e6k.t\u00b3r.i/", definition: "a building where goods are made", example: "The car factory employs 2,000 people." },
      { word: "adjust", pos: "verb", phonetic: "/\u0259\u02c8d\u0292\u028cst/", definition: "to change something slightly to make it better", example: "Please adjust the temperature." },
      { word: "waste", pos: "noun", phonetic: "/we\u026ast/", definition: "using more of something than is necessary", example: "Leaving the lights on is a waste of energy." },
      { word: "pollution", pos: "noun", phonetic: "/p\u0259\u02c8lu\u02d0.\u0283\u00b3n/", definition: "harmful substances in the air, water, or land", example: "Air pollution is a serious problem in big cities." },
      { word: "investment", pos: "noun", phonetic: "/\u026an\u02c8vest.m\u0259nt/", definition: "money spent now to gain more later", example: "Education is an investment in your future." },
      { word: "upfront", pos: "adverb", phonetic: "/\u02cc\u028cp\u02c8fr\u028cnt/", definition: "paid or done at the beginning", example: "You pay half the cost upfront." },
    ],
    discussion: [
      "Do you try to save energy at home? How?",
      "Would you trust AI to control the temperature in your house?",
      "Why do you think saving energy is important?",
      "Should governments require companies to use energy-saving technology?",
      "What other problems do you think AI could help solve?",
    ],
    further: [
      "Is it worth spending money now to save money and energy later?",
      "How big a role should technology play in fighting climate change?",
      "Can small actions by individuals make a real difference?",
    ],
    quiz: [
      {
        question: "How does the AI reduce energy use in a building?",
        options: [
          "By turning everything off at night",
          "By studying sensor data and adjusting heating and cooling automatically",
          "By asking workers to go home early",
          "By painting the windows",
        ],
        answer: 1,
      },
      {
        question: "How much do some companies report saving on energy bills?",
        options: ["About 2 percent", "Up to 20 percent", "Exactly half", "Nothing at all"],
        answer: 1,
      },
      {
        question: "What environmental benefit does the article mention?",
        options: [
          "More rain",
          "Less pollution from using less energy",
          "Cleaner office desks",
          "Quieter machines",
        ],
        answer: 1,
      },
      {
        question: "What does \u201cupfront\u201d mean in this article?",
        options: [
          "at the very end",
          "paid or done at the beginning",
          "in small pieces",
          "for free",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 6,
    slug: "ai-image-generators-spark-debate",
    title: "AI Image Generators Spark Debate Among Artists",
    category: "Society",
    level: 8,
    minutes: 7,
    date: "2026-06-10",
    summary:
      "Tools that create stunning images from text have divided the art world.",
    hero: { from: "#f59e0b", to: "#ef4444", emoji: "\ud83c\udfa8" },
    paragraphs: [
      "A few years ago, creating a detailed digital painting required years of practice. Today, anyone can type a sentence and receive a gallery-quality image in seconds. AI image generators have arrived, and they have stirred up one of the fiercest debates in the creative world.",
      "Enthusiasts describe these tools as a great equalizer. People who never learned to draw can finally bring their imagination to life. Small businesses can produce professional-looking artwork without hiring a designer.",
      "Many professional artists, however, feel threatened. They argue that the AI was trained on millions of existing artworks \u2014 often scraped from the internet without consent or payment. In effect, they say, the machines learned to imitate human creativity using human labor that was never credited.",
      "The controversy has reached courtrooms. Several artists have filed lawsuits claiming that their copyrighted work was used without permission. The outcomes could reshape how AI companies build their products.",
      "Beyond the legal questions lies a philosophical one: what is the value of art? Is it the final image, or the human intention and struggle behind it? People disagree passionately.",
      "What seems certain is that AI image tools are here to stay. The challenge now is finding rules that protect artists while still allowing new technology to flourish.",
    ],
    vocabulary: [
      { word: "stir up", pos: "phrasal verb", phonetic: "/st\u025c\u02d0r \u028cp/", definition: "to cause strong feelings or trouble", example: "The decision stirred up a lot of anger." },
      { word: "equalizer", pos: "noun", phonetic: "/\u02c8i\u02d0.kw\u0259.la\u026a.z\u0259r/", definition: "something that makes people more equal", example: "The internet can be a great equalizer." },
      { word: "consent", pos: "noun", phonetic: "/k\u0259n\u02c8sent/", definition: "permission for something to happen", example: "They used the data without consent." },
      { word: "imitate", pos: "verb", phonetic: "/\u02c8\u026am.\u026a.te\u026at/", definition: "to copy the way someone or something does something", example: "Children often imitate their parents." },
      { word: "lawsuit", pos: "noun", phonetic: "/\u02c8l\u0254\u02d0.su\u02d0t/", definition: "a legal case brought to a court", example: "The company is facing a major lawsuit." },
      { word: "flourish", pos: "verb", phonetic: "/\u02c8fl\u028cr.\u026a\u0283/", definition: "to grow or develop successfully", example: "The business began to flourish." },
    ],
    discussion: [
      "Have you used an AI image generator? What did you make?",
      "Do you think images created by AI count as real art?",
      "Is it fair to train AI on artwork without paying the artists?",
      "How would you feel if a computer copied your style?",
      "What rules, if any, should govern AI art tools?",
    ],
    further: [
      "What gives a piece of art its value \u2014 the result or the effort behind it?",
      "Can technology and traditional artists succeed at the same time?",
      "Should there be a label showing when art was made by AI?",
    ],
    quiz: [
      {
        question: "Why do enthusiasts call AI image tools a \u201cgreat equalizer\u201d?",
        options: [
          "They make all images look the same",
          "People who never learned to draw can bring their ideas to life",
          "They are only for professionals",
          "They make art more expensive",
        ],
        answer: 1,
      },
      {
        question: "Why do many professional artists feel threatened?",
        options: [
          "The tools are too slow",
          "The AI was trained on existing art, often without consent or payment",
          "The images are too small",
          "Nobody looks at art anymore",
        ],
        answer: 1,
      },
      {
        question: "How has the controversy reached courtrooms?",
        options: [
          "Artists have filed lawsuits over copyrighted work used without permission",
          "Judges have banned all computers",
          "Museums have closed",
          "Artists were arrested for drawing",
        ],
        answer: 0,
      },
      {
        question: "What deeper, philosophical question does the article raise?",
        options: [
          "How fast computers can draw",
          "What the real value of art is \u2014 the image or the human intention behind it",
          "Which colors are best",
          "How big a painting should be",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 7,
    slug: "ai-robots-join-the-workforce",
    title: "AI-Powered Robots Join the Workforce",
    category: "Business",
    level: 5,
    minutes: 5,
    date: "2026-06-09",
    summary:
      "Smart robots are starting to work in warehouses, restaurants, and even hospitals.",
    hero: { from: "#06b6d4", to: "#3b82f6", emoji: "\ud83e\udd16" },
    paragraphs: [
      "Robots are not new. Factories have used them for decades. But a new generation of robots, powered by artificial intelligence, can do much more than repeat the same simple movement over and over.",
      "These robots can \u201csee\u201d their surroundings using cameras and decide what to do next. In warehouses, they move boxes and pack orders. In some restaurants, they carry plates to tables. A few hospitals even use them to deliver medicine.",
      "Companies like them because they can work long hours without getting tired and rarely make mistakes. For dangerous or boring jobs, robots can be a real help.",
      "Still, workers have reasons to worry. If a robot can do a job more cheaply, some people may lose their positions. Experts say new types of jobs will appear, but workers may need to learn new skills.",
      "The future workplace will probably be a mix of humans and machines. The key question is how to make sure that change helps people instead of leaving them behind.",
    ],
    vocabulary: [
      { word: "generation", pos: "noun", phonetic: "/\u02ccd\u0292en.\u0259\u02c8re\u026a.\u0283\u00b3n/", definition: "a stage in the development of a product", example: "This is the latest generation of phones." },
      { word: "surroundings", pos: "noun", phonetic: "/s\u0259\u02c8ra\u028an.d\u026a\u014bz/", definition: "the things and area around someone", example: "The cat explored its new surroundings." },
      { word: "warehouse", pos: "noun", phonetic: "/\u02c8we\u0259.ha\u028as/", definition: "a large building for storing goods", example: "The package is still in the warehouse." },
      { word: "position", pos: "noun", phonetic: "/p\u0259\u02c8z\u026a\u0283.\u00b3n/", definition: "a job", example: "She applied for a position at the bank." },
      { word: "leave behind", pos: "phrasal verb", phonetic: "/li\u02d0v b\u026a\u02c8ha\u026and/", definition: "to fail to take someone along or include them", example: "We must not leave older workers behind." },
    ],
    discussion: [
      "Have you ever seen a robot working in real life? Where?",
      "What jobs do you think robots should do?",
      "What jobs should always be done by humans?",
      "Would you be comfortable being served by a robot?",
      "Are you worried that robots might take people's jobs?",
    ],
    further: [
      "How can workers prepare for a world with more robots?",
      "Should companies be required to retrain workers replaced by machines?",
      "Will robots make our lives easier or more complicated?",
    ],
    quiz: [
      {
        question: "How are new AI-powered robots different from older factory robots?",
        options: [
          "They are much smaller",
          "They can \u201csee\u201d their surroundings and decide what to do next",
          "They only work outdoors",
          "They cannot move at all",
        ],
        answer: 1,
      },
      {
        question: "Where are these robots being used, according to the article?",
        options: [
          "Only in space",
          "Warehouses, some restaurants, and a few hospitals",
          "Only in schools",
          "Nowhere yet",
        ],
        answer: 1,
      },
      {
        question: "Why do companies like these robots?",
        options: [
          "They work long hours without tiring and rarely make mistakes",
          "They are free to buy",
          "They never need electricity",
          "They can talk to customers",
        ],
        answer: 0,
      },
      {
        question: "What do experts say workers may need to do?",
        options: [
          "Stop working entirely",
          "Learn new skills as new types of jobs appear",
          "Move to another country",
          "Buy their own robot",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 8,
    slug: "governments-race-to-regulate-ai",
    title: "Governments Race to Regulate Artificial Intelligence",
    category: "Society",
    level: 9,
    minutes: 7,
    date: "2026-06-08",
    summary:
      "As AI grows more powerful, lawmakers worldwide are scrambling to set the rules.",
    hero: { from: "#6366f1", to: "#0f463d", emoji: "\u2696\ufe0f" },
    paragraphs: [
      "Artificial intelligence is advancing faster than almost any technology in history, and governments are struggling to keep pace. Around the world, lawmakers are racing to draft regulations that protect the public without stifling innovation \u2014 a delicate balancing act.",
      "The central dilemma is one of timing. Regulate too early, and you risk crushing promising research before its benefits are understood. Regulate too late, and harmful applications may already be widespread before any safeguards exist.",
      "Different regions are taking strikingly different approaches. Some favor strict, detailed rules that ban certain high-risk uses outright. Others prefer lighter, more flexible guidelines, betting that heavy regulation would simply push companies to relocate elsewhere.",
      "Among the thorniest issues are transparency and accountability. When an AI system makes a consequential decision \u2014 rejecting a loan, for example \u2014 should the company be forced to explain how it reached that conclusion? And who is liable when an algorithm causes harm?",
      "Critics warn that a patchwork of conflicting national laws could create confusion for companies operating across borders. They call for international cooperation, though history suggests that global agreements are notoriously difficult to reach.",
      "Few doubt that some regulation is necessary. The real challenge is designing rules thoughtful enough to manage genuine risks while remaining flexible enough to evolve alongside a technology that refuses to stand still.",
    ],
    vocabulary: [
      { word: "keep pace", pos: "phrase", phonetic: "/ki\u02d0p pe\u026as/", definition: "to move or change as fast as something else", example: "Wages have not kept pace with prices." },
      { word: "stifle", pos: "verb", phonetic: "/\u02c8sta\u026a.f\u00b3l/", definition: "to prevent something from developing", example: "Too many rules can stifle creativity." },
      { word: "dilemma", pos: "noun", phonetic: "/d\u026a\u02c8lem.\u0259/", definition: "a difficult choice between two options", example: "She faced a real dilemma about her career." },
      { word: "transparency", pos: "noun", phonetic: "/tr\u00e6n\u02c8sp\u00e6r.\u00b3n.si/", definition: "the quality of being open and easy to understand", example: "Voters demanded greater transparency." },
      { word: "accountability", pos: "noun", phonetic: "/\u0259\u02cck\u0251\u028an.t\u0259\u02c8b\u026al.\u0259.ti/", definition: "being responsible for your actions", example: "There must be accountability for mistakes." },
      { word: "patchwork", pos: "noun", phonetic: "/\u02c8p\u00e6t\u0283.w\u025c\u02d0k/", definition: "a mix of many different parts that don't fit neatly", example: "The country has a patchwork of local laws." },
    ],
    discussion: [
      "Do you think AI needs more rules? Why or why not?",
      "Is it better to regulate new technology early or wait and see?",
      "Should an AI company explain how its system makes decisions?",
      "Who should be responsible when an AI causes harm?",
      "Do you trust governments to regulate technology well?",
    ],
    further: [
      "Can countries with very different values agree on global AI rules?",
      "How do we balance innovation with public safety?",
      "Should the people who build AI also help write the laws about it?",
    ],
    quiz: [
      {
        question: "What is the central dilemma lawmakers face?",
        options: [
          "Whether to use computers at all",
          "Regulating too early may crush research; too late, harm may spread",
          "How to make AI more expensive",
          "Whether AI should be taught in schools",
        ],
        answer: 1,
      },
      {
        question: "How do different regions approach AI regulation?",
        options: [
          "They all use identical laws",
          "Some favor strict rules; others prefer lighter, flexible guidelines",
          "None of them regulate it",
          "They ban AI completely",
        ],
        answer: 1,
      },
      {
        question: "What does the loan example illustrate?",
        options: [
          "How banks make money",
          "The issue of transparency and accountability in AI decisions",
          "Why loans are bad",
          "How fast AI can count",
        ],
        answer: 1,
      },
      {
        question: "What do critics warn a \u201cpatchwork\u201d of laws could create?",
        options: [
          "Better fashion",
          "Confusion for companies operating across borders",
          "Cheaper technology",
          "Faster internet",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 9,
    slug: "ai-translation-breaks-language-barriers",
    title: "AI Translation Breaks Down Language Barriers",
    category: "Science",
    level: 3,
    minutes: 4,
    date: "2026-06-07",
    summary:
      "New AI tools can translate speech almost instantly. Travel and business are getting easier.",
    hero: { from: "#14b8a6", to: "#0ea5e9", emoji: "\ud83c\udf0d" },
    paragraphs: [
      "Talking to someone who speaks a different language used to be very hard. Now, AI can help. New tools can listen to one language and speak another almost right away.",
      "Travelers love this. You can point your phone at a menu and read it in your own language. You can also speak into an app and let it talk for you.",
      "Businesses use these tools too. A company in one country can work with people far away without paying for expensive human translators every time.",
      "The tools are not perfect. Sometimes the translation is funny or wrong, especially with jokes or local sayings. But they get better every year.",
      "Many people still enjoy learning languages the old way. They say a machine cannot fully understand culture and feelings. But for quick help, AI translation is amazing.",
    ],
    vocabulary: [
      { word: "language", pos: "noun", phonetic: "/\u02c8l\u00e6\u014b.\u0261w\u026ad\u0292/", definition: "the words people use to speak and write", example: "She speaks three languages." },
      { word: "translate", pos: "verb", phonetic: "/tr\u00e6nz\u02c8le\u026at/", definition: "to change words from one language to another", example: "Can you translate this letter?" },
      { word: "menu", pos: "noun", phonetic: "/\u02c8men.ju\u02d0/", definition: "a list of food in a restaurant", example: "The waiter brought us the menu." },
      { word: "perfect", pos: "adjective", phonetic: "/\u02c8p\u025c\u02d0.f\u026akt/", definition: "without any mistakes", example: "Her English is almost perfect." },
      { word: "culture", pos: "noun", phonetic: "/\u02c8k\u028cl.t\u0283\u0259r/", definition: "the way of life of a group of people", example: "I love learning about other cultures." },
    ],
    discussion: [
      "Have you ever used a translation app? Was it helpful?",
      "Do you think AI will replace human translators?",
      "Is it still important to learn other languages? Why?",
      "What is the funniest translation mistake you have seen?",
      "Which language would you like to learn?",
    ],
    further: [
      "Can a machine ever understand culture and humor?",
      "How might easy translation change travel and work?",
      "What do we lose if we stop learning languages ourselves?",
    ],
    quiz: [
      {
        question: "What can new AI translation tools do?",
        options: [
          "Listen to one language and speak another almost right away",
          "Only translate written books",
          "Teach you to write by hand",
          "Make phone calls cheaper",
        ],
        answer: 0,
      },
      {
        question: "How do travelers use these tools?",
        options: [
          "To fly the plane",
          "To point a phone at a menu and read it in their own language",
          "To book hotels only",
          "To pack their bags",
        ],
        answer: 1,
      },
      {
        question: "When are the tools often wrong?",
        options: [
          "With numbers",
          "With jokes or local sayings",
          "With names of cities",
          "With the weather",
        ],
        answer: 1,
      },
      {
        question: "What does \u201ctranslate\u201d mean?",
        options: [
          "to travel to another country",
          "to change words from one language to another",
          "to speak loudly",
          "to write a book",
        ],
        answer: 1,
      },
    ],
  },
];

export function getLessonBySlug(slug) {
  return lessons.find((l) => l.slug === slug);
}
