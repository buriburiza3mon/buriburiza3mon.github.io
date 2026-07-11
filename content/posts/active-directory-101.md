---
title: "Active Directory 101: The Keys to the Enterprise Kingdom"
date: 2026-07-11T23:50:00+05:30
draft: false
tags: ["blue-team", "red-team", "active-directory", "infrastructure"]
---

If you walk into any enterprise environment today, from a mid-sized local business to a Fortune 500 titan, you will almost certainly find Active Directory (AD) running the show. 

From an administrative standpoint, AD is a centralized identity management system. But from an offensive security perspective, AD is the central nervous system of the target network. If you want to understand lateral movement, privilege escalation, and domain dominance, you have to understand how Active Directory thinks.

This guide breaks down the core architecture, the protocols that drive it, and why it represents the single largest attack surface in modern enterprise environments.

## 1. What is Active Directory?
At its core, Active Directory Domain Services (AD DS) is a massive, hierarchical database. It stores information about every single object on a network—users, computers, servers, printers, and file shares—and enforces security policies regarding who is allowed to access what.

Before AD, networks were generally unorganized workgroups. If you had 50 computers, an administrator had to manage 50 separate local accounts. AD centralizes this. A user logs in once to the "Domain," and AD dictates what they can do across all 50 computers.

The server that hosts this database and processes all these authentication requests is called a **Domain Controller (DC)**. The DC is the absolute holy grail of any red team engagement.

## 2. The Architecture: Forests, Trees, and Domains
Active Directory is structured like a massive, interconnected root system. To navigate it, you need to understand its logical boundaries.

### The Domain
A Domain is the fundamental logical grouping of objects in AD. It shares a common database and security policies. Think of it as a single company office. Domains are usually named using a DNS structure, like `corp.target.local` or `emea.target.com`.

### The Tree
If an organization grows, it might need multiple domains. A Tree is a collection of one or more Domains that share a contiguous namespace. For example, if the root domain is `target.com`, it might have child domains named `us.target.com` and `uk.target.com`. These are all part of the same Tree.

### The Forest
The Forest is the outermost security boundary in Active Directory. It is a collection of one or more Trees that do *not* share a contiguous namespace but share a common global catalog and schema. For example, if `Target Corp` buys `Acme Corp`, they might link `target.com` and `acme.local` into a single Forest. By default, the security boundary stops at the Forest level—an admin in Forest A has no power in Forest B unless explicitly granted.

### Trusts
How do users in `us.target.com` access a file share in `uk.target.com`? Through Trusts. A Trust is a logical bridge between domains or forests that dictates authentication flow. 
*   **Transitive Trusts:** If A trusts B, and B trusts C, then A automatically trusts C. (This is the default for domains in the same forest).
*   **One-Way vs. Two-Way Trusts:** In a one-way trust, Domain A trusts Domain B (meaning users in B can access resources in A, but not vice versa). 

*Red Team Note: Trusts are a primary vector for lateral movement. Compromising a child domain often provides a pathway to compromise the parent domain root via trust abuse (like the Golden Ticket / SID History attacks).*

## 3. The Building Blocks: Objects and OUs
Inside a domain, the database is populated by Objects. Every object has attributes (like a user's email, password hash, or department).

*   **Users:** Accounts for human employees.
*   **Computers:** Yes, machines have their own accounts and passwords (which they rotate automatically, typically every 30 days).
*   **Groups:** Collections of users. The most famous is `Domain Admins`, which grants ultimate control over the domain.
*   **Service Principal Names (SPNs):** Unique identifiers for services running on servers. (Highly relevant for Kerberoasting attacks).

### Organizational Units (OUs)
If you just threw 10,000 users into a domain, it would be a nightmare to manage. OUs are essentially folders used to organize objects. An admin might create an OU for "HR Department" and another for "IT Department." 

OUs are critical because they are the smallest unit to which you can assign administrative delegation or apply a Group Policy Object (GPO).

## 4. The Rules of the Realm: Group Policy (GPO)
Group Policy is the mechanism administrators use to manage the working environments of user and computer accounts. It is essentially a set of rules pushed out by the Domain Controller to the network.

Through GPOs, an admin can:
*   Disable the use of USB drives across the entire company.
*   Force all computers to use a specific desktop wallpaper.
*   Deploy software automatically.
*   Configure local Administrator passwords on all workstations.

*Red Team Note: Because GPOs are files stored on the Domain Controller (in the SYSVOL share) and pulled down by client machines, they are notoriously abused. If an attacker gains the ability to edit a GPO, they can instantly push malware or a scheduled task to every single machine in the organization.*

## 5. How AD Thinks: Authentication Protocols
Active Directory does not use just one language to authenticate users; it relies on a few core protocols. Understanding the flaws in these protocols is the foundation of network penetration testing.

### NTLM (New Technology LAN Manager)
NTLM is the legacy authentication protocol for Windows. It operates on a challenge-response mechanism. 
1. The client requests access.
2. The server sends a random challenge.
3. The client encrypts the challenge using the MD4 hash of the user's password and sends it back.
4. The server verifies the calculation.

**The Flaw:** Because NTLM uses the user's password hash directly in the authentication process, attackers don't need the plaintext password. If they can extract the NTLM hash from memory, they can just pass the hash directly to the server to authenticate. It is also highly susceptible to Relay attacks (NTLM Relaying).

### Kerberos
Kerberos is the modern, default authentication protocol for Active Directory. It was designed to fix the security holes of NTLM by removing the need to ever send a password (or a password hash) over the network. Instead, it relies on tickets.

Think of Kerberos like going to an amusement park:
1.  **Authentication Service (AS):** You show your ID (password hash) at the front gate. The gate attendant gives you a wristband. This wristband is the **Ticket Granting Ticket (TGT)**.
2.  **Ticket Granting Service (TGS):** You want to ride the rollercoaster (access a file server). You show your TGT wristband to a ticket booth, and they give you a specific ticket just for the rollercoaster. This is the **TGS Ticket**.
3.  **Application Server:** You hand the TGS ticket to the rollercoaster operator, and they let you on.

**The Flaw:** Kerberos is heavily reliant on encryption keys derived from password hashes. If a service account has a weak password, an attacker can request a TGS ticket for that service, take it offline, and crack it to reveal the password (Kerberoasting). If an attacker compromises the Domain Controller, they can steal the master key used to sign all TGTs (the `krbtgt` hash) and forge their own wristbands forever (Golden Ticket attack).

### LDAP (Lightweight Directory Access Protocol)
While Kerberos handles authentication, LDAP is how clients *query* the Active Directory database. When you open Outlook and search for a colleague's name, your computer is making an LDAP query to the Domain Controller. 

Tools like **BloodHound** abuse LDAP. Any standard, unprivileged user can make LDAP queries. BloodHound asks the DC for the permissions of every user, group, and computer, and graphs it out to reveal hidden attack paths to Domain Admin.

## 6. The Ultimate Attack Surface
Active Directory was designed in the late 1990s. Its primary design goal was administrative convenience and uptime, not zero-trust security. By default, AD is incredibly trusting. 

When you combine decades of technical debt, legacy protocols like NTLM that are kept alive for "backwards compatibility," and the sheer complexity of managing thousands of overlapping permissions, misconfigurations are inevitable. 

Modern enterprise breaches rarely rely on zero-day exploits. They rely on understanding how Active Directory functions better than the network administrators do.

In future posts, we will dive into specific AD exploitation techniques, starting with LLMNR/NBT-NS poisoning and Kerberoasting.
