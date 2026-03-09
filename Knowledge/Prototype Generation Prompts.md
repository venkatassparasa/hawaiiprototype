# Compliance Dashboard Development Prompts

This document contains a consolidated list of the primary prompts and instructions used to build the **County of Hawaii Compliance Dashboard**.

## 🚀 1. Project Foundation & Tech Stack
**Objective**: Establish the core architecture and UI design system.

> "Create a high-fidelity, interactive dashboard for the County of Hawaii Compliance department. Use React with Tailwind CSS. Follow a premium 'Hawaii-Ocean' theme (#345B7E). Implement a responsive sidebar, a main content area, and core components like 'Property Search', 'Violation Tracking', and 'Executive Overview'. Ensure 100% compliance with Hawaii accessibility standards and include a persistent navigation system."

---

## 📊 2. Custom Reporting Module
**Objective**: Build a self-service reporting engine with drag-and-drop capabilities.

> "Implement a 'Custom Reports' module that allows users to build reports visually. 
> - **Reports Dashboard**: List existing reports with search/filter.
> - **Report Builder**: Use `@dnd-kit` for a drag-and-drop field selector. Use a visual filter builder for AND/OR grouping of conditions.
> - **Report Preview**: Create a paginated table view with client-side export to CSV (using `papaparse`) and PDF (using `jspdf` and `html2canvas`).
> - **Data Sources**: Include mock schemas for TVR Registry, Enforcement Cases, and Financials."

---

## 🤖 3. TVR/STR Chatbot
**Objective**: Implement a domain-specific chatbot with strict scope enforcement.

> "Add a persistent, floating chatbot to the application that specializes in Hawaii County TVR (Transient Vacation Rental) and STR (Short-Term Rental) regulations.
> - **Scope Control**: The bot must only answer questions related to Ordinance 25-50 and TVR registration. Polite referral for out-of-scope questions.
> - **UI**: Implement a floating chat button, a scrollable message list with typing indicators, and a responsive input field.
> - **Knowledge Base**: Pre-program answers for registration fees, NCUC requirements, and enforcement penalties."

---

## 📍 4. Requirement Coverage & Navigation
**Objective**: Reach 100% functional coverage and fix routing edge cases.

> "Update the application to achieve 100% requirement coverage based on the compliance matrix.
> - **Navigation Fixes**: Ensure `/case/new` is matched correctly before `/case/:id`. Link resolved violations to Property Details instead of investigation forms.
> - **NCUC Management**: Build a dashboard for tracking Nonconforming Use Certificates (KFR-2J).
> - **Violation Catalog**: Implement a searchable reference for operational standards and penalty schedules (KFR-2K).
> - **Public Portal**: Add a 'Public Property Search' and a 'Resources & FAQ' section for owner compliance."

---

## 🔐 5. RBAC & Departmental Refinement
**Objective**: Implement Role-Based Access Control and tailored views for different departments.

> "Implement an RBAC system with roles for Admin, Finance, Planning, Legal, and Public.
> - **Sidebar Enrichment**: Hide/show menu items based on the active role.
> - **Departmental Overviews**: Create specific 'Overview' components for Finance (revenue focus), Planning (zoning focus), and Legal (litigation focus).
> - **Route Protection**: Wrap sensitive routes in a role-based guard."

---

## 📝 6. Validation & Demo Prompts
**Objective**: Questions used to verify the chatbot's knowledge and system logic.

> "Verify the system with the following scenarios:
> 1. 'How do I register a TVR in Hawaii County?' (Expected: Step-by-step guide)
> 2. 'What happens if I get a violation notice?' (Expected: Penalty and appeal info)
> 3. 'Where do I get a building permit?' (Expected: Out-of-scope redirection)
> 4. Test the Map cluster navigation to ensuring it filters the Property Registry correctly."
