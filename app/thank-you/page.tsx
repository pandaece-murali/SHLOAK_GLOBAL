"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  PhoneCall,
  Laptop,
  Award,
  ArrowRight,
  Home,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function ThankYouPage() {
  // Fire Meta Pixel CompleteRegistration & Lead events on thank-you page mount
  useEffect(() => {
    type FbqFn = (action: string, eventName: string, params?: Record<string, unknown>) => void;
    if (typeof window !== "undefined" && (window as unknown as { fbq?: FbqFn }).fbq) {
      try {
        const fbq = (window as unknown as { fbq: FbqFn }).fbq;
        if (typeof fbq === "function") {
          // Track CompleteRegistration requested for Meta Ads
          fbq("track", "CompleteRegistration", {
            content_name: "Automation Testing + Free Manual Testing",
            currency: "INR",
            value: 19000,
            status: true,
          });
          // Also track Lead event
          fbq("track", "Lead", {
            content_name: "Automation Testing + Free Manual Testing",
            currency: "INR",
            value: 19000,
          });
        }
      } catch (err) {
        console.error("Meta Pixel tracking error:", err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#F5BD3F] selection:text-[#0D2342]">
      {/* 1. TOP NAVBAR */}
      <header className="bg-[#10294B] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#F5BD3F] bg-white p-0.5 shadow-md flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Shloka Global Education Logo"
                fill
                sizes="44px"
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight group-hover:text-[#F5BD3F] transition-colors leading-tight">
                Shloka Global Education
              </span>
              <span className="text-slate-300 text-xs font-medium tracking-wide flex items-center gap-1.5">
                <span>Estd. 2015</span>
                <span className="text-[#F5BD3F]">•</span>
                <span className="text-[#F5BD3F] font-semibold">100% Placement Assistance</span>
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-200 hover:text-[#F5BD3F] transition-colors bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-lg border border-white/20"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN THANK YOU CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top Banner Accent */}
          <div className="bg-gradient-to-r from-[#10294B] via-[#0D2342] to-[#10294B] text-white p-6 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,189,63,0.25),rgba(255,255,255,0))] pointer-events-none" />

            {/* Success Icon */}
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-lg">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5BD3F]/20 border border-[#F5BD3F]/50 text-[#F5BD3F] text-xs font-black tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F5BD3F]" />
              <span>Registration Successful • Demo Slot Reserved</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              THANK YOU FOR YOUR INTEREST!
            </h1>

            <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
              We have received your enquiry. Our senior academic counsellors will contact you shortly
              with your free demo class access and personalized learning roadmap.
            </p>
          </div>

          {/* Program Enrolled Summary */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-[#F5F7FA] border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Enquiry Details &amp; Reserved Program
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  100% Online Live Training
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Primary Program</div>
                  <div className="text-base sm:text-lg font-black text-[#10294B] mt-0.5">
                    Automation Testing (45 Days)
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs line-through text-slate-400 font-bold">₹59,000</span>
                    <span className="text-lg font-black text-[#10294B]">₹19,000</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-200">
                      68% OFF
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">Exclusive Bonus Add-On</div>
                  <div className="text-base sm:text-lg font-black text-emerald-900 mt-0.5">
                    Manual Testing Training (15 Modules)
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-1">
                    100% FREE ADD-ON (₹0 Extra Fee)
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 flex items-center gap-1.5 border-t border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-[#F5BD3F] flex-shrink-0" />
                <span>
                  <strong>Note:</strong> Free Manual Testing is exclusively included with enrolment in the ₹19,000 Automation Testing program.
                </span>
              </div>
            </div>

            {/* Next Steps Timeline */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#10294B] mb-4 flex items-center gap-2">
                <span>What Happens Next?</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="w-8 h-8 rounded-full bg-[#10294B] text-[#F5BD3F] font-black text-sm flex items-center justify-center mb-3">
                    1
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                    <PhoneCall className="w-4 h-4 text-[#F5BD3F]" />
                    <span>Counsellor Call</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our admissions team will call your registered mobile number to understand your career background and batch timing preferences.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="w-8 h-8 rounded-full bg-[#10294B] text-[#F5BD3F] font-black text-sm flex items-center justify-center mb-3">
                    2
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                    <Calendar className="w-4 h-4 text-[#F5BD3F]" />
                    <span>Demo Class Link</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You will receive the live online demo class joining link, schedule, and syllabus walkthrough directly on your phone.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="w-8 h-8 rounded-full bg-[#10294B] text-[#F5BD3F] font-black text-sm flex items-center justify-center mb-3">
                    3
                  </div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                    <Laptop className="w-4 h-4 text-[#F5BD3F]" />
                    <span>Live Interactive Demo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Attend the live session, interact with our mentor, see real framework demos, and get all your questions answered.
                  </p>
                </div>
              </div>
            </div>

            {/* Placement Assistance Highlight */}
            <div className="bg-[#F5BD3F] text-[#0D2342] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-xs font-black uppercase tracking-wider opacity-90 flex items-center justify-center sm:justify-start gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>100% Placement Assistance</span>
                </div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">Highest Package Up to 15 LPA*</div>
                <div className="text-xs font-semibold opacity-90">
                  ATS resume building, real-time mock interviews &amp; corporate referrals.
                </div>
              </div>

              <div className="text-center sm:text-right flex-shrink-0">
                <span className="inline-block bg-[#0D2342] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow">
                  Over 2,500+ Alumni Placed
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <Link
                href="/"
                className="bg-[#10294B] hover:bg-[#0D2342] text-white font-black text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-[#F5BD3F]" />
                <span>RETURN TO HOMEPAGE</span>
              </Link>
              <Link
                href="/#curriculum"
                className="bg-white hover:bg-slate-50 text-[#10294B] border-2 border-[#10294B]/30 hover:border-[#10294B] font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#10294B]" />
                <span>EXPLORE COURSE CURRICULUM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-[#0D2342] text-white py-6 border-t border-white/10 text-center text-xs text-slate-400 space-y-1">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-slate-200">
            Shloka Global Education • Established 2015
          </p>
          <p>
            GHMC Circle, Darma Reddy Colony, KPHB Colony, Kukatpally, Hyderabad – 500072.
          </p>
          <p className="text-slate-500 pt-1 text-[11px]">
            &copy; 2026 Shloka Global Education. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
