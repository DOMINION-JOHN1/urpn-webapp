/**
 * SERVER-ONLY exam bank.
 *
 * Never import this file from a client component. Questions are only sent to
 * the browser after an attempt has been started, and correct answers never
 * leave the server.
 */

import type { CourseSlug } from './courses';

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index of the correct option. Stripped before the question is sent. */
  answer: number;
  explanation: string;
}

export interface ExamDefinition {
  questions: ExamQuestion[];
}

const FOUNDATION_QUESTIONS: ExamQuestion[] = [
  {
    id: 'fq-01',
    prompt: 'How does the Foundation Class describe restoration?',
    options: [
      'A cosmetic repair of what was broken',
      'A return to God’s original blueprint for a person, family, or sphere',
      'A rebranding of an existing structure',
      'A reward for consistent church attendance',
    ],
    answer: 1,
    explanation:
      'Restoration is a return to blueprint — recovering God’s original design, not merely patching what is visible.',
  },
  {
    id: 'fq-02',
    prompt: 'Why is the word “blueprint” central to the URPN mandate?',
    options: [
      'Because every building project needs a plan',
      'Because heaven consults a design before a life is restored',
      'Because pastors should study architecture',
      'Because it is a modern ministry slogan',
    ],
    answer: 1,
    explanation:
      'Before a life is restored, heaven consults a design. The mandate recovers God’s original intention.',
  },
  {
    id: 'fq-03',
    prompt: 'URPN stands in the spirit of which prophet?',
    options: ['Elijah', 'Jonah', 'Jeremiah', 'Amos'],
    answer: 0,
    explanation:
      'The Foundation reading describes URPN standing in the spirit of Elijah — turning hearts back to the Father.',
  },
  {
    id: 'fq-04',
    prompt: 'What is an altar, according to the audio teaching?',
    options: [
      'A place where only leaders pray',
      'A place of exchange: your life laid down and His fire received',
      'A physical object that guarantees breakthrough',
      'A weekly church programme',
    ],
    answer: 1,
    explanation: 'An altar is a place of exchange — a life laid down and God’s fire received.',
  },
  {
    id: 'fq-05',
    prompt: 'Which verse anchors the teaching on keeping the fire burning?',
    options: [
      'Psalm 23:1',
      'Leviticus 6:13 — the fire shall ever be burning upon the altar',
      'John 3:16',
      'Philippians 4:13',
    ],
    answer: 1,
    explanation:
      'Leviticus 6:13 commands that the fire on the altar must never go out. The private altar must be kept.',
  },
  {
    id: 'fq-06',
    prompt: 'Intercession is best understood as prayer that…',
    options: [
      'Carries a burden not your own and stands in the gap',
      'Is always loud and emotional',
      'Focuses only on your personal needs',
      'Requires a large congregation',
    ],
    answer: 0,
    explanation:
      'The intercessor carries God’s burden for a people and stands between heaven and their need.',
  },
  {
    id: 'fq-07',
    prompt: 'What protects the public assignment of a worker?',
    options: [
      'A strong social media following',
      'A private altar that stays burning',
      'A large network of influential contacts',
      'Constant public visibility',
    ],
    answer: 1,
    explanation: 'The private altar protects the public assignment. Consistency in secret sustains ministry in public.',
  },
  {
    id: 'fq-08',
    prompt: 'Before Jesus’ public ministry began, the Father spoke over Him words of…',
    options: [
      'Correction and warning',
      'Identity: “This is my beloved Son, in whom I am well pleased”',
      'A detailed five-year plan',
      'A command to build a platform',
    ],
    answer: 1,
    explanation: 'Identity preceded assignment. The Father’s affirmation came before the public work.',
  },
  {
    id: 'fq-09',
    prompt: 'Serving from a healthy place means serving from…',
    options: [
      'A need to be seen and appreciated',
      'Sonship, not striving to earn significance',
      'Competition with other workers',
      'Fear of disappointing leadership',
    ],
    answer: 1,
    explanation:
      'A worker who knows whose they are serves from overflow, not from a need to prove their worth.',
  },
  {
    id: 'fq-10',
    prompt: 'How should you test an impression you believe is from God?',
    options: [
      'Act on it immediately without consulting anyone',
      'Test it against Scripture and wise counsel',
      'Share it publicly to see if people agree',
      'Ignore it until it becomes a strong emotion',
    ],
    answer: 1,
    explanation:
      'Every impression is tested against Scripture and wise counsel. The Spirit never contradicts the Word.',
  },
  {
    id: 'fq-11',
    prompt: 'What did Jesus teach about faithfulness in small things?',
    options: [
      'Small things are beneath a gifted worker',
      'Faithfulness in the least prepares you for much',
      'Only big assignments matter to God',
      'Faithfulness is measured by results',
    ],
    answer: 1,
    explanation: 'Luke 16:10 — faithfulness in the least is the qualification for being trusted with much.',
  },
  {
    id: 'fq-12',
    prompt: 'What does a certificate from the Foundation Class actually mean?',
    options: [
      'You are now a pastor',
      'You have finished the training; the learning and obeying continue',
      'You no longer need a private altar',
      'You are automatically qualified for every ministry',
    ],
    answer: 1,
    explanation:
      'The certificate marks the completion of the training. The real exam is how you live what you have learned afterward.',
  },
];

