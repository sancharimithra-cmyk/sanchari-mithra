/**
 * =============================================================================
 * SANCHARI MITHRA REBOOT — Website Knowledge Extraction & RAG Indexing Script
 * =============================================================================
 * Scans index.html and official data to create structured semantic knowledge chunks.
 *
 * Usage:
 *   node scripts/index-website.js
 *
 * Outputs:
 *   - data/website-knowledge.json
 *   - assets/data/website-knowledge.json
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_FILE = path.join(ROOT_DIR, 'index.html');
const ACTIVITIES_FILE = path.join(ROOT_DIR, 'assets', 'yearly-activities', 'activities-2026.json');
const OUT_DATA = path.join(ROOT_DIR, 'data', 'website-knowledge.json');
const OUT_ASSETS = path.join(ROOT_DIR, 'assets', 'data', 'website-knowledge.json');

// Ensure output directories exist
[path.dirname(OUT_DATA), path.dirname(OUT_ASSETS)].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('Starting website knowledge extraction and indexing...');

const chunks = [
  {
    id: 'gurukulam-overview',
    title: 'Sri Sathya Sai Sharadaniketanam Gurukulam Overview',
    category: 'Institution',
    section: 'About Gurukulam',
    source: 'Gurukulam Overview & Heritage',
    anchor: '#hero',
    keywords: ['institution', 'overview', 'gurukulam', 'mandya', 'free education', 'residential', 'school', 'nios', 'character', 'values-based'],
    content: 'Sri Sathya Sai Sharadaniketanam Gurukulam in Mandya is a premier residential educational institution providing 100% completely free values-based education, boarding, lodging, uniforms, books, and healthcare. Operating under the sacred motto "The end of education is character," the Gurukulam follows the NIOS curriculum for rural and deserving boys from Grades 6 to 12. Founded under the divine inspiration of Bhagavan Sri Sathya Sai Baba and nurtured under the spiritual leadership of Sadhguru Sri Madhusudan Sai, the Gurukulam combines rigorous academic education with spiritual discipline, yoga, Vedic chanting, sports, and selfless community service.'
  },
  {
    id: 'sanchari-mithra-identity',
    title: 'SANCHARI MITHRA REBOOT — AI Campus Guide & Companion',
    category: 'Technology',
    section: 'About SANCHARI MITHRA REBOOT',
    source: 'SANCHARI MITHRA REBOOT Identity',
    anchor: '#aboutSanchariSection',
    keywords: ['sanchari', 'mithra', 'reboot', 'robot', 'ai guide', 'ai companion', 'chatbot', 'assistant', 'technology', 'innovation'],
    content: 'SANCHARI MITHRA REBOOT is the official AI Digital Campus Guide and companion of Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya. Built on the core ideals of INNOVATION, COMPASSION, and SERVICE, SANCHARI MITHRA guides visitors, parents, teachers, and students through the campus infrastructure, daily discipline, spiritual sanctums, healthcare clinic, yearly activities archive, and academic achievements. SANCHARI embodies human connection, values-based technology, and positive educational impact.'
  },
  {
    id: 'campus-academic-wing',
    title: 'Academic Wing & Dome Assembly Hall',
    category: 'Buildings',
    section: 'Campus Buildings & Facilities',
    source: 'Campus Buildings & Facilities',
    anchor: '#buildingsSection',
    keywords: ['academic wing', 'dome', 'assembly hall', 'classrooms', 'prayers', 'academics', 'education', 'smart classes'],
    content: 'The Academic Wing is the educational heart of the Gurukulam. It features a majestic architectural dome assembly hall where students and faculty gather daily for morning prayers, divine assemblies, and intellectual discourses. The wing houses modern, well-ventilated, multimedia-equipped smart classrooms where NIOS-curriculum lessons in Sciences, Mathematics, Social Studies, Languages, and Paravidya (spiritual studies) are conducted with individual teacher attention.'
  },
  {
    id: 'campus-sai-chaya-hostel',
    title: 'Sai Chaya Hostel (Student Residence)',
    category: 'Buildings',
    section: 'Hostel & Residential Life',
    source: 'Hostel & Residential Life',
    anchor: '#buildingsSection',
    keywords: ['hostel', 'sai chaya', 'residence', 'dormitory', 'boarding', 'student life', 'living', 'rooms'],
    content: 'Sai Chaya Hostel is the multi-story residential home of the Gurukulam students. Designed as a sacred home away from home, the hostel provides spacious, hygienic dormitories, personal study desks, hot water amenities, and laundry care under the loving mentorship of dedicated resident wardens and teachers. In Sai Chaya, students learn self-reliance, camaraderie, mutual respect, shared cleanliness (Swachhata Seva), and communal harmony.'
  },
  {
    id: 'campus-labs-library',
    title: 'Saraswati Library, Computer Lab & Science Labs',
    category: 'Facilities',
    section: 'Academic Infrastructure',
    source: 'Academic Infrastructure',
    anchor: '#buildingsSection',
    keywords: ['library', 'saraswati library', 'books', 'reading', 'computer lab', 'science lab', 'physics', 'chemistry', 'biology', 'coding', 'experiments'],
    content: 'The Gurukulam provides high-standard academic facilities: Saraswati Library (1st Floor) houses a vast curated collection of academic textbooks, reference encyclopedias, spiritual literature, moral storybooks, and competitive examination guides. The Computer Lab is equipped with high-speed computing terminals where students learn computer applications, programming fundamentals, and digital literacy. The Science Laboratories (Physics, Chemistry, and Biology on the 1st and 2nd floors) provide hands-on experimental equipment for scientific inquiry and practical learning.'
  },
  {
    id: 'campus-kitchen-dining',
    title: 'Annapoorna Kitchen & Dining Hall',
    category: 'Facilities',
    section: 'Nutrition & Dining',
    source: 'Annapoorna Kitchen & Dining',
    anchor: '#buildingsSection',
    keywords: ['kitchen', 'dining', 'food', 'annapoorna', 'meals', 'nutrition', 'steam cooking', 'breakfast', 'lunch', 'dinner', 'prasadam'],
    content: 'The Annapoorna Kitchen is a modern, ultra-hygienic steam cooking facility that prepares four wholesome, sattvic vegetarian meals every single day for all resident students and staff: morning nourishing breakfast, balanced afternoon lunch, evening snacks after games, and wholesome dinner. Every meal is sanctified through the chanting of the Brahmarpanam prayer before consumption, turning food into divine prasadam.'
  },
  {
    id: 'campus-healthcare-sai-swasthya',
    title: 'Sai Swasthya Wellness Healthcare Unit',
    category: 'Healthcare',
    section: 'Campus Health & Medical Care',
    source: 'Sai Swasthya Wellness Healthcare',
    anchor: '#buildingsSection',
    keywords: ['healthcare', 'medical', 'hospital', 'clinic', 'sai swasthya', 'doctor', 'dental', 'health checkup', 'medicine', 'wellness'],
    content: 'Sai Swasthya Wellness is the dedicated on-campus healthcare facility serving students, faculty, and local rural communities. The clinic is equipped with emergency primary medical equipment, first-aid suites, essential pharmaceutical supplies, and a modern dental screening unit. Visiting doctors and dental surgeons conduct regular comprehensive health check-ups to ensure every child maintains peak physical vitality and hygiene.'
  },
  {
    id: 'campus-temples-sanctums',
    title: 'Campus Temples & Sacred Sanctums',
    category: 'Spiritual',
    section: 'Campus Temples & Sanctums',
    source: 'Campus Temples & Sanctums',
    anchor: '#templesSection',
    keywords: ['temples', 'sanctums', 'dhyana mantapa', 'shiva', 'gavisiddeshwara', 'maramma', 'shrine', 'meditation', 'linga', 'pujas'],
    content: 'The Gurukulam campus features three revered sacred sanctums: 1. Dhyana Mantapa: A serene hilltop sanctuary housing a consecrated sacred Shiva Linga, offering an idyllic elevated environment for silent meditation, introspection, and japa. 2. Sri Gavisiddeshwara Temple: A traditional consecrated Lord Shiva shrine with sacred Nandi, where regular abhishekam, arati, and festive prayers are offered. 3. Sri Maramma Temple: The divine Mother shrine lovingly revered with traditional daily and weekly village pujas for peace, divine protection, and auspiciousness.'
  },
  {
    id: 'daily-routine-timetable',
    title: 'Gurukulam Daily Routine & Timetable',
    category: 'Routine',
    section: 'Daily Schedule & Discipline',
    source: 'Daily Routine & Timetable',
    anchor: '#dailyRoutineSection',
    keywords: ['daily routine', 'routine', 'schedule', 'timetable', 'time', 'suprabhatam', 'classes', 'jogging', 'games', 'bhajans', 'paravidya', 'today', 'now'],
    content: 'The Gurukulam daily routine instills lifelong self-discipline, vigor, and peace through a balanced 24-hour cycle: 4:30 AM: Wake-up call. 5:00 AM: Suprabhatam, morning stotrams, and Vedic prayers. 5:45 AM: Morning jogging, calisthenics, and physical fitness training. 7:30 AM: Nutritious breakfast. 8:15 AM – 12:15 PM: Morning academic sessions and classes. 12:15 PM: Nutritious lunch followed by a rejuvenating power nap. 1:45 PM – 4:00 PM: Afternoon academic study and remedial coaching. 4:00 PM – 5:15 PM: Outdoor games, sports, and evening milk/snacks. 5:35 PM – 6:45 PM: Evening spiritual bhajans and arati. 7:00 PM: Sattvic dinner. 7:45 PM – 9:00 PM: Paravidya (spiritual philosophy, scripture study, character education). 9:30 PM: Night prayers and rest.'
  },
  {
    id: 'yearly-activities-archive',
    title: 'Yearly Activities Archive & Environment Day 2026',
    category: 'Activities',
    section: 'Yearly Portal & Visual Archive',
    source: 'Yearly Activities Archive 2026',
    anchor: '#monthlyActivitiesSection',
    keywords: ['activities', 'yearly portal', 'photos', 'environment day', 'plantation', 'events', 'april', 'may', 'june', 'august', '2026', 'archive'],
    content: 'The Yearly Activities Portal visualizes the Gurukulam calendar across 2026: Highlights include World Environment Day on June 5, celebrated with large-scale tree sapling plantation drives across campus grounds by students and faculty; Acharya Abhivardhana Mathematics Faculty Workshop (April 9–13); Saraswati Puja & Board Exam Blessings (April 25); Faculty Visit to Student House (April 27); and Parents Seva at Gurukulam (April 29) where devoted parents cooked and served meals with loving devotion. The portal organizes official verified photographs with full-screen zoom and modal navigation.'
  },
  {
    id: 'morning-assembly-initiatives',
    title: 'Morning Assembly & Special Educational Initiatives',
    category: 'Academics',
    section: 'Morning Assembly Homepage Banner',
    source: 'Morning Assembly Initiatives',
    anchor: '#assemblyBannerSection',
    keywords: ['morning assembly', 'assembly', 'tech insight', 'speak it right', 'word for the day', 'panchanga', 'bharat darshanam', 'subhashita', 'initiatives'],
    content: 'The daily morning assembly at the Gurukulam is an intellectually stimulating forum featuring curated student-led educational initiatives: 1. Tech Insight: Exploring AI, robotics, space exploration, and sustainable energy. 2. Speak It Right: Phonics, vocabulary mastery, and public speaking confidence. 3. Word for the Day: Etymology, definitions, and contextual usage. 4. Daily Panchanga: Traditional Indian calendar, Tithi, Nakshatra, and cultural significance. 5. Bharat Darshanam: India\'s rich history, sacred monuments, and cultural geography. 6. Subhashita: Moral Sanskrit verses with ethical reflections.'
  },
  {
    id: 'admissions-free-education',
    title: '100% Free Values-Based Education & Admissions',
    category: 'Admissions',
    section: 'Admissions & Scholarships',
    source: 'Admissions & Free Education Policy',
    anchor: '#contactSection',
    keywords: ['admissions', 'apply', 'fees', 'free', 'cost', 'boys', 'rural', 'scholarship', 'eligibility', 'grades'],
    content: 'Education at Sri Sathya Sai Sharadaniketanam Gurukulam is completely 100% free of all charges. There are zero tuition fees, zero hostel fees, zero boarding expenses, and zero charges for school uniforms, textbooks, notebooks, or healthcare services. Admissions are open to meritorious, economically underprivileged, and rural boys seeking admission for Grades 6 through 11 following values-based entrance assessments. For admission queries, parents can call the Central Campus Helpline at +91 70226 61771.'
  },
  {
    id: 'leadership-administration',
    title: 'Gurukulam Leadership, Pradhanapalak & Founder',
    category: 'Leadership',
    section: 'Leadership & Administration',
    source: 'Leadership & Administration',
    anchor: '#contactSection',
    keywords: ['leadership', 'founder', 'madhusudan sai', 'gaurav', 'pradhanapalak', 'chairman', 'head', 'administration', 'director'],
    content: 'The Gurukulam is guided spiritually by Sadhguru Sri Madhusudan Sai, who spearheads a global humanitarian mission across education, healthcare, and nutrition in over 30 countries. The administrative and academic head of the Mandya Gurukulam is Pradhanapalak Dr. Gaurav M., who can be contacted directly at +91 93800 87929. The institution is supported by a dedicated team of residential faculty and mentors committed to moulding students into noble leaders.'
  },
  {
    id: 'website-development-mentorship',
    title: 'Website Development & Mentorship',
    category: 'Development',
    section: 'Website Development & Mentorship',
    source: 'Website Development & Mentorship',
    anchor: '#developerMentorshipSection',
    keywords: ['developer', 'development', 'creator', 'rithesh', 'suhas', 'mentorship', 'engineer', 'architect', 'designed', 'built'],
    content: 'The official digital portal and SANCHARI MITHRA REBOOT AI Companion were engineered by: • Rithesh G S – Website Developer, who designed the responsive frontend architecture, cinematic starfield visuals, interactive yearly portals, and AI companion interface. • Suhas K C – Mentor & Guide, who provided architectural leadership, structural mentorship, and digital innovation guidance.'
  },
  {
    id: 'campus-contact-helplines',
    title: 'Campus Contact Information & Helplines',
    category: 'Contact',
    section: 'Contact & Helplines',
    source: 'Campus Contact Directory',
    anchor: '#contactSection',
    keywords: ['contact', 'phone', 'helpline', 'whatsapp', 'email', 'number', 'call', 'location', 'address', 'mandya'],
    content: 'Official Contact Directory for Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya: • Office of Pradhanapalak Dr. Gaurav M.: +91 93800 87929 • Central Campus Helpline: +91 70226 61771 • WhatsApp Official Inquiry: +91 89711 13952 • Address: Sri Sathya Sai Sharadaniketanam, Mandya District, Karnataka, India. Visiting hours are open for parents and devotees with prior institutional appointment.'
  },
  {
    id: 'madhusudan-sai-charitam',
    title: 'Sadhguru Sri Madhusudan Sai Charitam (Life & Mission)',
    category: 'Spiritual',
    section: 'Madhusudan Sai Charitam Sacred Reader',
    source: 'Madhusudan Sai Charitam',
    anchor: '#charitamSection',
    keywords: ['charitam', 'madhusudan sai', 'sadguru', 'biography', 'life story', 'mission', 'gold medal', 'whitefield', 'vasudhaiva kutumbakam'],
    content: 'The Madhusudan Sai Charitam chronicles the life, divine transformation, and global humanitarian mission of Sadhguru Sri Madhusudan Sai. Born on 26 July 1979 in Bilaspur, Chhattisgarh, Madhusudan Naidu studied at the Sri Sathya Sai Institute of Higher Learning in Whitefield, receiving double university gold medals in B.Sc. Chemistry and MBA from Bhagawan Sri Sathya Sai Baba. Transitioning from corporate banking to selfless service, he surrendered to his Guru with the vow "Karishye Vachanam Tava". Today, his global mission embodies "Vasudhaiva Kutumbakam" (One World, One Family), offering free education, free pediatric heart hospitals, and free morning nutrition across 30+ countries.'
  }
];

// If yearly activities JSON exists, incorporate dynamic event summary
if (fs.existsSync(ACTIVITIES_FILE)) {
  try {
    const raw = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    const actData = JSON.parse(raw);
    if (actData && actData.year === 2026 && actData.months) {
      const monthSummaries = Object.keys(actData.months).map(m => {
        const mo = actData.months[m];
        return `${mo.name} 2026: ${mo.events.length} events (${mo.totalPhotos} photos) including ${mo.events.map(e => e.title).join('; ')}`;
      }).join('. ');

      chunks.push({
        id: 'yearly-activities-manifest-2026',
        title: '2026 Verified Activities & Events Manifest',
        category: 'Activities',
        section: 'Yearly Activities Archive',
        source: 'Yearly Activities Manifest 2026',
        anchor: '#monthlyActivitiesSection',
        keywords: ['manifest', 'events 2026', 'april events', 'may events', 'june events', 'august events'],
        content: `Official verified activities recorded in the Gurukulam archive for 2026: ${monthSummaries}`
      });
    }
  } catch (err) {
    console.warn('Could not parse activities-2026.json:', err.message);
  }
}

const payload = {
  lastUpdated: new Date().toISOString(),
  institution: 'Sri Sathya Sai Sharadaniketanam Gurukulam, Mandya',
  companion: 'SANCHARI MITHRA REBOOT',
  totalChunks: chunks.length,
  chunks: chunks
};

fs.writeFileSync(OUT_DATA, JSON.stringify(payload, null, 2), 'utf8');
fs.writeFileSync(OUT_ASSETS, JSON.stringify(payload, null, 2), 'utf8');

console.log(`Knowledge indexing completed successfully! ${chunks.length} chunks indexed.`);
console.log(`Saved to ${OUT_DATA} and ${OUT_ASSETS}`);
