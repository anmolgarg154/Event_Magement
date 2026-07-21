import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo1 from '/logo.jpg';
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../slices/authSlice.js";
import { User, ChevronDown, LogOut, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthContext } from "../context/AuthContext";

const NAV_ITEMS = [
  { title: "Dashboard", link: "/" },
  { title: "Events", link: "/events" }
];

const Navbar = () => {
  const { user, setUser } = useAuthContext();
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [clickedDropdown, setClickedDropdown] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const dropdownRefs = useRef([]);
  const isLoggedIn = !!user;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close everything on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setDropdownOpen(null);
  }, [location.pathname]);

  // Scroll behavior
  useEffect(() => {
    const THRESHOLD = 6;
    const onScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 60);
      if (current < 80) {
        setNavVisible(true);
      } else if (current > lastScrollY + THRESHOLD) {
        setNavVisible(false);
        setDropdownOpen(null);
        setClickedDropdown(false);
      } else if (current < lastScrollY - THRESHOLD) {
        setNavVisible(true);
      }
      setLastScrollY(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && isMobileMenuOpen)
        setIsMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownOpen !== null && clickedDropdown) {
        const ref = dropdownRefs.current[dropdownOpen];
        if (ref && !ref.contains(e.target)) { setDropdownOpen(null); setClickedDropdown(false); }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen, clickedDropdown]);

  const handleDropdownToggle = (i) => { setDropdownOpen(dropdownOpen === i ? null : i); setClickedDropdown(true); };
  const handleDropdownHover = (i) => { if (!clickedDropdown) setDropdownOpen(i); };
  const handleDropdownLeave = () => { if (!clickedDropdown) setDropdownOpen(null); };
  const isActive = (link) => location.pathname === link;

  async function doLogout() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + 'user/logout', {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(logout());
        setUser(null);
        toast.success('Logout Successful');
      } else {
        toast.warn('Logout Failed');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
    navigate('/');
  }

  const textColor = isScrolled ? '#111827' : '#ffffff';
  const hoverBg = isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.13)';
  const borderClr = isScrolled ? 'rgba(17,24,39,0.3)' : 'rgba(255,255,255,0.4)';
  const accentClr = isScrolled ? '#0b1545' : '#ffffff';

  const DesktopAuth = () => isLoggedIn ? (
    <div className="flex items-center gap-2">
      <Link to="/profile">
        <motion.div
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="w-9 h-9 border-2 flex items-center justify-center transition-all duration-300"
          style={{ borderColor: borderClr }}
        >
          <User className="w-4 h-4 transition-colors duration-300" style={{ color: textColor }} />
        </motion.div>
      </Link>
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
        onClick={doLogout}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white transition-all duration-300"
        style={{
          background: isScrolled
            ? 'linear-gradient(135deg, #010d29, #0b1545)'
            : 'rgba(255,255,255,0.18)',
          border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.38)',
          backdropFilter: isScrolled ? 'none' : 'blur(8px)',
        }}
      >
        <LogOut className="w-3.5 h-3.5" />
        Logout
      </motion.button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <motion.span
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="block px-4 py-2 text-sm font-bold border transition-all duration-300 cursor-pointer"
          style={{ borderColor: borderClr, color: textColor }}
        >
          Login
        </motion.span>
      </Link>
    </div>
  );

  //  Mobile Auth 
  const MobileAuth = () => isLoggedIn && (
    <div className="mt-2 pt-5 border-t border-slate-100 space-y-2.5">
      <Link
        to="/profile"
        onClick={() => setIsMobileMenuOpen(false)}
        className="flex items-center gap-3 px-4 py-3 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <User className="w-4 h-4 text-[#0b1545]" /> My Profile
      </Link>
      <button
        onClick={() => { doLogout(); setIsMobileMenuOpen(false); }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #010d29, #0b1545)' }}
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  )

  return (
    <>
      <motion.nav
        className={`${location.pathname === '/' && 'fixed'} left-0 top-0 w-full z-50`}
        animate={{ y: navVisible ? 0 : '-100%', opacity: navVisible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="transition-all duration-500"
          style={{
            background:
              location.pathname === '/'
                ? (isScrolled ? '#000000' : '#000000')
                : '#000000',
            boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.09)' : 'none',
            borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
          }}
        >

          {/*  DESKTOP BAR  */}
          <div className="hidden lg:flex items-center justify-between gap-3 px-6 xl:px-12 h-17">
            <Link to="/" className="shrink-0">
              <motion.img
                src={logo1}
                alt="Logo"
                className="h-16 w-auto object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            <div className="flex items-center gap-0.5 xl:gap-1">
              {NAV_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  ref={item.dropdown ? (ref) => (dropdownRefs.current[index] = ref) : null}
                >
                  {item.dropdown ? (
                    <div onMouseEnter={() => handleDropdownHover(index)} onMouseLeave={handleDropdownLeave}>
                      <button
                        onClick={() => handleDropdownToggle(index)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-all duration-200"
                        style={{
                          color: textColor,
                          background: dropdownOpen === index ? hoverBg : 'transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = dropdownOpen === index ? hoverBg : 'transparent'; }}
                      >
                        {item.title}
                        <motion.span
                          className="mt-0.5"
                          animate={{ rotate: dropdownOpen === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {dropdownOpen === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute left-0 top-full mt-1 bg-white shadow-2xl border border-slate-100 py-2.5 w-60 z-50"
                            style={{ boxShadow: '0 16px 48px rgba(11,21,69,0.14)' }}
                            onMouseLeave={() => !clickedDropdown && setDropdownOpen(null)}
                          >
                            <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />
                            {item.dropdown.map((sub, si) => (
                              <Link
                                key={si}
                                to={sub.link}
                                onClick={() => { setDropdownOpen(null); setClickedDropdown(false); }}
                                className={`flex items-center px-5 py-2.5 text-sm font-semibold transition-all group ${isActive(sub.link)
                                  ? 'text-[#0b1545] bg-blue-50'
                                  : 'text-slate-700 hover:text-[#0b1545] hover:bg-slate-50'
                                  }`}
                              >
                                <motion.span
                                  className="flex items-center gap-3 w-full"
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: si * 0.04 }}
                                >
                                  <span className={`w-1.5 h-1.5 shrink-0 transition-all ${isActive(sub.link) ? 'bg-[#0b1545]' : 'bg-slate-300 group-hover:bg-[#0b1545]'
                                    }`} />
                                  {sub.name}
                                </motion.span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.link || '#'}
                      className="relative px-3 py-2 text-sm font-semibold block transition-all duration-200 group"
                      style={{ color: isActive(item.link) ? accentClr : textColor }}
                      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {item.title}
                      <span
                        className="absolute bottom-1 left-3 right-3 h-0.5 transition-all duration-300"
                        style={{
                          background: accentClr,
                          opacity: isActive(item.link) ? 1 : 0,
                        }}
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <DesktopAuth />
            </div>
          </div>

          {/*  MOBILE TOP BAR  */}
          <div className="lg:hidden flex items-center justify-between px-4 h-15">
            <Link to="/">
              <motion.img
                src={logo1}
                alt="Logo"
                className="h-8 w-auto object-contain"
                whileTap={{ scale: 0.96 }}
              />
            </Link>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <Link to="/user-dashboard">
                  <div
                    className="w-8 h-8 border-2 flex items-center justify-center transition-all duration-300"
                    style={{ borderColor: borderClr }}
                  >
                    <User className="w-4 h-4" style={{ color: textColor }} />
                  </div>
                </Link>
              )}

              {/* Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
                style={{ borderColor: borderClr, color: textColor }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? 'x' : 'b'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 h-screen w-72 max-w-[88vw] bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 h-15 shrink-0"
                style={{ background: 'linear-gradient(135deg, #010d29 0%, #0b1545 100%)' }}
              >
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src={logo1} alt="Logo" className="h-8 w-auto object-contain" />
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 bg-white/10 border border-white/25 flex items-center justify-center text-white"
                >
                  <FaTimes size={13} />
                </motion.button>
              </div>

              {/* Destination badge */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
                <MapPin className="w-3.5 h-3.5 text-[#0b451c] shrink-0" />
                <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-700">
                  150+ Destinations Worldwide
                </span>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 pt-3 pb-2">
                {NAV_ITEMS.map((item, index) => (
                  <div key={index} className="mb-0.5">
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                          className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0b1545] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-1.5 h-1.5 shrink-0 ${isActive(item.link) ? 'bg-[#0b1545]' : 'bg-slate-300'}`} />
                            {item.title}
                          </div>
                          <motion.span animate={{ rotate: dropdownOpen === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {dropdownOpen === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden ml-4 pl-3 border-l-2 border-[#0b1545]/20 mb-1"
                            >
                              {item.dropdown.map((sub, si) => (
                                <Link
                                  key={si}
                                  to={sub.link}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-2 py-2.5 px-2 text-sm transition-colors ${isActive(sub.link) ? 'text-[#0b1545] font-semibold' : 'text-slate-500 hover:text-[#0b1545]'
                                    }`}
                                >
                                  <span className={`w-1 h-1 shrink-0 ${isActive(sub.link) ? 'bg-[#0b1545]' : 'bg-slate-300'}`} />
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-all ${isActive(item.link)
                          ? 'bg-[#0b1545]/8 text-[#0b1545] border border-[#0b1545]/15'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b1545]'
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 shrink-0 transition-all ${isActive(item.link) ? 'bg-[#0b1545]' : 'bg-slate-300'}`} />
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Auth */}
              <div className="px-4 pb-8">
                <MobileAuth />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

let connectToStore = (state) => ({ commonData: state });
let dispatchToStore = (dispatch) => ({ setLogin: (value) => dispatch(setLogin(value)) });
export default Navbar;