# ZAJEL Digital Logistics Platform  
**Functional Requirements & Screen Definition Document**

---

## 1. System Overview

The ZAJEL Digital Logistics Platform is an integrated, enterprise-grade logistics management ecosystem designed to manage the complete shipment lifecycle from customer inquiry to delivery execution, financial settlement, and performance reporting.

The system consists of the following core components:

1. Customer Web Portal  
2. Operations Management System (OMS)  
3. Driver Mobile Application  
4. Finance Management System  
5. Reporting & Analytics Platform  
6. System Administration & Governance  

---

## 2. System Objectives

- Enable customers to self-create and track shipment inquiries.
- Provide operations teams full operational control and SLA monitoring.
- Enable drivers to bid, accept, and execute shipments efficiently.
- Maintain transparent financial tracking for payables and receivables.
- Provide real-time dashboards, analytics, and compliance reporting.
- Ensure enterprise-grade access control, auditability, and security.

---

## 3. User Roles & Access Control

### 3.1 User Roles

| Role | Description |
|--------|--------------|
| Customer | Creates shipment inquiries and tracks shipments |
| Operations User | Manages inquiries, drivers, trips, and SLA |
| Operations Manager | Oversees approvals, escalations, and exceptions |
| Finance User | Manages billing, payables, receivables |
| Admin / Super Admin | Manages configuration, roles, security, masters |

---

### 3.2 Role-Based Menu Visibility

#### Customer Menu
- Dashboard  
- Create Shipment Inquiry  
- My Inquiries  
- Quote Review  
- Notifications  
- Profile  
- Logout  

#### Operations User Menu
- Dashboard  
- Inquiry Management  
- SLA Monitoring  
- Pricing & Quote  
- Driver Bidding  
- Driver Assignment  
- Trip Monitoring  
- Customer Approvals  
- Notifications  
- Logout  

#### Operations Manager Menu
- Dashboard  
- Inquiry Management  
- SLA Monitoring  
- Pricing Approval  
- Escalation Management  
- Reports  
- Trip Monitoring  
- Notifications  
- Logout  

#### Finance User Menu
- Dashboard  
- Driver Payables  
- Customer Invoicing  
- Receivables  
- Financial Reports  
- Integrations  
- Logout  

#### Admin Menu
- Dashboard  
- User & Role Management  
- Master Data Management  
- System Configuration  
- Integration Management  
- Audit Logs & Security  
- Reports  
- Logout  

---

## 4. High-Level Process Flow

Customer → Shipment Inquiry → OMS Review → Pricing → Driver Bidding → Driver Assignment → Trip Execution → POD → Finance Settlement → Reporting

---

# MODULE 1: CUSTOMER WEB PORTAL

---

## 1. Login

**Purpose:** Secure authentication

**Fields:**
- Email / Mobile
- Password
- OTP login option
- Forgot Password
- Register link

---

## 2. OTP Verification

**Fields:**
- OTP input
- Timer
- Resend OTP
- Verify button

---

## 3. Customer Registration

**Fields:**
- Company name
- Trade license number
- VAT number
- Contact person details
- Address
- Upload:
  - Trade License
  - VAT Certificate

**Status:** Pending Verification

---

## 4. Customer Dashboard

**Widgets:**
- Total inquiries
- Active shipments
- Pending actions
- Completed shipments

**Table:**
- Recent inquiries list

---

## 5. Profile Management

**Fields:**
- Company profile
- Contact info
- Uploaded documents
- Verification status

---

## 6. Create Shipment Inquiry (Multi-step)

### Step 1: Shipment Details
- Cargo type
- Weight
- Dimensions
- Quantity
- Special instructions

### Step 2: Route Details
- Origin
- Destination
- Cross-border flag

### Step 3: Date & Preferences
- Pickup date
- Delivery date
- Vehicle preference

### Step 4: Document Upload
- Supporting documents

### Step 5: Review & Submit

---

## 7. Inquiry Listing

**Columns:**
- Inquiry ID
- Route
- Status
- Quote status
- Actions

---

## 8. Inquiry Detail & Tracking

**Sections:**
- Shipment info
- Documents
- Timeline tracker

---

## 9. Quote Review & Acceptance

**Fields:**
- Price breakdown
- Validity
- Accept / Reject / Request Callback

---

# MODULE 2: OPERATIONS MANAGEMENT SYSTEM (OMS)

---

## 1. OMS Login

---

## 2. OMS Dashboard