const MINISTERS_QUESTIONS: ExamQuestion[] = [
  {
    id: 'mq-01',
    prompt: 'The “mantle” of ministry is described as something that is…',
    options: [
      'Seized through ambition',
      'Given by God and carrying responsibility',
      'Earned through popularity',
      'Purchased through education',
    ],
    answer: 1,
    explanation: 'The mantle is given, not seized. It multiplies responsibility before it becomes a title.',
  },
  {
    id: 'mq-02',
    prompt: 'What is the relationship between character and charisma?',
    options: [
      'Charisma is more important than character',
      'Gifts open doors; character decides how long you stay in the room',
      'Character can be developed after public success',
      'They are the same thing',
    ],
    answer: 1,
    explanation:
      'Ministry can amplify a gift quickly, but character is what sustains trust and authority over time.',
  },
  {
    id: 'mq-03',
    prompt: 'Which prophet asked for a double portion of the Spirit?',
    options: ['Elisha', 'Isaiah', 'Samuel', 'Moses'],
    answer: 0,
    explanation: 'Elisha asked for a double portion of Elijah’s spirit and paid the price of following.',
  },
  {
    id: 'mq-04',
    prompt: 'When preaching, what governs the meaning of a passage?',
    options: [
      'The preacher’s personal experience',
      'The context in which it was written',
      'How it makes the congregation feel',
      'The current cultural trend',
    ],
    answer: 1,
    explanation:
      'The minister owes the people the meaning of the passage before the application of the passage. Context governs meaning.',
  },
  {
    id: 'mq-05',
    prompt: 'How does the Holy Spirit relate to Scripture?',
    options: [
      'The Spirit sometimes contradicts the written Word',
      'The Spirit never contradicts the Word He inspired',
      'Scripture is optional when the Spirit is moving',
      'The Spirit only speaks through prophecy',
    ],
    answer: 1,
    explanation: 'The Spirit and the Word agree. Revelation is always tested against Scripture.',
  },
  {
    id: 'mq-06',
    prompt: 'What is the first ministry of a shepherd to a wounded person?',
    options: [
      'Explain why the pain happened',
      'Presence and listening',
      'Correct their attitude quickly',
      'Refer them to another church',
    ],
    answer: 1,
    explanation:
      'The first ministry is presence. Sit with the person, listen without rehearsing a reply, and point them to Jesus.',
  },
  {
    id: 'mq-07',
    prompt: 'What lesson do Job’s friends teach about care?',
    options: [
      'Silence can be more useful than explanation',
      'Long speeches always comfort people',
      'Suffering is always caused by sin',
      'Friends should avoid the wounded',
    ],
    answer: 0,
    explanation: 'Job’s friends were most useful in their silence. Presence precedes explanations.',
  },
  {
    id: 'mq-08',
    prompt: 'When do the limits of confidentiality apply?',
    options: [
      'Never — confidentiality is absolute',
      'When someone is in danger, a child is at risk, there is a threat to life, or the law requires action',
      'Only when the pastor feels uncomfortable',
      'Whenever the story would be useful in a sermon',
    ],
    answer: 1,
    explanation:
      'Confidentiality is sacred, but safety and legal requirements create clear limits that should be stated early.',
  },
  {
    id: 'mq-09',
    prompt: 'Before leading a corporate altar, the leader should…',
    options: [
      'Prepare the altar in private first',
      'Rely entirely on spontaneity',
      'Invite the largest crowd possible',
      'Avoid any structure',
    ],
    answer: 0,
    explanation:
      'Prepare the altar before you lead it. Give clear direction, leave room for silence, and protect the meeting from confusion.',
  },
  {
    id: 'mq-10',
    prompt: 'What is the right approach to prophetic revelation?',
    options: [
      'Deliver it immediately without testing',
      'Steward and test it with humility and accountability',
      'Use it to correct people publicly',
      'Ignore all prophetic words',
    ],
    answer: 1,
    explanation:
      'Revelation is stewarded, not performed. Every word is tested, and love never uses a prophecy to control.',
  },
  {
    id: 'mq-11',
    prompt: 'What does 1 Corinthians 14:32 mean for prophetic ministry?',
    options: [
      'Prophets cannot control themselves',
      'The spirits of the prophets are subject to the prophets',
      'Prophecy should never be judged',
      'Only one prophet may speak in a lifetime',
    ],
    answer: 1,
    explanation: 'Prophetic revelation is accountable. The prophet’s spirit is subject to the prophet.',
  },
  {
    id: 'mq-12',
    prompt: 'What is the goal of preaching?',
    options: [
      'A clever sermon and applause',
      'Transformed hearers, beginning with the preacher',
      'Showing the congregation how much you know',
      'Filling the building',
    ],
    answer: 1,
    explanation: 'The goal is transformation, not applause. Study the Word until it studies you.',
  },
];

