'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  ExternalLink,
  GraduationCap,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type {
  AdminWorkforceDashboardData,
  WorkforceApplicant,
  PublicUser,
} from '@/lib/server/types';
import { WORKFORCE_DEPARTMENTS } from '@/lib/courses';

interface Props {
  data: AdminWorkforceDashboardData;
  currentUser: PublicUser;
}

function formatDate(isoString: string | null | undefined) {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(isoString: string | null | undefined) {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function cleanPhoneForWhatsApp(phone: string): string {
  // Remove non-numeric characters, ensure country code
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }
  return digits;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function AdminWorkforceView({ data, currentUser }: Props) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'progress' | 'score' | 'name'>('newest');
  const [expandedApplicantId, setExpandedApplicantId] = useState<string | null>(null);

  const toggleApplicant = (id: string) => {
    setExpandedApplicantId((prev) => (prev === id ? null : id));
  };

  // Filter and sort applicants
  const filteredApplicants = useMemo(() => {
    return data.applicants
      .filter((applicant) => {
        // Search query
        const term = search.toLowerCase().trim();
        if (term) {
          const matchName = applicant.user.name.toLowerCase().includes(term);
          const matchEmail = applicant.user.email.toLowerCase().includes(term);
          const matchPhone = applicant.user.phone.toLowerCase().includes(term);
          const matchCert = applicant.departments.some(
            (d) => d.certificate?.code.toLowerCase().includes(term)
          );
          const matchAddress = applicant.user.address?.toLowerCase().includes(term) ?? false;
          if (!matchName && !matchEmail && !matchPhone && !matchCert && !matchAddress) {
            return false;
          }
        }

        // Department filter
        if (departmentFilter !== 'all') {
          if (departmentFilter === 'unassigned') {
            if (applicant.totalDepartments > 0) return false;
          } else {
            const hasDept = applicant.departments.some(
              (d) => d.courseSlug === departmentFilter
            );
            if (!hasDept) return false;
          }
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (applicant.overallStatus !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return Date.parse(b.user.createdAt) - Date.parse(a.user.createdAt);
        }
        if (sortBy === 'oldest') {
          return Date.parse(a.user.createdAt) - Date.parse(b.user.createdAt);
        }
        if (sortBy === 'progress') {
          const maxA = Math.max(0, ...a.departments.map((d) => d.percent));
          const maxB = Math.max(0, ...b.departments.map((d) => d.percent));
          return maxB - maxA;
        }
        if (sortBy === 'score') {
          return (b.highestScore ?? -1) - (a.highestScore ?? -1);
        }
        if (sortBy === 'name') {
          const nameA = a.user.name || a.user.email;
          const nameB = b.user.name || b.user.email;
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [data.applicants, search, departmentFilter, statusFilter, sortBy]);

  // CSV export handler
  const handleExportCsv = () => {
    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Address',
      'Birthday',
      'User ID',
      'Registered At',
      'Departments Applied',
      'Conditions Accepted Date',
      'Overall Status',
      'Training Progress %',
      'Lessons Completed',
      'Total Lessons',
      'Exam Status',
      'Exam Score %',
      'Certificate Code',
      'Last Active At',
    ];

    const rows: string[][] = [];

    data.applicants.forEach((applicant) => {
      const u = applicant.user;
      const deptNames = applicant.departments.map((d) => d.shortTitle).join('; ') || 'None selected';
      const condDates = applicant.departments
        .map((d) => (d.conditionsAcceptedAt ? formatDate(d.conditionsAcceptedAt) : 'Pending'))
        .join('; ') || 'N/A';
      const maxPercent = applicant.departments.length > 0
        ? Math.max(...applicant.departments.map((d) => d.percent))
        : 0;
      const totalCompleted = applicant.departments.reduce((sum, d) => sum + d.completedCount, 0);
      const totalLessons = applicant.departments.reduce((sum, d) => sum + d.totalLessons, 0);
      const certCodes = applicant.departments
        .map((d) => d.certificate?.code)
        .filter(Boolean)
        .join('; ') || 'None';
      const examScores = applicant.departments
        .map((d) => (d.attempt?.score !== null && d.attempt?.score !== undefined ? `${d.attempt.score}%` : 'Not taken'))
        .join('; ') || 'N/A';

      rows.push([
        `"${u.name || 'Not set'}"`,
        `"${u.email}"`,
        `"${u.phone || 'N/A'}"`,
        `"${u.address || 'N/A'}"`,
        `"${u.birthday || 'N/A'}"`,
        `"${u.id}"`,
        `"${formatDate(u.createdAt)}"`,
        `"${deptNames}"`,
        `"${condDates}"`,
        `"${applicant.overallStatus}"`,
        `"${maxPercent}%"`,
        String(totalCompleted),
        String(totalLessons),
        `"${applicant.overallStatus === 'certified' ? 'Passed' : applicant.overallStatus === 'exam_ready' ? 'Ready' : 'Incomplete'}"`,
        `"${applicant.highestScore !== null ? `${applicant.highestScore}%` : examScores}"`,
        `"${certCodes}"`,
        `"${formatDate(applicant.latestActivityAt)}"`,
      ]);
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `urpn-workforce-applicants-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = search || departmentFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------- TOP HERO / HEADER */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="mono-label text-gold-300">Church Leadership &amp; Administration</span>
            </div>

            <h1 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-cream-50 sm:text-[34px] lg:text-[38px]">
              Workforce Administration Dashboard
            </h1>

            <p className="mt-2 text-[13px] leading-relaxed text-cream-400">
              Applications, department choices, course progress, and certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="btn btn-secondary btn-sm"
              title="Download entire workforce roster as CSV"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export Roster (CSV)
            </button>
            <Link
              href="/portal/monitor"
              className="btn btn-primary btn-sm"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Live Progress Monitor
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- SUMMARY METRICS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: Total Applicants */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Applicants</span>
            <Users className="h-4 w-4 text-cream-400" />
          </div>
          <p className="mt-2 text-[28px] font-semibold text-cream-50">
            {data.summary.totalApplicants}
          </p>
        </div>

        {/* Card 2: Assigned Departments */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Departments Chosen</span>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 text-[28px] font-semibold text-cream-50">
            {data.summary.withDepartments}
          </p>
        </div>

        {/* Card 3: In Active Training */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">In Training</span>
            <Headphones className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-[28px] font-semibold text-cream-50">
            {data.summary.inTraining}
          </p>
        </div>

        {/* Card 4: Certified & Exam Ready */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Certified · Exam Ready</span>
            <Award className="h-4 w-4 text-gold-400" />
          </div>
          <p className="mt-2 text-[28px] font-semibold text-cream-50">
            {data.summary.certified + data.summary.examReady}
          </p>
          <p className="mt-1 text-xs text-cream-500">
            {data.summary.certified} certified · {data.summary.examReady} ready
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- SEARCH & CONTROLS */}
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by applicant name, email, phone, or certificate code..."
              className="w-full rounded-xl border border-line bg-canvas/60 py-2.5 pl-10 pr-4 text-xs text-cream-100 placeholder:text-cream-600 focus:border-accent focus:outline-none"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-line bg-canvas/60 px-3 py-2.5 text-xs text-cream-200 focus:border-accent focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="unassigned">Awaiting Selection</option>
              {WORKFORCE_DEPARTMENTS.map((dept) => (
                <option key={dept.slug} value={dept.slug}>
                  {dept.shortTitle} Department
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-line bg-canvas/60 px-3 py-2.5 text-xs text-cream-200 focus:border-accent focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="certified">Certified (Passed Exam)</option>
              <option value="exam_ready">Exam Ready (100% lessons)</option>
              <option value="in_progress">In Training (Active)</option>
              <option value="applied">Just Applied (New)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-line bg-canvas/60 px-3 py-2.5 text-xs text-cream-200 focus:border-accent focus:outline-none"
            >
              <option value="newest">Newest Applicants</option>
              <option value="oldest">Oldest Applicants</option>
              <option value="progress">Highest Progress %</option>
              <option value="score">Highest Exam Score</option>
              <option value="name">Name (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-canvas/40 px-3 py-2.5 text-xs text-cream-400 transition-colors hover:text-cream-50"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3 text-[11px] text-cream-500">
          <span>
            Showing <strong className="font-semibold text-cream-200">{filteredApplicants.length}</strong> of{' '}
            {data.applicants.length} workforce applicants
          </span>
          {hasActiveFilters && (
            <span className="text-gold-400">Filters currently applied</span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- APPLICANTS ROSTER */}
      <div className="space-y-4">
        {filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-cream-600" />
            <h3 className="mt-3 text-[16px] font-semibold text-cream-100">
              No workforce applicants found
            </h3>
            <p className="mt-1 text-xs text-cream-500">
              {hasActiveFilters
                ? 'Try adjusting your search query, department, or status filter.'
                : 'When new members register on the workforce page, their applications will appear here.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-secondary btn-sm mt-4 inline-flex"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredApplicants.map((applicant) => {
            const isExpanded = expandedApplicantId === applicant.user.id;
            const primaryDept = applicant.departments[0];
            const maxPercent = applicant.departments.length > 0
              ? Math.max(...applicant.departments.map((d) => d.percent))
              : 0;
            const cert = applicant.departments.find((d) => d.certificate)?.certificate;
            const phone = applicant.user.phone;
            const waNumber = phone ? cleanPhoneForWhatsApp(phone) : '';

            return (
              <div
                key={applicant.user.id}
                className="overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:border-line-strong"
              >
                {/* ----------------- SUMMARY ROW ----------------- */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left: Applicant identity & Contact */}
                    <div className="flex items-start gap-4">
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/15 font-mono text-sm font-semibold text-accent">
                        {initials(applicant.user.name || applicant.user.email)}
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[16px] font-semibold text-cream-50">
                            {applicant.user.name || (
                              <span className="italic text-cream-500">Profile incomplete</span>
                            )}
                          </h3>

                          {/* Overall status badge */}
                          {applicant.overallStatus === 'certified' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/[0.1] px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Certified Worker
                            </span>
                          )}
                          {applicant.overallStatus === 'exam_ready' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/[0.1] px-2 py-0.5 text-[11px] font-medium text-gold-300">
                              <Sparkles className="h-3 w-3" />
                              Exam Ready
                            </span>
                          )}
                          {applicant.overallStatus === 'in_progress' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/[0.1] px-2 py-0.5 text-[11px] font-medium text-sky-400">
                              <Headphones className="h-3 w-3" />
                              In Training
                            </span>
                          )}
                          {applicant.overallStatus === 'applied' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-cream-400">
                              <UserPlus className="h-3 w-3" />
                              Just Applied
                            </span>
                          )}
                        </div>

                        {/* Contact details */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cream-400">
                          <a
                            href={`mailto:${applicant.user.email}`}
                            className="inline-flex items-center gap-1 text-cream-300 hover:text-accent hover:underline"
                            title="Send email"
                          >
                            <Mail className="h-3.5 w-3.5 text-cream-500" />
                            {applicant.user.email}
                          </a>

                          {phone ? (
                            <div className="inline-flex items-center gap-2">
                              <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-1 text-cream-300 hover:text-accent hover:underline"
                                title="Call phone"
                              >
                                <Phone className="h-3.5 w-3.5 text-cream-500" />
                                {phone}
                              </a>
                              {waNumber && (
                                <a
                                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                                    `Hello ${applicant.user.name || ''}, greetings from the Unique Revival Prayer Network leadership team regarding your workforce application.`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/25"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-cream-600">
                              <Phone className="h-3.5 w-3.5" />
                              No phone on file
                            </span>
                          )}

                          <span className="font-mono text-[11px] text-cream-600">
                            Applied {formatDate(applicant.user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle / Right: Department & Progress summary */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      {/* Department tags */}
                      <div className="min-w-[140px]">
                        <span className="mono-label !text-[9px] text-cream-500">Department</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {applicant.departments.length > 0 ? (
                            applicant.departments.map((d) => (
                              <span
                                key={d.courseSlug}
                                className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas/60 px-2 py-0.5 font-mono text-xs text-cream-200"
                              >
                                <ShieldCheck className="h-3 w-3 text-gold-400" />
                                {d.shortTitle}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/[0.05] px-2 py-0.5 text-xs text-amber-300">
                              Awaiting selection
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full max-w-[150px] sm:w-[130px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] text-cream-400">Progress</span>
                          <span className="font-mono text-[11px] font-medium text-cream-200">
                            {maxPercent}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-cream-50/[0.06]">
                          <div
                            className={`h-full transition-all duration-300 ${
                              maxPercent === 100
                                ? 'bg-emerald-400'
                                : maxPercent > 0
                                  ? 'bg-accent'
                                  : 'bg-transparent'
                            }`}
                            style={{ width: `${maxPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Certificate code or exam score */}
                      {cert && (
                        <div className="hidden sm:block">
                          <span className="mono-label !text-[9px] text-emerald-400">Certificate</span>
                          <Link
                            href={`/verify/${cert.code}`}
                            target="_blank"
                            className="mt-1 flex items-center gap-1 font-mono text-xs text-gold-300 hover:underline"
                          >
                            <span>{cert.code}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}

                      {/* Expand / Collapse toggle */}
                      <button
                        type="button"
                        onClick={() => toggleApplicant(applicant.user.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-line bg-canvas/60 px-3 py-2 text-xs font-medium text-cream-300 transition-colors hover:border-accent hover:text-cream-50"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Application'}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ----------------- EXPANDED DOSSIER PANEL ----------------- */}
                {isExpanded && (
                  <div className="border-t border-line bg-canvas-deep/60 p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                      {/* Column 1: Personal Dossier */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-line-soft pb-2">
                          <User className="h-4 w-4 text-gold-400" />
                          <h4 className="text-[13px] font-semibold text-cream-100 uppercase tracking-wide">
                            Applicant Dossier
                          </h4>
                        </div>

                        <dl className="space-y-3 text-xs">
                          <div>
                            <dt className="text-cream-500">Full Name</dt>
                            <dd className="mt-0.5 font-medium text-cream-100">
                              {applicant.user.name || 'Not provided yet'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Official Email</dt>
                            <dd className="mt-0.5 font-mono text-cream-200">
                              {applicant.user.email}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Phone Number</dt>
                            <dd className="mt-0.5 font-mono text-cream-200">
                              {applicant.user.phone || 'Not provided yet'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Residential Address</dt>
                            <dd className="mt-0.5 text-cream-200">
                              {applicant.user.address || 'Not provided in profile'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Birthday / Date of Birth</dt>
                            <dd className="mt-0.5 text-cream-200">
                              {applicant.user.birthday ? formatDate(applicant.user.birthday) : 'Not provided in profile'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Application Date</dt>
                            <dd className="mt-0.5 font-mono text-cream-300">
                              {formatDateTime(applicant.user.createdAt)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">Last Portal Activity</dt>
                            <dd className="mt-0.5 font-mono text-cream-300">
                              {formatDateTime(applicant.latestActivityAt)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-cream-500">User Identification</dt>
                            <dd className="mt-0.5 font-mono text-[10px] text-cream-600">
                              {applicant.user.id}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Column 2: Department Selection & Conditions */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-line-soft pb-2">
                          <ShieldCheck className="h-4 w-4 text-accent" />
                          <h4 className="text-[13px] font-semibold text-cream-100 uppercase tracking-wide">
                            Department Requirements
                          </h4>
                        </div>

                        {applicant.departments.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-line p-4 text-center">
                            <p className="text-xs text-cream-400">
                              This member registered but has not yet accepted conditions for a specific ministry department.
                            </p>
                          </div>
                        ) : (
                          applicant.departments.map((dept) => {
                            const deptConfig = WORKFORCE_DEPARTMENTS.find(
                              (d) => d.slug === dept.courseSlug
                            );
                            return (
                              <div
                                key={dept.courseSlug}
                                className="rounded-xl border border-line bg-surface/80 p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-cream-100 text-xs">
                                    {dept.courseTitle}
                                  </span>
                                  <span className="font-mono text-[10px] text-gold-400">
                                    {dept.courseCode}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>
                                    Conditions accepted on{' '}
                                    {formatDate(dept.conditionsAcceptedAt || dept.enrolledAt)}
                                  </span>
                                </div>

                                {deptConfig && deptConfig.conditions.length > 0 && (
                                  <div className="mt-3 border-t border-line-soft pt-2.5">
                                    <p className="mono-label !text-[8.5px] text-cream-500">
                                      Acknowledged Prerequisites:
                                    </p>
                                    <ul className="mt-1.5 space-y-1 text-[11px] text-cream-300">
                                      {deptConfig.conditions.map((cond, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                          <Check className="h-3 w-3 shrink-0 text-emerald-400 mt-0.5" />
                                          <span>{cond}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Column 3: Examination & Certification */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-line-soft pb-2">
                          <Award className="h-4 w-4 text-gold-400" />
                          <h4 className="text-[13px] font-semibold text-cream-100 uppercase tracking-wide">
                            Exam &amp; Certification
                          </h4>
                        </div>

                        {applicant.departments.length === 0 ? (
                          <p className="text-xs text-cream-500">Awaiting department enrollment.</p>
                        ) : (
                          applicant.departments.map((dept) => (
                            <div
                              key={dept.courseSlug}
                              className="rounded-xl border border-line bg-surface/80 p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-cream-400">Training Progress:</span>
                                <span className="font-mono font-medium text-cream-100">
                                  {dept.completedCount} / {dept.totalLessons} lessons ({dept.percent}%)
                                </span>
                              </div>

                              {/* Exam Attempt */}
                              <div className="rounded-lg border border-line-soft bg-canvas/40 p-3 text-xs">
                                <span className="text-cream-500 block text-[10px] uppercase font-mono">
                                  Final Exam Result
                                </span>
                                {dept.attempt ? (
                                  <div className="mt-1 flex items-center justify-between">
                                    <span
                                      className={`font-semibold ${
                                        dept.attempt.passed
                                          ? 'text-emerald-400'
                                          : 'text-amber-400'
                                      }`}
                                    >
                                      {dept.attempt.passed ? 'PASSED' : 'NEEDS RETAKE'} · {dept.attempt.score}%
                                    </span>
                                    <span className="font-mono text-[10px] text-cream-500">
                                      {formatDate(dept.attempt.submittedAt)}
                                    </span>
                                  </div>
                                ) : dept.percent === 100 ? (
                                  <span className="mt-1 block font-medium text-gold-300">
                                    Exam Unlocked · Ready to take
                                  </span>
                                ) : (
                                  <span className="mt-1 block text-cream-500">
                                    Complete lessons to unlock exam
                                  </span>
                                )}
                              </div>

                              {/* Certificate */}
                              {dept.certificate ? (
                                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] p-3 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-emerald-300">
                                      Official Certificate Issued
                                    </span>
                                    <Link
                                      href={`/verify/${dept.certificate.code}`}
                                      target="_blank"
                                      className="inline-flex items-center gap-1 font-mono text-[11px] text-gold-300 hover:underline"
                                    >
                                      <span>{dept.certificate.code}</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </div>
                                  <p className="mt-1 text-[10px] text-cream-400">
                                    Score: {dept.certificate.score}% · Issued {formatDate(dept.certificate.issuedAt)}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[11px] text-cream-500">
                                  Certificate awarded automatically upon scoring 80%+ on the exam.
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Lesson Completion Breakdown */}
                    {applicant.departments.some((d) => d.lessons.length > 0) && (
                      <div className="mt-8 border-t border-line-soft pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="h-4 w-4 text-cream-400" />
                          <h5 className="text-xs font-semibold text-cream-200 uppercase tracking-wide">
                            Curriculum Lessons Breakdown &amp; Notes
                          </h5>
                        </div>

                        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          {applicant.departments.flatMap((d) =>
                            d.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className={`rounded-xl border p-3 text-xs transition-colors ${
                                  lesson.isCompleted
                                    ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
                                    : 'border-line bg-surface/50'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {lesson.isCompleted ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                    ) : (
                                      <Clock className="h-3.5 w-3.5 shrink-0 text-cream-600" />
                                    )}
                                    <span
                                      className={`font-medium ${
                                        lesson.isCompleted ? 'text-cream-100' : 'text-cream-400'
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>
                                </div>

                                {lesson.completedAt && (
                                  <p className="mt-1 font-mono text-[9.5px] text-cream-500">
                                    Finished {formatDate(lesson.completedAt)}
                                  </p>
                                )}

                                {lesson.notes && (
                                  <div className="mt-2 rounded bg-canvas/60 p-2 text-[10.5px] text-cream-300 italic border border-line-soft">
                                    &ldquo;{lesson.notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
