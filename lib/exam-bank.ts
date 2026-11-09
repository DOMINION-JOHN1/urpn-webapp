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


const AESTHETICS_QUESTIONS: ExamQuestion[] = [
  {
    id: 'aes-q1',
    prompt: 'What is the primary objective of the Aesthetics Department in URPN?',
    options: [
      'To display costly ornaments for visitors',
      'To create a welcoming, inspiring, and orderly environment that reflects excellence and fosters worship',
      'To replace the ushering and protocol teams',
      'To manage stage entertainment during Sunday services',
    ],
    answer: 1,
    explanation: 'The Aesthetics team ensures event premises reflect excellence and orderliness, creating an inspiring environment for worship.',
  },
  {
    id: 'aes-q2',
    prompt: 'Which of the following is a core operational duty during hall preparation?',
    options: [
      'Arriving after service begins to inspect the floor',
      'Regularly cleaning, sanitizing, and arranging chairs and essentials for comfort and accessibility',
      'Only decorating during annual anniversaries',
      'Leaving seating arrangement exclusively to the facilities crew',
    ],
    answer: 1,
    explanation: 'Hall preparation requires regular cleaning, sanitizing, and arranging seating for comfort and accessibility.',
  },
  {
    id: 'aes-q3',
    prompt: 'How should the Aesthetics team approach stage and altar decorations?',
    options: [
      'Design without considering sermon themes or lighting',
      'Conceptualize creative designs aligned with church themes, seasons, and camera sightlines',
      'Copy external church stages without budget consideration',
      'Rely solely on disposable plastic decorations',
    ],
    answer: 1,
    explanation: 'Designs must align with seasonal church themes, camera sightlines, and be executed within budget.',
  },
  {
    id: 'aes-q4',
    prompt: 'What eco-friendly and modern practice should the Aesthetics team incorporate?',
    options: [
      'Single-use non-recyclable plastics for all events',
      'Sustainable practices, reusable materials, and energy-efficient lighting',
      'Ignoring current interior design trends',
      'Replacing physical stages with virtual screens only',
    ],
    answer: 1,
    explanation: 'The department incorporates sustainability, reusable materials, and energy-efficient lighting.',
  },
  {
    id: 'aes-q5',
    prompt: 'What must occur during post-service cleanup and hall reset?',
    options: [
      'Leaving the hall untidy until the next weekend',
      'Proper cleaning, resetting chairs, and promptly reporting or addressing any damage',
      'Leaving all stage props unattended until the next event',
      'Handing over the hall to the congregation without inspection',
    ],
    answer: 1,
    explanation: 'Post-service protocols require immediate cleaning, resetting the hall, and prompt attention to maintenance needs.',
  },
  {
    id: 'aes-q6',
    prompt: 'Which attribute is essential for a member of the Aesthetics Department?',
    options: [
      'A keen eye for detail, creativity, and the ability to work under event time constraints',
      'Preference for working in total isolation',
      'A tendency to resist modern trends and new materials',
      'Arriving right as the sermon starts',
    ],
    answer: 0,
    explanation: 'Key attributes include a keen eye for design and detail, creativity, and working effectively under time constraints.',
  },
  {
    id: 'aes-q7',
    prompt: 'What is a key leadership responsibility of the Head of the Aesthetics Department (HOD)?',
    options: [
      'Approving choir song choices',
      'Providing strategic design direction, managing decor budgets, and mentoring team members',
      'Managing transport routes for congregants',
      'Directing church livestream cameras',
    ],
    answer: 1,
    explanation: 'The HOD provides strategic design direction, project management, budget control, and team development.',
  },
  {
    id: 'aes-q8',
    prompt: 'Which Key Performance Indicator (KPI) measures the success of the Aesthetics Department?',
    options: [
      'Number of social media likes on personal accounts',
      'Timely execution of projects, positive feedback on environment, and membership development',
      'Total number of microphones on the altar',
      'Length of time taken to finish a church service',
    ],
    answer: 1,
    explanation: 'Aesthetics KPIs evaluate timely project execution, positive community feedback, and team development.',
  },
];

