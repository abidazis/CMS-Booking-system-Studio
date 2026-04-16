import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, onSnapshot, doc, updateDoc, addDoc, query, orderBy, writeBatch } from 'firebase/firestore';

// ======================================================================
// 🚀 CONFIG FIREBASE PANEL MUSIC (Tetap pakai yg lama gak masalah)
// ======================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAkXmReTZmz7xCO_GnRTfQ-xhXc-5WIy1E",
  authDomain: "panelmusic-booking.firebaseapp.com",
  projectId: "panelmusic-booking",
  storageBucket: "panelmusic-booking.firebasestorage.app",
  messagingSenderId: "759612402156",
  appId: "1:759612402156:web:c4b782967a71c4f01678c9"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// --- ASSETS & ICONS ---
const ASSETS = {
  logo: "/logo.png", 
  hero_utama: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop", 
};

const Icons = {
  Music: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Check: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  X: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
};

// --- ANIMASI SCROLL ---
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setTimeout(() => setIsVisible(true), delay); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>{children}</div>;
};

// --- DATA KATALOG PANEL MUSIC ---
const SERVICES = [
  { id: 'std1', name: 'Studio 1', category: 'Rehearsal', price: 50000, icon: '🎸' },
  { id: 'std2', name: 'Studio 2', category: 'Rehearsal', price: 50000, icon: '🥁' },
  { id: 'std3', name: 'Studio 3', category: 'Rehearsal', price: 50000, icon: '🎤' },
  { id: 'rec_live', name: 'LiveTrack Rec', category: 'Recording', price: 120000, icon: '🎛️' },
  { id: 'rec_1hr', name: 'Track Rec (1 Jam)', category: 'Recording', price: 120000, icon: '🎙️' },
  { id: 'rec_shift', name: 'Track Rec (1 Shift / 6 Jam)', category: 'Recording', price: 850000, icon: '🎧' },
];

const ADDONS = [
  { id: 'a1', name: 'Double Pedal', price: 20000 },
  { id: 'a2', name: 'Keyboard', price: 40000 },
];

