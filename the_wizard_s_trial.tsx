import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  User, 
  Plus, 
  Zap, 
  Heart, 
  Coins, 
  FlaskConical, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sword, 
  Skull,
  Trophy,
  History,
  Info,
  ChevronRight,
  Target,
  Moon,
  Droplets,
  Dumbbell,
  GraduationCap,
  Flame,
  Wind,
  CloudRain,
  Snowflake,
  Star,
  Eye,
  Lock,
  Gem,
  Crown,
  Coffee,
  Shield,
  Timer,
  Beaker,
  PlusCircle,
  MinusCircle,
  Settings2,
  Edit3,
  Skull as SkullIcon,
  Trash2,
  Swords,
  Play,
  Square,
  Sparkle
} from 'lucide-react';

// --- Constants & Data ---
const HOUSES = {
  gryffindor: { name: 'Gryffindor', color: 'bg-red-900', secondary: 'bg-amber-600', text: 'text-red-400', border: 'border-red-700', accent: '#991b1b' },
  slytherin: { name: 'Slytherin', color: 'bg-emerald-900', secondary: 'bg-slate-500', text: 'text-emerald-400', border: 'border-emerald-700', accent: '#064e3b' },
  ravenclaw: { name: 'Ravenclaw', color: 'bg-blue-900', secondary: 'bg-orange-400', text: 'text-blue-400', border: 'border-blue-700', accent: '#1e3a8a' },
  hufflepuff: { name: 'Hufflepuff', color: 'bg-amber-900', secondary: 'bg-black', text: 'text-amber-400', border: 'border-amber-700', accent: '#78350f' }
};

const SPELL_LIBRARY = {
  Easy: [
    { name: 'Lumos', icon: <Sparkles size={14} />, desc: 'Light - Reveals +1 Galleon', baseDmg: 10 },
    { name: 'Alohomora', icon: <Lock size={14} />, desc: 'Unlocking - Finds +1 Galleon', baseDmg: 10 },
    { name: 'Aguamenti', icon: <Droplets size={14} />, desc: 'Water - Summons +1 Galleon', baseDmg: 10 },
    { name: 'Wingardium', icon: <Wind size={14} />, desc: 'Levitation - Lifts +1 Galleon', baseDmg: 10 }
  ],
  Medium: [
    { name: 'Expelliarmus', icon: <Zap size={14} />, desc: 'Disarm - Negates 1 DMG penalty', baseDmg: 25 },
    { name: 'Incendio', icon: <Flame size={14} />, desc: 'Fire - Negates 1 DMG penalty', baseDmg: 25 },
    { name: 'Glacius', icon: <Snowflake size={14} />, desc: 'Freeze - Negates 1 DMG penalty', baseDmg: 25 },
    { name: 'Diffindo', icon: <Sword size={14} />, desc: 'Sever - Negates 1 DMG penalty', baseDmg: 25 }
  ],
  Hard: [
    { name: 'Confringo', icon: <Flame size={14} className="text-orange-500" />, desc: 'Explosion - +10 House Points', baseDmg: 60 },
    { name: 'Stupefy', icon: <Zap size={14} className="text-red-500" />, desc: 'Stun - +10 House Points', baseDmg: 60 },
    { name: 'Bombarda', icon: <Target size={14} className="text-slate-400" />, desc: 'Blast - +10 House Points', baseDmg: 60 },
    { name: 'Revelio', icon: <Eye size={14} className="text-blue-400" />, desc: 'Reveal - +10 House Points', baseDmg: 60 }
  ],
  Legendary: [
    { name: 'Expecto Patronum', icon: <Star size={14} className="text-cyan-300" />, desc: 'Guardian - Heals 25% missing HP', baseDmg: 150 },
    { name: 'Avada Kedavra', icon: <SkullIcon size={14} className="text-emerald-500" />, desc: 'Darkness - Heals 25% missing HP', baseDmg: 500 },
    { name: 'Ancient Magic', icon: <Sparkles size={14} className="text-amber-400" />, desc: 'Primordial - Heals 25% missing HP', baseDmg: 200 }
  ]
};

const SPELL_TIERS = {
  Easy: { name: 'Cantrip', xp: 10, requirement: 3, effect: "gold", cooldown: 3000 },
  Medium: { name: 'Charm', xp: 25, requirement: 3, effect: "shield", cooldown: 8000 },
  Hard: { name: 'Hex', xp: 50, requirement: 3, effect: "points", cooldown: 15000 },
  Legendary: { name: 'Ancient', xp: 200, requirement: 1, effect: "heal", cooldown: 30000 }
};

const ENEMIES = [
  { id: 'e1', name: "The Midnight Duelist", hp: 100, dmg: 10, reward: 50, level: 1, icon: <Skull className="text-purple-500" />, desc: "A rogue student practicing dark arts." },
  { id: 'e2', name: "Forest Troll", hp: 450, dmg: 18, reward: 150, level: 3, icon: <Skull className="text-emerald-600" />, desc: "Massive and dim-witted, but hits hard." },
  { id: 'e3', name: "Ancient Specter", hp: 1200, dmg: 30, reward: 500, level: 7, icon: <Skull className="text-slate-400" />, desc: "A ghost of a wizard who refused to leave." },
  { id: 'e4', name: "Dark Lord Acolyte", hp: 4000, dmg: 55, reward: 1500, level: 15, icon: <Skull className="text-red-600" />, desc: "One of the chosen servants of the Dark Lord." },
  { id: 'e5', name: "Basilic Fragment", hp: 10000, dmg: 100, reward: 5000, level: 30, icon: <Skull className="text-green-900" />, desc: "A lingering echo of ancient venom." }
];

