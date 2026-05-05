import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Camera, Paperclip, MessageSquare, Loader2, Volume2, Languages, Settings, Clock, Info, RefreshCw, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import './FarmerDashboard.css';

// Comprehensive Rule-Based Knowledge Base (20+ Q&A per language)
const agriculturalKB = {
  en: [
    { keywords: ["wheat", "yellow", "leaf"], answer: "Yellowing of wheat leaves often indicates Nitrogen deficiency or Rust disease. Apply Urea (40kg/acre) and check for orange pustules. ![Wheat Rust](https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["water", "irrigation", "rice"], answer: "Rice requires constant moisture. During the tillering stage, maintain 2-3 cm of water depth. Avoid over-flooding during the ripening stage. ![Rice Irrigation](https://images.unsplash.com/photo-1536633100187-578f56476f5f?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["cotton", "pest", "bollworm"], answer: "For Pink Bollworm in cotton, use pheromone traps (5 per acre) and spray Profenophos 50EC if the infestation exceeds 10%. ![Cotton Pest](https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["soil", "test", "health"], answer: "Soil testing should be done every 2 years. Collect samples from 15cm depth across 10 spots in your farm. ![Soil Test](https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["tomato", "blight"], answer: "Early blight in tomatoes causes brown spots with concentric rings. Use Mancozeb or Copper Oxychloride sprays every 10 days. ![Tomato Blight](https://images.unsplash.com/photo-1592841608277-742074ed0d06?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["fertilizer", "organic", "manure"], answer: "Vermicompost is excellent for soil health. Apply 2-3 tons per acre before sowing for best results. ![Organic Farming](https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["weather", "rain", "forecast"], answer: "Always monitor the IMD forecast before applying fertilizers or pesticides. Heavy rain can wash away chemicals. ![Rainy Farm](https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["subsidy", "government", "scheme"], answer: "Check PM-KISAN for direct income support and PMFBY for crop insurance. Visit your local KVK for registration details. ![Govt Scheme](https://images.unsplash.com/photo-1473976140391-450bc96e2794?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["mango", "flowering"], answer: "To prevent flower drop in mango, avoid heavy irrigation during flowering and spray NAA (Planofix) 20 ppm. ![Mango Farm](https://images.unsplash.com/photo-1553272725-086100aecf5e?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["onion", "storage"], answer: "Onions should be stored in well-ventilated bamboo structures (Chawls). Avoid direct sunlight and maintain low humidity. ![Onion Storage](https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["pesticide", "safety"], answer: "Always wear gloves and masks while spraying. Spray in the direction of the wind and never against it. ![Safety First](https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["potato", "seed"], answer: "Use certified disease-free seed tubers. Treat with Carbendazim before planting to prevent rot. ![Potato Seed](https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["drip", "irrigation"], answer: "Drip irrigation saves up to 50% water. It is ideal for orchards and wide-spaced crops like sugarcane. ![Drip System](https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["sugarcane", "planting"], answer: "Plant sets with 2-3 buds. Spacing should be 90cm to 120cm between rows for better sunlight penetration. ![Sugarcane](https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["pomegranate", "oily", "spot"], answer: "Bacterial Oily Spot is serious. Prune infected branches and spray Streptocycline with Copper Oxychloride. ![Pomegranate](https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["chilli", "leaf", "curl"], answer: "Leaf curl is caused by thrips and mites. Use Neem oil spray or Imidacloprid for effective control. ![Chilli Curl](https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["seed", "treatment"], answer: "Treating seeds with Trichoderma viride prevents soil-borne diseases and improves germination rates. ![Seed Treatment](https://images.unsplash.com/photo-1523348830342-d51c481224da?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["market", "price"], answer: "Use the e-NAM portal to check real-time market prices across different Mandis to get the best deal. ![Market Price](https://images.unsplash.com/photo-1488459711615-de6175b09f7a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["banana", "fertilizer"], answer: "Banana is a heavy feeder. Apply 200g Nitrogen, 50g Phosphorus, and 300g Potassium per plant in split doses. ![Banana Tree](https://images.unsplash.com/photo-1528510138833-938810bf3002?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["solar", "pump"], answer: "Solar pumps are highly cost-effective. You can get up to 60-90% subsidy under the KUSUM scheme. ![Solar Pump](https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800)" }
  ],
  hi: [
    { keywords: ["गेहूं", "पीला", "पत्ता"], answer: "गेहूं के पत्तों का पीलापन अक्सर नाइट्रोजन की कमी या रतुआ (Rust) रोग का संकेत देता है। यूरिया (40 किलो/एकड़) डालें। ![गेहूं](https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["पानी", "सिंचाई", "चावल"], answer: "धान को निरंतर नमी की आवश्यकता होती है। कल्ले फूटते समय 2-3 सेमी पानी का स्तर बनाए रखें। ![धान की सिंचाई](https://images.unsplash.com/photo-1536633100187-578f56476f5f?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["कपास", "कीट", "गुलाबी"], answer: "कपास में गुलाबी सुंडी के लिए फेरोमोन ट्रैप (5 प्रति एकड़) का उपयोग करें। ![कपास](https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["मिट्टी", "जांच"], answer: "मिट्टी की जांच हर 2 साल में होनी चाहिए। अपने खेत के 10 स्थानों से 15 सेमी गहराई से नमूने लें। ![मिट्टी जांच](https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["टमाटर", "झुलसा"], answer: "टमाटर में अगेती झुलसा भूरे धब्बे पैदा करता है। हर 10 दिन में मैंकोजेब का छिड़काव करें। ![टमाटर](https://images.unsplash.com/photo-1592841608277-742074ed0d06?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["खाद", "जैविक"], answer: "वर्मीकम्पोस्ट मिट्टी के स्वास्थ्य के लिए उत्कृष्ट है। बुवाई से पहले प्रति एकड़ 2-3 टन डालें। ![जैविक खेती](https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["मौसम", "बारिश"], answer: "खाद या कीटनाशक डालने से पहले हमेशा मौसम के पूर्वानुमान की जांच करें। ![बारिश](https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["सब्सिडी", "सरकारी", "योजना"], answer: "सीधे आय सहायता के लिए पीएम-किसान और फसल बीमा के लिए पीएमएफबीवाई की जांच करें। ![सरकारी योजना](https://images.unsplash.com/photo-1473976140391-450bc96e2794?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["आम", "फूल"], answer: "आम में फूल झड़ने से रोकने के लिए, फूल आने के दौरान भारी सिंचाई से बचें। ![आम का बाग](https://images.unsplash.com/photo-1553272725-086100aecf5e?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["प्याज", "भंडारण"], answer: "प्याज को हवादार बांस की संरचनाओं (चावल) में संग्रहित किया जाना चाहिए। ![प्याज भंडारण](https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["कीटनाशक", "सुरक्षा"], answer: "छिड़काव करते समय हमेशा दस्ताने और मास्क पहनें। हवा की दिशा में छिड़काव करें। ![सुरक्षा](https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["आलू", "बीज"], answer: "प्रमाणित रोगमुक्त बीज कंदों का उपयोग करें। रोपण से पहले कार्बेन्डाजिम से उपचार करें। ![आलू बीज](https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["ड्रिप", "सिंचाई"], answer: "ड्रिप सिंचाई 50% तक पानी बचाती है। यह गन्ने जैसी फसलों के लिए आदर्श है। ![ड्रिप सिस्टम](https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["गन्ना", "बुवाई"], answer: "2-3 कलियों वाले सेट लगाएं। पंक्तियों के बीच की दूरी 90 सेमी से 120 सेमी होनी चाहिए। ![गन्ना](https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["अनार", "धब्बा"], answer: "बैक्टीरियल ऑयली स्पॉट गंभीर है। संक्रमित शाखाओं को काटें और कॉपर ऑक्सीक्लोराइड का छिड़काव करें। ![अनार](https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["मिर्च", "मरोड़िया"], answer: "पत्ता मरोड़ रोग थ्रिप्स और माइट्स के कारण होता है। नीम के तेल का छिड़काव करें। ![मिर्च](https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["बीज", "उपचार"], answer: "ट्राइकोडर्मा विरिडी से बीजों का उपचार करने से मिट्टी से होने वाले रोगों से बचाव होता है। ![बीज उपचार](https://images.unsplash.com/photo-1523348830342-d51c481224da?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["बाजार", "भाव"], answer: "सर्वोत्तम सौदा पाने के लिए विभिन्न मंडियों में वास्तविक समय की कीमतें देखने हेतु ई-नाम पोर्टल का उपयोग करें। ![बाजार भाव](https://images.unsplash.com/photo-1488459711615-de6175b09f7a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["केला", "उर्वरक"], answer: "केला एक भारी फीडर है। प्रति पौधा 200 ग्राम नाइट्रोजन और 300 ग्राम पोटेशियम अलग-अलग खुराकों में डालें। ![केला](https://images.unsplash.com/photo-1528510138833-938810bf3002?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["सौर", "पंप"], answer: "सौर पंप अत्यधिक लागत प्रभावी हैं। आप कुसुम योजना के तहत 90% तक सब्सिडी प्राप्त कर सकते हैं। ![सौर पंप](https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800)" }
  ],
  mr: [
    { keywords: ["गहू", "पिवळा", "पान"], answer: "गव्हाच्या पानांचा पिवळेपणा अनेकदा नायट्रोजनची कमतरता किंवा तांबेरा रोगाचा संकेत असतो. युरिया (40 किलो/एकर) वापरा. ![गहू](https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["पाणी", "सिंचन", "भात"], answer: "भाताला सतत ओलावा आवश्यक असतो. फुटवे येण्याच्या काळात 2-3 सेमी पाण्याची खोली ठेवा. ![भात शेती](https://images.unsplash.com/photo-1536633100187-578f56476f5f?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["कापूस", "कीड", "बोंडअळी"], answer: "कापसातील गुलाबी बोंडअळीसाठी कामगंध सापळे (एकर 5) वापरा आणि प्रादुर्भाव वाढल्यास फवारणी करा. ![कापूस](https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["माती", "परीक्षण"], answer: "माती परीक्षण दर 2 वर्षांनी केले पाहिजे. शेतातील 10 ठिकाणांहून 15 सेमी खोलीवरून नमुने गोळा करा. ![माती परीक्षण](https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["टोमॅटो", "करपा"], answer: "टोमॅटोमधील करपा रोगामुळे तपकिरी ठिपके येतात. दर 10 दिवसांनी मॅन्कोझेबची फवारणी करा. ![टोमॅटो](https://images.unsplash.com/photo-1592841608277-742074ed0d06?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["खत", "सेंद्रिय"], answer: "गांडूळ खत जमिनीच्या आरोग्यासाठी उत्कृष्ट आहे. पेरणीपूर्वी एकरी 2-3 टन वापरा. ![सेंद्रिय शेती](https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["हवामान", "पाऊस"], answer: "खते किंवा कीटकनाशके वापरण्यापूर्वी नेहमी हवामान अंदाज तपासा. मुसळधार पावसामुळे रसायने वाहून जाऊ शकतात. ![पाऊस](https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["सबसिडी", "शासकीय", "योजना"], answer: "थेत उत्पन्न मदतीसाठी पीएम-किसान आणि पीक विम्यासाठी पीएमएफबीवाई तपासा. ![शासकीय योजना](https://images.unsplash.com/photo-1473976140391-450bc96e2794?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["आंबा", "मोहोर"], answer: "आंब्यातील मोहोर गळती रोखण्यासाठी, मोहोर येण्याच्या काळात जास्त सिंचन टाळा. ![आंबा बाग](https://images.unsplash.com/photo-1553272725-086100aecf5e?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["कांदा", "साठवणूक"], answer: "कांदा हवेशीर बांबूच्या संरचनेत (चाळीत) साठवला पाहिजे. थेट सूर्यप्रकाश टाळा. ![कांदा साठवणूक](https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["कीटकनाशक", "सुरक्षा"], answer: "फवारणी करताना नेहमी हातमोजे आणि मास्क वापरा. वाऱ्याच्या दिशेने फवारणी करा. ![सुरक्षा](https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["बटाटा", "बियाणे"], answer: "प्रमाणित रोगमुक्त बियाणे वापरा. कुजणे रोखण्यासाठी लागवडीपूर्वी कार्बेन्डाझिमने प्रक्रिया करा. ![बटाटा](https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["ठिबक", "सिंचन"], answer: "ठिबक सिंचनामुळे 50% पर्यंत पाण्याची बचत होते. ऊसासारख्या पिकांसाठी हे आदर्श आहे. ![ठिबक सिंचन](https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["ऊस", "लागवड"], answer: "2-3 डोळे असलेली कांडी वापरा. ओळींमधील अंतर 90 सेमी ते 120 सेमी असावे. ![ऊस](https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["डाळिंब", "तेलकट", "डाग"], answer: "तेलकट डाग रोग गंभीर आहे. बाधित फांद्या छाटा आणि कॉपर ऑक्सीक्लोराइडची फवारणी करा. ![डाळिंब](https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["मिरची", "चुरडा", "मुरडा"], answer: "पाने आकसणे हा रोग फुलकिडे आणि कोळीमुळे होतो. कडुनिंबाच्या तेलाची फवारणी करा. ![मिरची](https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["बियाणे", "प्रक्रिया"], answer: "ट्रायकोडर्मा व्हिरीडीने बियाणे प्रक्रिया केल्याने मातीतून होणारे रोग टाळता येतात. ![बियाणे प्रक्रिया](https://images.unsplash.com/photo-1523348830342-d51c481224da?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["बाजार", "भाव"], answer: "उत्तम दर मिळवण्यासाठी विविध मंड्यांमधील रिअल-टाइम किमती पाहण्यासाठी ई-नाम पोर्टल वापरा. ![बाजार भाव](https://images.unsplash.com/photo-1488459711615-de6175b09f7a?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["केळी", "खत"], answer: "केळीला खतांची जास्त गरज असते. प्रति झाड 200 ग्रॅम नत्र आणि 300 ग्रॅम पालाश विभागून द्या. ![केळी](https://images.unsplash.com/photo-1528510138833-938810bf3002?auto=format&fit=crop&q=80&w=800)" },
    { keywords: ["सौर", "पंप"], answer: "सौर पंप अत्यंत किफायतशीर आहेत. कुसुम योजनेअंतर्गत तुम्हाला 90% पर्यंत सबसिडी मिळू शकते. ![सौर पंप](https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800)" }
  ]
};

// Gemini API Config (DISABLED as per user request - 100% Rule-Based now)
const API_KEY = "DISABLED";
const GEMINI_URL = "";
const FALLBACK_URL = "";

const API_BASE_URL = "http://localhost:5001";

const FarmerDashboard = () => {
  const { user } = useUser();
  const { language: lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    { id: 1, text: t('welcome'), sender: 'ai', time: 'Just now' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [escalations, setEscalations] = useState([]);
  const [confidence, setConfidence] = useState(95);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const fetchMyEscalations = async () => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/escalations/farmer/${user.email}`);
      setEscalations(response.data);
    } catch (err) {
      console.error("Failed to fetch my escalations:", err);
    }
  };

  useEffect(() => {
    fetchMyEscalations();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchMyEscalations, 10000);
    return () => clearInterval(interval);
  }, [user?.email]);

  useEffect(() => {
    console.log("Checking API Key availability...");
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      console.warn("VITE_GEMINI_API_KEY is not defined in .env or environment!");
    } else {
      console.log("API Key found (starts with):", import.meta.env.VITE_GEMINI_API_KEY.substring(0, 5) + "...");
    }
  }, []);

  // Update initial message when language changes if no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'ai') {
      setMessages([{ id: 1, text: t('welcome'), sender: 'ai', time: 'Just now' }]);
    }
  }, [lang, t]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';
    }
  }, [lang]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown image syntax and URLs before speaking
      const plainText = text.replace(/!\[.*?\]\(.*?\)/g, '').replace(/https?:\/\/\S+/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      
      // Set language code
      const langCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';
      utterance.lang = langCode;

      // Find a matching voice if possible
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
      if (voice) utterance.voice = voice;

      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMessage = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Improved Rule-Based Matching (Partial matches & Keywords)
      const lowerText = userText.toLowerCase();
      
      // Find the best matching rule based on how many keywords are present
      let bestMatch = null;
      let maxKeywords = 0;

      agriculturalKB[lang].forEach(rule => {
        const matchCount = rule.keywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
        if (matchCount > maxKeywords) {
          maxKeywords = matchCount;
          bestMatch = rule;
        }
      });

      let responseText = "";

      if (bestMatch && maxKeywords >= 1) {
        console.log("Rule-based match found with score:", maxKeywords);
        responseText = bestMatch.answer;
      } else {
        // Fallback for non-rule questions
        responseText = lang === 'hi' 
          ? "माफ़ कीजिये, मैं इस बारे में अभी नहीं जानता। कृपया गेहूं, चावल, कपास, मिट्टी या सरकारी योजनाओं के बारे में पूछें। आप 'विशेषज्ञ से बात करें' बटन का उपयोग भी कर सकते हैं।" 
          : lang === 'mr'
          ? "क्षमस्व, मला याबद्दल अद्याप माहिती नाही. कृपया गहू, भात, कापूस, माती किंवा सरकारी योजनांबद्दल विचारा. आपण 'तज्ज्ञांशी बोला' बटण देखील वापरू शकता."
          : "I'm sorry, I don't have information on that topic yet. Please try asking about wheat, rice, cotton, soil health, or government schemes. You can also use the 'Talk to Expert' button.";
      }

      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setConfidence(Math.floor(Math.random() * (98 - 90 + 1)) + 90);
      speak(responseText);
    } catch (error) {
      console.error("Gemini Error Details:", error);
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || "I'm having trouble connecting right now."} Please ensure the API key is correct and the dev server has been restarted.`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };


  const renderMessageContent = (text) => {
    // Better regex to find markdown images
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(text)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        elements.push(<p key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</p>);
      }
      
      // Add the image
      const alt = match[1];
      const url = match[2];
      elements.push(
        <motion.img 
          key={`img-${match.index}`}
          src={url} 
          alt={alt || "AgriAI Info"}
          className="chat-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onError={(e) => {
            console.error("Image load failed:", url);
            e.target.src = "https://images.unsplash.com/photo-1495107336214-bca9f1635f43?auto=format&fit=crop&q=80&w=800"; // Fallback farm image
          }}
        />
      );
      lastIndex = imgRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<p key={`text-${lastIndex}`}>{text.substring(lastIndex)}</p>);
    }

    return elements;
  };

  const handleEscalate = async () => {
    // Get the last user message to escalate
    const userMessages = messages.filter(m => m.sender === 'user');
    const lastQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].text : "I need expert advice on my farm.";

    try {
      setIsTyping(true);
      await axios.post(`${API_BASE_URL}/escalate`, {
        email: user?.email || "anonymous",
        name: user?.name || "Farmer",
        query: lastQuery
      });

      const aiMessage = {
        id: Date.now(),
        text: lang === 'hi' ? "मैं यह प्रश्न अपने विशेषज्ञों को भेज रहा हूँ। वे जल्द ही आपसे संपर्क करेंगे।" : lang === 'mr' ? "मी हा प्रश्न आमच्या तज्ज्ञांकडे पाठवत आहे. ते लवकरच तुमच्याशी संपर्क साधतील." : "I am transferring this query to our experts. They will get back to you shortly.",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      speak(aiMessage.text);
      fetchMyEscalations(); // Refresh history
    } catch (err) {
      console.error("Escalation Error:", err);
      alert("Failed to escalate: " + (err.response?.data?.message || err.message));
    } finally {
      setIsTyping(false);
    }
  };

  const handleHistoryItemClick = (esc) => {
    if (esc.status === 'answered' && esc.answer) {
      const expertMsg = {
        id: Date.now(),
        text: `👨‍🌾 **Expert Response to:** "${esc.query}"\n\n${esc.answer}`,
        sender: 'ai',
        time: 'Just now'
      };
      setMessages(prev => [...prev, expertMsg]);
      speak(`The expert answered: ${esc.answer}`);
    } else {
      const pendingMsg = {
        id: Date.now(),
        text: `Your query "${esc.query.substring(0, 30)}..." is still being reviewed by our agricultural experts. Please wait.`,
        sender: 'ai',
        time: 'Just now'
      };
      setMessages(prev => [...prev, pendingMsg]);
    }
  };

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('profileData_Farmer');
    if (stored) setProfileData(JSON.parse(stored));
  }, []);

  return (
    <div className="farmer-dashboard simple-bg">
      <Navbar />
      <div className="dashboard-content">
        <div className="sidebar">
          <motion.div 
            className="stats-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card-header-icon">
              <Settings size={20} />
              <h3>{t('status')}</h3>
            </div>
            <div className="stat-item">
              <span>{t('healthIndex')}</span>
              <div className="progress-bar"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '85%' }} /></div>
            </div>
            <div className="stat-item">
              <span>{t('soilMoisture')}</span>
              <div className="progress-bar"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '62%' }} style={{ background: '#3498db' }} /></div>
            </div>
          </motion.div>

          <motion.div 
            className="history-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-header-icon">
              <Clock size={20} />
              <h3>{t('recentQueries')}</h3>
              <button className="refresh-mini-btn" onClick={fetchMyEscalations}>
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="history-list">
              {escalations.length > 0 ? escalations.map(esc => (
                <motion.div 
                  key={esc.id} 
                  className={`history-item ${esc.status}`} 
                  onClick={() => handleHistoryItemClick(esc)}
                  whileHover={{ x: 5 }}
                >
                  <div className="history-text">
                    <p>{esc.query.substring(0, 30)}...</p>
                    <span className={esc.status}>
                      {esc.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {esc.status === 'pending' ? 'Pending' : 'Answered'}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="history-item empty">No recent escalations</div>
              )}
            </div>
          </motion.div>
          
          <motion.button 
            className="escalate-btn" 
            onClick={handleEscalate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={20} />
            {t('talkToExpert')}
          </motion.button>
        </div>

        <div className="main-chat">
          <div className="chat-header">
            <div className="ai-info">
              <div className="ai-avatar"><MessageSquare /></div>
              <div>
                <h4>{t('aiAssistant')}</h4>
                <p>{t('online')}</p>
              </div>
            </div>
            <div className="confidence-meter">
              <span>{t('confidence') || 'Confidence'}: {confidence}%</span>
              <div className={`meter-dot ${confidence > 80 ? 'high' : 'low'}`} />
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                className={`message-wrapper ${msg.sender}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <div className="message-bubble">
                  <div className="bubble-text">
                    {renderMessageContent(msg.text)}
                  </div>
                  <div className="bubble-footer">
                    <span className="msg-time">{msg.time}</span>
                    {msg.sender === 'ai' && <button className="voice-btn" onClick={() => speak(msg.text)}><Volume2 size={14} /></button>}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div className="message-wrapper ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="message-bubble typing">
                  <Loader2 className="spin" size={18} />
                  <span>{t('analyzing')}</span>
                </div>
              </motion.div>
            )}
            {isListening && (
              <motion.div className="message-wrapper user" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="message-bubble listening">
                  <Mic className="pulse" size={18} />
                  <span>{t('listening')}</span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <div className="input-actions">
              <button type="button" className="action-btn"><Camera size={20} /></button>
              <button 
                type="button" 
                className={`action-btn ${isListening ? 'active-mic' : ''}`}
                onClick={startListening}
              >
                <Mic size={20} />
              </button>
              <button type="button" className="action-btn"><Paperclip size={20} /></button>
            </div>
            <input 
              type="text" 
              placeholder={t('askAi')} 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>

        <div className="right-sidebar">
          {profileData && (
            <motion.div 
              className="profile-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3>Farmer Profile</h3>
              <div className="profile-info-list">
                <div className="info-item">
                  <label>{t('fullName')}</label>
                  <p>{profileData.fullName}</p>
                </div>
                <div className="info-item">
                  <label>{t('region')}</label>
                  <p>{profileData.region}</p>
                </div>
                <div className="info-item">
                  <label>{t('crops')}</label>
                  <p>{profileData.crops}</p>
                </div>
                <div className="info-item">
                  <label>{t('experience')}</label>
                  <p>{profileData.experience} {t('years')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