**Widgets:**
- New inquiries
- SLA timers
- Active trips
- Delays
- Driver availability

---

## 3. Inquiry Management

**Columns:**
- Inquiry ID
- Customer
- Status
- SLA timer
- Assigned driver
- Actions

---

## 4. Inquiry Detail (Ops View)

**Sections:**
- Customer info
- Shipment info
- Documents
- SLA tracker
- Internal remarks
- Status history

---

## 5. SLA Configuration

**Fields:**
- SLA type
- Time thresholds
- Escalation rules

---

## 6. Delay Reason Master

**Fields:**
- Reason code
- Reason text
- Status
- CRUD actions

---

## 7. Rate Card Management

**Fields:**
- Route
- Vehicle type
- Base price
- Additional charges
- Versioning
- Activation control

---

## 8. Pricing & Approval

**Fields:**
- System suggested price
- Override input
- Threshold indicator
- Approval workflow

---

## 9. Driver Bidding Control

**Fields:**
- Publish inquiry
- Bid deadline
- Live bid monitoring

---

## 10. Driver Assignment

**Fields:**
- Driver list
- Ratings
- Bid comparison
- Assign / Reassign

---

## 11. Trip Monitoring Dashboard

**Widgets:**
- Live trip tracking
- Delay alerts
- Route deviation alerts

---

## 12. Customer Registration Approval

**Fields:**
- Company details
- Documents
- Approve / Reject
- Remarks

---

# MODULE 3: DRIVER MOBILE APPLICATION

---

## 1. App Launch & Language Selection

---

## 2. Driver Login (OTP Based)

---

## 3. Driver Registration & Onboarding

### Step 1: Personal Details  
### Step 2: Vehicle Details  
### Step 3: KYC Upload  

Documents:
- Emirates ID
- Driving License
- Mulkiya

---

## 4. OCR Review & Confirmation

---

## 5. KYC Status Tracking

---

## 6. Home Dashboard

**Widgets:**
- Active trips
- Available bids
- Earnings
- Pending payments

---

## 7. Shipment Notification

---

## 8. Bid Submission

---

## 9. Assigned Trip Detail

---

## 10. Pre-Trip Checklist

---

## 11. Active Trip Tracking (GPS)

---

## 12. Delay & Exception Reporting

---

## 13. Proof of Pickup

---

## 14. Proof of Delivery (POD)

---

## 15. Wallet & Payment Dashboard

---

## 16. Notifications Center

---

## 17. Support & Help Desk

---

## 18. Settings & Logout

---

# MODULE 4: FINANCE MANAGEMENT

---

## 1. Finance Dashboard

**Widgets:**
- Payables summary
- Receivables summary
- Overdue alerts

---

## 2. Driver Ledger

**Columns:**
- Trip ID
- Advance
- Balance
- Paid
- Pending
- Status

---

## 3. Payment Processing

**Fields:**
- Driver
- Amount
- Mode
- Reference no
- Submit payment

---

## 4. Customer Invoicing

**Fields:**
- Customer
- Shipment reference
- Tax
- Total amount
- Generate invoice

---

## 5. Receivables Management

**Reports:**
- Ageing analysis
- SOA

---

## 6. Financial Integration

**Sections:**
- SAP sync status
- Wallet reconciliation
- Error logs

---

# MODULE 5: REPORTING & ANALYTICS

---

## 1. Reports Dashboard

---

## 2. Operational Reports

---

## 3. SLA Reports

---

## 4. Driver Performance Reports

---

## 5. Financial Reports

---

## 6. Export & Scheduling

---

# MODULE 6: SYSTEM ADMINISTRATION & GOVERNANCE

---

## 1. User & Role Management

---

## 2. Master Data Management

**Masters:**
- Location
- Vehicle
- Cargo type
- Document type
- SLA types

---

## 3. Notification Template Management

---

## 4. System Configuration

**Controls:**
- OTP settings
- SLA timers
- File size limits
- Feature toggles

---

## 5. Integration Configuration

---

## 6. Audit Logs & Security Monitoring

---

# 7. Non-Functional Requirements

- Role-based access control (RBAC)
- Multi-language support
- High availability
- Secure authentication
- Complete audit trail
- Scalable microservice architecture

---

# 8. Compliance & Security

- OTP-based authentication
- Document encryption
- Audit logs
- Session monitoring
- Data privacy compliance

---

# 9. Conclusion

This document defines a complete enterprise-grade logistics platform for ZAJEL, covering operational workflows, user experience, system governance, compliance, and scalability.