const SHOP_ITEMS = [
  { id: 'pot_1', name: 'Wiggenweld Potion', price: 50, type: 'consumable', bonus: 20, desc: 'Heals 20 HP' },
  { id: 'luck_1', name: 'Lucky Rabbit Foot', price: 150, type: 'charm', bonus: 1, desc: '+1% Success Rate' },
  { id: 'wand_1', name: 'Phoenix Core Wand', price: 1000, type: 'wand', bonus: 3, desc: '+3% Success Rate' },
  { id: 'robe_1', name: 'Student Cloak', price: 1200, type: 'armor', bonus: 15, desc: '+15 Max HP' },
  { id: 'hat_1', name: 'Pointy Hat', price: 1800, type: 'hat', bonus: 5, desc: '+5% XP Multiplier' },
  { id: 'wand_2', name: 'Elder Wood Wand', price: 5000, type: 'wand', bonus: 8, desc: '+8% Success Rate' },
  { id: 'robe_2', name: 'Dragonhide Robes', price: 7500, type: 'armor', bonus: 50, desc: '+50 Max HP' }
];

const SORTING_QUESTIONS = [
  {
    id: 1,
    q: "When faced with a difficult habit you've been avoiding, you:",
    options: [
      { t: "Tackle it head-on with a burst of energy.", h: 'gryffindor' },
      { t: "Research the most efficient way and plan.", h: 'ravenclaw' },
      { t: "Put your head down and work steadily.", h: 'hufflepuff' },
      { t: "Focus on how it helps your ultimate power goal.", h: 'slytherin' }
    ]
  },
  {
    id: 2,
    q: "Which magical reward motivates you the most?",
    options: [
      { t: "The glory of winning the House Cup.", h: 'gryffindor' },
      { t: "Unlocking secret libraries and complex spells.", h: 'ravenclaw' },
      { t: "A cozy common room and a loyal pet.", h: 'hufflepuff' },
      { t: "Rising to the rank of Archmage.", h: 'slytherin' }
    ]
  },
  {
    id: 3,
    q: "What is your greatest strength in \"The Real World\"?",
    options: [
      { t: "My courage to try new things and take risks.", h: 'gryffindor' },
      { t: "My curiosity and love for learning new skills.", h: 'ravenclaw' },
      { t: "My reliability and willingness to help others.", h: 'hufflepuff' },
      { t: "My ambition and focus on getting results.", h: 'slytherin' }
    ]
  }
];

const ITEM_ARTWORK = {
  pot_1: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 14H38M32 14V22" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 24C22 24 16 32 16 44C16 52 22 56 32 56C42 56 48 52 48 44C48 32 42 24 42 24H22Z" fill="#10B981" fillOpacity="0.2" stroke="#34D399" strokeWidth="2.5" strokeLinejoin="round"/>
      <ellipse cx="32" cy="46" rx="10" ry="6" fill="#059669" fillOpacity="0.4"/>
      <circle cx="28" cy="36" r="2" fill="#A7F3D0"/>
      <circle cx="36" cy="40" r="1.5" fill="#A7F3D0"/>
      <circle cx="31" cy="28" r="1" fill="#A7F3D0"/>
      <path d="M20 28H44" stroke="#34D399" strokeWidth="1.5" strokeDasharray="2 2"/>
    </svg>
  ),
  luck_1: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8V24" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="36" r="12" fill="#FBBF24" fillOpacity="0.1" stroke="#FBBF24" strokeWidth="2.5"/>
      <path d="M32 28V44M24 36H40" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 30L38 42M38 30L26 42" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="32" cy="36" r="3" fill="#FFFBEB"/>
    </svg>
  ),
  wand_1: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 52L44 20" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M44 20L48 16" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="48" cy="16" r="4" fill="#EF4444"/>
      <path d="M48 8L46 12M56 16L52 18M48 24L49 20" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  robe_1: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 16H46L54 52H10L18 16Z" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M32 16V52" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="4 4"/>
      <circle cx="32" cy="20" r="3" fill="#FBBF24"/>
      <path d="M22 16C22 16 26 24 32 24C38 24 42 16 42 16" stroke="#3B82F6" strokeWidth="2"/>
    </svg>
  ),
  hat_1: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 48C20 48 24 44 32 20C34 14 30 8 34 8C38 8 36 14 38 20C46 44 50 48 52 48" fill="#6366F1" fillOpacity="0.1" stroke="#6366F1" strokeWidth="2.5" strokeLinejoin="round"/>
      <ellipse cx="32" cy="48" rx="22" ry="6" fill="#4F46E5" fillOpacity="0.3" stroke="#6366F1" strokeWidth="2.5"/>
      <rect x="26" y="38" width="12" height="4" fill="#FBBF24" rx="1"/>
      <path d="M32 12L34 14M38 10L36 12" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  wand_2: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 54L48 16" stroke="#1E293B" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="20" cy="44" r="3" fill="#D97706"/>
      <circle cx="30" cy="34" r="3" fill="#D97706"/>
      <circle cx="40" cy="24" r="3" fill="#D97706"/>
      <circle cx="48" cy="16" r="5" fill="#60A5FA" className="animate-ping"/>
      <circle cx="48" cy="16" r="3" fill="#FFF"/>
      <path d="M48 6V12M58 16H52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  robe_2: (
    <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 14H48L56 54H8L16 14Z" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 14L24 54M48 14L40 54" stroke="#047857" strokeWidth="1.5"/>
      <path d="M26 22L32 18L38 22M24 32L32 28L40 32M22 42L32 38L42 42" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="14" r="4" fill="#EF4444"/>
    </svg>
  )
};

