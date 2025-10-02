import React, { useState, useEffect } from "react";
import type { Candidate } from "../services/seed/candidateSeed";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Job } from "../services/seed/jobsSeed";
// Applications are now handled by candidates
import JobModal from "../components/Jobs/JobModal";
import { DeleteConfirmationModal } from "../components/Jobs/DeleteConfirmationModal";
import { toast } from "react-hot-toast";

interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  pageSize: number;
}

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const fetchJobs = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<JobsResponse>("/jobs", {
        params: {
          search,
          status: statusFilter,
          page: currentPage,
          pageSize,
        },
      });

      // Show all jobs (no company filtering)
      setJobs(response.data.data);
      setTotalJobs(response.data.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage, pageSize]);

  const fetchCandidates = React.useCallback(async () => {
    try {
      const response = await axios.get("/candidates");
      setCandidates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
    }
  }, []);

  // Applications are now handled by candidates, so we don't need this function

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, [search, statusFilter, currentPage, pageSize, fetchJobs, fetchCandidates]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleArchive = async (job: Job) => {
    try {
      await axios.patch(`/jobs/${job.id}`, {
        status: job.status === "active" ? "archived" : "active",
      });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      // Note: We'll need to add DELETE endpoint to handlers
      await axios.delete(`/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      fetchJobs();
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error deleting job");
    }
  };

  const getApplicationsForJob = (jobId: string) => {
    return candidates.filter((candidate) => candidate.jobId === jobId);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newJobs = [...jobs];
    const [movedJob] = newJobs.splice(fromIndex, 1);
    newJobs.splice(toIndex, 0, movedJob);

    // Optimistic update
    setJobs(newJobs);

    try {
      await axios.patch(`/jobs/${movedJob.id}/reorder`, {
        fromOrder: fromIndex,
        toOrder: toIndex,
      });
    } catch (error) {
      console.error("Error reordering jobs:", error);
      // Rollback on failure
      fetchJobs();
    }
  };

  const handleDragStart = (e: React.DragEvent, job: Job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (!draggedJob) return;

    const draggedIndex = jobs.findIndex((job) => job.id === draggedJob.id);
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedJob(null);
      return;
    }

    handleReorder(draggedIndex, targetIndex);
    setDraggedJob(null);
  };

  const totalPages = Math.ceil(totalJobs / pageSize);

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:gap-0 gap-4 justify-between items-center w-full">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Job Management</h1>
              <p className="text-slate-600 text-base sm:text-lg">
                Create and manage your job postings with ease
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-3 items-stretch sm:items-center">
              <button
                onClick={() => navigate("/dashboard/candidates")}
                className="group bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 w-full sm:w-auto"
              >
                <svg
                  className="w-5 h-5 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span className="font-medium">View Candidates</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group gradient-primary text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 w-full sm:w-auto"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-semibold">Create Job</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title or tags..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No jobs found
              </h3>
              <p className="text-slate-600 mb-6">
                {search || statusFilter
                  ? "Try adjusting your search criteria."
                  : "Get started by creating your first job posting."}
              </p>
              {!search && !statusFilter && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Create Your First Job
                </button>
              )}
            </div>
          ) : (
          <>
            <div className="p-0 sm:p-6 flex flex-col gap-4">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, job)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`group bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-4 sm:p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 cursor-move transform hover:scale-[1.02] ${
                    draggedJob?.id === job.id ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0">
                    <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                      <div className="text-slate-400 cursor-move group-hover:text-slate-600 transition-colors mt-1">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              job.status === "active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium text-slate-600">
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                          {job.description.substring(0, 200)}...
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Applications Count */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">
                              {getApplicationsForJob(job.id).length} applications
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Posted 2 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:ml-6 w-full md:w-auto">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/candidates?job=${job.id}`)
                        }
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        View Candidates
                      </button>
                      <button
                        onClick={() => setEditingJob(job)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(job)}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        {job.status === "active" ? "Archive" : "Unarchive"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setJobToDelete(job);
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-6 border-t border-slate-200/50 bg-slate-50/50 rounded-b-2xl">
                <div className="flex sm:flex-row sm:gap-0 gap-5 flex-col items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                    <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, totalJobs)}</span> of{" "}
                    <span className="font-semibold text-slate-900">{totalJobs}</span> jobs
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-all duration-200 ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : "border-slate-300 hover:bg-white hover:shadow-md bg-white/80 backdrop-blur-sm"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Job Modal */}
      {(showCreateModal || editingJob) && (
        <JobModal
          job={editingJob}
          onClose={() => {
            setShowCreateModal(false);
            setEditingJob(null);
          }}
          onSave={() => {
            fetchJobs();
            setShowCreateModal(false);
            setEditingJob(null);
          }}
        />
      )}

        {/* Delete Job Modal */}
        {showDeleteModal && jobToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDelete(jobToDelete.id)}
            jobTitle={jobToDelete.title}
          />
        )}
      </div>
    </div>
  );
};

export default Jobs;