const PASTORS_QUESTIONS: ExamQuestion[] = [
  {
    id: 'pq-01',
    prompt: 'Who ultimately owns the flock you shepherd?',
    options: ['The pastor', 'The board', 'God', 'The largest donor'],
    answer: 2,
    explanation: 'The flock belongs to God; the pastor is a steward, not an owner.',
  },
  {
    id: 'pq-02',
    prompt: 'What does the pastor’s prayer life shape?',
    options: [
      'Only the pastor’s private comfort',
      'The spiritual temperature of the congregation',
      'The church’s budget',
      'The preaching schedule',
    ],
    answer: 1,
    explanation: 'The prayer life of the shepherd sets the temperature of the flock.',
  },
  {
    id: 'pq-03',
    prompt: 'What did Paul pray for the churches, according to Colossians 1?',
    options: [
      'Their knowledge of God’s will, worthy walk, fruitfulness, and strength',
      'Their financial increase only',
      'Their political influence',
      'Their public reputation',
    ],
    answer: 0,
    explanation:
      'Paul prayed beyond comfort — for knowledge of God’s will, a worthy walk, fruitfulness, and strength.',
  },
  {
    id: 'pq-04',
    prompt: 'Which verse calls the leader to write the vision plainly?',
    options: ['Habakkuk 2:2', 'Psalm 91:1', 'Matthew 5:3', 'Romans 8:28'],
    answer: 0,
    explanation:
      'Habakkuk 2:2 — write the vision, make it plain, that he may run that reads it.',
  },
  {
    id: 'pq-05',
    prompt: 'How should a pastor view governance and structure?',
    options: [
      'As unspiritual bureaucracy',
      'As love for the people who will carry the vision after them',
      'As a way to control people',
      'As unnecessary for a small church',
    ],
    answer: 1,
    explanation:
      'Structure is not unspiritual. Clear roles, honest budgets, and documented decisions protect the vision beyond one leader.',
  },
  {
    id: 'pq-06',
    prompt: 'What did the early church do when growth created a problem?',
    options: [
      'Ignored the problem and kept preaching',
      'Appointed seven trustworthy men to handle the business',
      'Reduced the number of people served',
      'Made the apostles do everything themselves',
    ],
    answer: 1,
    explanation:
      'Acts 6 shows the church solving growth with structure — appointing seven men full of the Spirit and wisdom.',
  },
  {
    id: 'pq-07',
    prompt: 'Restoring people requires…',
    options: [
      'Gentleness and boundaries together',
      'Gentleness without any truth',
      'Consequences without any grace',
      'Avoiding difficult conversations',
    ],
    answer: 0,
    explanation:
      'Meekness is not the absence of wisdom. Restoration holds gentleness and truth together.',
  },
  {
    id: 'pq-08',
    prompt: 'What was Moses’ leadership bottleneck?',
    options: [
      'He lacked vision',
      'He tried to carry the people’s disputes alone',
      'He had too many assistants',
      'He refused to pray',
    ],
    answer: 1,
    explanation:
      'Moses sat alone judging the people until Jethro told him to delegate — the bottleneck was not humility but failure to share the load.',
  },
  {
    id: 'pq-09',
    prompt: 'What should a leader delegate?',
    options: [
      'Tasks only, never decisions',
      'Authority with clear scope, resources, and permission',
      'Nothing; delegation weakens leadership',
      'Only the tasks nobody else wants',
    ],
    answer: 1,
    explanation:
      'Delegate authority, not just tasks. Give scope, resources, and the permission to decide within that scope.',
  },
  {
    id: 'pq-10',
    prompt: 'Whom should leaders appoint to teams?',
    options: [
      'People who are merely competent',
      'People who fear God, tell the truth, and hate dishonest gain — character first',
      'People with the largest followings',
      'People who never disagree',
    ],
    answer: 1,
    explanation:
      'Exodus 18 points to able people who fear God, are truthful, and hate covetousness. Competence can be trained; integrity must be present.',
  },
  {
    id: 'pq-11',
    prompt: 'How is legacy built?',
    options: [
      'By accident over time',
      'By intentional transmission and giving the next generation real responsibility',
      'By keeping all authority with the senior pastor',
      'By building bigger buildings',
    ],
    answer: 1,
    explanation:
      'Legacy is built by intentional transmission. Secure leaders give real responsibility and celebrate those who surpass them.',
  },
  {
    id: 'pq-12',
    prompt: 'What is the most important room in a pastor’s life?',
    options: [
      'The boardroom',
      'The private altar where the pastor is simply a son',
      'The pulpit',
      'The conference stage',
    ],
    answer: 1,
    explanation:
      'The private altar keeps the public ministry honest. It is the only legacy that cannot be taken from you.',
  },
];


