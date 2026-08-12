import { create } from 'zustand';
import { TokenPair, UserSummary, WorkspaceSummary } from '@omnipost/types';

interface AuthState {
  user: UserSummary | null;
  tokens: TokenPair | null;
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary | null;
  setAuth: (user: UserSummary, tokens: TokenPair, defaultWorkspace: WorkspaceSummary) => void;
  setWorkspaces: (workspaces: WorkspaceSummary[]) => void;
  setActiveWorkspace: (workspace: WorkspaceSummary) => void;
  updateUser: (userPartial: Partial<UserSummary>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  workspaces: [],
  activeWorkspace: null,
  setAuth: (user, tokens, defaultWorkspace) =>
    set({
      user,
      tokens,
      activeWorkspace: defaultWorkspace,
      workspaces: [defaultWorkspace],
    }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  updateUser: (userPartial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userPartial } : null,
    })),
  logout: () =>
    set({
      user: null,
      tokens: null,
      workspaces: [],
      activeWorkspace: null,
    }),
}));
