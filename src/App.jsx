import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, updateDoc, addDoc, query, orderBy, setDoc, writeBatch } from 'firebase/firestore';

// ======================================================================
// 🚀 CONFIG FIREBASE SUDAH DISAMAKAN DENGAN ADMIN (ayustudio-booking)
// ======================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDeY8c5o2m1j9oBbZtxsoZPOe_C2VkDIsk",
  authDomain: "ayustudio-booking.firebaseapp.com",
  projectId: "ayustudio-booking",
  storageBucket: "ayustudio-booking.firebasestorage.app",
  messagingSenderId: "374878980424",
  appId: "1:374878980424:web:757591a982f2c32d160b7d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================================================================
// 📸 ASSET GAMBAR, LOGO & MUSIK
// ======================================================================
const ASSETS = {
  logo: "/logo.png", // Taruh file logo.png kamu di folder public
  music: "/backsound.mp3", // Link lagu BGM (Bisa diganti)
  hero_utama: "/suasanaruangan.jpg", 
  gear_1: "/suasanaruangan.jpg", 
  gear_2: "/drum.jpg", 
  gear_3: "/sound.jpg", 
  gear_4: "/mic.jpg", 
  qris: "/qris.jpg" 
};

const Icons = {
  Music: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Disc: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
};

// --- KOMPONEN ANIMASI SCROLL REVEAL ---
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
};

const SERVICES = [
  { id: 'full', name: 'Sewa Full Alat Band', price: 60000, icon: '🎸' },
  { id: 'drum', name: 'Sewa Drum Aja', price: 35000, icon: '🥁' },
  { id: 'drum_guitar', name: 'Sewa Drum + Gitar', price: 45000, icon: '🥁🎸' },
];

const ADDONS = [
  { id: 'a1', name: 'Double Pedal (Tama)', price: 20000 },
  { id: 'a2', name: 'Keyboard (Roland)', price: 40000 },
  { id: 'a3', name: 'Kabel Jack / Efek Tambahan', price: 10000 },
  { id: 'a4', name: 'Live Recording (Audio)', price: 150000 },
];

const GEAR_CATEGORIES = [
  {
    id: 'room', title: 'Studio Environment', subtitle: 'Ruangan & Kenyamanan Ekstra', img: ASSETS.gear_1, icon: '🛋️',
    items: [
      { name: 'Full Acoustic Treatment', desc: 'Dinding dilapisi acoustic foam piramid kualitas tinggi untuk meredam gema (echo).' },
      { name: 'Fully Air Conditioned', desc: 'Ruangan sejuk agar sesi latihan tetap fokus.' },
      { name: 'Professional Lighting', desc: 'Mood lampu yang pas untuk meningkatkan semangat berkarya.' }
    ]
  },
  {
    id: 'instruments', title: 'The Gears', subtitle: 'Instrumen Standar Internasional', img: ASSETS.gear_2, icon: '🎸',
    items: [
      { name: '🥁 Mapex Drum Set', desc: 'Lengkap dengan Cymbal, Stand, & Kursi.' },
      { name: '🎸 Guitar & Bass', desc: 'Telecaster (Seafoam Green), Double Cutaway (Red), 5-String Bass.' },
      { name: '🎹 Keys Section', desc: 'Digital Keyboard/Piano dengan ratusan voice.' }
    ]
  },
  {
    id: 'backline', title: 'The Backline', subtitle: 'Sistem Amplifikasi Megah', img: ASSETS.gear_3, icon: '🔊',
    items: [
      { name: 'Marshall Guitar Stack', desc: 'Legenda amplifier dunia untuk karakter suara British Crunch.' },
      { name: 'Carter 200 Watts Head Cab', desc: 'Power besar dan output super jernih.' },
      { name: 'Smarvo BASH Bass Amp', desc: 'Dentuman bass bulat dan bertenaga.' }
    ]
  },
  {
    id: 'audio', title: 'Pro-Sound Audio', subtitle: 'Kejernihan Tanpa Kompromi', img: ASSETS.gear_4, icon: '🎙️',
    items: [
      { name: 'Vocal Microphones', desc: 'Mic dinamis yang peka dan jernih.' },
      { name: 'PA System / Monitor', desc: 'Monitor studio profesional.' }
    ]
  }
];