const PR_QUESTIONS: ExamQuestion[] = [
  {
    id: 'pr-q1',
    prompt: 'What is the primary role of the Public Relations (PR) Department in URPN?',
    options: [
      'To serve as the voice and face of the ministry, managing communications, follow-ups, and branding',
      'To handle technical sound production on the soundboard',
      'To manage choir rehearsals and song selections',
      'To conduct financial audits of the church',
    ],
    answer: 0,
    explanation: 'The PR Department is the voice and face of the ministry, responsible for communications, follow-ups, and branding.',
  },
  {
    id: 'pr-q2',
    prompt: 'How should the PR Department handle first-timers after a church meeting?',
    options: [
      'Wait for them to reach out after a month',
      'Conduct personalized follow-up calls and welcome messages to encourage connection and integration',
      'Only send a general broadcast once a year',
      'Share their contact details publicly on social media',
    ],
    answer: 1,
    explanation: 'First-timers must be tracked with personalized calls and messages welcoming and connecting them to the ministry.',
  },
  {
    id: 'pr-q3',
    prompt: 'How does the PR team collaborate with the Evangelical Team?',
    options: [
      'By auditing evangelism finances',
      'By following up on field evangelism contacts and sending bulk SMS reminders to encourage attendance',
      'By taking over field preaching duties entirely',
      'By replacing cell fellowship leaders',
    ],
    answer: 1,
    explanation: 'PR collaborates with evangelism to follow up field contacts and encourage attendance through bulk SMS.',
  },
  {
    id: 'pr-q4',
    prompt: 'What is the PR Department\'s responsibility regarding Félicitations?',
    options: [
      'Ensuring timely notification and celebration of members’ birthdays and anniversaries',
      'Organizing weekly commercial parties',
      'Managing pastorate salaries',
      'Sending birthday wishes only to department heads',
    ],
    answer: 0,
    explanation: 'The team ensures timely celebration and recognition of members\' special days and anniversaries.',
  },
  {
    id: 'pr-q5',
    prompt: 'Which partner department does PR work closely with for event publicity and branding?',
    options: [
      'Transport Department',
      'Media Department',
      'Security Department',
      'Aesthetics Department',
    ],
    answer: 1,
    explanation: 'PR partners with Media to manage publicity, branding, and public image alignment across channels.',
  },
  {
    id: 'pr-q6',
    prompt: 'What knowledge expectation is required of PR team members?',
    options: [
      'Deep knowledge of audio cables and stage lighting',
      'Thorough understanding of ministry details, vision, schedules, and local territorial intelligence',
      'Professional vehicle mechanics and maintenance',
      'Advanced musical notation and choir arrangement',
    ],
    answer: 1,
    explanation: 'Team members must master ministry details, mission, schedules, and local territorial intelligence.',
  },
  {
    id: 'pr-q7',
    prompt: 'In what manner must PR team members conduct themselves in public and private interactions?',
    options: [
      'Casual and informal without regard for ministry reputation',
      'With professional ethics, discipline, and caution as representatives of the ministry',
      'Aggressively defending personal opinions online',
      'Secretively without providing official church information',
    ],
    answer: 1,
    explanation: 'As ministry ambassadors, team members must maintain professional ethics, discipline, and caution.',
  },
  {
    id: 'pr-q8',
    prompt: 'Who does the Head of the Public Relations Department primarily report and liaise with?',
    options: [
      'The Chief Security Officer',
      'The Administrator',
      'The Chief Usher',
      'The Choir Director',
    ],
    answer: 1,
    explanation: 'The HOD PR acts as the strategic leader and primary liaison between the PR Department and the Administrator.',
  },
];

