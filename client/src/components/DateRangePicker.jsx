import React, { useState } from 'react';

export default function DateRangePicker({ start, end, onStartChange, onEndChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(start);
    const [tempEnd, setTempEnd] = useState(end);

    const formatDateRange = () => {
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }
        return 'Add dates';
    };

    const handleApply = () => {
        onStartChange(tempStart);
        onEndChange(tempEnd);
        setIsOpen(false);
    };

    const handleClear = () => {
        setTempStart('');
        setTempEnd('');
        onStartChange('');
        onEndChange('');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Main Input */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-left text-gray-700 bg-white"
            >
                <div className="flex items-center gap-2">
                    <svg className="text-gray-400" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2m0 6v2h10V8H7z" />
                    </svg>
                    <span className={start && end ? 'text-gray-900' : 'text-gray-500'}>
                        {formatDateRange()}
                    </span>
                </div>
            </button>

            {/* Calendar Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border z-50 p-6">
                        <div className="space-y-4">
                            {/* Check-in */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check in</label>
                                <input
                                    type="date"
                                    className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-gray-700"
                                    value={tempStart}
                                    onChange={e => setTempStart(e.target.value)}
                                />
                            </div>

                            {/* Check-out */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check out</label>
                                <input
                                    type="date"
                                    className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 text-gray-700"
                                    value={tempEnd}
                                    onChange={e => setTempEnd(e.target.value)}
                                    min={tempStart}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    className="flex-1 px-4 py-2.5 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-xl transition font-medium"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
