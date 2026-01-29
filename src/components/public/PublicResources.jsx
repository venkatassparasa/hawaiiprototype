import React from 'react';
import { HelpCircle, FileText, Calendar, Scale, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';

const PublicResources = () => {
    const categories = [
        {
            title: 'Registration & Renewal',
            icon: <FileText className="w-6 h-6" />,
            resources: [
                { name: 'Application Requirements Checklist', type: 'PDF' },
                { name: 'NCUC Eligibility Requirements', type: 'Doc' },
                { name: 'Renewal Process Guide', type: 'PDF' },
                { name: 'Fee Schedule for 2026', type: 'PDF' },
            ]
        },
        {
            title: 'Operational Standards',
            icon: <Scale className="w-6 h-6" />,
            resources: [
                { name: 'Mandatory Posting Guidelines', type: 'PDF' },
                { name: 'Quiet Hours Regulations', type: 'PDF' },
                { name: 'Parking & Occupancy Limits', type: 'PDF' },
                { name: 'Local Contact Responsibilities', type: 'PDF' },
            ]
        },
        {
            title: 'Compliance & Enforcement',
            icon: <Calendar className="w-6 h-6" />,
            resources: [
                { name: 'Violation Appeals Process', type: 'Web' },
                { name: 'Inspection Preparation Guide', type: 'PDF' },
                { name: 'Penalty Calculator', type: 'Tool' },
                { name: 'Case Review Workflow', type: 'Video' },
            ]
        },
    ];

    const faqs = [
        {
            q: "What is an STVR?",
            a: "A Short-Term Vacation Rental (STVR) is a dwelling unit that is rented for a period of thirty consecutive days or less where the owner does not reside on-site during the rental period."
        },
        {
            q: "How often do I need to renew my registration?",
            a: "Registrations must be renewed annually. For properties with a Nonconforming Use Certificate (NCUC), the certificate must also be renewed according to the schedule on the permit."
        },
        {
            q: "Can I host events at my vacation rental?",
            a: "Official events, commercial gatherings, and large parties are generally prohibited in residential zones. Please refer to the Operational Standards Catalog for specific restrictions."
        },
        {
            q: "What should I do if my registration is denied?",
            a: "You have 30 days from the date of the decision to file an appeal with the Board of Appeals. Detailed instructions are included in the denial notice."
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-700">

            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">Support & Resources</h1>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                    Everything you need to know about operating a Short-Term Vacation Rental in compliance with County of Hawai'i laws.
                </p>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col p-8">
                        <div className="w-14 h-14 bg-hawaii-ocean/10 text-hawaii-ocean rounded-2xl flex items-center justify-center mb-6">
                            {cat.icon}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{cat.title}</h2>
                        <div className="space-y-4 flex-1">
                            {cat.resources.map((res, j) => (
                                <button key={j} className="w-full flex items-center justify-between group hover:text-hawaii-ocean transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-hawaii-ocean">{res.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase group-hover:bg-hawaii-ocean/10 group-hover:text-hawaii-ocean">{res.type}</span>
                                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-hawaii-ocean" />
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button className="mt-8 text-sm font-bold text-slate-400 hover:text-hawaii-ocean transition-colors flex items-center gap-1 uppercase tracking-widest">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center gap-3 text-hawaii-ocean mb-4 font-bold uppercase tracking-widest text-sm">
                            <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
                        </div>
                        <h2 className="text-4xl font-bold mb-6">Common Inquiries</h2>
                        <p className="text-slate-400 text-lg mb-8">
                            Can't find what you're looking for? Our support team is available Monday through Friday to assist with complex compliance questions.
                        </p>
                        <button className="px-8 py-4 bg-hawaii-ocean text-white rounded-2xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" /> Contact Support
                        </button>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="text-lg font-bold mb-2 flex items-start gap-3">
                                    <span className="text-hawaii-ocean">Q:</span> {faq.q}
                                </h3>
                                <p className="text-slate-400 leading-relaxed pl-7">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-hawaii-ocean/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            </div>

        </div>
    );
};

export default PublicResources;