const PRAYER_QUESTIONS: ExamQuestion[] = [
  {
    id: 'pray-q1',
    prompt: 'What is the primary spiritual purpose of the Prayer Department?',
    options: [
      'To replace regular church sermons with continuous loud shouting',
      'To maintain perpetual fire upon the altar and stand in the gap for the ministry, leaders, and congregation',
      'To debate theological theories with members',
      'To monitor church attendance registers',
    ],
    answer: 1,
    explanation: 'The Prayer Department keeps the spiritual altar fire burning through intercession for the house and global mandate.',
  },
  {
    id: 'pray-q2',
    prompt: 'According to biblical intercessory standards, what underpins effective corporate prayer?',
    options: [
      'Public eloquence and poetic language',
      'A consecrated secret place altar and vibrant personal fellowship with God',
      'Loud microphone volume during service',
      'Praying only when an emergency occurs',
    ],
    answer: 1,
    explanation: 'Private prayer discipline and personal communion sustain spiritual authority in public intercession.',
  },
  {
    id: 'pray-q3',
    prompt: 'How must intercessors handle confidential prayer requests shared with the team?',
    options: [
      'Share them with close friends as prayer points',
      'Treat them with absolute confidentiality and take them to God alone at the altar',
      'Post summaries on social media prayer forums',
      'Discuss them casually during post-service fellowship',
    ],
    answer: 1,
    explanation: 'Prayer requests are a sacred trust and must never be repeated outside the altar of prayer.',
  },
  {
    id: 'pray-q4',
    prompt: 'What is territorial intercession?',
    options: [
      'Surveying church land boundaries with government surveyors',
      'Discerning spiritual atmospheres, breaking territorial yokes, and legislating God’s kingdom over a region',
      'Distributing flyers across street intersections',
      'Arranging chairs according to district zones',
    ],
    answer: 1,
    explanation: 'Territorial intercession addresses spiritual atmospheres and clears resistance for the gospel across regions.',
  },
  {
    id: 'pray-q5',
    prompt: 'When should prayer team members typically arrive before a church service or conference?',
    options: [
      'After the worship team finishes the first song',
      'Early, to spiritually saturate the auditorium and cover the altar before attendees arrive',
      'Right when the preacher takes the pulpit',
      'Only after the service concludes',
    ],
    answer: 1,
    explanation: 'Intercessors arrive early to saturate the atmosphere and spiritually prepare the house for worship.',
  },
  {
    id: 'pray-q6',
    prompt: 'How should the Prayer Department respond when a ministry crisis or emergency arises?',
    options: [
      'Panic and speculate on what went wrong',
      'Mobilize targeted, focused prayer chains and standing intercession in alignment with leadership',
      'Suspend all prayer until leadership provides a public statement',
      'Forward rumors to church group chats',
    ],
    answer: 1,
    explanation: 'The prayer team mobilizes rapid intercessory chains and stands in spiritual defense alongside ministry leadership.',
  },
  {
    id: 'pray-q7',
    prompt: 'What is a primary duty of the Prayer Coordinator?',
    options: [
      'Authoring musical lyrics for Sunday services',
      'Organizing prayer schedules, leading vigils, and reporting departmental progress to the Administrator',
      'Managing church transport vehicle repairs',
      'Serving meals during church banquets',
    ],
    answer: 1,
    explanation: 'The Prayer Coordinator directs prayer chains, schedules vigils, and reports departmental activities to leadership.',
  },
  {
    id: 'pray-q8',
    prompt: 'Which scripture anchors the principle of keeping the altar fire burning continuously?',
    options: [
      'John 11:35',
      'Leviticus 6:13 — The fire shall ever be burning upon the altar; it shall never go out',
      '1 Corinthians 13:1',
      'Proverbs 3:5',
    ],
    answer: 1,
    explanation: 'Leviticus 6:13 commands that the altar fire burn continually and never be extinguished.',
  },
];

const COUNSELING_QUESTIONS: ExamQuestion[] = [
  {
    id: 'cns-q1',
    prompt: 'What is the foundational objective of the Counseling Department in URPN?',
    options: [
      'To give human philosophy and secular psychoanalysis',
      'To provide compassionate, biblically sound counsel that leads to spiritual restoration and emotional healing',
      'To judge and discipline struggling church members',
      'To gather personal stories for sermon illustrations',
    ],
    answer: 1,
    explanation: 'Christian counseling provides compassionate, Scripture-based guidance for restoration and spiritual healing.',
  },
  {
    id: 'cns-q2',
    prompt: 'What is the rule regarding confidentiality in pastoral counseling?',
    options: [
      'Counselors can discuss cases with their family members',
      'Confidentiality is a sacred trust and must be strictly maintained, barring immediate harm or legal emergencies',
      'Information can be shared with other workers if they promise not to tell anyone',
      'All counseling notes must be published on noticeboards',
    ],
    answer: 1,
    explanation: 'Confidentiality is vital; counselee disclosures must never be leaked or shared casually.',
  },
  {
    id: 'cns-q3',
    prompt: 'How should a counselor listen to someone sharing deep personal pain?',
    options: [
      'Interrupt frequently to explain their own life experiences',
      'With Christ-like empathy, patience, non-judgmental love, and active listening',
      'Look at their smartphone clock to ensure the session ends promptly',
      'Criticize the individual for having insufficient faith',
    ],
    answer: 1,
    explanation: 'Effective counselors practice active listening with empathy, patience, and non-judgmental support.',
  },
  {
    id: 'cns-q4',
    prompt: 'What should a counselor do when faced with a severe psychiatric crisis or abusive criminal situation?',
    options: [
      'Attempt to handle it entirely alone without telling anyone',
      'Immediately consult and escalate the case to the Head of Counseling and pastoral leadership',
      'Dismiss the counselee and tell them to pray harder',
      'Call a church meeting to discuss the matter',
    ],
    answer: 1,
    explanation: 'Critical, life-threatening, or complex legal cases must be immediately escalated to pastoral leadership.',
  },
  {
    id: 'cns-q5',
    prompt: 'Why should counselors avoid meeting vulnerable counselees alone in isolated or closed rooms?',
    options: [
      'Because church rooms are too cold',
      'To protect both the counselee and counselor from compromise, false accusation, and ethical breaches',
      'Because counselors are not allowed to be indoors',
      'To ensure other people can hear what is being discussed',
    ],
    answer: 1,
    explanation: 'Ethical guidelines require counseling in visible, accountable environments to prevent compromise or false claims.',
  },
  {
    id: 'cns-q6',
    prompt: 'Where must all advice and guidance in Christian counseling be anchored?',
    options: [
      'In personal intuition and worldly traditions',
      'Firmly in the Holy Scriptures and the wisdom of the Holy Spirit',
      'In social media trends and pop psychology',
      'In horoscopes and personality tests',
    ],
    answer: 1,
    explanation: 'Biblical counsel draws its authority, insight, and power directly from the Word of God.',
  },
  {
    id: 'cns-q7',
    prompt: 'How does the Counseling Department interact with the ministry President?',
    options: [
      'Bypassing all leadership to schedule sudden appointments',
      'Working through the Head of Counseling and Administrator to schedule appropriate meetings and appointments',
      'Instructing the President on what to preach',
      'Preventing members from ever meeting pastors',
    ],
    answer: 1,
    explanation: 'Member meetings with the President are coordinated through the HOD and Administrator in an orderly manner.',
  },
  {
    id: 'cns-q8',
    prompt: 'Which attribute is vital for anyone serving in the Counseling Department?',
    options: [
      'Emotional maturity, scriptural soundness, empathy, and absolute integrity',
      'Curiosity about people’s private secrets',
      'Desire to control people’s life decisions',
      'A loud and argumentative personality',
    ],
    answer: 0,
    explanation: 'Counselors require spiritual maturity, sound biblical understanding, discretion, and genuine empathy.',
  },
];

