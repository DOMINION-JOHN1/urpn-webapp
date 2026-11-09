/**
 * URPN Training — course catalogue.
 *
 * This file is safe to import from client components: it contains no exam
 * answers and no secrets. Media files live in the private `media/` folder and
 * are only served through the authenticated streaming route
 * (`/api/portal/stream/[lessonId]`).
 *
 * To replace the demo media with real teaching, drop your files into `media/`
 * and update `media.file`, `media.durationSeconds`, and the poster path below.
 */

export type CourseSlug =
  | 'foundation'
  | 'ministers'
  | 'pastors'
  | 'media'
  | 'technical'
  | 'ushering'
  | 'protocol'
  | 'choir'
  | 'welfare'
  | 'children';

export type CourseTrack = 'workforce' | 'leadership';

export type LessonKind = 'video' | 'audio' | 'reading';

export interface LessonMedia {
  /** File name inside the private `media/` directory. Never a public URL. */
  file: string;
  mime: 'video/mp4' | 'audio/mp4';
  /** Authoritative duration used by the server to validate completion. */
  durationSeconds: number;
  /** Public poster image (safe: it is only a still frame). */
  poster?: string;
}

export interface Lesson {
  id: string;
  title: string;
  kind: LessonKind;
  summary: string;
  /** Reading time, or media length rounded for display. */
  estimatedMinutes: number;
  media?: LessonMedia;
  scripture?: { reference: string; text: string };
  body?: string[];
  keyPoints?: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  week: number;
  summary: string;
  lessons: Lesson[];
}

export interface Course {
  slug: CourseSlug;
  code: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  audience: string;
  /** Which portal catalog this course belongs to. */
  track: CourseTrack;
  /** Conditions a person must acknowledge before joining this department. */
  conditions: string[];
  /** Optional icon key used by the department UI. */
  icon?: string;
  weeks: number;
  outcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
  exam: {
    durationMinutes: number;
    passMark: number;
    questionCount: number;
  };
}

