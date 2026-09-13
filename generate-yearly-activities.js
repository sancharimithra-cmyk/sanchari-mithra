/**
 * Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya
 * Yearly Activities Manifest Generator (Node.js for GitHub Actions Bot)
 *
 * Scans assets/yearly-activities/2026/<month>/
 * Automatically parses filenames, groups by event, applies audited metadata,
 * and generates assets/yearly-activities/activities-2026.json.
 */

const fs = require('fs');
const path = require('path');

const YEAR = 2026;
const BASE_DIR = path.join(__dirname, '..', 'assets', 'yearly-activities', '2026');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'yearly-activities', 'activities-2026.json');

const MONTH_NAMES = {
  '01': 'Jan', '1': 'Jan', 'january': 'Jan', 'jan': 'Jan',
  '02': 'Feb', '2': 'Feb', 'february': 'Feb', 'feb': 'Feb',
  '03': 'Mar', '3': 'Mar', 'march': 'Mar', 'mar': 'Mar',
  '04': 'Apr', '4': 'Apr', 'april': 'Apr', 'apr': 'Apr',
  '05': 'May', '5': 'May', 'may': 'May',
  '06': 'Jun', '6': 'Jun', 'june': 'Jun', 'jun': 'Jun',
  '07': 'Jul', '7': 'Jul', 'july': 'Jul', 'jul': 'Jul',
  '08': 'Aug', '8': 'Aug', 'august': 'Aug', 'aug': 'Aug',
  '09': 'Sep', '9': 'Sep', 'september': 'Sep', 'sep': 'Sep',
  '10': 'Oct', 'october': 'Oct', 'oct': 'Oct',
  '11': 'Nov', 'november': 'Nov', 'nov': 'Nov',
  '12': 'Dec', 'december': 'Dec', 'dec': 'Dec'
};

const MONTH_FULL_NAMES = {
  'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
  'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
  'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
};

const MONTH_DESCRIPTIONS = {
  'Jan': 'New Year invocations, sports preparation, and national celebration assemblies.',
  'Feb': 'Academic review sessions, annual sports meet, and cultural observances.',
  'Mar': 'Maha Shivaratri celebrations, annual academic examinations, and study camps.',
  'Apr': 'Monthly photo feature capturing sacred rituals, academic workshops, cultural presentations, farewells, and student excursions.',
  'May': 'Induction of new Grade 6 students, student council elections, Ramayana exams, Saraswathi Homa, and spiritual satsangs.',
  'Jun': 'World Environment Day, International Yoga Day, orientation for 9th & 11th, monthly homa, celestial rhythm athletic practices, and guest visits.',
  'Jul': 'Guru Poornima celebrations, values education workshops, and monsoon tree plantations.',
  'Aug': 'Independence Day, Mahavishnu Homa, Varamahalakshmi, Alumni Meet, Sanskrit Day, Sports Day, and dedicated service honors.',
  'Sep': 'Ganesh Chaturthi festival, Teachers Day tributes, and community seva initiatives.',
  'Oct': 'Navaratri Sharada Pooja, Vijaya Dashami festivities, and academic mid-term reviews.',
  'Nov': 'Deepavali celebrations, Kannada Rajyotsava, and Bhagawan Sri Sathya Sai Baba Birthday celebrations.',
  'Dec': 'Annual sports and cultural festival preparations, Christmas celebrations, and winter campus activities.'
};