const TRANSPORT_QUESTIONS: ExamQuestion[] = [
  {
    id: 'trn-q1',
    prompt: 'What is the primary mission of the URPN Transport Department?',
    options: [
      'To offer commercial taxi services to the general public for profit',
      'To ensure safe, punctual, and reliable transit for members, guests, and ministers to church services and events',
      'To sell used vehicles to church workers',
      'To regulate airport customs for international flights',
    ],
    answer: 1,
    explanation: 'The Transport Department coordinates fleet mobility, ensuring safe and punctual transport to church events.',
  },
  {
    id: 'trn-q2',
    prompt: 'What must every driver perform before operating a ministry vehicle?',
    options: [
      'Honk the horn repeatedly to test the sound',
      'Conduct a pre-trip inspection of brakes, tires, oil, coolant, lights, and safety equipment',
      'Start driving immediately without checking the vehicle',
      'Wash only the windshield',
    ],
    answer: 1,
    explanation: 'Pre-trip inspections of tires, fluids, brakes, and safety gear are mandatory before any vehicle trip.',
  },
  {
    id: 'trn-q3',
    prompt: 'What is the policy regarding speed limits and road safety laws?',
    options: [
      'Drivers may exceed speed limits if church service is about to start',
      'Strict compliance with road safety laws, speed limits, seatbelt regulations, and defensive driving at all times',
      'Traffic signals can be ignored on Sunday mornings',
      'Safety depends on the driver’s personal confidence',
    ],
    answer: 1,
    explanation: 'Passenger safety requires strict adherence to traffic laws, defensive driving, and speed limits.',
  },
  {
    id: 'trn-q4',
    prompt: 'How should a driver respond if an unexpected vehicle breakdown occurs while ferrying members?',
    options: [
      'Abandon the vehicle and walk away',
      'Safely pull over, ensure passenger safety, remain calm, and immediately alert the Head of Transport',
      'Ask passengers to push the vehicle on a busy highway',
      'Argue with passengers about the delay',
    ],
    answer: 1,
    explanation: 'The driver must prioritize passenger safety, stay calm, and execute emergency contingency plans with the HOD.',
  },
  {
    id: 'trn-q5',
    prompt: 'What standard of cleanliness is expected for church transport vehicles?',
    options: [
      'Washed only once every six months',
      'Cleaned, sanitized, and well-maintained before and after every trip',
      'Leaving trash inside until full',
      'Allowing passengers to eat and litter freely',
    ],
    answer: 1,
    explanation: 'Vehicles must be cleaned, sanitized, and kept in presentable order for passengers at all times.',
  },
  {
    id: 'trn-q6',
    prompt: 'Which qualification is mandatory for anyone driving in the Transport Department?',
    options: [
      'A valid driver’s license, verifiable driving experience, and a clean driving record',
      'Ownership of an expensive personal sports car',
      'Ability to drive at maximum speed without fear',
      'Having an international rally racing trophy',
    ],
    answer: 0,
    explanation: 'Drivers must possess a valid driver’s license, proven experience, and an unblemished safety record.',
  },
  {
    id: 'trn-q7',
    prompt: 'What is a key responsibility of the Head of the Transport Department (HOD)?',
    options: [
      'Directing the choir’s Sunday setlist',
      'Fleet management, scheduling route logistics, supervising driver safety, and vehicle maintenance',
      'Designing stage backdrops for special events',
      'Conducting communion bread distribution',
    ],
    answer: 1,
    explanation: 'The Transport HOD manages fleet maintenance, route logistics, driver supervision, and safety compliance.',
  },
  {
    id: 'trn-q8',
    prompt: 'Which Key Performance Indicator (KPI) evaluates the Transport Department?',
    options: [
      'Fuel cost per mile on personal road trips',
      'Zero preventable accidents, punctuality of arrivals, vehicle safety compliance, and passenger feedback',
      'Number of tickets received from traffic wardens',
      'Average speed achieved on city streets',
    ],
    answer: 1,
    explanation: 'Transport performance is measured by safety records, punctuality, fleet health, and passenger comfort.',
  },
];

const MEDICAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'med-q1',
    prompt: 'What is the primary role of the Medical Department (Medics) during church meetings?',
    options: [
      'To perform complex surgeries inside the church sanctuary',
      'To provide emergency first response, health triage, first-aid care, and maintain medical readiness',
      'To replace the prayer team in praying for the sick',
      'To inspect the kitchen catering recipes',
    ],
    answer: 1,
    explanation: 'The Medics provide emergency first aid, triage, and health safety during all church gatherings.',
  },
  {
    id: 'med-q2',
    prompt: 'How should patient health information and treatment logs be treated?',
    options: [
      'Shared with friends in the church for testimony purposes',
      'Treated with strict professional confidentiality and documented in private, secure records',
      'Announced during the announcements session',
      'Left open on tables in the medical bay',
    ],
    answer: 1,
    explanation: 'Medical ethics and ministry standards require airtight confidentiality for all patient records.',
  },
  {
    id: 'med-q3',
    prompt: 'What should the medical team do when a worshipper collapses during service?',
    options: [
      'Shout loudly to attract the whole church’s attention',
      'Approach swiftly and calmly, assess vital signs (airway, breathing, circulation), administer first aid, and evacuate discretely',
      'Wait until the sermon ends before offering help',
      'Move the person aggressively without checking for neck injury',
    ],
    answer: 1,
    explanation: 'Medics respond calmly and rapidly, check vital signs, administer first aid, and ensure discreet handling.',
  },
  {
    id: 'med-q4',
    prompt: 'What is the rule regarding administering prescription medications to attendees?',
    options: [
      'Medics can prescribe any prescription drug without a doctor',
      'Only administer basic approved first-aid treatments and emergency triage, referring complex cases to hospitals',
      'Share unused medicines between different church members',
      'Administer expired medications if unopened',
    ],
    answer: 1,
    explanation: 'Medics provide first-aid stabilization and emergency triage, escalating critical medical cases to hospitals.',
  },
  {
    id: 'med-q5',
    prompt: 'What community health initiatives does the Medical Department spearhead?',
    options: [
      'Health screenings (blood pressure, glucose checks), wellness seminars, and medical outreach clinics',
      'Distributing unregulated miracle remedies',
      'Selling expensive imported fitness supplements',
      'Conducting beauty contests for youth',
    ],
    answer: 0,
    explanation: 'The department coordinates preventive screenings, health seminars, and community medical outreaches.',
  },
  {
    id: 'med-q6',
    prompt: 'Who is qualified to serve as the Head of the Medical Department (HOD)?',
    options: [
      'Anyone who has watched medical documentaries',
      'A qualified, licensed Medical Doctor with clinical experience',
      'A student studying engineering',
      'A member who owns a pharmacy shop without medical credentials',
    ],
    answer: 1,
    explanation: 'The official role specification designates the Medical HOD as a qualified Medical Doctor.',
  },
  {
    id: 'med-q7',
    prompt: 'How does the Medical Department collaborate with municipal emergency services?',
    options: [
      'By ignoring city ambulance numbers',
      'By establishing rapid liaison and clear ambulance dispatch pathways for critical emergencies',
      'By transporting emergency patients on passenger motorbikes',
      'By attempting to treat major traumas without external hospital transfer',
    ],
    answer: 1,
    explanation: 'Medics maintain active liaison with local ambulance and hospital services for emergency transfers.',
  },
  {
    id: 'med-q8',
    prompt: 'Which attribute is essential for a member of the URPN Medical Department?',
    options: [
      'Clinical competence, calmness in emergencies, compassionate bedside manner, and ethical integrity',
      'Tendency to panic at the sight of blood',
      'Impatience when listening to patients describe symptoms',
      'Gossiping about members’ medical ailments',
    ],
    answer: 0,
    explanation: 'Medics require certified clinical skills, gentle demeanor, and rapid composure during crises.',
  },
];