const MEDIA_QUESTIONS: ExamQuestion[] = [
  {
    id: 'media-q1',
    prompt: 'What is the media desk ultimately serving?',
    options: [
      'A personal brand and following',
      'The message and story of the house',
      'The equipment budget',
      'The media team’s reputation',
    ],
    answer: 1,
    explanation: 'Media serves the message. The goal is faithfulness, not a personal brand.',
  },
  {
    id: 'media-q2',
    prompt: 'What should you check before you start recording?',
    options: [
      'Only the battery level',
      'Light, background, and camera stability',
      'Whether the clip will go viral',
      'The number of people watching',
    ],
    answer: 1,
    explanation: 'A good frame begins before you press record: light, background, and stability.',
  },
  {
    id: 'media-q3',
    prompt: 'What coverage should a media worker aim to capture?',
    options: [
      'Only one wide shot',
      'Wide, medium, and close shots of the moment',
      'Only close-ups of the preacher',
      'Fifty rushed clips',
    ],
    answer: 1,
    explanation: 'Capture wide, medium, and close coverage so the story can be told well.',
  },
  {
    id: 'media-q4',
    prompt: 'What should you do before filming a sensitive moment?',
    options: [
      'Post it immediately',
      'Ask permission',
      'Zoom in quietly',
      'Assume consent because it is church',
    ],
    answer: 1,
    explanation: 'Ask permission before filming people in sensitive moments and protect their privacy.',
  },
  {
    id: 'media-q5',
    prompt: 'What must be checked before publishing a post?',
    options: [
      'Only the thumbnail',
      'Names, spellings, details, and consent',
      'Whether a competitor posted first',
      'How many hashtags you can add',
    ],
    answer: 1,
    explanation: 'What you publish is pastoral. Check names, details, and consent before posting.',
  },
  {
    id: 'media-q6',
    prompt: 'How should captions be written?',
    options: [
      'Long, dramatic, and exaggerated',
      'Short, true, and free of gossip or clickbait',
      'Copied from another church',
      'Written only to increase views',
    ],
    answer: 1,
    explanation: 'Keep the caption short and true. Avoid gossip, exaggeration, and clickbait.',
  },
  {
    id: 'media-q7',
    prompt: 'What should you do when you are unsure about a post?',
    options: [
      'Publish it and delete later',
      'Ask a leader before publishing',
      'Let a friend decide',
      'Post it without a caption',
    ],
    answer: 1,
    explanation: 'When unsure, ask a leader. The goal is faithfulness, not speed.',
  },
  {
    id: 'media-q8',
    prompt: 'What is the media team’s real goal?',
    options: [
      'Virality',
      'Faithfulness to the message',
      'Being noticed by other churches',
      'Buying better equipment',
    ],
    answer: 1,
    explanation: 'The goal is not virality; it is faithfulness.',
  },
];

const TECHNICAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'tech-q1',
    prompt: 'When is technical work mostly done?',
    options: [
      'During the sermon',
      'Before the room fills, in preparation and testing',
      'After everyone leaves',
      'Only when something breaks',
    ],
    answer: 1,
    explanation: 'Technical service is mostly invisible: prepare and test before the room fills.',
  },
  {
    id: 'tech-q2',
    prompt: 'What is the purpose of sound in the service?',
    options: [
      'To be the loudest thing in the room',
      'To make the message clear and balanced',
      'To impress visiting churches',
      'To fill silence',
    ],
    answer: 1,
    explanation: 'Sound exists to make the message clear, not to be the loudest.',
  },
  {
    id: 'tech-q3',
    prompt: 'How should microphones and gain be handled?',
    options: [
      'Set gain after the room is full and hope for the best',
      'Set gain before the room fills and keep microphones close',
      'Keep all microphones open continuously',
      'Turn every channel to the same level',
    ],
    answer: 1,
    explanation: 'Set gain before the room fills, keep mics close, and avoid feedback.',
  },
  {
    id: 'tech-q4',
    prompt: 'What is a good habit during the service?',
    options: [
      'Leaving unused microphones open',
      'Labeling channels and muting unused mics',
      'Ignoring the levels',
      'Listening only from the booth',
    ],
    answer: 1,
    explanation: 'Label channels, mute unused mics, watch levels, and listen from the congregation.',
  },
  {
    id: 'tech-q5',
    prompt: 'Which is a power safety rule?',
    options: [
      'Overload circuits to save time',
      'Keep water away from electrical equipment',
      'Use any cable available',
      'Run cables across walkways without taping',
    ],
    answer: 1,
    explanation: 'Use the right cables, never overload circuits, and keep water away from power.',
  },
  {
    id: 'tech-q6',
    prompt: 'What should be done with cables that cross walkways?',
    options: [
      'Leave them loose',
      'Tape them down',
      'Cover them with cloth',
      'Move them during the service',
    ],
    answer: 1,
    explanation: 'Tape down cables that cross walkways to prevent trips and accidents.',
  },
  {
    id: 'tech-q7',
    prompt: 'What should be in place before a power cut?',
    options: [
      'A backup plan and knowledge of the breakers',
      'A louder sound system',
      'A new projector',
      'Nothing; power cuts are unpredictable',
    ],
    answer: 0,
    explanation: 'Know where the breakers are and have a backup plan for a power cut.',
  },
  {
    id: 'tech-q8',
    prompt: 'What happens at the end of service?',
    options: [
      'Leave everything for the next team',
      'Shut down in order and secure the equipment',
      'Keep all systems running overnight',
      'Unplug random cables',
    ],
    answer: 1,
    explanation: 'At the end, shut down in order and secure the equipment. Safety is part of worship.',
  },
];