const FOUNDATION: Course = {
  slug: 'foundation',
  code: 'URPN 101',
  title: 'URPN Foundation Class',
  shortTitle: 'Foundation',
  tagline: 'The mandate, the altar, and your place in it.',
  description:
    'Every worker begins here. In four weeks you will meet the apostolic mandate of URPN, learn how to keep a personal altar burning, settle your identity before your assignment, and discover how to hear God for the sphere He has given you.',
  audience: 'Every new worker, volunteer, and member of the URPN family.',
  track: 'leadership',
  conditions: [],
  weeks: 4,
  outcomes: [
    'Explain the apostolic mandate of URPN in your own words.',
    'Build and sustain a daily personal altar of prayer and the Word.',
    'Serve from identity rather than from a need to be seen.',
    'Recognise God’s voice and respond faithfully in your sphere.',
  ],
  prerequisites: ['A willing heart', 'A Bible', 'About 30 minutes per week'],
  modules: [
    {
      id: 'foundation-m1',
      title: 'The Mandate',
      week: 1,
      summary: 'Why URPN exists, and the assignment you are stepping into.',
      lessons: [
        {
          id: 'foundation-welcome',
          title: 'Welcome to the Foundation Class',
          kind: 'video',
          summary: 'A short orientation from the URPN training desk.',
          estimatedMinutes: 1,
          media: {
            file: 'foundation-welcome.mp4',
            mime: 'video/mp4',
            durationSeconds: 26,
            poster: '/posters/foundation-welcome.jpg',
          },
          keyPoints: [
            'This class is a doorway, not a certificate mill.',
            'You will be formed by the altar before you are deployed.',
            'Finish every lesson before you attempt the final exam.',
          ],
        },
        {
          id: 'foundation-mandate',
          title: 'The mandate you are joining',
          kind: 'reading',
          summary: 'Restoring people, families, spheres, and territories to their original ordination.',
          estimatedMinutes: 6,
          scripture: {
            reference: 'Jeremiah 1:10',
            text: 'See, I have this day set thee over the nations and over the kingdoms, to root out, and to pull down, and to destroy, and to throw down, to build, and to plant.',
          },
          body: [
            'URPN is not a programme with a prayer meeting attached. It is a prophetic altar with a commission. The mandate we carry is simple to say and costly to live: people, families, spheres, and territories must be restored to their original divine ordination, and then they must learn to operate from that standpoint. Restoration is not merely repair. It is a return to blueprint.',
            'That word — blueprint — shapes everything we do. Before a house is built, the builder consults a design. Before a life is restored, heaven consults a design. The apostolic mandate is the work of recovering God’s original design for a person, a family, a marketplace, a city, and seeing that design expressed in real life. This is why we pray, why we teach, and why we train workers who can carry the same burden in their own spheres.',
            'URPN stands in the spirit of Elijah: a voice in the wilderness, a people who turn hearts back to the Father, and a generation prepared for the Lord. We are not called to decorate the old order. We are called to prepare a people who look like God and who carry His original intention into every place they are planted.',
          ],
          keyPoints: [
            'Restoration is a return to God’s blueprint, not a cosmetic repair.',
            'The mandate is carried by people, not by programmes.',
            'Every sphere — family, market, government, education, church — is in view.',
          ],
        },
      ],
    },
    {
      id: 'foundation-m2',
      title: 'The Altar',
      week: 2,
      summary: 'Prayer is the engine room. Learn to keep the fire burning.',
      lessons: [
        {
          id: 'foundation-altar',
          title: 'Building a personal altar',
          kind: 'audio',
          summary: 'A practical teaching on daily prayer that outlasts feeling.',
          estimatedMinutes: 1,
          media: {
            file: 'foundation-altar.m4a',
            mime: 'audio/mp4',
            durationSeconds: 30,
          },
          scripture: {
            reference: 'Leviticus 6:13',
            text: 'The fire shall ever be burning upon the altar; it shall never go out.',
          },
          keyPoints: [
            'An altar is a place of exchange: your life laid down, His fire received.',
            'Consistency matters more than length.',
            'The private altar protects the public assignment.',
          ],
        },
        {
          id: 'foundation-intercession',
          title: 'Intercession that shifts territories',
          kind: 'reading',
          summary: 'Standing in the gap with the burden of God, not the anxiety of man.',
          estimatedMinutes: 7,
          scripture: {
            reference: 'Ezekiel 22:30',
            text: 'And I sought for a man among them, that should make up the hedge, and stand in the gap before me for the land, that I should not destroy it: but I found none.',
          },
          body: [
            'Intercession is not prayer with a louder voice. It is prayer that carries a burden not your own. The intercessor stands between heaven and a people, holding the word of God in one hand and the need of the people in the other, and refuses to let go until mercy answers.',
            'URPN is a prayer network before it is anything else. The territories we are sent to are not moved by strategy alone. They are moved by men and women who have learnt to wait, to travail, and to pray the will of God until something shifts in the spirit realm before it shifts in the street.',
            'Practical intercession begins with listening. Ask the Spirit what to pray, then pray that. It grows through the Word: when Scripture fills your mouth, your prayers carry authority because you are repeating the settled will of God. It is sustained by a clean heart: unforgiveness and hidden sin clog the channel. And it is sharpened in the corporate altar, where the prayers of the saints rise together as one voice.',
            'Do not despise the quiet Tuesday prayer meeting. The greatest territorial breakthroughs are often birthed in rooms where no camera is present and only heaven is watching.',
          ],
          keyPoints: [
            'Intercession carries God’s burden, not personal anxiety.',
            'Pray the Word; it is the settled will of God.',
            'Corporate agreement multiplies the impact of private prayer.',
          ],
        },
      ],
    },
    {
      id: 'foundation-m3',
      title: 'The Worker',
      week: 3,
      summary: 'Who you are before what you do.',
      lessons: [
        {
          id: 'foundation-identity',
          title: 'Identity before assignment',
          kind: 'reading',
          summary: 'Serving from sonship rather than striving for significance.',
          estimatedMinutes: 5,
          scripture: {
            reference: 'Luke 3:22',
            text: 'Thou art my beloved Son; in thee I am well pleased.',
          },
          body: [
            'Before Jesus healed anyone, taught anyone, or walked toward the cross, the Father spoke over Him: this is my beloved Son, in whom I am well pleased. The voice of identity preceded the voice of assignment. If you reverse the order, service becomes a performance and ministry becomes a stage.',
            'Many workers burn out not because the work is too heavy, but because they are trying to earn a place that was already given to them. URPN does not need you to prove your worth. It needs you to know whose you are, then serve from the overflow of that knowledge.',
            'Identity also guards you in obscurity. When no one applauds the sound desk, the arrangement of chairs, or the long drive to a village prayer meeting, the son still shows up, because he is not performing for an audience. He is responding to a Father.',
            'Take a moment before each assignment and say it out loud: I am a beloved child of God. This work does not define me. It flows from me. That single sentence will protect you from more ministry wounds than any policy could.',
          ],
          keyPoints: [
            'Identity precedes assignment in the heart of God.',
            'Serve from sonship, never from a need to prove yourself.',
            'Obscurity is where the hidden man is formed.',
          ],
        },
        {
          id: 'foundation-serving',
          title: 'Serving with a clean heart',
          kind: 'video',
          summary: 'The posture that keeps a worker usable.',
          estimatedMinutes: 1,
          media: {
            file: 'foundation-serving.mp4',
            mime: 'video/mp4',
            durationSeconds: 25,
            poster: '/posters/foundation-serving.jpg',
          },
          keyPoints: [
            'Serve people, not the platform.',
            'Forgive quickly; bitterness is a closed door.',
            'Keep short accounts with God and with people.',
          ],
        },
      ],
    },
    {
      id: 'foundation-m4',
      title: 'The Assignment',
      week: 4,
      summary: 'Hearing God for your sphere and staying faithful in it.',
      lessons: [
        {
          id: 'foundation-hearing',
          title: 'Hearing God for your sphere',
          kind: 'audio',
          summary: 'How God speaks through Scripture, counsel, and the inward witness.',
          estimatedMinutes: 1,
          media: {
            file: 'foundation-hearing.m4a',
            mime: 'audio/mp4',
            durationSeconds: 28,
          },
          scripture: {
            reference: 'John 10:27',
            text: 'My sheep hear my voice, and I know them, and they follow me.',
          },
          keyPoints: [
            'God speaks; the problem is usually our noise, not His silence.',
            'Test every impression against Scripture and wise counsel.',
            'Obedience to what you heard is the proof of the hearing.',
          ],
        },
        {
          id: 'foundation-faithful',
          title: 'Faithful in the small things',
          kind: 'reading',
          summary: 'The ministry you steward today is the training ground for tomorrow.',
          estimatedMinutes: 5,
          scripture: {
            reference: 'Luke 16:10',
            text: 'He that is faithful in that which is least is faithful also in much.',
          },
          body: [
            'There is no shortcut to provenness. God does not promote a person because they are gifted; He promotes them because they have been found faithful with what is already in their hands. The small room is a classroom, not a punishment.',
            'In URPN, faithfulness looks ordinary: arriving early, keeping your word, praying when no one is looking, caring for the person no one else notices, finishing the task you were given even when it grew boring. These are the things that build the inner man.',
            'The examination you are about to take is only a doorway. The real exam is what you do with what you have learned after the certificate is framed. Will you keep the altar burning? Will you serve the family you have been placed in? Will you stay humble when doors begin to open?',
            'Finish well. The worker who is faithful in the hidden place is the worker heaven can trust with the open door.',
          ],
          keyPoints: [
            'Faithfulness is the ladder to greater responsibility.',
            'The ordinary task is often the hidden test.',
            'A certificate means the training is complete, not the learning.',
          ],
        },
      ],
    },
  ],
  exam: { durationMinutes: 25, passMark: 70, questionCount: 12 },
};