const CURATED_METADATA = {
  'apr-02-ganesha-homa': {
    date: 'April 2, 2026',
    title: 'Ganesha Homa & Hanuma Jayanthi Celebrations',
    tag: 'Sacred Rituals',
    photos: {
      '01': { title: 'Ganesha Homa Sacred Offerings', desc: 'Students and priests performing sacred homa with Vedic chants at Gurukulam.' },
      '02': { title: 'Poornahuti at Ganesha Homa', desc: 'Offering poornahuti into the holy sacrificial fire seeking divine grace.' }
    }
  },
  'apr-02-hanuma-jayanthi': {
    date: 'April 2, 2026',
    title: 'Ganesha Homa & Hanuma Jayanthi Celebrations',
    tag: 'Sacred Rituals',
    mergeInto: 'apr-02-ganesha-homa',
    photos: {
      '01': { title: 'Hanuma Jayanthi Special Pooja', desc: 'Sacred worship and archana on the auspicious occasion of Sri Hanuma Jayanthi.' },
      '02': { title: 'Hanuma Jayanthi Bhajans & Aarti', desc: 'Devotional bhajan singing and mangala aarti in reverence to Lord Hanuman.' },
      '03': { title: 'Students Assembled for Hanuma Pooja', desc: 'Gurukulam students gathered with devotion during the special morning rituals.' }
    }
  },
  'apr-09-acharya-abhivardhana': {
    date: 'April 9–13, 2026',
    title: 'Acharya Abhivardhana — Mathematics Faculty Workshop',
    tag: 'Academic Enrichment',
    photos: {
      '01': { title: 'Maths Faculty Workshop Session', desc: 'Interactive workshop sessions focusing on innovative pedagogical techniques in Mathematics.' },
      '02': { title: 'Collaborative Problem Solving', desc: 'Teachers actively participating in problem-solving discussions and curriculum alignment.' },
      '03': { title: 'Concept Presentation & Group Deliberation', desc: 'Demonstrations of intuitive learning concepts for senior high school math.' },
      '04': { title: 'Workshop Concluding Ceremony', desc: 'Valedictory moment and resource sharing amongst participating mathematics faculty.' }
    }
  },
  'apr-12-cultural-programmes': {
    mergeInto: 'apr-09-acharya-abhivardhana',
    photos: {
      '01': { title: 'Mathematics Pedagogy Interactive Session', desc: 'Teachers sharing dynamic pedagogical tools for higher secondary mathematics.' },
      '02': { title: 'Faculty Collaborative Discussion', desc: 'Collaborative deliberations on problem-solving methodologies.' },
      '03': { title: 'Subject Enrichment Presentation', desc: 'Presentation of heuristic problem solving and intuitive math frameworks.' },
      '04': { title: 'Faculty Peer Review & Alignment', desc: 'Acharyas reviewing syllabus progress and student mentoring strategy.' }
    }
  },
  'apr-13-prize-distribution': {
    date: 'April 13, 2026',
    title: 'Prize Distribution & Gratitude Feast',
    tag: 'Annual Honors',
    photos: {
      '01': { title: 'Merit Award Presentation', desc: 'Outstanding student achievers felicitated with trophies and certificates of excellence.' },
      '02': { title: 'Felicitation of High Performers', desc: 'Honoring dedication in academics, sports, and spiritual discipline.' },
      '03': { title: 'Gratitude Feast Gathering', desc: 'Students and teachers sharing a celebratory fellowship feast in unity.' },
      '04': { title: 'Campus Community Celebration', desc: 'Joyful smiles of students receiving honors at the close of the academic session.' }
    }
  },
  'apr-13-gangappa-farewell': {
    date: 'April 13, 2026',
    title: 'Farewell Felicitation to Sri & Smt Gangappa',
    tag: 'Dedicated Service',
    photos: {
      '01': { title: 'Honoring Sri & Smt Gangappa', desc: 'Heartfelt felicitation program honoring years of selfless devotion and guidance.' },
      '02': { title: 'Presentation of Memento & Shawl', desc: 'Leadership presenting traditional shawls and mementos in reverence.' },
      '03': { title: 'Blessings & Inspiring Words', desc: 'Sri Gangappa sharing reminiscences and encouraging students to hold high ideals.' },
      '04': { title: 'Students Seeking Blessings', desc: 'Gurukulam students offering pranams and gratitude for tireless support.' },
      '05': { title: 'Commemorative Group Photograph', desc: 'Campus staff and teachers posing with Sri & Smt Gangappa.' }
    }
  },
  'apr-20-sharada-pooja': {
    date: 'April 20, 2026',
    title: 'Sharada Pooja & Sacred Sanctum Prayers',
    tag: 'Divine Sanctum',
    photos: {
      '01': { title: 'Sharada Pooja at Sanctum', desc: 'Special floral decoration and prayers offered at Mother Sharada temple.' }
    }
  },
  'apr-25-parents-house-visit': {
    date: 'April 25, 2026',
    title: 'Saraswati Puja & Exam Blessings for Class 10 and 12',
    tag: 'EXAM BLESSINGS',
    photos: {
      '01': { title: 'Saraswati Puja for Board Exam Batches', desc: 'Special prayers and Vedic invocations to Mother Saraswati seeking wisdom and recall.' },
      '02': { title: 'Blessing of Pens, Slates & Hall Tickets', desc: 'Sanctifying writing instruments and exam materials with divine akshatas.' },
      '03': { title: 'Exam Blessings for Class 10 & 12 Students', desc: 'Acharyas blessing students with confidence, peace, and spiritual fortitude.' },
      '04': { title: 'Vedic Chanting & Mangala Aarti', desc: 'Solemn Vedic prayers and mangala aarti concluding the blessing ritual.' }
    }
  },
  'apr-27-melukote-temple-visit': {
    date: 'April 27, 2026',
    title: 'Visit to Student House',
    tag: 'STUDENT HOME VISIT',
    photos: {
      '01': { title: 'Visit to Student House', desc: 'Faculty and mentors warmly visiting student residence in Mandya.' },
      '02': { title: 'Interaction with Student Family', desc: 'Loving conversation with family members discussing student welfare and values.' },
      '03': { title: 'Prayer & Fellowship at Student House', desc: 'Seeking divine blessings together with the student family during home visit.' }
    }
  },
  'apr-29-gurukulam-excellence': {
    date: 'April 29, 2026',
    title: 'Parents Seva at Gurukulam',
    tag: 'PARENTS SEVA',
    excludePhotos: ['03'],
    photos: {
      '01': { title: 'Parents Seva', desc: 'Parents actively offering loving seva in the Gurukulam kitchen and dining area.' },
      '02': { title: 'Parents Seva at Gurukulam', desc: 'Parents preparing sanctified prasadam and meals for the students with devotion.' },
      '04': { title: 'Parents Seva — Loving Service', desc: 'Parents joining hands in selfless service supporting the Gurukulam community.' }
    }
  },
  'may-welcoming-grade-6': {
    date: 'May 2026',
    title: 'Welcoming the New Grade 6 Students',
    tag: 'New Admissions',
    photos: {
      '01': { title: 'Welcoming New Gurukulam Entrants', desc: 'Warm reception accorded to newly admitted Grade 6 students stepping into campus life.' },
      'kit-01': { title: 'Handing Over Student Joining Kits', desc: 'Dignitaries and wardens presenting official joining kits, uniform books, and stationery.' }
    }
  },
  'may-chief-guest-meera-shivalingayya': {
    date: 'May 2026',
    title: 'Chief Guest Visit — Mrs. Meera Shivalingayya (Mandavya Institutions)',
    tag: 'Distinguished Guest',
    photos: {
      '01': { title: 'Welcome to Mrs. Meera Shivalingayya', desc: 'Honoring chief guest Mrs. Meera Shivalingayya with traditional reception.' },
      '02': { title: 'Chief Guest Addressing the Gathering', desc: 'Inspiring address on values, devotion, and women leadership in modern education.' }
    }
  },
  'may-student-elections-nominations': {
    date: 'May 2026',
    title: 'Student Elections 2026 — Nominations & Voting',
    tag: 'Democratic Spirit',
    photos: {
      '01': { title: 'Election Candidates Speech', desc: 'Nominated student council candidates presenting their vision and promises before peers.' },
      '02': { title: 'Casting Secret Ballots', desc: 'Students participating in orderly and democratic voting process.' },
      '03': { title: 'Election Polling Booth in Action', desc: 'Staff overseeing fair and transparent student voting process.' },
      '04': { title: 'Ballot Verification & Vote Counting', desc: 'Election commission counting ballots under faculty supervision.' }
    }
  },
  'may-student-elections-results': {
    date: 'May 2026',
    title: 'Student Elections 2026 — Declaration of Winners & Oath Taking',
    tag: 'Student Council',
    photos: {
      '01': { title: 'Announcement of Council Winners', desc: 'Newly elected school captain, vice captain, and house leaders announced.' },
      '02': { title: 'Investiture & Oath Taking', desc: 'Student leaders taking solemn oath to uphold integrity and Gurukulam ideals.' }
    }
  },
  'may-ramayana-exam': {
    date: 'May 2026',
    title: 'Ramayana Exam — Hosted by Sringeri Sharada Peetham',
    tag: 'Scriptural Studies',
    photos: {
      '01': { title: 'Students Appearing for Ramayana Exam', desc: 'Gurukulam students appearing for annual scriptural exam testing knowledge of Sri Ramayana.' }
    }
  },
  'may-saraswathi-homa': {
    date: 'May 2026',
    title: 'Saraswathi Homa at Campus',
    tag: 'Vedic Sanctum',
    photos: {
      '01': { title: 'Saraswathi Homa for Academic Blessings', desc: 'Sacred fire ritual invoking grace of Mother Saraswathi for wisdom, intellect, and memory.' }
    }
  },
  'may-orientation-grade-12': {
    date: 'May 2026',
    title: 'Orientation for Grade 12 Students & Parents',
    tag: 'Academic Guidance',
    photos: {
      '01': { title: 'Grade 12 Academic Strategy Meeting', desc: 'Principal and faculty outlining comprehensive year plan and board exam preparation.' },
      '02': { title: 'Interactive Parent-Teacher Q&A', desc: 'Parents clarifying academic timetables, hostel care, and mentoring routines.' }
    }
  },
  'may-vinay-guruji-visit': {
    date: 'May 2026',
    title: "Avadhootha Sri Vinay Guruji's Sacred Visit to Campus",
    tag: 'Spiritual Grace',
    photos: {
      '01': { title: 'Welcome to Sri Vinay Guruji', desc: 'Campus community extending reverent welcome to Avadhootha Sri Vinay Guruji.' },
      '02': { title: 'Sri Vinay Guruji Addressing Students', desc: 'Divine satsang imparting pearls of wisdom on surrender, purity, and Gurukulam discipline.' }
    }
  },
  'may-staff-connect-home-visits': {
    date: 'May 2026',
    title: "Staff Connect — Visiting Students' & Staff Houses",
    tag: 'Community Bond',
    photos: {
      '01': { title: 'Faculty Visiting Staff Residence', desc: 'Teachers connecting warmly with colleague families in Mandya town.' },
      '02': { title: 'Satsang at Staff Home', desc: 'Bhajans and warm interactions during home visit initiatives.' }
    }
  },
  'may-gratitude-program-grade-12': {
    date: 'May 2026',
    title: 'Gratitude Program — Grade 12 (Mission 55)',
    tag: 'Milestone Achievement',
    photos: {
      '01': { title: 'Grade 12 Mission 55 Felicitation', desc: 'Celebrating successful culmination of Mission 55 with prayers and gratitude.' },
      '02': { title: 'Gratitude Offerings to Gurus', desc: 'Grade 12 students expressing deep gratitude to their mentors and teachers.' }
    }
  },
  'may-satsang-evening': {
    date: 'May 2026',
    title: 'Evening Satsang & Gurukulam Activities',
    tag: 'Hostel Life',
    photos: {
      '01': { title: 'Evening Bhajan & Dhyana Session', desc: 'Students meditating and chanting devotional bhajans during sunset hours.' }
    }
  },
  'may-academic-planner': {
    date: 'May 2026',
    title: 'Academic Planners & Special Curricula',
    tag: 'Educational Planning',
    photos: {
      '01': { title: 'Curriculum Roadmap Overview', desc: 'Detailed academic schedules and syllabus milestones displayed.' },
      '02': { title: 'Term Assessment Guidelines', desc: 'Comprehensive exam schedules and continuous assessment blueprints.' },
      '03': { title: 'Special Coaching Modules', desc: 'Targeted preparation materials for competitive examinations.' },
      '04': { title: 'Laboratory Practicals Timetable', desc: 'Practical experiment cycles for Physics, Chemistry, and Biology.' },
      '05': { title: 'Co-Curricular Activity Calendar', desc: 'Yearlong planning for sports, yoga, and cultural festivals.' },
      '06': { title: 'Remedial Learning Chart', desc: 'Individualized mentoring schedules for students requiring extra guidance.' },
      '07': { title: 'Values Education Syllabus', desc: 'Veda chanting, moral science, and character development timeline.' }
    }
  },
  'jun-month-end-celebration': {
    date: 'June 2026',
    title: 'Month End Celebration & Student Assembly',
    tag: 'Assembly Honors',
    photos: {
      '01': { title: 'Month End Assembly Gathering', desc: 'Complete Gurukulam gathering commemorating achievements of June 2026.' },
      '02': { title: 'Recognition of Monthly Toppers', desc: 'Students awarded certificates for excellence in academics and behavior.' },
      '03': { title: 'Address by Campus Warden', desc: 'Inspiring guidance on setting higher goals for upcoming semester.' }
    }
  },
  'jun-orientation-9th-11th': {
    date: 'June 2026',
    title: 'Orientation Programme for 9th & 11th Grades',
    tag: 'Academic Orientation',
    photos: {
      '01': { title: 'Academic Transition Orientation', desc: 'Welcoming 9th and 11th standard students into their new higher classes.' },
      '02': { title: 'Faculty Guiding Course Selection', desc: 'Senior teachers explaining curriculum expectations and study strategies.' },
      '03': { title: 'Student Interaction & Goals Setting', desc: 'Students formulating personal study commitments for the year.' }
    }
  },
  'jun-monthly-homa': {
    date: 'June 2026',
    title: 'Monthly Homa at Sacred Yagashala',
    tag: 'Vedic Yajna',
    photos: {
      '01': { title: 'Chanting Vedic Mantras at Homa', desc: 'Sacred fire ritual performed with reverent Vedic hymns for world peace.' },
      '02': { title: 'Offering Ahutis into the Sacred Flame', desc: 'Faculty and students taking part in holy oblations.' }
    }
  },
  'jun-environment-day': {
    date: 'June 5, 2026',
    title: 'World Environment Day — Tree Plantation Drive',
    tag: 'Green Gurukulam',
    photos: {
      '01': { title: 'Planting Fresh Saplings in Campus', desc: 'Students actively nurturing nature by planting trees on campus grounds.' },
      '02': { title: 'Faculty & Students Green Initiative', desc: 'Teachers demonstrating eco-friendly techniques to conserve soil and flora.' },
      '03': { title: 'Watering Newly Planted Trees', desc: 'Dedication to ecological harmony and clean campus environment.' }
    }
  },
  'jun-vinay-guruji-visit': {
    date: 'June 2026',
    title: "Avadhoota Shree Vinay Guruji's Divine Visit",
    tag: 'Sacred Satsang',
    photos: {
      '01': { title: 'Welcoming Sri Vinay Guruji with Poornakumbham', desc: 'Traditional Vedic reception accorded to Avadhoota Shree Vinay Guruji.' },
      '02': { title: 'Guruji Sanctifying Campus Buildings', desc: 'Sri Vinay Guruji walking through campus sanctums giving divine blessings.' },
      '03': { title: 'Spiritual Discourse to Students', desc: 'Uplifting message on cultivating pure thoughts, speech, and actions.' },
      '04': { title: 'Guruji Blessing Teachers and Staff', desc: 'Words of encouragement to faculty dedicating their lives to Gurukulam mission.' }
    }
  },
  'jun-parents-meet': {
    date: 'June 2026',
    title: 'Parents Meet & Academic Review',
    tag: 'PTM Conference',
    photos: {
      '01': { title: 'Parents Gathering in Main Hall', desc: 'Parents interacting with campus administrators regarding student welfare.' },
      '02': { title: 'One-on-One Teacher Consultation', desc: 'Individual subject teachers providing progress feedback to parents.' },
      '03': { title: 'Parent Feedback & Suggestions', desc: 'Constructive dialogue to enhance Gurukulam residential care.' },
      '04': { title: 'Group Discussion on Holistic Growth', desc: 'Collaborative commitment to nurture each child with love and discipline.' }
    }
  },
  'jun-yoga-day': {
    date: 'June 21, 2026',
    title: 'International Yoga Day — Asanas & Pranayama',
    tag: 'Yoga & Health',
    photos: {
      '01': { title: 'Mass Asana Demonstration', desc: 'Gurukulam students performing synchronized Suryanamaskar and asanas.' },
      '02': { title: 'Pranayama & Dhyana Session', desc: 'Breathing exercises and silent meditation in early morning sunlight.' }
    }
  },
  'jun-celestial-rhythm-athletics': {
    date: 'June 2026',
    title: 'Celestial Rhythm & Athletics Practices',
    tag: 'Sports & Discipline',
    photos: {
      '01': { title: 'Athletic Track Training Session', desc: 'Students practicing sprint starts and stamina runs on campus ground.' },
      '02': { title: 'Celestial Rhythm Drill Formations', desc: 'Synchronized movement and brass band rhythm practice under coach guidance.' },
      '03': { title: 'Fitness Drills & Calisthenics', desc: 'Daily physical endurance drills building agility, strength, and team camaraderie.' }
    }
  },
  'jun-elders-visit': {
    date: 'June 2026',
    title: 'Elders & Alumni Visit to Campus',
    tag: 'Campus Visitors',
    photos: {
      '01': { title: 'Senior Devotees & Elders Tour', desc: 'Distinguished elders touring Gurukulam facilities and applauding cleanliness.' },
      '02': { title: 'Elders Sharing Experiences with Boys', desc: 'Inspiring life lessons shared by senior visitors with attentive students.' }
    }
  },
  'jun-newspaper-articles': {
    date: 'June 2026',
    title: 'Press & Newspaper Articles Highlighting Mandya Gurukulam',
    tag: 'Media Coverage',
    photos: {
      '01': { title: 'State Press Feature on Gurukulam', desc: 'Prominent regional newspaper reporting on free values-based education model.' },
      '02': { title: 'Editorial Acclaiming Student Achievements', desc: 'Press clipping highlighting academic and co-curricular laurels of Mandya campus.' }
    }
  },
  'aug-06-mahavishnu-homa': {
    date: 'August 6, 2026',
    title: 'Mahavishnu Homa & Vedic Prayers',
    tag: 'Vedic Yajna',
    photos: {
      '01': { title: 'Mahavishnu Homa Sanctum Preparations', desc: 'Sacred fire altar prepared with sandalwood, flowers, and holy samith.' },
      '02': { title: 'Veda Chanting by Gurukulam Students', desc: 'Resounding Vedic recitations invoking blessings of Lord Mahavishnu.' },
      '03': { title: 'Sacred Ahutis Offered in Fire', desc: 'Priests offering ghee and herbal oblation into the sanctified kunda.' },
      '04': { title: 'Mangala Aarti & Prasadam', desc: 'Concluding prayer with divine light offering and distribution of holy prasadam.' }
    }
  },
  'aug-09-alumni-meet': {
    date: 'August 9, 2026',
    title: 'Annual Alumni Meet — Bond of Gurukulam Brotherhood',
    tag: 'Alumni Reunion',
    photos: {
      '01': { title: 'Welcoming Alumni Back Home', desc: 'Past students warmly greeted by teachers at the Gurukulam entrance.' },
      '02': { title: 'Alumni Interactive Satsang in Hall', desc: 'Reunion gathering recollecting cherished memories and student days.' },
      '03': { title: 'Alumni Addressing Younger Brothers', desc: 'Graduates offering career guidance and spiritual inspiration to current students.' },
      '04': { title: 'Friendly Sports Match Alumni vs Students', desc: 'Joyful volleyball and cricket matches fostering brotherhood.' },
      '05': { title: 'Group Photo of Alumni & Faculty', desc: 'Commemorative photograph of generations of Gurukulam brothers.' },
      '06': { title: 'Fellowship Prasadam Lunch', desc: 'Sharing sacred food together in true Gurukulam tradition.' }
    }
  },
  'aug-12-amavasya-devi-pooja': {
    date: 'August 12, 2026',
    title: 'Amavasya Devi Pooja & Suvasini Pooja',
    tag: 'Devi Worship',
    photos: {
      '01': { title: 'Devi Alankara at Sharada Sanctum', desc: 'Exquisite floral alankara adorned on Sri Sharada Devi.' },
      '02': { title: 'Lalitha Sahasranama Kumkuma Archana', desc: 'Sacred chanting of thousand holy names of the Divine Mother.' },
      '03': { title: 'Suvasini Pooja Ritual', desc: 'Honoring maternal energy and sacred femininity with reverence.' },
      '04': { title: 'Devotional Bhajan Singing', desc: 'Soul-stirring bhajans dedicated to Sri Sharada Parameshwari.' }
    }
  },
  'aug-15-independence-day': {
    date: 'August 15, 2026',
    title: '80th Independence Day Celebrations & Flag Hoisting',
    tag: 'Patriotic Pride',
    photos: {
      '01': { title: 'Tricolour National Flag Unfurling', desc: 'Chief Guest hoisting the Tiranga high amidst the national anthem.' },
      '02': { title: 'Salute to the National Flag', desc: 'Students and NCC cadets standing in crisp salute to Mother India.' },
      '03': { title: 'March Past Parade', desc: 'Disciplined squads marching past saluting dais in synchrony.' },
      '04': { title: 'Patriotic Song Presentation', desc: 'Choir singing soul-stirring hymns celebrating Indian unity and freedom fighters.' },
      '05': { title: 'Pyramid & Gymnastics Formation', desc: 'Students forming impressive multi-tier human pyramids demonstrating strength.' },
      '06': { title: 'Cultural Tableau on Freedom Heroes', desc: 'Students enacting historical moments of patriotism and national courage.' },
      '07': { title: 'Address by the Chief Guest', desc: 'Reminding students of their noble duties toward the motherland.' },
      '08': { title: 'Patriotic Dance Performance', desc: 'Colourful tricolour ribbons and vibrant rhythmic dance.' },
      '09': { title: 'Distribution of Sweets to Students', desc: 'Sweet distribution spreading celebratory joy across the campus.' },
      '10': { title: 'Campus Community Independence Day Pose', desc: 'Proud group photograph commemorating the 80th Independence Day.' }
    }
  },
  'aug-15-dedicated-service': {
    date: 'August 15, 2026',
    title: 'Recognition of Dedicated Service',
    tag: 'Faculty Felicitation',
    photos: {
      '01': { title: 'Felicitation of Dedicated Campus Staff', desc: 'Honoring staff members who served with unstinted devotion.' },
      '02': { title: 'Presentation of Certificates of Honour', desc: 'Management awarding citations of gratitude to committed workers.' }
    }
  },
  'aug-17-nagarapanchami': {
    date: 'August 17, 2026',
    title: 'Nagarapanchami Celebrations & Sacred Offerings',
    tag: 'Traditional Festival',
    photos: {
      '01': { title: 'Nagara Katte Milk Abhishekam', desc: 'Offering sacred milk, turmeric, and flowers to serpent deities.' },
      '02': { title: 'Traditional Rangoli & Pooja Altar', desc: 'Colourful turmeric rangoli patterns drawn with artistic skill.' },
      '03': { title: 'Students Offering Prayers', desc: 'Students praying for ecological preservation and health.' }
    }
  },
  'aug-21-varamahalakshmi': {
    date: 'August 21, 2026',
    title: 'Varamahalakshmi Festival Celebrations',
    tag: 'Divine Abundance',
    photos: {
      '01': { title: 'Sri Varamahalakshmi Kalasha Pooja', desc: 'Sacred kalasha adorned with divine saree, gold ornaments, and flowers.' },
      '02': { title: 'Lakshmi Ashtothara Satanama Archana', desc: 'Chanting sacred verses invoking prosperity, peace, and spiritual wealth.' },
      '03': { title: 'Prasadam Distribution to All Devotees', desc: 'Distributing blessed festival prasadam to entire campus.' }
    }
  },
  'aug-22-palaka-home-bhajan': {
    date: 'August 22, 2026',
    title: "Bhajans at Palaka's Residence",
    tag: 'Family Outreach',
    photos: {
      '01': { title: "Devotional Bhajan Session at Palaka's Home", desc: 'Students and teachers visiting local devotee residence to sing sacred bhajans.' }
    }
  },
  'aug-23-ptm-class-10-11': {
    date: 'August 23, 2026',
    title: 'PTM for Grades 10 & 11 (GL)',
    tag: 'Parent-Teacher Meet',
    photos: {
      '01': { title: 'Parent-Teacher Meeting for Senior Classes', desc: 'Detailed academic review and goal setting for board exam batches.' }
    }
  },
  'aug-23-heart-to-heart-class-10': {
    date: 'August 23, 2026',
    title: 'A Heart-to-Heart with Class 10 Students',
    tag: 'Mentorship Session',
    photos: {
      '01': { title: 'Class 10 Motivational Interactive Session', desc: 'Senior mentors guiding 10th graders on overcoming stress and building concentration.' },
      '02': { title: 'Personal Q&A with Campus Mentors', desc: 'Heart-to-heart dialogue establishing mutual trust and focused learning.' }
    }
  },
  'aug-26-ullas-nithish-home-visit': {
    date: 'August 26, 2026',
    title: "Home Visit to Ullas & Nithish's Parents",
    tag: 'Home Connect',
    photos: {
      '01': { title: 'Faculty Welcomed by Parents', desc: 'Warm hospitality received from Ullas and Nithish family during visit.' },
      '02': { title: 'Satsang and Fellowship with Family', desc: 'Strengthening the heartfelt connection between home and Gurukulam.' }
    }
  },
  'aug-27-upakarma': {
    date: 'August 27, 2026',
    title: 'Upakarma (Sacred Thread Renewal Ceremony)',
    tag: 'Vedic Tradition',
    photos: {
      '01': { title: 'Brahma Yajna & Sacred Thread Renewal', desc: 'Students and acharyas donning new sacred Yajnopavita with Gayatri Japa.' },
      '02': { title: 'Vedic Chanting in Sacred Mantap', desc: 'Solemn chanting of Samhita and Aruna Prashna on Avani Avittam.' }
    }
  },
  'aug-28-sanskrit-day': {
    date: 'August 28, 2026',
    title: 'World Sanskrit Day Celebrations (Samskrita Dinam)',
    tag: 'Devabhasha',
    photos: {
      '01': { title: 'Sanskrit Day Inauguration & Lamp Lighting', desc: 'Lighting ceremonial lamp honoring the language of the gods.' },
      '02': { title: 'Sanskrit Drama & Skit Performance', desc: 'Students enacting moral plays purely in fluent spoken Sanskrit.' },
      '03': { title: 'Shloka Recitation Competition', desc: 'Precise and melodic recitation of Bhagavad Gita and Subhashitas.' },
      '04': { title: 'Sanskrit Quiz & Word Puzzles', desc: 'Intellectual riddles and grammar contests fostering interest in Sanskrit.' },
      '05': { title: 'Sanskrit Patriotic Group Song', desc: 'Gurukulam choir singing melodious patriotic geethas in Sanskrit.' },
      '06': { title: 'Prize Distribution for Sanskrit Contests', desc: 'Winners awarded for exceptional fluency and knowledge in Sanskrit.' },
      '07': { title: 'Faculty Sanskrit Scholars Felicitation', desc: 'Honoring Sanskrit teachers for keeping the ancient heritage alive.' }
    }
  },
  'aug-29-sports-day': {
    date: 'August 29, 2026',
    title: 'National Sports Day — Athletic Feats & Matches',
    tag: 'Sports Day',
    photos: {
      '01': { title: 'Tribute to Major Dhyan Chand', desc: 'Floral tribute paid to hockey legend on National Sports Day.' },
      '02': { title: 'Inter-House Sprint & Relay Races', desc: 'Track races showcasing student speed and team coordination.' },
      '03': { title: 'High Jump & Long Jump Competitions', desc: 'Athletes demonstrating agility, technique, and sportsmanship.' },
      '04': { title: 'Shot Put & Discus Throw Events', desc: 'Strength athletics events contested with healthy house rivalry.' },
      '05': { title: 'Volleyball Championship Final Match', desc: 'Thrilling final match between senior house teams with cheering crowds.' },
      '06': { title: 'Kho-Kho & Kabaddi Matches', desc: 'Traditional Indian sports celebrated with fast-paced action.' },
      '07': { title: 'Sports Champions Trophy Presentation', desc: 'Victorious house lifting overall sports championship trophy.' }
    }
  },
  'aug-30-parents-meet': {
    date: 'August 30, 2026',
    title: 'Grand Parents Meet & Hostel Life Review',
    tag: 'Parents Conference',
    photos: {
      '01': { title: 'Parents Gathering in Open Auditorium', desc: 'Comprehensive parent assembly reviewing first-term academic milestones.' },
      '02': { title: 'Principal Presenting Progress Report', desc: 'Highlighting infrastructure additions, student diet, and holistic results.' },
      '03': { title: 'Subject-wise Teacher Interaction', desc: 'Parents reviewing student exam answer sheets and study logs.' },
      '04': { title: 'Hostel Wardens Sharing Wellbeing Updates', desc: 'Discussion on daily routine, nutrition, and health monitoring.' },
      '05': { title: 'Parents Expressing Appreciation', desc: 'Parents sharing touching testimonials on their children positive transformation.' },
      '06': { title: 'Fellowship Prasadam Lunch with Parents', desc: 'Parents, teachers, and students dining together in Gurukulam dining hall.' }
    }
  },
  'aug-31-monthly-birthday': {
    date: 'August 31, 2026',
    title: 'Monthly Birthday Celebrations & Blessings',
    tag: 'Birthday Blessings',
    photos: {
      '01': { title: 'Monthly Birthday Students Felicitated', desc: 'Special blessings, sweets, and gifts offered to students born in August.' },
      '02': { title: 'Birthday Prayer & Gayatri Chanting', desc: 'Collective prayers for good health, long life, and spiritual wisdom.' },
      '03': { title: 'Lighting the Auspicious Deepam', desc: 'Birthday boys lighting sacred oil lamps before Sri Sathya Sai Baba altar.' },
      '04': { title: 'Birthday Cake Cutting & Celebration', desc: 'Joyful celebration with teachers and hostel mates.' }
    }
  }
};

