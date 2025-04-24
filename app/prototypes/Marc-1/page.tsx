"use client";

import Link from 'next/link';
import styles from './styles.module.css';
import { spaceGrotesk } from '@/app/fonts';
import { useState } from 'react';

export default function Marc1Prototype() {
  const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const teamMembers = [
    { name: 'Sofia Davis', email: 'sofia@example.com', role: 'Owner' },
    { name: 'Jackson Lee', email: 'jackson@example.com', role: 'Member' },
    { name: 'Isabella Nguyen', email: 'isabella@example.com', role: 'Member' },
  ];

  const payments = [
    { status: 'Success', email: 'keri99@example.com', amount: '$316.00' },
    { status: 'Processing', email: 'monserrat44@example.com', amount: '$837.00' },
    { status: 'Success', email: 'abe45@example.com', amount: '$242.00' },
  ];

  return (
    <div className={`${styles.container} ${spaceGrotesk.className}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ←
        </Link>
        <h1 className={styles.pageTitle}>Googie meets shadcn</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Team Members Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Team Members</h2>
            <p className={styles.cardDescription}>Invite your team members to collaborate.</p>
            <div className={styles.teamList}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <div className={styles.avatar}>{member.name[0]}</div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{member.name}</div>
                    <div className={styles.memberEmail}>{member.email}</div>
                  </div>
                  <div className={styles.memberRole}>{member.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payments Table Card - Now spans 2 columns */}
          <div className={`${styles.card} ${styles.tableCard} ${styles.spanTwo}`}>
            <h2 className={styles.cardTitle}>Payments</h2>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div>Status</div>
                <div>Email</div>
                <div>Amount</div>
              </div>
              {payments.map((payment, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.status}>{payment.status}</div>
                  <div>{payment.email}</div>
                  <div>{payment.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>June 2023</h2>
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div>
                <div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className={styles.calendarDays}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className={styles.calendarDay}>{i + 1}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Cookie Settings Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Cookie Settings</h2>
            <p className={styles.cardDescription}>Manage your cookie settings here.</p>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div>
                  <div className={styles.settingTitle}>Strictly Necessary</div>
                  <div className={styles.settingDescription}>These cookies are essential to use the website.</div>
                </div>
                <div className={styles.switch}></div>
              </div>
              <div className={styles.settingItem}>
                <div>
                  <div className={styles.settingTitle}>Functional Cookies</div>
                  <div className={styles.settingDescription}>Allow for personalized functionality.</div>
                </div>
                <div className={styles.switch}></div>
              </div>
            </div>
          </div>

          {/* Chat Interface Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Messages</h2>
            <div className={styles.chat}>
              <div className={styles.message}>
                <div className={styles.messageContent}>Hi, how can I help you today?</div>
              </div>
              <div className={`${styles.message} ${styles.userMessage}`}>
                <div className={styles.messageContent}>I'm having trouble with my account.</div>
              </div>
              <div className={styles.messageInput}>
                <input type="text" placeholder="Type your message..." className={styles.input} />
                <button className={styles.sendButton}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}