const SECURITY_QUESTIONS: ExamQuestion[] = [
  {
    id: 'sec-q1',
    prompt: 'What is the primary mandate of the Security Department in URPN?',
    options: [
      'To intimidate members and visitors with aggressive behavior',
      'To safeguard worshippers, church premises, and ministry assets through professional vigilance and order',
      'To collect church offerings during service',
      'To preach the sermon when the pastor is late',
    ],
    answer: 1,
    explanation: 'The Security Department protects congregants, church premises, and assets through proactive vigilance.',
  },
  {
    id: 'sec-q2',
    prompt: 'What is situational awareness?',
    options: [
      'Sitting in a chair and looking at your phone during service',
      'Constantly observing the surroundings, identifying potential hazards, and staying alert to unusual activity',
      'Talking to worshippers while guarding a post',
      'Guessing what people are thinking',
    ],
    answer: 1,
    explanation: 'Situational awareness involves continuous observation, alertness, and recognizing potential security hazards.',
  },
  {
    id: 'sec-q3',
    prompt: 'How should a security team member handle an agitated or aggressive visitor at the gate?',
    options: [
      'Use verbal insults and physical force immediately',
      'Apply conflict de-escalation techniques: remain calm, speak respectfully, listen, and set firm boundaries',
      'Run away and leave the post unattended',
      'Challenge the individual to a physical fight',
    ],
    answer: 1,
    explanation: 'Security officers use de-escalation techniques: calm speech, active listening, and firm professionalism.',
  },
  {
    id: 'sec-q4',
    prompt: 'What is the procedure for vehicle access and parking management?',
    options: [
      'Allow vehicles to block emergency exits and hydrants',
      'Direct traffic systematically, maintain clear emergency evacuation routes, and monitor parked vehicles',
      'Leave gates wide open with no one monitoring entry',
      'Park personal cars in the middle of pedestrian walkways',
    ],
    answer: 1,
    explanation: 'Vehicles must be directed orderly, keeping emergency evacuation lanes clear and lots monitored.',
  },
  {
    id: 'sec-q5',
    prompt: 'In the event of a fire or facility emergency, what is security’s primary responsibility?',
    options: [
      'Be the first to run outside to save personal belongings',
      'Guide congregants calmly through designated emergency exits to the muster point without causing stampedes',
      'Lock all doors from the outside',
      'Wait for instructions on social media',
    ],
    answer: 1,
    explanation: 'Security leads calm, systematic crowd evacuations through designated routes to safe muster points.',
  },
  {
    id: 'sec-q6',
    prompt: 'How does the Security Department work with external law enforcement (Police, Civil Defense)?',
    options: [
      'Avoid speaking to law enforcement officers',
      'Collaborate proactively, coordinate emergency response, and maintain formal security partnerships',
      'Refuse government security protocols',
      'Hand over all church responsibilities to external officers',
    ],
    answer: 1,
    explanation: 'Security maintains cordial working relationships and coordination with state law enforcement agencies.',
  },
  {
    id: 'sec-q7',
    prompt: 'Who leads the Security Department in URPN?',
    options: [
      'The Head of Media',
      'The Chief Security Officer (CSO)',
      'The Music Pastor',
      'The Chief Usher',
    ],
    answer: 1,
    explanation: 'The Chief Security Officer (CSO) provides overall leadership and operational direction for security.',
  },
  {
    id: 'sec-q8',
    prompt: 'Which Key Performance Indicator (KPI) reflects security effectiveness?',
    options: [
      'Number of physical fights initiated by security personnel',
      'Zero security breaches, effective access control, peaceful conflict resolution, and rapid emergency response',
      'Number of cars turned away from church',
      'Speed of closing gates before service ends',
    ],
    answer: 1,
    explanation: 'Security success is evaluated by zero breaches, crowd safety, swift incident response, and facility integrity.',
  },
];