function parseImageFilename(fileName, monthKey) {
  const ext = path.extname(fileName).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return null;
  const base = path.basename(fileName, ext);

  let m = base.match(/^2026-([a-z]+)-(\d{1,2})-([a-z0-9-]+)-(\d{2})$/i);
  if (m) {
    return { eventKey: `${m[1].toLowerCase()}-${m[2]}-${m[3]}`, day: m[2], slug: m[3], seq: m[4], fileName };
  }

  m = base.match(/^2026-([a-z]+)-([a-z0-9-]+)-(\d{2})$/i);
  if (m) {
    return { eventKey: `${m[1].toLowerCase()}-${m[2]}`, day: null, slug: m[2], seq: m[3], fileName };
  }

  m = base.match(/^([a-zA-Z]+)-(\d{1,2})-(\d{1,2})$/i);
  if (m) {
    const day = m[2].padStart(2, '0');
    const seq = m[3].padStart(2, '0');
    return { eventKey: `${monthKey.toLowerCase()}-${day}-event`, day, slug: 'event', seq, fileName };
  }

  const parts = base.split('-');
  const seq = parts.length > 1 && /^\d+$/.test(parts[parts.length - 1]) ? parts[parts.length - 1].padStart(2, '0') : '01';
  const slug = parts.slice(0, -1).join('-') || base;
  return { eventKey: `${monthKey.toLowerCase()}-${slug}`, day: null, slug, seq, fileName };
}

