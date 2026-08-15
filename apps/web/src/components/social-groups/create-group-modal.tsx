'use client';

import React, { useState } from 'react';
import { SocialAccountDetail, SocialGroupDetail } from '@omnipost/types';

interface CreateGroupModalProps {
  accounts: SocialAccountDetail[];
  onClose: () => void;
  onSaveGroup: (group: SocialGroupDetail) => void;
  onConnectNewAccount: () => void;
}

export function CreateGroupModal({
  accounts,
  onClose,
  onSaveGroup,
  onConnectNewAccount,
}: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedAccountIds(accounts.map((a) => a.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (selectedAccountIds.length === 0) {
      alert('Select at least one social account for this group');
      return;
    }

    const newGroup: SocialGroupDetail = {
      id: `group_${Date.now()}`,
      workspaceId: 'ws_active',
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      socialAccountIds: selectedAccountIds,
      accounts: accounts.filter((a) => selectedAccountIds.includes(a.id)),
      createdAt: new Date().toISOString(),
    };

    onSaveGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Create Social Channel Group / Bundle
            </h3>
            <p className="text-xs text-slate-500">
              Group multiple accounts together (e.g. 2 YouTube channels + Instagram + TikTok) to publish with one click.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Group Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gaming Network, Tech Outlets, EU Campaign Channels"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of channels in this publishing bundle"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Account Checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Channels for Group ({selectedAccountIds.length} Selected)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={onConnectNewAccount}
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  + Add Channel Afresh
                </button>
              </div>
            </div>

            {accounts.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium">
                No connected accounts found. Click "+ Add Channel Afresh" above to connect accounts!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                {accounts.map((acc) => {
                  const isChecked = selectedAccountIds.includes(acc.id);
                  return (
                    <label
                      key={acc.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/80 text-slate-900 shadow-xs'
                          : 'border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAccount(acc.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <div className="truncate">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {acc.platformName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{acc.accountName}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/20 active:scale-98 transition-all"
            >
              Save Channel Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