const MINISTERS: Course = {
  slug: 'ministers',
  code: 'URPN 201',
  title: 'URPN Ministers Training',
  shortTitle: 'Ministers',
  tagline: 'Carry the word, guard the altar, serve the people.',
  description:
    'A focused track for ministers, lay leaders, and anyone who handles the word and the altar. Learn to carry the mantle with character, preach with fire and order, care for wounded people, and lead the corporate altar without losing the fear of God.',
  audience: 'Ministers, lay leaders, house-fellowship leaders, and prayer captains.',
  track: 'leadership',
  conditions: [],
  weeks: 6,
  outcomes: [
    'Hold together character and gifting in ministry.',
    'Handle Scripture with truth, humility, and context.',
    'Shepherd wounded people with confidentiality and wisdom.',
    'Lead a corporate altar with order, fire, and prophetic accountability.',
  ],
  prerequisites: ['Completed URPN Foundation Class', 'A proven local assignment'],
  modules: [
    {
      id: 'ministers-m1',
      title: 'The Minister’s Call',
      week: 1,
      summary: 'The mantle is a responsibility before it is a title.',
      lessons: [
        {
          id: 'ministers-mantle',
          title: 'The weight of the mantle',
          kind: 'video',
          summary: 'What it means to carry a ministry assignment from God.',
          estimatedMinutes: 1,
          media: {
            file: 'ministers-mantle.mp4',
            mime: 'video/mp4',
            durationSeconds: 29,
            poster: '/posters/ministers-mantle.jpg',
          },
          keyPoints: [
            'The mantle is given, not seized.',
            'Elisha asked for a double portion — and paid the price of following.',
            'A mantle multiplies responsibility and accountability.',
          ],
        },
        {
          id: 'ministers-character',
          title: 'Character before charisma',
          kind: 'reading',
          summary: 'Why the hidden life holds the public ministry together.',
          estimatedMinutes: 6,
          scripture: {
            reference: '1 Samuel 16:7',
            text: 'For the LORD seeth not as man seeth; for man looketh on the outward appearance, but the LORD looketh on the heart.',
          },
          body: [
            'Ministry can amplify a gift very quickly. It can also amplify a flaw. The same microphone that carries a beautiful word can carry an unchecked temper, a need for approval, or a private compromise into a hundred lives before anyone notices. This is why God searches the heart before He entrusts the platform.',
            'Character is not the absence of personality. It is the presence of integrity under pressure: the person you are when no one is clapping, the promise you keep when it costs you, the way you speak about people who cannot help your career, the patience you show when a meeting runs late and your plan is disrupted.',
            'Build your ministry from the inside out. Keep a short account with God. Invite correction from people who are not afraid to tell you the truth. Guard your marriage, your family, and your secret hours of prayer. A ministry will eventually collapse or mature at the level of the man behind it.',
            'The world has enough gifted people. It is desperate for trustworthy ones. Choose to be trustworthy first; ask God for the gifts second.',
          ],
          keyPoints: [
            'Gifts open doors; character decides how long you stay in the room.',
            'Private integrity is the foundation of public authority.',
            'Submit to relationships that can correct you.',
          ],
        },
      ],
    },
    {
      id: 'ministers-m2',
      title: 'The Word and the Spirit',
      week: 2,
      summary: 'Preaching that carries both fire and truth.',
      lessons: [
        {
          id: 'ministers-word',
          title: 'Preaching with fire and order',
          kind: 'audio',
          summary: 'Preparing a message that is faithful to the text and alive to the Spirit.',
          estimatedMinutes: 1,
          media: {
            file: 'ministers-word.m4a',
            mime: 'audio/mp4',
            durationSeconds: 25,
          },
          scripture: {
            reference: '1 Corinthians 2:4',
            text: 'And my speech and my preaching was not with enticing words of man’s wisdom, but in demonstration of the Spirit and of power.',
          },
          keyPoints: [
            'The text is the anchor; the Spirit is the wind.',
            'Preparation is an act of love for the hearers.',
            'Order does not quench fire; it gives fire a wick.',
          ],
        },
        {
          id: 'ministers-dividing',
          title: 'Rightly dividing the word',
          kind: 'reading',
          summary: 'Context, covenant, and the discipline of not making the Bible say more than it says.',
          estimatedMinutes: 7,
          scripture: {
            reference: '2 Timothy 2:15',
            text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.',
          },
          body: [
            'A text taken out of context can be made to say almost anything, and sincerity is not a defence against error. The minister owes the people the meaning of the passage before the application of the passage. Read the verses around it. Ask who is speaking, to whom, when, and why. Notice the covenant setting and the genre of the writing.',
            'Rightly dividing the word also means distinguishing between the promises of Scripture and our personal preferences. Not every Bible verse is about me today, and not every strong impression is Scripture. The Spirit never contradicts the Word He inspired.',
            'When you preach, say what the text says, show how it points to Christ, and then call people to a response that the text actually warrants. Resist the pressure to manufacture a dramatic ending. A clear word, simply delivered, carries more lasting weight than an impressive performance.',
            'Study the Word until it studies you. The goal is not a clever sermon; it is a transformed hearer — and that transformation begins with the preacher.',
          ],
          keyPoints: [
            'Context governs meaning; application follows meaning.',
            'The Spirit never contradicts the Scripture.',
            'Aim for transformation, not applause.',
          ],
        },
      ],
    },
    {
      id: 'ministers-m3',
      title: 'Pastoral Care',
      week: 3,
      summary: 'Handling people with the tenderness of Christ.',
      lessons: [
        {
          id: 'ministers-wounded',
          title: 'Shepherding the wounded',
          kind: 'reading',
          summary: 'How to hold someone’s pain without trying to fix it in five minutes.',
          estimatedMinutes: 6,
          scripture: {
            reference: 'Psalm 34:18',
            text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.',
          },
          body: [
            'Wounded people are not projects. They are image-bearers carrying pain that may be older than the moment they walked through the door. The first ministry of the shepherd is not a solution; it is presence. Sit with them. Listen without rehearsing your reply. Let them finish the sentence.',
            'Resist the urge to explain God’s reasons for their suffering. Job’s friends were most useful in their silence. When words are needed, speak of the Father’s nearness, not the neatness of a formula. “The Lord is close to the broken-hearted” is a better first sentence than a lecture about their attitude.',
            'Pray simply and concretely. Ask permission before laying on hands. Follow up in the following days; most people remember who checked on them far longer than what was said. And where the wound involves abuse, danger, or a legal matter, refer them to a qualified professional immediately. A shepherd is not required to be an expert in everything; a shepherd is required to be wise.',
            'Above all, point them to Jesus, not to yourself. The goal of pastoral care is not dependence on you. It is connection to the Shepherd who will never leave them.',
          ],
          keyPoints: [
            'Presence before solutions.',
            'Listen more than you explain.',
            'Refer promptly when safety or expertise is at stake.',
          ],
        },
        {
          id: 'ministers-confidentiality',
          title: 'Confidentiality and counsel',
          kind: 'reading',
          summary: 'The sacred trust of a private conversation.',
          estimatedMinutes: 5,
          scripture: {
            reference: 'Proverbs 11:13',
            text: 'A talebearer revealeth secrets: but he that is of a faithful spirit concealeth the matter.',
          },
          body: [
            'When someone opens their life to you, they are handing you a fragile gift. Confidentiality is not optional politeness; it is a form of love. A minister who repeats what was shared in confidence destroys trust and disqualifies the very ground on which future ministry depends.',
            'Keep the circle of knowledge as small as the situation allows. Share details only with those who need them, and never as prayer-point gossip. If you must seek counsel from a senior leader, say so in advance and keep the identity protected where possible.',
            'There are clear limits to confidentiality. If someone is in danger, if a child is at risk, if there is a threat to life, or if a legal requirement applies, you must act. Say this plainly at the start so no one is surprised later. Wisdom holds both tenderness and accountability.',
            'A good record-keeping habit helps too: brief notes, stored securely, available only to the appropriate pastoral team. Trust is built in the ordinary details — the closed door, the kept promise, the follow-up that does not become a story.',
          ],
          keyPoints: [
            'Confidentiality is an act of love and a condition of trust.',
            'Share only what is necessary with only those who need it.',
            'State the safeguarding limits clearly and early.',
          ],
        },
      ],
    },
    {
      id: 'ministers-m4',
      title: 'The Ministry of the Altar',
      week: 4,
      summary: 'Leading a room into the presence of God.',
      lessons: [
        {
          id: 'ministers-altar',
          title: 'Leading a corporate altar',
          kind: 'video',
          summary: 'Practical rhythms for governing a prayer meeting.',
          estimatedMinutes: 1,
          media: {
            file: 'ministers-altar.mp4',
            mime: 'video/mp4',
            durationSeconds: 27,
            poster: '/posters/ministers-altar.jpg',
          },
          keyPoints: [
            'Prepare the altar before you lead it.',
            'Give clear direction and leave room for silence.',
            'Protect the meeting from performance and confusion.',
          ],
        },
        {
          id: 'ministers-prophetic',
          title: 'Prophetic protocol',
          kind: 'audio',
          summary: 'Stewarding revelation with humility, order, and accountability.',
          estimatedMinutes: 1,
          media: {
            file: 'ministers-prophetic.m4a',
            mime: 'audio/mp4',
            durationSeconds: 27,
          },
          scripture: {
            reference: '1 Corinthians 14:32',
            text: 'And the spirits of the prophets are subject to the prophets.',
          },
          keyPoints: [
            'Revelation is stewarded, not performed.',
            'Test every word; love never uses a prophecy to control.',
            'Accountability protects both the prophet and the people.',
          ],
        },
      ],
    },
  ],
  exam: { durationMinutes: 30, passMark: 75, questionCount: 12 },
};