const PUBLICATIONS_QUESTIONS: ExamQuestion[] = [
  {
    id: 'pub-q1',
    prompt: 'What is the core function of the Publications (Library, Bookshop, Printing Press) and Academic Department?',
    options: [
      'To coordinate literature publishing, manage knowledge repositories/libraries, and foster academic development',
      'To sell secular newspapers outside the church',
      'To arrange stage lighting and sound cables',
      'To prepare food for church workers',
    ],
    answer: 0,
    explanation: 'The department manages publishing, book distribution, knowledge repositories, and member academic excellence.',
  },
  {
    id: 'pub-q2',
    prompt: 'How does the department ensure high quality in church publications and manuscripts?',
    options: [
      'Printing drafts without proofreading or editorial review',
      'Rigorous editing, typesetting, biblical vetting, and securing proper publication and copyright rights',
      'Copying external authors’ work without attribution',
      'Printing only in black and white regardless of format',
    ],
    answer: 1,
    explanation: 'Publications adhere to strict editorial scrutiny, typesetting excellence, and legal copyright standards.',
  },
  {
    id: 'pub-q3',
    prompt: 'What does the library function of this department oversee?',
    options: [
      'Lending books without tracking who borrowed them',
      'Managing both traditional physical and digital library resources and archiving ministry teachings',
      'Selling outdated textbooks to children',
      'Storing broken furniture and unused audio gear',
    ],
    answer: 1,
    explanation: 'The library serves as a knowledge repository managing physical and digital resources and historical archives.',
  },
  {
    id: 'pub-q4',
    prompt: 'What is expected regarding bookshop sales and literature proceeds?',
    options: [
      'Workers may pocket bookshop funds for personal expenses',
      'Meticulous financial accounting, accurate inventory logs, and complete integrity',
      'Giving away books without recording them in the system',
      'Hiding inventory from department leadership',
    ],
    answer: 1,
    explanation: 'Handling ministry literature and financial transactions demands complete financial integrity and logging.',
  },
  {
    id: 'pub-q5',
    prompt: 'What educational initiatives does the Academic wing of this department facilitate?',
    options: [
      'Tutoring sessions, academic workshops, scholarship information, and career guidance for members',
      'Replacing formal universities with church classes',
      'Writing examination answers for students',
      'Discouraging members from pursuing higher education',
    ],
    answer: 0,
    explanation: 'The academic wing organizes tutorials, career fairs, and scholarship opportunities to support member education.',
  },
  {
    id: 'pub-q6',
    prompt: 'How does the department preserve conference proceedings and field reports?',
    options: [
      'Discarding them once the conference ends',
      'Typesetting, documenting, and archiving reports and literature from seminaries and training programs',
      'Posting them anonymously on online forums',
      'Saving them on temporary flash drives without backups',
    ],
    answer: 1,
    explanation: 'Field reports and teaching transcripts are curated, typeset, and permanently archived as institutional knowledge.',
  },
  {
    id: 'pub-q7',
    prompt: 'What is a primary duty of the Head of Academic Department?',
    options: [
      'Designing academic programs, supervising library resources, and mentoring students towards excellence',
      'Directing church choir rehearsals',
      'Driving the church bus during morning pickups',
      'Operating the main camera during livestreaming',
    ],
    answer: 0,
    explanation: 'The Head of Academic Department provides strategic vision for educational advancement and resource creation.',
  },
  {
    id: 'pub-q8',
    prompt: 'Which Key Performance Indicator (KPI) measures success in the Academic & Publications Department?',
    options: [
      'Number of books thrown away each year',
      'Timely publication delivery, academic advancement among members, and vibrant library engagement',
      'Total weight of paper stored in the warehouse',
      'Cost of ink cartridges purchased',
    ],
    answer: 1,
    explanation: 'Success is reflected in high publishing standards, educational growth of members, and library utilization.',
  },
];

