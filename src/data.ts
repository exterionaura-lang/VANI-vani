import { Topic, Theme, NewsItem } from "./types";

export const TOPICS: Topic[] = [
  // Theme: About Yourself (9)
  { id: 1, title: "Introduce Yourself", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=75", locked: false, done: true },
  { id: 2, title: "Describe Your Education", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=75", locked: false, done: false },
  { id: 3, title: "Talk About Experience", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=75", locked: false, done: false },
  { id: 4, title: "Daily Routine", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=75", locked: false, done: false },
  { id: 5, title: "AI Friend Conversation", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=75", locked: false, done: false },
  { id: 6, title: "Casual Daily Conversation", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=500&q=75", locked: false, done: false },
  { id: 7, title: "Confidence Building Exercises", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=75", locked: false, done: false },
  { id: 8, title: "Vocabulary Practice", cat: "Vocabulary", theme: "About Yourself", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=75", locked: false, done: false },
  { id: 9, title: "Pronunciation Practice", cat: "Speaking", theme: "About Yourself", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&q=75", locked: false, done: false },

  // Theme: Interview Pro (5)
  { id: 10, title: "Job Interview", cat: "Speaking", theme: "Interview Pro", img: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=500&q=75", locked: false, done: true },
  { id: 11, title: "Handle Tough Questions", cat: "Speaking", theme: "Interview Pro", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=75", locked: false, done: false },
  { id: 12, title: "Interview for College Admission", cat: "Speaking", theme: "Interview Pro", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&q=75", locked: false, done: false },
  { id: 13, title: "Talk to Professor", cat: "Speaking", theme: "Interview Pro", img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&q=75", locked: false, done: false },
  { id: 14, title: "Public Speaking Practice", cat: "Speaking", theme: "Interview Pro", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=75", locked: true, done: false },

  // Theme: Work Place (8)
  { id: 15, title: "Chat with Co-workers", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=75", locked: false, done: false },
  { id: 16, title: "Talk in Team Meetings", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=500&q=75", locked: false, done: false },
  { id: 17, title: "Approve a Request", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&q=75", locked: false, done: false },
  { id: 18, title: "Give Feedback to Team", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1531535934027-687f1434643a?w=500&q=75", locked: false, done: false },
  { id: 19, title: "Office Conversation", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=75", locked: false, done: false },
  { id: 20, title: "Business Meeting", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=500&q=75", locked: false, done: false },
  { id: 21, title: "Customer Support Conversation", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=500&q=75", locked: false, done: false },
  { id: 22, title: "Debate Practice", cat: "Speaking", theme: "Work Place", img: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=75", locked: true, done: false },

  // Theme: Daily Life (19)
  { id: 23, title: "Make New Friends", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=75", locked: false, done: false },
  { id: 24, title: "Plan a Family Dinner", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=500&q=75", locked: false, done: false },
  { id: 25, title: "Make Weekend Plans", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&q=75", locked: false, done: false },
  { id: 26, title: "Console a Friend", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=75", locked: false, done: false },
  { id: 27, title: "Airport Check-in", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=75", locked: false, done: false },
  { id: 28, title: "Speak with Flight Attendant", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=500&q=75", locked: false, done: false },
  { id: 29, title: "Ask for Help in a City", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=75", locked: false, done: false },
  { id: 30, title: "Hotel Check-in", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=75", locked: false, done: false },
  { id: 31, title: "Meet Child’s Teacher", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&q=75", locked: false, done: false },
  { id: 32, title: "Discuss Exam Results", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=75", locked: false, done: false },
  { id: 33, title: "Restaurant Conversation", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=75", locked: false, done: true },
  { id: 34, title: "Shopping Conversation", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=75", locked: false, done: false },
  { id: 35, title: "Travel Discussion", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=500&q=75", locked: false, done: false },
  { id: 36, title: "Phone Conversation", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=500&q=75", locked: false, done: false },
  { id: 37, title: "Doctor Appointment", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1584516150909-c43483ee7932?w=500&q=75", locked: false, done: false },
  { id: 38, title: "Bank Conversation", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=500&q=75", locked: false, done: false },
  { id: 39, title: "Group Discussion", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=75", locked: true, done: false },
  { id: 40, title: "Storytelling Practice", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=75", locked: true, done: false },
  { id: 41, title: "English Speaking Challenge", cat: "Speaking", theme: "Daily Life", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=75", locked: true, done: false }
];

export const THEMES: Theme[] = [
  { name: "About Yourself", count: 9, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=75&fit=crop&crop=faces" },
  { name: "Interview Pro",  count: 5,  img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=75&fit=crop&crop=faces" },
  { name: "Work Place",     count: 8,  img: "https://images.unsplash.com/photo-14973662216548-37526070297c?w=200&q=75&fit=crop&crop=faces" },
  { name: "Daily Life",     count: 19, img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200&q=75&fit=crop&crop=faces" },
];

export const NEWS: NewsItem[] = [
  { id: 1, title: "Hyderabad: Goat, Sheep Prices Soar Ahead of Bakrid festivals", date: "Today", src: "Deccan Chronicle", img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=70", comment: "Prices are really soaring high. Heavy demand!", name: "Kritika", commenters: 102, color: "#FF6B6B" },
  { id: 2, title: "HDFC Bank shares recover amid payments probe updates in Mumbai", date: "Yesterday", src: "Indian Express", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=70", comment: "Hope the banking sector goes bullish soon, guys.", name: "Shreyash", commenters: 57, color: "#4ECDC4" },
  { id: 3, title: "Byju Raveendran's lessons: How the top educational brand became a cautionary tech tale", date: "2 days ago", src: "Indian Express", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=70", comment: "This reveals that rapid growth requires strict governance.", name: "Isha", commenters: 46, color: "#A29BFE" },
  { id: 4, title: "Nestlé India introduces 'Chief Happiness Officers' for employee wellness", date: "3 days ago", src: "Indian Express", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=70", comment: "Having pets in offices decreases working stress!", name: "Hriday", commenters: 54, color: "#FDCB6E" },
];

export const QUOTES = [
  "Sometimes the biggest change in life begins with one simple thought: 'Yes, I can.'",
  "Not every answer comes immediately. Practice and patience build true fluency.",
  "Every English word you learn is another doorway to connect with global opportunities."
];