export default function App() {
  const getDateLabel = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return (new Date(d - tzOffset)).toISOString().slice(0, 10);
  };

  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState(getDateLabel(0)); 
  const [slots, setSlots] = useState([]);
  const [cartSlots, setCartSlots] = useState([]);
  const [cartAddons, setCartAddons] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState(null);

  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [timeLeft, setTimeLeft] = useState(900); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerName, setCustomerName] = useState(''); 
  const [ticketData, setTicketData] = useState(null); 
  const [toast, setToast] = useState(null); 

  // State untuk Background Music
  const [isPlaying, setIsPlaying] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!db) return; 
    const q = query(collection(db, "slots_by_date", selectedDate, "items"), orderBy("id", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slotsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlots(slotsData);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      cancelCheckout();
      showToast("Waktu pembayaran habis. Jadwal dilepas kembali.", "error");
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => showToast("Gagal memutar musik", "error"));
    }
  };

  const isPastTime = (slotTime) => {
    const todayStr = getDateLabel(0);
    if (selectedDate !== todayStr) return false; 
    const now = new Date();
    return parseInt(slotTime.split(':')[0], 10) <= now.getHours(); 
  };

  const seedDatabaseForDate = async (targetDate) => {
    const slotsData = [
      { id: 1, time: "10:00 - 11:00", status: "available" }, { id: 2, time: "11:00 - 12:00", status: "available" },
      { id: 3, time: "12:00 - 13:00", status: "available" }, { id: 4, time: "13:00 - 14:00", status: "available" },
      { id: 5, time: "14:00 - 15:00", status: "available" }, { id: 6, time: "15:00 - 16:00", status: "available" },
      { id: 7, time: "16:00 - 17:00", status: "available" }, { id: 8, time: "17:00 - 18:00", status: "available" },
      { id: 9, time: "18:00 - 19:00", status: "available" }, { id: 10, time: "19:00 - 20:00", status: "available" },
      { id: 11, time: "20:00 - 21:00", status: "available" }, { id: 12, time: "21:00 - 22:00", status: "available" },
      { id: 13, time: "22:00 - 23:00", status: "available" },
    ];
    try {
      showToast(`Mengaktifkan jadwal...`, "info");
      const batch = writeBatch(db); 
      for (const slot of slotsData) {
        const docRef = doc(db, "slots_by_date", targetDate, "items", String(slot.id));
        batch.set(docRef, slot);
      }
      await batch.commit(); 
      showToast(`Jadwal tanggal ${targetDate} siap! 🚀`, "success");
    } catch (e) {
      showToast("Gagal menginisialisasi jadwal.", "error");
    }
  };

  const toggleSlot = (slot) => {
    if (slot.status !== 'available' || isPastTime(slot.time)) return;
    if (cartSlots.find(s => s.id === slot.id)) setCartSlots(cartSlots.filter(s => s.id !== slot.id));
    else setCartSlots([...cartSlots, slot].sort((a, b) => a.id - b.id));
  };

  const toggleAddon = (addon) => {
    if (cartAddons.find(a => a.id === addon.id)) setCartAddons(cartAddons.filter(a => a.id !== addon.id));
    else setCartAddons([...cartAddons, addon]);
  };

  const totalPrice = (cartSlots.length * selectedService.price) + cartAddons.reduce((sum, a) => sum + a.price, 0);
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  const formatTime = (sec) => `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); };

  const proceedToPayment = async () => {
    if (cartSlots.length === 0) return;
    if (!customerName.trim()) {
        showToast("Mohon masukkan Nama Pemesan terlebih dahulu!", "error");
        document.getElementById('input-nama')?.focus();
        return;
    }

    setIsProcessing(true);
    try {
      for (const slot of cartSlots) {
        await updateDoc(doc(db, "slots_by_date", selectedDate, "items", String(slot.id)), { status: 'pending' });
      }
      setCheckoutStep('payment');
      setIsTimerRunning(true);
      showToast("Jadwal sementara dikunci. Silakan lakukan pembayaran.", "info");
      document.getElementById('booking-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) { 
      showToast("Gagal mengunci jadwal, coba lagi.", "error"); 
    }
    setIsProcessing(false);
  };

  const confirmToWhatsApp = async () => {
    setIsProcessing(true);
    const waNumber = "6281219966490"; // GANTI NOMOR WA STUDIO
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `AYU-${selectedDate.split('-')[2]}-${randomCode}`;

    try {
      await addDoc(collection(db, "bookings"), {
        bookingId: bookingId,
        customerName: customerName, 
        service: selectedService.name,
        date: selectedDate, 
        time: cartSlots.map(s => s.time).join(", "),
        price: totalPrice,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      
      let msg = `Halo Admin Ayu Studio! \nSaya sudah transfer untuk booking studio:\n\n`;
      msg += ` *Booking ID:* ${bookingId}\n`;
      msg += ` *Nama:* ${customerName}\n`;
      msg += ` *Layanan:* ${selectedService.name}\n`;
      msg += ` *Tanggal:* ${selectedDate}\n`;
      msg += ` *Jam Booking:*\n`;
      cartSlots.forEach(s => msg += `> ${s.time}\n`);
      if (cartAddons.length > 0) {
        msg += `\n *Tambahan Alat:*\n`;
        cartAddons.forEach(a => msg += `> ${a.name}\n`);
      }
      msg += `\n *Total Transfer:* *${formatRupiah(totalPrice)}*\n\nBerikut bukti transfernya!`;
      
      setTicketData({
          bookingId,
          customerName,
          service: selectedService.name,
          date: selectedDate,
          time: cartSlots.map(s => s.time).join(", "),
          total: totalPrice
      });

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      
      setCheckoutStep('cart');
      setIsTimerRunning(false);
      setTimeLeft(900);
      setCartSlots([]);
      setCartAddons([]);
      setCustomerName('');

    } catch (e) { 
      showToast("Gagal memproses pesanan!", "error"); 
    }
    setIsProcessing(false);
  };

  const cancelCheckout = async () => {
    setIsProcessing(true);
    try {
      for (const slot of cartSlots) {
        await updateDoc(doc(db, "slots_by_date", selectedDate, "items", String(slot.id)), { status: 'available' });
      }
      setCheckoutStep('cart');
      setIsTimerRunning(false);
      setTimeLeft(900);
      setCartSlots([]);
      showToast("Booking dibatalkan.", "info");
    } catch (e) {}
    setIsProcessing(false);
  };

  return (
    <div className="bg-[#09090b] text-zinc-300 font-sans min-h-screen selection:bg-violet-500/30 pb-32 xl:pb-0 overflow-x-hidden max-w-[100vw] flex flex-col relative">
      
      {/* --- BACKGROUND AUDIO PLAYER --- */}
      <audio id="bg-music" loop src={ASSETS.music} />
      
      {/* FLOATING MUSIC BUTTON */}
      <button 
        onClick={toggleMusic} 
        className={`fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[100] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl group ${isPlaying ? 'bg-violet-600 shadow-violet-600/50' : 'bg-zinc-900 border border-zinc-700 hover:border-violet-500 hover:scale-110'}`}
        title="Play/Pause Background Music"
      >
         <Icons.Disc className={`w-5 h-5 md:w-6 md:h-6 ${isPlaying ? 'text-white animate-[spin_3s_linear_infinite]' : 'text-zinc-400 group-hover:text-white'}`} />
         {/* Tooltip */}
         <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           {isPlaying ? 'Pause Music' : 'Play Music'}
         </div>
      </button>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-10 fade-in duration-300 ${
          toast.type === 'error' ? 'bg-rose-600 text-white shadow-rose-900/50' : 
          toast.type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-900/50' : 
          'bg-zinc-800 text-white border border-zinc-700 shadow-black/50'
        }`}>
          {toast.type === 'error' ? <Icons.X className="w-4 h-4" /> : toast.type === 'success' ? <Icons.Check className="w-4 h-4" /> : <Icons.Music className="w-4 h-4" />}
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      {/* E-TICKET MODAL */}
      {ticketData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setTicketData(null)}></div>
          
          <div className="bg-zinc-100 rounded-[2rem] w-full max-w-sm relative z-10 text-slate-900 shadow-[0_0_50px_rgba(124,58,237,0.3)] animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col my-auto">
            <div className="bg-violet-600 p-8 text-center text-white relative">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
              <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl overflow-hidden p-1 border-2 border-violet-300">
                      <img src={ASSETS.logo} alt="Logo" className="w-full h-full object-contain rounded-full" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
                      <div className="hidden w-full h-full items-center justify-center bg-violet-600 rounded-full text-xs font-black italic">AS</div>
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">AyuStudio</h2>
                  <p className="text-[10px] tracking-widest uppercase opacity-80 mt-1">E-Ticket Booking</p>
              </div>
            </div>

            <div className="p-8 relative bg-white">
              <div className="absolute -top-3 left-4 right-4 h-6 border-b-2 border-dashed border-zinc-300"></div>
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#09090b] rounded-full"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#09090b] rounded-full"></div>

              <div className="text-center mb-6 mt-2">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Booking ID</p>
                 <p className="text-3xl font-black tracking-tighter text-slate-800">{ticketData.bookingId}</p>
                 <div className="inline-block bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 animate-pulse">
                     Menunggu Validasi Admin
                 </div>
              </div>

              <div className="space-y-4 border-t border-b border-zinc-100 py-5 my-5">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Nama</span>
                    <span className="text-sm font-black text-slate-800 text-right">{ticketData.customerName}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Layanan</span>
                    <span className="text-sm font-black text-slate-800 text-right">{ticketData.service}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Tanggal</span>
                    <span className="text-sm font-black text-slate-800 text-right">{ticketData.date}</span>
                 </div>
                 <div className="flex justify-between items-start">
                    <span className="text-xs text-zinc-500 font-bold uppercase mt-0.5">Jam</span>
                    <span className="text-sm font-black text-violet-600 text-right whitespace-pre-wrap">{ticketData.time.split(', ').join('\n')}</span>
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-6 opacity-60">
                 <div className="h-12 w-full flex justify-center items-end gap-1">
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="bg-slate-800" style={{ width: Math.random() > 0.5 ? '2px' : '4px', height: Math.random() > 0.5 ? '100%' : '80%' }}></div>
                    ))}
                 </div>
                 <p className="text-[8px] tracking-[0.3em] mt-2 font-mono text-zinc-500">{ticketData.bookingId}</p>
              </div>

              <button onClick={() => setTicketData(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-colors flex items-center justify-center gap-2">
                 <Icons.X className="w-4 h-4" /> Tutup E-Ticket
              </button>
              <p className="text-center text-[9px] text-zinc-400 mt-4 italic">Screenshot tiket ini sebagai bukti reservasi Anda.</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[150] transition-all duration-500 ${scrolled ? 'bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800 py-3 shadow-2xl' : 'bg-gradient-to-b from-[#09090b]/90 to-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-6 flex justify-between items-center">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
               {/* Jika gambar gagal diload, teks AU akan tampil sebagai fallback */}
               <img src={ASSETS.logo} alt="AyuStudio Logo" className="w-full h-full object-contain absolute inset-0 z-10" onError={(e) => {e.target.style.display='none';}} />
               <span className="text-zinc-500 text-xs font-black italic relative z-0">AU</span>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight text-white uppercase italic">Ayu<span className="text-violet-500">Studio</span></span>
          </div>

          <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
            <button onClick={() => scrollTo('home')} className="hover:text-white transition">Beranda</button>
            <button onClick={() => scrollTo('gear')} className="hover:text-white transition">Fasilitas</button>
            <button onClick={() => scrollTo('booking')} className="text-violet-400 hover:text-violet-300 transition flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span> Booking
            </button>
            <button onClick={() => scrollTo('academy')} className="hover:text-white transition">Les Drum</button>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu />} 
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed inset-0 z-[140] bg-[#09090b]/95 backdrop-blur-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-8 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <button onClick={() => scrollTo('home')} className="text-3xl font-black text-white uppercase italic tracking-tighter">Beranda</button>
        <button onClick={() => scrollTo('gear')} className="text-3xl font-black text-white uppercase italic tracking-tighter">Fasilitas & Gear</button>
        <button onClick={() => scrollTo('booking')} className="text-3xl font-black text-violet-500 uppercase italic tracking-tighter">Booking Jadwal</button>
        <button onClick={() => scrollTo('academy')} className="text-3xl font-black text-emerald-400 uppercase italic tracking-tighter">Les Drum</button>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-24 pb-16 md:pt-48 md:pb-32 px-5 md:px-6 min-h-[85vh] flex items-center w-full overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150vw] max-w-[600px] h-[300px] md:h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 w-full min-w-0">
          <Reveal delay={100}>
            <div className="space-y-6 md:space-y-8 text-center lg:text-left mt-8 md:mt-0 min-w-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] md:text-xs font-black uppercase tracking-widest text-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)] animate-pulse-slow cursor-default">
                🔥 Latihan Full Band Cuma 60K/Jam!
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase italic w-full break-words drop-shadow-lg">
                Latihan Tanpa Batas. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Booking Cepat.</span>
            </h1>
              <p className="text-sm md:text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Cek ketersediaan jadwal secara real-time dan kunci slot latihanmu langsung dari HP. Harga flat pagi, siang, malam, & weekend!
              </p>
              <div className="pt-2 md:pt-4">
                <button onClick={() => scrollTo('booking')} className="group relative bg-violet-600 text-white px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm transition-all active:scale-95 hover:-translate-y-1 shadow-[0_15px_30px_-10px_rgba(124,58,237,0.5)] flex items-center justify-center gap-3 mx-auto lg:mx-0 overflow-hidden w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-2"><Icons.Calendar /> Cek Jadwal Studio</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></span>
                </button>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-full perspective-1000 mt-6 md:mt-0 min-w-0">
              <div className="aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group transform-none lg:rotate-y-[-5deg] transition-transform duration-700 md:hover:rotate-y-0 w-full">
                <img src={ASSETS.hero_utama} alt="Music Studio Interior" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-zinc-900/90 backdrop-blur-md p-4 md:p-5 rounded-xl md:rounded-2xl border border-zinc-700/50 flex items-center justify-between shadow-2xl">
                  <div>
                    <div className="text-white font-black text-sm md:text-lg italic tracking-tight">STUDIO A (PRO)</div>
                    <div className="text-violet-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-0.5 md:mt-1">Full Acoustic Treatment</div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Ready
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FASILITAS & GEAR LIST SECTION */}
      <section id="gear" className="py-16 md:py-24 border-y border-zinc-900 bg-zinc-950/30 relative w-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-900/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 md:px-6 w-full relative z-10">
          
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 text-violet-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-3 bg-violet-500/10 px-3 py-1.5 rounded-full cursor-default">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 animate-ping"></span> High-End Setup
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter">Fasilitas & Gear List</h2>
              <p className="text-zinc-400 mt-3 md:mt-4 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                Klik pada kartu di bawah ini untuk melihat detail spesifikasi alat dan kenyamanan ruangan studio kami.
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full min-w-0">
            {GEAR_CATEGORIES.map((gear, index) => (
              <Reveal key={gear.id} delay={index * 150}>
                <button 
                  onClick={() => setSelectedGear(gear)}
                  className="group text-left w-full min-w-0 relative aspect-[4/3] sm:aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 focus:outline-none transition-all duration-300 hover:shadow-[0_10px_30px_-15px_rgba(124,58,237,0.4)] hover:border-violet-500/50 hover:-translate-y-2"
                >
                  <img src={gear.img} alt={gear.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 md:grayscale md:group-hover:grayscale-0 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>
                  
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col">
                    <div className="bg-violet-600/90 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg mb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
                      {gear.icon}
                    </div>
                    <h4 className="text-white font-black text-lg md:text-xl tracking-tight leading-none mb-1">{gear.title}</h4>
                    <p className="text-violet-400 font-bold text-[9px] uppercase tracking-widest group-hover:text-violet-300 transition-colors">Lihat Detail &rarr;</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POP-UP DETAIL FASILITAS */}
      {selectedGear && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGear(null)}></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <button onClick={() => setSelectedGear(null)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-rose-600 transition-colors z-20"><Icons.X /></button>
            <div className="h-48 sm:h-56 w-full relative shrink-0">
               <img src={selectedGear.img} className="w-full h-full object-cover" alt={selectedGear.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            </div>
            <div className="px-6 pb-6 pt-0 relative -mt-10 flex-1 overflow-y-auto custom-scrollbar">
               <div className="bg-violet-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 shadow-violet-900/50 relative z-10">{selectedGear.icon}</div>
               <h3 className="text-3xl sm:text-4xl font-black italic uppercase text-white mb-1 tracking-tighter">{selectedGear.title}</h3>
               <p className="text-violet-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">{selectedGear.subtitle}</p>
               <div className="space-y-3">
                  {selectedGear.items.map((item, idx) => (
                     <div key={idx} className="bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-zinc-800 hover:border-violet-500/30 transition-colors">
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1.5 flex items-start gap-2"><span className="text-violet-500 mt-1">•</span> {item.name}</h4>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed pl-4">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE: SMART BOOKING ENGINE */}
      <section id="booking" className="py-16 md:py-32 px-4 md:px-6 relative w-full overflow-hidden border-t border-zinc-900">
        <div className="max-w-7xl mx-auto relative z-10 w-full" id="booking-summary">
          
          <Reveal>
            <div className="text-center mb-10 md:mb-20">
              <div className="inline-flex items-center gap-2 text-violet-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-3 bg-violet-500/10 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full cursor-default">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 animate-ping"></span> Live Schedule Update
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Booking Studio</h2>
            </div>
          </Reveal>

          <div className="grid xl:grid-cols-3 gap-6 md:gap-10 w-full min-w-0">
            
            {/* KIRI: PEMILIH LAYANAN, TANGGAL, JAM, & ADDONS */}
            <div className={`xl:col-span-2 space-y-6 md:space-y-8 w-full min-w-0 transition-all duration-500 ${checkoutStep === 'payment' ? 'opacity-50 pointer-events-none grayscale blur-[2px]' : ''}`}>
              
              {/* 1. Service Selector */}
              <Reveal delay={100}>
                <div className="bg-zinc-900/80 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-zinc-800 shadow-2xl w-full box-border hover:border-zinc-700 transition-colors">
                  <h3 className="text-white font-black mb-4 md:mb-6 uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-3 md:pb-4">
                    1. Pilih Layanan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
                    {SERVICES.map((srv) => (
                      <button 
                        key={srv.id}
                        onClick={() => { setSelectedService(srv); setCartSlots([]); }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 touch-manipulation w-full ${selectedService.id === srv.id ? 'bg-violet-600/20 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <span className="text-2xl mb-2">{srv.icon}</span>
                        <span className={`font-bold text-xs text-center w-full truncate px-1 ${selectedService.id === srv.id ? 'text-white' : 'text-zinc-400'}`}>{srv.name}</span>
                        <span className="text-violet-400 font-black text-[10px] mt-1">{formatRupiah(srv.price)}/jam</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* 2. Date Selector */}
              <Reveal delay={200}>
                <div className="bg-zinc-900/80 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-zinc-800 shadow-2xl w-full box-border hover:border-zinc-700 transition-colors">
                  <h3 className="text-white font-black mb-4 md:mb-6 uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-3 md:pb-4">
                    2. Pilih Hari
                  </h3>
                  <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x w-full max-w-full">
                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                      const dateStr = getDateLabel(offset);
                      const d = new Date(); d.setDate(d.getDate() + offset);
                      const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
                      const label = offset === 0 ? "Hari Ini" : offset === 1 ? "Besok" : days[d.getDay()];
                      return (
                        <button 
                          key={dateStr}
                          onClick={() => { setSelectedDate(dateStr); setCartSlots([]); }}
                          className={`snap-center shrink-0 min-w-[100px] md:min-w-[120px] px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 ${selectedDate === dateStr ? 'bg-violet-600 text-white shadow-[0_10px_20px_-10px_rgba(124,58,237,0.5)] md:scale-105' : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:border-zinc-600'}`}
                        >
                          {label}
                          <div className="text-[10px] font-normal opacity-70 mt-1 normal-case tracking-normal">{dateStr}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Reveal>

              {/* 3. Time Slot Selector */}
              <Reveal delay={300}>
                <div className="bg-zinc-900/80 backdrop-blur-md p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-zinc-800 shadow-2xl w-full box-border hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-5 md:mb-8 gap-3 border-b border-zinc-800 pb-3 md:pb-4 w-full">
                    <h3 className="text-white font-black uppercase tracking-widest text-[10px]">3. Pilih Jam</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-[8px] sm:text-[9px] uppercase font-black tracking-widest bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 w-full lg:w-auto justify-center lg:justify-start">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Booked</span>
                    </div>
                  </div>

                  {slots.length < 13 && (
                     <button onClick={() => seedDatabaseForDate(selectedDate)} className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 w-full rounded-xl md:rounded-2xl mb-6 animate-pulse uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.5)] hover:-translate-y-1 transition-all">
                       ⚠️ JADWAL BELUM LENGKAP - KLIK UNTUK AKTIFKAN {selectedDate} 🚀
                     </button>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 w-full">
                    {slots.map((slot) => {
                      const isSelected = cartSlots.find(s => s.id === slot.id);
                      const past = isPastTime(slot.time);
                      let btnClass = "relative flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 rounded-xl border-2 transition-all duration-300 active:scale-95 touch-manipulation w-full ";
                      let statusText = "Tersedia";
                      let indicatorColor = "bg-emerald-500";
                      
                      if (past) {
                        btnClass += "bg-zinc-900 border-zinc-900 opacity-40 cursor-not-allowed";
                        statusText = "Terlewat"; indicatorColor = "hidden";
                      } else if (slot.status === 'booked') {
                        btnClass += "bg-zinc-950 border-rose-900/50 text-rose-500 cursor-not-allowed";
                        statusText = "Full Booked"; indicatorColor = "bg-rose-600";
                      } else if (slot.status === 'pending') {
                        btnClass += "bg-zinc-950 border-amber-900/30 text-amber-500/50 cursor-not-allowed";
                        statusText = "Menunggu TF"; indicatorColor = "bg-amber-500 animate-pulse";
                      } else if (isSelected) {
                        btnClass += "bg-violet-600 border-violet-500 text-white shadow-lg z-10";
                        indicatorColor = "hidden";
                      } else {
                        btnClass += "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-violet-500 hover:text-white cursor-pointer";
                      }

                      return (
                        <button key={slot.id} onClick={() => toggleSlot(slot)} disabled={past || slot.status !== 'available'} className={btnClass}>
                          {isSelected && <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 text-white"><Icons.Check className="w-4 h-4 md:w-5 md:h-5" /></div>}
                          {!isSelected && indicatorColor !== "hidden" && <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${indicatorColor}`}></div>}
                          <span className="font-black text-sm sm:text-base md:text-xl tracking-tight">{slot.time.split(' - ')[0]}</span>
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black tracking-widest uppercase mt-1 md:mt-2 opacity-60 text-center px-1">{statusText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              {/* 4. Upselling Addons */}
              <Reveal delay={400}>
                <div className="bg-zinc-900/80 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-zinc-800 shadow-2xl w-full box-border hover:border-zinc-700 transition-colors">
                  <h3 className="text-white font-black mb-4 md:mb-6 uppercase tracking-widest text-[10px] flex items-center gap-2 border-b border-zinc-800 pb-3 md:pb-4">
                    4. Tambahan (Opsional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
                    {ADDONS.map((addon) => {
                      const isSelected = cartAddons.find(a => a.id === addon.id);
                      return (
                        <button key={addon.id} onClick={() => toggleAddon(addon)} className={`flex justify-between items-center p-4 md:p-5 rounded-xl border-2 text-left transition-all active:scale-95 touch-manipulation w-full ${isSelected ? 'bg-zinc-800 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                          <div className="flex-1 pr-2 min-w-0">
                            <div className={`font-bold text-[11px] sm:text-xs md:text-sm truncate w-full ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{addon.name}</div>
                            <div className="text-violet-400 text-[9px] md:text-[10px] font-black tracking-widest uppercase mt-1 md:mt-2">+{formatRupiah(addon.price)}</div>
                          </div>
                          <div className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-violet-600 border-violet-600 text-white' : 'border-zinc-700 text-transparent'}`}><Icons.Check className="w-3 h-3 md:w-4 md:h-4" /></div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* KANAN: DYNAMIC CHECKOUT AREA */}
            <div className="xl:col-span-1 w-full min-w-0">
              <Reveal delay={500}>
                <div className="bg-zinc-900/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-zinc-700/50 sticky top-28 shadow-2xl w-full box-border">
                  
                  {/* --- STATE 1: KERANJANG (CART) --- */}
                  {checkoutStep === 'cart' && (
                    <div className="animate-in fade-in duration-300">
                      <h3 className="text-white font-black text-xl md:text-2xl italic uppercase tracking-tighter mb-6 pb-6 border-b border-zinc-800">Booking Summary</h3>
                      
                      {cartSlots.length === 0 ? (
                        <div className="text-center py-16 text-zinc-600 flex flex-col items-center">
                          <Icons.Calendar className="w-12 h-12 mb-4 opacity-50" />
                          <p className="text-sm font-bold uppercase tracking-widest">Belum ada jadwal</p>
                        </div>
                      ) : (
                        <div className="space-y-6 w-full">
                          
                          {/* INPUT NAMA */}
                          <div className="w-full">
                              <label htmlFor="input-nama" className="text-[10px] font-black text-white uppercase tracking-widest mb-2 block flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span> Nama Pemesan / Band
                              </label>
                              <input 
                                  id="input-nama"
                                  type="text" 
                                  placeholder="Masukkan nama..." 
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-sm text-white font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600"
                              />
                          </div>

                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 w-full">
                            <div className="text-[9px] font-black tracking-widest uppercase text-violet-500 mb-1">Layanan</div>
                            <div className="text-white font-bold text-sm truncate">{selectedService.name}</div>
                            <div className="text-zinc-500 text-xs mt-1">{formatRupiah(selectedService.price)}/jam</div>
                          </div>

                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 w-full">
                            <div className="text-[9px] font-black tracking-widest uppercase text-violet-500 mb-3 border-b border-zinc-800 pb-2">Jadwal: {selectedDate}</div>
                            <div className="space-y-3 w-full">
                              {cartSlots.map(slot => (
                                <div key={slot.id} className="flex justify-between items-center text-sm w-full">
                                  <span className="text-white font-bold">{slot.time}</span>
                                  <span className="text-zinc-400 font-medium shrink-0">{formatRupiah(selectedService.price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {cartAddons.length > 0 && (
                            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 w-full">
                              <div className="text-[9px] font-black tracking-widest uppercase text-violet-500 mb-3 border-b border-zinc-800 pb-2">Tambahan</div>
                              <div className="space-y-3 w-full">
                                {cartAddons.map(addon => (
                                  <div key={addon.id} className="flex justify-between items-center text-xs w-full">
                                    <span className="text-white font-medium truncate pr-2 flex-1">{addon.name}</span>
                                    <span className="text-zinc-400 shrink-0">{formatRupiah(addon.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-6 border-t border-zinc-800 w-full">
                            <div className="flex justify-between items-center mb-8 w-full">
                              <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Total Tagihan</span>
                              <span className="text-2xl md:text-3xl font-black text-white italic truncate">{formatRupiah(totalPrice)}</span>
                            </div>

                            <button 
                              onClick={proceedToPayment}
                              disabled={isProcessing}
                              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(124,58,237,0.5)] active:scale-95 flex items-center justify-center gap-2"
                            >
                              {isProcessing ? 'Memproses...' : 'Proses Pembayaran'} <Icons.ChevronRight />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- STATE 2: HALAMAN PEMBAYARAN (QRIS) --- */}
                  {checkoutStep === 'payment' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
                      
                      <div className="bg-amber-500/10 border border-amber-500/30 w-full p-4 rounded-2xl mb-6 text-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                         <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Jadwal Terkunci Sementara
                         </p>
                         <p className="text-white font-black text-3xl md:text-4xl tabular-nums tracking-tighter mt-2">
                           {formatTime(timeLeft)}
                         </p>
                         <p className="text-amber-200/70 text-[9px] mt-2">Segera selesaikan pembayaran sebelum waktu habis.</p>
                      </div>

                      <h3 className="text-white font-black text-xl italic uppercase tracking-tighter mb-2">Instruksi Pembayaran</h3>
                      <p className="text-zinc-400 text-xs text-center mb-6">Scan QRIS di bawah ini dengan aplikasi M-Banking atau E-Wallet Anda (OVO, GoPay, Dana, dll).</p>

                      <div className="bg-white p-4 rounded-3xl w-full max-w-[250px] aspect-square flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                         <img src={ASSETS.qris} alt="QRIS Studio" className="w-full h-full object-contain" />
                      </div>

                      <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center mb-8">
                         <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Nominal Transfer</p>
                         <p className="text-white font-black text-2xl md:text-3xl italic">{formatRupiah(totalPrice)}</p>
                      </div>

                      <div className="w-full space-y-3">
                        <button 
                          onClick={confirmToWhatsApp}
                          disabled={isProcessing}
                          className="group w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs py-4 md:py-5 rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3 overflow-hidden relative"
                        >
                           <span className="relative z-10 flex items-center gap-2">Kirim Bukti ke WhatsApp <Icons.WhatsApp /></span>
                           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out_infinite]"></span>
                        </button>

                        <button 
                          onClick={cancelCheckout}
                          disabled={isProcessing}
                          className="w-full bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 font-bold uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                           <Icons.X className="w-4 h-4" /> Batalkan & Kembali
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ACADEMY (LES DRUM) SECTION */}
      <section id="academy" className="py-16 md:py-32 border-y border-zinc-900 bg-gradient-to-b from-[#09090b] to-zinc-950 relative w-full overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] max-w-[600px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 md:px-6 w-full relative z-10">
          
          <Reveal>
            <div className="text-center mb-10 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Drum Academy</h2>
              <p className="text-emerald-400 mt-2 md:mt-4 text-[10px] md:text-sm tracking-widest uppercase font-bold">Tingkatkan Skill Permainan Drum Kamu</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto w-full min-w-0">
            <Reveal delay={200}>
              <div className="bg-zinc-900/50 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 relative group w-full shadow-lg">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity"><Icons.Star /></div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Paket Private</h3>
                <p className="text-zinc-400 text-sm mb-6">Fokus 1 on 1 dengan instruktur profesional.</p>
                <div className="text-4xl font-black text-emerald-400 mb-6 tracking-tighter">380K <span className="text-xs font-normal text-zinc-500 tracking-normal uppercase">/ Bulan</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> 4x Pertemuan Sebulan</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> 60 Menit per Pertemuan</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> Jadwal Fleksibel (Pilih Sendiri)</li>
                </ul>
                <a href="https://wa.me/6281234567890?text=Halo%20min,%20saya%20mau%20daftar%20Les%20Drum%20Paket%20Private" target="_blank" rel="noreferrer" className="block w-full text-center bg-zinc-800 hover:bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">Daftar Private</a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="bg-zinc-900/50 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 relative group w-full shadow-lg">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Paket Reguler</h3>
                <p className="text-zinc-400 text-sm mb-6">Belajar bareng teman biar makin asik & seru.</p>
                <div className="text-4xl font-black text-emerald-400 mb-6 tracking-tighter">300K <span className="text-xs font-normal text-zinc-500 tracking-normal uppercase">/ Bln / Org</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> 4x Pertemuan Sebulan</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> 60 Menit per Pertemuan</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Icons.Check className="w-5 h-5 text-emerald-500" /> Maksimal 2 Orang dalam 1 Sesi</li>
                </ul>
                <a href="https://wa.me/6281234567890?text=Halo%20min,%20saya%20mau%20daftar%20Les%20Drum%20Paket%20Reguler" target="_blank" rel="noreferrer" className="block w-full text-center bg-zinc-800 hover:bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">Daftar Reguler</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER WITH LOGO */}
      <footer className="bg-black py-16 border-t border-zinc-900 text-center w-full">
        <Reveal>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden p-2">
               <img src={ASSETS.logo} alt="AyuStudio Logo" className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">Ayu<span className="text-violet-500">Studio</span></h3>
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold text-zinc-600 px-4 max-w-md mx-auto leading-relaxed">
              &copy; 2026 Ayu Studio Booking System. <br className="md:hidden" /> Developed for Professional Musicians.
            </p>
          </div>
        </Reveal>
      </footer>

      {/* ========================================================= */}
      {/* 🚀 FLOATING ACTION BAR (HANYA MUNCUL DI MOBILE SAAT CART) 🚀 */}
      {/* ========================================================= */}
      <div 
        className={`xl:hidden fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-4 pb-6 z-40 transition-transform duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] ${(cartSlots.length > 0 && checkoutStep === 'cart') ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 truncate w-full">
              {cartSlots.length} Jam • {selectedService.name.replace('Sewa ', '')}
            </span>
            <span className="text-white font-black text-lg sm:text-xl italic leading-none truncate w-full">
              {formatRupiah(totalPrice)}
            </span>
          </div>
          <button 
            onClick={() => { document.getElementById('booking-summary')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[9px] sm:text-[10px] px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/50"
          >
            Selesaikan <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global CSS Styling */}
      <style>{`
        @keyframes shine { 100% { transform: translateX(100%); } }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px rgba(225,29,72,0.3); }
          50% { opacity: 0.8; transform: scale(1.02); box-shadow: 0 0 30px rgba(225,29,72,0.6); }
        }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.8); }
        .touch-manipulation { touch-action: manipulation; } 
      `}</style>
    </div>
  );
}