const PASTORS: Course = {
  slug: 'pastors',
  code: 'URPN 301',
  title: 'URPN Pastors Training',
  shortTitle: 'Pastors',
  tagline: 'Shepherd the flock, steward the vision, finish well.',
  description:
    'For pastors and overseers carrying the weight of a congregation. This track strengthens the pastor’s heart, clarifies vision and governance, builds healthy teams, and guards the private altar that keeps the public ministry alive.',
  audience: 'Pastors, overseers, and senior leaders.',
  track: 'leadership',
  conditions: [],
  weeks: 8,
  outcomes: [
    'Lead a congregation from the place of intercession and the Word.',
    'Translate vision into structures that serve people rather than systems.',
    'Build healthy teams with clear delegated authority.',
    'Protect your inner life and raise leaders who can finish well.',
  ],
  prerequisites: ['Completed URPN Foundation and Ministers tracks', 'An active pastoral assignment'],
  modules: [
    {
      id: 'pastors-m1',
      title: 'The Pastor’s Heart',
      week: 1,
      summary: 'A shepherd’s heart is formed in secret before it is tested in public.',
      lessons: [
        {
          id: 'pastors-heart',
          title: 'A shepherd after God’s heart',
          kind: 'video',
          summary: 'The difference between running a church and shepherding a people.',
          estimatedMinutes: 1,
          media: {
            file: 'pastors-heart.mp4',
            mime: 'video/mp4',
            durationSeconds: 24,
            poster: '/posters/pastors-heart.jpg',
          },
          keyPoints: [
            'The flock belongs to God; the pastor is a steward.',
            'Shepherds know the sheep by name.',
            'A shepherd’s authority is measured by his service.',
          ],
        },
        {
          id: 'pastors-intercessor',
          title: 'The pastor as intercessor',
          kind: 'reading',
          summary: 'The congregation is shaped by the prayer life of its leader.',
          estimatedMinutes: 6,
          scripture: {
            reference: 'Colossians 1:9',
            text: 'For this cause we also, since the day we heard it, do not cease to pray for you.',
          },
          body: [
            'A pastor can outsource many tasks, but not intercession. The prayer life of the shepherd sets the temperature of the flock. If the pastor prays only when there is a crisis, the church learns to treat God as an emergency service rather than a Father.',
            'Paul’s prayers for the churches are a model: he did not merely pray for their comfort; he prayed for their knowledge of God’s will, their walk worthy of the Lord, their fruitfulness, and their strength. Pray for the people you lead beyond what they ask you to pray for. Pray for the hidden things the crowd will never see.',
            'The pastoral prayer also needs to be a listening prayer. Ask the Spirit what He is doing in the congregation before you ask Him to bless what you have planned. Vision that is born in prayer has a different quality than vision borrowed from the internet.',
            'And remember the altar is not only a private discipline; it is a shared inheritance. Teach the people to pray by praying with them. A praying pastor will eventually produce a praying church.',
          ],
          keyPoints: [
            'The shepherd’s prayer life shapes the flock’s spiritual temperature.',
            'Pray for the things the congregation cannot articulate.',
            'Vision should be birthed in listening, not copied.',
          ],
        },
      ],
    },
    {
      id: 'pastors-m2',
      title: 'Vision and Governance',
      week: 2,
      summary: 'Structure should serve the vision, not replace it.',
      lessons: [
        {
          id: 'pastors-vision',
          title: 'Stewarding a God-given vision',
          kind: 'reading',
          summary: 'Keeping a long obedience in the same direction.',
          estimatedMinutes: 6,
          scripture: {
            reference: 'Habakkuk 2:2',
            text: 'Write the vision, and make it plain upon tables, that he may run that readeth it.',
          },
          body: [
            'A God-given vision is usually larger than one person’s lifetime and simpler than the plans we build around it. The pastor’s task is not to manufacture a vision that impresses people, but to discern what God is already doing and to make it plain enough for others to run with it.',
            'Write it down. Reduce it to a sentence a child could repeat. Then measure every activity against it. A church can be busy for years without moving toward the thing God actually called it to do. The discipline of vision is the discipline of saying no to good things so that the God-thing can live.',
            'Vision also needs guardrails. Put the vision in the hands of a team, not only in the memory of the pastor. Build governance that outlives your energy: clear roles, honest budgets, documented decisions, and a succession plan that does not depend on a crisis. Structure is not unspiritual. Structure is love for the people who will carry the vision after you.',
            'Finally, keep the vision submitted to the One who gave it. The moment a vision becomes about the pastor’s name, it has already begun to die. Hold it open-handed, and let God correct the map.',
          ],
          keyPoints: [
            'Make the vision plain enough for others to carry.',
            'Say no to good things that do not serve the God-thing.',
            'Governance protects the vision beyond one leader.',
          ],
        },
        {
          id: 'pastors-structure',
          title: 'Structure without losing fire',
          kind: 'audio',
          summary: 'Why organisation is not the enemy of revival.',
          estimatedMinutes: 1,
          media: {
            file: 'pastors-structure.m4a',
            mime: 'audio/mp4',
            durationSeconds: 28,
          },
          scripture: {
            reference: 'Acts 6:3',
            text: 'Wherefore, brethren, look ye out among you seven men of honest report, full of the Holy Ghost and wisdom, whom we may appoint over this business.',
          },
          keyPoints: [
            'The early church solved growth problems with structure.',
            'Delegate responsibility without delegating care.',
            'Fire and order are not enemies; they are partners.',
          ],
        },
      ],
    },
    {
      id: 'pastors-m3',
      title: 'People and Culture',
      week: 3,
      summary: 'Building a community where people can heal and grow.',
      lessons: [
        {
          id: 'pastors-restoring',
          title: 'Restoring people, not managing them',
          kind: 'reading',
          summary: 'The pastoral calling is restoration, not crowd control.',
          estimatedMinutes: 6,
          scripture: {
            reference: 'Galatians 6:1',
            text: 'Brethren, if a man be overtaken in a fault, ye which are spiritual, restore such an one in the spirit of meekness.',
          },
          body: [
            'It is possible to build a large, well-managed church where people are still not being restored. Attendance can grow while hearts remain untouched. The pastoral question is not only “how many?” but “who is becoming whole?”',
            'Restoration is slow and unglamorous. It looks like walking with someone through a relapse, sitting with a marriage in crisis, giving a second chance without pretending the first one did not happen. It requires the fruit of the Spirit more than the gifts of the Spirit.',
            'It also requires boundaries. Meekness is not the absence of wisdom. A pastor who never says no, never confronts, and never allows consequences will eventually burn out and leave the flock unprotected. Restore in gentleness, but restore in truth.',
            'A restorative culture is caught more than taught. When the leaders speak about people with dignity, forgive quickly, and tell the truth without cruelty, the congregation learns a new way of being human together.',
          ],
          keyPoints: [
            'Growth in numbers is not the same as growth in wholeness.',
            'Restoration requires both gentleness and boundaries.',
            'Culture is shaped by how leaders speak about people.',
          ],
        },
        {
          id: 'pastors-teams',
          title: 'Healthy teams and delegated authority',
          kind: 'reading',
          summary: 'Multiplying leadership without multiplying confusion.',
          estimatedMinutes: 5,
          scripture: {
            reference: 'Exodus 18:21',
            text: 'Moreover thou shalt provide out of all the people able men, such as fear God, men of truth, hating covetousness; and place such over them.',
          },
          body: [
            'Moses tried to carry a nation’s disputes alone until his father-in-law asked a simple question: why do you sit alone? The answer was not humility; it was a bottleneck. Delegation is a pastoral act. It protects the leader, empowers the people, and releases the church to grow.',
            'Delegate authority, not just tasks. Give people a clear scope, the resources to fulfil it, and the permission to make decisions inside that scope. Then resist the urge to take it back the moment something is not done your way. A leader who micromanages is not building leaders; they are building assistants.',
            'Build teams around character and calling, not only competence. Look for people who fear God, tell the truth, and hate dishonest gain. Competence can be trained; integrity must be present. And make room for the next generation to fail safely while the cost is still small.',
            'Finally, protect the team from the pressure to be everything. Rest is part of the assignment. A church led by exhausted leaders will eventually pass that exhaustion on to the people.',
          ],
          keyPoints: [
            'Delegation protects the leader and empowers the church.',
            'Give authority with scope, resources, and permission.',
            'Hire and appoint for character first, competence second.',
          ],
        },
      ],
    },
    {
      id: 'pastors-m4',
      title: 'Legacy',
      week: 4,
      summary: 'Finishing well and raising those who come after.',
      lessons: [
        {
          id: 'pastors-legacy',
          title: 'Raising the next generation',
          kind: 'video',
          summary: 'The leader’s greatest work may be the one who replaces them.',
          estimatedMinutes: 1,
          media: {
            file: 'pastors-legacy.mp4',
            mime: 'video/mp4',
            durationSeconds: 26,
            poster: '/posters/pastors-legacy.jpg',
          },
          keyPoints: [
            'Legacy is built by intentional transmission, not by accident.',
            'Give the next generation real responsibility, not only titles.',
            'A secure leader celebrates those who surpass him.',
          ],
        },
        {
          id: 'pastors-finish',
          title: 'Finishing well',
          kind: 'audio',
          summary: 'The grace to end the race with your integrity intact.',
          estimatedMinutes: 1,
          media: {
            file: 'pastors-finish.m4a',
            mime: 'audio/mp4',
            durationSeconds: 28,
          },
          scripture: {
            reference: '2 Timothy 4:7',
            text: 'I have fought a good fight, I have finished my course, I have kept the faith.',
          },
          keyPoints: [
            'The finish line is part of the race.',
            'Guard the secret place in seasons of success.',
            'Leave the ministry healthier than you met it.',
          ],
        },
        {
          id: 'pastors-private-altar',
          title: 'The pastor’s private altar',
          kind: 'reading',
          summary: 'The secret place that keeps the public ministry honest.',
          estimatedMinutes: 5,
          scripture: {
            reference: 'Matthew 6:6',
            text: 'But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret.',
          },
          body: [
            'The most important room in a pastor’s life is the one nobody sees. Not the pulpit, not the boardroom, not the platform where the microphone is handed over. The private altar is where the pastor is simply a son, without a title to protect or a crowd to impress.',
            'Success is subtle. It can slowly replace dependence with expertise, listening with planning, and prayer with preparation. A pastor can preach about the secret place while neglecting it. The remedy is not another programme; it is a return to the door that shuts out the noise.',
            'Guard the Sabbath of your soul. Take a day that is truly unhurried. Keep people around you who knew you before the title and who love you enough to ask hard questions. Confess your own need. Let the Father minister to you before you stand to minister to others.',
            'One day the microphone will be passed on. What will remain is the person you became in the secret place. Build that person carefully. It is the only legacy that cannot be taken from you.',
          ],
          keyPoints: [
            'The hidden life sustains the public ministry.',
            'Success can quietly replace dependence with expertise.',
            'Build relationships that knew you before the title.',
          ],
        },
      ],
    },
  ],
  exam: { durationMinutes: 35, passMark: 80, questionCount: 12 },
};