const USHERING_QUESTIONS: ExamQuestion[] = [
  {
    id: 'usher-q1',
    prompt: 'Why does the usher matter so much?',
    options: [
      'They control the offering',
      'They are the first face of the house and set the temperature',
      'They are the most senior department',
      'They decide who speaks',
    ],
    answer: 1,
    explanation: 'The usher is the first face of the house; welcome shapes the worship experience.',
  },
  {
    id: 'usher-q2',
    prompt: 'Who should an usher especially look out for?',
    options: [
      'Only the pastor',
      'The lost, the elderly, and families with children',
      'Only visitors with cars',
      'Only people they know',
    ],
    answer: 1,
    explanation: 'Look for people who are lost, elderly, or carrying children and help them.',
  },
  {
    id: 'usher-q3',
    prompt: 'How should offerings be handled?',
    options: [
      'Count money in the open',
      'Keep the flow orderly and money out of sight',
      'Let anyone handle the bags',
      'Announce the total immediately',
    ],
    answer: 1,
    explanation: 'Keep the offering flow orderly and never count money in the open.',
  },
  {
    id: 'usher-q4',
    prompt: 'What should you do if a seat is taken?',
    options: [
      'Embarrass the person',
      'Solve it quietly without embarrassment',
      'Ask them to leave',
      'Ignore the problem',
    ],
    answer: 1,
    explanation: 'Solve seating problems without embarrassing anyone.',
  },
  {
    id: 'usher-q5',
    prompt: 'What should you do if someone is unwell?',
    options: [
      'Carry them out alone',
      'Call a leader and clear space',
      'Ignore it to avoid attention',
      'Post about it online',
    ],
    answer: 1,
    explanation: 'Call a leader, clear space, and protect the person’s privacy.',
  },
  {
    id: 'usher-q6',
    prompt: 'How should a disturbance be handled?',
    options: [
      'With panic and shouting',
      'Calmly, keeping the room safe and escalating',
      'By confronting the person publicly',
      'By stopping the service immediately',
    ],
    answer: 1,
    explanation: 'Stay calm, keep the room safe, and escalate to the right leader.',
  },
  {
    id: 'usher-q7',
    prompt: 'What should an usher know in an emergency?',
    options: [
      'Only the offering schedule',
      'The exits and the first-aid point',
      'The preacher’s notes',
      'The media captions',
    ],
    answer: 1,
    explanation: 'Know the exits and the first-aid point before an emergency happens.',
  },
  {
    id: 'usher-q8',
    prompt: 'What should happen after an incident?',
    options: [
      'Share the story widely',
      'Write a short report and protect confidentiality',
      'Forget it',
      'Confront the person again',
    ],
    answer: 1,
    explanation: 'Write a short report afterward; confidentiality and a clear head matter.',
  },
];

const PROTOCOL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'protocol-q1',
    prompt: 'What is the heart of protocol?',
    options: [
      'Showing importance',
      'Honour and making people feel valued',
      'Controlling access',
      'Wearing the best clothes',
    ],
    answer: 1,
    explanation: 'Protocol is the art of honour: representing the house and valuing guests.',
  },
  {
    id: 'protocol-q2',
    prompt: 'What should be confirmed when a guest arrives?',
    options: [
      'Their social media following',
      'Their name, schedule, and plan',
      'Their offering',
      'Their family history',
    ],
    answer: 1,
    explanation: 'Confirm the guest, the schedule, and the plan before moving them.',
  },
  {
    id: 'protocol-q3',
    prompt: 'Who should be coordinated with before moving a guest through a public space?',
    options: [
      'No one',
      'Security and media',
      'Only the choir',
      'The congregation',
    ],
    answer: 1,
    explanation: 'Coordinate with security and media before moving a guest through public space.',
  },
  {
    id: 'protocol-q4',
    prompt: 'How should guest details be treated?',
    options: [
      'Shared with the team group chat',
      'Kept private',
      'Posted online',
      'Told to whoever asks',
    ],
    answer: 1,
    explanation: 'Guest details and movements are private and should not be repeated.',
  },
  {
    id: 'protocol-q5',
    prompt: 'What is required before posting a photo of a guest?',
    options: [
      'Nothing',
      'Clearance and consent',
      'A caption with their name',
      'A tag from the media team',
    ],
    answer: 1,
    explanation: 'Do not post photos or information without clearance.',
  },
  {
    id: 'protocol-q6',
    prompt: 'What should you do if you are unsure?',
    options: [
      'Guess',
      'Stop and ask',
      'Ask a guest',
      'Post and see what happens',
    ],
    answer: 1,
    explanation: 'If unsure, stop and ask the protocol lead.',
  },
  {
    id: 'protocol-q7',
    prompt: 'What posture should protocol carry?',
    options: [
      'Closed and important',
      'Open, calm, and honouring',
      'Loud and visible',
      'Casual and distracted',
    ],
    answer: 1,
    explanation: 'Keep your posture open and make others feel valued.',
  },
  {
    id: 'protocol-q8',
    prompt: 'What should you do with a safety concern?',
    options: [
      'Report it quietly to the lead',
      'Announce it to the congregation',
      'Ignore it',
      'Post it online',
    ],
    answer: 0,
    explanation: 'Report safety concerns quietly to the lead. Trust is built by discretion.',
  },
];