// --- Top Level Component Helpers ---

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[60px] ${active ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 active:scale-90'}`}>
    {React.cloneElement(icon, { size: 20, className: active ? 'animate-pulse' : '' })}
    <span className="text-[8px] mt-1 font-serif uppercase font-bold tracking-tighter">{label}</span>
  </button>
);

const TaskItem = memo(({ task, onUpdate, onComplete, onDelete }) => {
  return (
    <div className={`bg-slate-900 border ${task.completed ? 'border-emerald-500/30' : 'border-slate-800'} p-5 rounded-[2rem] transition-all duration-500 ${task.completed ? 'opacity-50 grayscale' : ''}`}>
       <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-slate-950 rounded-2xl text-amber-500 border border-slate-800">
             <Target size={18} />
          </div>
          <input 
            placeholder="The Task..."
            value={task.name}
            onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            className="bg-transparent text-sm font-serif outline-none flex-1 border-b border-transparent focus:border-slate-700 text-white placeholder:text-slate-700"
          />
          <button onClick={() => onDelete(task.id)} className="text-slate-600 hover:text-red-500 transition-colors p-1">
            <Trash2 size={16} />
          </button>
       </div>
       <div className="flex gap-2">
          {Object.keys(SPELL_TIERS).map(tier => (
            <button 
              key={tier}
              onClick={() => onUpdate(task.id, { tier })}
              className={`flex-1 text-[9px] font-bold py-2 rounded-xl border transition-all uppercase tracking-tighter ${task.tier === tier ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
            >
              {tier}
            </button>
          ))}
       </div>
       {!task.completed && (
          <button 
            disabled={!task.name}
            onClick={() => onComplete(task)}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 p-3 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} /> Complete Spell Practice
          </button>
       )}
    </div>
  );
});

// --- App Root Component ---

const App = () => {
  const [view, setView] = useState('sorting');
  const [sortingStep, setSortingStep] = useState(0);
  const [sortingScores, setSortingScores] = useState({ gryffindor: 0, ravenclaw: 0, hufflepuff: 0, slytherin: 0 });
  
  const [housePoints, setHousePoints] = useState({ gryffindor: 0, ravenclaw: 0, hufflepuff: 0, slytherin: 0 });
  const [logs, setLogs] = useState([]);
  const [cooldowns, setCooldowns] = useState({});
  const [now, setNow] = useState(Date.now());
  
  const [user, setUser] = useState({
    house: null,
    level: 1,
    hp: 100,
    maxHp: 100,
    galleons: 500,
    xp: 0,
    xpToNext: 100,
    inventory: [],
    masteredSpells: [], 
    spellProgress: {},
    shields: 0
  });

  // Dynamic Alchemical Tracking State (Requires Brew Timers instead of instant clicks)
  const [tracking, setTracking] = useState({
    water: { current: 0, target: 2000, unit: 'ml', step: 250, label: 'Hydration Potion', color: 'text-blue-400', barColor: 'bg-blue-500', icon: <Droplets />, duration: 60 }, // 60s
    sleep: { current: 0, target: 8, unit: 'hrs', step: 0.5, label: 'Trance Induction', color: 'text-indigo-400', barColor: 'bg-indigo-500', icon: <Moon />, isTrance: true }, // Special Sleep Mode
    study: { current: 0, target: 120, unit: 'mins', step: 1, label: 'Library Study Potion', color: 'text-amber-400', barColor: 'bg-amber-500', icon: <GraduationCap />, isActiveFocus: true },
    exercise: { current: 0, target: 60, unit: 'mins', step: 1, label: 'Combat Drill Tonic', color: 'text-emerald-400', barColor: 'bg-emerald-500', icon: <Dumbbell />, isActiveFocus: true }
  });

  // Timer Brew State
  const [activeBrews, setActiveBrews] = useState({}); // { water: { totalSec: 60, elapsed: 0, intervalId: ... } }
  const [sleepTranceStart, setSleepTranceStart] = useState(null); // Timestamp of sleep start

  // Mini-game Sealing State (Anti-Cheat)
  const [sealRitual, setSealRitual] = useState(null); // { key: 'water', progress: 50, direction: 1 }
  const [sealTarget, setSealTarget] = useState({ min: 40, max: 60 });

  const [activeSettings, setActiveSettings] = useState(null);
  const [extraTasks, setExtraTasks] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(ENEMIES[0]);
  const [enemyHp, setEnemyHp] = useState(ENEMIES[0].hp);
  const [combatMsg, setCombatMsg] = useState("Face your opponent...");
  const [showEnemyGallery, setShowEnemyGallery] = useState(false);

  // --- Realtime Timer Tick & Alchemical sweeps ---
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      // Handle Active Infusions
      setActiveBrews(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key] && next[key].elapsed < next[key].totalSec) {
            next[key] = { ...next[key], elapsed: next[key].elapsed + 1 };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Seal Ritual Needle Sweeper Loop
  useEffect(() => {
    if (!sealRitual) return;
    const sweep = setInterval(() => {
      setSealRitual(prev => {
        if (!prev) return null;
        let nextVal = prev.progress + prev.direction * 4;
        let nextDir = prev.direction;
        if (nextVal >= 100) {
          nextVal = 100;
          nextDir = -1;
        } else if (nextVal <= 0) {
          nextVal = 0;
          nextDir = 1;
        }
        return { ...prev, progress: nextVal, direction: nextDir };
      });
    }, 40);
    return () => clearInterval(sweep);
  }, [sealRitual]);

  // --- Calculations ---
  const trackingAccuracyBonus = Object.values(tracking).reduce((sum, item) => {
    const completion = Math.min(1, item.current / item.target);
    return sum + (completion * 7.5);
  }, 0);

  const itemStatBonus = user.inventory.reduce((stats, item) => {
    if (item.type === 'wand' || item.type === 'charm') stats.success += item.bonus;
    if (item.type === 'armor') stats.hp += item.bonus;
    if (item.type === 'hat') stats.xp += item.bonus;
    return stats;
  }, { success: 0, hp: 0, xp: 0 });

  const spellPotency = Math.floor(50 + trackingAccuracyBonus + itemStatBonus.success);
  const currentMaxHp = 100 + itemStatBonus.hp;

  const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 10));

  const awardExperience = (amount) => {
    const multiplier = 1 + (itemStatBonus.xp / 100);
    const finalAmount = Math.floor(amount * multiplier);
    setUser(prev => {
      let xp = prev.xp + finalAmount;
      let level = prev.level;
      let xpToNext = prev.xpToNext;
      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = Math.floor(xpToNext * 1.5);
        addLog(`LEVEL UP! You are now Level ${level}`);
      }
      return { ...prev, xp, level, xpToNext };
    });
  };

  const castSpell = (spell) => {
    const tierData = SPELL_TIERS[spell.tier];
    const lastUsed = cooldowns[spell.name] || 0;
    if (now - lastUsed < tierData.cooldown) return;

    setCooldowns(prev => ({ ...prev, [spell.name]: Date.now() }));
    const roll = Math.random() * 100;
    
    if (roll <= spellPotency) {
      const dmg = spell.baseDmg + (user.level * 2);
      const newEnemyHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(newEnemyHp);
      setCombatMsg(`Success! ${spell.name} dealt ${dmg} damage!`);
      
      setUser(prev => {
        let { galleons, shields, hp } = prev;
        let newPoints = { ...housePoints };
        if (spell.tier === 'Easy') galleons += 1;
        else if (spell.tier === 'Medium') shields += 1;
        else if (spell.tier === 'Hard') {
          newPoints[prev.house] += 10;
          setHousePoints(newPoints);
        } else if (spell.tier === 'Legendary') {
          hp = Math.min(currentMaxHp, prev.hp + Math.floor((currentMaxHp - prev.hp) * 0.25));
        }
        return { ...prev, galleons, shields, hp };
      });

      if (newEnemyHp === 0) {
        addLog(`Victory! Defeated ${currentEnemy.name}.`);
        awardExperience(currentEnemy.level * 50);
        setUser(prev => ({ ...prev, galleons: prev.galleons + currentEnemy.reward }));
        setCombatMsg(`${currentEnemy.name} has fallen! Prepare for the next duel.`);
      }
    } else {
      if (user.shields > 0) {
        setUser(prev => ({ ...prev, shields: prev.shields - 1 }));
        setCombatMsg(`Counter-attack blocked by shield!`);
      } else {
        const dmgTaken = currentEnemy.dmg;
        setUser(prev => ({ ...prev, hp: Math.max(0, prev.hp - dmgTaken) }));
        setCombatMsg(`Fizzle! You took ${dmgTaken} damage.`);
      }
    }
  };

  // --- Chronomancy (Time Fast-Forward Debugger) ---
  const castChronomancy = (key) => {
    setActiveBrews(prev => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], elapsed: prev[key].totalSec }
      };
    });
    addLog("Chronomancy: Spellcast accelerated the infusion timeline.");
  };

  // --- Alchemical Brewing Controls ---
  const startInfusion = (key, customMinutes = null) => {
    let targetSec = tracking[key].duration || 60; // default 60s
    if (customMinutes) targetSec = customMinutes * 60;

    setActiveBrews(prev => ({
      ...prev,
      [key]: { totalSec: targetSec, elapsed: 0 }
    }));
    addLog(`Alchemy: Commenced brewing ${tracking[key].label}.`);
  };

  const cancelInfusion = (key) => {
    setActiveBrews(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    addLog(`Alchemy: Brew of ${tracking[key].label} was ruined.`);
  };

  // Trance Mode Controls (Real Sleep)
  const enterSleepTrance = () => {
    setSleepTranceStart(Date.now());
    addLog("Vitals: Entered deep restorative trance state.");
  };

  const awakeSleepTrance = () => {
    if (!sleepTranceStart) return;
    const hrsElapsed = (Date.now() - sleepTranceStart) / 1000 / 3600; // actual hours
    setSleepTranceStart(null);
    
    // Open Arcane Seal Alignment with payload
    setSealRitual({ key: 'sleep', progress: 50, direction: 1, yieldAmt: hrsElapsed });
  };

  // Cheat Sleep for demo
  const chronomancySleepTrance = () => {
    if (!sleepTranceStart) return;
    // Fast forward start time back 8 hours
    setSleepTranceStart(prev => prev - 8 * 3600 * 1000);
    addLog("Chronomancy: Restorative Trance dreamtime warped forward by 8 hours.");
  };

  // Sealing / Alignment Ritual Confirm (Anti-Cheat Lock)
  const completeSealRitual = () => {
    if (!sealRitual) return;
    const aligned = sealRitual.progress >= sealTarget.min && sealRitual.progress <= sealTarget.max;
    
    if (aligned) {
      const key = sealRitual.key;
      let addedAmt = tracking[key].step;
      if (key === 'sleep' && sealRitual.yieldAmt !== undefined) {
        addedAmt = parseFloat(sealRitual.yieldAmt.toFixed(1));
      } else if (key === 'study' || key === 'exercise') {
        const brewData = activeBrews[key];
        addedAmt = Math.floor(brewData.totalSec / 60);
      }

      setTracking(prev => ({
        ...prev,
        [key]: { ...prev[key], current: prev[key].current + addedAmt }
      }));
      
      addLog(`Alchemy: Potion successful! Sealing locked in +${addedAmt}${tracking[key].unit} of ${tracking[key].label}.`);
      
      // Clean brew state
      setActiveBrews(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSealRitual(null);
    } else {
      addLog("Alchemy error: Arcane Alignment failed! The potion unstable. Readjusting alignment gauge.");
      // Just shake alignment needle or let them try again
      setSealRitual(prev => ({ ...prev, progress: Math.random() * 30 }));
    }
  };

  const updateTask = useCallback((id, updates) => {
    setExtraTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setExtraTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeTask = useCallback((task) => {
    const tierSpells = SPELL_LIBRARY[task.tier];
    const randomSpell = tierSpells[Math.floor(Math.random() * tierSpells.length)];
    
    setExtraTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true } : t));
    awardExperience(SPELL_TIERS[task.tier].xp);
    
    setUser(prev => {
      const currentProg = (prev.spellProgress[randomSpell.name] || 0) + 1;
      const isMastered = prev.masteredSpells.some(s => s.name === randomSpell.name);
      let mastered = [...prev.masteredSpells];
      let updatedProgress = { ...prev.spellProgress, [randomSpell.name]: currentProg };

      if (currentProg >= SPELL_TIERS[task.tier].requirement && !isMastered) {
        mastered.push({ ...randomSpell, tier: task.tier });
        addLog(`Grimoire: Mastered ${randomSpell.name}!`);
      } else {
        addLog(`Grimoire: ${randomSpell.name} expertise: ${currentProg}/${SPELL_TIERS[task.tier].requirement}`);
      }
      return { ...prev, spellProgress: updatedProgress, masteredSpells: mastered };
    });
  }, [user.spellProgress, user.masteredSpells]);

  const selectEnemy = (enemy) => {
    setCurrentEnemy(enemy);
    setEnemyHp(enemy.hp);
    setCombatMsg(`You've challenged ${enemy.name}!`);
    setShowEnemyGallery(false);
  };

  // --- Sorting ---
  const handleAnswerSorting = (house) => {
    const newScores = { ...sortingScores, [house]: sortingScores[house] + 1 };
    setSortingScores(newScores);
    if (sortingStep < SORTING_QUESTIONS.length - 1) {
      setSortingStep(prev => prev + 1);
    } else {
      const winner = Object.keys(newScores).reduce((a, b) => newScores[a] >= newScores[b] ? a : b);
      setUser({ ...user, house: winner });
      setView('dashboard');
    }
  };

  const currentHouse = HOUSES[user.house];

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* sleep trance screen overlay (Full-Screen Lockdown Mode) */}
      {sleepTranceStart && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full filter blur-xl animate-pulse" />
            <Moon className="text-indigo-400 w-24 h-24 animate-bounce relative z-10" />
          </div>
          <h2 className="font-serif text-3xl text-indigo-100 mb-2">Restorative Trance Active</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-12">Mana recovery timeline commencing...</p>
          <div className="space-y-2 mb-12">
            <p className="text-3xl font-mono text-white font-bold">
              {((Date.now() - sleepTranceStart) / 1000 / 3600).toFixed(4)} <span className="text-sm opacity-50">hrs</span>
            </p>
          </div>
          <div className="space-y-4 w-full max-w-xs">
            <button 
              onClick={chronomancySleepTrance}
              className="w-full p-4 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-2 text-indigo-300 font-bold text-sm tracking-widest uppercase transition-all"
            >
              <Sparkles size={16} /> Fast-Forward Sleep (8h)
            </button>
            <button 
              onClick={awakeSleepTrance}
              className="w-full p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-widest uppercase shadow-lg active:scale-95 transition-all"
            >
              <Zap size={16} /> Break Trance & Awake
            </button>
          </div>
        </div>
      )}

      {/* anti-cheat alignment sealing game modal */}
      {sealRitual && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl relative">
            <FlaskConical className="text-amber-500 mx-auto w-12 h-12 mb-4 animate-pulse" />
            <h3 className="font-serif text-xl text-amber-100 mb-2 uppercase tracking-wider">Arcane Alignment Ritual</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-8">Tap seal when the magic needle aligns in the golden core zone</p>
            
            {/* The Gauge */}
            <div className="w-full bg-slate-950 h-8 rounded-full relative overflow-hidden border border-slate-800 mb-8 shadow-inner">
               {/* Magic golden target zone */}
               <div className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-600 to-amber-400 opacity-60" style={{ left: '40%', right: '40%' }} />
               <div className="absolute top-0 bottom-0 w-0.5 bg-amber-200" style={{ left: '50%' }} />
               {/* Swinging Needle */}
               <div className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#fff] transition-all" style={{ left: `${sealRitual.progress}%` }} />
            </div>

            <button 
              onClick={completeSealRitual}
              className="w-full p-4 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> Seal Potion Bottles!
            </button>
          </div>
        </div>
      )}

      {/* 1. SORTING CEREMONY SCREEN */}
      {view === 'sorting' && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden w-full">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-slate-950 p-4 rounded-full border border-slate-800 shadow-inner">
                 <SkullIcon className="text-amber-500 w-10 h-10" />
              </div>
            </div>
            <div className="mb-4 flex gap-1 justify-center">
              {SORTING_QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= sortingStep ? 'bg-amber-500' : 'bg-slate-800'}`} />
              ))}
            </div>
            <h1 className="font-serif text-xl text-amber-100 mb-2 uppercase tracking-widest">The Sorting Hat</h1>
            <p className="text-[10px] text-slate-500 font-bold mb-8 uppercase tracking-tighter">Question {sortingStep + 1} of 3</p>
            <p className="text-lg mb-8 text-slate-200 font-serif leading-relaxed italic">"{SORTING_QUESTIONS[sortingStep].q}"</p>
            <div className="space-y-3">
              {SORTING_QUESTIONS[sortingStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswerSorting(opt.h)} className="w-full p-4 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300 text-sm rounded-2xl border border-slate-700 hover:border-amber-500 transition-all active:scale-95 text-left flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">{i+1}</div>
                  {opt.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HUB STRUCTURE (Once Sorted) */}
      {view !== 'sorting' && (
        <>
          <header className={`p-6 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl ${currentHouse?.color || 'bg-slate-900'}/90`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] px-2 py-0.5 bg-white/10 rounded-full uppercase tracking-widest font-bold border border-white/20">LVL {user.level}</span>
                  <span className="text-[10px] uppercase text-white/60 font-serif tracking-[0.2em]">{user.house}</span>
                </div>
                <h1 className="text-xl font-bold font-serif text-white tracking-tight">The Wizard's Trial</h1>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end text-amber-400 font-bold bg-black/40 px-3 py-2 rounded-2xl border border-white/10 shadow-lg">
                  <span className="mr-2 text-base font-mono">{user.galleons}</span> <Coins size={16} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(user.xp/user.xpToNext)*100}%` }} />
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(user.hp/currentMaxHp)*100}%` }} />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 pb-32 overflow-y-auto">
            {/* GREAT HALL / DASHBOARD */}
            {view === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl">
                    <h3 className="text-[10px] font-serif text-amber-400 uppercase tracking-widest mb-1">Spell Potency</h3>
                    <div className="text-3xl font-bold text-white font-serif">{spellPotency}%</div>
                    <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${spellPotency}%` }} />
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl">
                    <h3 className="text-[10px] font-serif text-blue-400 uppercase tracking-widest mb-1">Spell Shields</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-white font-serif">{user.shields}</div>
                      <Shield className="text-blue-500" size={20} />
                    </div>
                  </div>
                </div>

                <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-serif text-slate-400 uppercase tracking-widest">Great Hall: Dueling</h3>
                    <button 
                      onClick={() => setShowEnemyGallery(!showEnemyGallery)}
                      className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1"
                    >
                      <Swords size={12} /> {showEnemyGallery ? "Back to Battle" : "Find Challengers"}
                    </button>
                  </div>
                  
                  {showEnemyGallery ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {ENEMIES.map(enemy => (
                        <button 
                          key={enemy.id}
                          onClick={() => selectEnemy(enemy)}
                          className={`w-full p-4 rounded-2xl border text-left flex gap-4 transition-all ${currentEnemy.id === enemy.id ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/20' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentEnemy.id === enemy.id ? 'bg-amber-500/20' : 'bg-slate-900'}`}>
                            {React.cloneElement(enemy.icon, { size: 24 })}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-serif text-white">{enemy.name}</h4>
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Lvl {enemy.level}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mb-2 leading-tight">{enemy.desc}</p>
                            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-tighter">
                              <span className="text-red-400">HP: {enemy.hp}</span>
                              <span className="text-orange-400">ATK: {enemy.dmg}</span>
                              <span className="text-amber-400">RWD: {enemy.reward}G</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-800">
                          {currentEnemy.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-slate-100 flex items-center gap-2">
                            {currentEnemy.name}
                            <span className="text-[8px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">LVL {currentEnemy.level}</span>
                          </p>
                          <div className="w-full bg-slate-950 h-2 mt-2 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(enemyHp/currentEnemy.hp)*100}%` }} />
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-xs italic text-amber-400/80 mb-6 min-h-[1rem]">{combatMsg}</p>

                      <div className="grid grid-cols-2 gap-2">
                        {user.masteredSpells.length > 0 ? user.masteredSpells.map(spell => {
                          const tierInfo = SPELL_TIERS[spell.tier];
                          const lastUsed = cooldowns[spell.name] || 0;
                          const elapsed = now - lastUsed;
                          const remaining = Math.max(0, tierInfo.cooldown - elapsed);
                          const isReady = remaining === 0;
                          const progress = Math.min(100, (elapsed / tierInfo.cooldown) * 100);

                          return (
                            <button 
                              key={spell.name}
                              disabled={!isReady || user.hp <= 0 || enemyHp <= 0}
                              onClick={() => castSpell(spell)}
                              className={`p-3 rounded-2xl border transition-all text-left relative overflow-hidden flex flex-col ${isReady ? 'bg-slate-800 border-slate-700 hover:border-amber-500 active:scale-95' : 'bg-slate-950 border-slate-900 opacity-60'}`}
                            >
                              {!isReady && <div className="absolute bottom-0 left-0 h-1 bg-amber-500" style={{ width: `${progress}%` }} />}
                              <div className="flex justify-between items-start mb-1">
                                 <span className={isReady ? 'text-amber-500' : 'text-slate-600'}>{spell.icon}</span>
                                 {!isReady && <span className="text-[8px] font-mono text-slate-500">{Math.ceil(remaining/1000)}s</span>}
                              </div>
                              <span className="text-[10px] font-bold uppercase">{spell.name}</span>
                              <span className="text-[7px] text-slate-500 mt-0.5 uppercase tracking-tighter">{spell.baseDmg} DMG</span>
                            </button>
                          );
                        }) : (
                          <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                             <p className="text-xs text-slate-600 font-serif italic">No spells in your active bar.<br/>Go to the Grimoire to learn magic.</p>
                          </div>
                        )}
                      </div>
                      {enemyHp <= 0 && (
                        <button 
                          onClick={() => setEnemyHp(currentEnemy.hp)}
                          className="w-full mt-4 p-3 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all"
                        >
                          Summon Echo (Restart Battle)
                        </button>
                      )}
                    </>
                  )}
                </section>
              </div>
            )}

            {/* LABORATORY */}
            {view === 'lab' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="px-1 flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-2xl text-white">The Laboratory</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Brew Foundation Potions</p>
                  </div>
                  <FlaskConical className="text-slate-700" size={32} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(tracking).map(([key, item]) => {
                    const progress = Math.min(100, (item.current / item.target) * 100);
                    const isEditingTarget = activeSettings === key;
                    
                    // Infusion brewing state
                    const activeBrew = activeBrews[key];
                    const isBrewing = !!activeBrew;
                    const brewProgress = isBrewing ? Math.min(100, (activeBrew.elapsed / activeBrew.totalSec) * 100) : 0;
                    const brewCompleted = isBrewing && activeBrew.elapsed >= activeBrew.totalSec;

                    return (
                      <div key={key} className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-6 relative z-10">
                          {/* Vial Visualization */}
                          <div className="w-14 h-28 bg-slate-950 rounded-b-2xl rounded-t-lg border-2 border-slate-800 relative overflow-hidden flex flex-col justify-end">
                            <div className={`w-full ${item.barColor} transition-all duration-1000`} style={{ height: `${progress}%` }} />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-[10px] font-serif text-slate-500 uppercase tracking-widest mb-1">{item.label}</h4>
                                <div className="flex items-center gap-2">
                                  <span className={`text-2xl font-bold font-mono ${item.color}`}>
                                    {item.current}
                                  </span>
                                  <span className="text-xs font-mono text-slate-600">{item.unit}</span>
                                </div>
                              </div>
                              <button onClick={() => setActiveSettings(isEditingTarget ? null : key)} className={`p-2 rounded-xl border transition-all ${isEditingTarget ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                <Settings2 size={14} />
                              </button>
                            </div>

                            {isEditingTarget ? (
                              <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30">
                                <label className="text-[8px] uppercase tracking-wider text-amber-500 block mb-1">Alter Target</label>
                                <input 
                                  type="number"
                                  value={item.target}
                                  onChange={(e) => updateTrackingTarget(key, parseFloat(e.target.value) || 1)}
                                  className="w-full bg-slate-900 text-white p-2 rounded-xl text-sm border border-slate-800 outline-none"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-3 uppercase">
                                  <span>{Math.round(progress)}% Filled</span>
                                  <span>Goal: {item.target}</span>
                                </div>

                                {/* Timer brewing controls & Anti-cheat implementation */}
                                {isBrewing ? (
                                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                      <span className="animate-pulse text-amber-500 font-serif uppercase">Brewing Essence...</span>
                                      <span>{activeBrew.totalSec - activeBrew.elapsed}s remaining</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                      <div className={`h-full ${item.barColor}`} style={{ width: `${brewProgress}%` }} />
                                    </div>

                                    <div className="flex gap-1 pt-1">
                                      {brewCompleted ? (
                                        <button 
                                          onClick={() => setSealRitual({ key, progress: 50, direction: 1 })}
                                          className="flex-1 bg-amber-500 text-slate-950 text-[10px] font-bold py-1.5 rounded-xl uppercase tracking-wider animate-bounce flex items-center justify-center gap-1"
                                        >
                                          <Sparkle size={12} /> Claim & Seal Potion
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => castChronomancy(key)}
                                          className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-[9px] font-mono px-2 py-1.5 rounded-xl hover:bg-indigo-900/50 transition-colors"
                                          title="Chronomancy Debug Spell"
                                        >
                                          Chrono
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => cancelInfusion(key)}
                                        className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-500/10 text-[9px] font-bold py-1.5 rounded-xl uppercase transition-colors"
                                      >
                                        Dump Potion
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {item.isTrance ? (
                                      <button 
                                        onClick={enterSleepTrance}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 p-2.5 rounded-2xl border border-indigo-500 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
                                      >
                                        <Moon size={14} /> Enter Sleep Trance
                                      </button>
                                    ) : item.isActiveFocus ? (
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => startInfusion(key, 15)} // 15 min focus brew
                                          className="flex-1 bg-slate-800 hover:bg-slate-700 p-2 text-[9px] font-bold border border-slate-700 rounded-xl transition-all"
                                        >
                                          Brew 15m
                                        </button>
                                        <button 
                                          onClick={() => startInfusion(key, 30)} // 30 min focus brew
                                          className="flex-1 bg-slate-800 hover:bg-slate-700 p-2 text-[9px] font-bold border border-slate-700 rounded-xl transition-all"
                                        >
                                          Brew 30m
                                        </button>
                                        <button 
                                          onClick={() => startInfusion(key, 60)} // 60 min focus brew
                                          className="flex-1 bg-slate-800 hover:bg-slate-700 p-2 text-[9px] font-bold border border-slate-700 rounded-xl transition-all"
                                        >
                                          Brew 60m
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => startInfusion(key)}
                                        className="w-full bg-blue-600/20 hover:bg-blue-600/40 p-2.5 rounded-2xl border border-blue-500/30 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest text-blue-300 transition-all"
                                      >
                                        <FlaskConical size={14} /> Infuse glass of water
                                      </button>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GRIMOIRE */}
            {view === 'grimoire' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h2 className="font-serif text-2xl text-white">The Grimoire</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Inscribe your rituals</p>
                  </div>
                  <button 
                    onClick={() => setExtraTasks(prev => [{ id: Date.now(), name: "", tier: 'Easy', completed: false }, ...prev])}
                    className="bg-amber-600 p-2 rounded-full text-white shadow-xl hover:scale-110 active:scale-90 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5 shadow-xl">
                  <h3 className="text-[10px] uppercase font-serif text-slate-500 mb-4 tracking-widest text-center">Mastery Progress</h3>
                  <div className="space-y-4">
                    {Object.entries(SPELL_TIERS).map(([tier, data]) => {
                      const mastered = user.masteredSpells.filter(s => s.tier === tier);
                      return (
                        <div key={tier} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                          <div className="flex justify-between mb-2">
                            <span className="text-[9px] text-slate-400 font-serif uppercase tracking-widest">{data.name}</span>
                            <span className="text-[9px] text-amber-500 font-bold">{mastered.length} Mastered</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {SPELL_LIBRARY[tier].map(spell => {
                              const isM = user.masteredSpells.some(ms => ms.name === spell.name);
                              const prog = user.spellProgress[spell.name] || 0;
                              return (
                                <div key={spell.name} className={`px-2.5 py-1 rounded-xl border text-[9px] font-bold ${isM ? 'bg-amber-500/10 border-amber-500/50 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60'}`}>
                                  {spell.name} {!isM && `(${prog}/${data.requirement})`}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {extraTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onUpdate={updateTask} 
                      onDelete={deleteTask}
                      onComplete={completeTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SHOP / ALLEY */}
            {view === 'shop' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center shadow-xl">
                  <div className="inline-block p-4 bg-slate-950 rounded-full border border-slate-800 mb-4 shadow-inner">
                     <ShoppingBag className="text-amber-500" size={32} />
                  </div>  
                  <h2 className="font-serif text-xl text-amber-100 mb-1">Ollivanders</h2>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">Fine Wands & Artifacts</p>
                </div>
                {SHOP_ITEMS.map(item => {
                  const owned = user.inventory.some(i => i.id === item.id);
                  const canAfford = user.galleons >= item.price;
                  return (
                    <button 
                      key={item.id}
                      disabled={owned || !canAfford}
                      onClick={() => {
                        if (item.type === 'consumable') {
                          setUser(prev => ({ ...prev, galleons: prev.galleons - item.price, hp: Math.min(currentMaxHp, prev.hp + item.bonus) }));
                        } else {
                          setUser(prev => ({ ...prev, galleons: prev.galleons - item.price, inventory: [...prev.inventory, item] }));
                        }
                      }}
                      className={`w-full p-5 rounded-[2rem] border flex items-center justify-between transition-all ${owned ? 'bg-slate-950 opacity-40 border-slate-800' : 'bg-slate-900 border-slate-800 hover:border-amber-500 shadow-lg'}`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-inner">
                           {ITEM_ARTWORK[item.id] || <FlaskConical size={20} />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest">{item.name}</h4>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-xs font-mono font-bold ${owned ? 'text-slate-600' : 'text-amber-500'}`}>
                           {owned ? "OWNED" : `${item.price} G`}
                         </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* PROFILE */}
            {view === 'profile' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center shadow-xl">
                  <div className={`w-24 h-24 mx-auto rounded-full ${currentHouse?.color} mb-6 flex items-center justify-center border-4 border-slate-800 shadow-2xl`}>
                    <User size={40} className="text-white" />
                  </div>
                  <h2 className="font-serif text-2xl text-white uppercase tracking-widest">{user.house} House</h2>
                  <p className="text-[10px] text-blue-400 font-bold uppercase mt-2">{housePoints[user.house] || 0} House Points</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
                  <h4 className="text-[9px] uppercase text-slate-500 mb-4 tracking-[0.3em] font-serif">Arcane History</h4>
                  <div className="space-y-2">
                    {logs.map((l, i) => (
                      <div key={i} className="text-[10px] text-slate-400 py-2 border-b border-slate-800 last:border-0 flex gap-2">
                        <span className="text-amber-500/50">✦</span> {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 border-t border-slate-800 h-24 px-2 flex items-center justify-around z-50 backdrop-blur-xl">
            <NavBtn icon={<Home />} label="Great Hall" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavBtn icon={<Beaker />} label="Laboratory" active={view === 'lab'} onClick={() => setView('lab')} />
            <NavBtn icon={<BookOpen />} label="Grimoire" active={view === 'grimoire'} onClick={() => setView('grimoire')} />
            <NavBtn icon={<ShoppingBag />} label="Alley" active={view === 'shop'} onClick={() => setView('shop')} />
            <NavBtn icon={<User />} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
          </nav>
        </>
      )}

    </div>
  );
};

export default App;