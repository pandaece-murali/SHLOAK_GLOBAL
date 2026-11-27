"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  GraduationCap,
  Terminal,
  ShieldCheck,
  Send,
  AlertCircle,
  Menu,
  X,
  Star,
  Quote,
  Database,
  GitBranch,
} from "lucide-react";

// Types
interface LeadFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  enquiryType: string;
  consent: boolean;
}

interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  qualification?: string;
  consent?: string;
}

export default function ShlokaLandingPage() {
  const router = useRouter();

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Curriculum tab state
  const [activeTab, setActiveTab] = useState<"manual" | "automation">("automation");
  const [expandedManualModules, setExpandedManualModules] = useState<number[]>([1, 2]);
  const [expandedAutoVolumes, setExpandedAutoVolumes] = useState<number[]>([1, 2, 3]);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Lead form state
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    qualification: "B.Tech / BE",
    enquiryType: "Book Free Demo Class",
    consent: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "missing_config">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [leadEventFired, setLeadEventFired] = useState(false);

  const getUtmParams = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"];
    keys.forEach((key) => {
      const val = searchParams.get(key);
      if (val) params[key] = val;
    });
    return params;
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (at least 2 characters).";
    }

    // 10-digit Indian mobile number starting with 6, 7, 8, or 9
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.qualification) {
      errors.qualification = "Please select qualification.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    const payload = {
      fullName: formData.fullName.trim(),
      mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
      email: formData.email.trim().toLowerCase(),
      qualification: formData.qualification,
      enquiryType: formData.enquiryType,
      courseName: "Automation Testing + Free Manual Testing",
      courseFee: "₹19,000 (Regular: ₹59,000)",
      trainingMode: "100% Online",
      source: "Meta Ads",
      utmParameters: getUtmParams(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success) {
        // Fire Meta Pixel Lead event only after successful webhook acceptance & prevent duplicates
        type FbqFn = (action: string, eventName: string, params?: Record<string, unknown>) => void;
        if (!leadEventFired && typeof window !== "undefined" && (window as unknown as { fbq?: FbqFn }).fbq) {
          try {
            const fbq = (window as unknown as { fbq: FbqFn }).fbq;
            if (typeof fbq === "function") {
              fbq("track", "Lead", {
                content_name: "Automation Testing + Free Manual Testing",
                currency: "INR",
                value: 19000,
              });
              setLeadEventFired(true);
            }
          } catch (pixelErr) {
            console.error("Meta Pixel event error:", pixelErr);
          }
        }

        // Direct instant navigation to Thank You page
        router.push("/thank-you");
        return;
      } else {
        throw new Error(resData?.error || `Server returned status ${response.status}`);
      }
    } catch (err: unknown) {
      console.error("Lead submission error:", err);
      setSubmitStatus("error");
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "There was a network issue submitting your enquiry. Please check your connection and try submitting again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleManualModule = (modNum: number) => {
    setExpandedManualModules((prev) =>
      prev.includes(modNum) ? prev.filter((n) => n !== modNum) : [...prev, modNum]
    );
  };

  const toggleAutoVolume = (volNum: number) => {
    setExpandedAutoVolumes((prev) =>
      prev.includes(volNum) ? prev.filter((n) => n !== volNum) : [...prev, volNum]
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Tools list for infinite marquee scroll
  const toolsList = [
    { name: "Java", category: "Core Language", tag: "Java 8 / OOPs", color: "bg-red-500/10 text-red-600 border-red-200" },
    { name: "Selenium WebDriver", category: "UI Automation", tag: "WebDriver 4.x", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
    { name: "TestNG", category: "Test Runner", tag: "Assertions & XML", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
    { name: "Maven", category: "Build Tool", tag: "POM & Dependencies", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
    { name: "Git & GitHub", category: "Version Control", tag: "Branching & PRs", color: "bg-slate-500/10 text-slate-700 border-slate-200" },
    { name: "Jenkins", category: "CI/CD Pipeline", tag: "Automated Triggers", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
    { name: "Cucumber BDD", category: "BDD Framework", tag: "Gherkin Feature Files", color: "bg-teal-500/10 text-teal-600 border-teal-200" },
    { name: "Postman", category: "API Testing", tag: "REST API & Newman", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
    { name: "Docker", category: "DevOps & Containers", tag: "Grid & Containers", color: "bg-sky-500/10 text-sky-600 border-sky-200" },
    { name: "Playwright", category: "Modern Automation", tag: "Cross-Browser", color: "bg-green-500/10 text-green-600 border-green-200" },
    { name: "Jira Software", category: "Agile & Defect Tracking", tag: "Scrum & Sprint", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
    { name: "SQL & MySQL", category: "Database Testing", tag: "Joins & Validation", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
    { name: "Selenium Grid", category: "Distributed Exec", tag: "Parallel Cloud", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
    { name: "AI Testing Tools", category: "AI-Era QA", tag: "Prompt Engineering", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
  ];

  // Testimonials list for student review scroll
  const testimonials = [
    {
      name: "Kavya Reddy",
      role: "QA Automation Engineer",
      company: "Cognizant",
      package: "8.5 LPA",
      background: "Non-IT to IT Switch",
      rating: 5,
      review:
        "Coming from a non-programming background, I was terrified of Java. The trainer explained core Java and OOPs with real-life examples from ground zero. In 45 days, I built an entire Page Object Model framework from scratch!",
    },
    {
      name: "Sai Krishna",
      role: "SDET Engineer",
      company: "TCS Digital",
      package: "7.2 LPA",
      background: "B.Tech Fresher (2024)",
      rating: 5,
      review:
        "The combo offer of 15 Modules of Manual Testing bundled with Automation was gold. The interviewers in my technical round were impressed by the E-Commerce live framework I pushed to GitHub.",
    },
    {
      name: "Pooja Sharma",
      role: "Senior QA Analyst",
      company: "Wipro",
      package: "9.8 LPA",
      background: "3-Year Career Gap",
      rating: 5,
      review:
        "After a 3-year career break, I felt my chances in IT were gone. Shloka's 1-on-1 mock interviews, ATS resume formatting, and continuous mentor feedback helped me secure 3 offers within a month!",
    },
    {
      name: "Naveen Kumar",
      role: "Lead Automation Tester",
      company: "Capgemini",
      package: "14 LPA",
      background: "Manual to Automation Switch",
      rating: 5,
      review:
        "I was stuck as a manual tester for 4 years with minimal salary growth. Mastering TestNG, Cucumber BDD, and Jenkins CI/CD pipelines here allowed me to make a huge leap to Automation Lead.",
    },
    {
      name: "Anusha V.",
      role: "QA Engineer",
      company: "Infosys",
      package: "6.5 LPA",
      background: "MCA Graduate",
      rating: 5,
      review:
        "The practical projects on real web applications and logging real defects in Jira gave me immense confidence. The 100% online sessions with live doubt resolution were super convenient.",
    },
    {
      name: "Rohan Verma",
      role: "SDET - Quality Assurance",
      company: "Tech Mahindra",
      package: "7.8 LPA",
      background: "Mechanical Engineer",
      rating: 5,
      review:
        "From Mechanical engineering to SDET! Daily hands-on coding assignments and learning Postman REST API + Docker containerized testing helped me stand out from computer science grads.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-[#F5BD3F] selection:text-[#0D2342]">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0D2342] text-white py-2 px-4 border-b border-white/10 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="bg-[#F5BD3F] text-[#0D2342] px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
              Limited Seats Offer
            </span>
            <span>
              Enrol in <strong>Automation Testing (Offer: ₹19,000 <span className="line-through text-slate-400">₹59,000</span>)</strong> &amp; Get <strong>Manual Testing 100% FREE!</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="inline-flex items-center gap-1.5 text-[#F5BD3F] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>100% Placement Assistance</span>
            </span>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Online Live Batches</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#10294B]/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Info */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F5BD3F] bg-white p-0.5 shadow-md flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Shloka Global Education Logo"
                fill
                sizes="48px"
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight group-hover:text-[#F5BD3F] transition-colors leading-tight">
                Shloka Global Education
              </span>
              <span className="text-slate-300 text-xs font-medium tracking-wide flex items-center gap-1.5">
                <span>Estd. 2015</span>
                <span className="text-[#F5BD3F]">•</span>
                <span className="text-[#F5BD3F] font-semibold">100% Placement Assistance</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-200">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Home
            </a>
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("courses");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Course Offer
            </a>
            <a
              href="#tools"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("tools");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Tools Covered
            </a>
            <a
              href="#curriculum"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("curriculum");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Curriculum
            </a>
            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("testimonials");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Reviews
            </a>
            <a
              href="#benefits"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("benefits");
              }}
              className="hover:text-[#F5BD3F] transition-colors"
            >
              Why Choose Us
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollToSection("lead-form")}
              className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black px-6 py-2.5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              BOOK FREE DEMO
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#F5BD3F] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0D2342] border-b border-white/10 px-6 py-6 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Home
            </a>
            <a
              href="#courses"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("courses");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Course Offer
            </a>
            <a
              href="#tools"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("tools");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Tools Covered
            </a>
            <a
              href="#curriculum"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("curriculum");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Curriculum
            </a>
            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("testimonials");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Student Reviews
            </a>
            <a
              href="#benefits"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("benefits");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Why Choose Us
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("faq");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              FAQs
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="block text-slate-200 hover:text-[#F5BD3F] font-semibold py-2"
            >
              Contact
            </a>
            <div className="pt-2">
              <button
                onClick={() => scrollToSection("lead-form")}
                className="w-full bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black py-3 rounded-lg text-center shadow-lg"
              >
                BOOK FREE DEMO
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section
        id="home"
        className="relative bg-gradient-to-b from-[#10294B] via-[#0D2342] to-[#10294B] text-white pt-3 pb-4 sm:pt-4 sm:pb-5 lg:pt-5 lg:pb-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,189,63,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Headlines & Course Value */}
            <div className="lg:col-span-7 space-y-3">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5BD3F]/15 border border-[#F5BD3F]/40 text-[#F5BD3F] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F5BD3F]" />
                NEW BATCH STARTING SOON • 100% ONLINE TRAINING
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight leading-tight">
                START YOUR CAREER IN{" "}
                <span className="text-[#F5BD3F] underline decoration-[#F5BD3F]/60 decoration-wavy decoration-2">
                  SOFTWARE TESTING!
                </span>
              </h1>

              {/* Supporting Headline */}
              <p className="text-sm sm:text-base text-slate-200 font-semibold leading-snug">
                Learn Manual &amp; Automation Testing with Industry-Focused Online Training.
              </p>

              {/* Description */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Develop job-ready software testing skills with structured learning, live real-time
                projects, framework development from scratch, resume grooming, and mock interview
                preparation.
              </p>

              {/* Offer Highlight Box */}
              <div className="bg-gradient-to-r from-[#163664] to-[#10294B] border-2 border-[#F5BD3F] rounded-2xl p-3 sm:p-3.5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#F5BD3F] text-[#0D2342] text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  Combo Deal
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2.5 items-center">
                  <div className="sm:col-span-5 space-y-0.5">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">
                      Primary Course
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">AUTOMATION TESTING</h3>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm line-through text-slate-400 font-bold">₹59,000</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#F5BD3F]">₹19,000</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black px-1.5 py-0.5 rounded">
                        68% OFF
                      </span>
                      <span className="text-xs text-slate-300">/ 45-Day Program</span>
                    </div>
                  </div>

                  <div className="sm:col-span-1 text-center font-black text-[#F5BD3F] text-lg">
                    +
                  </div>

                  <div className="sm:col-span-5 bg-[#0D2342]/90 border border-[#F5BD3F]/50 rounded-xl p-2.5 space-y-0.5">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      100% Free Add-On
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white">MANUAL TESTING TRAINING</h4>
                    <p className="text-xs text-slate-300 leading-snug">
                      Included at <strong>₹0 extra fee</strong> with Automation enrolment!
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F5BD3F] flex-shrink-0" />
                  <span>
                    <strong>Clarification:</strong> Manual Testing is only free as an add-on with ₹19,000
                    Automation Testing enrolment.
                  </span>
                </div>
              </div>

              {/* Additional Selling Points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5BD3F] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">100% Online Training</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5BD3F] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Free Demo Classes</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5BD3F] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Practical Projects</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5BD3F] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Structured Curriculum</span>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-[#F5BD3F] text-[#0D2342] rounded-xl p-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <div className="text-[11px] uppercase font-extrabold tracking-wider opacity-90">
                    100% Placement Assistance
                  </div>
                  <div className="text-xl sm:text-2xl font-black">Up to 15 LPA*</div>
                  <div className="text-xs font-semibold opacity-90">
                    Resume building, mock interviews and job referrals
                  </div>
                </div>
                <div className="text-center sm:text-right flex-shrink-0">
                  <span className="inline-block bg-[#0D2342] text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow">
                    Over 2,500+ Placed Alumni
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-0.5">
                <button
                  onClick={() => scrollToSection("lead-form")}
                  className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black text-sm px-6 py-2.5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>BOOK YOUR FREE DEMO CLASS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection("curriculum")}
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#F5BD3F]" />
                  <span>EXPLORE CURRICULUM</span>
                </button>
              </div>
            </div>

            {/* Right Column: Premium Lead Form */}
            <div className="lg:col-span-5" id="lead-form">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border-4 border-[#F5BD3F]/30 text-slate-800 relative">
                {/* Form Header */}
                <div className="text-center mb-2.5">
                  <span className="bg-[#10294B] text-[#F5BD3F] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                    Fast-Track Your Career
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#10294B] mt-1">
                    Book Your Free Demo Class
                  </h3>
                  <p className="text-xs text-slate-600">
                    Fill the form below to reserve your live online session.
                  </p>
                </div>

                {/* Form Status Alerts */}
                {submitStatus === "success" ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-center space-y-3">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-emerald-900">
                      THANK YOU FOR YOUR INTEREST!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">{statusMessage}</p>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-600 text-left space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> What happens next?
                      </div>
                      <p>1. Our admissions counsellor will verify your enquiry details.</p>
                      <p>2. You will receive the demo class link and timing schedule.</p>
                      <p>3. Attend the live session and experience the curriculum first-hand.</p>
                    </div>

                    <a
                      href="/thank-you"
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-[#10294B] hover:bg-[#0D2342] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow transition-colors"
                    >
                      <span>View Full Confirmation Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F5BD3F]" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSubmitStatus("idle")}
                      className="text-xs text-slate-500 underline hover:text-slate-800 block mx-auto"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-2.5">
                    {/* Missing Config Notification */}
                    {submitStatus === "missing_config" && (
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>{statusMessage}</div>
                      </div>
                    )}

                    {/* Generic Network Error */}
                    {submitStatus === "error" && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>{statusMessage}</div>
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3.5 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all ${
                          formErrors.fullName
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-300 focus:border-[#10294B] focus:ring-2 focus:ring-[#10294B]/10"
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-rose-600 text-xs mt-0.5 font-medium">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm font-semibold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobileNumber"
                          autoComplete="tel"
                          maxLength={10}
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-3.5 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all ${
                            formErrors.mobileNumber
                              ? "border-rose-500 focus:ring-2 focus:ring-rose-200"
                              : "border-slate-300 focus:border-[#10294B] focus:ring-2 focus:ring-[#10294B]/10"
                          }`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <p className="text-rose-600 text-xs mt-0.5 font-medium">
                          {formErrors.mobileNumber}
                        </p>
                      )}
                    </div>

                    {/* Email ID */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">
                        Email ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. rahul@gmail.com"
                        className={`w-full px-3.5 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all ${
                          formErrors.email
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-300 focus:border-[#10294B] focus:ring-2 focus:ring-[#10294B]/10"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-rose-600 text-xs mt-0.5 font-medium">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Quick 1-Tap Qualification Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                          Highest Qualification <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-500">1-Tap Select</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { label: "B.Tech / BE", val: "B.Tech / B.E." },
                          { label: "BCA / MCA", val: "BCA / MCA" },
                          { label: "Any Graduate", val: "Any Graduate" },
                          { label: "Working Pro", val: "Working Professional" },
                        ].map((item) => {
                          const isSelected =
                            formData.qualification === item.val ||
                            formData.qualification === item.label;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  qualification: item.val,
                                }));
                                if (formErrors.qualification) {
                                  setFormErrors((prev) => ({
                                    ...prev,
                                    qualification: undefined,
                                  }));
                                }
                              }}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                                isSelected
                                  ? "bg-[#10294B] text-[#F5BD3F] border-[#10294B] shadow-sm"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                      {formErrors.qualification && (
                        <p className="text-rose-600 text-xs mt-0.5 font-medium">
                          {formErrors.qualification}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#F5BD3F] hover:bg-[#E2AB2E] disabled:opacity-75 disabled:cursor-not-allowed text-[#0D2342] font-black text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0D2342] border-t-transparent rounded-full animate-spin" />
                          <span>Reserving your demo seat...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>BOOK MY FREE DEMO NOW 🚀</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-500 pt-1 leading-snug">
                      🔒 100% Privacy Guaranteed. By submitting, you agree to receive demo class updates from Shloka Global Education.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALL TOOLS & TECH STACK INFINITE SCROLL */}
      <section id="tools" className="py-6 sm:py-8 bg-white border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
          <span className="text-xs font-black text-[#10294B] uppercase tracking-widest bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
            In-Demand Industry Tech Stack
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#10294B] mt-1.5">
            TOOLS &amp; FRAMEWORKS COVERED IN TRAINING
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-0.5">
            Master the complete toolchain trusted by top Fortune 500 tech companies and high-growth startups.
          </p>
        </div>

        {/* Marquee Wrapper with Edge Gradients */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track (Duplicated list for seamless infinite loop) */}
          <div className="animate-marquee flex gap-4 py-2">
            {[...toolsList, ...toolsList].map((tool, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#F5F7FA] hover:bg-white border border-slate-200 hover:border-[#10294B] px-5 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex-shrink-0 cursor-default group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#10294B] text-[#F5BD3F] flex items-center justify-center font-black text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                  {tool.name === "Java" && <Code2 className="w-5 h-5" />}
                  {tool.name === "Selenium WebDriver" && <Layers className="w-5 h-5" />}
                  {tool.name === "TestNG" && <Cpu className="w-5 h-5" />}
                  {tool.name === "Maven" && <Terminal className="w-5 h-5" />}
                  {tool.name === "Git & GitHub" && <GitBranch className="w-5 h-5" />}
                  {tool.name === "Jenkins" && <Cpu className="w-5 h-5" />}
                  {tool.name === "Cucumber BDD" && <BookOpen className="w-5 h-5" />}
                  {tool.name === "Postman" && <Send className="w-5 h-5" />}
                  {tool.name === "Docker" && <Layers className="w-5 h-5" />}
                  {tool.name === "Playwright" && <Code2 className="w-5 h-5" />}
                  {tool.name === "Jira Software" && <Briefcase className="w-5 h-5" />}
                  {tool.name === "SQL & MySQL" && <Database className="w-5 h-5" />}
                  {tool.name === "Selenium Grid" && <Layers className="w-5 h-5" />}
                  {tool.name === "AI Testing Tools" && <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#10294B] group-hover:text-[#F5BD3F] transition-colors">
                    {tool.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {tool.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE INTERACTIVE LEARNING SPOTLIGHT */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#10294B] via-[#0D2342] to-[#10294B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#F5BD3F]/40">
              <Image
                src="/images/hybrid-learning.webp"
                alt="Interactive Live Online Learning Session with Expert Mentors"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0D2342]/90 backdrop-blur-md text-[#F5BD3F] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#F5BD3F]/30">
                100% Live Instructor-Led
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Live Online Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Interactive Online Batches with Dedicated Mentorship
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Learn directly from experienced SDET leads in real-time. Ask questions on the fly, get live screen-share debugging, and collaborate with like-minded peers across India.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                  <span>Daily Live Interactive Sessions</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                  <span>1-on-1 Screen-Sharing Doubt Resolution</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                  <span>HD Recordings &amp; Code Access</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                  <span>Weekday &amp; Weekend Batches</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection("lead-form")}
                  className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  ATTEND A FREE DEMO CLASS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPECIAL COURSE OFFER */}
      <section id="courses" className="py-16 sm:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Exclusive Value Combo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              ONE ENROLMENT. TWO LEARNING PROGRAMS.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2">
              Master the complete software quality engineering lifecycle from fundamentals to
              enterprise automation architecture.
            </p>
          </div>

          {/* Main Combo Card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
            {/* Top Highlight Ribbon */}
            <div className="bg-gradient-to-r from-[#10294B] via-[#0D2342] to-[#10294B] text-white p-6 sm:p-8 text-center relative">
              <div className="inline-block bg-[#F5BD3F] text-[#0D2342] font-black text-xs sm:text-sm uppercase tracking-wider px-4 py-1 rounded-full mb-3 shadow">
                Unbeatable Career Bundle
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                GET MANUAL TESTING FREE WITH AUTOMATION TESTING ENROLMENT
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
                Pay only for the 45-Day Automation Testing Architect program and get the complete
                15-Module Manual Testing Masterclass bundled at zero extra charge!
              </p>
            </div>

            {/* Program Breakdown Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Left: Automation Testing Card */}
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="bg-[#10294B] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Core Course
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Clock className="w-4 h-4 text-[#F5BD3F]" /> 45 Days Duration
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#10294B]">
                    AUTOMATION TESTING
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Industry-Focused Automation Architect Track designed to take you from Java
                    fundamentals to test architecture.
                  </p>
                </div>

                <div className="bg-[#F5F7FA] p-4 rounded-2xl flex items-baseline justify-between border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Course Investment
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm sm:text-base line-through text-slate-400 font-bold">₹59,000</span>
                      <span className="text-3xl sm:text-4xl font-black text-[#10294B]">₹19,000</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        Save ₹40,000 (68% OFF)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-[#10294B] font-bold px-2.5 py-1 rounded-full">
                    Complete 45 Days
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    What is Covered:
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Volume 1: Core Java for Automation (OOPs, Collections, Java 8)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Volume 2: Selenium WebDriver &amp; TestNG Framework Design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Volume 3: BDD Cucumber, Page Object Model, Jenkins CI/CD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>API Testing with Postman, Docker, Selenium Grid &amp; AI Tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Live End-to-End E-Commerce Capstone Project</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right: Free Manual Testing Add-On Card */}
              <div className="p-6 sm:p-10 space-y-6 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Free Add-On Bonus
                  </span>
                  <div className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded">
                    100% Free With Enrolment
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#10294B]">
                    MANUAL TESTING TRAINING
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Ameerpet Elite Manual Testing Architect Program curriculum covering full SDLC,
                    STLC, Agile &amp; Jira workflows.
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl flex items-baseline justify-between border border-emerald-200">
                  <div>
                    <span className="text-xs text-emerald-700 uppercase font-bold tracking-wider">
                      Add-on Price
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                      ₹0{" "}
                      <span className="text-sm font-normal text-slate-500 line-through ml-2">
                        ₹9,000
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-600 text-white font-black px-2.5 py-1 rounded-full">
                    FREE BONUS
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    What is Covered:
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>All 15 Comprehensive Modules from Foundations to Mastery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Test Design Techniques: BVA, Equivalence Partitioning, Decision Tables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Agile Scrum, Sprint Planning, Jira Defect Management &amp; SQL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>AI Era Testing: Prompt Validation &amp; AI-Assisted Test Design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Real-time E-Commerce Project + Resume &amp; Mock Interview Guidance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Clarification & Bottom CTA Banner */}
            <div className="bg-[#10294B] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#F5BD3F] text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Important Enrollment Policy:</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                  Manual Testing is <strong>NOT</strong> a separately free course. It is exclusively
                  available at zero extra cost only when a student enrols in our ₹19,000 Automation
                  Testing program.
                </p>
              </div>

              <button
                onClick={() => scrollToSection("lead-form")}
                className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap transform hover:-translate-y-0.5"
              >
                CLAIM DUAL COURSE OFFER
              </button>
            </div>
          </div>

          {/* Team Collaboration Showcase */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                <span className="bg-[#10294B] text-[#F5BD3F] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Corporate Culture Simulation
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#10294B] leading-tight">
                  Collaborative Peer Code Reviews &amp; Framework Design
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  QA engineers don&apos;t work in isolation. At Shloka Global Education, you collaborate in agile teams, participate in pull request (PR) reviews on GitHub, debate locator strategies, and refine test frameworks together.
                </p>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Peer-to-peer GitHub Pull Request reviews and feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pair programming &amp; automation framework debugging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Agile sprint ceremonies &amp; backlog grooming practice</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200 order-1 lg:order-2">
                <Image
                  src="/images/workspace-team.webp"
                  alt="Collaborative QA Team Reviewing Automation Code"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0D2342]/90 backdrop-blur-md text-[#F5BD3F] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#F5BD3F]/30">
                  Active Sprint Collaboration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT YOU WILL LEARN */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Skills Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              WHAT YOU WILL LEARN
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2">
              Four structured pillars engineered to transform you into an industry-ready SDET and
              QA Automation Engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Manual Testing */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] transition-all hover:shadow-xl group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#10294B] text-[#F5BD3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Free Add-On
                </span>
                <h3 className="text-xl font-black text-[#10294B] mt-2 mb-3">
                  MANUAL TESTING
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Testing Fundamentals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> SDLC and STLC
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Test Case Design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Defect Management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Agile and Jira
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> SQL for Testers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> API Testing Awareness
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-bold text-[#10294B]">
                15 Core Modules Included
              </div>
            </div>

            {/* Card 2: Java Programming */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] transition-all hover:shadow-xl group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#10294B] text-[#F5BD3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold text-[#10294B] bg-[#10294B]/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Automation Days 1–15
                </span>
                <h3 className="text-xl font-black text-[#10294B] mt-2 mb-3">
                  JAVA PROGRAMMING
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Java Fundamentals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> OOP Concepts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Variables &amp; Data Types
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Exception Handling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Collections Framework
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Java 8 Features (Streams)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Mini Project &amp; Coding
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-bold text-[#10294B]">
                From Scratch to Advanced
              </div>
            </div>

            {/* Card 3: Selenium Automation */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] transition-all hover:shadow-xl group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#10294B] text-[#F5BD3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold text-[#10294B] bg-[#10294B]/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Automation Days 16–30
                </span>
                <h3 className="text-xl font-black text-[#10294B] mt-2 mb-3">
                  SELENIUM AUTOMATION
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Selenium WebDriver
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> TestNG &amp; Assertions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Maven Build Tool
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Advanced XPath &amp; Waits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Framework Development
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Page Object Model (POM)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> BDD and Cucumber
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-bold text-[#10294B]">
                Framework Architect Level
              </div>
            </div>

            {/* Card 4: Advanced Tools */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] transition-all hover:shadow-xl group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#10294B] text-[#F5BD3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold text-[#10294B] bg-[#10294B]/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Automation Days 31–45
                </span>
                <h3 className="text-xl font-black text-[#10294B] mt-2 mb-3">
                  ADVANCED TOOLS
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Git and GitHub
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Jenkins &amp; CI/CD Pipeline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> API Testing &amp; Postman
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Docker &amp; Cloud Exec
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Playwright Introduction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> AI-Assisted Automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F]" /> Capstone Live Project
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-bold text-[#10294B]">
                DevOps &amp; Next-Gen QA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COURSE CURRICULUM */}
      <section id="curriculum" className="py-16 sm:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Syllabus Breakdown
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              DETAILED COURSE CURRICULUM
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2">
              Explore the exact topics covered in both programs. Click on any module to view its
              day-by-day learning units.
            </p>
          </div>

          {/* Curriculum Tabs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab("automation")}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "automation"
                  ? "bg-[#10294B] text-[#F5BD3F] shadow-lg border-2 border-[#10294B]"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>TAB 2: AUTOMATION TESTING (45 DAYS)</span>
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === "manual"
                  ? "bg-[#10294B] text-[#F5BD3F] shadow-lg border-2 border-[#10294B]"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>TAB 1: MANUAL TESTING (FREE ADD-ON)</span>
            </button>
          </div>

          {/* TAB 1: MANUAL TESTING (15 MODULES) */}
          {activeTab === "manual" && (
            <div className="space-y-6">
              {/* Program Header Notice */}
              <div className="bg-[#10294B] text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-2.5 py-0.5 rounded uppercase">
                    Ameerpet Elite Syllabus
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-1">
                    Manual Testing Architect Program (15 Modules)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Comprehensive industry-focused syllabus designed to exceed typical market training programs.
                  </p>
                </div>
                <div className="text-center md:text-right bg-white/10 px-4 py-2 rounded-xl flex-shrink-0">
                  <div className="text-xs text-slate-300">Suggested Fast Track</div>
                  <div className="text-base font-black text-[#F5BD3F]">15-Day Fast Track Plan</div>
                </div>
              </div>

              {/* 15 Modules Accordion Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    mod: 1,
                    title: "Testing Foundations",
                    topics: [
                      "Quality, QA vs QC",
                      "Verification vs Validation",
                      "Testing Principles",
                      "Error, Defect, Failure",
                      "Cost of Defects",
                    ],
                  },
                  {
                    mod: 2,
                    title: "SDLC & Models",
                    topics: [
                      "Waterfall Model",
                      "V-Model in Practice",
                      "Agile Framework",
                      "DevOps Overview",
                      "Spiral & Incremental Models",
                    ],
                  },
                  {
                    mod: 3,
                    title: "STLC (Software Testing Life Cycle)",
                    topics: [
                      "Requirement Analysis",
                      "Test Planning & Strategy",
                      "Test Design & Scenarios",
                      "Execution & Logging",
                      "Test Closure & Metrics",
                    ],
                  },
                  {
                    mod: 4,
                    title: "Requirements Engineering",
                    topics: [
                      "Business Requirement Document (BRD)",
                      "Functional Requirement Document (FRD)",
                      "Software Requirement Specification (SRS)",
                      "User Stories & Acceptance Criteria",
                      "Requirements Traceability Matrix (RTM)",
                    ],
                  },
                  {
                    mod: 5,
                    title: "Test Design Techniques",
                    topics: [
                      "Equivalence Partitioning (EP)",
                      "Boundary Value Analysis (BVA)",
                      "Decision Table Testing",
                      "State Transition Diagrams",
                      "Error Guessing & Intuitive Testing",
                    ],
                  },
                  {
                    mod: 6,
                    title: "Test Case Engineering",
                    topics: [
                      "Test Scenarios Creation",
                      "Standard Test Case Templates",
                      "Peer Reviews & Sign-offs",
                      "Positive & Negative Testing",
                      "Exploratory & Ad-hoc Testing",
                    ],
                  },
                  {
                    mod: 7,
                    title: "Defect Management",
                    topics: [
                      "Complete Bug Lifecycle",
                      "Severity vs Priority Calibration",
                      "Bug Reporting Standards & Artifacts",
                      "Root Cause Analysis (RCA)",
                    ],
                  },
                  {
                    mod: 8,
                    title: "Testing Levels & Types",
                    topics: [
                      "Unit & Integration Testing",
                      "System & Acceptance (UAT) Testing",
                      "Smoke & Sanity Testing",
                      "Regression & Re-testing",
                      "Usability & Compatibility Testing",
                    ],
                  },
                  {
                    mod: 9,
                    title: "Agile Testing & Jira",
                    topics: [
                      "Scrum Ceremonies & Methodology",
                      "Sprint Planning & Backlog Grooming",
                      "Daily Standups & Retrospectives",
                      "Jira Boards & Issue Creation",
                      "End-to-End Defect Workflow",
                    ],
                  },
                  {
                    mod: 10,
                    title: "SQL for Testers",
                    topics: [
                      "SELECT, WHERE & Filtering Data",
                      "INNER, LEFT, RIGHT JOINS",
                      "GROUP BY & Aggregate Functions",
                      "Backend Database Data Validation",
                    ],
                  },
                  {
                    mod: 11,
                    title: "API Testing Awareness",
                    topics: [
                      "REST Architecture Principles",
                      "JSON Payload Structures",
                      "HTTP Methods (GET, POST, PUT, DELETE)",
                      "HTTP Status Codes (2xx, 4xx, 5xx)",
                      "Postman Basics & Request Validation",
                    ],
                  },
                  {
                    mod: 12,
                    title: "Domain Knowledge",
                    topics: [
                      "Banking & Financial Systems (BFSI)",
                      "Insurance Life & Non-life Domains",
                      "Healthcare & HIPAA Basics",
                      "E-Commerce Workflows & Checkout",
                      "Telecom Billing Systems",
                    ],
                  },
                  {
                    mod: 13,
                    title: "AI Era Testing",
                    topics: [
                      "Prompt Validation for LLMs",
                      "AI Hallucination Testing",
                      "AI-Assisted Test Design (ChatGPT/Claude for QA)",
                    ],
                  },
                  {
                    mod: 14,
                    title: "Real Time Project",
                    topics: [
                      "Live E-Commerce Project Walkthrough",
                      "Creating Comprehensive Test Plan",
                      "RTM Preparation & Verification",
                      "Live Test Execution on Sandbox",
                      "Real Defect Reports in Jira",
                    ],
                  },
                  {
                    mod: 15,
                    title: "Interview & Career Mastery",
                    topics: [
                      "ATS-Friendly QA Resume Building",
                      "1-on-1 Mock Interviews with Feedback",
                      "Top 100 Manual Testing Questions",
                      "Project Explanation & Domain Storytelling",
                    ],
                  },
                ].map((item) => {
                  const isExpanded = expandedManualModules.includes(item.mod);
                  return (
                    <div
                      key={item.mod}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition-shadow"
                    >
                      <button
                        onClick={() => toggleManualModule(item.mod)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-slate-800 hover:text-[#10294B] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#10294B]/10 text-[#10294B] text-xs font-black flex items-center justify-center flex-shrink-0">
                            M{item.mod}
                          </span>
                          <span className="text-sm sm:text-base">
                            Module {item.mod}: {item.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-4 pt-1 bg-slate-50/50 border-t border-slate-100">
                          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                            {item.topics.map((t, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F5BD3F] flex-shrink-0" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fast Track Roadmap Box */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#F5BD3F]/60 shadow-md">
                <h4 className="text-base font-extrabold text-[#10294B] flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#F5BD3F]" />
                  <span>Suggested 15-Day Fast Track Execution Schedule</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Days 1–3:</strong> Foundations, SDLC, STLC
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Days 4–5:</strong> Requirements &amp; Test Design
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Days 6–7:</strong> Test Cases &amp; Defects
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Days 8–9:</strong> Testing Types &amp; Agile
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Days 10–11:</strong> Jira Boards &amp; SQL
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Day 12:</strong> API Testing Awareness
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Day 13:</strong> Domain Knowledge
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Day 14:</strong> AI Era Testing
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <strong>Day 15:</strong> Real Project &amp; Interviews
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTOMATION TESTING (45 DAYS) */}
          {activeTab === "automation" && (
            <div className="space-y-6">
              {/* Program Overview Banner */}
              <div className="bg-[#10294B] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-3 py-1 rounded-full uppercase">
                    Flagship Program • Offer: ₹19,000 <span className="line-through opacity-75">₹59,000</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-2">
                    Automation Testing Architect Program (45 Days)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    A comprehensive automation testing roadmap taking learners from Java fundamentals
                    to enterprise Automation Architect skills.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-bold">
                    <span className="bg-white/10 px-2.5 py-1 rounded">Java</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Selenium WebDriver</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">TestNG</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Maven</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Git &amp; GitHub</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">BDD Cucumber</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Jenkins CI/CD</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Postman REST API</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Docker</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">Playwright Intro</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded">AI Testing</span>
                  </div>
                </div>
                <div className="text-center bg-white/10 p-5 rounded-2xl flex-shrink-0 w-full md:w-auto">
                  <div className="text-xs uppercase font-extrabold text-slate-300">Course Length</div>
                  <div className="text-3xl font-black text-[#F5BD3F]">45 Days</div>
                  <div className="text-xs text-slate-300">Daily Live Online Sessions</div>
                </div>
              </div>

              {/* 3 Volumes of 45 Days */}
              <div className="space-y-4">
                {/* VOLUME 1: Java for Automation Engineers (Days 1–15) */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleAutoVolume(1)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#10294B] text-[#F5BD3F] text-xs font-black px-2.5 py-0.5 rounded uppercase">
                          Days 1–15
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Volume 1</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-[#10294B] mt-1">
                        Java for Automation Engineers
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Master Core Java from scratch with a heavy focus on OOPs, Collections, and coding logic required for automation frameworks.
                      </p>
                    </div>
                    {expandedAutoVolumes.includes(1) ? (
                      <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedAutoVolumes.includes(1) && (
                    <div className="p-6 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { day: "Day 1", topic: "Java Basics, JDK, JRE, JVM, Hello World" },
                          { day: "Day 2", topic: "Variables and Data Types" },
                          { day: "Day 3", topic: "Operators (Arithmetic, Relational, Logical)" },
                          { day: "Day 4", topic: "Conditions (if-else, switch-case)" },
                          { day: "Day 5", topic: "Loops (for, while, do-while, enhanced for)" },
                          { day: "Day 6", topic: "Arrays (1D, 2D Array Manipulation)" },
                          { day: "Day 7", topic: "Strings (String Methods, Immutability, StringBuilder)" },
                          { day: "Day 8", topic: "Classes and Objects, Constructors" },
                          { day: "Day 9", topic: "Inheritance and Polymorphism (Overloading & Overriding)" },
                          { day: "Day 10", topic: "Abstraction and Interfaces" },
                          { day: "Day 11", topic: "Exception Handling (try-catch, finally, throw, throws)" },
                          { day: "Day 12", topic: "Collections Framework (List, Set, Map, ArrayList, HashMap)" },
                          { day: "Day 13", topic: "File Handling & Properties File Reading" },
                          { day: "Day 14", topic: "Java 8 Features (Streams, Lambda Expressions)" },
                          { day: "Day 15", topic: "Java Mini Project & Coding Interview Preparation" },
                        ].map((d) => (
                          <div
                            key={d.day}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-[#10294B] transition-colors flex items-start gap-2.5"
                          >
                            <span className="font-extrabold text-xs text-[#10294B] bg-white px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                              {d.day}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              {d.topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* VOLUME 2: Selenium Automation Framework (Days 16–30) */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleAutoVolume(2)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#10294B] text-[#F5BD3F] text-xs font-black px-2.5 py-0.5 rounded uppercase">
                          Days 16–30
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Volume 2</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-[#10294B] mt-1">
                        Selenium Automation Framework
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        WebDriver architecture, custom locators, dynamic elements, TestNG assertions, data-driven tests, and parallel execution.
                      </p>
                    </div>
                    {expandedAutoVolumes.includes(2) ? (
                      <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedAutoVolumes.includes(2) && (
                    <div className="p-6 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { day: "Day 16", topic: "Automation Fundamentals & WebDriver Overview" },
                          { day: "Day 17", topic: "Selenium Architecture & Browser Drivers" },
                          { day: "Day 18", topic: "Locators (id, name, class, cssSelector)" },
                          { day: "Day 19", topic: "Advanced XPath (Axes, Functions, Dynamic Matching)" },
                          { day: "Day 20", topic: "WebDriver Commands & Navigation" },
                          { day: "Day 21", topic: "Waits & Synchronization (Implicit, Explicit, Fluent)" },
                          { day: "Day 22", topic: "Dropdowns, JavaScript Alerts & iFrames" },
                          { day: "Day 23", topic: "Windows and Multiple Tabs Handling" },
                          { day: "Day 24", topic: "Actions Class (Mouse Hover, Drag & Drop)" },
                          { day: "Day 25", topic: "Robot Class & File Uploads" },
                          { day: "Day 26", topic: "TestNG Basics & Annotations Lifecycle" },
                          { day: "Day 27", topic: "TestNG Assertions (Hard vs Soft Assertions)" },
                          { day: "Day 28", topic: "Data Providers & Data-Driven Testing" },
                          { day: "Day 29", topic: "Parallel Execution with testng.xml" },
                          { day: "Day 30", topic: "Selenium Framework Project Implementation" },
                        ].map((d) => (
                          <div
                            key={d.day}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-[#10294B] transition-colors flex items-start gap-2.5"
                          >
                            <span className="font-extrabold text-xs text-[#10294B] bg-white px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                              {d.day}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              {d.topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* VOLUME 3: Automation Architect Track (Days 31–45) */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleAutoVolume(3)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#10294B] text-[#F5BD3F] text-xs font-black px-2.5 py-0.5 rounded uppercase">
                          Days 31–45
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Volume 3</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-[#10294B] mt-1">
                        Automation Architect Track &amp; Capstone
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Enterprise framework design, BDD Cucumber, CI/CD with Jenkins, REST APIs, Docker, and full E-Commerce Capstone.
                      </p>
                    </div>
                    {expandedAutoVolumes.includes(3) ? (
                      <ChevronUp className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedAutoVolumes.includes(3) && (
                    <div className="p-6 border-t border-slate-200 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { day: "Day 31", topic: "Maven (pom.xml, Dependencies, Plugins)" },
                          { day: "Day 32", topic: "Git (Version Control, Branching, Commits)" },
                          { day: "Day 33", topic: "GitHub (Remote Repositories, PRs, Collaboration)" },
                          { day: "Day 34", topic: "Framework Architecture Principles" },
                          { day: "Day 35", topic: "Page Object Model (POM) Design" },
                          { day: "Day 36", topic: "Page Factory & @FindBy Annotations" },
                          { day: "Day 37", topic: "Hybrid Framework (Data-Driven + POM)" },
                          { day: "Day 38", topic: "BDD Concepts & Gherkin Syntax" },
                          { day: "Day 39", topic: "Cucumber (Feature Files, Step Definitions, Runners)" },
                          { day: "Day 40", topic: "Advanced Cucumber (Hooks, Tags, Scenario Outlines)" },
                          { day: "Day 41", topic: "Jenkins (CI Server Setup, Jobs Configuration)" },
                          { day: "Day 42", topic: "CI/CD Pipeline Integration & Automated Triggering" },
                          { day: "Day 43", topic: "API Testing and Postman (JSON, Collections, Newman)" },
                          { day: "Day 44", topic: "AI-Assisted Automation, Selenium Grid, Docker & Cloud Execution" },
                          { day: "Day 45", topic: "Capstone Project Presentation & Final Evaluation" },
                        ].map((d) => (
                          <div
                            key={d.day}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-[#10294B] transition-colors flex items-start gap-2.5"
                          >
                            <span className="font-extrabold text-xs text-[#10294B] bg-white px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                              {d.day}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              {d.topic}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Capstone Box */}
                      <div className="bg-gradient-to-r from-[#10294B] to-[#0D2342] text-white p-6 rounded-2xl border-2 border-[#F5BD3F]">
                        <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-2.5 py-0.5 rounded uppercase">
                          Grand Capstone Project
                        </span>
                        <h5 className="text-xl font-bold mt-2">
                          End-to-End E-Commerce Automation Framework
                        </h5>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                          Build an enterprise-grade framework from scratch using Java, Selenium, TestNG,
                          Maven, GitHub, Jenkins, Cucumber BDD, and CI/CD pipelines. Add this live project
                          to your GitHub repository and resume to impress hiring managers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Section CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => scrollToSection("lead-form")}
              className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              DOWNLOAD FULL SYLLABUS PDF &amp; ATTEND DEMO
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS INFINITE SCROLL */}
      <section id="testimonials" className="py-16 sm:py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="text-xs font-black text-[#10294B] uppercase tracking-widest bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
            Real Student Reviews &amp; Placements
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-2">
            WHAT OUR SUCCESSFUL STUDENTS SAY
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2">
            Hear from fresh graduates, non-IT professionals, and manual testers who landed top QA roles.
          </p>
        </div>

        {/* Testimonials Infinite Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-slow flex gap-6 py-4">
            {[...testimonials, ...testimonials].map((testi, idx) => (
              <div
                key={idx}
                className="w-[320px] sm:w-[380px] bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Rating & Verified Placement */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#F5BD3F]">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F5BD3F]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified Placed
                    </span>
                  </div>

                  {/* Quote icon & text */}
                  <div className="relative mb-4">
                    <Quote className="w-8 h-8 text-[#10294B]/10 absolute -top-2 -left-2 pointer-events-none" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative z-10">
                      &quot;{testi.review}&quot;
                    </p>
                  </div>
                </div>

                {/* Bottom: Student Info */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#10294B] text-[#F5BD3F] font-black text-sm flex items-center justify-center flex-shrink-0">
                      {testi.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#10294B] leading-tight">
                        {testi.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {testi.role} • <strong className="text-slate-800">{testi.company}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block">
                      {testi.package}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {testi.background}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY CHOOSE US */}
      <section id="benefits" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Student Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              WHY CHOOSE SHLOKA GLOBAL EDUCATION?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2">
              Established in 2015 in Kukatpally, Hyderabad, we have trained thousands of students
              and career switchers into successful QA engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Structured Curriculum",
                desc: "Progressive day-by-day learning from basics to architect level. No confusing jumps, just pure industry-standard workflow.",
              },
              {
                icon: Cpu,
                title: "100% Online Training",
                desc: "Live interactive online sessions with recorded backups, clear doubt resolution, and dedicated mentor support from anywhere.",
              },
              {
                icon: Calendar,
                title: "Free Demo Classes",
                desc: "Experience our teaching methodology and curriculum depth first-hand before paying any fee. Zero obligation.",
              },
              {
                icon: Code2,
                title: "Practical Project Exposure",
                desc: "Hands-on execution on real e-commerce portals, defect tracking in Jira, and live framework architecture on GitHub.",
              },
              {
                icon: Award,
                title: "Resume Building Guidance",
                desc: "ATS-friendly QA resume templates, LinkedIn profile enhancement, and project description storytelling that clears HR filters.",
              },
              {
                icon: Users,
                title: "Mock Interview Preparation",
                desc: "Rigorous 1-on-1 mock technical interviews covering top Automation, Java, Selenium, and Manual testing scenarios.",
              },
            ].map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-[#F5BD3F] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#10294B] text-[#F5BD3F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-[#10294B] mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Quality Review & Mock Presentation Showcase */}
          <div className="mt-12 bg-gradient-to-r from-[#10294B] to-[#0D2342] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-[#F5BD3F]/30 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Leadership &amp; Architecture Focus
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Executive Quality Reviews &amp; Mock Technical Interviews
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Gain the confidence to present test strategies, defend automation design choices, and lead sprint reviews in front of senior tech leads and hiring managers.
                </p>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Real-world sprint demo &amp; release sign-off presentations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>1-on-1 rigorous mock interviews covering top 100 SDET questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Resume overhaul with ATS-optimized QA architecture keywords</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/images/quality-review.webp"
                  alt="Quality Review Meeting and Test Strategy Presentation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0D2342]/90 backdrop-blur-md text-[#F5BD3F] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#F5BD3F]/30">
                  Test Architecture Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHO CAN JOIN */}
      <section className="py-16 sm:py-20 bg-[#0D2342] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#0D2342] font-black uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F] px-3 py-1 rounded-full">
              Eligibility &amp; Target Audience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
              WHO CAN JOIN THIS PROGRAM?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mt-2">
              Designed from ground zero so that non-programmers and freshers can master testing with ease.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Fresh Graduates", desc: "Any discipline looking to enter IT", icon: GraduationCap },
              { title: "B.Tech / B.E. Students", desc: "CS, IT, ECE, EEE or Mechanical", icon: Code2 },
              { title: "BCA / MCA Students", desc: "Looking for lucrative SDET roles", icon: Terminal },
              { title: "Job Seekers", desc: "Seeking quick entry with testing skills", icon: Briefcase },
              { title: "Aspiring QA Engineers", desc: "Manual testers moving to automation", icon: Cpu },
              { title: "Working Professionals", desc: "Switching from non-IT or tech support", icon: Users },
            ].map((audience, i) => {
              const IconC = audience.icon;
              return (
                <div
                  key={i}
                  className="bg-[#10294B] border border-white/10 hover:border-[#F5BD3F] rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 text-[#F5BD3F] flex items-center justify-center mx-auto mb-3">
                    <IconC className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white mb-1">{audience.title}</h4>
                  <p className="text-xs text-slate-400">{audience.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. PROJECT-BASED LEARNING */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Industry Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              LEARN THROUGH PRACTICAL PROJECTS
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-2">
              Theoretical knowledge won’t clear modern tech interviews. Our students build, debug,
              and maintain real industry artifacts.
            </p>
          </div>

          {/* Featured Project Showcase: Modern QA Workstation & Live Dashboards */}
          <div className="bg-[#10294B] text-white rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-2xl border-2 border-[#F5BD3F]/40 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/images/qa-dashboard.webp"
                  alt="Modern QA Automation Workspace with Test Dashboards"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0D2342]/90 backdrop-blur-md text-[#F5BD3F] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#F5BD3F]/30">
                  Live QA Dashboard Simulation
                </div>
              </div>
              <div className="lg:col-span-6 space-y-4">
                <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Real Workstation Experience
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Build Production-Grade Test Dashboards &amp; Metrics
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our training simulates genuine enterprise environments. You will learn how to generate live ExtentReports, monitor test execution passes and failures, log real-time bug tracking metrics in Jira, and inspect CI/CD builds.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Real-Time Pass/Fail Stats</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Extent &amp; Allure Reports</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Jira Defect Workflows</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                    <span>Jenkins CI Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Manual Testing Documentation",
                badge: "Manual Track",
                desc: "Author formal Business Requirement Reviews, Test Strategies, Test Scenarios, and comprehensive Test Suites for production web applications.",
              },
              {
                title: "Test Plans and Test Cases",
                badge: "Quality Assurance",
                desc: "Design positive, negative, and edge-case test cases using Equivalence Partitioning and Boundary Value Analysis for web & mobile interfaces.",
              },
              {
                title: "Defect Reports in Jira",
                badge: "Agile Workflow",
                desc: "Log real bug lifecycles in Jira, categorize severity vs priority, attach screenshots/logs, and conduct Root Cause Analysis (RCA).",
              },
              {
                title: "Selenium Automation Framework",
                badge: "Core Automation",
                desc: "Architect a robust Data-Driven + Page Object Model (POM) framework with TestNG, Maven, custom listeners, and extent reports.",
              },
              {
                title: "E-Commerce Automation Capstone",
                badge: "Grand Capstone",
                desc: "End-to-end regression automation covering user login, catalog search, cart checkout, payment verification, and BDD Cucumber features.",
              },
              {
                title: "API Testing Practice",
                badge: "Backend QA",
                desc: "Validate REST API payloads in Postman, create test collections, automate status code checks, and integrate runs into CI/CD pipelines.",
              },
            ].map((proj, idx) => (
              <div
                key={idx}
                className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200 hover:border-[#10294B] transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <span className="bg-[#10294B] text-[#F5BD3F] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                    {proj.badge}
                  </span>
                  <h3 className="text-lg font-black text-[#10294B] mt-3 mb-2">{proj.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{proj.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resume Ready Artifact</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. DEMO CTA SECTION */}
      <section className="py-16 sm:py-20 bg-[#0D2342] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="bg-[#F5BD3F] text-[#0D2342] text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider">
            Limited Batch Seats
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            READY TO START YOUR SOFTWARE TESTING JOURNEY?
          </h2>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Attend a FREE Demo Class and explore our online training program. Experience the
            curriculum, ask questions directly to mentors, and discover our career placement roadmaps.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white/10 border border-white/20 px-6 py-3.5 rounded-2xl">
            <span className="font-extrabold text-base text-white flex items-center gap-2">
              Automation Testing – <span className="line-through text-slate-400 text-sm">₹59,000</span> <span className="text-[#F5BD3F] text-lg font-black">₹19,000</span>
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="font-extrabold text-base text-emerald-400">
              Manual Testing – <span className="underline">FREE ADD-ON</span>
            </span>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => scrollToSection("lead-form")}
              className="bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black text-base px-10 py-4 rounded-xl shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>BOOK YOUR FREE DEMO NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 13. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-16 sm:py-20 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#10294B] font-extrabold uppercase text-xs sm:text-sm tracking-wider bg-[#F5BD3F]/30 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10294B] mt-3">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Everything you need to know about our Automation &amp; Manual Testing programs.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "1. Is the course available online?",
                a: "Yes! The program is 100% online with live interactive instructor-led classes. You can attend from any location, access daily session recordings, ask questions in real-time, and get one-on-one debugging assistance via remote screen sharing.",
              },
              {
                q: "2. What is the Automation Testing fee?",
                a: "The regular course fee is ₹59,000, but under our limited-batch special offer, the complete 45-day Automation Testing Architect Program is slashed to just ₹19,000. This includes live training, course materials, framework code repositories, interview preparation, and placement assistance.",
              },
              {
                q: "3. Is Manual Testing included for free?",
                a: "Yes! When you enrol in the ₹19,000 Automation Testing program, you get the complete 15-module Manual Testing Architect training bundled as a 100% FREE add-on at zero additional cost.",
              },
              {
                q: "4. Can I enrol in Manual Testing separately?",
                a: "No. Manual Testing is NOT offered as a separately free course. It is an exclusive, zero-cost bonus curriculum available strictly with enrolment in the ₹19,000 Automation Testing program.",
              },
              {
                q: "5. How long is the Automation Testing program?",
                a: "The Automation Testing program spans 45 Days of structured daily training: Days 1–15 focus on Core Java for testers; Days 16–30 cover Selenium WebDriver & TestNG framework design; Days 31–45 cover Cucumber BDD, Jenkins CI/CD, API testing, Docker, and the live E-Commerce Capstone Project.",
              },
              {
                q: "6. Are free demo classes available?",
                a: "Yes, absolutely! We conduct free live demo classes so you can observe the trainer’s teaching approach, review the hands-on project workflows, and interact directly with our instructors before committing to registration.",
              },
              {
                q: "7. What tools are covered?",
                a: "You will master an extensive industry tool stack: Java, Selenium WebDriver, TestNG, Maven, Git, GitHub, Jenkins, Cucumber (BDD), Postman (REST API), Docker, Selenium Grid, Playwright overview, Jira, MySQL, and AI-assisted QA tools (ChatGPT/Claude for test case generation).",
              },
              {
                q: "8. Where is Shloka Global Education located?",
                a: "Shloka Global Education is located at GHMC Circle, Darma Reddy Colony, KPHB Colony, Kukatpally, Hyderabad – 500072. We were established in 2015. While our physical institute is in Hyderabad, this software testing training is conducted 100% online for students across India and abroad.",
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-[#10294B] transition-colors"
                  >
                    <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#F5BD3F] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer id="contact" className="bg-[#0D2342] text-white pt-16 pb-24 lg:pb-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F5BD3F] bg-white p-0.5">
                  <Image
                    src="/images/logo.jpg"
                    alt="Shloka Global Education Logo"
                    fill
                    sizes="48px"
                    className="object-contain rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Shloka Global Education</h3>
                  <p className="text-xs text-slate-400">Estd. 2015 | Kukatpally, Hyderabad</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Empowering graduates and tech aspirants with practical, industry-grade software testing
                training. Master Manual &amp; Automation Testing with real project experience.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F5BD3F]">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("home");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("courses");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    Course Offer (₹19,000 Combo)
                  </a>
                </li>
                <li>
                  <a
                    href="#tools"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("tools");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    Tools &amp; Tech Stack
                  </a>
                </li>
                <li>
                  <a
                    href="#curriculum"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("curriculum");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    Course Curriculum (45 Days)
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("testimonials");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    Student Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className="hover:text-[#F5BD3F] transition-colors"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Programs */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F5BD3F]">
                Featured Training
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <strong className="text-white">Automation Testing:</strong> 45-Day Architect Program (<span className="line-through text-slate-400">₹59,000</span> <span className="text-[#F5BD3F] font-bold">₹19,000</span>)
                </li>
                <li>
                  <strong className="text-emerald-400">Manual Testing:</strong> 15-Module FREE Add-On
                </li>
                <li>
                  <strong className="text-white">Mode:</strong> 100% Live Online Training
                </li>
                <li>
                  <strong className="text-white">Placement:</strong> Resume Building &amp; Mock Interviews
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Details (No phone/WhatsApp) */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F5BD3F]">
                Campus &amp; Location
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F5BD3F] flex-shrink-0 mt-0.5" />
                  <span>
                    GHMC Circle, Darma Reddy Colony, KPHB Colony, Kukatpally, Hyderabad – 500072
                  </span>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => scrollToSection("lead-form")}
                    className="w-full bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black py-2.5 px-4 rounded-lg text-xs uppercase tracking-wide transition-colors"
                  >
                    Enquire for Next Batch
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-400 space-y-2">
            <p>
              © 2026 Shloka Global Education. Established 2015. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500">
              *Highest package offered to placed alumni. Terms and conditions apply. Manual Testing is available free only with enrolment in the ₹19,000 Automation Testing program.
            </p>
          </div>
        </div>
      </footer>

      {/* 15. STICKY BOTTOM BAR FOR MOBILE (No phone/WhatsApp) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#10294B] border-t border-white/20 p-3 shadow-2xl">
        <button
          onClick={() => scrollToSection("lead-form")}
          className="w-full bg-[#F5BD3F] hover:bg-[#E2AB2E] text-[#0D2342] font-black py-3 px-4 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <span>BOOK FREE DEMO NOW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
