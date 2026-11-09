'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  GraduationCap,
  Headphones,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { AdminMonitorData, AdminWorkerProgress } from '@/lib/server/types';

interface Props {
  data: AdminMonitorData;
}

function formatDate(isoString: string | null) {
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

export function ProgressMonitorView({ data }: Props) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedWorkerId, setExpandedWorkerId] = useState<string | null>(null);

  const toggleWorker = (id: string) => {
    setExpandedWorkerId((prev) => (prev === id ? null : id));
  };

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return data.workers.filter((worker) => {
      // Search filter
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        worker.user.name.toLowerCase().includes(term) ||
        worker.user.email.toLowerCase().includes(term) ||
        worker.user.phone.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      // Department filter
      if (departmentFilter !== 'all') {
        const hasDept = worker.enrollments.some(
          (e) => e.courseSlug === departmentFilter
        );
        if (!hasDept) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const hasStatus = worker.enrollments.some(
          (e) => e.status === statusFilter
        );
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [data.workers, search, departmentFilter, statusFilter]);

  // CSV export handler
  const handleExportCsv = () => {
    const headers = [
      'Worker Name',
      'Email',
      'Phone',
      'Role',
      'Registered At',
      'Course',
      'Lessons Completed',
      'Total Lessons',
      'Progress %',
      'Status',
      'Certificate Code',
      'Exam Score',
      'Last Active At',
    ];

    const rows: string[][] = [];

    data.workers.forEach((worker) => {
      if (worker.enrollments.length === 0) {
        rows.push([
          `"${worker.user.name}"`,
          `"${worker.user.email}"`,
          `"${worker.user.phone}"`,
          `"${worker.user.role}"`,
          `"${formatDate(worker.user.createdAt)}"`,
          '"Not enrolled"',
          '0',
          '0',
          '0%',
          '"Not started"',
          '""',
          '""',
          `"${formatDate(worker.lastActiveAt)}"`,
        ]);
      } else {
        worker.enrollments.forEach((e) => {
          rows.push([
            `"${worker.user.name}"`,
            `"${worker.user.email}"`,
            `"${worker.user.phone}"`,
            `"${worker.user.role}"`,
            `"${formatDate(worker.user.createdAt)}"`,
            `"${e.courseTitle}"`,
            String(e.completedCount),
            String(e.totalLessons),
            `${e.percent}%`,
            `"${e.status}"`,
            `"${e.certificate?.code ?? ''}"`,
            `"${e.certificate?.score ?? e.attempt?.score ?? ''}"`,
            `"${formatDate(worker.lastActiveAt)}"`,
          ]);
        });
      }
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `urpn-worker-progress-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------- TOP SUMMARY METRICS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Total Workers</span>
            <Users className="h-4 w-4 text-cream-400" />
          </div>
          <p className="mt-2 text-[26px] font-semibold text-cream-50">
            {data.summary.totalWorkers}
          </p>
          <p className="mt-1 text-xs text-cream-500">Registered members &amp; staff</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Active Enrollments</span>
            <BookOpen className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 text-[26px] font-semibold text-cream-50">
            {data.summary.activeEnrolled}
          </p>
          <p className="mt-1 text-xs text-cream-500">Department tracks joined</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Completed Tracks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-[26px] font-semibold text-cream-50">
            {data.summary.completedTracks}
          </p>
          <p className="mt-1 text-xs text-cream-500">100% lessons finished</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-cream-500">
            <span className="mono-label !text-[9.5px]">Certificates</span>
            <Award className="h-4 w-4 text-gold-400" />
          </div>
          <p className="mt-2 text-[26px] font-semibold text-cream-50">
            {data.summary.totalCertificates}
          </p>
          <p className="mt-1 text-xs text-cream-500">Official badges earned</p>
        </div>
      </div>

      {/* ---------------------------------------------------- SEARCH & FILTERS BAR */}
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by worker name, email, or phone..."
              className="w-full rounded-xl border border-line bg-canvas/60 py-2.5 pl-10 pr-4 text-xs text-cream-100 placeholder:text-cream-600 focus:border-accent focus:outline-none"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-line bg-canvas/60 px-3 py-2.5 text-xs text-cream-200 focus:border-accent focus:outline-none"
            >
              <option value="all">All Tracks & Departments</option>
              <option value="aesthetics">Aesthetics</option>
              <option value="pr">Public Relations</option>
              <option value="protocol">Protocol</option>
              <option value="ushering">Ushering</option>
              <option value="technical">Technical</option>
              <option value="media">Media</option>
              <option value="choir">Choir / Worship</option>
              <option value="welfare">Welfare & Hospitality</option>
              <option value="prayer">Prayer</option>
              <option value="counseling">Counseling</option>
              <option value="transport">Transport</option>
              <option value="medical">Medical (Medics)</option>
              <option value="security">Security</option>
              <option value="children">Children/Teens</option>
              <option value="publications">Publications & Academic</option>
              <option value="drama">Drama & Demonstration</option>
              <option value="ministers">Ministers Training</option>
              <option value="pastors">Pastors Training</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-line bg-canvas/60 px-3 py-2.5 text-xs text-cream-200 focus:border-accent focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="certified">Certified</option>
              <option value="exam_ready">Exam Ready (100%)</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn btn-secondary btn-sm gap-1.5 text-xs"
              title="Download CSV report of all workers' progress"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- WORKERS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="mono-label !text-[9.5px]">
            Workers Progress ({filteredWorkers.length})
          </p>
          <span className="font-mono text-[10px] text-cream-500">
            Click any row to inspect lesson-by-lesson progress &amp; class notes
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-10 text-center">
            <Users className="mx-auto h-8 w-8 text-cream-600" />
            <p className="mt-3 text-sm font-medium text-cream-200">No workers match your filter</p>
            <p className="mt-1 text-xs text-cream-500">Try clearing your search or selecting a different department.</p>
          </div>
        ) : (
          filteredWorkers.map((worker) => {
            const isExpanded = expandedWorkerId === worker.user.id;
            const primaryEnrollment = worker.enrollments[0];

            return (
              <div
                key={worker.user.id}
                className="overflow-hidden rounded-2xl border border-line bg-surface transition-colors"
              >
                {/* Worker Row Trigger */}
                <button
                  type="button"
                  onClick={() => toggleWorker(worker.user.id)}
                  className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:justify-between hover:bg-cream-50/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink font-semibold text-sm">
                      {worker.user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-cream-50 text-[13.5px] truncate">
                          {worker.user.name}
                        </p>
                        <span className="rounded-full border border-line bg-canvas px-2 py-0.2 font-mono text-[8.5px] uppercase tracking-wider text-cream-400">
                          {worker.user.role}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-cream-500 truncate">
                        {worker.user.email} · {worker.user.phone || 'No phone'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                    {/* Course & Progress summary */}
                    {primaryEnrollment ? (
                      <div className="text-left sm:text-right min-w-[140px]">
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="font-medium text-cream-200 text-xs">
                            {primaryEnrollment.courseCode} · {primaryEnrollment.courseTitle}
                          </span>
                          <span className="font-mono text-[10px] text-gold-400 font-semibold">
                            {primaryEnrollment.percent}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas sm:w-36 ml-auto">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${primaryEnrollment.percent}%` }}
                          />
                        </div>
                        <p className="mt-1 font-mono text-[9.5px] text-cream-500">
                          {primaryEnrollment.completedCount} / {primaryEnrollment.totalLessons} lessons done
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-cream-500 italic">Not enrolled yet</span>
                    )}

                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      {primaryEnrollment?.status === 'certified' ? (
                        <span className="flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold-300">
                          <Award className="h-3 w-3" />
                          Certified
                        </span>
                      ) : primaryEnrollment?.status === 'exam_ready' ? (
                        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Exam Ready
                        </span>
                      ) : primaryEnrollment ? (
                        <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cream-400">
                          In Progress
                        </span>
                      ) : null}

                      <ChevronDown
                        className={`h-4 w-4 text-cream-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Details: Breakdown per lesson & notes */}
                {isExpanded && (
                  <div className="border-t border-line-soft bg-canvas/40 p-5 space-y-6">
                    {worker.enrollments.length === 0 ? (
                      <p className="text-xs text-cream-500 italic">
                        This member registered on {formatDate(worker.user.createdAt)} but has not yet enrolled in any department track.
                      </p>
                    ) : (
                      worker.enrollments.map((enr) => (
                        <div key={enr.courseSlug} className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line-soft pb-3">
                            <div>
                              <h4 className="text-sm font-semibold text-cream-100 flex items-center gap-2">
                                <span>{enr.courseTitle}</span>
                                <span className="font-mono text-xs text-gold-400">({enr.courseCode})</span>
                              </h4>
                              <p className="mt-0.5 text-xs text-cream-500">
                                Enrolled: {formatDate(enr.enrolledAt)}
                                {enr.conditionsAcceptedAt && ' · Department conditions accepted'}
                              </p>
                            </div>

                            {enr.certificate && (
                              <Link
                                href={`/portal/certificates/${enr.certificate.code}`}
                                className="btn btn-secondary btn-sm gap-1.5 text-xs shrink-0"
                              >
                                <Award className="h-3.5 w-3.5 text-gold-400" />
                                <span>Certificate: {enr.certificate.code} ({enr.certificate.score}%)</span>
                              </Link>
                            )}
                          </div>

                          {/* Lesson-by-lesson checklist */}
                          <div className="space-y-2">
                            <p className="mono-label !text-[8.5px] text-cream-400">
                              Content Completion Breakdown
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {enr.lessons.map((lesson, idx) => (
                                <div
                                  key={lesson.id}
                                  className={`rounded-xl border p-3 text-xs transition-colors ${
                                    lesson.isCompleted
                                      ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
                                      : 'border-line-soft bg-surface/40 opacity-70'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 min-w-0">
                                      <span
                                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                          lesson.isCompleted
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'border border-cream-700 bg-canvas text-cream-600'
                                        }`}
                                      >
                                        {lesson.isCompleted ? (
                                          <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                                        ) : (
                                          <Lock className="h-2 w-2" />
                                        )}
                                      </span>
                                      <div className="min-w-0">
                                        <p className="font-medium text-cream-100 truncate">
                                          {idx + 1}. {lesson.title}
                                        </p>
                                        <p className="mt-0.5 font-mono text-[9.5px] text-cream-500">
                                          {lesson.isCompleted
                                            ? `Completed on ${formatDate(lesson.completedAt)}`
                                            : 'Pending completion'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Student's recorded notes */}
                                  {lesson.notes && (
                                    <div className="mt-2.5 rounded-lg border border-line-soft bg-surface/80 p-2.5">
                                      <p className="font-mono text-[8.5px] uppercase tracking-wider text-gold-400 flex items-center gap-1">
                                        <BookOpen className="h-2.5 w-2.5" />
                                        Student Class Notes
                                      </p>
                                      <p className="mt-1 text-xs text-cream-300 leading-relaxed italic whitespace-pre-wrap font-sans">
                                        “{lesson.notes}”
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
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