const DRAMA_QUESTIONS: ExamQuestion[] = [
  {
    id: 'drm-q1',
    prompt: 'What is the spiritual purpose of the Drama and Demonstration Department in URPN?',
    options: [
      'To entertain the congregation with theatrical comedy',
      'To minister the gospel through prophetic arts, biblical drama, and visual storytelling that convicts and heals',
      'To replace the preaching of the Word with fictional stories',
      'To train members for Hollywood movies',
    ],
    answer: 1,
    explanation: 'The Drama Department uses creative arts to illustrate biblical truths and reinforce ministry teachings.',
  },
  {
    id: 'drm-q2',
    prompt: 'How must drama scripts and themes be developed?',
    options: [
      'Adapted from ungodly worldly media without biblical filtering',
      'Anchored in Holy Scripture, culturally relevant, and aligned with ministry teachings and sermon themes',
      'Written without any prayer or spiritual consideration',
      'Constructed to make the actors look heroic rather than God',
    ],
    answer: 1,
    explanation: 'Scripts must be biblically sound, culturally relevant, and tightly aligned with the ministry\'s spiritual message.',
  },
  {
    id: 'drm-q3',
    prompt: 'What is required of drama team members during rehearsals?',
    options: [
      'Arriving whenever convenient and arguing with the director',
      'Punctuality, disciplined rehearsal attendance, script memorization, and humility',
      'Performing without reading the script beforehand',
      'Skipping dress rehearsals before major conferences',
    ],
    answer: 1,
    explanation: 'Drama members must exhibit punctuality, rehearsal discipline, memorization, and a teachable spirit.',
  },
  {
    id: 'drm-q4',
    prompt: 'How should stage props, costumes, and equipment be managed?',
    options: [
      'Left scattered on the stage floor after performances',
      'Properly cataloged, maintained, cleaned, and stored safely for future productions',
      'Taken home by actors for personal use',
      'Disposed of after a single use',
    ],
    answer: 1,
    explanation: 'Props, costumes, and stage gear must be carefully cataloged, kept in good repair, and securely stored.',
  },
  {
    id: 'drm-q5',
    prompt: 'How can drama be utilized as an effective evangelism tool?',
    options: [
      'Confining drama strictly to church auditoriums on Sunday mornings',
      'Deploying engaging street skits, campus dramas, and outreach plays to communicate the gospel to the unreached',
      'Using drama only during Christmas plays',
      'Charging admission fees for non-believers to hear the gospel',
    ],
    answer: 1,
    explanation: 'Drama acts as an evangelistic bridge in street outreaches, campus missions, and community events.',
  },
  {
    id: 'drm-q6',
    prompt: 'What is the posture of a Christian actor or demonstrator on stage?',
    options: [
      'Seeking personal applause, stardom, and admiration from the audience',
      'A consecrated vessel whose sole goal is to decrease so Christ and His truth may be exalted',
      'Showing off dramatic techniques regardless of audience connection',
      'Competing with other actors for the spotlight',
    ],
    answer: 1,
    explanation: 'Actors serve as consecrated ministers delivering heaven’s message, pointing the audience to Christ alone.',
  },
  {
    id: 'drm-q7',
    prompt: 'Who oversees script approvals, auditions, and overall creative direction in the department?',
    options: [
      'The Head of Drama and Demonstration Department (HOD)',
      'The Chief Protocol Officer',
      'The Head of Medical Department',
      'The Chief Security Officer',
    ],
    answer: 0,
    explanation: 'The Drama HOD oversees scriptwriting, directs rehearsals, manages production quality, and mentors cast.',
  },
  {
    id: 'drm-q8',
    prompt: 'Which Key Performance Indicator (KPI) evaluates the Drama Department?',
    options: [
      'Number of selfies taken in costume',
      'Spiritual and convicting impact of performances, team skill growth, and alignment with ministry vision',
      'Length of theatrical performances exceeding service schedules',
      'Volume of stage applause received',
    ],
    answer: 1,
    explanation: 'KPIs track spiritual and emotional impact on worshippers, performance quality, and message alignment.',
  },
];

const BANK: Record<CourseSlug, ExamDefinition> = {
  foundation: { questions: FOUNDATION_QUESTIONS },
  ministers: { questions: MINISTERS_QUESTIONS },
  pastors: { questions: PASTORS_QUESTIONS },
  aesthetics: { questions: AESTHETICS_QUESTIONS },
  pr: { questions: PR_QUESTIONS },
  protocol: { questions: PROTOCOL_QUESTIONS },
  ushering: { questions: USHERING_QUESTIONS },
  technical: { questions: TECHNICAL_QUESTIONS },
  media: { questions: MEDIA_QUESTIONS },
  choir: { questions: CHOIR_QUESTIONS },
  welfare: { questions: WELFARE_QUESTIONS },
  prayer: { questions: PRAYER_QUESTIONS },
  counseling: { questions: COUNSELING_QUESTIONS },
  transport: { questions: TRANSPORT_QUESTIONS },
  medical: { questions: MEDICAL_QUESTIONS },
  security: { questions: SECURITY_QUESTIONS },
  children: { questions: CHILDREN_QUESTIONS },
  publications: { questions: PUBLICATIONS_QUESTIONS },
  drama: { questions: DRAMA_QUESTIONS },
};

export function getExamDefinition(slug: CourseSlug): ExamDefinition {
  return BANK[slug];
}

export function getExamQuestionCount(slug: CourseSlug): number {
  return BANK[slug].questions.length;
}