const CHOIR_QUESTIONS: ExamQuestion[] = [
  {
    id: 'choir-q1',
    prompt: 'What is the choir leading the congregation into?',
    options: [
      'A performance',
      'Worship',
      'A competition',
      'A rehearsal',
    ],
    answer: 1,
    explanation: 'The choir leads the congregation into worship, not into a performance.',
  },
  {
    id: 'choir-q2',
    prompt: 'Which matters more than a perfect note?',
    options: [
      'Unity',
      'Volume',
      'A solo',
      'A new song',
    ],
    answer: 0,
    explanation: 'Unity matters more than a perfect note.',
  },
  {
    id: 'choir-q3',
    prompt: 'How should you prepare your voice?',
    options: [
      'Start singing immediately at full volume',
      'Warm up and breathe from the diaphragm',
      'Whisper all morning',
      'Drink cold water only',
    ],
    answer: 1,
    explanation: 'Warm up and breathe from the diaphragm; treat the voice as an instrument.',
  },
  {
    id: 'choir-q4',
    prompt: 'What should you do after learning your part?',
    options: [
      'Sing over everyone',
      'Listen to the parts around you and blend',
      'Improvise every line',
      'Ignore the director',
    ],
    answer: 1,
    explanation: 'Learn your part, then listen and blend with the team.',
  },
  {
    id: 'choir-q5',
    prompt: 'How should you come to rehearsal?',
    options: [
      'Late but talented',
      'On time with your lyrics and part learned',
      'Without listening to the song',
      'Only when you feel like it',
    ],
    answer: 1,
    explanation: 'Come on time with your lyrics and part learned.',
  },
  {
    id: 'choir-q6',
    prompt: 'Who should the choir follow during service?',
    options: [
      'The loudest voice',
      'The director',
      'The congregation',
      'The drummer',
    ],
    answer: 1,
    explanation: 'Stay focused and follow the director.',
  },
  {
    id: 'choir-q7',
    prompt: 'How should the voice be protected?',
    options: [
      'Strain for volume',
      'Avoid screaming and rest the voice',
      'Sing through pain',
      'Skip warm-ups',
    ],
    answer: 1,
    explanation: 'Do not strain or scream; rest your voice. Vocal discipline protects the gift.',
  },
  {
    id: 'choir-q8',
    prompt: 'What is the goal of the choir?',
    options: [
      'To be noticed',
      'To help the room meet God',
      'To win a competition',
      'To record an album',
    ],
    answer: 1,
    explanation: 'The goal is not to be noticed; it is to help the room meet God.',
  },
];

const WELFARE_QUESTIONS: ExamQuestion[] = [
  {
    id: 'welfare-q1',
    prompt: 'What does welfare see?',
    options: [
      'Only the church budget',
      'The person behind the need',
      'Only the loudest requests',
      'Only visitors',
    ],
    answer: 1,
    explanation: 'Welfare sees the person behind the need: the widow, the new mother, the grieving family.',
  },
  {
    id: 'welfare-q2',
    prompt: 'What should be agreed before a visit?',
    options: [
      'The purpose of the visit',
      'The offering amount',
      'The guest list',
      'The choir set',
    ],
    answer: 0,
    explanation: 'Agree the purpose of the visit before you go.',
  },
  {
    id: 'welfare-q3',
    prompt: 'When should a welfare visit be done in pairs?',
    options: [
      'Never',
      'Where appropriate, for safety and wisdom',
      'Only when the person is a leader',
      'Only on Sundays',
    ],
    answer: 1,
    explanation: 'Go in pairs where appropriate and respect the home and family boundaries.',
  },
  {
    id: 'welfare-q4',
    prompt: 'What should you avoid promising?',
    options: [
      'Prayer',
      'What the church cannot deliver',
      'A follow-up call',
      'A meal',
    ],
    answer: 1,
    explanation: 'Never promise what the church cannot deliver.',
  },
  {
    id: 'welfare-q5',
    prompt: 'How should confidential information be handled?',
    options: [
      'Share it widely for prayer',
      'Share only with those who need it',
      'Post it anonymously',
      'Tell the whole team',
    ],
    answer: 1,
    explanation: 'Keep information private and share only with the welfare lead when necessary.',
  },
  {
    id: 'welfare-q6',
    prompt: 'When should you refer someone?',
    options: [
      'Never',
      'When they need a pastor, counsellor, or medical professional',
      'Only when they ask for money',
      'Only after a year',
    ],
    answer: 1,
    explanation: 'Know when to refer to a pastor, counsellor, or medical professional.',
  },
  {
    id: 'welfare-q7',
    prompt: 'What does good follow-up look like?',
    options: [
      'Constant intrusion',
      'Consistent, respectful, and not intrusive',
      'One visit and no contact',
      'Public updates',
    ],
    answer: 1,
    explanation: 'Follow up, but do not become intrusive. Care is faithful, confidential love.',
  },
  {
    id: 'welfare-q8',
    prompt: 'Which is practical love?',
    options: [
      'A grand gesture once a year',
      'A meal, a ride, a prayer, or a quiet presence',
      'A social media post',
      'A promise for later',
    ],
    answer: 1,
    explanation: 'Practical love can be a meal, a ride, a prayer, or a quiet presence.',
  },
];

