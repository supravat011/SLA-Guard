import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Edit2, X, Lock } from 'lucide-react';
import { api } from '../services/api';

interface Comment {
    id: number;
    ticket_id: number;
    user_id: number;
    user_name: string;
    content: string;
    is_internal: boolean;
    created_at: string;
    updated_at: string;
}

interface TicketCommentsProps {
    ticketId: number;
    userRole: 'MANAGER' | 'TECHNICIAN' | 'SENIOR_TECHNICIAN' | 'USER';
}

const TicketComments: React.FC<TicketCommentsProps> = ({ ticketId, userRole }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        loadComments();
    }, [ticketId]);

    const loadComments = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://localhost:8000/comments/ticket/${ticketId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://localhost:8000/comments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    content: newComment,
                    is_internal: isInternal,
                }),
            });

            if (response.ok) {
                setNewComment('');
                setIsInternal(false);
                loadComments();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = async (commentId: number) => {
        if (!editContent.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://localhost:8000/comments/${commentId}?content=${encodeURIComponent(editContent)}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setEditingId(null);
                setEditContent('');
                loadComments();
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://localhost:8000/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                loadComments();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

    return (
        <div className="space-y-4">
            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No comments yet</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`p-4 rounded-lg border ${comment.is_internal
                                    ? 'bg-amber-500/5 border-amber-500/30'
                                    : 'bg-space-800/50 border-space-border'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{comment.user_name}</span>
                                    {comment.is_internal && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                                            <Lock className="w-3 h-3" />
                                            Internal
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </span>
                                    {comment.user_id === currentUserId && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingId(comment.id);
                                                    setEditContent(comment.content);
                                                }}
                                                className="p-1 text-slate-400 hover:text-brand-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingId === comment.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 bg-space-900 border border-space-border rounded-lg text-sm text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditComment(comment.id)}
                                            disabled={loading}
                                            className="px-3 py-1 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditContent('');
                                            }}
                                            className="px-3 py-1 bg-space-700 text-white text-sm rounded-lg hover:bg-space-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-300">{comment.content}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-space-border pt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 bg-space-800/50 border border-space-border rounded-lg text-sm text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none placeholder:text-slate-600"
                    rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        {userRole === 'MANAGER' && (
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isInternal}
                                    onChange={(e) => setIsInternal(e.target.checked)}
                                    className="w-4 h-4 rounded border-space-border bg-space-800 text-brand-500 focus:ring-brand-500"
                                />
                                <Lock className="w-4 h-4" />
                                Internal (Managers only)
                            </label>
                        )}
                    </div>
                    <button
                        onClick={handleAddComment}
                        disabled={loading || !newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketComments;