export default function App() {
  const getDateLabel = (offset) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- FORM CUSTOM PANEL MUSIC ---
  const [formData, setFormData] = useState({
    namaBand: '', namaPendaftar: '', noTelp: '', alamat: '', jmlPersonil: '', note: ''
  });
  
  const [ticketData, setTicketData] = useState(null); 
  const [toast, setToast] = useState(null); 

  const showToast = (message, type = 'info') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000);
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

  const isPastTime = (slotTime) => {
    const todayStr = getDateLabel(0);
    if (selectedDate !== todayStr) return false; 
    const now = new Date();
    return parseInt(slotTime.split(':')[0], 10) <= now.getHours(); 
  };

  const isFridayBreak = (slotTime) => {
    const d = new Date(selectedDate);
    if (d.getDay() === 5) { // 5 = Jumat
        if (slotTime.startsWith("11") || slotTime.startsWith("12")) return true;
    }
    return false;
  };

  const seedDatabaseForDate = async (targetDate) => {
    // Generate Jam 09:00 sampai 23:00 (14 Slot)
    const slotsData = [];
    let idCounter = 1;
    for(let i=9; i<=22; i++) {
        slotsData.push({ id: idCounter++, time: `${i.toString().padStart(2, '0')}:00 - ${(i+1).toString().padStart(2, '0')}:00`, status: "available" });
    }

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
    
    // Auto-select for 6 Hour Shift (Panel Music Logic)
    if(selectedService.id === 'rec_shift') {
        const startIndex = slots.findIndex(s => s.id === slot.id);
        const shiftSlots = slots.slice(startIndex, startIndex + 6);
        
        if(shiftSlots.length < 6 || shiftSlots.some(s => s.status !== 'available' || isPastTime(s.time))) {
            showToast("Sisa jam tidak cukup untuk 1 Shift (6 Jam). Pilih jam lebih awal.", "error");
            return;
        }
        setCartSlots(shiftSlots);
        showToast("6 Jam berhasil dipilih otomatis!", "success");
        return;
    }

    if (cartSlots.find(s => s.id === slot.id)) setCartSlots(cartSlots.filter(s => s.id !== slot.id));
    else setCartSlots([...cartSlots, slot].sort((a, b) => a.id - b.id));
  };

  const toggleAddon = (addon) => {
    if (cartAddons.find(a => a.id === addon.id)) setCartAddons(cartAddons.filter(a => a.id !== addon.id));
    else setCartAddons([...cartAddons, addon]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalPrice = (selectedService.id === 'rec_shift' ? selectedService.price : (cartSlots.length * selectedService.price)) + cartAddons.reduce((sum, a) => sum + a.price, 0);
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setIsMobileMenuOpen(false); };

  const processBooking = async () => {
    if (cartSlots.length === 0) return showToast("Pilih jadwal jam dulu ya Kak!", "error");
    if (!formData.namaBand || !formData.noTelp || !formData.namaPendaftar) {
        showToast("Nama Band, Pendaftar & No WA wajib diisi!", "error");
        document.getElementById('form-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    setIsProcessing(true);
    const waNumber = "6281390006257"; // GANTI NOMOR WA STUDIO PANEL MUSIC DI SINI
    
    // Logic Auto ID Panel Music (4 digit terakhir HP + Random)
    const hpAkhir = formData.noTelp.slice(-4) || "0000";
    const randomCode = Math.floor(100 + Math.random() * 900);
    const idBand = `BND-${hpAkhir}`;
    const bookingId = `2026-${randomCode}`; // Format tiket: 2026-XXXX

    try {
      // 1. Kunci Jadwal Langsung (Pending / Kuning di Admin)
      for (const slot of cartSlots) {
        await updateDoc(doc(db, "slots_by_date", selectedDate, "items", String(slot.id)), { status: 'pending' });
      }

      // 2. Simpan Data Super Lengkap ke Database Admin (Buat Excel)
      await addDoc(collection(db, "bookings"), {
        bookingId: bookingId,
        kodeCabang: "BKS-01",
        idBand: idBand,
        customerName: formData.namaBand, 
        namaPendaftar: formData.namaPendaftar,
        noTelp: formData.noTelp,
        alamat: formData.alamat,
        jmlPersonil: formData.jmlPersonil,
        note: formData.note,
        service: selectedService.name,
        date: selectedDate, 
        time: cartSlots.map(s => s.time).join(", "),
        price: totalPrice,
        addons: cartAddons.map(a => a.name).join(", "),
        status: "pending", // Artinya bayar di tempat
        createdAt: new Date().toISOString()
      });
      
      // 3. Format Template WA Otomatis (Sesuai Permintaan Panel Music)
      const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum\'at','Sabtu'];
      const namaHari = days[new Date(selectedDate).getDay()];
      const strJam = cartSlots.map(s => s.time.split(':')[0]).join(', ');
      const strAddons = cartAddons.length > 0 ? cartAddons.map(a => a.name).join(', ') : 'Tidak';

      let msg = `Halo Sobat Panel (Sopan)! 🤩\n\nSelamat Datang di Panel Music Studio Bekasi.\n✨Sederhana, Kreatif, dan Konsisten✨\n\n*Untuk Booking Silahkan Copas dan Wajib Isi Form dibawah :*\n___________________________\n`;
      msg += `Nama Band   : ${formData.namaBand}\n`;
      msg += `Studio / Layanan  : ${selectedService.name}\n`;
      msg += `Hari   : ${namaHari}\n`;
      msg += `Tgl    : ${selectedDate}\n`;
      msg += `Jam  (Tanpa Menit)  : ${strJam}\n`;
      msg += `Durasi  (Jam)  : ${selectedService.id === 'rec_shift' ? '1 Shift (6 Jam)' : cartSlots.length}\n`;
      msg += `Plus KeyBoard /Double Pedal/Tidak : ${strAddons}\n`;
      msg += `___________________________\n\n`;
      msg += `*Jadwal Studio :*\nBuka Setiap Hari..\nJam : 09.00 sd 23.00\n*Mohon Datang Tepat Waktu*\n*Jam Akhir Booking : 21.00 *\n*Kami Tunggu di Studio..Yaa..* 🥳`;
      
      setTicketData({
          bookingId,
          namaBand: formData.namaBand,
          service: selectedService.name,
          date: selectedDate,
          time: cartSlots.map(s => s.time).join(", "),
          total: totalPrice
      });

      // Buka WA
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      
      // Bersihkan Keranjang
      setCartSlots([]); setCartAddons([]);
      setFormData({namaBand: '', namaPendaftar: '', noTelp: '', alamat: '', jmlPersonil: '', note: ''});

    } catch (e) { 
      showToast("Gagal memproses pesanan, cek koneksi internet!", "error"); 
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-[#111113] text-zinc-300 font-sans min-h-screen selection:bg-emerald-500/30 pb-32 xl:pb-0 overflow-x-hidden max-w-[100vw] flex flex-col relative">
      
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

      {/* E-TICKET MODAL (TANPA DP) */}
      {ticketData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setTicketData(null)}></div>
          
          <div className="bg-zinc-100 rounded-[2rem] w-full max-w-sm relative z-10 text-slate-900 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col my-auto">
            <div className="bg-emerald-600 p-8 text-center text-white relative">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
              <div className="relative z-10 flex flex-col items-center">
                  <h2 className="text-3xl font-black italic tracking-tighter">Panel Music.</h2>
                  <p className="text-[9px] tracking-[0.2em] uppercase opacity-90 mt-1">Sederhana, Kreatif, Konsisten</p>
              </div>
            </div>

            <div className="p-8 relative bg-white">
              <div className="absolute -top-3 left-4 right-4 h-6 border-b-2 border-dashed border-zinc-300"></div>
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#111113] rounded-full"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#111113] rounded-full"></div>

              <div className="text-center mb-6 mt-2">
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">ID Tiket</p>
                 <p className="text-3xl font-black tracking-tighter text-slate-800">{ticketData.bookingId}</p>
                 <div className="inline-block bg-amber-100 text-amber-600 border border-amber-200 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 animate-pulse">
                     BAYAR DI KASIR STUDIO
                 </div>
              </div>

              <div className="space-y-4 border-t border-b border-zinc-100 py-5 my-5">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Band</span>
                    <span className="text-sm font-black text-slate-800 text-right">{ticketData.namaBand}</span>
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
                    <span className="text-sm font-black text-emerald-600 text-right whitespace-pre-wrap">{ticketData.time.split(', ').join('\n')}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                    <span className="text-[10px] text-zinc-500 font-black uppercase">Total Bayar</span>
                    <span className="text-lg font-black text-slate-900 italic text-right">{formatRupiah(ticketData.total)}</span>
                 </div>
              </div>

              <button onClick={() => setTicketData(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-colors flex items-center justify-center gap-2">
                 <Icons.Check className="w-4 h-4" /> Oke, Saya Paham
              </button>
              <p className="text-center text-[9px] text-zinc-400 mt-4 italic">Screenshot tiket ini dan tunjukkan ke kasir saat datang.</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed w-full z-[150] transition-all duration-500 ${scrolled ? 'bg-[#111113]/95 backdrop-blur-xl border-b border-zinc-800 py-3 shadow-2xl' : 'bg-gradient-to-b from-[#111113]/90 to-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white">Panel<span className="text-emerald-500">Music.</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
            <button onClick={() => scrollTo('home')} className="hover:text-white transition">Beranda</button>
            <button onClick={() => scrollTo('booking')} className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Booking
            </button>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu />} 
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed inset-0 z-[140] bg-[#111113]/95 backdrop-blur-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-8 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <button onClick={() => scrollTo('home')} className="text-3xl font-black text-white tracking-tighter">Beranda</button>
        <button onClick={() => scrollTo('booking')} className="text-3xl font-black text-emerald-500 tracking-tighter">Booking Jadwal</button>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-24 pb-16 md:pt-48 md:pb-32 px-5 md:px-6 min-h-[85vh] flex items-center w-full overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[150vw] max-w-[600px] h-[300px] md:h-[400px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 w-full min-w-0">
          <Reveal delay={100}>
            <div className="space-y-6 md:space-y-8 text-center lg:text-left mt-8 md:mt-0 min-w-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-300 cursor-default">
                ✨ Sederhana, Kreatif, Konsisten
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter w-full break-words">
                Panel <br />
                <span className="text-emerald-500">Music.</span>
              </h1>
              <p className="text-sm md:text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Rehearsal Studio & Recording Professional di Bekasi. Cek ketersediaan jadwal dan booking langsung tanpa perlu bayar DP (Bayar di Kasir).
              </p>
              <div className="pt-2 md:pt-4">
                <button onClick={() => scrollTo('booking')} className="bg-emerald-600 text-white px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm transition-all active:scale-95 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 mx-auto lg:mx-0 w-full sm:w-auto hover:-translate-y-1">
                  <Icons.Calendar /> Booking Sekarang
                </button>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-full perspective-1000 mt-6 md:mt-0 min-w-0">
              <div className="aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
                <img src={ASSETS.hero_utama} alt="Panel Music Studio" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/20 to-transparent"></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CORE: SMART BOOKING ENGINE (PANEL MUSIC) */}
      <section id="booking" className="py-16 md:py-32 px-4 md:px-6 relative w-full border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto relative z-10 w-full" id="booking-summary">
          
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Reservasi Studio</h2>
              <p className="text-emerald-500 mt-2 text-[10px] md:text-xs tracking-widest uppercase font-bold">Tidak Perlu DP, Pembayaran Dilakukan di Kasir</p>
            </div>
          </Reveal>

          <div className="grid xl:grid-cols-3 gap-6 md:gap-8 w-full min-w-0">
            
            {/* KIRI: PEMILIH LAYANAN & JADWAL */}
            <div className="xl:col-span-2 space-y-6 md:space-y-8 w-full min-w-0">
              
              {/* 1. Service Selector (DIPISAH REHEARSAL & RECORDING) */}
              <Reveal delay={100}>
                <div className="bg-zinc-900/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-zinc-800 shadow-xl w-full box-border">
                  <h3 className="text-white font-black mb-6 uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-4">
                    1. Pilih Layanan
                  </h3>
                  
                  {/* Rehearsal */}
                  <div className="mb-6">
                      <div className="text-[10px] font-black text-zinc-500 mb-3 uppercase tracking-widest pl-1">Rehearsal (Latihan)</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {SERVICES.filter(s => s.category === 'Rehearsal').map((srv) => (
                          <button key={srv.id} onClick={() => { setSelectedService(srv); setCartSlots([]); }} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-full text-left ${selectedService.id === srv.id ? 'bg-emerald-600/10 border-emerald-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                            <span className="text-2xl mb-2">{srv.icon}</span>
                            <span className={`font-bold text-xs ${selectedService.id === srv.id ? 'text-white' : 'text-zinc-400'}`}>{srv.name}</span>
                            <span className="text-emerald-500 font-black text-[10px] mt-1">{formatRupiah(srv.price)}/jam</span>
                          </button>
                        ))}
                      </div>
                  </div>

                  {/* Recording */}
                  <div>
                      <div className="text-[10px] font-black text-zinc-500 mb-3 uppercase tracking-widest pl-1">Recording Session</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {SERVICES.filter(s => s.category === 'Recording').map((srv) => (
                          <button key={srv.id} onClick={() => { setSelectedService(srv); setCartSlots([]); }} className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all w-full text-left ${selectedService.id === srv.id ? 'bg-emerald-600/10 border-emerald-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                            <span className="text-xl mb-2">{srv.icon}</span>
                            <span className={`font-black text-xs md:text-sm leading-tight ${selectedService.id === srv.id ? 'text-white' : 'text-zinc-300'}`}>{srv.name}</span>
                            {srv.desc && <span className="text-[9px] text-zinc-500 font-medium mt-1 leading-relaxed">{srv.desc}</span>}
                            <span className="text-emerald-500 font-black text-[10px] mt-2 bg-emerald-500/10 px-2 py-1 rounded-md">{formatRupiah(srv.price)}</span>
                          </button>
                        ))}
                      </div>
                  </div>
                </div>
              </Reveal>

              {/* 2. Date Selector */}
              <Reveal delay={200}>
                <div className="bg-zinc-900/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-zinc-800 shadow-xl w-full box-border">
                  <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-4">
                    2. Pilih Hari (Buka 09:00 - 23:00)
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x w-full">
                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                      const dateStr = getDateLabel(offset);
                      const d = new Date(); d.setDate(d.getDate() + offset);
                      const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
                      const label = offset === 0 ? "Hari Ini" : offset === 1 ? "Besok" : days[d.getDay()];
                      return (
                        <button key={dateStr} onClick={() => { setSelectedDate(dateStr); setCartSlots([]); }} className={`snap-center shrink-0 min-w-[100px] px-4 py-3 md:px-5 md:py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all ${selectedDate === dateStr ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'bg-zinc-950 text-zinc-500 border border-zinc-800'}`}>
                          {label}
                          <div className="text-[10px] font-normal opacity-70 mt-1 normal-case tracking-normal">{dateStr}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Reveal>

              {/* 3. Time Slot */}
              <Reveal delay={300}>
                <div className="bg-zinc-900/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-zinc-800 shadow-xl w-full box-border">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 border-b border-zinc-800 pb-4">
                    <h3 className="text-white font-black uppercase tracking-widest text-[10px]">3. Pilih Jam</h3>
                    <div className="flex flex-wrap gap-3 text-[8px] uppercase font-black tracking-widest">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-700"></span> Booked</span>
                    </div>
                  </div>

                  {slots.length < 14 && (
                     <button onClick={() => seedDatabaseForDate(selectedDate)} className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 w-full rounded-xl mb-6 uppercase tracking-widest text-[10px] animate-pulse">
                       ⚠️ Klik Untuk Buka Slot Jam (09:00 - 23:00) 🚀
                     </button>
                  )}

                  {selectedService.id === 'rec_shift' && (
                     <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl mb-6 text-xs font-bold text-center">
                         Paket 1 Shift (6 Jam): Cukup klik 1 jam kedatangan awal, sisa jam akan otomatis terpesan.
                     </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                    {slots.map((slot) => {
                      // LOGIKA BREAK JUMAT (Hilangkan jam 11 dan 12)
                      if(isFridayBreak(slot.time)) return null;

                      const isSelected = cartSlots.find(s => s.id === slot.id);
                      const past = isPastTime(slot.time);
                      let btnClass = "relative flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all w-full ";
                      let statusText = "Tersedia"; let indicatorColor = "bg-emerald-500";
                      
                      if (past) { btnClass += "bg-zinc-900 border-zinc-900 opacity-40 cursor-not-allowed"; statusText = "Terlewat"; indicatorColor = "hidden"; } 
                      else if (slot.status === 'booked' || slot.status === 'blocked') { btnClass += "bg-[#111113] border-zinc-800 text-zinc-600 cursor-not-allowed"; statusText = "Penuh"; indicatorColor = "hidden"; } 
                      else if (slot.status === 'pending') { btnClass += "bg-zinc-950 border-amber-900/30 text-amber-500/50 cursor-not-allowed"; statusText = "Menunggu"; indicatorColor = "bg-amber-500 animate-pulse"; } 
                      else if (isSelected) { btnClass += "bg-emerald-600 border-emerald-500 text-white z-10 shadow-lg"; indicatorColor = "hidden"; } 
                      else { btnClass += "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-white cursor-pointer"; }

                      return (
                        <button key={slot.id} onClick={() => toggleSlot(slot)} disabled={past || slot.status !== 'available'} className={btnClass}>
                          {isSelected && <div className="absolute top-1.5 right-1.5 text-white"><Icons.Check className="w-4 h-4" /></div>}
                          {!isSelected && indicatorColor !== "hidden" && <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${indicatorColor}`}></div>}
                          <span className="font-black text-sm md:text-lg tracking-tighter">{slot.time.split(' - ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-zinc-500 text-[10px] mt-6 italic text-center">*Durasi bersih latihan adalah 50 menit (10 menit untuk istirahat & pergantian pemain).</p>
                </div>
              </Reveal>

              {/* 4. Addons */}
              <Reveal delay={400}>
                <div className="bg-zinc-900/80 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-zinc-800 shadow-xl w-full">
                  <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[10px] border-b border-zinc-800 pb-4">4. Tambah Alat (Opsional)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {ADDONS.map((addon) => {
                      const isSelected = cartAddons.find(a => a.id === addon.id);
                      return (
                        <button key={addon.id} onClick={() => toggleAddon(addon)} className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${isSelected ? 'bg-zinc-800 border-emerald-500' : 'bg-zinc-950 border-zinc-800'}`}>
                          <div className="flex-1 pr-2 text-left">
                            <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{addon.name}</div>
                            <div className="text-emerald-400 text-[9px] font-black tracking-widest uppercase mt-1">+{formatRupiah(addon.price)}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-700 text-transparent'}`}><Icons.Check className="w-3 h-3" /></div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* KANAN: CUSTOM FORM & SUMMARY AREA */}
            <div className="xl:col-span-1 w-full min-w-0" id="form-area">
              <Reveal delay={500}>
                <div className="bg-zinc-900/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-zinc-700/50 sticky top-28 shadow-2xl w-full box-border">
                  
                  <h3 className="text-white font-black text-lg italic uppercase tracking-tighter mb-6 pb-4 border-b border-zinc-800">Form Pemesanan</h3>
                  
                  {cartSlots.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 flex flex-col items-center">
                      <Icons.Calendar className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Pilih jadwal dulu kak</p>
                    </div>
                  ) : (
                    <div className="space-y-4 w-full">
                      
                      {/* CUSTOM INPUT PANEL MUSIC */}
                      <div>
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Nama Band <span className="text-rose-500">*</span></label>
                          <input name="namaBand" value={formData.namaBand} onChange={handleInputChange} type="text" placeholder="Masukkan nama band..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-colors" />
                      </div>
                      
                      <div>
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Nama Pendaftar <span className="text-rose-500">*</span></label>
                          <input name="namaPendaftar" value={formData.namaPendaftar} onChange={handleInputChange} type="text" placeholder="Nama perwakilan..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-colors" />
                      </div>

                      <div>
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">No WhatsApp <span className="text-rose-500">*</span></label>
                          <input name="noTelp" value={formData.noTelp} onChange={handleInputChange} type="number" placeholder="081234567..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-colors" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Jml Personil</label>
                            <input name="jmlPersonil" value={formData.jmlPersonil} onChange={handleInputChange} type="number" placeholder="Berapa orang?" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Domisili/Alamat</label>
                            <input name="alamat" value={formData.alamat} onChange={handleInputChange} type="text" placeholder="Cikarang..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                      </div>

                      <div>
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Catatan Tambahan (Opsional)</label>
                          <textarea name="note" value={formData.note} onChange={handleInputChange} rows="2" placeholder="Cth: Tolong siapkan kabel jack 2..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
                      </div>

                      {/* SUMMARY KECIL */}
                      <div className="bg-[#111113] p-4 rounded-xl border border-zinc-800/50 mt-4">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Layanan</span>
                            <span className="text-xs font-black text-white">{selectedService.name}</span>
                         </div>
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Jadwal</span>
                            <span className="text-xs font-bold text-zinc-300">{selectedDate} ({cartSlots.length} Jam)</span>
                         </div>
                         <div className="flex justify-between items-center pt-3 mt-3 border-t border-zinc-800">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Bayar (Di Kasir)</span>
                            <span className="text-xl font-black text-white italic">{formatRupiah(totalPrice)}</span>
                         </div>
                      </div>

                      <button 
                        onClick={processBooking}
                        disabled={isProcessing}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)] mt-4 active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? 'Memproses...' : 'Booking & Kirim WA'} <Icons.WhatsApp />
                      </button>
                      <p className="text-center text-[9px] text-zinc-500 mt-2">Tidak perlu DP. Pembayaran dilakukan di studio.</p>

                    </div>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 border-t border-zinc-900 text-center w-full">
        <Reveal>
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tighter">Panel<span className="text-emerald-500">Music.</span></h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-zinc-600 px-4 leading-relaxed">
              &copy; 2026 Panel Music Studio. <br className="md:hidden" /> Sederhana, Kreatif, Konsisten.
            </p>
          </div>
        </Reveal>
      </footer>

      {/* FLOATING ACTION BAR MOBILE */}
      <div className={`xl:hidden fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-4 pb-6 z-40 transition-transform duration-500 ${(cartSlots.length > 0) ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-md mx-auto flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-0.5 truncate w-full">
              {cartSlots.length} Jam • Bayar di Studio
            </span>
            <span className="text-white font-black text-lg italic leading-none truncate w-full">
              {formatRupiah(totalPrice)}
            </span>
          </div>
          <button 
            onClick={() => { document.getElementById('form-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
            className="shrink-0 bg-emerald-600 text-white font-black uppercase tracking-widest text-[9px] px-5 py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            Isi Form <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
}