const CHILDREN_QUESTIONS: ExamQuestion[] = [
  {
    id: 'children-q1',
    prompt: 'What comes before teaching in children’s ministry?',
    options: [
      'Games',
      'Safeguarding and safety',
      'Music',
      'Snacks',
    ],
    answer: 1,
    explanation: 'Children’s ministry begins with safety; a safe child can hear the gospel.',
  },
  {
    id: 'children-q2',
    prompt: 'When may a children’s worker be alone with a child?',
    options: [
      'During nap time',
      'Never in a closed room',
      'When the child asks',
      'When the parents are late',
    ],
    answer: 1,
    explanation: 'Never be alone with a child in a closed room; keep visibility and two-adult rules.',
  },
  {
    id: 'children-q3',
    prompt: 'How often should check-in and check-out be followed?',
    options: [
      'Only for visitors',
      'Every single time',
      'When it is busy',
      'Only on special Sundays',
    ],
    answer: 1,
    explanation: 'Follow the check-in and check-out process every time, even when inconvenient.',
  },
  {
    id: 'children-q4',
    prompt: 'How many clear truths should a children’s lesson carry?',
    options: [
      'Ten',
      'One',
      'As many as possible',
      'None',
    ],
    answer: 1,
    explanation: 'Prepare a short lesson with one clear truth.',
  },
  {
    id: 'children-q5',
    prompt: 'How do children learn best?',
    options: [
      'Long lectures',
      'Repetition, story, play, and example',
      'Silent reading only',
      'Memorizing without context',
    ],
    answer: 1,
    explanation: 'Children learn through repetition, story, play, and example.',
  },
  {
    id: 'children-q6',
    prompt: 'What should happen after an incident?',
    options: [
      'Keep it quiet',
      'Report promptly, honestly, and privately',
      'Post in the group chat',
      'Wait until the next month',
    ],
    answer: 1,
    explanation: 'Report incidents promptly and honestly; keep records private.',
  },
  {
    id: 'children-q7',
    prompt: 'How should parents be engaged?',
    options: [
      'Only when there is a problem',
      'Communicate early and clearly',
      'Avoid speaking to them',
      'Send them the lesson plan only',
    ],
    answer: 1,
    explanation: 'Parents are the first teachers; communicate early and clearly.',
  },
  {
    id: 'children-q8',
    prompt: 'What is the goal of children’s ministry?',
    options: [
      'A perfect class',
      'A child who knows God loves them and church is safe',
      'A large attendance',
      'A quiet room',
    ],
    answer: 1,
    explanation: 'The goal is a child who knows God loves them and that church is a safe place.',
  },
];

const BANK: Record<CourseSlug, ExamDefinition> = {
  foundation: { questions: FOUNDATION_QUESTIONS },
  ministers: { questions: MINISTERS_QUESTIONS },
  pastors: { questions: PASTORS_QUESTIONS },
  media: { questions: MEDIA_QUESTIONS },
  technical: { questions: TECHNICAL_QUESTIONS },
  ushering: { questions: USHERING_QUESTIONS },
  protocol: { questions: PROTOCOL_QUESTIONS },
  choir: { questions: CHOIR_QUESTIONS },
  welfare: { questions: WELFARE_QUESTIONS },
  children: { questions: CHILDREN_QUESTIONS },
};

export function getExamDefinition(slug: CourseSlug): ExamDefinition {
  return BANK[slug];
}

export function getExamQuestionCount(slug: CourseSlug): number {
  return BANK[slug].questions.length;
}