// ===========================================================================
// WORKFORCE DEPARTMENTS — open to anyone via the Join the Workforce flow.
// Each department is a short audio course followed by a one-attempt exam and
// a certificate. Conditions are acknowledged before enrollment.
// ===========================================================================

const audioLesson = (
  id: string,
  title: string,
  file: string,
  summary: string,
  keyPoints: string[],
  scripture?: { reference: string; text: string }
): Lesson => ({
  id,
  title,
  kind: 'audio',
  summary,
  estimatedMinutes: 1,
  media: { file, mime: 'audio/mp4', durationSeconds: 45 },
  keyPoints,
  scripture,
});

const departmentModule = (
  id: string,
  title: string,
  week: number,
  summary: string,
  lesson: Lesson
): CourseModule => ({
  id,
  title,
  week,
  summary,
  lessons: [lesson],
});

const MEDIA: Course = {
  slug: 'media',
  code: 'URPN MEDIA',
  title: 'URPN Media Department',
  shortTitle: 'Media',
  icon: 'camera',
  track: 'workforce',
  tagline: 'Tell the story with truth, excellence, and care.',
  description:
    'The media desk is the digital witness of the house. Learn to capture services with purpose, protect the stories you handle, and publish in a way that honours God and serves people.',
  audience: 'Members called to photography, video, livestream, design, and social media.',
  weeks: 3,
  outcomes: [
    'Frame and capture a service with intention.',
    'Handle people and stories with consent and care.',
    'Publish accurately and consistently across channels.',
    'Serve the message instead of chasing a personal brand.',
  ],
  conditions: [
    'Born again and committed to the URPN vision.',
    'A member of URPN for at least 3 months.',
    'Own or have reliable access to a smartphone or camera.',
    'Available for Sunday service and at least one media rehearsal each month.',
    'Willing to be corrected, trained, and held to confidentiality.',
    'Able to represent the house with a teachable spirit.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'media-m1',
      'The Media Witness',
      1,
      'Why the media desk exists and how to carry it.',
      audioLesson(
        'media-01',
        'Welcome to the Media team',
        'media-01.m4a',
        'The heart, posture, and responsibility of the media desk.',
        [
          'You serve the message, not a personal brand.',
          'Arrive early, know the run of service, and stay alert.',
          'Protect the privacy of the people you film.',
        ],
        { reference: 'Colossians 3:23', text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.' }
      )
    ),
    departmentModule(
      'media-m2',
      'Capture with Purpose',
      2,
      'Practical camera and coverage discipline.',
      audioLesson(
        'media-02',
        'Shooting with purpose',
        'media-02.m4a',
        'How to frame, cover, and protect a moment.',
        [
          'Check light, background, and stability before recording.',
          'Capture wide, medium, and close coverage.',
          'Ask permission before filming sensitive moments.',
        ]
      )
    ),
    departmentModule(
      'media-m3',
      'Publish with Care',
      3,
      'Social media, captions, and pastoral responsibility.',
      audioLesson(
        'media-03',
        'Publishing with care',
        'media-03.m4a',
        'The pastoral weight of what the church posts.',
        [
          'Check names, spellings, details, and consent before posting.',
          'Keep captions short, true, and free of gossip or clickbait.',
          'When unsure, ask a leader before publishing.',
        ],
        { reference: '1 Peter 4:11', text: 'If any man speak, let him speak as the oracles of God.' }
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const TECHNICAL: Course = {
  slug: 'technical',
  code: 'URPN TECH',
  title: 'URPN Technical Department',
  shortTitle: 'Technical',
  icon: 'sliders',
  track: 'workforce',
  tagline: 'Quiet preparation. Clear sound. Safe power.',
  description:
    'Technical service is mostly invisible when it is done well. Learn the discipline of sound, lighting, livestream, and safety so that nothing stands between the congregation and the Word.',
  audience: 'Members called to sound, lighting, power, livestream, and projection.',
  weeks: 3,
  outcomes: [
    'Prepare and test a service before the room fills.',
    'Run clear, feedback-free sound that serves the Word.',
    'Handle power, lighting, and cables safely.',
    'Respond calmly to a technical failure.',
  ],
  conditions: [
    'A member of URPN for at least 3 months.',
    'A basic interest in sound, power, lighting, or livestream.',
    'Available for technical rehearsal and Sunday service.',
    'Physically able to handle cables and basic equipment safely.',
    'Committed to safety, punctuality, and teamwork.',
    'Willing to serve without needing to be seen.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'technical-m1',
      'The Invisible Ministry',
      1,
      'The posture behind every working cable and channel.',
      audioLesson(
        'technical-01',
        'The invisible ministry',
        'technical-01.m4a',
        'Why preparation is the real technical skill.',
        [
          'Test every cable, mic, battery, and channel before the room fills.',
          'Know the order of service and the backup plan.',
          'Excellence here is quiet, prepared, and dependable.',
        ]
      )
    ),
    departmentModule(
      'technical-m2',
      'Sound that Serves',
      2,
      'Gain, feedback, microphones, and balance.',
      audioLesson(
        'technical-02',
        'Sound that serves the Word',
        'technical-02.m4a',
        'Making every word heard without fighting the room.',
        [
          'Set gain before the room fills and keep microphones close.',
          'Label channels, mute unused mics, and watch the levels.',
          'Listen from the congregation, not only from the booth.',
        ]
      )
    ),
    departmentModule(
      'technical-m3',
      'Power and Safety',
      3,
      'Loads, cables, lighting, and shutdown.',
      audioLesson(
        'technical-03',
        'Power, lighting, and safety',
        'technical-03.m4a',
        'Serving with power without taking unnecessary risks.',
        [
          'Use the right cables and never overload a circuit.',
          'Tape down walkway cables and keep water away from power.',
          'Know the breakers, the backup plan, and the shutdown order.',
        ],
        { reference: '1 Corinthians 14:40', text: 'Let all things be done decently and in order.' }
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const USHERING: Course = {
  slug: 'ushering',
  code: 'URPN USHER',
  title: 'URPN Ushering Department',
  shortTitle: 'Ushering',
  icon: 'handshake',
  track: 'workforce',
  tagline: 'The first face of the house.',
  description:
    'Ushers set the temperature of the room before worship begins. Learn to welcome with warmth, keep order without friction, and respond calmly when something goes wrong.',
  audience: 'Members with a heart for hospitality, order, and welcome.',
  weeks: 3,
  outcomes: [
    'Welcome every person with warmth and attentiveness.',
    'Guide seating, movement, and offerings without disruption.',
    'Handle emergencies and disturbances calmly.',
    'Keep pastoral confidentiality in every interaction.',
  ],
  conditions: [
    'A member of URPN for at least 3 months.',
    'A warm, approachable, and patient disposition.',
    'Presentable and punctual at every assignment.',
    'Able to stand and move for the duration of a service.',
    'Committed to confidentiality and calm conduct.',
    'Available for at least two services each month.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'ushering-m1',
      'The First Impression',
      1,
      'Hospitality as ministry.',
      audioLesson(
        'ushering-01',
        'The first face of the house',
        'ushering-01.m4a',
        'How welcome shapes the worship experience.',
        [
          'Your welcome sets the temperature before worship begins.',
          'Look for the lost, the elderly, and families with children.',
          'You are hospitality with a spine, not crowd control.',
        ],
        { reference: 'Psalm 84:10', text: 'For a day in thy courts is better than a thousand.' }
      )
    ),
    departmentModule(
      'ushering-m2',
      'Order without Friction',
      2,
      'Seating, movement, and offerings.',
      audioLesson(
        'ushering-02',
        'Order without friction',
        'ushering-02.m4a',
        'Making the practical flow feel effortless.',
        [
          'Know the reserved rows and guide people gently.',
          'Keep the offering flow orderly and money out of sight.',
          'Solve seating problems without embarrassing anyone.',
        ]
      )
    ),
    departmentModule(
      'ushering-m3',
      'When Something Goes Wrong',
      3,
      'Emergencies, disturbances, and escalation.',
      audioLesson(
        'ushering-03',
        'When something goes wrong',
        'ushering-03.m4a',
        'Calm, safety, and the right escalation.',
        [
          'Know the exits, first-aid point, and who to call.',
          'Keep the room safe and escalate early.',
          'Write a short report and protect confidentiality.',
        ]
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const PROTOCOL: Course = {
  slug: 'protocol',
  code: 'URPN PROTOCOL',
  title: 'URPN Protocol Department',
  shortTitle: 'Protocol',
  icon: 'shield',
  track: 'workforce',
  tagline: 'Honour, discretion, and quiet confidence.',
  description:
    'Protocol represents the house to guests and the guests to the house. Learn guest care, movement, confidentiality, and the etiquette that makes people feel valued.',
  audience: 'Mature members called to guest care, hospitality, and protocol.',
  weeks: 3,
  outcomes: [
    'Represent the house with honour and good etiquette.',
    'Care for guests and coordinate their movement discreetly.',
    'Protect sensitive information and guest privacy.',
    'Escalate safety concerns with calm judgement.',
  ],
  conditions: [
    'A member of URPN for at least 6 months.',
    'A mature, discreet, and dependable character.',
    'Presentable and comfortable speaking with guests.',
    'Able to provide a personal reference from a leader.',
    'Flexible availability for special services and events.',
    'Committed to confidentiality and protocol standards.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'protocol-m1',
      'Representing the House',
      1,
      'Etiquette, posture, and honour.',
      audioLesson(
        'protocol-01',
        'Representing the house',
        'protocol-01.m4a',
        'The posture of a person who carries the house’s honour.',
        [
          'Dress well, arrive early, and know the programme.',
          'Greet people by name and keep your posture open.',
          'Make others feel valued rather than important.',
        ],
        { reference: '1 Peter 2:17', text: 'Honour all men. Love the brotherhood. Fear God. Honour the king.' }
      )
    ),
    departmentModule(
      'protocol-m2',
      'Guest Care and Movement',
      2,
      'Arrivals, seating, and escorts.',
      audioLesson(
        'protocol-02',
        'Guest care and movement',
        'protocol-02.m4a',
        'Moving guests with clarity and discretion.',
        [
          'Confirm the guest, the schedule, and the plan.',
          'Coordinate with security and media before moving through public space.',
          'Never leave a guest unsure of what happens next.',
        ]
      )
    ),
    departmentModule(
      'protocol-m3',
      'Discretion and Safety',
      3,
      'Information, boundaries, and escalation.',
      audioLesson(
        'protocol-03',
        'Discretion and safety',
        'protocol-03.m4a',
        'Holding what you see and hear with wisdom.',
        [
          'Keep guest details and movements private.',
          'Do not post photos or information without clearance.',
          'Report safety concerns quietly to the lead.',
        ]
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const CHOIR: Course = {
  slug: 'choir',
  code: 'URPN CHOIR',
  title: 'URPN Choir Department',
  shortTitle: 'Choir',
  icon: 'music',
  track: 'workforce',
  tagline: 'Lead the room into worship, not into a performance.',
  description:
    'The choir carries the sound of the house. Learn vocal discipline, harmony, rehearsal habits, and the heart of worship that keeps the song pointed at God.',
  audience: 'Members called to worship leading and choral ministry.',
  weeks: 3,
  outcomes: [
    'Lead worship with unity and humility.',
    'Prepare the voice safely and sing in balance.',
    'Learn parts and rehearse with focus.',
    'Carry the song from rehearsal to the altar.',
  ],
  conditions: [
    'Born again and committed to the URPN vision.',
    'A member of URPN for at least 3 months.',
    'Able to sing in tune and learn a vocal part.',
    'Available for weekly rehearsal and Sunday service.',
    'A lifestyle consistent with the ministry of worship.',
    'Willing to audition and receive vocal direction.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'choir-m1',
      'The Ministry of the Choir',
      1,
      'Worship before performance.',
      audioLesson(
        'choir-01',
        'The ministry of the choir',
        'choir-01.m4a',
        'Why the choir exists and who it serves.',
        [
          'The choir leads the congregation into worship.',
          'Unity matters more than a perfect note.',
          'Your lifestyle is part of your ministry.',
        ],
        { reference: 'Colossians 3:16', text: 'Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs.' }
      )
    ),
    departmentModule(
      'choir-m2',
      'Vocal Discipline',
      2,
      'Breath, pitch, blend, and vocal care.',
      audioLesson(
        'choir-02',
        'Vocal discipline',
        'choir-02.m4a',
        'Treating the voice as an instrument entrusted by God.',
        [
          'Warm up before you sing and breathe from the diaphragm.',
          'Keep your pitch honest and your volume blended.',
          'Listen to the parts around you and rest your voice.',
        ]
      )
    ),
    departmentModule(
      'choir-m3',
      'Rehearsal to Altar',
      3,
      'Preparation that becomes worship.',
      audioLesson(
        'choir-03',
        'Rehearsal to altar',
        'choir-03.m4a',
        'Carrying the song from the rehearsal room into the service.',
        [
          'Come on time with your lyrics and part learned.',
          'Mark entrances, breathing, and dynamics.',
          'Follow the director and help the room meet God.',
        ]
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const WELFARE: Course = {
  slug: 'welfare',
  code: 'URPN WELFARE',
  title: 'URPN Welfare Department',
  shortTitle: 'Welfare',
  icon: 'heart',
  track: 'workforce',
  tagline: 'Care that sees the person behind the need.',
  description:
    'Welfare is the hands and feet of the church. Learn to notice people, visit with wisdom, protect confidentiality, and follow up with practical, consistent love.',
  audience: 'Compassionate members called to care, visits, and practical support.',
  weeks: 3,
  outcomes: [
    'Notice and respond to practical needs with compassion.',
    'Visit and support families with clear boundaries.',
    'Protect confidential information.',
    'Refer and follow up with wisdom.',
  ],
  conditions: [
    'A member of URPN for at least 6 months.',
    'A compassionate, patient, and confidential disposition.',
    'Able to provide a personal reference from a leader.',
    'Available for weekday visits and follow-up.',
    'Comfortable keeping simple records and reports.',
    'Committed to boundaries and pastoral referral.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'welfare-m1',
      'Care that Sees',
      1,
      'The heart of welfare.',
      audioLesson(
        'welfare-01',
        'Care that sees people',
        'welfare-01.m4a',
        'Seeing the person behind the need.',
        [
          'You do not need to fix everything; notice, listen, and respond.',
          'Practical love is often a meal, a ride, or a quiet presence.',
          'Keep your eyes open and your heart soft.',
        ],
        { reference: 'Galatians 6:2', text: 'Bear ye one another’s burdens, and so fulfil the law of Christ.' }
      )
    ),
    departmentModule(
      'welfare-m2',
      'Visits and Practical Help',
      2,
      'Presence, boundaries, and promises.',
      audioLesson(
        'welfare-02',
        'Visits and practical help',
        'welfare-02.m4a',
        'Making a visit safe, useful, and respectful.',
        [
          'Agree the purpose of the visit before you go.',
          'Go in pairs where appropriate and respect the home.',
          'Never promise what the church cannot deliver.',
        ]
      )
    ),
    departmentModule(
      'welfare-m3',
      'Confidentiality and Follow-up',
      3,
      'Trust, records, and referral.',
      audioLesson(
        'welfare-03',
        'Confidentiality and follow-up',
        'welfare-03.m4a',
        'Holding pain with trust and wisdom.',
        [
          'Share information only with those who need it.',
          'Know when to refer to a pastor, counsellor, or doctor.',
          'Follow up without becoming intrusive.',
        ],
        { reference: 'James 1:27', text: 'Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction.' }
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

const CHILDREN: Course = {
  slug: 'children',
  code: 'URPN KIDS',
  title: 'URPN Children Department',
  shortTitle: 'Children',
  icon: 'baby',
  track: 'workforce',
  tagline: 'A safe place for little hearts to meet God.',
  description:
    'Children’s ministry begins with safety and grows through faithful teaching. Learn safeguarding, lesson preparation, classroom care, and partnership with parents.',
  audience: 'Members called to children’s church, Sunday school, and safeguarding.',
  weeks: 3,
  outcomes: [
    'Apply safeguarding and check-in/check-out standards.',
    'Prepare a simple, engaging lesson with one clear truth.',
    'Care for children with patience and consistency.',
    'Partner with parents through clear communication.',
  ],
  conditions: [
    'A member of URPN for at least 6 months.',
    'Willing to complete a safeguarding/background check.',
    'Able to attend the children’s safeguarding training.',
    'Patient, consistent, and comfortable with children.',
    'Able to provide a personal reference from a leader.',
    'Committed to the two-adult and visibility rules at all times.',
  ],
  prerequisites: [],
  modules: [
    departmentModule(
      'children-m1',
      'A Safe Place',
      1,
      'Safeguarding before teaching.',
      audioLesson(
        'children-01',
        'A safe place to grow',
        'children-01.m4a',
        'The non-negotiables of children’s safety.',
        [
          'Follow check-in and check-out every single time.',
          'Never be alone with a child in a closed room.',
          'A safe child is a child who can hear the gospel.',
        ],
        { reference: 'Matthew 19:14', text: 'Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven.' }
      )
    ),
    departmentModule(
      'children-m2',
      'Teaching Little Hearts',
      2,
      'Lessons, play, and engagement.',
      audioLesson(
        'children-02',
        'Teaching little hearts',
        'children-02.m4a',
        'Preparing a lesson a child can understand and remember.',
        [
          'Teach one clear truth with story, repetition, and play.',
          'Use their names, keep instructions simple, and celebrate participation.',
          'The goal is a child who knows God loves them and church is safe.',
        ]
      )
    ),
    departmentModule(
      'children-m3',
      'Partnering with Parents',
      3,
      'Communication, incidents, and trust.',
      audioLesson(
        'children-03',
        'Partnering with parents',
        'children-03.m4a',
        'Building the parent–teacher trust that protects children.',
        [
          'Communicate early and clearly with parents.',
          'Report incidents promptly, honestly, and privately.',
          'When parents trust the team, children feel safe.',
        ]
      )
    ),
  ],
  exam: { durationMinutes: 20, passMark: 70, questionCount: 8 },
};

export const WORKFORCE_COURSES: Course[] = [
  MEDIA,
  TECHNICAL,
  USHERING,
  PROTOCOL,
  CHOIR,
  WELFARE,
  CHILDREN,
];

export const LEADERSHIP_COURSES: Course[] = [MINISTERS, PASTORS];

export const COURSES: Course[] = [...LEADERSHIP_COURSES, ...WORKFORCE_COURSES];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function getCoursesForRole(role: string): Course[] {
  if (role === 'workforce') return WORKFORCE_COURSES;
  if (role === 'worker' || role === 'admin') return LEADERSHIP_COURSES;
  return [];
}

export function canAccessCourse(role: string, course: Course): boolean {
  if (role === 'admin') return true;
  if (role === 'workforce') return course.track === 'workforce';
  return course.track === 'leadership';
}

export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap((module) => module.lessons);
}

export function getLesson(
  course: Course,
  lessonId: string
): { lesson: Lesson; module: CourseModule; index: number } | undefined {
  const lessons = getAllLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return undefined;
  const module = course.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
  if (!module) return undefined;
  return { lesson: lessons[index], module, index };
}

export function getLessonCount(course: Course): number {
  return getAllLessons(course).length;
}

export function getCourseMinutes(course: Course): number {
  return getAllLessons(course).reduce((total, lesson) => total + lesson.estimatedMinutes, 0);
}

export function getCourseDurationLabel(course: Course): string {
  const minutes = getCourseMinutes(course);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function getTrackIndex(slug: CourseSlug): number {
  return COURSES.findIndex((course) => course.slug === slug) + 1;
}

export function formatLessonDuration(lesson: Lesson): string {
  if (lesson.kind === 'reading') return `${lesson.estimatedMinutes} min read`;
  const seconds = lesson.media?.durationSeconds ?? 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} sec`;
  return secs ? `${mins} min ${secs} sec` : `${mins} min`;
}

export function lessonKindLabel(kind: LessonKind): string {
  if (kind === 'video') return 'Video';
  if (kind === 'audio') return 'Audio';
  return 'Reading';
}