function generate() {
  console.log(`Scanning 2026 yearly activities from: ${BASE_DIR}`);
  if (!fs.existsSync(BASE_DIR)) {
    console.error(`Directory not found: ${BASE_DIR}`);
    process.exit(1);
  }

  const result = { [YEAR]: {} };
  const monthDirs = fs.readdirSync(BASE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMap = {};
  monthDirs.forEach(dirName => {
    const key = MONTH_NAMES[dirName.toLowerCase()];
    if (key) monthMap[key] = dirName;
  });

  allMonths.forEach(mKey => {
    const dirName = monthMap[mKey];
    if (!dirName) return;

    const fullDirPath = path.join(BASE_DIR, dirName);
    const files = fs.readdirSync(fullDirPath).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    if (files.length === 0) return;

    const eventGroups = {};

    files.forEach(fileName => {
      const parsed = parseImageFilename(fileName, mKey);
      if (!parsed) return;

      let key = parsed.eventKey;
      if (CURATED_METADATA[key] && CURATED_METADATA[key].mergeInto) {
        key = CURATED_METADATA[key].mergeInto;
      }

      if (CURATED_METADATA[key] && CURATED_METADATA[key].excludePhotos) {
        if (CURATED_METADATA[key].excludePhotos.includes(parsed.seq)) {
          console.log(`Excluding photo as per curation rule: ${fileName}`);
          return;
        }
      }

      if (!eventGroups[key]) {
        eventGroups[key] = {
          key,
          day: parsed.day,
          slug: parsed.slug,
          photos: []
        };
      }

      eventGroups[key].photos.push({
        fileName,
        seq: parsed.seq,
        relPath: `assets/yearly-activities/2026/${dirName}/${fileName}`
      });
    });

    const events = [];

    Object.keys(eventGroups).forEach(k => {
      const group = eventGroups[k];
      const curated = CURATED_METADATA[k] || {};

      group.photos.sort((a, b) => a.seq.localeCompare(b.seq, undefined, { numeric: true }));

      const monthFull = MONTH_FULL_NAMES[mKey] || mKey;
      let dateStr = curated.date || (group.day ? `${monthFull} ${parseInt(group.day, 10)}, ${YEAR}` : `${monthFull} ${YEAR}`);
      let titleStr = curated.title || group.slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      let tagStr = curated.tag || 'Campus Activity';

      const photoItems = group.photos.map(p => {
        let pTitle = '';
        let pDesc = '';

        if (curated.photos && curated.photos[p.seq]) {
          pTitle = curated.photos[p.seq].title;
          pDesc = curated.photos[p.seq].desc;
        } else {
          const matchedKey = Object.keys(curated.photos || {}).find(ck => p.fileName.includes(ck));
          if (matchedKey && curated.photos[matchedKey]) {
            pTitle = curated.photos[matchedKey].title;
            pDesc = curated.photos[matchedKey].desc;
          } else {
            pTitle = `${titleStr} — Photo ${p.seq}`;
            pDesc = `${titleStr} celebration at Sri Sathya Sai Sharadaniketanam Gurukulam.`;
          }
        }

        return {
          src: p.relPath.replace(/\\/g, '/'),
          title: pTitle,
          desc: pDesc
        };
      });

      events.push({
        date: dateStr,
        title: titleStr,
        tag: tagStr,
        photos: photoItems
      });
    });

    events.sort((a, b) => {
      const getDay = (d) => {
        const m = d.match(/\b(\d{1,2})\b/);
        return m ? parseInt(m[1], 10) : 999;
      };
      return getDay(a.date) - getDay(b.date);
    });

    result[YEAR][mKey] = {
      tag: `${MONTH_FULL_NAMES[mKey].toUpperCase()} ${YEAR}`,
      title: `${MONTH_FULL_NAMES[mKey].toUpperCase()} ${YEAR} ACTIVITIES & CELEBRATIONS`,
      desc: MONTH_DESCRIPTIONS[mKey] || `Monthly photo feature of activities at Sri Sathya Sai Sharadaniketanam Mandya.`,
      events
    };
  });

  const jsonContent = JSON.stringify(result, null, 2);
  fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf8');
  console.log(`Generated manifest successfully: ${OUTPUT_FILE}`);
}

generate();
